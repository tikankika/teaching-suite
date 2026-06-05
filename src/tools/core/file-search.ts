/**
 * Core tool: file_search
 *
 * Searches for content across files in a workspace.
 * Minimal, generisk, workspace-aware.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import { validatePathInWorkspace, MAX_FILE_SIZE } from './workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const FileSearchInputSchema = z.object({
  query: z.string().min(1).describe('Text or regex pattern to search for'),
  workspace: z.string().min(1).describe('Root directory to search in (required)'),
  patterns: z.array(z.string()).default(['**/*.md']).describe('File patterns to include'),
  exclude: z.array(z.string()).default([]).describe('Patterns to exclude (e.g., node_modules)'),
  max_results: z.number().default(50).describe('Maximum number of matches to return'),
  context_lines: z.number().default(1).describe('Lines of context before/after match'),
  case_sensitive: z.boolean().default(false).describe('Case-sensitive search'),
});

export type FileSearchInput = z.infer<typeof FileSearchInputSchema>;

// ============================================================================
// OUTPUT
// ============================================================================

export interface SearchMatch {
  file: string;
  relative_path: string;
  line: number;
  column: number;
  match: string;
  context: {
    before: string[];
    after: string[];
  };
}

export interface FileSearchOutput {
  success: boolean;
  matches: SearchMatch[];
  files_searched: number;
  files_matched: number;
  truncated: boolean; // true if max_results was hit
  error?: {
    code: 'INVALID_WORKSPACE' | 'PERMISSION_DENIED' | 'INVALID_PATH' | 'UNKNOWN';
    message: string;
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if a path matches any of the exclude patterns.
 */
function shouldExclude(filePath: string, excludePatterns: string[]): boolean {
  const normalizedPath = filePath.toLowerCase();
  return excludePatterns.some((pattern) => {
    const normalizedPattern = pattern.toLowerCase();
    // Simple pattern matching (supports * wildcard)
    if (normalizedPattern.includes('*')) {
      const parts = normalizedPattern.split('*');
      let idx = 0;
      for (const part of parts) {
        if (part === '') continue;
        const foundIdx = normalizedPath.indexOf(part, idx);
        if (foundIdx === -1) return false;
        idx = foundIdx + part.length;
      }
      return true;
    }
    return normalizedPath.includes(normalizedPattern);
  });
}

/**
 * Check if a filename matches any of the include patterns.
 */
function matchesPattern(filename: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    // Handle *.ext patterns
    if (pattern.startsWith('*.') || pattern.startsWith('**/*.')) {
      const ext = pattern.split('.').pop() || '';
      return filename.endsWith('.' + ext);
    }
    // Exact match
    return filename === pattern;
  });
}

/**
 * Recursively get all files in a directory.
 */
async function getAllFiles(
  dir: string,
  patterns: string[],
  excludePatterns: string[]
): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentDir: string) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isSymbolicLink()) continue; // defence-in-depth: skip symlinks
        const fullPath = path.join(currentDir, entry.name);

        // Check exclusions
        if (shouldExclude(fullPath, excludePatterns)) continue;
        if (entry.name.startsWith('.')) continue; // Skip hidden files/dirs

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && matchesPattern(entry.name, patterns)) {
          files.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }
  }

  await walk(dir);
  return files;
}

/**
 * Search for query in file content.
 */
function searchInContent(
  content: string,
  query: string,
  caseSensitive: boolean,
  contextLines: number
): Array<{ line: number; column: number; match: string; context: { before: string[]; after: string[] } }> {
  const lines = content.split('\n');
  const matches: Array<{
    line: number;
    column: number;
    match: string;
    context: { before: string[]; after: string[] };
  }> = [];

  const searchQuery = caseSensitive ? query : query.toLowerCase();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const searchLine = caseSensitive ? line : line.toLowerCase();
    const idx = searchLine.indexOf(searchQuery);

    if (idx !== -1) {
      matches.push({
        line: i + 1, // 1-indexed
        column: idx + 1, // 1-indexed
        match: line.trim(),
        context: {
          before: lines.slice(Math.max(0, i - contextLines), i),
          after: lines.slice(i + 1, i + 1 + contextLines),
        },
      });
    }
  }

  return matches;
}

// ============================================================================
// IMPLEMENTATION
// ============================================================================

export async function fileSearch(input: unknown): Promise<FileSearchOutput> {
  // Validate input
  const parseResult = FileSearchInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      matches: [],
      files_searched: 0,
      files_matched: 0,
      truncated: false,
      error: {
        code: 'INVALID_PATH',
        message: `Invalid input: ${parseResult.error.message}`,
      },
    };
  }

  const {
    query,
    workspace,
    patterns,
    exclude,
    max_results,
    context_lines,
    case_sensitive,
  } = parseResult.data;

  // Validate workspace is inside the server lock (narrowing-only).
  // Pass only the path under test — validatePathInWorkspace() falls back
  // to the server-level workspace as the trust boundary.
  const validation = await validatePathInWorkspace(workspace);
  if (!validation.valid) {
    return {
      success: false,
      matches: [],
      files_searched: 0,
      files_matched: 0,
      truncated: false,
      error: {
        code: 'INVALID_WORKSPACE',
        message: validation.error || 'Invalid workspace',
      },
    };
  }

  try {
    // Check workspace exists and is a directory
    const stats = await fs.stat(workspace);
    if (!stats.isDirectory()) {
      return {
        success: false,
        matches: [],
        files_searched: 0,
        files_matched: 0,
        truncated: false,
        error: {
          code: 'INVALID_WORKSPACE',
          message: `Not a directory: ${workspace}`,
        },
      };
    }

    // Get all matching files
    const defaultExcludes = ['node_modules', '.git', '.obsidian', '__pycache__'];
    const allExcludes = [...defaultExcludes, ...exclude];
    const files = await getAllFiles(workspace, patterns, allExcludes);

    // Search in files
    const matches: SearchMatch[] = [];
    let filesSearched = 0;
    let filesMatched = 0;
    let truncated = false;

    for (const file of files) {
      if (matches.length >= max_results) {
        truncated = true;
        break;
      }

      try {
        // Skip files exceeding size limit
        const fileStat = await fs.stat(file);
        if (fileStat.size > MAX_FILE_SIZE) continue;

        const content = await fs.readFile(file, 'utf-8');
        filesSearched++;

        const fileMatches = searchInContent(content, query, case_sensitive, context_lines);

        if (fileMatches.length > 0) {
          filesMatched++;

          for (const match of fileMatches) {
            if (matches.length >= max_results) {
              truncated = true;
              break;
            }

            matches.push({
              file,
              relative_path: path.relative(workspace, file),
              ...match,
            });
          }
        }
      } catch {
        // Skip files we can't read
      }
    }

    return {
      success: true,
      matches,
      files_searched: filesSearched,
      files_matched: filesMatched,
      truncated,
    };
  } catch (err) {
    const error = err as NodeJS.ErrnoException;

    if (error.code === 'EACCES') {
      return {
        success: false,
        matches: [],
        files_searched: 0,
        files_matched: 0,
        truncated: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: `Permission denied: ${workspace}`,
        },
      };
    }

    return {
      success: false,
      matches: [],
      files_searched: 0,
      files_matched: 0,
      truncated: false,
      error: {
        code: 'UNKNOWN',
        message: error.message || 'Unknown error searching files',
      },
    };
  }
}
