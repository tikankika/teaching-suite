/**
 * context_load — Load config context at session start.
 *
 * Mechanical tool: reads files, returns content.
 * Graceful degradation: never throws, returns null for missing files.
 *
 * Reads (course_v2: _system/config/, legacy: _config/):
 *   CLAUDE.md                 → orchestration instructions
 *   course_context.md         → course goals, mission, journal
 *   learning_objectives.yaml  → LO register (RFC-014)
 *   project_state.json        → process state (project root)
 *   sources.yaml              → tracked sources (project root)
 *
 * For course_v2, also reads latest process log entries.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { validatePathInWorkspace } from '../core/workspace.js';
import { readProcessLog, type ProcessLog } from '../../utils/process-log.js';
import { readFileOrNull } from '../../utils/file-helpers.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const ContextLoadInputSchema = z.object({
  workspace: z.string().min(1).describe('Project workspace path'),
});

// ============================================================================
// TYPES
// ============================================================================

export interface CarryForwardInfo {
  file: string;
  lesson: number | undefined;
  content: string;
}

export interface ContextLoadOutput {
  success: boolean;
  has_config: boolean;
  config_source: '_system/config' | '_config' | 'none';
  claude_md: string | null;
  course_context: string | null;
  learning_objectives: Record<string, unknown> | null;
  project_state: Record<string, unknown> | null;
  sources_summary: string | null;
  process_log_summary: string | null;
  carry_forward: CarryForwardInfo | null;
  error?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

// readFileOrNull imported from utils/file-helpers.ts

function summariseSources(yamlContent: string): string | null {
  try {
    const data = yaml.load(yamlContent) as Record<string, unknown> | null;
    if (!data) return null;

    const sources = data.sources as Record<string, unknown> | undefined;
    if (!sources || typeof sources !== 'object') {
      return 'No sources tracked.';
    }

    const entries = Object.entries(sources);
    if (entries.length === 0) {
      return 'No sources tracked.';
    }

    // Count by role
    const roleCounts: Record<string, number> = {};
    for (const [, value] of entries) {
      const role = (value as Record<string, unknown>)?.role;
      if (typeof role === 'string') {
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      }
    }

    const parts = Object.entries(roleCounts)
      .map(([role, count]) => `${role}: ${count}`)
      .join(', ');

    return `${entries.length} sources tracked (${parts}).`;
  } catch {
    return null;
  }
}

// ============================================================================
// MAIN
// ============================================================================

/**
 * Extract the ## Carry-forward section from a reflection file.
 * Returns the section content, or null if not found.
 */
