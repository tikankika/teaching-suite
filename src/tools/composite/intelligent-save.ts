import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { scanForInternalData, type ContentWarning } from '../../utils/content-scanner.js';
import { validatePathInWorkspace, getServerWorkspace } from '../core/workspace.js';
import { appendProcessEvent, type ProcessEventType } from '../../utils/process-log.js';
import { extractTitle } from '../../utils/text-helpers.js';
import { fileExists, ensureDirectory } from '../../utils/file-helpers.js';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Content types supported by intelligent_save.
 * Maps to different default directories and metadata schemas.
 */
export const ContentTypeEnum = z.enum([
  'analysis',
  'reflection',
  'lesson_plan',
  'course_plan',
  'idea',
  'decision',
  'documentation',
  'note',
  'transcript_analysis',
  // Carpenter-compatible
  'synthesis',
  'plan',
  'plan_update',
  'progress_check',
  'conversation_analysis',
  'other',
  // Redesign types
  'deep_analysis',
  'material',
  'lesson_summary',
  'student_summary',
  // post_lesson_auto outputs (Stage 2 — see docs/decisions/post-lesson-two-process-split.md)
  'content',
  'recap',
  'auto_log',
  // v3 cycle outputs (Wave A additive — see methodology/lesson|course|profession/)
  'bridge_intention',           // lesson/bridge.md (Korthagen ALACT carry-forward)
  'pre_course_context_report',  // course/pre_course.md (syllabus + Goodlad analysis report)
  'course_evaluation',          // course/evaluation.md (retrospective alignment + triangulation)
  'term_reflection',            // profession/term_reflection.md (Brookfield 4 lenses, longitudinal)
  'manifest',                   // profession/manifest.md (espoused-vs-in-use, identity)
]);

export type ContentType = z.infer<typeof ContentTypeEnum>;

/**
 * Context for intelligent suggestions.
 */
const ContextSchema = z.object({
  workspace: z.string().optional().describe('Root workspace path'),
  course: z.string().optional().describe('Course identifier'),
  project: z.string().optional().describe('Project identifier'),
  lesson: z.number().optional().describe('Lesson number'),
  module: z.string().optional().describe('Module name'),
  depth: z.string().optional().describe('Reflection depth: minimal, standard, or deep'),
  related_files: z.array(z.string()).optional().describe('Files to link to (will become wikilinks)'),
  tags: z.array(z.string()).optional().describe('Suggested tags'),
  based_on: z.array(z.string()).optional().describe('Files this content is based on'),
  supports: z.array(z.string()).optional().describe('Course goal IDs (G1, LO3) this supports'),
  framework: z.string().optional().describe('Theoretical framework used (gibbs, kolb, brookfield)'),
  learning_objectives: z.array(z.string()).optional().describe('Learning objective IDs'),
});

/**
 * Input schema for intelligent_save tool.
 *
 * Override workflow: To change suggested filename/directory, call again with
 * suggested_filename or suggested_location parameters.
 */
export const IntelligentSaveInputSchema = z.object({
  content: z.string().min(1).describe('The content to save'),
  content_type: ContentTypeEnum.describe('Type of content being saved'),
  context: ContextSchema.optional().describe('Context for intelligent suggestions'),
  suggested_location: z.string().optional().describe("User's preferred directory"),
  suggested_filename: z.string().optional().describe("User's preferred filename"),
  auto_confirm: z.boolean().default(false).describe('Skip confirmation dialog (default: false)'),
});

export type IntelligentSaveInput = z.infer<typeof IntelligentSaveInputSchema>;

/**
 * Suggestion returned when confirmation is needed.
 */
export interface SaveSuggestion {
  filename: string;
  directory: string;
  full_path: string;
  metadata: Record<string, unknown>;
  wikilinks: string[];
  message: string;
}

/**
 * Error structure for failed operations.
 */
