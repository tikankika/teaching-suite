/**
 * Core tool: file_write
 *
 * Writes content to a file on the filesystem.
 * Minimal, generisk, workspace-aware.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validatePathInWorkspace } from './workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const FileWriteInputSchema = z.object({
  path: z.string().min(1).describe('Absolute path to file'),
  content: z.string().describe('Content to write'),
  workspace: z.string().optional().describe('Workspace root for path validation'),
  create_dirs: z.boolean().default(true).describe('Create parent directories if missing'),
  overwrite: z.boolean().default(false).describe('Overwrite if file exists'),
});

export type FileWriteInput = z.infer<typeof FileWriteInputSchema>;

// ============================================================================
// OUTPUT
// ============================================================================

export interface FileWriteOutput {
  success: boolean;
  path?: string;
  created?: boolean; // true if new file, false if overwritten
  bytes_written?: number;
  error?: {
    code: 'FILE_EXISTS' | 'PERMISSION_DENIED' | 'OUTSIDE_WORKSPACE' | 'INVALID_PATH' | 'UNKNOWN';
    message: string;
  };
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

export async function fileWrite(input: unknown): Promise<FileWriteOutput> {
  // Validate input
  const parseResult = FileWriteInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: 'INVALID_PATH',
        message: `Invalid input: ${parseResult.error.message}`,
      },
    };
  }

  const { path: filePath, content, workspace, create_dirs, overwrite } = parseResult.data;

  // Validate path is within workspace
  const validation = await validatePathInWorkspace(filePath, workspace);
  if (!validation.valid) {
    return {
      success: false,
      error: {
        code: 'OUTSIDE_WORKSPACE',
        message: validation.error || 'Path validation failed',
      },
    };
  }

  try {
    // Create parent directories if needed
    if (create_dirs) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }

    if (overwrite) {
      // Overwrite mode — write directly regardless of existence
      // Check whether the file existed before so we can report created/overwritten
      let existed = true;
      try {
        await fs.access(filePath);
      } catch {
        existed = false;
      }
      await fs.writeFile(filePath, content, 'utf-8');
      return {
        success: true,
        path: filePath,
        created: !existed,
        bytes_written: Buffer.byteLength(content, 'utf-8'),
      };
    }

    // No-overwrite mode — atomic create using exclusive flag (no TOCTOU race)
    await fs.writeFile(filePath, content, { encoding: 'utf-8', flag: 'wx' });
    return {
      success: true,
      path: filePath,
      created: true,
      bytes_written: Buffer.byteLength(content, 'utf-8'),
    };
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code === 'EEXIST') {
      return {
        success: false,
        error: {
          code: 'FILE_EXISTS',
          message: `File already exists: ${filePath}. Set overwrite: true to replace.`,
        },
      };
    }

    if (error.code === 'EACCES') {
      return {
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: `Permission denied: ${filePath}`,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN',
        message: error.message || 'Unknown error writing file',
      },
    };
  }
}