function extractCarryForwardSection(fileContent: string): string | null {
  // Match ## Carry-forward with optional numbering (e.g. "## 6. Carry-forward")
  const pattern = /^##\s+(?:\d+\.\s*)?Carry[- ]?forward.*$/im;
  const match = fileContent.match(pattern);
  if (!match || match.index === undefined) return null;

  // Extract from heading to next ## heading or end of file
  const startIndex = match.index + match[0].length;
  const rest = fileContent.slice(startIndex);
  const nextHeading = rest.match(/^##\s+/m);
  const section = nextHeading && nextHeading.index !== undefined
    ? rest.slice(0, nextHeading.index)
    : rest;

  const trimmed = section.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Find the latest carry-forward from the process log and read its content.
 */
async function resolveCarryForward(
  log: ProcessLog,
  workspace: string
): Promise<CarryForwardInfo | null> {
  // Walk backwards to find the latest carry_forward_in
  for (let i = log.entries.length - 1; i >= 0; i--) {
    const entry = log.entries[i];
    for (const event of entry.events) {
      if (event.carry_forward_in) {
        const filePath = path.join(workspace, event.carry_forward_in);

        // Validate constructed path is within workspace
        const cfValidation = await validatePathInWorkspace(filePath);
        if (!cfValidation.valid) continue;

        const fileContent = await readFileOrNull(filePath);
        if (!fileContent) {
          return {
            file: event.carry_forward_in,
            lesson: entry.lesson,
            content: `[File not found: ${event.carry_forward_in}]`,
          };
        }

        const section = extractCarryForwardSection(fileContent);
        if (!section) {
          return {
            file: event.carry_forward_in,
            lesson: entry.lesson,
            content: '[No ## Carry-forward section found in file]',
          };
        }

        return {
          file: event.carry_forward_in,
          lesson: entry.lesson,
          content: section,
        };
      }
    }
  }

  return null;
}

/**
 * Summarise the process log for session-start context.
 * Shows event counts and activity overview.
 */
function summariseProcessLog(log: ProcessLog): string | null {
  if (!log.entries || log.entries.length === 0) return null;

  // Count events
  const eventCounts: Record<string, number> = {};
  for (const entry of log.entries) {
    for (const event of entry.events) {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    }
  }

  const countParts = Object.entries(eventCounts)
    .map(([type, count]) => `${type}: ${count}`)
    .join(', ');

  return `Activity: ${countParts}`;
}

export async function contextLoad(input: unknown): Promise<ContextLoadOutput> {
  const parseResult = ContextLoadInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      has_config: false,
      config_source: 'none',
      claude_md: null,
      course_context: null,
      learning_objectives: null,
      project_state: null,
      sources_summary: null,
      process_log_summary: null,
      carry_forward: null,
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { workspace } = parseResult.data;

  // Validate path
  const pathValidation = await validatePathInWorkspace(workspace);
  if (!pathValidation.valid) {
    return {
      success: false,
      has_config: false,
      config_source: 'none',
      claude_md: null,
      course_context: null,
      learning_objectives: null,
      project_state: null,
      sources_summary: null,
      process_log_summary: null,
      carry_forward: null,
      error: pathValidation.error || 'Path outside workspace',
    };
  }

  // Resolve config directory: _system/config/ first, fall back to _config/
  let configDir: string = '';
  let configSource: ContextLoadOutput['config_source'] = 'none';
  let hasConfig = false;

  const candidates: Array<{ dir: string; source: ContextLoadOutput['config_source'] }> = [
    { dir: path.join(workspace, '_system', 'config'), source: '_system/config' },
    { dir: path.join(workspace, '_config'), source: '_config' },
  ];

  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate.dir);
      if (stat.isDirectory()) {
        configDir = candidate.dir;
        configSource = candidate.source;
        hasConfig = true;
        break;
      }
    } catch {
      continue;
    }
  }

  // Read config files (only if a config dir was found)
  const claudeMd = hasConfig ? await readFileOrNull(path.join(configDir, 'CLAUDE.md')) : null;
  const courseContext = hasConfig ? await readFileOrNull(path.join(configDir, 'course_context.md')) : null;

  // Read learning objectives register (RFC-014)
  const loRaw = hasConfig ? await readFileOrNull(path.join(configDir, 'learning_objectives.yaml')) : null;
  let learningObjectives: Record<string, unknown> | null = null;
  if (loRaw) {
    try {
      learningObjectives = yaml.load(loRaw) as Record<string, unknown>;
    } catch {
      // Malformed YAML — skip
    }
  }

  // Read project root files
  const stateRaw = await readFileOrNull(path.join(workspace, 'project_state.json'));
  let projectState: Record<string, unknown> | null = null;
  if (stateRaw) {
    try {
      projectState = JSON.parse(stateRaw);
    } catch {
      // Malformed JSON — skip
    }
  }

  const sourcesRaw = await readFileOrNull(path.join(workspace, 'sources.yaml'));
  const sourcesSummary = sourcesRaw ? summariseSources(sourcesRaw) : null;

  // Read process log for course_v2 / v3 workspaces (any config source other than 'none')
  let processLogSummary: string | null = null;
  let carryForward: CarryForwardInfo | null = null;
  if (configSource === '_system/config' || configSource === '_config') {
    const log = await readProcessLog(workspace);
    processLogSummary = summariseProcessLog(log);
    carryForward = await resolveCarryForward(log, workspace);
  }

  return {
    success: true,
    has_config: hasConfig,
    config_source: configSource,
    claude_md: claudeMd,
    course_context: courseContext,
    learning_objectives: learningObjectives,
    project_state: projectState,
    sources_summary: sourcesSummary,
    process_log_summary: processLogSummary,
    carry_forward: carryForward,
  };
}