export interface SaveError {
  code: 'PERMISSION_DENIED' | 'FILE_EXISTS' | 'INVALID_PATH' | 'UNKNOWN_ERROR';
  message: string;
  details?: unknown;
}

/**
 * Output from intelligent_save tool.
 */
export interface IntelligentSaveOutput {
  success: boolean;
  filepath?: string;
  metadata_generated?: Record<string, unknown>;
  wikilinks_created?: string[];
  content_warnings?: ContentWarning[];
  confirmation_needed?: boolean;
  suggestion?: SaveSuggestion;
  error?: SaveError;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_DIRECTORIES: Record<ContentType, string> = {
  analysis: 'Analysis/',
  reflection: 'Reflections/',
  lesson_plan: 'Lesson_Plans/',
  course_plan: 'Planning/',
  idea: 'Ideas/',
  decision: 'Decisions/',
  documentation: 'Documentation/',
  note: 'Notes/',
  transcript_analysis: 'Notes/',
  synthesis: 'Synteser/',
  plan: 'Planning/',
  plan_update: 'Planning/',
  progress_check: 'Reflections/',
  conversation_analysis: 'Notes/',
  other: 'Misc/',
  // Redesign types
  deep_analysis: 'Analysis/',
  material: 'Material/',
  lesson_summary: 'Analysis/',
  student_summary: 'Material/Student_Summaries/',
  // post_lesson_auto outputs
  content: 'Student_Materials/',
  recap: 'Student_Materials/',
  auto_log: 'Analysis/',
  // v3 cycle outputs (Wave A)
  bridge_intention: 'Reflections/Bryggor/',
  pre_course_context_report: 'Planning/',
  course_evaluation: 'Analysis/',
  // term_reflection and manifest are workspace-root concepts (above per-course).
  // suggestDirectory() routes them to getServerWorkspace() rather than the
  // calling course folder. Path values here are workspace-root-relative.
  term_reflection: 'Profession/Termin/',
  manifest: 'Profession/Manifest/',
};

/**
 * Content types that live at workspace-root, not inside a course folder.
 * suggestDirectory() routes these to getServerWorkspace() — the path in
 * DEFAULT_DIRECTORIES is treated as workspace-root-relative for these types.
 *
 * Per the maintainer + Cowork (2026-05-05): manifest and term_reflection both span
 * across courses — manifest is the teacher's own pedagogical declaration,
 * term_reflection is integrated across all courses in the term. Saving them
 * inside one course folder fragments the teacher's reflective practice.
 */
const WORKSPACE_ROOT_TYPES: ReadonlySet<ContentType> = new Set<ContentType>([
  'manifest',
  'term_reflection',
]);

/**
 * Course_v2 overrides — only entries that differ from DEFAULT_DIRECTORIES.
 *
 * After PR #31 (project_init folder structure for v3) the workspace layout
 * matches v3 cycle docs: Planning/ replaces the old Course_Planning/. The
 * previous course_plan: 'Course_Planning/' override is removed — DEFAULT
 * now serves the right path for both course and course_v2.
 */
const COURSE_V2_OVERRIDES: Partial<Record<ContentType, string>> = {
  note: 'Memos/',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Sanitize filename: Replace spaces with underscores, remove special chars.
 * Preserves Swedish characters (åäö).
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-\.åäöÅÄÖ]/g, '')
    .replace(/_{2,}/g, '_');
}

// Re-exported for test compatibility
export { extractTitle };

/**
 * Generate filename from content_type, project, and date.
 */
export function generateFilename(
  content_type: ContentType,
  project?: string,
  content?: string
): string {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const typeCapitalized = content_type.charAt(0).toUpperCase() + content_type.slice(1);

  const parts = [typeCapitalized];

  if (project) {
    parts.push(project.replace(/\s+/g, '_').substring(0, 30));
  } else if (content) {
    const title = extractTitle(content);
    if (title) {
      parts.push(title.replace(/\s+/g, '_').substring(0, 30));
    }
  }

  parts.push(date);

  return sanitizeFilename(parts.join('_')) + '.md';
}

