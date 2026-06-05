/**
 * Shared test fixtures for Teaching Suite tests.
 *
 * Provides utilities for creating temporary workspaces,
 * V2-style project structures, and consistent cleanup.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

// ============================================================================
// TEMPORARY WORKSPACE
// ============================================================================

export interface TempWorkspace {
  dir: string;
  cleanup: () => Promise<void>;
}

/**
 * Create a temporary workspace directory with automatic cleanup.
 * Uses os.tmpdir() to guarantee a writable location.
 */
export async function createTempWorkspace(
  prefix = 'teaching-suite-test-'
): Promise<TempWorkspace> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  return {
    dir,
    cleanup: async () => {
      try {
        await fs.rm(dir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors in tests
      }
    },
  };
}

// ============================================================================
// V2 WORKSPACE (course structure)
// ============================================================================

/**
 * Create a V2 course workspace structure inside a given directory.
 * Mirrors the layout produced by project_init with type: 'course'.
 */
export async function createV2Workspace(dir: string): Promise<void> {
  const dirs = [
    '_config',
    'Reflections',
    'Lesson_Plans',
    'Ideas',
    'Planning',
    'Analysis',
    'Notes',
    'Data/Transkript',
    'Data/Labbdata',
    'Data/Elevreflektioner',
    'Data/Teacher_Insights',
    'Styrdokument',
    'Material/WIP',
    'Material/Klart/Presentationer',
    'Material/Klart/Ovningar',
    'Material/Klart/Ovrigt',
    'Material/Resurser',
    'Exams',
    'methodology',
    'activity_logs',
  ];

  await Promise.all(
    dirs.map((d) => fs.mkdir(path.join(dir, d), { recursive: true }))
  );

  // Seed minimal config files
  await fs.writeFile(
    path.join(dir, '_config', 'course_context.md'),
    '---\ntitle: Test Course\n---\n\n# Course Context\n',
    'utf-8'
  );

  await fs.writeFile(
    path.join(dir, 'sources.yaml'),
    'sources: []\n',
    'utf-8'
  );

  await fs.writeFile(
    path.join(dir, 'project_state.json'),
    JSON.stringify({ version: '0.3.0', created: new Date().toISOString() }, null, 2),
    'utf-8'
  );
}
