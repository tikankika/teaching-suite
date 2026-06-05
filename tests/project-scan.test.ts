import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { projectScan } from '../src/tools/sources/scan.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-scan-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function seedProject(numFiles: number, subdir = ''): Promise<string> {
  const projectPath = path.join(workspaceDir, 'project');
  const dir = subdir ? path.join(projectPath, subdir) : projectPath;
  await fs.mkdir(dir, { recursive: true });
  for (let i = 0; i < numFiles; i++) {
    await fs.writeFile(path.join(dir, `file_${i}.md`), `content ${i}`, 'utf-8');
  }
  return projectPath;
}

// ============================================================================
// MODE: SUMMARY (default)
// ============================================================================

describe('project_scan — summary mode (default)', () => {
  it('does not include files[] in the response by default', async () => {
    const projectPath = await seedProject(50);

    const result = await projectScan({ project_path: projectPath });

    expect(result.success).toBe(true);
    expect(result.mode).toBe('summary');
    expect(result.files).toBeUndefined();
    expect(result.pagination).toBeUndefined();
  });

  it('still returns counts and suggestions in summary mode', async () => {
    const projectPath = await seedProject(10);
    // Add a syllabus-named file so we get a suggestion
    await fs.writeFile(
      path.join(projectPath, 'syllabus_2026.md'),
      '# Syllabus',
      'utf-8',
    );

    const result = await projectScan({ project_path: projectPath });

    expect(result.success).toBe(true);
    expect(result.summary.total_files).toBe(11);
    expect(result.summary.total_dirs).toBe(0);
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions.some((s) => s.role === 'syllabus')).toBe(true);
  });

  it('summary response stays small (~few kB) even on large projects', async () => {
    const projectPath = await seedProject(300);

    const result = await projectScan({ project_path: projectPath });

    expect(result.success).toBe(true);
    expect(result.mode).toBe('summary');
    const wireSize = JSON.stringify(result).length;
    // Summary mode should be under 5 kB regardless of project size.
    expect(wireSize).toBeLessThan(5000);
  });
});

// ============================================================================
// MODE: FILES (paginated)
// ============================================================================

describe('project_scan — files mode (paginated)', () => {
  it('returns files[] when mode=files', async () => {
    const projectPath = await seedProject(20);

    const result = await projectScan({ project_path: projectPath, mode: 'files' });

    expect(result.success).toBe(true);
    expect(result.mode).toBe('files');
    expect(result.files).toBeDefined();
    expect(result.files!.length).toBeGreaterThan(0);
    expect(result.pagination).toBeDefined();
  });

  it('honours page_size and reports truncation', async () => {
    const projectPath = await seedProject(150);

    const result = await projectScan({
      project_path: projectPath,
      mode: 'files',
      page_size: 50,
    });

    expect(result.success).toBe(true);
    expect(result.files!.length).toBe(50);
    expect(result.pagination!.page).toBe(0);
    expect(result.pagination!.page_size).toBe(50);
    expect(result.pagination!.total).toBe(150);
    expect(result.pagination!.truncated).toBe(true);
  });

  it('returns the correct slice for page 1', async () => {
    const projectPath = await seedProject(30);

    const page0 = await projectScan({
      project_path: projectPath,
      mode: 'files',
      page_size: 10,
      page: 0,
    });
    const page1 = await projectScan({
      project_path: projectPath,
      mode: 'files',
      page_size: 10,
      page: 1,
    });

    expect(page0.files!.length).toBe(10);
    expect(page1.files!.length).toBe(10);
    // Pages should not overlap
    const page0Paths = new Set(page0.files!.map((f) => f.path));
    const page1HasOverlap = page1.files!.some((f) => page0Paths.has(f.path));
    expect(page1HasOverlap).toBe(false);
  });

  it('truncated=false when entire result fits in one page', async () => {
    const projectPath = await seedProject(20);

    const result = await projectScan({
      project_path: projectPath,
      mode: 'files',
      page_size: 100,
    });

    expect(result.pagination!.truncated).toBe(false);
    expect(result.files!.length).toBe(result.pagination!.total);
  });

  it('returns empty files[] when page is past the end', async () => {
    const projectPath = await seedProject(5);

    const result = await projectScan({
      project_path: projectPath,
      mode: 'files',
      page_size: 100,
      page: 5,
    });

    expect(result.success).toBe(true);
    expect(result.files!.length).toBe(0);
    expect(result.pagination!.truncated).toBe(false);
  });

  it('rejects page_size out of range', async () => {
    const projectPath = await seedProject(5);

    const tooLarge = await projectScan({
      project_path: projectPath,
      mode: 'files',
      page_size: 9999,
    });
    expect(tooLarge.success).toBe(false);
    expect(tooLarge.error).toContain('page_size');
  });
});

// ============================================================================
// ERROR PATHS — mode is preserved in error responses
// ============================================================================

describe('project_scan — error responses include mode', () => {
  it('preserves mode in error response when path is invalid', async () => {
    const result = await projectScan({
      project_path: '/tmp/definitely-outside-workspace-' + Date.now(),
      mode: 'files',
    });

    expect(result.success).toBe(false);
    expect(result.mode).toBe('files');
  });

  it('defaults mode to summary when input parsing fails', async () => {
    const result = await projectScan({});
    expect(result.success).toBe(false);
    expect(result.mode).toBe('summary');
  });
});
