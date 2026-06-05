import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { projectInit } from '../src/tools/setup/project-init.js';
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
// TYPE VALIDATION AND DEFAULTS (only 'course' supported; omitted → course)
// ============================================================================

describe('project_init — type validation and defaults', () => {
  it("rejects type 'lesson' (only 'course' is supported)", async () => {
    const projectPath = path.join(workspaceDir, 'legacy-lesson');
    const result = await projectInit({ project_path: projectPath, type: 'lesson' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it("rejects the internal 'course_v2' alias", async () => {
    const projectPath = path.join(workspaceDir, 'legacy-v2');
    const result = await projectInit({ project_path: projectPath, type: 'course_v2' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it('defaults to the course (v3) structure when type is omitted', async () => {
    const projectPath = path.join(workspaceDir, 'no-type');
    const result = await projectInit({ project_path: projectPath });

    expect(result.success).toBe(true);
    expect(result.folders_created).toContain('_config');
    expect(result.folders_created).toContain('Reflections');
  });

  it('creates project_state.json', async () => {
    const projectPath = path.join(workspaceDir, 'with-state');
    const result = await projectInit({ project_path: projectPath, name: 'Test Project' });

    expect(result.success).toBe(true);
    const stateContent = await fs.readFile(path.join(projectPath, 'project_state.json'), 'utf-8');
    const state = JSON.parse(stateContent);
    expect(state.name).toBe('Test Project');
    expect(state.status).toBe('planning');
  });

  it('creates sources.yaml with project key', async () => {
    const projectPath = path.join(workspaceDir, 'with-sources');
    await projectInit({ project_path: projectPath, name: 'Test' });

    const sourcesContent = await fs.readFile(path.join(projectPath, 'sources.yaml'), 'utf-8');
    expect(sourcesContent).toContain('project:');
    expect(sourcesContent).toContain('sources:');
  });
});

// ============================================================================
// COURSE STRUCTURE (type 'course' now creates v2 structure)
// ============================================================================

describe('project_init — course type creates v2 structure', () => {
  it('creates _system/ with config, logs, and methodology', async () => {
    const projectPath = path.join(workspaceDir, 'bio-course');
    const result = await projectInit({
      project_path: projectPath,
      name: 'Biologi 2',
      type: 'course',
      course: 'KURS101_2026',
    });

    expect(result.success).toBe(true);
    expect(result.folders_created).toContain('_config');
    expect(result.folders_created).toContain('_system');

    // _config and _system/logs are present in v3 structure
    for (const dir of ['_config', '_system/logs']) {
      const stat = await fs.stat(path.join(projectPath, dir));
      expect(stat.isDirectory()).toBe(true);
    }
  });

  it('creates _config/ with course_context.md, CLAUDE.md, and output_targets.yaml', async () => {
    const projectPath = path.join(workspaceDir, 'config-test');
    await projectInit({
      project_path: projectPath,
      name: 'Biologi 2',
      type: 'course',
      course: 'KURS101_2026',
    });

    const ccContent = await fs.readFile(
      path.join(projectPath, '_config', 'course_context.md'), 'utf-8'
    );
    expect(ccContent).toContain('course_instance: KURS101_2026');
    expect(ccContent).toContain('## Journal');

    // CLAUDE.md in both root and _config/
    const claudeContent = await fs.readFile(
      path.join(projectPath, 'CLAUDE.md'), 'utf-8'
    );
    expect(claudeContent).toContain('KURS101_2026');

    const claudeConfigContent = await fs.readFile(
      path.join(projectPath, '_config', 'CLAUDE.md'), 'utf-8'
    );
    expect(claudeConfigContent).toBe(claudeContent);

    const otContent = await fs.readFile(
      path.join(projectPath, '_config', 'output_targets.yaml'), 'utf-8'
    );
    expect(otContent).toContain('targets:');
  });

  it('creates v3 Swedish-nested content folders', async () => {
    const projectPath = path.join(workspaceDir, 'folders-test');
    const result = await projectInit({ project_path: projectPath, type: 'course' });

    expect(result.success).toBe(true);

    const expectedFolders = [
      'Reflections', 'Reflections/Bryggor',
      'Lesson_Plans', 'Ideas', 'Decisions', 'Memos', 'Planning', 'Analysis',
      'Data/Transkript', 'Data/Labbdata', 'Data/Elevreflektioner', 'Data/Teacher_Insights',
      'Styrdokument', 'Styrdokument/Tolkning',
      'Material/WIP',
      'Material/Klart/Presentationer', 'Material/Klart/Övningar', 'Material/Klart/Övrigt',
      'Material/Resurser', 'Material/Uppgifter', 'Material/Sammanfattningar',
      'Exams/Formativa', 'Exams/Summativa',
      'Student_Materials',
    ];

    for (const folder of expectedFolders) {
      const dir = path.join(projectPath, folder);
      const stat = await fs.stat(dir);
      expect(stat.isDirectory()).toBe(true);
    }
  });

  it('places methodology at workspace-root <workspace>/Teaching_Suite/methodology/ (v0.6.0)', async () => {
    const projectPath = path.join(workspaceDir, 'course-methodology');
    const result = await projectInit({ project_path: projectPath, type: 'course' });

    expect(result.success).toBe(true);
    expect(result.methodology_docs.length).toBeGreaterThan(0);

    // Central methodology lives at the WORKSPACE ROOT, not inside the
    // course folder. project_init creates Teaching_Suite/methodology/ once;
    // subsequent course inits reuse it.
    const centralDir = path.join(workspaceDir, 'Teaching_Suite', 'methodology');

    for (const sub of ['lesson', 'course', 'profession', 'bridges', 'reflection_frameworks']) {
      const files = await fs.readdir(path.join(centralDir, sub));
      expect(files.length).toBeGreaterThan(0);
    }

    const synStat = await fs.stat(path.join(centralDir, 'synlighetsprincip.md'));
    expect(synStat.isFile()).toBe(true);

    // Per-course _system/methodology/ no longer created in v0.6.0
    await expect(
      fs.stat(path.join(projectPath, '_system', 'methodology'))
    ).rejects.toThrow();

    // Version metadata written
    const meta = JSON.parse(
      await fs.readFile(path.join(workspaceDir, 'Teaching_Suite', '_meta', 'methodology_version.json'), 'utf-8')
    );
    expect(meta.version).toBeTruthy();
    expect(meta.copied_at).toBeTruthy();

    // Result reports the location so the caller (Cowork) can surface it
    expect(result.central_methodology).toBeDefined();
    expect(result.central_methodology!.action).toBe('created');
    expect(result.central_methodology!.path).toContain('Teaching_Suite');
    expect(result.central_methodology!.path).toContain('methodology');
    expect(result.central_methodology!.message).toBeTruthy();
  });

  it('creates process_log.yaml', async () => {
    const projectPath = path.join(workspaceDir, 'log-test');
    await projectInit({ project_path: projectPath, type: 'course', course: 'TEST_101' });

    const logContent = await fs.readFile(
      path.join(projectPath, '_system', 'logs', 'process_log.yaml'), 'utf-8'
    );
    expect(logContent).toContain('course_instance: TEST_101');
  });

  it('places project_state.json and sources.yaml in project root', async () => {
    const projectPath = path.join(workspaceDir, 'state-test');
    const result = await projectInit({ project_path: projectPath, type: 'course', course: 'TEST_101' });

    expect(result.success).toBe(true);

    const state = JSON.parse(await fs.readFile(path.join(projectPath, 'project_state.json'), 'utf-8'));
    expect(state.course).toBe('TEST_101');

    const sources = await fs.readFile(path.join(projectPath, 'sources.yaml'), 'utf-8');
    expect(sources).toContain('project:');
  });

  it('does not create deprecated structure (_system/config/, Input/, Process/, Output/)', async () => {
    const projectPath = path.join(workspaceDir, 'no-legacy');
    await projectInit({ project_path: projectPath, type: 'course' });

    // _system/config/ replaced by _config/, the I/P/O hierarchy never existed in v3
    for (const dir of ['_system/config', 'Input', 'Process', 'Output']) {
      await expect(fs.stat(path.join(projectPath, dir))).rejects.toThrow();
    }
  });

  it('uses project name in course_context.md', async () => {
    const projectPath = path.join(workspaceDir, 'named-course');
    await projectInit({
      project_path: projectPath,
      name: 'Biologi 2',
      type: 'course',
      course: 'KURS101_2026',
    });

    const ccContent = await fs.readFile(
      path.join(projectPath, '_config', 'course_context.md'), 'utf-8'
    );
    expect(ccContent).toContain('Biologi 2');
  });
});

// ============================================================================
// V3 COURSE STRUCTURE (_system/, Swedish folder names)
// ============================================================================

describe('project_init — v3 course structure', () => {
  it('creates _config and _system/logs at v3 canonical paths', async () => {
    const projectPath = path.join(workspaceDir, 'v2-course');
    const result = await projectInit({
      project_path: projectPath,
      name: 'Biologi 2',
      type: 'course',
      course: 'KURS101_2026',
    });

    expect(result.success).toBe(true);
    expect(result.folders_created).toContain('_config');
    expect(result.folders_created).toContain('_system');

    for (const dir of ['_config', '_system/logs']) {
      const stat = await fs.stat(path.join(projectPath, dir));
      expect(stat.isDirectory()).toBe(true);
    }
  });

  it('creates v3 Swedish-nested content folders', async () => {
    const projectPath = path.join(workspaceDir, 'v2-folders');
    const result = await projectInit({ project_path: projectPath, type: 'course' });

    expect(result.success).toBe(true);

    const expectedFolders = [
      'Reflections', 'Reflections/Bryggor',
      'Lesson_Plans', 'Ideas', 'Decisions', 'Memos', 'Planning', 'Analysis',
      'Data/Transkript', 'Data/Labbdata', 'Data/Elevreflektioner', 'Data/Teacher_Insights',
      'Styrdokument', 'Styrdokument/Tolkning',
      'Material/WIP',
      'Material/Klart/Presentationer', 'Material/Klart/Övningar', 'Material/Klart/Övrigt',
      'Material/Resurser', 'Material/Uppgifter', 'Material/Sammanfattningar',
      'Exams/Formativa', 'Exams/Summativa',
      'Student_Materials',
      // Profession/Manifest/ + Profession/Termin/ NOT created here — workspace-root,
      // separate init_profession tool.
    ];

    for (const folder of expectedFolders) {
      const dir = path.join(projectPath, folder);
      const stat = await fs.stat(dir);
      expect(stat.isDirectory()).toBe(true);
    }
  });

  it('creates _config/ with course_context.md, CLAUDE.md, and output_targets.yaml', async () => {
    const projectPath = path.join(workspaceDir, 'v2-config');
    const result = await projectInit({
      project_path: projectPath,
      name: 'Biologi 2',
      type: 'course',
      course: 'KURS101_2026',
    });

    expect(result.success).toBe(true);

    // course_context.md
    const ccContent = await fs.readFile(
      path.join(projectPath, '_config', 'course_context.md'), 'utf-8'
    );
    expect(ccContent).toContain('course_instance: KURS101_2026');
    expect(ccContent).toContain('metadata_version: "1.0"');
    expect(ccContent).toContain('Biologi 2');
    expect(ccContent).toContain('## Journal');

    // CLAUDE.md in both root and _config/
    const claudeContent = await fs.readFile(
      path.join(projectPath, 'CLAUDE.md'), 'utf-8'
    );
    expect(claudeContent).toContain('KURS101_2026');

    const claudeConfigContent = await fs.readFile(
      path.join(projectPath, '_config', 'CLAUDE.md'), 'utf-8'
    );
    expect(claudeConfigContent).toBe(claudeContent);

    // output_targets.yaml
    const otContent = await fs.readFile(
      path.join(projectPath, '_config', 'output_targets.yaml'), 'utf-8'
    );
    expect(otContent).toContain('KURS101_2026');
    expect(otContent).toContain('targets:');
  });

  it('CLAUDE.md contains workflow instructions for Desktop auto-discovery', async () => {
    const projectPath = path.join(workspaceDir, 'v2-claude-workflow');
    await projectInit({
      project_path: projectPath,
      name: 'Kemi 2',
      type: 'course',
      course: 'KURS401_2026',
    });

    const claudeContent = await fs.readFile(
      path.join(projectPath, 'CLAUDE.md'), 'utf-8'
    );

    // Must tell Desktop to run context_load at session start
    expect(claudeContent).toContain('context_load');
    // Must mention methodology loading
    expect(claudeContent).toContain('load_methodology');
    // Must contain course ID
    expect(claudeContent).toContain('KURS401_2026');
  });

  it('CLAUDE.md references post_lesson_auto for after-lesson workflow', async () => {
    const projectPath = path.join(workspaceDir, 'v2-claude-auto');
    await projectInit({
      project_path: projectPath,
      name: 'Kemi 2',
      type: 'course',
      course: 'KURS401_2026',
    });

    const claudeContent = await fs.readFile(
      path.join(projectPath, 'CLAUDE.md'), 'utf-8'
    );

    // Must mention the new post_lesson_auto process for after-lesson automation
    expect(claudeContent).toContain('post_lesson_auto');
    // Must still mention post_lesson_reflection for the guided Gibbs dialog
    expect(claudeContent).toContain('post_lesson_reflection');
  });

  it('places methodology at workspace-root <workspace>/Teaching_Suite/methodology/ (v0.6.0)', async () => {
    const projectPath = path.join(workspaceDir, 'v2-methodology');
    const result = await projectInit({ project_path: projectPath, type: 'course' });

    expect(result.success).toBe(true);
    expect(result.methodology_docs.length).toBeGreaterThan(0);

    const centralDir = path.join(workspaceDir, 'Teaching_Suite', 'methodology');

    for (const sub of ['lesson', 'course', 'profession', 'bridges', 'reflection_frameworks']) {
      const files = await fs.readdir(path.join(centralDir, sub));
      expect(files.length).toBeGreaterThan(0);
    }

    // Per-course _system/methodology/ no longer created
    await expect(
      fs.stat(path.join(projectPath, '_system', 'methodology'))
    ).rejects.toThrow();
  });

  it('reuses existing central methodology when running project_init for second course', async () => {
    // First course init creates Teaching_Suite/methodology/
    await projectInit({
      project_path: path.join(workspaceDir, 'course-1'),
      type: 'course',
    });

    // Second course init: no copy work needed, central already exists
    const result = await projectInit({
      project_path: path.join(workspaceDir, 'course-2'),
      type: 'course',
    });

    expect(result.success).toBe(true);
    // Central methodology is shared between courses
    const centralDir = path.join(workspaceDir, 'Teaching_Suite', 'methodology');
    const stat = await fs.stat(centralDir);
    expect(stat.isDirectory()).toBe(true);
  });
});

// ============================================================================
// force_update flow — explicit overwrite of central methodology
// ============================================================================

describe('project_init — force_update flow', () => {
  it('force_update=false (default): reports update_available without overwriting', async () => {
    // First init creates central methodology
    await projectInit({
      project_path: path.join(workspaceDir, 'course-a'),
      type: 'course',
    });

    // Manually set local version to an older value to simulate MCP version bump
    const versionFile = path.join(workspaceDir, 'Teaching_Suite', '_meta', 'methodology_version.json');
    const meta = JSON.parse(await fs.readFile(versionFile, 'utf-8'));
    const originalVersion = meta.version;
    meta.version = '0.0.1'; // pretend the local copy is way older
    await fs.writeFile(versionFile, JSON.stringify(meta, null, 2), 'utf-8');

    // Second init without force_update — should detect mismatch but NOT overwrite
    const result = await projectInit({
      project_path: path.join(workspaceDir, 'course-b'),
      type: 'course',
    });

    expect(result.success).toBe(true);
    expect(result.central_methodology?.action).toBe('update_available');
    expect(result.central_methodology?.backup_path).toBeUndefined();

    // Local version still '0.0.1' — no overwrite happened
    const metaAfter = JSON.parse(await fs.readFile(versionFile, 'utf-8'));
    expect(metaAfter.version).toBe('0.0.1');
    expect(originalVersion).not.toBe('0.0.1'); // sanity: real version differs
  });

  it('force_update=true with version mismatch: backs up + overwrites + reports backup_path', async () => {
    // First init creates central methodology
    await projectInit({
      project_path: path.join(workspaceDir, 'course-a'),
      type: 'course',
    });

    // Stamp a local edit so we can verify the backup contains the old content
    const editedFile = path.join(workspaceDir, 'Teaching_Suite', 'methodology', 'lesson', 'pre_lesson.md');
    const originalContent = await fs.readFile(editedFile, 'utf-8');
    await fs.writeFile(editedFile, originalContent + '\n\n<!-- LOCAL EDIT -->\n', 'utf-8');

    // Make local version look older to trigger the update branch
    const versionFile = path.join(workspaceDir, 'Teaching_Suite', '_meta', 'methodology_version.json');
    const meta = JSON.parse(await fs.readFile(versionFile, 'utf-8'));
    meta.version = '0.0.1';
    await fs.writeFile(versionFile, JSON.stringify(meta, null, 2), 'utf-8');

    // Second init WITH force_update=true — should back up + overwrite
    const result = await projectInit({
      project_path: path.join(workspaceDir, 'course-b'),
      type: 'course',
      force_update: true,
    });

    expect(result.success).toBe(true);
    expect(result.central_methodology?.action).toBe('updated');
    expect(result.central_methodology?.backup_path).toBeTruthy();

    // Backup folder exists and contains the local edit we stamped
    const backupPath = result.central_methodology!.backup_path!;
    const backedUpFile = path.join(backupPath, 'lesson', 'pre_lesson.md');
    const backedUpContent = await fs.readFile(backedUpFile, 'utf-8');
    expect(backedUpContent).toContain('<!-- LOCAL EDIT -->');

    // Fresh copy at canonical location does NOT contain the local edit
    const freshContent = await fs.readFile(editedFile, 'utf-8');
    expect(freshContent).not.toContain('<!-- LOCAL EDIT -->');

    // Version metadata bumped back to repo version
    const metaAfter = JSON.parse(await fs.readFile(versionFile, 'utf-8'));
    expect(metaAfter.version).not.toBe('0.0.1');
  });

  it('force_update=true with version match: no-op (action=unchanged)', async () => {
    await projectInit({
      project_path: path.join(workspaceDir, 'course-a'),
      type: 'course',
    });

    // Re-init with force_update — no version mismatch, nothing to do
    const result = await projectInit({
      project_path: path.join(workspaceDir, 'course-b'),
      type: 'course',
      force_update: true,
    });

    expect(result.success).toBe(true);
    expect(result.central_methodology?.action).toBe('unchanged');
    expect(result.central_methodology?.backup_path).toBeUndefined();
  });

  it('force_update=true with no central methodology yet: creates fresh (action=created)', async () => {
    const result = await projectInit({
      project_path: path.join(workspaceDir, 'course-fresh'),
      type: 'course',
      force_update: true,
    });

    expect(result.success).toBe(true);
    expect(result.central_methodology?.action).toBe('created');
    expect(result.central_methodology?.backup_path).toBeUndefined();
  });

  it('does not create deprecated structure (_system/config/, Input/Process/Output/)', async () => {
    const projectPath = path.join(workspaceDir, 'v2-no-legacy');
    await projectInit({ project_path: projectPath, type: 'course' });

    // _system/config/ replaced by _config/ in v3
    for (const dir of ['_system/config', 'Input', 'Process', 'Output']) {
      await expect(fs.stat(path.join(projectPath, dir))).rejects.toThrow();
    }
  });

  it('does not create _system/structure/ in Phase 0', async () => {
    const projectPath = path.join(workspaceDir, 'v2-no-structure');
    await projectInit({ project_path: projectPath, type: 'course' });

    await expect(fs.stat(path.join(projectPath, '_system', 'structure'))).rejects.toThrow();
  });

  it('still creates project_state.json and sources.yaml in project root', async () => {
    const projectPath = path.join(workspaceDir, 'v2-state');
    const result = await projectInit({
      project_path: projectPath,
      type: 'course',
      course: 'TEST_V2',
    });

    expect(result.success).toBe(true);

    const state = JSON.parse(await fs.readFile(path.join(projectPath, 'project_state.json'), 'utf-8'));
    expect(state.type).toBe('course');
    expect(state.methodology_version).toBe('3.0');

    const sources = await fs.readFile(path.join(projectPath, 'sources.yaml'), 'utf-8');
    expect(sources).toContain('teaching-suite v3.0');
  });
});

// ============================================================================
// BACKWARD COMPATIBILITY
// ============================================================================

describe('project_init — backward compatibility', () => {
  it('type course creates the v3 structure', async () => {
    const projectPath = path.join(workspaceDir, 'compat-course');
    const result = await projectInit({ project_path: projectPath, type: 'course' });

    expect(result.success).toBe(true);
    // v3 structure: _config/ + _system/logs/, no Input/Process/Output/
    expect(result.folders_created).toContain('_config');
    expect(result.folders_created).toContain('_system');
    expect(result.folders_created).toContain('Reflections');
    expect(result.folders_created).not.toContain('Input');
  });
});

// ============================================================================
// VALIDATION
// ============================================================================

describe('project_init — validation', () => {
  it('rejects path outside workspace', async () => {
    const result = await projectInit({ project_path: '/tmp/outside-workspace' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('outside the allowed workspace');
  });

  it('rejects empty project_path', async () => {
    const result = await projectInit({ project_path: '' });

    expect(result.success).toBe(false);
  });

  it('rejects missing project_path', async () => {
    const result = await projectInit({});

    expect(result.success).toBe(false);
  });
});
