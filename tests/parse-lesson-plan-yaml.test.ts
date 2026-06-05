import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { parseLessonPlanYaml } from '../src/tools/mechanical/parse-lesson-plan-yaml.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'parse-plan-yaml-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function writePlan(content: string, name = 'plan.md'): Promise<string> {
  const filePath = path.join(workspaceDir, name);
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

// ============================================================================
// FRONTMATTER PARSING
// ============================================================================

describe('parse_lesson_plan_yaml — frontmatter parsing', () => {
  it('parses frontmatter with simple fields', async () => {
    const filePath = await writePlan(
      '---\n' +
      'type: lesson_plan\n' +
      'course: KURS201_2026\n' +
      'date: 2026-04-23\n' +
      'duration: 195\n' +
      '---\n' +
      '# Lektionsplan\n\nBody content here.\n',
    );

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_frontmatter).toBe(true);
    expect(result.frontmatter).toEqual({
      type: 'lesson_plan',
      course: 'KURS201_2026',
      date: '2026-04-23',
      duration: 195,
    });
  });

  it('parses uppgifter array (RFC-014 v0.4 convention)', async () => {
    const filePath = await writePlan(
      '---\n' +
      'uppgifter:\n' +
      '  - uppgift: "Ämnesval Tema 5"\n' +
      '    deadline: 2026-04-24\n' +
      '    obligatorisk: true\n' +
      '  - uppgift: "Redovisning"\n' +
      '    deadline: 2026-06-02\n' +
      '    obligatorisk: true\n' +
      '---\n' +
      '# Plan\n',
    );

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(Array.isArray(result.frontmatter?.uppgifter)).toBe(true);
    const uppgifter = result.frontmatter?.uppgifter as Array<{ uppgift: string }>;
    expect(uppgifter).toHaveLength(2);
    expect(uppgifter[0].uppgift).toBe('Ämnesval Tema 5');
  });

  it('parses presentationer array (RFC-014 convention)', async () => {
    const filePath = await writePlan(
      '---\n' +
      'presentationer:\n' +
      '  - fil: "Resources/PPT4.pptx"\n' +
      '    block: "Bioresurs PPT 4"\n' +
      '---\n' +
      '# Plan\n',
    );

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.success).toBe(true);
    const presentationer = result.frontmatter?.presentationer as Array<{ fil: string; block: string }>;
    expect(presentationer).toHaveLength(1);
    expect(presentationer[0].fil).toBe('Resources/PPT4.pptx');
  });

  it('returns body content after frontmatter', async () => {
    const filePath = await writePlan(
      '---\n' +
      'type: lesson_plan\n' +
      '---\n' +
      '# Lektionsplan\n\nBody here.\n',
    );

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.body).toContain('# Lektionsplan');
    expect(result.body).toContain('Body here.');
    expect(result.body).not.toContain('type: lesson_plan');
  });
});

// ============================================================================
// NO FRONTMATTER
// ============================================================================

describe('parse_lesson_plan_yaml — no frontmatter', () => {
  it('handles files without frontmatter (Stage 3 not applied)', async () => {
    const filePath = await writePlan('# Lektionsplan: Måndag 21 april\n\nBody content.\n');

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_frontmatter).toBe(false);
    expect(result.frontmatter).toBeNull();
    expect(result.body).toContain('# Lektionsplan: Måndag 21 april');
  });

  it('handles empty file', async () => {
    const filePath = await writePlan('');

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.has_frontmatter).toBe(false);
    expect(result.body).toBe('');
  });
});

// ============================================================================
// METADATA
// ============================================================================

describe('parse_lesson_plan_yaml — metadata', () => {
  it('returns total_chars matching file size', async () => {
    const content = '---\ntype: lesson_plan\n---\n# Title\n';
    const filePath = await writePlan(content);

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.total_chars).toBe(content.length);
  });

  it('returns the file_path in output', async () => {
    const filePath = await writePlan('# Plan\n');

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    expect(result.file_path).toBe(filePath);
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

describe('parse_lesson_plan_yaml — error handling', () => {
  it('rejects when file does not exist', async () => {
    const result = await parseLessonPlanYaml({
      file_path: path.join(workspaceDir, 'nonexistent.md'),
      workspace: workspaceDir,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects file outside workspace', async () => {
    const outside = path.join(os.tmpdir(), 'outside-plan-' + Date.now() + '.md');
    await fs.writeFile(outside, '# Plan\n', 'utf-8');

    try {
      const result = await parseLessonPlanYaml({
        file_path: outside,
        workspace: workspaceDir,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    } finally {
      await fs.rm(outside, { force: true });
    }
  });

  it('rejects file outside workspace even when caller omits workspace argument', async () => {
    // Security regression test: previously the validation guard ran only
    // when workspace was supplied. Without it, the file body was returned
    // verbatim — an arbitrary-file-read primitive. With the fix, validation
    // falls back to the server-level workspace.
    const outside = path.join(os.tmpdir(), 'no-caller-ws-plan-' + Date.now() + '.md');
    await fs.writeFile(outside, '# Plan\nsensitive content\n', 'utf-8');

    try {
      const result = await parseLessonPlanYaml({
        file_path: outside,
        // workspace deliberately omitted
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.body).toBe('');
    } finally {
      await fs.rm(outside, { force: true });
    }
  });

  it('rejects missing input', async () => {
    const result = await parseLessonPlanYaml({});

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it('handles malformed YAML — frontmatter null + warning in error', async () => {
    const filePath = await writePlan(
      '---\n' +
      'type: lesson_plan\n' +
      'invalid: [unclosed bracket\n' +
      '---\n' +
      '# Body\n',
    );

    const result = await parseLessonPlanYaml({ file_path: filePath, workspace: workspaceDir });

    // Malformed YAML — success false OR null frontmatter with error message
    expect(result.frontmatter).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
