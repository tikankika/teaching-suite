/**
 * Project Scan Tool
 *
 * Scans project folder and lists files with metadata.
 * Returns suggestions based on simple pattern matching.
 * Teacher confirms via Claude Desktop dialog.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SOURCE_ROLES } from './track.js';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// SCHEMAS
// ============================================================================

export const ProjectScanInputSchema = z.object({
  project_path: z.string().min(1).describe('Path to project folder'),
  include_subdirs: z.boolean().default(true).describe('Include subdirectories'),
  max_depth: z.number().default(3).describe('Maximum directory depth'),
  mode: z
    .enum(['summary', 'files'])
    .default('summary')
    .describe(
      'summary (default): counts + suggestions only (~5 kB regardless of project size). files: include the full FileInfo[] in the response, paginated by page + page_size.',
    ),
  page: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('When mode=files: zero-indexed page number'),
  page_size: z
    .number()
    .int()
    .min(1)
    .max(500)
    .default(100)
    .describe('When mode=files: number of FileInfo entries per page (1–500)'),
});

// ============================================================================
// TYPES
// ============================================================================

export interface FileInfo {
  path: string;
  name: string;
  type: string; // extension
  size: number;
  modified: string;
  is_directory: boolean;
  depth: number;
}

export interface Suggestion {
  role: string;
  path: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  /** True when total > page_size — caller should request next page to see more. */
  truncated: boolean;
}

export interface ProjectScanOutput {
  success: boolean;
  project_path: string;
  mode: 'summary' | 'files';
  /** Present only when mode='files'. Caller-paginated. */
  files?: FileInfo[];
  /** Present only when mode='files'. */
  pagination?: PaginationInfo;
  summary: {
    total_files: number;
    total_dirs: number;
    by_type: Record<string, number>;
  };
  suggestions: Suggestion[];
  available_roles: readonly string[];
  message: string;
  error?: string;
}

// ============================================================================
// PATTERN MATCHING (simple heuristics)
// ============================================================================

const PATTERNS: Record<string, { patterns: string[]; role: string }> = {
  syllabus: {
    patterns: ['syllabus', 'ämnesplan', 'kursplan', 'styrdokument', 'curriculum'],
    role: 'syllabus',
  },
  rubric: {
    patterns: ['rubric', 'bedömning', 'bedomning', 'matris', 'criteria'],
    role: 'rubric',
  },
  reflection: {
    patterns: ['reflektion', 'reflection', 'daily', 'dagbok', 'logg'],
    role: 'reflection',
  },
  planning: {
    patterns: ['planering', 'planning', 'lesson', 'lektion', 'schedule'],
    role: 'planning',
  },
  framework: {
    patterns: ['framework', 'ramverk', 'theoretical', 'teori'],
    role: 'framework',
  },
};

function matchPatterns(filename: string): Suggestion | null {
  const lower = filename.toLowerCase();

  for (const [, config] of Object.entries(PATTERNS)) {
    for (const pattern of config.patterns) {
      if (lower.includes(pattern)) {
        return {
          role: config.role,
          path: '', // filled in later
          confidence: lower.startsWith(pattern) ? 'high' : 'medium',
          reason: `Filename contains "${pattern}"`,
        };
      }
    }
  }
  return null;
}

// ============================================================================
// CORE FUNCTION
// ============================================================================

