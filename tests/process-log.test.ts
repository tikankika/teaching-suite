import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import {
  initialiseProcessLog,
  readProcessLog,
  appendProcessEvent,
  getProcessLogPath,
} from '../src/utils/process-log.js';

// ============================================================================
// TEST SETUP
// ============================================================================

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'teaching-suite-plog-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// ============================================================================
// INITIALISE
// ============================================================================

describe('initialiseProcessLog', () => {
  it('creates _system/logs/process_log.yaml with course_instance', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    const logPath = getProcessLogPath(tmpDir);
    const content = await fs.readFile(logPath, 'utf-8');

    expect(content).toContain('course_instance: KURS101_2026');
    expect(content).toContain('entries: []');
  });

  it('creates parent directories if missing', async () => {
    const nested = path.join(tmpDir, 'deep', 'nested');
    await initialiseProcessLog(nested, 'TEST_101');

    const logPath = getProcessLogPath(nested);
    const stat = await fs.stat(logPath);
    expect(stat.isFile()).toBe(true);
  });
});

// ============================================================================
// READ
// ============================================================================

describe('readProcessLog', () => {
  it('returns empty log when file does not exist', async () => {
    const log = await readProcessLog(tmpDir);

    expect(log.course_instance).toBe('');
    expect(log.entries).toEqual([]);
  });

  it('reads initialised log', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');
    const log = await readProcessLog(tmpDir);

    expect(log.course_instance).toBe('KURS101_2026');
    expect(log.entries).toEqual([]);
  });
});

// ============================================================================
// APPEND
// ============================================================================

describe('appendProcessEvent', () => {
  it('appends a planned event', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    const result = await appendProcessEvent({
      workspace: tmpDir,
      event: {
        type: 'planned',
        file: 'Lesson_Plans/lektion_14.md',
        timestamp: '2026-04-04T19:30:00.000Z',
      },
      lesson: 14,
      module: 'Immunförsvaret',
    });

    expect(result).toBe(true);

    const log = await readProcessLog(tmpDir);
    expect(log.entries).toHaveLength(1);
    expect(log.entries[0].date).toBe('2026-04-04');
    expect(log.entries[0].lesson).toBe(14);
    expect(log.entries[0].module).toBe('Immunförsvaret');
    expect(log.entries[0].events).toHaveLength(1);
    expect(log.entries[0].events[0].type).toBe('planned');
    expect(log.entries[0].events[0].file).toBe('Lesson_Plans/lektion_14.md');
  });

  it('appends a reflected event with carry_forward_in', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    const result = await appendProcessEvent({
      workspace: tmpDir,
      event: {
        type: 'reflected',
        file: 'Reflections/reflektion_lektion_14.md',
        timestamp: '2026-04-04T15:00:00.000Z',
        depth: 'standard',
        carry_forward_in: 'Reflections/reflektion_lektion_14.md',
      },
      lesson: 14,
    });

    expect(result).toBe(true);

    const log = await readProcessLog(tmpDir);
    const event = log.entries[0].events[0];
    expect(event.type).toBe('reflected');
    expect(event.depth).toBe('standard');
    expect(event.carry_forward_in).toBe('Reflections/reflektion_lektion_14.md');
  });

  it('groups multiple events on the same date/lesson/module', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    await appendProcessEvent({
      workspace: tmpDir,
      event: { type: 'planned', file: 'Lesson_Plans/l14.md', timestamp: '2026-04-04T10:00:00.000Z' },
      lesson: 14,
    });

    await appendProcessEvent({
      workspace: tmpDir,
      event: { type: 'reflected', file: 'Reflections/r14.md', timestamp: '2026-04-04T15:00:00.000Z' },
      lesson: 14,
    });

    const log = await readProcessLog(tmpDir);
    expect(log.entries).toHaveLength(1); // Same date + lesson → grouped
    expect(log.entries[0].events).toHaveLength(2);
  });

  it('creates separate entries for different dates', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    await appendProcessEvent({
      workspace: tmpDir,
      event: { type: 'planned', file: 'Lesson_Plans/l14.md', timestamp: '2026-04-04T10:00:00.000Z' },
      lesson: 14,
    });

    await appendProcessEvent({
      workspace: tmpDir,
      event: { type: 'planned', file: 'Lesson_Plans/l15.md', timestamp: '2026-04-05T10:00:00.000Z' },
      lesson: 15,
    });

    const log = await readProcessLog(tmpDir);
    expect(log.entries).toHaveLength(2);
  });

  it('appends event without lesson or module', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    await appendProcessEvent({
      workspace: tmpDir,
      event: { type: 'idea_captured', file: 'Ideas/ny_ide.md', timestamp: '2026-04-04T10:00:00.000Z' },
    });

    const log = await readProcessLog(tmpDir);
    expect(log.entries[0].lesson).toBeUndefined();
    expect(log.entries[0].module).toBeUndefined();
  });

  it('returns false when workspace is invalid', async () => {
    const result = await appendProcessEvent({
      workspace: '/nonexistent/path/that/cannot/be/created',
      event: { type: 'planned', timestamp: '2026-04-04T10:00:00.000Z' },
    });

    expect(result).toBe(false);
  });

  it('appends material_produced with multiple files', async () => {
    await initialiseProcessLog(tmpDir, 'KURS101_2026');

    await appendProcessEvent({
      workspace: tmpDir,
      event: {
        type: 'material_produced',
        files: ['Material/Presentations/immun_l14.pptx', 'Material/Exercises/immun_quiz.md'],
        timestamp: '2026-04-04T10:00:00.000Z',
      },
      lesson: 14,
    });

    const log = await readProcessLog(tmpDir);
    expect(log.entries[0].events[0].files).toHaveLength(2);
  });
});

// ============================================================================
// INTEGRATION WITH project_init
// ============================================================================

describe('process log via project_init', () => {
  it('project_init course creates process_log.yaml', async () => {
    // Import here to avoid circular dependency issues
    const { projectInit } = await import('../src/tools/setup/project-init.js');
    const { setServerWorkspace } = await import('../src/tools/core/workspace.js');

    setServerWorkspace(tmpDir);
    const projectPath = path.join(tmpDir, 'test-course');

    await projectInit({
      project_path: projectPath,
      type: 'course',
      course: 'TEST_101',
    });

    const log = await readProcessLog(projectPath);
    expect(log.course_instance).toBe('TEST_101');
    expect(log.entries).toEqual([]);
  });
});
