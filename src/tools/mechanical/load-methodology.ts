/**
 * load_methodology — Load methodology doc(s) by process name.
 *
 * Mechanical tool: file routing, not domain logic.
 * Resolution: workspace/methodology/{folder}/{file} → server internal fallback.
 */

import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { fileExists } from '../../utils/file-helpers.js';
import { validatePathInWorkspace, getServerWorkspace } from '../core/workspace.js';

// ============================================================================
// RESOLVE SERVER METHODOLOGY PATHS
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// v3 cycle paths
const SERVER_LESSON = path.resolve(__dirname, '../../../methodology/lesson');
const SERVER_COURSE = path.resolve(__dirname, '../../../methodology/course');
const SERVER_PROFESSION = path.resolve(__dirname, '../../../methodology/profession');
// v3 architecture seams — bridges between cycles + cross-cutting tensions
const SERVER_BRIDGES = path.resolve(__dirname, '../../../methodology/bridges');
const SERVER_METHODOLOGY_ROOT = path.resolve(__dirname, '../../../methodology');

// ============================================================================
// SCHEMA
// ============================================================================

export const LoadMethodologyInputSchema = z.object({
  process: z.enum([
    // Teaching cycle
    'context_gathering',
    'pre_lesson_planning',
    'post_lesson_auto',       // v0.4+ unified post-lesson pipeline (A1/A2/auto-log)
    'post_lesson_reflection',
    // Course design
    'course_intro',
    'course_syllabus',
    'course_previous',
    'course_objectives',
    'course_modules',
    'course_assessment',
    'course_sequences',
    // v3 architecture seams — bridges between cycles
    'lesson_to_course_bridge',
    'course_to_profession_bridge',
    'profession_to_lesson_bridge',
    'student_data_to_teacher_bridge',
    // Cross-cutting tensions reference (top-level methodology doc)
    'tensions',
    // v3 cycle methodology enums (2026-05-05) — pure plumbing, makes existing
    // v3 docs callable by name. No policy attached; methodology files specify
    // their own triggers per Synlighetsprincipen v3.0.3.
    'brygga',
    'course_conduct',
    'course_revision',
    'course_evaluation',
    'term_reflection',
    'manifest',
    // v3 course-design enums (Y-2 lift, 2026-05-05)
    'course_design',
    'course_pre_course',
    // Reference docs (2026-05-05, v0.5.0) — not cycle processes, but routed
    // through this enum for simplicity. May be split into a separate
    // 'methodology_doc' enum in v0.6 if friction emerges.
    'shared_principles',         // top-level v3 fundament
    'synlighetsprincip',         // v3 architectural rule (visibility principle)
    'pedagogisk_arkitektur',     // v3 three-cycle architecture overview
  ]).describe('Which process methodology to load'),
  workspace: z.string().optional().describe('Project workspace path (optional — falls back to server internal docs)'),
});

// ============================================================================
// TYPES
// ============================================================================

/**
 * load_methodology returns a path, not content (v0.5.0 onward).
 *
 * Rationale: the v3 methodology files range from 26–53 kB; combined with
 * the previously auto-bundled shared_principles (18 kB) the JSON wire size
 * exceeded the MCP tool-result limit on most v3 cycle docs. Returning a
 * path defers the read to file_read, which is designed for arbitrary file
 * sizes and stays inside the workspace boundary.
 *
 * The auto-bundling of shared_principles was also semantically wrong —
 * shared_principles is a top-level v3 fundament alongside synlighetsprincip.md,
 * tensions.md, and pedagogisk_arkitektur.md, loaded explicitly when
 * methodology references it.
 *
 * The `readable` flag tells the caller whether file_read can read the path
 * directly. true  = path is inside the server workspace (--workspace lock),
 * false = path is server-internal (MCP install dir); caller should run
 * project_init to populate workspace methodology and re-call load_methodology.
 */
export interface LoadMethodologyOutput {
  success: boolean;
  process: string;
  source: 'workspace' | 'server';
  file?: {
    role: 'methodology';
    path: string;
    size_bytes: number;
    readable: boolean;
  };
  next_step?: string;
  error?: string;
  warning?: string;
}

// ============================================================================
// CONSTANTS — process name → folder + file
// ============================================================================

