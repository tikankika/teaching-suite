/**
 * Core tool: file_read
 *
 * Reads file content from the filesystem.
 * Minimal, generisk, workspace-aware.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { validatePathInWorkspace, MAX_FILE_SIZE } from './workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const FileReadInputSchema = z.object({
  path: z.string().min(1).describe('Absolute path to file'),
  workspace: z.string().optional().describe('Workspace root for path validation'),
  encoding: z.enum(['utf-8', 'base64']).default('utf-8').describe('File encoding'),
  offset: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe('1-indexed line number to start reading from (utf-8 only)'),
  limit: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe('Maximum number of lines to return (utf-8 only)'),
});

export type FileReadInput = z.infer<typeof FileReadInputSchema>;

// ============================================================================
// OUTPUT
// ============================================================================

export interface FileReadOutput {
  success: boolean;
  content?: string;
  metadata?: {
    size: number;
    modified: string;
    created: string;
    total_lines?: number;
    lines_returned?: number;
    has_more?: boolean;
  };
  error?: {
    code: 'NOT_FOUND' | 'PERMISSION_DENIED' | 'OUTSIDE_WORKSPACE' | 'INVALID_PATH' | 'UNKNOWN';
    message: string;
  };
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

export async function fileRead(input: unknown): Promise<FileReadOutput> {
  // Validate input
  const parseResult = FileReadInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: 'INVALID_PATH',
        message: `Invalid input: ${parseResult.error.message}`,
      },
    };
  }

  const { path: filePath, workspace, encoding, offset, limit } = parseResult.data;

  // base64 encoding cannot be combined with line-based pagination
  if (encoding === 'base64' && (offset !== undefined || limit !== undefined)) {
    return {
      success: false,
      error: {
        code: 'INVALID_PATH',
        message: 'offset/limit pagination is not supported with base64 encoding',
      },
    };
  }

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
    // Get file stats
    const stats = await fs.stat(filePath);

    // Guard: reject files exceeding size limit
    if (stats.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN',
          message: `File too large (${(stats.size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
        },
      };
    }

    // Read content
    const usePagination = offset !== undefined || limit !== undefined;
    const fullContent = await fs.readFile(filePath, encoding === 'base64' ? 'base64' : 'utf-8');

    if (!usePagination) {
      return {
        success: true,
        content: fullContent,
        metadata: {
          size: stats.size,
          modified: stats.mtime.toISOString(),
          created: stats.birthtime.toISOString(),
        },
      };
    }

    const lines = fullContent.split('\n');
    const startIdx = (offset ?? 1) - 1;
    const endIdx = limit !== undefined ? startIdx + limit : lines.length;
    const slice = lines.slice(startIdx, endIdx);

    return {
      success: true,
      content: slice.join('\n'),
      metadata: {
        size: stats.size,
        modified: stats.mtime.toISOString(),
        created: stats.birthtime.toISOString(),
        total_lines: lines.length,
        lines_returned: slice.length,
        has_more: endIdx < lines.length,
      },
    };
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code === 'ENOENT') {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `File not found: ${filePath}`,
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
        message: error.message || 'Unknown error reading file',
      },
    };
  }
}
