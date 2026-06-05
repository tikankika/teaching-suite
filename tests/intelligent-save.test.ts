import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import {
  sanitizeFilename,
  extractTitle,
  generateFilename,
  detectWikilinks,
  pathToWikilink,
  suggestDirectory,
  generateMetadata,
  formatFileContent,
  intelligentSave,
  validateMetadata,
} from '../src/tools/composite/intelligent-save.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';
import { readProcessLog, initialiseProcessLog } from '../src/utils/process-log.js';

// ============================================================================
// UNIT TESTS: Helper Functions
// ============================================================================

describe('sanitizeFilename', () => {
  it('should replace spaces with underscores', () => {
    expect(sanitizeFilename('hello world')).toBe('hello_world');
  });

  it('should remove special characters', () => {
    expect(sanitizeFilename('file<name>:test')).toBe('filenametest');
  });

  it('should collapse multiple underscores', () => {
    expect(sanitizeFilename('hello   world')).toBe('hello_world');
  });

  it('should preserve Swedish characters', () => {
    expect(sanitizeFilename('åäö test')).toBe('åäö_test');
  });

  it('should preserve dots and hyphens', () => {
    expect(sanitizeFilename('file-name.md')).toBe('file-name.md');
  });
});

describe('extractTitle', () => {
  it('should extract markdown heading', () => {
    const content = '# My Title\n\nSome content here';
    expect(extractTitle(content)).toBe('My Title');
  });

  it('should use first line if no heading', () => {
    const content = 'First line of content\nSecond line';
    expect(extractTitle(content)).toBe('First line of content');
  });

  it('should truncate long first lines', () => {
    const longLine = 'A'.repeat(100);
    expect(extractTitle(longLine).length).toBe(60);
  });

  it('should handle empty content', () => {
    expect(extractTitle('')).toBe('');
  });
});

describe('generateFilename', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should generate filename with content_type and date', () => {
    const filename = generateFilename('analysis');
    expect(filename).toBe('Analysis_2026-01-11.md');
  });

  it('should include project in filename', () => {
    const filename = generateFilename('reflection', 'Teaching Suite');
    expect(filename).toBe('Reflection_Teaching_Suite_2026-01-11.md');
  });

  it('should extract title from content if no project', () => {
    const filename = generateFilename('idea', undefined, '# My Great Idea\n\nContent');
    expect(filename).toBe('Idea_My_Great_Idea_2026-01-11.md');
  });

  it('should truncate long project names', () => {
    const longProject = 'A'.repeat(50);
    const filename = generateFilename('note', longProject);
    expect(filename.length).toBeLessThan(70);
  });
});

describe('detectWikilinks', () => {
  it('should detect wikilinks in content', () => {
    const content = 'See [[Teaching Suite]] for details. Also check [[KURS101_2026]].';
    const links = detectWikilinks(content);
    expect(links).toEqual(['Teaching Suite', 'KURS101_2026']);
  });

  it('should return empty array if no wikilinks', () => {
    const content = 'No links here';
    expect(detectWikilinks(content)).toEqual([]);
  });

  it('should handle multiple wikilinks on same line', () => {
    const content = '[[A]] and [[B]] and [[C]]';
    expect(detectWikilinks(content)).toEqual(['A', 'B', 'C']);
  });
});

describe('pathToWikilink', () => {
  it('should extract basename without extension', () => {
    expect(pathToWikilink('/path/to/file.md')).toBe('file');
  });

  it('should handle paths without extension', () => {
    expect(pathToWikilink('/path/to/file')).toBe('file');
  });
});