const PROCESS_FILES: Record<string, { folder: string; file: string }> = {
  // Y-1 trivia swap (2026-04-29) — clean 1:1 v0.x → v3 mappings.
  // Callers get Klafki+UbD-grounded methodology instead of Vygotsky+Hattie.
  pre_lesson_planning:    { folder: 'lesson',         file: 'pre_lesson.md' },         // was teaching-cycle/02_pre_lesson_planning.md
  post_lesson_auto:       { folder: 'lesson',         file: 'post_lesson_auto.md' },   // was teaching-cycle/03_post_lesson_auto.md
  post_lesson_reflection: { folder: 'lesson',         file: 'post_lesson_refl.md' },   // was teaching-cycle/03c_post_lesson_reflection.md
  // Y-2 collapse (2026-05-05) — seven legacy course-design enums now route to
  // their v3 equivalents (pre_course.md / design.md). Each enum below also has
  // an entry in DEPRECATED_PROCESSES below.
  course_intro:           { folder: 'course',         file: 'pre_course.md' },
  course_syllabus:        { folder: 'course',         file: 'pre_course.md' },
  course_previous:        { folder: 'course',         file: 'pre_course.md' },
  course_objectives:      { folder: 'course',         file: 'design.md' },
  course_modules:         { folder: 'course',         file: 'design.md' },
  course_assessment:      { folder: 'course',         file: 'assessment.md' },         // Y-1 trivia: was course-design/05_assessment_strategy.md
  course_sequences:       { folder: 'course',         file: 'design.md' },
  // context_gathering — Y-2 collapse routes it to v3 pre_lesson.md (which absorbs
  // Klafki Phase 1 context-gathering work). Deprecated; use pre_lesson_planning.
  context_gathering:      { folder: 'lesson',         file: 'pre_lesson.md' },
  // v3 architecture seams (PR δ — 2026-05-03)
  lesson_to_course_bridge:        { folder: 'bridges', file: 'lesson_to_course.md' },
  course_to_profession_bridge:    { folder: 'bridges', file: 'course_to_profession.md' },
  profession_to_lesson_bridge:    { folder: 'bridges', file: 'profession_to_lesson.md' },
  student_data_to_teacher_bridge: { folder: 'bridges', file: 'student_data_to_teacher.md' },
  // tensions.md lives at the methodology root, not under a cycle folder.
  // Empty string folder + SERVER_PATHS[''] = SERVER_METHODOLOGY_ROOT.
  tensions:                       { folder: '',        file: 'tensions.md' },
  // v3 cycle enums (2026-05-05) — pure plumbing for previously non-routable
  // v3 docs. The maintainer's framing: invocation routing is A-mechanic, not policy.
  brygga:             { folder: 'lesson',     file: 'bridge.md' },
  course_conduct:     { folder: 'course',     file: 'conduct.md' },
  course_revision:    { folder: 'course',     file: 'revision.md' },
  course_evaluation:  { folder: 'course',     file: 'evaluation.md' },
  term_reflection:    { folder: 'profession', file: 'term_reflection.md' },
  manifest:           { folder: 'profession', file: 'manifest.md' },
  // v3 course-design enums (Y-2 lift, 2026-05-05)
  course_design:      { folder: 'course',     file: 'design.md' },
  course_pre_course:  { folder: 'course',     file: 'pre_course.md' },
  // Reference docs (v0.5.0) — explicit access to top-level v3 fundament
  // documents, previously either auto-bundled (shared_principles) or only
  // loadable via separate file_read calls.
  shared_principles:      { folder: '',               file: 'shared_principles.md' },
  synlighetsprincip:      { folder: '',               file: 'synlighetsprincip.md' },
  pedagogisk_arkitektur:  { folder: '',               file: 'pedagogisk_arkitektur.md' },
};

/**
 * Processes that are deprecated and will be removed in a future version.
 * They still resolve to their original methodology file so existing callers
 * do not break, but they emit a deprecation warning pointing to the
 * replacement (which may be a process name, a doc path, or a category
 * description) and the relevant ADR.
 */
const DEPRECATED_PROCESSES: Record<string, {
  replacement: string;
  removal_target: string;
  rationale: string;
  see_doc: string;
}> = {
  // Y-2 wave (2026-05-05) — seven legacy course-design enums collapsed to v3.
  // Routing already updated above (PROCESS_FILES); these entries surface the
  // deprecation warning so callers learn the v3 enum name.
  course_intro: {
    replacement: 'course_pre_course',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — pre_course.md absorbs course_intro/syllabus/previous content.',
    see_doc: 'methodology/course/pre_course.md',
  },
  course_syllabus: {
    replacement: 'course_pre_course',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — pre_course.md absorbs syllabus analysis.',
    see_doc: 'methodology/course/pre_course.md',
  },
  course_previous: {
    replacement: 'course_pre_course',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — pre_course.md absorbs previous-course review.',
    see_doc: 'methodology/course/pre_course.md',
  },
  course_objectives: {
    replacement: 'course_design',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — design.md absorbs learning-objectives work.',
    see_doc: 'methodology/course/design.md',
  },
  course_modules: {
    replacement: 'course_design',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — design.md absorbs module structure.',
    see_doc: 'methodology/course/design.md',
  },
  course_sequences: {
    replacement: 'course_design',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — design.md absorbs lesson-sequence work.',
    see_doc: 'methodology/course/design.md',
  },
  context_gathering: {
    replacement: 'pre_lesson_planning',
    removal_target: 'v0.5',
    rationale: 'Y-2 collapse — Klafki Phase 1 context-gathering folded into pre_lesson.md.',
    see_doc: 'methodology/lesson/pre_lesson.md',
  },
};