/**
 * Detect wikilinks in content.
 */
export function detectWikilinks(content: string): string[] {
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
  const matches = content.matchAll(wikilinkRegex);
  return Array.from(matches, (m) => m[1]);
}

/**
 * Convert filepath to wikilink format.
 */
export function pathToWikilink(filepath: string): string {
  return path.basename(filepath, path.extname(filepath));
}

/**
 * Check if a workspace uses the course_v2 structure.
 */
async function isCourseV2Workspace(workspace: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path.join(workspace, '_system'));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Suggest directory based on content_type and workspace.
 * Uses course_v2 folder names when detected.
 *
 * Workspace-root types (manifest, term_reflection) bypass the per-course
 * workspace and route to getServerWorkspace() instead. This keeps a single
 * canonical Profession/ folder across all courses.
 */
export function suggestDirectory(content_type: ContentType, workspace?: string, useV2?: boolean): string {
  const defaultDir = useV2
    ? (COURSE_V2_OVERRIDES[content_type] || DEFAULT_DIRECTORIES[content_type])
    : DEFAULT_DIRECTORIES[content_type];

  if (WORKSPACE_ROOT_TYPES.has(content_type)) {
    const root = getServerWorkspace();
    if (root) return path.join(root, defaultDir);
    // Fall through to workspace-relative if no server workspace configured —
    // better to over-return than silently break with no path at all.
  }

  if (workspace) {
    return path.join(workspace, defaultDir);
  }

  return defaultDir;
}

/**
 * Generate metadata based on content_type and context.
 */
/**
 * Canonical status values (RFC-014 metadata convention).
 * All content types use these four values.
 */
export type CanonicalStatus = 'draft' | 'active' | 'completed' | 'archived';

/**
 * Generate metadata based on content_type and context.
 * Follows RFC-014 three-tier metadata convention (Tier 1 + Tier 2).
 */
export function generateMetadata(
  content: string,
  content_type: ContentType,
  context?: IntelligentSaveInput['context']
): Record<string, unknown> {
  const now = new Date();

  // Tier 1: Core fields (always present)
  const metadata: Record<string, unknown> = {
    title: extractTitle(content),
    created: now.toISOString(),
    date: now.toISOString().split('T')[0],
    type: content_type,
    metadata_version: '1.0',
  };

  // Tier 1: course_instance (from context.course or context.project)
  if (context?.course) metadata.course_instance = context.course;
  else if (context?.project) metadata.course_instance = context.project;

  // Tier 1: tags
  if (context?.tags && context.tags.length > 0) metadata.tags = context.tags;

  // Tier 2: lesson, module (when applicable)
  if (context?.lesson !== undefined) metadata.lesson = context.lesson;
  if (context?.module) metadata.module = context.module;
  if (context?.depth) metadata.depth = context.depth;

  // Related files as wikilinks
  if (context?.related_files && context.related_files.length > 0) {
    metadata.related = context.related_files.map(pathToWikilink);
  }

  // Tier 2: Context fields (optional, schema-defined)
  if (context?.based_on && context.based_on.length > 0) metadata.based_on = context.based_on;
  if (context?.supports && context.supports.length > 0) metadata.supports = context.supports;
  if (context?.framework) metadata.framework = context.framework;
  if (context?.learning_objectives && context.learning_objectives.length > 0) {
    metadata.learning_objectives = context.learning_objectives;
  }

  // Tier 2: Provenance
  metadata.provenance = {
    tool: 'intelligent_save',
    ai_assisted: true,
  };

  // Content-type specific status (RFC-014 canonical values)
  switch (content_type) {
    case 'analysis':
    case 'deep_analysis':
      metadata.status = 'active';
      break;
    case 'reflection':
      metadata.status = 'completed';
      break;
    case 'idea':
      metadata.priority = 'medium';
      metadata.status = 'draft';
      break;
    case 'material':
    case 'lesson_summary':
    case 'student_summary':
    case 'content':
    case 'recap':
    case 'auto_log':
      metadata.status = 'draft';
      break;
    case 'decision':
      metadata.status = 'draft';
      break;
    default:
      metadata.status = 'draft';
      break;
  }

  return metadata;
}

