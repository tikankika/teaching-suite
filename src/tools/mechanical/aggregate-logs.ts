/**
 * aggregate_logs — Read and normalize log files from Teaching Suite, QuestionForge,
 * and Assessment Suite in the workspace.
 *
 * Mechanical tool: finds JSONL log files, normalizes to common format,
 * returns unified chronological timeline. No domain logic.
 *
 * See docs/specs/aggregate-logs-spec.md for full specification.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const AggregateLogsInputSchema = z.object({
  workspace: z.string().min(1).describe('Project workspace path'),
  after: z.string().optional().describe('ISO datetime filter, inclusive'),
  before: z.string().optional().describe('ISO datetime filter, inclusive'),
  source: z
    .array(z.enum(['teacher', 'qf', 'as']))
    .optional()
    .describe('Filter by MCP source'),
  limit: z.number().int().min(1).max(1000).default(100).optional()
    .describe('Max entries returned (default: 100)'),
  offset: z.number().int().min(0).default(0).optional()
    .describe('Skip first N entries after filtering/sorting (for pagination)'),
  // Bridge methodology filters (PR-δ-a, 2026-05-04)
  content_types: z.array(z.string()).optional()
    .describe('Filter by tool/event/process — matches against entry.tool, entry.action, or entry.data.type. OR semantics across the list.'),
  window: z.string().optional()
    .describe('Relative time window like "21 days", "2 weeks", "1 month" — derives `after` from now(). Cannot be combined with `after`.'),
  course: z.string().optional()
    .describe('Filter by course name (case-insensitive substring match against the entry file path).'),
  topic: z.string().optional()
    .describe('Filter by topic (case-insensitive substring match against entry.summary or entry.data.topic).'),
});

export type AggregateLogsInput = z.infer<typeof AggregateLogsInputSchema>;

// ============================================================================
// TYPES
// ============================================================================

type SourceType = 'teacher' | 'qf' | 'as' | 'unknown';

interface LogEntry {
  ts: string;
  source: SourceType;
  session_id?: string;
  tool: string;
  action: string;
  summary?: string;
  data?: Record<string, unknown>;
  file: string;
}

export interface AggregateLogsOutput {
  success: boolean;
  entries: LogEntry[];
  total_found: number;
  sources_found: string[];
  files_read: string[];
  warnings?: string[];
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  '_archive',
  'dist',
  '.claude',
]);

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Parse a relative time window string like "21 days", "2 weeks", "3 months",
 * "6 hours" into milliseconds. Returns null if the format is unrecognised.
 *
 * Pure plumbing — no thresholds embedded. Methodology supplies the window
 * value as visible prose; this helper only converts the string to a number.
 */
export function parseWindow(window: string): number | null {
  const match = window.trim().match(/^(\d+)\s+(hour|day|week|month)s?$/i);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const ms = {
    hour: 3600 * 1000,
    day: 86400 * 1000,
    week: 7 * 86400 * 1000,
    month: 30 * 86400 * 1000, // approximate; sufficient for "recent runs" filters
  }[unit];
  return ms != null ? n * ms : null;
}

/**
 * Detect which MCP server produced a log file based on path and content.
 */
export function detectSource(
  filepath: string,
  firstEntry: Record<string, unknown>
): SourceType {
  // Path-based (strongest signal)
  if (filepath.includes('activity_logs/') || filepath.includes('activity_logs\\')) {
    return 'teacher';
  }
  if (filepath.endsWith('workflow_log.jsonl')) {
    return 'as';
  }
  if (
    filepath.endsWith('session.jsonl') &&
    (filepath.includes('/logs/') || filepath.includes('\\logs\\'))
  ) {
    if (firstEntry.mcp && String(firstEntry.mcp).startsWith('qf')) {
      return 'qf';
    }
  }

  // Content-based fallback
  if ('phase' in firstEntry && 'timestamp' in firstEntry) return 'as';
  if ('mcp' in firstEntry && String(firstEntry.mcp).startsWith('qf')) return 'qf';
  if ('session_id' in firstEntry && 'summary' in firstEntry) return 'teacher';

  return 'unknown';
}

/**
 * Normalize a timestamp to ISO format with Z suffix.
 * Returns null if timestamp is unparseable.
 */