describe('suggestDirectory', () => {
  it('should return default directory for content_type', () => {
    expect(suggestDirectory('analysis')).toBe('Analysis/');
    expect(suggestDirectory('reflection')).toBe('Reflections/');
    expect(suggestDirectory('lesson_plan')).toBe('Lesson_Plans/');
  });

  it('should join with workspace if provided', () => {
    const dir = suggestDirectory('idea', '/Users/test/vault');
    expect(dir).toBe(path.join('/Users/test/vault', 'Ideas/'));
  });

  it('should route v3 cycle outputs to their canonical workspace directories', () => {
    expect(suggestDirectory('bridge_intention')).toBe('Reflections/Bryggor/');
    expect(suggestDirectory('pre_course_context_report')).toBe('Planning/');
    expect(suggestDirectory('course_evaluation')).toBe('Analysis/');
    // term_reflection and manifest are workspace-root types — without
    // server workspace configured, fall through to bare directory string.
    expect(suggestDirectory('term_reflection')).toBe('Profession/Termin/');
    expect(suggestDirectory('manifest')).toBe('Profession/Manifest/');
  });

  it('should route workspace-root types (manifest, term_reflection) to server workspace, not the calling course folder', async () => {
    const { setServerWorkspace } = await import('../src/tools/core/workspace.js');
    const serverRoot = '/Users/test/Nextcloud/Courses';
    const courseFolder = '/Users/test/Nextcloud/Courses/Biologi/KURS201_2026_v3';
    setServerWorkspace(serverRoot);

    // Both should land at server-root, not at courseFolder
    expect(suggestDirectory('manifest', courseFolder, true)).toBe(
      path.join(serverRoot, 'Profession/Manifest/')
    );
    expect(suggestDirectory('term_reflection', courseFolder, true)).toBe(
      path.join(serverRoot, 'Profession/Termin/')
    );
    // Non-workspace-root types still respect the course folder
    expect(suggestDirectory('reflection', courseFolder, true)).toBe(
      path.join(courseFolder, 'Reflections/')
    );
  });
});

describe('generateMetadata', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should generate base metadata with RFC-014 fields', () => {
    const metadata = generateMetadata('# Test\nContent', 'note');
    expect(metadata.title).toBe('Test');
    expect(metadata.type).toBe('note');
    expect(metadata.created).toContain('2026-01-11');
    expect(metadata.date).toBe('2026-01-11');
    expect(metadata.metadata_version).toBe('1.0');
    expect(metadata.provenance).toEqual({ tool: 'intelligent_save', ai_assisted: true });
  });

  it('should include context fields with course_instance', () => {
    const metadata = generateMetadata('Content', 'analysis', {
      course: 'KURS101_2026',
      tags: ['test', 'demo'],
    });
    expect(metadata.course_instance).toBe('KURS101_2026');
    expect(metadata.tags).toEqual(['test', 'demo']);
  });

  it('should use project as course_instance fallback', () => {
    const metadata = generateMetadata('Content', 'note', {
      project: 'Teaching Suite',
    });
    expect(metadata.course_instance).toBe('Teaching Suite');
  });

  it('should add analysis-specific metadata with canonical status', () => {
    const metadata = generateMetadata('Content', 'analysis');
    expect(metadata.status).toBe('active');
  });

  it('should add reflection-specific metadata with canonical status', () => {
    const metadata = generateMetadata('Content', 'reflection');
    expect(metadata.date).toBe('2026-01-11');
    expect(metadata.status).toBe('completed');
  });

  it('should add idea-specific metadata with canonical status', () => {
    const metadata = generateMetadata('Content', 'idea');
    expect(metadata.priority).toBe('medium');
    expect(metadata.status).toBe('draft');
  });

  it('should add decision-specific metadata with canonical status', () => {
    const metadata = generateMetadata('Content', 'decision');
    expect(metadata.status).toBe('draft');
  });

  it('should default to draft status for unspecified types', () => {
    const metadata = generateMetadata('Content', 'note');
    expect(metadata.status).toBe('draft');
  });

  it('should convert related_files to wikilinks', () => {
    const metadata = generateMetadata('Content', 'note', {
      related_files: ['/path/to/file1.md', '/path/to/file2.md'],
    });
    expect(metadata.related).toEqual(['file1', 'file2']);
  });
});

