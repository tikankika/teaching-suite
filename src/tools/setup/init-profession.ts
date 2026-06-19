/**
 * init_profession — Create profession-level workspace structure.
 *
 * Mechanical tool: creates folders for a teacher's profession-level
 * artefacts (manifest, term reflections) at the workspace root, above
 * any individual course.
 *
 * Conceptually distinct from project_init (which creates per-course
 * structure). The teacher's professional manifest and term reflections
 * apply across all courses they teach — they live once at the workspace
 * root, not duplicated inside every course folder. This matches
 * intelligent_save's WORKSPACE_ROOT_TYPES routing (manifest +
 * term_reflection both resolve to getServerWorkspace()).
 *
 * Idempotent — safe to re-run; existing folders are not overwritten.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validatePathInWorkspace } from '../core/workspace.js';
import { workspaceRootDirectories } from '../../utils/content-types.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const InitProfessionInputSchema = z.object({
  workspace_root: z.string().min(1).describe('Absolute path to the workspace root (the parent of any course folders).'),
});

// ============================================================================
// TYPES
// ============================================================================

export interface InitProfessionOutput {
  success: boolean;
  workspace_root: string;
  folders_created: string[];
  folders_existing: string[];
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Derived from the workspace-root content types in the shared registry
// (manifest, term_reflection) plus their ancestor folders, so this tool can't
// drift from where intelligent_save actually writes them. Sorted so parents
// precede children: ['Profession', 'Profession/Manifest', 'Profession/Termin'].
const PROFESSION_FOLDERS: string[] = (() => {
  const folders = new Set<string>();
  for (const dir of workspaceRootDirectories()) {
    const parts = dir.split('/');
    for (let i = 1; i <= parts.length; i++) {
      folders.add(parts.slice(0, i).join('/'));
    }
  }
  return [...folders].sort();
})();

// ============================================================================
// MAIN
// ============================================================================

export async function initProfession(input: unknown): Promise<InitProfessionOutput> {
  const parseResult = InitProfessionInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      workspace_root: '',
      folders_created: [],
      folders_existing: [],
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { workspace_root } = parseResult.data;

  const validation = await validatePathInWorkspace(workspace_root);
  if (!validation.valid) {
    return {
      success: false,
      workspace_root,
      folders_created: [],
      folders_existing: [],
      error: validation.error || 'Workspace path outside server workspace',
    };
  }

  const created: string[] = [];
  const existing: string[] = [];

  for (const rel of PROFESSION_FOLDERS) {
    const dir = path.join(workspace_root, rel);
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) {
        existing.push(rel);
        continue;
      }
    } catch {
      // Doesn't exist — fall through to mkdir.
    }
    await fs.mkdir(dir, { recursive: true });
    created.push(rel);
  }

  return {
    success: true,
    workspace_root,
    folders_created: created,
    folders_existing: existing,
  };
}