function normalizeTimestamp(ts: unknown): string | null {
  if (typeof ts !== 'string' || ts.trim() === '') return null;

  const str = ts.trim();

  // Already has timezone info
  if (str.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(str)) {
    // Validate by parsing
    const d = new Date(str);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  // No timezone — assume UTC, append Z
  const d = new Date(str + 'Z');
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * Map a raw QF log entry to a normalized LogEntry.
 */
function mapQfEntry(
  raw: Record<string, unknown>,
  relPath: string
): LogEntry | null {
  const ts = normalizeTimestamp(raw.ts);
  if (!ts) return null;

  // Filter: skip debug level
  if (raw.level === 'debug') return null;

  const tool = String(raw.tool || 'unknown');
  const action = String(raw.event || 'unknown');

  return {
    ts,
    source: 'qf',
    session_id: raw.session_id ? String(raw.session_id) : undefined,
    tool,
    action,
    summary: `${tool}: ${action}`,
    data: raw.data as Record<string, unknown> | undefined,
    file: relPath,
  };
}

/**
 * Map a raw Assessment Suite log entry to a normalized LogEntry.
 */
function mapAsEntry(
  raw: Record<string, unknown>,
  relPath: string
): LogEntry | null {
  const ts = normalizeTimestamp(raw.timestamp);
  if (!ts) return null;

  const tool = String(raw.tool || 'unknown');
  const action = String(raw.action || 'unknown');
  const phase = raw.phase != null ? String(raw.phase) : undefined;

  const data: Record<string, unknown> = {};
  if (raw.input != null) data.input = raw.input;
  if (raw.output != null) data.output = raw.output;

  return {
    ts,
    source: 'as',
    tool,
    action,
    summary: phase ? `Phase ${phase}: ${action}` : `${tool}: ${action}`,
    data: Object.keys(data).length > 0 ? data : undefined,
    file: relPath,
  };
}

/**
 * Map a raw Teaching Suite log entry to a normalized LogEntry.
 */
function mapTeacherEntry(
  raw: Record<string, unknown>,
  relPath: string
): LogEntry | null {
  const ts = normalizeTimestamp(raw.ts);
  if (!ts) return null;

  const tool = String(raw.tool || 'unknown');
  const action = String(raw.action || 'unknown');

  const data: Record<string, unknown> = {};
  if (raw.output_path != null) data.output_path = raw.output_path;
  if (raw.duration_ms != null) data.duration_ms = raw.duration_ms;

  return {
    ts,
    source: 'teacher',
    session_id: raw.session_id ? String(raw.session_id) : undefined,
    tool,
    action,
    summary: raw.summary ? String(raw.summary) : undefined,
    data: Object.keys(data).length > 0 ? data : undefined,
    file: relPath,
  };
}

/**
 * Map a raw entry from an unknown source.
 */
function mapUnknownEntry(
  raw: Record<string, unknown>,
  relPath: string
): LogEntry | null {
  const ts = normalizeTimestamp(raw.ts || raw.timestamp);
  if (!ts) return null;

  return {
    ts,
    source: 'unknown',
    tool: String(raw.tool || 'unknown'),
    action: String(raw.action || raw.event || 'unknown'),
    data: raw,
    file: relPath,
  };
}

/**
 * Recursively find files matching JSONL log patterns in a directory.
 * Respects EXCLUDE_DIRS.
 */
async function findLogFiles(workspace: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      if (entry.isSymbolicLink()) continue; // defense-in-depth: skip symlinks

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.jsonl')) {
        const relPath = path.relative(workspace, fullPath);

        // Match log file patterns
        if (
          // QuestionForge: **/logs/session.jsonl
          (entry.name === 'session.jsonl' && relPath.includes('logs' + path.sep)) ||
          // Assessment Suite: **/workflow_log.jsonl
          entry.name === 'workflow_log.jsonl' ||
          // Teaching Suite: **/activity_logs/*.jsonl
          relPath.includes('activity_logs' + path.sep)
        ) {
          results.push(fullPath);
        }
      }
    }
  }

  await walk(workspace);
  return results;
}

/**
 * Parse a single JSONL file, detect source, and return normalized entries.
 */
async function parseLogFile(
  filePath: string,
  workspace: string,
  warnings: string[]
): Promise<{ entries: LogEntry[]; source: SourceType }> {
  const relPath = path.relative(workspace, filePath);
  const entries: LogEntry[] = [];

  let content: string;
  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    warnings.push(`Could not read file: ${relPath} (${err instanceof Error ? err.message : String(err)})`);
    return { entries: [], source: 'unknown' };
  }

  const lines = content.split('\n');

  // Detect source from first non-empty, valid JSON line
  let source: SourceType = 'unknown';
  let firstEntry: Record<string, unknown> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      firstEntry = JSON.parse(trimmed) as Record<string, unknown>;
      source = detectSource(relPath, firstEntry!);
      break;
    } catch {
      continue;
    }
  }

  if (!firstEntry) {
    warnings.push(`No valid JSON lines in: ${relPath}`);
    return { entries: [], source };
  }

  // Pick mapper based on source
  const mapper =
    source === 'qf' ? mapQfEntry :
    source === 'as' ? mapAsEntry :
    source === 'teacher' ? mapTeacherEntry :
    mapUnknownEntry;

  // Parse all lines
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(trimmed);
    } catch {
      warnings.push(`Malformed JSON at ${relPath}:${i + 1}`);
      continue;
    }

    const entry = mapper(raw, relPath);
    if (entry) {
      entries.push(entry);
    }
  }

  if (source === 'unknown') {
    warnings.push(`Unknown log source: ${relPath}`);
  }

  return { entries, source };
}