describe('formatFileContent', () => {
  it('should add YAML frontmatter', () => {
    const content = 'My content';
    const metadata = { title: 'Test', type: 'note' };
    const result = formatFileContent(content, metadata);

    expect(result).toMatch(/^---\n/);
    expect(result).toContain('title: Test');
    expect(result).toContain('type: note');
    expect(result).toContain('---\n\nMy content');
  });
});

// ============================================================================
// INTEGRATION TESTS: intelligentSave
// ============================================================================

describe('intelligentSave', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
    // Set server workspace so core validation accepts paths
    setServerWorkspace('/');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return confirmation when auto_confirm is false', async () => {
    const result = await intelligentSave({
      content: '# Test Analysis\n\nSome content',
      content_type: 'analysis',
      auto_confirm: false,
    });

    expect(result.success).toBe(true);
    expect(result.confirmation_needed).toBe(true);
    expect(result.suggestion).toBeDefined();
    expect(result.suggestion?.filename).toContain('Analysis');
    expect(result.suggestion?.directory).toBe('Analysis/');
    expect(result.suggestion?.message).toContain('Save as');
  });

  it('should include wikilinks in suggestion', async () => {
    const result = await intelligentSave({
      content: 'See [[Teaching Suite]] for details',
      content_type: 'note',
      context: {
        related_files: ['/path/to/other.md'],
      },
    });

    expect(result.suggestion?.wikilinks).toContain('Teaching Suite');
    expect(result.suggestion?.wikilinks).toContain('other');
  });

  it('should use suggested_filename when provided', async () => {
    const result = await intelligentSave({
      content: 'Content',
      content_type: 'note',
      suggested_filename: 'my-custom-file.md',
    });

    expect(result.suggestion?.filename).toBe('my-custom-file.md');
  });

  it('should use suggested_location when provided', async () => {
    const result = await intelligentSave({
      content: 'Content',
      content_type: 'note',
      suggested_location: '/custom/path/',
    });

    expect(result.suggestion?.directory).toBe('/custom/path/');
  });

  it('should reject invalid input', async () => {
    const result = await intelligentSave({
      content: '', // Empty content should fail
      content_type: 'note',
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('INVALID_PATH');
  });

  it('should reject paths outside workspace', async () => {
    const result = await intelligentSave({
      content: 'Content',
      content_type: 'note',
      context: {
        workspace: '/safe/workspace',
      },
      suggested_location: '/etc/', // Outside workspace
      auto_confirm: true,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('INVALID_PATH');
    expect(result.error?.message).toContain('outside the allowed workspace');
  });

  it('should include correct metadata for content_type', async () => {
    const result = await intelligentSave({
      content: '# Decision\n\nWe decided X',
      content_type: 'decision',
    });

    expect(result.suggestion?.metadata.type).toBe('decision');
    expect(result.suggestion?.metadata.status).toBe('draft');
  });
});

// ============================================================================
// FILE SYSTEM TESTS (with mocking)
// ============================================================================

describe('intelligentSave with file system', () => {
  const testDir = '/tmp/intelligent-save-test';

  beforeEach(async () => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
    // Set server workspace so core validation accepts paths
    setServerWorkspace('/');
    // Create test directory
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  });

  afterEach(async () => {
    vi.useRealTimers();
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should save file when auto_confirm is true', async () => {
    const result = await intelligentSave({
      content: '# Test Note\n\nThis is test content.',
      content_type: 'note',
      suggested_location: testDir,
      auto_confirm: true,
    });

    expect(result.success).toBe(true);
    expect(result.filepath).toBeDefined();
    expect(result.metadata_generated).toBeDefined();

    // Verify file was created
    const fileContent = await fs.readFile(result.filepath!, 'utf-8');
    expect(fileContent).toContain('---');
    expect(fileContent).toContain('title: Test Note');
    expect(fileContent).toContain('type: note');
    expect(fileContent).toContain('This is test content.');
  });

  it('should return FILE_EXISTS error for existing file', async () => {
    const filename = 'existing-file.md';
    const filepath = path.join(testDir, filename);

    // Create existing file
    await fs.writeFile(filepath, 'existing content');

    const result = await intelligentSave({
      content: 'New content',
      content_type: 'note',
      suggested_location: testDir,
      suggested_filename: filename,
      auto_confirm: true,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('FILE_EXISTS');
    expect(result.error?.details).toHaveProperty('suggestion');
  });

  it('should create directory if it does not exist', async () => {
    const newDir = path.join(testDir, 'new-subdir');

    const result = await intelligentSave({
      content: '# Test\n\nContent',
      content_type: 'note',
      suggested_location: newDir,
      auto_confirm: true,
    });

    expect(result.success).toBe(true);

    // Verify directory was created
    const stats = await fs.stat(newDir);
    expect(stats.isDirectory()).toBe(true);
  });
});

// ============================================================================
// ENRICHED METADATA (Sprint 1, ADR-004)
// ============================================================================

describe('generateMetadata — enriched fields', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-03-18T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should include based_on when provided', () => {
    const metadata = generateMetadata('# Reflection', 'reflection', {
      based_on: ['Reflections/2026-03-14.md', 'Lesson_Plans/ekologi.md'],
    });
    expect(metadata.based_on).toEqual(['Reflections/2026-03-14.md', 'Lesson_Plans/ekologi.md']);
  });

  it('should include supports when provided', () => {
    const metadata = generateMetadata('# Lesson Plan', 'lesson_plan', {
      supports: ['G1', 'LO3'],
    });
    expect(metadata.supports).toEqual(['G1', 'LO3']);
  });

  it('should include framework when provided', () => {
    const metadata = generateMetadata('# Reflection', 'reflection', {
      framework: 'gibbs',
    });
    expect(metadata.framework).toBe('gibbs');
  });

  it('should include learning_objectives when provided', () => {
    const metadata = generateMetadata('# Plan', 'lesson_plan', {
      learning_objectives: ['LO1', 'LO2'],
    });
    expect(metadata.learning_objectives).toEqual(['LO1', 'LO2']);
  });

  it('should omit empty arrays', () => {
    const metadata = generateMetadata('# Note', 'note', {
      based_on: [],
      supports: [],
      learning_objectives: [],
    });
    expect(metadata.based_on).toBeUndefined();
    expect(metadata.supports).toBeUndefined();
    expect(metadata.learning_objectives).toBeUndefined();
  });

  it('should combine all enriched fields with existing metadata', () => {
    const metadata = generateMetadata('# Analysis', 'analysis', {
      course: 'KURS101_2026',
      tags: ['ekologi'],
      based_on: ['Reflections/r1.md'],
      supports: ['G1'],
      framework: 'kolb',
      learning_objectives: ['LO1'],
    });
    expect(metadata.course_instance).toBe('KURS101_2026');
    expect(metadata.tags).toEqual(['ekologi']);
    expect(metadata.based_on).toEqual(['Reflections/r1.md']);
    expect(metadata.supports).toEqual(['G1']);
    expect(metadata.framework).toBe('kolb');
    expect(metadata.learning_objectives).toEqual(['LO1']);
    expect(metadata.status).toBe('active'); // canonical status (RFC-014)
  });
});

