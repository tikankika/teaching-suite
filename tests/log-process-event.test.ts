import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { logProcessEvent } from '../src/tools/composite/log-process-event.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';
import { initialiseProcessLog, readProcessLog } from '../src/utils/process-log.js';

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'log-process-event-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
  await fs.mkdir(path.join(workspaceDir, '_system', 'logs'), { recursive: true });
  await initialiseProcessLog(workspaceDir, 'TEST_COURSE');
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// ============================================================================
// LOGGING — basic event types
// ============================================================================

describe('log_process_event — basic event types', () => {
  it('logs a taught event', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'taught',
      lesson: 17,
    });

    expect(result.success).toBe(true);
    expect(result.event.type).toBe('taught');
    expect(result.event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    const log = await readProcessLog(workspaceDir);
    expect(log.entries.length).toBeGreaterThan(0);
    expect(log.entries[0].events[0].type).toBe('taught');
  });

  it('logs a material_produced event with files array', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'material_produced',
      files: [
        'Student_Materials/lektion_260423_content_topic.md',
        'Student_Materials/lektion_260423_recap_topic.md',
        'Analysis/2026-04-23-topic-autolog.md',
      ],
      lesson: 17,
    });

    expect(result.success).toBe(true);
    expect(result.event.files).toHaveLength(3);
  });

  it('logs a reflected event with depth and carry_forward_in', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'reflected',
      depth: 'standard',
      carry_forward_in: 'Reflections/2026-04-23-topic-reflection.md',
      lesson: 17,
    });

    expect(result.success).toBe(true);
    expect(result.event.depth).toBe('standard');
    expect(result.event.carry_forward_in).toBe('Reflections/2026-04-23-topic-reflection.md');
  });
});

// ============================================================================
// GROUPING — same day, same lesson
// ============================================================================

describe('log_process_event — grouping by date and lesson', () => {
  it('groups multiple events for same lesson into one entry', async () => {
    await logProcessEvent({ workspace: workspaceDir, type: 'taught', lesson: 17 });
    await logProcessEvent({
      workspace: workspaceDir,
      type: 'material_produced',
      files: ['a.md'],
      lesson: 17,
    });

    const log = await readProcessLog(workspaceDir);
    const lesson17 = log.entries.find(e => e.lesson === 17);
    expect(lesson17?.events).toHaveLength(2);
  });

  it('keeps different lessons in separate entries', async () => {
    await logProcessEvent({ workspace: workspaceDir, type: 'taught', lesson: 17 });
    await logProcessEvent({ workspace: workspaceDir, type: 'taught', lesson: 18 });

    const log = await readProcessLog(workspaceDir);
    const lessons = log.entries.map(e => e.lesson).filter((l): l is number => l !== undefined);
    expect(lessons).toContain(17);
    expect(lessons).toContain(18);
  });
});

// ============================================================================
// METADATA
// ============================================================================

describe('log_process_event — metadata', () => {
  it('returns the log file path on success', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'taught',
    });

    expect(result.log_path).toContain('process_log.yaml');
  });

  it('returns the workspace in the output', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'taught',
    });

    expect(result.workspace).toBe(workspaceDir);
  });

  it('passes through the trigger field when provided', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'material_produced',
      trigger: 'post_lesson_auto',
      files: ['a.md'],
    });

    expect(result.event.trigger).toBe('post_lesson_auto');
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

describe('log_process_event — error handling', () => {
  it('rejects invalid event type', async () => {
    const result = await logProcessEvent({
      workspace: workspaceDir,
      type: 'completely_invalid_type',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it('rejects missing workspace', async () => {
    const result = await logProcessEvent({
      type: 'taught',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it('rejects workspace outside server workspace', async () => {
    const outside = path.join(os.tmpdir(), 'outside-workspace-' + Date.now());
    await fs.mkdir(outside, { recursive: true });

    try {
      const result = await logProcessEvent({
        workspace: outside,
        type: 'taught',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    } finally {
      await fs.rm(outside, { recursive: true, force: true });
    }
  });
});
