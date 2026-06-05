/**
 * log_process_event — Append a single event to the course process log.
 *
 * Composite tool: thin wrapper over src/utils/process-log.ts. Adds:
 *   - Input validation (zod)
 *   - Workspace path validation
 *   - Automatic timestamp generation
 *   - Structured success/error response
 *
 * The underlying utility (`appendProcessEvent`) is also called directly by
 * `intelligent_save` when it produces files. This tool exposes the utility
 * to Claude Desktop so methodologies (e.g. post_lesson_auto) can log their
 * own events without re-implementing YAML serialisation.
 */

import { z } from 'zod';
import {
  appendProcessEvent,
  getProcessLogPath,
  type ProcessEvent,
  type ProcessEventType,
} from '../../utils/process-log.js';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

const PROCESS_EVENT_TYPES = [
  'planned',
  'taught',
  'reflected',
  'material_produced',
  'idea_captured',
  'deep_analysis',
  'student_voice_reflection',
  'course_planning_stage',
  'methodology_revised',
  'memo_created',
  'decision_made',
  'todo_created',
] as const satisfies readonly ProcessEventType[];

export const LogProcessEventInputSchema = z.object({
  workspace: z.string().min(1).describe('Workspace path (course root)'),
  type: z.enum(PROCESS_EVENT_TYPES).describe('Event type'),
  file: z.string().optional().describe('Single file path produced by this event'),
  files: z.array(z.string()).optional().describe('Multiple file paths produced by this event'),
  depth: z.string().optional().describe('Reflection depth: minimal, standard, or deep'),
  carry_forward_in: z.string().optional().describe('Path to file containing the carry-forward section'),
  trigger: z.string().optional().describe('What triggered the event (e.g. tool name, methodology name)'),
  lessons: z.array(z.number()).optional().describe('Lesson numbers referenced by this event'),
  lesson: z.number().optional().describe('Lesson number for grouping the log entry'),
  module: z.string().optional().describe('Module name for grouping the log entry'),
});

// ============================================================================
// TYPES
// ============================================================================

export interface LogProcessEventOutput {
  success: boolean;
  workspace: string;
  event: ProcessEvent;
  log_path: string;
  error?: string;
}

// ============================================================================
// MAIN
// ============================================================================

export async function logProcessEvent(input: unknown): Promise<LogProcessEventOutput> {
  const parseResult = LogProcessEventInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      workspace: '',
      event: { type: 'taught', timestamp: '' },
      log_path: '',
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const {
    workspace,
    type,
    file,
    files,
    depth,
    carry_forward_in,
    trigger,
    lessons,
    lesson,
    module,
  } = parseResult.data;

  // Workspace path validation
  const wsValidation = await validatePathInWorkspace(workspace);
  if (!wsValidation.valid) {
    return {
      success: false,
      workspace,
      event: { type, timestamp: '' },
      log_path: '',
      error: wsValidation.error || 'Workspace path invalid',
    };
  }

  const event: ProcessEvent = {
    type,
    timestamp: new Date().toISOString(),
    ...(file !== undefined && { file }),
    ...(files !== undefined && { files }),
    ...(depth !== undefined && { depth }),
    ...(carry_forward_in !== undefined && { carry_forward_in }),
    ...(trigger !== undefined && { trigger }),
    ...(lessons !== undefined && { lessons }),
  };

  const ok = await appendProcessEvent({
    workspace,
    event,
    ...(lesson !== undefined && { lesson }),
    ...(module !== undefined && { module }),
  });

  if (!ok) {
    return {
      success: false,
      workspace,
      event,
      log_path: getProcessLogPath(workspace),
      error: 'Failed to write process log (see server logs)',
    };
  }

  return {
    success: true,
    workspace,
    event,
    log_path: getProcessLogPath(workspace),
  };
}