// ============================================================================
// JOURNAL UPDATE
// ============================================================================

describe('intelligentSave — journal update', () => {
  let tmpDir: string;

  beforeEach(async () => {
    vi.setSystemTime(new Date('2026-03-18T10:00:00Z'));
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'teaching-suite-test-'));
    setServerWorkspace(tmpDir);
  });

  afterEach(async () => {
    vi.useRealTimers();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should append journal entry to course_context.md after save', async () => {
    // Create _config/course_context.md
    const configDir = path.join(tmpDir, '_config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(
      path.join(configDir, 'course_context.md'),
      '---\ntype: course_context\ncourse: TEST_101\n---\n\n# Kurskontext\n\n## Journal\n- 2026-03-15: Projekt initierat.\n',
      'utf-8'
    );

    const result = await intelligentSave({
      content: '# Reflection on ecology',
      content_type: 'reflection',
      context: { workspace: tmpDir },
      suggested_location: path.join(tmpDir, 'Reflections'),
      auto_confirm: true,
    });

    expect(result.success).toBe(true);

    const ccContent = await fs.readFile(path.join(configDir, 'course_context.md'), 'utf-8');
    expect(ccContent).toContain('2026-03-18: reflection sparad:');
    expect(ccContent).toContain('Projekt initierat'); // Original entry preserved
  });

  it('should not fail when _config/course_context.md is missing', async () => {
    const result = await intelligentSave({
      content: '# Note',
      content_type: 'note',
      context: { workspace: tmpDir },
      suggested_location: path.join(tmpDir, 'Notes'),
      auto_confirm: true,
    });

    expect(result.success).toBe(true);
  });

  it('should not fail when course_context.md has no Journal section', async () => {
    const configDir = path.join(tmpDir, '_config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(
      path.join(configDir, 'course_context.md'),
      '---\ntype: course_context\n---\n\n# Kurskontext\n\n## Mission\nTest\n',
      'utf-8'
    );

    const result = await intelligentSave({
      content: '# Idea',
      content_type: 'idea',
      context: { workspace: tmpDir },
      suggested_location: path.join(tmpDir, 'Ideas'),
      auto_confirm: true,
    });

    expect(result.success).toBe(true);

    // course_context.md unchanged
    const ccContent = await fs.readFile(path.join(configDir, 'course_context.md'), 'utf-8');
    expect(ccContent).not.toContain('sparad:');
  });

  it('should not update journal when auto_confirm is false', async () => {
    const configDir = path.join(tmpDir, '_config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(
      path.join(configDir, 'course_context.md'),
      '---\ntype: course_context\n---\n\n## Journal\n- Start\n',
      'utf-8'
    );

    const result = await intelligentSave({
      content: '# Test',
      content_type: 'note',
      context: { workspace: tmpDir },
    });

    expect(result.confirmation_needed).toBe(true);

    // Journal unchanged
    const ccContent = await fs.readFile(path.join(configDir, 'course_context.md'), 'utf-8');
    expect(ccContent).not.toContain('sparad:');
  });
});

