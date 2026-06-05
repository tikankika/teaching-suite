/**
 * Core tool: file_edit
 *
 * Edits an existing file by applying operations.
 * Minimal, generisk, workspace-aware.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { validatePathInWorkspace, MAX_FILE_SIZE } from './workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

const EditOperationSchema = z.object({
  type: z.enum(['replace', 'insert_after', 'insert_before', 'append', 'prepend', 'delete']),
  target: z.string().optional().describe('Text to find (required for replace/insert/delete)'),
  content: z.string().optional().describe('Content to insert (not needed for delete)'),
  all: z.boolean().default(false).describe('Apply to all occurrences (for replace/delete)'),
});

export type EditOperation = z.infer<typeof EditOperationSchema>;

export const FileEditInputSchema = z.object({
  path: z.string().min(1).describe('Absolute path to file'),
  edits: z.array(EditOperationSchema).min(1).describe('Edit operations to apply in order'),
  workspace: z.string().optional().describe('Workspace root for path validation'),
});

export type FileEditInput = z.infer<typeof FileEditInputSchema>;

// ============================================================================
// OUTPUT
// ============================================================================

export interface FileEditOutput {
  success: boolean;
  path?: string;
  edits_applied: number;
  edits_failed: number;
  error?: {
    code: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'OUTSIDE_WORKSPACE' | 'INVALID_PATH' | 'NO_MATCH' | 'UNKNOWN';
    message: string;
  };
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

function applyEdit(content: string, edit: EditOperation): { content: string; applied: boolean } {
  switch (edit.type) {
    case 'replace': {
      if (!edit.target) return { content, applied: false };
      if (!content.includes(edit.target)) return { content, applied: false };

      const newContent = edit.all
        ? content.replaceAll(edit.target, edit.content || '')
        : content.replace(edit.target, edit.content || '');
      return { content: newContent, applied: true };
    }

    case 'insert_after': {
      if (!edit.target) return { content, applied: false };
      if (!content.includes(edit.target)) return { content, applied: false };

      const newContent = content.replace(edit.target, edit.target + (edit.content || ''));
      return { content: newContent, applied: true };
    }

    case 'insert_before': {
      if (!edit.target) return { content, applied: false };
      if (!content.includes(edit.target)) return { content, applied: false };

      const newContent = content.replace(edit.target, (edit.content || '') + edit.target);
      return { content: newContent, applied: true };
    }

    case 'append': {
      const newContent = content + (edit.content || '');
      return { content: newContent, applied: true };
    }

    case 'prepend': {
      const newContent = (edit.content || '') + content;
      return { content: newContent, applied: true };
    }

    case 'delete': {
      if (!edit.target) return { content, applied: false };
      if (!content.includes(edit.target)) return { content, applied: false };

      const newContent = edit.all
        ? content.replaceAll(edit.target, '')
        : content.replace(edit.target, '');
      return { content: newContent, applied: true };
    }
  }
}

export async function fileEdit(input: unknown): Promise<FileEditOutput> {
  // Validate input
  const parseResult = FileEditInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      edits_applied: 0,
      edits_failed: 0,
      error: {
        code: 'INVALID_PATH',
        message: `Invalid input: ${parseResult.error.message}`,
      },
    };
  }

  const { path: filePath, edits, workspace } = parseResult.data;

  // Validate path is within workspace
  const validation = await validatePathInWorkspace(filePath, workspace);
  if (!validation.valid) {
    return {
      success: false,
      edits_applied: 0,
      edits_failed: 0,
      error: {
        code: 'OUTSIDE_WORKSPACE',
        message: validation.error || 'Path validation failed',
      },
    };
  }

  try {
    // Guard: reject files exceeding size limit
    const stats = await fs.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return {
        success: false,
        edits_applied: 0,
        edits_failed: 0,
        error: {
          code: 'UNKNOWN',
          message: `File too large (${(stats.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        },
      };
    }

    // Read existing content
    let content = await fs.readFile(filePath, 'utf-8');

    // Apply edits in order
    let editsApplied = 0;
    let editsFailed = 0;

    for (const edit of edits) {
      const result = applyEdit(content, edit);
      if (result.applied) {
        content = result.content;
        editsApplied++;
      } else {
        editsFailed++;
      }
    }

    // Write back
    await fs.writeFile(filePath, content, 'utf-8');

    return {
      success: true,
      path: filePath,
      edits_applied: editsApplied,
      edits_failed: editsFailed,
    };
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code === 'ENOENT') {
      return {
        success: false,
        edits_applied: 0,
        edits_failed: 0,
        error: {
          code: 'NOT_FOUND',
          message: `File not found: ${filePath}`,
        },
      };
    }

    if (error.code === 'EACCES') {
      return {
        success: false,
        edits_applied: 0,
        edits_failed: 0,
        error: {
          code: 'PERMISSION_DENIED',
          message: `Permission denied: ${filePath}`,
        },
      };
    }

    return {
      success: false,
      edits_applied: 0,
      edits_failed: 0,
      error: {
        code: 'UNKNOWN',
        message: error.message || 'Unknown error editing file',
      },
    };
  }
}
