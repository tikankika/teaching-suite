/**
 * Source Tracking Tools
 *
 * Manages sources.yaml - adds, removes, lists tracked sources.
 * Two types of sources:
 * - copied: file is copied to project folder
 * - referenced: only path is stored (for large folders)
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// ROLES (predefined)
// ============================================================================

export const SOURCE_ROLES = [
  // Governing documents
  'syllabus',          // subject syllabus, curriculum
  'rubric',            // assessment rubric

  // Planning
  'planning',          // lesson planning
  'material',          // course material

  // Reflection & feedback
  'reflection',        // teacher reflection
  'student_feedback',  // from students
  'transcript',        // transcription

  // Background
  'framework',         // theoretical framework
  'research',          // research article
  'previous_course',   // previous course

  // Other
  'notes',             // notes
  'other',             // other
] as const;

export type SourceRole = typeof SOURCE_ROLES[number];

// ============================================================================
// SCHEMAS
// ============================================================================

export const SourceAddInputSchema = z.object({
  project_path: z.string().min(1).describe('Path to project folder'),
  name: z.string().optional().describe('Unique name/key for this source (defaults to role). Use to have multiple sources with the same role.'),
  role: z.enum(SOURCE_ROLES).describe('Role of the source'),
  source_path: z.string().min(1).describe('Path to source file or directory'),
  copy: z.boolean().default(false).describe('Copy file to project (true) or just reference (false)'),
  copy_to: z.string().optional().describe('Destination path within project (if copying)'),
  notes: z.string().optional().describe('Notes about this source'),
});

export const SourceListInputSchema = z.object({
  project_path: z.string().min(1).describe('Path to project folder'),
});

export const SourceRemoveInputSchema = z.object({
  project_path: z.string().min(1).describe('Path to project folder'),
  name: z.string().min(1).describe('Name/key of source to remove (as shown in source_list)'),
});

export const SourceUpdateUsageInputSchema = z.object({
  project_path: z.string().min(1).describe('Path to project folder'),
  name: z.string().min(1).describe('Name/key of source to update (as shown in source_list)'),
  used_in: z.string().min(1).describe('Process that used this source'),
});

// ============================================================================
// TYPES
// ============================================================================

export interface SourceEntry {
  path: string;
  role: SourceRole | string;
  type: string;                    // file extension or 'directory'
  file_modified: string;           // when file was last modified (from filesystem)
  added: string;                   // when added to sources.yaml
  last_used?: string;              // when last used in a process
  used_in?: string;                // which process last used it
  copied_to?: string;              // path if copied to project
  file_count?: number;             // number of files (for directories)
  notes?: string;                  // user notes
}

export interface SourcesYaml {
  project: {
    name: string;
    type?: string;
    created: string;
    updated: string;
  };
  sources: Record<string, SourceEntry>;
}

export interface SourceAddOutput {
  success: boolean;
  name: string;
  role: string;
  source_path: string;
  copied: boolean;
  copied_to?: string;
  message: string;
  error?: string;
}

export interface SourceListOutput {
  success: boolean;
  project_path: string;
  sources: Record<string, SourceEntry>;
  available_roles: readonly string[];
  message: string;
  error?: string;
}

export interface SourceRemoveOutput {
  success: boolean;
  name: string;
  message: string;
  error?: string;
}

export interface SourceUpdateUsageOutput {
  success: boolean;
  name: string;
  message: string;
  error?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getSourcesPath(projectPath: string): string {
  return path.join(projectPath, 'sources.yaml');
}

export async function loadSourcesYaml(projectPath: string): Promise<SourcesYaml | null> {
  const sourcesPath = getSourcesPath(projectPath);
  try {
    const content = await fs.readFile(sourcesPath, 'utf-8');
    const data = yaml.load(content) as SourcesYaml;
    if (!data) return null;
    // Guard: ensure project key exists (project_init writes a different format)
    if (!data.project) {
      const now = new Date().toISOString();
      data.project = {
        name: path.basename(projectPath),
        created: now,
        updated: now,
      };
    }
    // Guard: ensure sources key exists (file may have been manually edited)
    if (!data.sources) {
      data.sources = {};
    }
    return data;
  } catch {
    return null;
  }
}

export async function saveSourcesYaml(projectPath: string, data: SourcesYaml): Promise<void> {
  const sourcesPath = getSourcesPath(projectPath);
  const content = yaml.dump(data, { indent: 2, lineWidth: 120 });
  await fs.writeFile(sourcesPath, content, 'utf-8');
}

async function initSourcesYaml(projectPath: string, projectType?: string): Promise<SourcesYaml> {
  const projectName = path.basename(projectPath);
  const now = new Date().toISOString();

  const data: SourcesYaml = {
    project: {
      name: projectName,
      type: projectType,
      created: now,
      updated: now,
    },
    sources: {},
  };

  await fs.mkdir(projectPath, { recursive: true });
  await saveSourcesYaml(projectPath, data);
  return data;
}

async function getFileInfo(filePath: string): Promise<{
  type: string;
  isDir: boolean;
  fileCount?: number;
  modified: string;
}> {
  const stats = await fs.stat(filePath);
  const modified = stats.mtime.toISOString();

  if (stats.isDirectory()) {
    const entries = await fs.readdir(filePath, { recursive: true });
    const fileCount = entries.length;
    return { type: 'directory', isDir: true, fileCount, modified };
  }

  const ext = path.extname(filePath).slice(1) || 'unknown';
  return { type: ext, isDir: false, modified };
}

async function copyFile(source: string, dest: string): Promise<void> {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(source, dest);
}

async function copyDirectory(source: string, dest: string): Promise<number> {
  await fs.mkdir(dest, { recursive: true });
  let count = 0;

  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
      count++;
    }
  }

  return count;
}

// ============================================================================
// TOOL: source_add
// ============================================================================

export async function sourceAdd(input: unknown): Promise<SourceAddOutput> {
  const parseResult = SourceAddInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      name: '',
      role: '',
      source_path: '',
      copied: false,
      message: 'Invalid input',
      error: parseResult.error.message,
    };
  }

  const { project_path, role, source_path, copy, copy_to, notes } = parseResult.data;
  // Use provided name or default to role
  const name = parseResult.data.name || role;

  // Validate project_path is within workspace
  const projectValidation = await validatePathInWorkspace(project_path);
  if (!projectValidation.valid) {
    return {
      success: false, name, role, source_path, copied: false,
      message: 'Project path outside workspace',
      error: projectValidation.error,
    };
  }

  // Validate source_path is within workspace
  const sourceValidation = await validatePathInWorkspace(source_path);
  if (!sourceValidation.valid) {
    return {
      success: false, name, role, source_path, copied: false,
      message: 'Source path outside workspace',
      error: sourceValidation.error,
    };
  }

  try {
    // Verify source exists
    const fileInfo = await getFileInfo(sourceValidation.resolvedPath!);

    // Load or create sources.yaml
    let sources = await loadSourcesYaml(project_path);
    if (!sources) {
      sources = await initSourcesYaml(project_path);
    }

    // Build source entry
    const entry: SourceEntry = {
      path: source_path,
      role,
      type: fileInfo.type,
      file_modified: fileInfo.modified,
      added: new Date().toISOString(),
    };

    if (fileInfo.isDir) {
      entry.file_count = fileInfo.fileCount;
    }

    if (notes) {
      entry.notes = notes;
    }

    // Handle copying
    let actualCopyTo: string | undefined;
    if (copy) {
      const destFolder = copy_to || role;
      actualCopyTo = path.join(project_path, destFolder, path.basename(source_path));

      // Validate destination path is within workspace
      const destValidation = await validatePathInWorkspace(actualCopyTo);
      if (!destValidation.valid) {
        return {
          success: false, name, role, source_path, copied: false,
          message: 'Copy destination outside workspace',
          error: destValidation.error,
        };
      }

      if (fileInfo.isDir) {
        const count = await copyDirectory(source_path, actualCopyTo);
        entry.copied_to = actualCopyTo;
        entry.file_count = count;
      } else {
        await copyFile(source_path, actualCopyTo);
        entry.copied_to = actualCopyTo;
      }
    }

    // Store under unique name key (overwrites if same name exists)
    sources.sources[name] = entry;

    // Update timestamp
    sources.project.updated = new Date().toISOString();

    // Save
    await saveSourcesYaml(project_path, sources);

    return {
      success: true,
      name,
      role,
      source_path,
      copied: copy,
      copied_to: actualCopyTo,
      message: copy
        ? `Added "${name}" (role: ${role}) and copied to ${actualCopyTo}`
        : `Added "${name}" (role: ${role}) as reference`,
    };
  } catch (err) {
    return {
      success: false,
      name,
      role,
      source_path,
      copied: false,
      message: 'Failed to add source',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// TOOL: source_list
// ============================================================================

export async function sourceList(input: unknown): Promise<SourceListOutput> {
  const parseResult = SourceListInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      project_path: '',
      sources: {},
      available_roles: SOURCE_ROLES,
      message: 'Invalid input',
      error: parseResult.error.message,
    };
  }

  const { project_path } = parseResult.data;

  // Validate path is within workspace
  const validation = await validatePathInWorkspace(project_path);
  if (!validation.valid) {
    return {
      success: false, project_path, sources: {}, available_roles: SOURCE_ROLES,
      message: 'Path outside workspace', error: validation.error,
    };
  }

  try {
    const sources = await loadSourcesYaml(project_path);

    if (!sources) {
      return {
        success: true,
        project_path,
        sources: {},
        available_roles: SOURCE_ROLES,
        message: 'No sources.yaml found - project not initialized',
      };
    }

    const count = Object.keys(sources.sources).length;
    return {
      success: true,
      project_path,
      sources: sources.sources,
      available_roles: SOURCE_ROLES,
      message: `Found ${count} tracked sources`,
    };
  } catch (err) {
    return {
      success: false,
      project_path,
      sources: {},
      available_roles: SOURCE_ROLES,
      message: 'Failed to list sources',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// TOOL: source_remove
// ============================================================================

export async function sourceRemove(input: unknown): Promise<SourceRemoveOutput> {
  const parseResult = SourceRemoveInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      name: '',
      message: 'Invalid input',
      error: parseResult.error.message,
    };
  }

  const { project_path, name } = parseResult.data;

  // Validate path is within workspace
  const validation = await validatePathInWorkspace(project_path);
  if (!validation.valid) {
    return {
      success: false, name,
      message: 'Path outside workspace', error: validation.error,
    };
  }

  try {
    const sources = await loadSourcesYaml(project_path);

    if (!sources) {
      return {
        success: false,
        name,
        message: 'No sources.yaml found',
        error: 'Project not initialized',
      };
    }

    if (!(name in sources.sources)) {
      return {
        success: false,
        name,
        message: `Source "${name}" not found`,
        error: 'Name does not exist in sources',
      };
    }

    delete sources.sources[name];
    sources.project.updated = new Date().toISOString();
    await saveSourcesYaml(project_path, sources);

    return {
      success: true,
      name,
      message: `Removed source "${name}"`,
    };
  } catch (err) {
    return {
      success: false,
      name,
      message: 'Failed to remove source',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ============================================================================
// TOOL: source_update_usage
// ============================================================================

export async function sourceUpdateUsage(input: unknown): Promise<SourceUpdateUsageOutput> {
  const parseResult = SourceUpdateUsageInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      name: '',
      message: 'Invalid input',
      error: parseResult.error.message,
    };
  }

  const { project_path, name, used_in } = parseResult.data;

  // Validate path is within workspace
  const validation = await validatePathInWorkspace(project_path);
  if (!validation.valid) {
    return {
      success: false, name,
      message: 'Path outside workspace', error: validation.error,
    };
  }

  try {
    const sources = await loadSourcesYaml(project_path);

    if (!sources) {
      return {
        success: false,
        name,
        message: 'No sources.yaml found',
        error: 'Project not initialized',
      };
    }

    const source = sources.sources[name];
    if (!source) {
      return {
        success: false,
        name,
        message: `Source "${name}" not found`,
        error: 'Name does not exist in sources',
      };
    }

    const now = new Date().toISOString();
    source.last_used = now;
    source.used_in = used_in;

    sources.project.updated = now;
    await saveSourcesYaml(project_path, sources);

    return {
      success: true,
      name,
      message: `Updated usage for "${name}" (used in ${used_in})`,
    };
  } catch (err) {
    return {
      success: false,
      name,
      message: 'Failed to update usage',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