// ============================================================================
// SOFT VALIDATION
// ============================================================================

/**
 * Validate metadata against mandatory field rules.
 * Returns warnings — never blocks saving.
 */
export function validateMetadata(
  metadata: Record<string, unknown>,
  content_type: ContentType
): ContentWarning[] {
  const warnings: ContentWarning[] = [];

  if (!metadata.course_instance) {
    warnings.push({
      code: 'MISSING_COURSE_INSTANCE',
      severity: 'info',
      message: 'Missing course_instance — file will not appear in course queries',
      matches: [],
    });
  }

  // Lesson-scoped types require a lesson number for process log grouping
  const lessonTypes = ['lesson_plan', 'reflection', 'deep_analysis', 'material'];
  if (lessonTypes.includes(content_type) && metadata.lesson === undefined) {
    warnings.push({
      code: 'MISSING_LESSON',
      severity: 'info',
      message: `Missing lesson number for ${content_type}`,
      matches: [],
    });
  }

  const loTypes = ['lesson_plan', 'material'];
  if (loTypes.includes(content_type) && !metadata.learning_objectives) {
    warnings.push({
      code: 'MISSING_LEARNING_OBJECTIVES',
      severity: 'info',
      message: `Missing learning_objectives for ${content_type}`,
      matches: [],
    });
  }

  // post_lesson_auto outputs all reference a lesson plan for cross-linking
  const lessonPlanRefTypes = ['content', 'recap', 'auto_log'];
  if (lessonPlanRefTypes.includes(content_type) && !metadata.lesson_plan) {
    warnings.push({
      code: 'MISSING_LESSON_PLAN',
      severity: 'info',
      message: `Missing lesson_plan reference for ${content_type}`,
      matches: [],
    });
  }

  // content (A1) has a hard rule: requires transcript per post_lesson_auto methodology
  if (content_type === 'content' && !metadata.transcripts) {
    warnings.push({
      code: 'MISSING_TRANSCRIPTS',
      severity: 'info',
      message: 'Missing transcripts for content — A1 Content requires transcript per post_lesson_auto methodology',
      matches: [],
    });
  }

  // auto_log (B) carries the data_quality report that feeds next-lesson planning
  if (content_type === 'auto_log' && !metadata.data_quality) {
    warnings.push({
      code: 'MISSING_DATA_QUALITY',
      severity: 'info',
      message: 'Missing data_quality object for auto_log — required for post_lesson_auto output',
      matches: [],
    });
  }

  return warnings;
}

// ============================================================================
// PROCESS LOG MAPPING
// ============================================================================

/**
 * Content type → process log event type mapping.
 * Types not listed do not generate log entries.
 */
const CONTENT_TYPE_TO_EVENT: Partial<Record<ContentType, ProcessEventType>> = {
  lesson_plan: 'planned',
  reflection: 'reflected',
  deep_analysis: 'deep_analysis',
  material: 'material_produced',
  lesson_summary: 'material_produced',
  student_summary: 'material_produced',
  idea: 'idea_captured',
  decision: 'decision_made',
  course_plan: 'course_planning_stage',
};

/**
 * Check if content already has YAML frontmatter.
 */
export function hasYamlFrontmatter(content: string): boolean {
  return content.trimStart().startsWith('---');
}

/**
 * Format file content with YAML frontmatter.
 * If content already has frontmatter, returns content as-is.
 */
export function formatFileContent(content: string, metadata: Record<string, unknown>): string {
  // If content already has frontmatter, don't add another
  if (hasYamlFrontmatter(content)) {
    return content;
  }
  const yamlFrontmatter = yaml.dump(metadata, { lineWidth: -1 });
  return `---\n${yamlFrontmatter}---\n\n${content}`;
}