// Map folders to server paths
const SERVER_PATHS: Record<string, string> = {
  // v3 cycle dirs
  'lesson':     SERVER_LESSON,
  'course':     SERVER_COURSE,
  'profession': SERVER_PROFESSION,
  // v3 architecture seams
  'bridges':    SERVER_BRIDGES,
  '':           SERVER_METHODOLOGY_ROOT,  // top-level methodology files (e.g. tensions.md)
};

// ============================================================================
// HELPERS
// ============================================================================

// fileExists imported from utils/file-helpers.ts — used as a lightweight
// existence probe (no full read) while resolving the methodology doc path.

// ============================================================================
// MAIN
// ============================================================================

/**
 * Resolve the methodology file path for a given process.
 *
 * Lookup order (v0.6.0+):
 *   1. <server_workspace>/Teaching_Suite/methodology/  — central, primary location
 *      (created by project_init's ensureCentralMethodology in v0.6.0+).
 *      Visible and editable by the teacher; synced via Nextcloud.
 *   2. <caller_workspace>/_system/methodology/  — back-compat for v0.5.0
 *      workspaces created before central methodology shipped.
 *   3. <caller_workspace>/methodology/  — legacy non-course-v2 layout.
 *   4. Server-internal MCP install dir — fallback for unconfigured workspaces.
 *
 * The `readable` flag indicates whether file_read can read the path:
 *   true  = path is inside --workspace lock (any of locations 1-3)
 *   false = server fallback (location 4); caller should run project_init
 */
async function resolveMethodologyPath(
  processInfo: { folder: string; file: string },
  workspace?: string,
): Promise<{ path: string; source: 'workspace' | 'server'; readable: boolean } | null> {
  // 1. Central methodology at <server_workspace>/Teaching_Suite/methodology/
  const serverWorkspace = getServerWorkspace();
  if (serverWorkspace) {
    const centralPath = path.join(
      serverWorkspace,
      'Teaching_Suite',
      'methodology',
      processInfo.folder,
      processInfo.file,
    );
    if (await fileExists(centralPath)) {
      return { path: centralPath, source: 'workspace', readable: true };
    }
  }

  // 2-3. Per-course back-compat fallbacks (v0.5.0 workspaces).
  if (workspace) {
    const methodologyBases = [
      path.join(workspace, '_system', 'methodology'),
      path.join(workspace, 'methodology'),
    ];
    for (const base of methodologyBases) {
      const candidate = path.join(base, processInfo.folder, processInfo.file);
      if (await fileExists(candidate)) {
        return { path: candidate, source: 'workspace', readable: true };
      }
    }
  }

  // 4. Server fallback — path lives in the MCP install dir, outside the
  // --workspace lock. file_read will reject; caller must run project_init
  // to populate central methodology.
  const serverFolder = SERVER_PATHS[processInfo.folder];
  if (!serverFolder) return null;
  const candidate = path.join(serverFolder, processInfo.file);
  if (await fileExists(candidate)) {
    return { path: candidate, source: 'server', readable: false };
  }
  return null;
}

export async function loadMethodology(input: unknown): Promise<LoadMethodologyOutput> {
  const parseResult = LoadMethodologyInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      process: '',
      source: 'server',
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { process, workspace } = parseResult.data;
  const processInfo = PROCESS_FILES[process];

  if (!processInfo) {
    return {
      success: false,
      process,
      source: 'server',
      error: `Unknown process: ${process}`,
    };
  }

  if (workspace) {
    const wsValidation = await validatePathInWorkspace(workspace);
    if (!wsValidation.valid) {
      return {
        success: false,
        process,
        source: 'server',
        error: wsValidation.error || 'Workspace path outside server workspace',
      };
    }
  }

  const resolved = await resolveMethodologyPath(processInfo, workspace);
  if (!resolved) {
    return {
      success: false,
      process,
      source: 'server',
      error: `Methodology doc not found: ${processInfo.file}. Run project_init to set up the project, or check workspace path.`,
    };
  }

  // Compute file size for the file metadata. On error (file disappeared
  // between resolve and stat — extremely unlikely), fall back to 0.
  let sizeBytes = 0;
  try {
    const stats = await fs.stat(resolved.path);
    sizeBytes = stats.size;
  } catch {
    // Non-fatal — caller can still file_read; size is informational only.
  }

  const deprecation = DEPRECATED_PROCESSES[process];
  const warning = deprecation
    ? `'${process}' is deprecated and scheduled for removal in ${deprecation.removal_target}. Replacement: ${deprecation.replacement}. Rationale: ${deprecation.rationale}. See ${deprecation.see_doc}.`
    : undefined;

  const nextStep = resolved.readable
    ? `Call file_read('${resolved.path}') to get content.`
    : `Workspace methodology not found. Run project_init first to populate the workspace, or read the server-internal path directly via filesystem.`;

  return {
    success: true,
    process,
    source: resolved.source,
    file: {
      role: 'methodology',
      path: resolved.path,
      size_bytes: sizeBytes,
      readable: resolved.readable,
    },
    next_step: nextStep,
    ...(warning ? { warning } : {}),
  };
}