// ============================================================================
// SOFT VALIDATION
// ============================================================================

describe('validateMetadata', () => {
  it('warns when course_instance is missing', () => {
    const metadata = { title: 'Test', type: 'reflection' };
    const warnings = validateMetadata(metadata, 'reflection');

    expect(warnings.some(w => w.code === 'MISSING_COURSE_INSTANCE')).toBe(true);
  });

  it('no warning when course_instance is present', () => {
    const metadata = { title: 'Test', type: 'reflection', course_instance: 'KURS101_2026' };
    const warnings = validateMetadata(metadata, 'reflection');

    expect(warnings.some(w => w.code === 'MISSING_COURSE_INSTANCE')).toBe(false);
  });

  it('warns about missing lesson for lesson_plan', () => {
    const metadata = { title: 'Test', type: 'lesson_plan', course_instance: 'X' };
    const warnings = validateMetadata(metadata, 'lesson_plan');

    expect(warnings.some(w => w.code === 'MISSING_LESSON')).toBe(true);
  });

  it('warns about missing learning_objectives for lesson_plan', () => {
    const metadata = { title: 'Test', type: 'lesson_plan', course_instance: 'X', lesson: 14 };
    const warnings = validateMetadata(metadata, 'lesson_plan');

    expect(warnings.some(w => w.code === 'MISSING_LEARNING_OBJECTIVES')).toBe(true);
  });

  it('no lesson warning for note type', () => {
    const metadata = { title: 'Test', type: 'note', course_instance: 'X' };
    const warnings = validateMetadata(metadata, 'note');

    expect(warnings.some(w => w.code === 'MISSING_LESSON')).toBe(false);
  });
});

