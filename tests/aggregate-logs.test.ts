/**
 * Tests for aggregate_logs mechanical tool
 *
 * Creates temp directories with JSONL fixtures for each MCP log format.
 * Tests parsing, normalization, filtering, pagination, and edge cases.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { aggregateLogs, detectSource } from '../src/tools/mechanical/aggregate-logs.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

// ============================================================================
// FIXTURES
// ============================================================================

// QuestionForge log entries (session.jsonl format)
const QF_ENTRIES = [
  { ts: '2026-02-08T22:35:52.054Z', v: 1, session_id: 'qf-sess-001', mcp: 'qf-pipeline', tool: 'step0_start', event: 'session_start', level: 'info', data: { entry_point: 'setup' } },
  { ts: '2026-02-08T22:36:10.000Z', v: 1, session_id: 'qf-sess-001', mcp: 'qf-pipeline', tool: 'step1_analyze', event: 'analyze_start', level: 'debug', data: {} },
  { ts: '2026-02-08T22:41:51.961Z', v: 1, session_id: 'qf-sess-001', mcp: 'qf-pipeline', tool: 'step4_export', event: 'export_complete', level: 'info', data: { question_count: 8, format: 'QTI 2.1' } },
  { ts: '2026-02-08T22:42:00.000Z', v: 1, session_id: 'qf-sess-001', mcp: 'qf-pipeline', tool: 'step4_export', event: 'export_warning', level: 'warn', data: { message: 'Large file' } },
];

// Assessment Suite log entries (workflow_log.jsonl format)
const AS_ENTRIES = [
  { timestamp: '2026-02-10T10:18:27.289Z', phase: 1, tool: 'setup_project', action: 'project_creation', input: { exam_path: '/exams/test' }, output: { files_created: 18, methodology_files: 14 }, duration_seconds: 0.5 },
  { timestamp: '2026-02-10T19:43:16Z', phase: 7, tool: 'reflect_insights', action: 'insight_save', input: { question_id: 'Q001' }, output: { saved_to: 'Teacher_Insights.md', success: true }, duration_seconds: 0.01 },
];

// Teaching Suite log entries (activity_logs/*.jsonl format)
const TEACHER_ENTRIES = [
  { ts: '2026-02-16T06:38:38.862Z', v: 1, session_id: 'dad09c52a121', tool: 'plan_lesson', action: 'create', duration_ms: 4, summary: 'Lektionsplan: Hormonsystemet fördjupning', output_path: 'Lesson_Plans/2026-02-16-hormonsystemet.md' },
  { ts: '2026-02-16T07:00:00.000Z', v: 1, session_id: 'dad09c52a121', tool: 'capture_idea', action: 'create', duration_ms: 2, summary: 'Idé: Laboration med enzymer' },
];

// ============================================================================
// HELPERS
// ============================================================================

function toJsonl(entries: Record<string, unknown>[]): string {
  return entries.map(e => JSON.stringify(e)).join('\n') + '\n';
}

async function createQfLogs(workspace: string, subdir = 'Exams/test/Prov_v1'): Promise<void> {
  const logsDir = path.join(workspace, subdir, 'logs');
  await fs.mkdir(logsDir, { recursive: true });
  await fs.writeFile(path.join(logsDir, 'session.jsonl'), toJsonl(QF_ENTRIES));
}

async function createAsLogs(workspace: string, subdir = 'Exams/test/assessment'): Promise<void> {
  await fs.mkdir(path.join(workspace, subdir), { recursive: true });
  await fs.writeFile(path.join(workspace, subdir, 'workflow_log.jsonl'), toJsonl(AS_ENTRIES));
}

async function createTeacherLogs(workspace: string): Promise<void> {
  const logsDir = path.join(workspace, 'activity_logs');
  await fs.mkdir(logsDir, { recursive: true });
  await fs.writeFile(path.join(logsDir, '2026-02-16.jsonl'), toJsonl(TEACHER_ENTRIES));
}

// ============================================================================
// TESTS: detectSource (unit)
// ============================================================================

describe('detectSource', () => {
  it('should detect teacher from activity_logs/ path', () => {
    expect(detectSource('activity_logs/2026-02-16.jsonl', {})).toBe('teacher');
  });

  it('should detect AS from workflow_log.jsonl filename', () => {
    expect(detectSource('Exams/test/assessment/workflow_log.jsonl', {})).toBe('as');
  });

  it('should detect QF from logs/session.jsonl path + mcp field', () => {
    expect(detectSource('Exams/test/Prov_v1/logs/session.jsonl', { mcp: 'qf-pipeline' })).toBe('qf');
  });

  it('should use content fallback for AS (phase + timestamp)', () => {
    expect(detectSource('some/random/file.jsonl', { phase: 3, timestamp: '2026-01-01T00:00:00Z' })).toBe('as');
  });

  it('should use content fallback for QF (mcp field)', () => {
    expect(detectSource('some/file.jsonl', { mcp: 'qf-pipeline' })).toBe('qf');
  });

  it('should use content fallback for teacher (session_id + summary)', () => {
    expect(detectSource('some/file.jsonl', { session_id: 'abc', summary: 'Test' })).toBe('teacher');
  });

  it('should return unknown for unrecognized format', () => {
    expect(detectSource('some/file.jsonl', { foo: 'bar' })).toBe('unknown');
  });
});

// ============================================================================
// TESTS: aggregateLogs (integration)
// ============================================================================

describe('aggregateLogs', () => {
  let workspace: string;

  beforeEach(async () => {
    workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'aggregate-logs-test-'));
    setServerWorkspace(workspace);
  });

  afterEach(async () => {
    try {
      await fs.rm(workspace, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  // --------------------------------------------------------------------------
  // Core functionality
  // --------------------------------------------------------------------------

  describe('core functionality', () => {
    it('should return empty result for empty workspace', async () => {
      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toEqual([]);
      expect(result.total_found).toBe(0);
      expect(result.sources_found).toEqual([]);
      expect(result.files_read).toEqual([]);
    });

    it('should parse Teaching Suite logs correctly', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
      expect(result.sources_found).toEqual(['teacher']);

      const entry = result.entries[0];
      expect(entry.source).toBe('teacher');
      expect(entry.tool).toBe('plan_lesson');
      expect(entry.action).toBe('create');
      expect(entry.summary).toBe('Lektionsplan: Hormonsystemet fördjupning');
      expect(entry.session_id).toBe('dad09c52a121');
      expect(entry.data).toEqual({ output_path: 'Lesson_Plans/2026-02-16-hormonsystemet.md', duration_ms: 4 });
      expect(entry.file).toBe(path.join('activity_logs', '2026-02-16.jsonl'));
    });

    it('should parse QF logs correctly and skip debug entries', async () => {
      await createQfLogs(workspace);

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      // 4 entries total, but 1 is debug level → 3 returned
      expect(result.entries).toHaveLength(3);
      expect(result.sources_found).toEqual(['qf']);

      // Verify debug entry is filtered out
      const events = result.entries.map(e => e.action);
      expect(events).not.toContain('analyze_start');

      // Check mapping: event → action
      expect(result.entries[0].action).toBe('session_start');
      expect(result.entries[0].session_id).toBe('qf-sess-001');
      expect(result.entries[0].summary).toBe('step0_start: session_start');

      // Warn entry should be included
      expect(events).toContain('export_warning');
    });

    it('should parse AS logs correctly with nested data', async () => {
      await createAsLogs(workspace);

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
      expect(result.sources_found).toEqual(['as']);

      const entry = result.entries[0];
      expect(entry.source).toBe('as');
      expect(entry.tool).toBe('setup_project');
      expect(entry.action).toBe('project_creation');
      expect(entry.summary).toBe('Phase 1: project_creation');

      // Data should be nested {input, output}, not flat merged
      expect(entry.data).toEqual({
        input: { exam_path: '/exams/test' },
        output: { files_created: 18, methodology_files: 14 },
      });
    });

    it('should interleave all three sources chronologically', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.sources_found.sort()).toEqual(['as', 'qf', 'teacher']);

      // Verify chronological order (oldest first)
      for (let i = 1; i < result.entries.length; i++) {
        expect(result.entries[i].ts >= result.entries[i - 1].ts).toBe(true);
      }

      // Verify sources appear in time order: QF (feb 8) → AS (feb 10) → Teacher (feb 16)
      const firstQf = result.entries.find(e => e.source === 'qf');
      const firstAs = result.entries.find(e => e.source === 'as');
      const firstTeacher = result.entries.find(e => e.source === 'teacher');
      expect(firstQf!.ts < firstAs!.ts).toBe(true);
      expect(firstAs!.ts < firstTeacher!.ts).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Filters
  // --------------------------------------------------------------------------

  describe('filters', () => {
    it('should filter by after date (inclusive)', async () => {
      await createQfLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        after: '2026-02-16T00:00:00.000Z',
      });

      expect(result.success).toBe(true);
      // Only teacher entries (feb 16) should remain
      expect(result.entries.every(e => e.source === 'teacher')).toBe(true);
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('should filter by before date (inclusive)', async () => {
      await createQfLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        before: '2026-02-09T00:00:00.000Z',
      });

      expect(result.success).toBe(true);
      // Only QF entries (feb 8) should remain
      expect(result.entries.every(e => e.source === 'qf')).toBe(true);
    });

    it('should filter by date range (after + before)', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        after: '2026-02-09T00:00:00.000Z',
        before: '2026-02-15T00:00:00.000Z',
      });

      expect(result.success).toBe(true);
      // Only AS entries (feb 10) should remain
      expect(result.entries.every(e => e.source === 'as')).toBe(true);
    });

    it('should filter by source', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        source: ['teacher'],
      });

      expect(result.success).toBe(true);
      expect(result.entries.every(e => e.source === 'teacher')).toBe(true);
      expect(result.entries).toHaveLength(2);
      // files_read should still list all files found (not just filtered ones)
      expect(result.files_read.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter by multiple sources', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        source: ['qf', 'as'],
      });

      expect(result.success).toBe(true);
      expect(result.entries.every(e => e.source === 'qf' || e.source === 'as')).toBe(true);
      // No teacher entries
      expect(result.entries.some(e => e.source === 'teacher')).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // Pagination
  // --------------------------------------------------------------------------

  describe('pagination', () => {
    it('should respect limit', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({ workspace, limit: 2 });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
      // total_found should reflect untruncated count
      expect(result.total_found).toBeGreaterThan(2);
    });

    it('should respect offset', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const allResult = await aggregateLogs({ workspace, limit: 1000 });
      const offsetResult = await aggregateLogs({ workspace, offset: 2, limit: 1000 });

      expect(offsetResult.entries).toHaveLength(allResult.entries.length - 2);
      expect(offsetResult.entries[0].ts).toBe(allResult.entries[2].ts);
      expect(offsetResult.total_found).toBe(allResult.total_found);
    });

    it('should support offset + limit for pagination', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const page1 = await aggregateLogs({ workspace, offset: 0, limit: 3 });
      const page2 = await aggregateLogs({ workspace, offset: 3, limit: 3 });

      expect(page1.entries).toHaveLength(3);
      expect(page2.entries.length).toBeGreaterThan(0);

      // No overlap between pages
      const page1Ts = page1.entries.map(e => e.ts);
      const page2Ts = page2.entries.map(e => e.ts);
      const overlap = page1Ts.filter(ts => page2Ts.includes(ts));
      // Allow same timestamps from different sources, but check entries are different
      if (overlap.length > 0) {
        // Entries should still be different (different index in sorted array)
        expect(page2.entries[0]).not.toEqual(page1.entries[page1.entries.length - 1]);
      }

      // Both pages should report same total
      expect(page1.total_found).toBe(page2.total_found);
    });
  });

  // --------------------------------------------------------------------------
  // Edge cases
  // --------------------------------------------------------------------------

  describe('edge cases', () => {
    it('should handle malformed JSONL lines gracefully', async () => {
      const logsDir = path.join(workspace, 'activity_logs');
      await fs.mkdir(logsDir, { recursive: true });

      const content = [
        JSON.stringify(TEACHER_ENTRIES[0]),
        'this is not json{{{',
        JSON.stringify(TEACHER_ENTRIES[1]),
        '',
      ].join('\n');

      await fs.writeFile(path.join(logsDir, '2026-02-16.jsonl'), content);

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.some(w => w.includes('Malformed JSON'))).toBe(true);
    });

    it('should find deeply nested log files', async () => {
      // Create QF logs 4 levels deep
      await createQfLogs(workspace, 'Exams/Formative/minidugga_260208/Prov_Nervsystemet_v2');

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries.length).toBeGreaterThan(0);
      expect(result.sources_found).toContain('qf');
    });

    it('should normalize timestamps without timezone to Z suffix', async () => {
      // AS entry with timestamp missing Z (e.g. "2026-02-10T19:43:16")
      const asEntry = { timestamp: '2026-02-10T19:43:16', phase: 3, tool: 'test_tool', action: 'test_action', input: {}, output: {} };
      const subdir = 'test_assessment';
      await fs.mkdir(path.join(workspace, subdir), { recursive: true });
      await fs.writeFile(
        path.join(workspace, subdir, 'workflow_log.jsonl'),
        JSON.stringify(asEntry) + '\n'
      );

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].ts).toBe('2026-02-10T19:43:16.000Z');
    });

    it('should handle unknown log source with warning', async () => {
      // A .jsonl file that doesn't match any known pattern
      // Put it in a location that matches activity_logs pattern but with unknown content format
      // Actually, to get "unknown" we need a session.jsonl NOT in a /logs/ dir
      // Let's create a file that matches no known pattern
      const subdir = 'some_project';
      const logsDir = path.join(workspace, subdir, 'activity_logs');
      await fs.mkdir(logsDir, { recursive: true });
      // activity_logs/ path → detected as teacher even with weird content
      // For true unknown, we need a different approach... Let me think.
      // The findLogFiles function only finds files matching the 3 patterns.
      // So "unknown" can only happen if session.jsonl is in /logs/ but mcp field doesn't start with 'qf'
      const logDir = path.join(workspace, 'something', 'logs');
      await fs.mkdir(logDir, { recursive: true });
      await fs.writeFile(
        path.join(logDir, 'session.jsonl'),
        JSON.stringify({ ts: '2026-01-01T00:00:00Z', tool: 'mystery', event: 'test' }) + '\n'
      );

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].source).toBe('unknown');
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.some(w => w.includes('Unknown log source'))).toBe(true);
    });

    it('should fail on workspace validation error', async () => {
      // Set server workspace to a specific dir, then request a different one
      setServerWorkspace(workspace);

      const result = await aggregateLogs({ workspace: '/nonexistent/outside/workspace' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle empty JSONL file without crashing', async () => {
      const logsDir = path.join(workspace, 'activity_logs');
      await fs.mkdir(logsDir, { recursive: true });
      await fs.writeFile(path.join(logsDir, 'empty.jsonl'), '');

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toEqual([]);
      expect(result.files_read.length).toBe(1);
      expect(result.warnings).toBeDefined();
      expect(result.warnings!.some(w => w.includes('No valid JSON'))).toBe(true);
    });

    it('should skip QF debug-level entries and not count them', async () => {
      // Create file with only debug entries
      const logsDir = path.join(workspace, 'Exams/test/Prov_v1/logs');
      await fs.mkdir(logsDir, { recursive: true });

      const debugOnly = [
        { ts: '2026-02-08T22:36:10.000Z', v: 1, session_id: 's1', mcp: 'qf-pipeline', tool: 'step1', event: 'debug_event', level: 'debug', data: {} },
      ];
      await fs.writeFile(path.join(logsDir, 'session.jsonl'), toJsonl(debugOnly));

      const result = await aggregateLogs({ workspace });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(0);
      expect(result.total_found).toBe(0);
    });
  });

  // --------------------------------------------------------------------------
  // Consistency
  // --------------------------------------------------------------------------

  describe('consistency', () => {
    it('should return all file paths relative to workspace', async () => {
      await createQfLogs(workspace);
      await createAsLogs(workspace);
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({ workspace });

      // All files_read should be relative (no leading /)
      for (const f of result.files_read) {
        expect(path.isAbsolute(f)).toBe(false);
      }

      // All entry file paths should be relative
      for (const entry of result.entries) {
        expect(path.isAbsolute(entry.file)).toBe(false);
      }
    });

    it('should sort entries oldest to newest regardless of file read order', async () => {
      // Create teacher logs first (newest), then QF (oldest)
      await createTeacherLogs(workspace);
      await createQfLogs(workspace);

      const result = await aggregateLogs({ workspace });

      // First entry should be QF (feb 8), last should be teacher (feb 16)
      expect(result.entries[0].source).toBe('qf');
      expect(result.entries[result.entries.length - 1].source).toBe('teacher');

      // All timestamps should be in ascending order
      for (let i = 1; i < result.entries.length; i++) {
        expect(result.entries[i].ts >= result.entries[i - 1].ts).toBe(true);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Input validation
  // --------------------------------------------------------------------------

  describe('input validation', () => {
    it('should reject invalid input', async () => {
      const result = await aggregateLogs({});

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should use default limit of 100', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({ workspace });

      // With only 2 teacher entries, limit doesn't matter but verify it works
      expect(result.success).toBe(true);
      expect(result.entries.length).toBeLessThanOrEqual(100);
    });
  });

  // --------------------------------------------------------------------------
  // Bridge methodology filters (PR-δ-a)
  // --------------------------------------------------------------------------

  describe('bridge methodology filters', () => {
    it('content_types filters by entry.tool', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        content_types: ['plan_lesson'],
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].tool).toBe('plan_lesson');
    });

    it('content_types accepts multiple values (OR semantics)', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        content_types: ['plan_lesson', 'capture_idea'],
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
    });

    it('content_types matches entry.action when tool does not match', async () => {
      await createQfLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        content_types: ['export_complete'],
      });

      expect(result.success).toBe(true);
      // QF entries have action='export_complete' for one entry
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
      expect(result.entries.some(e => e.action === 'export_complete')).toBe(true);
    });

    it('content_types empty list is treated as no filter', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        content_types: [],
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
    });

    it('window derives after from now() — large window keeps fixture entries', async () => {
      await createTeacherLogs(workspace);

      // 100 000 days back covers all of fixture history
      const result = await aggregateLogs({
        workspace,
        window: '100000 days',
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(2);
    });

    it('window rejects invalid format', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        window: 'banana',
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/window/i);
    });

    it('window + after both set returns error', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        window: '21 days',
        after: '2026-01-01',
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/window.*after|after.*window/i);
    });

    it('course filters by path substring', async () => {
      // Create teacher logs in a course-specific subdirectory
      const courseDir = path.join(workspace, 'KURS201_2026', 'activity_logs');
      await fs.mkdir(courseDir, { recursive: true });
      await fs.writeFile(
        path.join(courseDir, '2026-02-16.jsonl'),
        toJsonl(TEACHER_ENTRIES),
      );
      // Plus teacher logs at root (not in course)
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        course: 'KURS201',
      });

      expect(result.success).toBe(true);
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
      expect(result.entries.every(e => e.file.includes('KURS201'))).toBe(true);
    });

    it('topic filters by entry.summary substring', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        topic: 'hormonsystemet',
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].summary).toContain('Hormonsystemet');
    });

    it('topic match is case-insensitive', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        topic: 'HORMONSYSTEMET',
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(1);
    });

    it('multiple bridge filters combine with AND semantics', async () => {
      await createTeacherLogs(workspace);

      const result = await aggregateLogs({
        workspace,
        content_types: ['plan_lesson'],
        topic: 'hormonsystemet',
      });

      expect(result.success).toBe(true);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].tool).toBe('plan_lesson');
    });
  });
});
