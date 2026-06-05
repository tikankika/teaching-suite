import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { initProfession } from '../src/tools/setup/init-profession.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'teaching-suite-init-prof-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('init_profession', () => {
  it('creates Profession/, Profession/Manifest/, and Profession/Termin/ at workspace root', async () => {
    const result = await initProfession({ workspace_root: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.workspace_root).toBe(workspaceDir);
    expect(result.folders_created).toEqual([
      'Profession',
      'Profession/Manifest',
      'Profession/Termin',
    ]);
    expect(result.folders_existing).toEqual([]);

    const manifestStat = await fs.stat(path.join(workspaceDir, 'Profession', 'Manifest'));
    expect(manifestStat.isDirectory()).toBe(true);
    const terminStat = await fs.stat(path.join(workspaceDir, 'Profession', 'Termin'));
    expect(terminStat.isDirectory()).toBe(true);
  });

  it('is idempotent — re-running reports existing folders without error', async () => {
    await initProfession({ workspace_root: workspaceDir });

    const second = await initProfession({ workspace_root: workspaceDir });

    expect(second.success).toBe(true);
    expect(second.folders_created).toEqual([]);
    expect(second.folders_existing).toEqual([
      'Profession',
      'Profession/Manifest',
      'Profession/Termin',
    ]);
  });

  it('preserves existing files inside Profession/Manifest/', async () => {
    await initProfession({ workspace_root: workspaceDir });

    const manifestPath = path.join(workspaceDir, 'Profession', 'Manifest', 'manifest_v1_2026-04-29.md');
    await fs.writeFile(manifestPath, '# My manifest', 'utf-8');

    const second = await initProfession({ workspace_root: workspaceDir });

    expect(second.success).toBe(true);
    const content = await fs.readFile(manifestPath, 'utf-8');
    expect(content).toBe('# My manifest');
  });

  it('rejects path outside server workspace', async () => {
    const result = await initProfession({ workspace_root: '/tmp/outside-of-anywhere' });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects empty workspace_root', async () => {
    const result = await initProfession({ workspace_root: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it('rejects missing workspace_root field', async () => {
    const result = await initProfession({});

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });
});