// ============================================================================
// MAIN
// ============================================================================

export async function aggregateLogs(input: unknown): Promise<AggregateLogsOutput> {
  const parseResult = AggregateLogsInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      entries: [],
      total_found: 0,
      sources_found: [],
      files_read: [],
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const {
    workspace,
    after: afterInput,
    before,
    source: sourceFilter,
    limit = 100,
    offset = 0,
    content_types,
    window,
    course,
    topic,
  } = parseResult.data;

  // Bridge filter compatibility: window and after are mutually exclusive.
  if (window && afterInput) {
    return {
      success: false,
      entries: [],
      total_found: 0,
      sources_found: [],
      files_read: [],
      error: 'Cannot combine `window` and `after` — choose one. `window` derives `after` from now().',
    };
  }

  // Derive `after` from `window` if window is set.
  let after = afterInput;
  if (window) {
    const ms = parseWindow(window);
    if (ms == null) {
      return {
        success: false,
        entries: [],
        total_found: 0,
        sources_found: [],
        files_read: [],
        error: `Invalid window format: "${window}". Expected "N hours", "N days", "N weeks", or "N months".`,
      };
    }
    after = new Date(Date.now() - ms).toISOString();
  }

  // Normalise content_types to lowercase Set for fast lookup; empty list = no filter.
  const contentTypesFilter =
    content_types && content_types.length > 0
      ? new Set(content_types.map((s) => s.toLowerCase()))
      : null;

  const courseFilter = course?.toLowerCase();
  const topicFilter = topic?.toLowerCase();

  // Validate workspace
  const pathValidation = await validatePathInWorkspace(workspace);
  if (!pathValidation.valid) {
    return {
      success: false,
      entries: [],
      total_found: 0,
      sources_found: [],
      files_read: [],
      error: pathValidation.error || 'Path outside workspace',
    };
  }

  const resolvedWorkspace = pathValidation.resolvedPath!;
  const warnings: string[] = [];
  const allEntries: LogEntry[] = [];
  const sourcesFound = new Set<string>();
  const filesRead: string[] = [];

  // Find all log files
  const logFiles = await findLogFiles(resolvedWorkspace);

  // Parse each file
  for (const filePath of logFiles) {
    const { entries, source } = await parseLogFile(filePath, resolvedWorkspace, warnings);
    const relPath = path.relative(resolvedWorkspace, filePath);
    filesRead.push(relPath);

    // Skip file if source filter is active and source doesn't match
    if (sourceFilter && sourceFilter.length > 0 && !sourceFilter.includes(source as 'teacher' | 'qf' | 'as')) {
      continue;
    }

    if (entries.length > 0) {
      sourcesFound.add(source);
    }

    // Apply date + bridge filters
    for (const entry of entries) {
      if (after && entry.ts < after) continue;
      if (before && entry.ts > before) continue;

      // content_types: match against tool, action, or data.type (OR semantics)
      if (contentTypesFilter) {
        const dataType =
          entry.data && typeof entry.data.type === 'string'
            ? (entry.data.type as string).toLowerCase()
            : null;
        const matched =
          contentTypesFilter.has(entry.tool.toLowerCase()) ||
          contentTypesFilter.has(entry.action.toLowerCase()) ||
          (dataType != null && contentTypesFilter.has(dataType));
        if (!matched) continue;
      }

      // course: substring match against entry file path
      if (courseFilter && !entry.file.toLowerCase().includes(courseFilter)) {
        continue;
      }

      // topic: substring match against summary or data.topic
      if (topicFilter) {
        const summary = entry.summary?.toLowerCase() ?? '';
        const dataTopic =
          entry.data && typeof entry.data.topic === 'string'
            ? (entry.data.topic as string).toLowerCase()
            : '';
        if (!summary.includes(topicFilter) && !dataTopic.includes(topicFilter)) {
          continue;
        }
      }

      allEntries.push(entry);
    }
  }

  // Sort chronologically (oldest first — timeline order)
  allEntries.sort((a, b) => a.ts.localeCompare(b.ts));

  const totalFound = allEntries.length;

  // Apply pagination
  const paginated = allEntries.slice(offset, offset + limit);

  return {
    success: true,
    entries: paginated,
    total_found: totalFound,
    sources_found: Array.from(sourcesFound).sort(),
    files_read: filesRead.sort(),
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
