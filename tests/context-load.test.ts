import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as yaml from 'js-yaml';
import { contextLoad } from '../src/tools/mechanical/context-load.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

// ============================================================================
// TEST SETUP
// ============================================================================

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'teaching-suite-test-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// ============================================================================
// FULL _config/ (course project)
// ============================================================================

describe('context_load — full _config/', () => {
  it('returns all files when _config/ exists', async () => {
    // Create _config/
    const configDir = path.join(workspaceDir, '_config');
    await fs.mkdir(configDir, { recursive: true });

    await fs.writeFile(
      path.join(configDir, 'CLAUDE.md'),
      '# CLAUDE.md — TEST_101\n\n## Arbetssätt\n- Ladda kurskontext vid sessionstart',
      'utf-8'
    );

    await fs.writeFile(
      path.join(configDir, 'course_context.md'),
      '---\ntype: course_context\ncourse: TEST_101\n---\n\n# Kurskontext\n\n## Mission\nTest mission',
      'utf-8'
    );

    // Project root files
    await fs.writeFile(
      path.join(workspaceDir, 'project_state.json'),
      JSON.stringify({ name: 'Test Course', status: 'active', course: 'TEST_101' }),
      'utf-8'
    );

    const sourcesData = {
      project: { name: 'Test Course' },
      sources: {
        kursplan: { role: 'syllabus', path: 'Input/Styrdokument/kursplan.pdf' },
        labbok: { role: 'material', path: 'Input/Material/labbok.pdf' },
      },
    };
    await fs.writeFile(
      path.join(workspaceDir, 'sources.yaml'),
      yaml.dump(sourcesData),
      'utf-8'
    );

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(true);
    expect(result.claude_md).toContain('CLAUDE.md — TEST_101');
    expect(result.claude_md).toContain('Arbetssätt');
    expect(result.course_context).toContain('course_context');
    expect(result.course_context).toContain('TEST_101');
    expect(result.project_state).toEqual({ name: 'Test Course', status: 'active', course: 'TEST_101' });
    expect(result.sources_summary).toContain('2 sources tracked');
    expect(result.sources_summary).toContain('syllabus: 1');
    expect(result.sources_summary).toContain('material: 1');
  });

  it('returns learning_objectives from _config/learning_objectives.yaml', async () => {
    const configDir = path.join(workspaceDir, '_config');
    await fs.mkdir(configDir, { recursive: true });

    const loYaml = `course_code: KURS301
course_instance: KURS101_2026
objectives:
  LO1:
    description: "Describe inflammation cascade"
    bloom: understand
  LO15:
    description: "Explain vaccination principle"
    bloom: understand
`;
    await fs.writeFile(path.join(configDir, 'learning_objectives.yaml'), loYaml, 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.learning_objectives).not.toBeNull();
    expect(result.learning_objectives!.course_code).toBe('KURS301');
    const objectives = result.learning_objectives!.objectives as Record<string, unknown>;
    expect(objectives).toHaveProperty('LO1');
    expect(objectives).toHaveProperty('LO15');
  });

  it('returns course goals from course_context.md', async () => {
    const configDir = path.join(workspaceDir, '_config');
    await fs.mkdir(configDir, { recursive: true });

    const courseContext = `---
type: course_context
course: KURS101_2026
---

# Kurskontext — Biologi 2

## Mission
Förstå ekologi och evolution

## Goals
- G1: Ekosystem och deras dynamik
- G2: Evolutionära processer

## Learning Objectives
- LO1: Förklara näringskedjor
- LO2: Beskriva naturligt urval

## Journal
- 2026-03-15: Projekt initierat.
`;
    await fs.writeFile(path.join(configDir, 'course_context.md'), courseContext, 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.course_context).toContain('G1: Ekosystem');
    expect(result.course_context).toContain('LO1: Förklara');
    expect(result.course_context).toContain('Journal');
  });
});

// ============================================================================
// NO _config/ (legacy project)
// ============================================================================

describe('context_load — no _config/', () => {
  it('returns has_config: false with null values', async () => {
    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(false);
    expect(result.claude_md).toBeNull();
    expect(result.course_context).toBeNull();
    expect(result.learning_objectives).toBeNull();
    expect(result.project_state).toBeNull();
    expect(result.sources_summary).toBeNull();
  });

  it('returns project_state from root even without _config/', async () => {
    await fs.writeFile(
      path.join(workspaceDir, 'project_state.json'),
      JSON.stringify({ name: 'Legacy Project', status: 'planning' }),
      'utf-8'
    );

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(false);
    expect(result.claude_md).toBeNull();
    expect(result.project_state).toEqual({ name: 'Legacy Project', status: 'planning' });
  });

  it('returns sources_summary from root even without _config/', async () => {
    const sourcesData = {
      project: { name: 'Legacy' },
      sources: {
        notes: { role: 'notes', path: 'Notes/n1.md' },
      },
    };
    await fs.writeFile(
      path.join(workspaceDir, 'sources.yaml'),
      yaml.dump(sourcesData),
      'utf-8'
    );

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(false);
    expect(result.sources_summary).toContain('1 sources tracked');
  });
});