// ============================================================================
// NEW CONTENT TYPES
// ============================================================================

describe('new content types — deep_analysis and material', () => {
  it('generates metadata for deep_analysis with active status', () => {
    const metadata = generateMetadata('# Deep analysis', 'deep_analysis', {
      course: 'KURS101_2026',
      lesson: 14,
      module: 'Immunförsvaret',
    });

    expect(metadata.type).toBe('deep_analysis');
    expect(metadata.status).toBe('active');
    expect(metadata.lesson).toBe(14);
    expect(metadata.module).toBe('Immunförsvaret');
  });

  it('generates metadata for material with draft status', () => {
    const metadata = generateMetadata('# Presentation', 'material', {
      course: 'KURS101_2026',
    });

    expect(metadata.type).toBe('material');
    expect(metadata.status).toBe('draft');
  });

  it('includes depth for reflections', () => {
    const metadata = generateMetadata('# Reflection', 'reflection', {
      course: 'KURS101_2026',
      depth: 'deep',
    });

    expect(metadata.depth).toBe('deep');
  });
});

// ============================================================================
// COURSE_V2 DIRECTORY SUGGESTIONS
// ============================================================================

describe('course_v2 directory suggestions', () => {
  it('suggests Swedish folder names when useV2 is true', () => {
    expect(suggestDirectory('reflection', '/workspace', true)).toBe('/workspace/Reflections/');
    expect(suggestDirectory('lesson_plan', '/workspace', true)).toBe('/workspace/Lesson_Plans/');
    expect(suggestDirectory('idea', '/workspace', true)).toBe('/workspace/Ideas/');
    expect(suggestDirectory('analysis', '/workspace', true)).toBe('/workspace/Analysis/');
    expect(suggestDirectory('decision', '/workspace', true)).toBe('/workspace/Decisions/');
  });

  it('suggests English folder names when useV2 is false', () => {
    expect(suggestDirectory('reflection', '/workspace', false)).toBe('/workspace/Reflections/');
    expect(suggestDirectory('lesson_plan', '/workspace', false)).toBe('/workspace/Lesson_Plans/');
  });

  it('falls back to default for unmapped v2 types', () => {
    expect(suggestDirectory('other', '/workspace', true)).toBe('/workspace/Misc/');
  });
});

// ============================================================================
// PROCESS LOG INTEGRATION
// ============================================================================