// ============================================================================
// JOURNAL UPDATE
// ============================================================================

/**
 * Append a journal entry to _config/course_context.md if it exists.
 * Non-fatal: silently skips if file missing or malformed.
 */
async function appendJournalEntry(
  workspace: string,
  contentType: string,
  filename: string
): Promise<void> {
  // Try _system/config/ first (course_v2), then _config/ (legacy)
  const candidates = [
    path.join(workspace, '_system', 'config', 'course_context.md'),
    path.join(workspace, '_config', 'course_context.md'),
  ];

  let ccPath = '';
  let content = '';
  for (const candidate of candidates) {
    try {
      content = await fs.readFile(candidate, 'utf-8');
      ccPath = candidate;
      break;
    } catch {
      continue;
    }
  }

  if (!ccPath) return; // No course_context.md in either location — skip

  const date = new Date().toISOString().split('T')[0];
  const entry = `- ${date}: ${contentType} sparad: ${filename}`;

  // Find ## Journal section and append
  const journalIndex = content.indexOf('## Journal');
  if (journalIndex === -1) return; // No Journal section — skip

  // Append entry at end of file (Journal is always last section)
  const updatedContent = content.trimEnd() + '\n' + entry + '\n';
  await fs.writeFile(ccPath, updatedContent, 'utf-8');
}

// ============================================================================
// FILE OPERATIONS
// ============================================================================

/**
 * Write file with content.
 */
async function writeFile(filepath: string, content: string): Promise<void> {
  await fs.writeFile(filepath, content, 'utf-8');
}

// ============================================================================
// MAIN TOOL LOGIC
// ============================================================================

/**
 * intelligent_save - Save content with intelligent metadata generation.
 *
 * Workflow:
 * 1. Analysis: Generate filename, directory, metadata suggestions
 * 2. Confirmation: Return suggestion unless auto_confirm=true
 * 3. File Creation: Create directory if needed, write file with frontmatter
 *
 * Override: To change suggestions, call again with suggested_filename/suggested_location.
 */