async function scanDirectory(
  dirPath: string,
  currentDepth: number,
  maxDepth: number,
  includeSubdirs: boolean
): Promise<FileInfo[]> {
  const results: FileInfo[] = [];

  if (currentDepth > maxDepth) {
    return results;
  }

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files, common non-content folders, and symlinks
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }
      if (entry.isSymbolicLink()) continue; // defence-in-depth: skip symlinks

      const fullPath = path.join(dirPath, entry.name);

      try {
        const stats = await fs.stat(fullPath);

        const fileInfo: FileInfo = {
          path: fullPath,
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : path.extname(entry.name).slice(1) || 'unknown',
          size: stats.size,
          modified: stats.mtime.toISOString(),
          is_directory: entry.isDirectory(),
          depth: currentDepth,
        };

        results.push(fileInfo);

        // Recurse into subdirectories
        if (entry.isDirectory() && includeSubdirs) {
          const subResults = await scanDirectory(fullPath, currentDepth + 1, maxDepth, includeSubdirs);
          results.push(...subResults);
        }
      } catch {
        // Skip files we can't stat
      }
    }
  } catch {
    // Skip directories we can't read
  }

  return results;
}

function emptyError(
  project_path: string,
  mode: 'summary' | 'files',
  message: string,
  error: string,
): ProjectScanOutput {
  return {
    success: false,
    project_path,
    mode,
    summary: { total_files: 0, total_dirs: 0, by_type: {} },
    suggestions: [],
    available_roles: SOURCE_ROLES,
    message,
    error,
  };
}

export async function projectScan(input: unknown): Promise<ProjectScanOutput> {
  const parseResult = ProjectScanInputSchema.safeParse(input);
  if (!parseResult.success) {
    return emptyError('', 'summary', 'Invalid input', parseResult.error.message);
  }

  const { project_path, include_subdirs, max_depth, mode, page, page_size } =
    parseResult.data;

  const validation = await validatePathInWorkspace(project_path);
  if (!validation.valid) {
    return emptyError(project_path, mode, 'Path outside workspace', validation.error || '');
  }

  try {
    const stats = await fs.stat(validation.resolvedPath!);
    if (!stats.isDirectory()) {
      return emptyError(
        project_path,
        mode,
        'Path is not a directory',
        `${project_path} is not a directory`,
      );
    }

    const files = await scanDirectory(project_path, 0, max_depth, include_subdirs);

    const summary = {
      total_files: files.filter((f) => !f.is_directory).length,
      total_dirs: files.filter((f) => f.is_directory).length,
      by_type: {} as Record<string, number>,
    };

    for (const file of files) {
      if (!file.is_directory) {
        summary.by_type[file.type] = (summary.by_type[file.type] || 0) + 1;
      }
    }

    const suggestions: Suggestion[] = [];
    for (const file of files) {
      if (!file.is_directory) {
        const suggestion = matchPatterns(file.name);
        if (suggestion) {
          suggestion.path = file.path;
          suggestions.push(suggestion);
        }
      }
    }

    suggestions.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.confidence] - order[b.confidence];
    });

    // Build response: 'summary' mode omits the FileInfo[] array entirely
    // (response is ~5 kB regardless of project size). 'files' mode includes
    // a paginated slice plus pagination metadata so the caller can request
    // subsequent pages.
    const baseResponse = {
      success: true as const,
      project_path,
      mode,
      summary,
      suggestions,
      available_roles: SOURCE_ROLES,
    };

    if (mode === 'files') {
      const start = page * page_size;
      const slice = files.slice(start, start + page_size);
      const truncated = files.length > start + slice.length;
      return {
        ...baseResponse,
        files: slice,
        pagination: {
          page,
          page_size,
          total: files.length,
          truncated,
        },
        message:
          `Found ${summary.total_files} files in ${summary.total_dirs} directories. ` +
          `${suggestions.length} suggestions based on patterns. ` +
          `Returning files page ${page} (${slice.length} of ${files.length}).`,
      };
    }

    return {
      ...baseResponse,
      message:
        `Found ${summary.total_files} files in ${summary.total_dirs} directories. ` +
        `${suggestions.length} suggestions based on patterns. ` +
        `Re-run with mode='files' to inspect individual entries.`,
    };
  } catch (err) {
    return emptyError(
      project_path,
      mode,
      'Failed to scan directory',
      err instanceof Error ? err.message : 'Unknown error',
    );
  }
}