describe('intelligent_save — process log integration', () => {
  let plogTmpDir: string;

  beforeEach(async () => {
    plogTmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'teaching-suite-plog-'));
    setServerWorkspace(plogTmpDir);
  });

  afterEach(async () => {
    await fs.rm(plogTmpDir, { recursive: true, force: true });
  });

  it('appends planned event when saving lesson_plan in course_v2 workspace', async () => {
    // Set up course_v2 workspace
    const systemDir = path.join(plogTmpDir, '_system');
    await fs.mkdir(systemDir, { recursive: true });
    await initialiseProcessLog(plogTmpDir, 'TEST_101');

    const result = await intelligentSave({
      content: '# Lektion 14 — Immunförsvaret',
      content_type: 'lesson_plan',
      context: {
        workspace: plogTmpDir,
        course: 'TEST_101',
        lesson: 14,
        module: 'Immunförsvaret',
      },
      auto_confirm: true,
    });

    expect(result.success).toBe(true);

    const log = await readProcessLog(plogTmpDir);
    expect(log.entries.length).toBeGreaterThan(0);
    const event = log.entries[0].events[0];
    expect(event.type).toBe('planned');
    expect(event.file).toContain('Lesson_Plans/');
    expect(log.entries[0].lesson).toBe(14);
    expect(log.entries[0].module).toBe('Immunförsvaret');
  });

  it('appends reflected event with carry_forward_in for reflections', async () => {
    const systemDir = path.join(plogTmpDir, '_system');
    await fs.mkdir(systemDir, { recursive: true });
    await initialiseProcessLog(plogTmpDir, 'TEST_101');

    const result = await intelligentSave({
      content: '# Reflektion lektion 14\n\n## Carry-forward\nByt demo.',
      content_type: 'reflection',
      context: {
        workspace: plogTmpDir,
        course: 'TEST_101',
        lesson: 14,
        depth: 'standard',
      },
      auto_confirm: true,
    });

    expect(result.success).toBe(true);

    const log = await readProcessLog(plogTmpDir);
    const event = log.entries[0].events[0];
    expect(event.type).toBe('reflected');
    expect(event.depth).toBe('standard');
    expect(event.carry_forward_in).toContain('Reflections/');
  });

  it('does not append process log for non-v2 workspaces', async () => {
    // No _system/ directory — not a v2 workspace
    const result = await intelligentSave({
      content: '# Test',
      content_type: 'lesson_plan',
      context: { workspace: plogTmpDir },
      suggested_location: path.join(plogTmpDir, 'Plans'),
      auto_confirm: true,
    });

    expect(result.success).toBe(true);

    const log = await readProcessLog(plogTmpDir);
    expect(log.entries).toHaveLength(0);
  });

  it('does not append process log for types without event mapping', async () => {
    const systemDir = path.join(plogTmpDir, '_system');
    await fs.mkdir(systemDir, { recursive: true });
    await initialiseProcessLog(plogTmpDir, 'TEST_101');

    await intelligentSave({
      content: '# Just a note',
      content_type: 'note',
      context: { workspace: plogTmpDir, course: 'TEST_101' },
      auto_confirm: true,
    });

    const log = await readProcessLog(plogTmpDir);
    expect(log.entries).toHaveLength(0);
  });

  it('appends idea_captured event for idea content type', async () => {
    const systemDir = path.join(plogTmpDir, '_system');
    await fs.mkdir(systemDir, { recursive: true });
    await initialiseProcessLog(plogTmpDir, 'TEST_101');

    await intelligentSave({
      content: '# Ny idé om labbupplägg',
      content_type: 'idea',
      context: { workspace: plogTmpDir, course: 'TEST_101' },
      auto_confirm: true,
    });

    const log = await readProcessLog(plogTmpDir);
    expect(log.entries.length).toBeGreaterThan(0);
    expect(log.entries[0].events[0].type).toBe('idea_captured');
  });

  it('appends course_planning_stage event for course_plan', async () => {
    const systemDir = path.join(plogTmpDir, '_system');
    await fs.mkdir(systemDir, { recursive: true });
    await initialiseProcessLog(plogTmpDir, 'TEST_101');

    await intelligentSave({
      content: '# Kursplanering steg 1',
      content_type: 'course_plan',
      context: { workspace: plogTmpDir, course: 'TEST_101' },
      auto_confirm: true,
    });

    const log = await readProcessLog(plogTmpDir);
    expect(log.entries.length).toBeGreaterThan(0);
    expect(log.entries[0].events[0].type).toBe('course_planning_stage');
  });

  it('includes soft validation warnings in output', async () => {
    const result = await intelligentSave({
      content: '# Test plan',
      content_type: 'lesson_plan',
      context: { workspace: plogTmpDir },
    });

    // Should show warnings for missing course_instance, lesson, learning_objectives
    expect(result.content_warnings).toBeDefined();
    expect(result.content_warnings!.some(w => w.code === 'MISSING_COURSE_INSTANCE')).toBe(true);
    expect(result.content_warnings!.some(w => w.code === 'MISSING_LESSON')).toBe(true);
  });
});

// ============================================================================
// NEW CONTENT TYPES — content, recap, auto_log (Stage 2 of post-lesson-auto)
// ============================================================================