// ============================================================================
// PARTIAL _config/
// ============================================================================

describe('context_load — partial _config/', () => {
  it('returns available files when only CLAUDE.md exists', async () => {
    const configDir = path.join(workspaceDir, '_config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(path.join(configDir, 'CLAUDE.md'), '# Instructions', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(true);
    expect(result.claude_md).toBe('# Instructions');
    expect(result.course_context).toBeNull();
  });

  it('returns available files when only course_context.md exists', async () => {
    const configDir = path.join(workspaceDir, '_config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(path.join(configDir, 'course_context.md'), '---\ntype: course_context\n---\n# Context', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(true);
    expect(result.claude_md).toBeNull();
    expect(result.course_context).toContain('course_context');
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe('context_load — edge cases', () => {
  it('handles malformed project_state.json', async () => {
    await fs.writeFile(path.join(workspaceDir, 'project_state.json'), 'not json{{{', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.project_state).toBeNull();
  });

  it('handles malformed sources.yaml', async () => {
    await fs.writeFile(path.join(workspaceDir, 'sources.yaml'), '{{{{not yaml', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.sources_summary).toBeNull();
  });

  it('handles empty sources', async () => {
    const sourcesData = {
      project: { name: 'Empty' },
      sources: {},
    };
    await fs.writeFile(
      path.join(workspaceDir, 'sources.yaml'),
      yaml.dump(sourcesData),
      'utf-8'
    );

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.sources_summary).toBe('No sources tracked.');
  });
});

// ============================================================================
// COURSE_V2 — _system/config/ support
// ============================================================================

describe('context_load — course_v2 (_system/config/)', () => {
  it('reads from _system/config/ when it exists', async () => {
    const configDir = path.join(workspaceDir, '_system', 'config');
    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(path.join(configDir, 'CLAUDE.md'), '# V2 Instructions', 'utf-8');
    await fs.writeFile(path.join(configDir, 'course_context.md'), '---\ncourse_instance: TEST\n---\n# V2 Context', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_config).toBe(true);
    expect(result.config_source).toBe('_system/config');
    expect(result.claude_md).toContain('V2 Instructions');
    expect(result.course_context).toContain('V2 Context');
  });

  it('prefers _system/config/ over _config/', async () => {
    // Create both
    const v2Dir = path.join(workspaceDir, '_system', 'config');
    const legacyDir = path.join(workspaceDir, '_config');
    await fs.mkdir(v2Dir, { recursive: true });
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.writeFile(path.join(v2Dir, 'CLAUDE.md'), '# V2', 'utf-8');
    await fs.writeFile(path.join(legacyDir, 'CLAUDE.md'), '# Legacy', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.config_source).toBe('_system/config');
    expect(result.claude_md).toContain('V2');
  });

  it('falls back to _config/ when _system/config/ does not exist', async () => {
    const legacyDir = path.join(workspaceDir, '_config');
    await fs.mkdir(legacyDir, { recursive: true });
    await fs.writeFile(path.join(legacyDir, 'CLAUDE.md'), '# Legacy', 'utf-8');

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.config_source).toBe('_config');
    expect(result.claude_md).toContain('Legacy');
  });

  it('includes process_log_summary for v2 workspaces', async () => {
    const configDir = path.join(workspaceDir, '_system', 'config');
    await fs.mkdir(configDir, { recursive: true });

    // Create a process log with entries
    const { initialiseProcessLog, appendProcessEvent } = await import('../src/utils/process-log.js');
    await initialiseProcessLog(workspaceDir, 'TEST_101');
    await appendProcessEvent({
      workspace: workspaceDir,
      event: {
        type: 'planned',
        file: 'Lesson_Plans/l14.md',
        timestamp: '2026-04-04T10:00:00.000Z',
      },
      lesson: 14,
    });
    // Create a reflection file with ## Carry-forward section
    const reflDir = path.join(workspaceDir, 'Reflections');
    await fs.mkdir(reflDir, { recursive: true });
    await fs.writeFile(
      path.join(reflDir, 'r14.md'),
      '---\ntype: reflection\n---\n\n# Reflektion lektion 14\n\nBra lektion.\n\n## Carry-forward\n\nByt demo till interaktiv modell. Eleverna tappade fokus efter 15 min.\n\n## Övrigt\n\nInget mer.\n',
      'utf-8'
    );

    await appendProcessEvent({
      workspace: workspaceDir,
      event: {
        type: 'reflected',
        file: 'Reflections/r14.md',
        timestamp: '2026-04-04T15:00:00.000Z',
        carry_forward_in: 'Reflections/r14.md',
      },
      lesson: 14,
    });

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.process_log_summary).toBeDefined();
    expect(result.process_log_summary).toContain('planned: 1');
    expect(result.process_log_summary).toContain('reflected: 1');

    // Carry-forward extracted from file
    expect(result.carry_forward).toBeDefined();
    expect(result.carry_forward!.file).toBe('Reflections/r14.md');
    expect(result.carry_forward!.lesson).toBe(14);
    expect(result.carry_forward!.content).toContain('Byt demo till interaktiv modell');
    expect(result.carry_forward!.content).not.toContain('Övrigt');
  });

  it('extracts carry-forward from numbered Gibbs heading (## 6. Carry-forward)', async () => {
    const configDir = path.join(workspaceDir, '_system', 'config');
    await fs.mkdir(configDir, { recursive: true });

    const reflDir = path.join(workspaceDir, 'Reflections');
    await fs.mkdir(reflDir, { recursive: true });
    await fs.writeFile(
      path.join(reflDir, 'r15.md'),
      '# Reflektion\n\n## 5. Conclusion\n\nBra.\n\n## 6. Carry-forward\n\nAnvänd interaktiv demo nästa gång.\n',
      'utf-8'
    );

    const { initialiseProcessLog, appendProcessEvent } = await import('../src/utils/process-log.js');
    await initialiseProcessLog(workspaceDir, 'TEST_101');
    await appendProcessEvent({
      workspace: workspaceDir,
      event: {
        type: 'reflected',
        file: 'Reflections/r15.md',
        timestamp: '2026-04-10T15:00:00.000Z',
        carry_forward_in: 'Reflections/r15.md',
      },
      lesson: 15,
    });

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.carry_forward).toBeDefined();
    expect(result.carry_forward!.content).toContain('interaktiv demo');
  });

  it('returns carry_forward with fallback when file is missing', async () => {
    const configDir = path.join(workspaceDir, '_system', 'config');
    await fs.mkdir(configDir, { recursive: true });

    const { initialiseProcessLog, appendProcessEvent } = await import('../src/utils/process-log.js');
    await initialiseProcessLog(workspaceDir, 'TEST_101');
    await appendProcessEvent({
      workspace: workspaceDir,
      event: {
        type: 'reflected',
        file: 'Reflections/does_not_exist.md',
        timestamp: '2026-04-04T15:00:00.000Z',
        carry_forward_in: 'Reflections/does_not_exist.md',
      },
      lesson: 14,
    });

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.carry_forward).toBeDefined();
    expect(result.carry_forward!.content).toContain('File not found');
  });

  it('returns carry_forward with fallback when section is missing', async () => {
    const configDir = path.join(workspaceDir, '_system', 'config');
    await fs.mkdir(configDir, { recursive: true });

    // File exists but no ## Carry-forward section
    const reflDir = path.join(workspaceDir, 'Reflections');
    await fs.mkdir(reflDir, { recursive: true });
    await fs.writeFile(
      path.join(reflDir, 'no_cf.md'),
      '# Reflektion\n\nBra lektion, inget carry-forward.\n',
      'utf-8'
    );

    const { initialiseProcessLog, appendProcessEvent } = await import('../src/utils/process-log.js');
    await initialiseProcessLog(workspaceDir, 'TEST_101');
    await appendProcessEvent({
      workspace: workspaceDir,
      event: {
        type: 'reflected',
        file: 'Reflections/no_cf.md',
        timestamp: '2026-04-04T15:00:00.000Z',
        carry_forward_in: 'Reflections/no_cf.md',
      },
      lesson: 14,
    });

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.carry_forward).toBeDefined();
    expect(result.carry_forward!.content).toContain('No ## Carry-forward section');
  });

  it('returns null carry_forward when no carry-forward in process log', async () => {
    const configDir = path.join(workspaceDir, '_system', 'config');
    await fs.mkdir(configDir, { recursive: true });

    const { initialiseProcessLog, appendProcessEvent } = await import('../src/utils/process-log.js');
    await initialiseProcessLog(workspaceDir, 'TEST_101');
    await appendProcessEvent({
      workspace: workspaceDir,
      event: {
        type: 'planned',
        file: 'Lesson_Plans/l14.md',
        timestamp: '2026-04-04T10:00:00.000Z',
      },
      lesson: 14,
    });

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.carry_forward).toBeNull();
  });

  it('returns null carry_forward and process_log_summary for legacy workspaces', async () => {
    const legacyDir = path.join(workspaceDir, '_config');
    await fs.mkdir(legacyDir, { recursive: true });

    const result = await contextLoad({ workspace: workspaceDir });

    expect(result.process_log_summary).toBeNull();
    expect(result.carry_forward).toBeNull();
  });
});

// ============================================================================
// VALIDATION
// ============================================================================

describe('context_load — validation', () => {
  it('rejects path outside workspace', async () => {
    const result = await contextLoad({ workspace: '/tmp/outside-workspace' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('outside the allowed workspace');
  });

  it('rejects empty workspace', async () => {
    const result = await contextLoad({ workspace: '' });

    expect(result.success).toBe(false);
  });

  it('rejects missing workspace', async () => {
    const result = await contextLoad({});

    expect(result.success).toBe(false);
  });
});
