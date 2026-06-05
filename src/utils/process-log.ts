/**
 * process-log — Append and read entries from the course process log.
 *
 * The process log is the pedagogical diary for a course run.
 * It records events (planned, reflected, material_produced, etc.)
 * grouped by date and optionally by lesson/module.
 *
 * Format: YAML (read-modify-write). One log per course run.
 * Location: _system/logs/process_log.yaml
 *
 * Design decisions: D-12 (schema), D-01 (carry-forward pointer).
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// TYPES
// ============================================================================

/**
 * All event types for the process log.
 * Defined in full — only a subset is wired to tools in Phase 0.
 */
export type ProcessEventType =
  | 'planned'
  | 'taught'
  | 'reflected'
  | 'material_produced'
  | 'idea_captured'
  | 'deep_analysis'
  | 'student_voice_reflection'
  | 'course_planning_stage'
  | 'methodology_revised'
  | 'memo_created'
  | 'decision_made'
  | 'todo_created';

export interface ProcessEvent {
  type: ProcessEventType;
  file?: string;
  files?: string[];
  timestamp: string;
  depth?: string;
  carry_forward_in?: string;
  trigger?: string;
  lessons?: number[];
}

export interface ProcessLogEntry {
  date: string;
  lesson?: number;
  module?: string;
  events: ProcessEvent[];
}

export interface ProcessLog {
  course_instance: string;
  entries: ProcessLogEntry[];
}

// ============================================================================
// PATHS
// ============================================================================

/**
 * Resolve the process log path for a workspace.
 * Checks _system/logs/ first (course_v2), falls back to activity_logs/ (legacy).
 */
export function getProcessLogPath(workspace: string): string {
  return path.join(workspace, '_system', 'logs', 'process_log.yaml');
}

// ============================================================================
// READ
// ============================================================================

/**
 * Read the process log. Returns empty log if file does not exist.
 */
export async function readProcessLog(workspace: string): Promise<ProcessLog> {
  const logPath = getProcessLogPath(workspace);

  try {
    const content = await fs.readFile(logPath, 'utf-8');
    const parsed = yaml.load(content) as ProcessLog | null;
    if (parsed && Array.isArray(parsed.entries)) {
      return parsed;
    }
    return { course_instance: parsed?.course_instance || '', entries: [] };
  } catch {
    return { course_instance: '', entries: [] };
  }
}

// ============================================================================
// APPEND
// ============================================================================

export interface AppendEventOptions {
  workspace: string;
  event: ProcessEvent;
  lesson?: number;
  module?: string;
}

/**
 * Append an event to the process log.
 *
 * Groups events by date. If a date entry already exists (optionally matching
 * lesson and module), the event is added to that entry. Otherwise a new
 * date entry is created.
 *
 * Non-fatal: returns false if the log file cannot be written.
 */
export async function appendProcessEvent(options: AppendEventOptions): Promise<boolean> {
  const { workspace, event, lesson, module } = options;
  const logPath = getProcessLogPath(workspace);

  try {
    const log = await readProcessLog(workspace);
    const today = event.timestamp.split('T')[0];

    // Find existing entry for today with same lesson/module
    let entry = log.entries.find(e =>
      e.date === today &&
      e.lesson === lesson &&
      e.module === module
    );

    if (!entry) {
      entry = {
        date: today,
        ...(lesson !== undefined && { lesson }),
        ...(module !== undefined && { module }),
        events: [],
      };
      log.entries.push(entry);
    }

    entry.events.push(event);

    // Ensure directory exists
    await fs.mkdir(path.dirname(logPath), { recursive: true });

    await fs.writeFile(
      logPath,
      yaml.dump(log, { indent: 2, lineWidth: 120, noRefs: true }),
      'utf-8'
    );

    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// INITIALISE
// ============================================================================

/**
 * Create an empty process log for a course.
 * Called by project_init for course_v2 type.
 */
export async function initialiseProcessLog(
  workspace: string,
  courseInstance: string
): Promise<void> {
  const logPath = getProcessLogPath(workspace);

  await fs.mkdir(path.dirname(logPath), { recursive: true });

  const emptyLog: ProcessLog = {
    course_instance: courseInstance,
    entries: [],
  };

  await fs.writeFile(
    logPath,
    yaml.dump(emptyLog, { indent: 2, lineWidth: 120 }),
    'utf-8'
  );
}