export async function intelligentSave(input: unknown): Promise<IntelligentSaveOutput> {
  // Validate input with Zod
  const parseResult = IntelligentSaveInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: {
        code: 'INVALID_PATH',
        message: 'Invalid input',
        details: parseResult.error.format(),
      },
    };
  }

  const validatedInput = parseResult.data;

  try {
    // Detect workspace version for directory suggestions
    const workspace = validatedInput.context?.workspace;
    const useV2 = workspace ? await isCourseV2Workspace(workspace) : false;

    // Phase 1: Analysis - Generate suggestions
    const filename =
      validatedInput.suggested_filename ||
      generateFilename(
        validatedInput.content_type,
        validatedInput.context?.project,
        validatedInput.content
      );

    // Resolve directory: if suggested_location is relative, prepend workspace
    const directory = validatedInput.suggested_location
      ? (path.isAbsolute(validatedInput.suggested_location)
        ? validatedInput.suggested_location
        : path.join(workspace || '', validatedInput.suggested_location))
      : suggestDirectory(validatedInput.content_type, workspace, useV2);

    const full_path = path.join(directory, filename);

    // Content scanner: warn about sensitive data (never blocks)
    const contentWarnings = scanForInternalData(validatedInput.content);

    // Validate path format + workspace containment (uses server workspace as fallback).
    // Workspace-root types (manifest, term_reflection) were routed to the server
    // root by suggestDirectory(), so they must validate against the server root —
    // not the narrow per-course workspace they may have been called from, which
    // would (fail-closed) reject the legitimate Profession/ path.
    const validationWorkspace =
      WORKSPACE_ROOT_TYPES.has(validatedInput.content_type) && getServerWorkspace()
        ? getServerWorkspace()
        : validatedInput.context?.workspace;
    const pathValidation = await validatePathInWorkspace(full_path, validationWorkspace);
    if (!pathValidation.valid) {
      return {
        success: false,
        error: {
          code: 'INVALID_PATH',
          message: pathValidation.error || 'Path outside workspace',
        },
      };
    }

    const metadata = generateMetadata(
      validatedInput.content,
      validatedInput.content_type,
      validatedInput.context
    );

    // Soft validation: warn about missing fields, never block
    const metadataWarnings = validateMetadata(metadata, validatedInput.content_type);
    const allWarnings = [...contentWarnings, ...metadataWarnings];

    const wikilinks_in_content = detectWikilinks(validatedInput.content);
    const wikilinks_from_related =
      validatedInput.context?.related_files?.map(pathToWikilink) || [];
    const all_wikilinks = [...new Set([...wikilinks_in_content, ...wikilinks_from_related])];

    // Phase 2: Confirmation (unless auto_confirm)
    if (!validatedInput.auto_confirm) {
      return {
        success: true, // Not an error - just needs confirmation
        confirmation_needed: true,
        content_warnings: allWarnings.length > 0 ? allWarnings : undefined,
        suggestion: {
          filename,
          directory,
          full_path,
          metadata,
          wikilinks: all_wikilinks,
          message: `Save as '${filename}' in ${directory}? Call again with auto_confirm: true to proceed, or provide suggested_filename/suggested_location to change.`,
        },
      };
    }

    // Phase 3: File Creation

    // Check if file exists
    if (await fileExists(full_path)) {
      const altFilename = filename.replace('.md', '_v2.md');
      return {
        success: false,
        error: {
          code: 'FILE_EXISTS',
          message: `File already exists: ${full_path}`,
          details: {
            existing_path: full_path,
            suggestion: `Use suggested_filename: "${altFilename}" or choose a different name`,
          },
        },
      };
    }

    // Create directory if needed
    await ensureDirectory(directory);

    // Write file
    const file_content = formatFileContent(validatedInput.content, metadata);
    try {
      await writeFile(full_path, file_content);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === 'EACCES') {
        return {
          success: false,
          error: {
            code: 'PERMISSION_DENIED',
            message: `Cannot write to ${full_path}: Permission denied`,
          },
        };
      }
      throw error;
    }

    // Journal + process log updates run in parallel (both non-fatal)
    if (workspace) {
      const sideEffects: Promise<unknown>[] = [
        appendJournalEntry(workspace, validatedInput.content_type, filename),
      ];

      if (useV2) {
        const eventType = CONTENT_TYPE_TO_EVENT[validatedInput.content_type];
        if (eventType) {
          const relativePath = path.relative(workspace, full_path);
          sideEffects.push(
            appendProcessEvent({
              workspace,
              event: {
                type: eventType,
                file: relativePath,
                timestamp: new Date().toISOString(),
                ...(validatedInput.context?.depth && { depth: validatedInput.context.depth }),
                ...(validatedInput.content_type === 'reflection' && {
                  carry_forward_in: relativePath,
                }),
              },
              lesson: validatedInput.context?.lesson,
              module: validatedInput.context?.module,
            }),
          );
        }
      }

      await Promise.allSettled(sideEffects);
    }

    // Success!
    return {
      success: true,
      filepath: full_path,
      metadata_generated: metadata,
      wikilinks_created: all_wikilinks,
      content_warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: err.message || 'An unknown error occurred',
        details: err,
      },
    };
  }
}

/**
 * Tool definition for MCP registration.
 */
export const intelligentSaveTool = {
  name: 'intelligent_save',
  description:
    'Save content with intelligent metadata generation and interactive file placement. Supports analysis, reflections, lesson plans, ideas, decisions, documentation, and more. Returns a suggestion for confirmation unless auto_confirm is true.',
  inputSchema: IntelligentSaveInputSchema,
  handler: intelligentSave,
};