describe('suggestDirectory — post_lesson_auto content types', () => {
  it('routes content to Student_Materials/', () => {
    expect(suggestDirectory('content')).toBe('Student_Materials/');
  });

  it('routes recap to Student_Materials/', () => {
    expect(suggestDirectory('recap')).toBe('Student_Materials/');
  });

  it('routes auto_log to Analysis/', () => {
    expect(suggestDirectory('auto_log')).toBe('Analysis/');
  });
});

describe('generateMetadata — post_lesson_auto content types', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-04-20T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('content gets status: draft', () => {
    const metadata = generateMetadata('# Lesson content', 'content', {
      course: 'KURS201_2026_v2',
    });
    expect(metadata.type).toBe('content');
    expect(metadata.status).toBe('draft');
    expect(metadata.course_instance).toBe('KURS201_2026_v2');
  });

  it('recap gets status: draft', () => {
    const metadata = generateMetadata('# Recap', 'recap', {
      course: 'KURS201_2026_v2',
    });
    expect(metadata.type).toBe('recap');
    expect(metadata.status).toBe('draft');
  });

  it('auto_log gets status: draft', () => {
    const metadata = generateMetadata('# Auto-log', 'auto_log', {
      course: 'KURS201_2026_v2',
    });
    expect(metadata.type).toBe('auto_log');
    expect(metadata.status).toBe('draft');
  });
});

describe('validateMetadata — post_lesson_auto content types', () => {
  it('content warns when lesson_plan is missing', () => {
    const metadata = {
      type: 'content',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
    };
    const warnings = validateMetadata(metadata, 'content');
    expect(warnings.some(w => w.code === 'MISSING_LESSON_PLAN')).toBe(true);
  });

  it('content warns when transcripts is missing (A1 rule)', () => {
    const metadata = {
      type: 'content',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
      lesson_plan: 'Lesson_Plans/2026-04-20-topic.md',
    };
    const warnings = validateMetadata(metadata, 'content');
    expect(warnings.some(w => w.code === 'MISSING_TRANSCRIPTS')).toBe(true);
  });

  it('content passes with lesson_plan and transcripts present', () => {
    const metadata = {
      type: 'content',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
      lesson_plan: 'Lesson_Plans/2026-04-20-topic.md',
      transcripts: ['Data/Transcripts/t.txt'],
    };
    const warnings = validateMetadata(metadata, 'content');
    expect(warnings.some(w => w.code === 'MISSING_LESSON_PLAN')).toBe(false);
    expect(warnings.some(w => w.code === 'MISSING_TRANSCRIPTS')).toBe(false);
  });

  it('recap warns when lesson_plan is missing', () => {
    const metadata = {
      type: 'recap',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
    };
    const warnings = validateMetadata(metadata, 'recap');
    expect(warnings.some(w => w.code === 'MISSING_LESSON_PLAN')).toBe(true);
  });

  it('auto_log warns when lesson_plan is missing', () => {
    const metadata = {
      type: 'auto_log',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
    };
    const warnings = validateMetadata(metadata, 'auto_log');
    expect(warnings.some(w => w.code === 'MISSING_LESSON_PLAN')).toBe(true);
  });

  it('auto_log warns when data_quality is missing', () => {
    const metadata = {
      type: 'auto_log',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
      lesson_plan: 'Lesson_Plans/2026-04-20-topic.md',
    };
    const warnings = validateMetadata(metadata, 'auto_log');
    expect(warnings.some(w => w.code === 'MISSING_DATA_QUALITY')).toBe(true);
  });

  it('auto_log passes with lesson_plan and data_quality present', () => {
    const metadata = {
      type: 'auto_log',
      course_instance: 'KURS201_2026_v2',
      date: '2026-04-20',
      lesson_plan: 'Lesson_Plans/2026-04-20-topic.md',
      data_quality: { diarisation: 'ok', plan_match: 'high' },
    };
    const warnings = validateMetadata(metadata, 'auto_log');
    expect(warnings.some(w => w.code === 'MISSING_LESSON_PLAN')).toBe(false);
    expect(warnings.some(w => w.code === 'MISSING_DATA_QUALITY')).toBe(false);
  });
});
