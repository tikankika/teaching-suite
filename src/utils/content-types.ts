/**
 * Single source of truth for where each content type's files live.
 *
 * Consumed by intelligent_save (write routing — DEFAULT_DIRECTORIES,
 * COURSE_V2_OVERRIDES and WORKSPACE_ROOT_TYPES are all derived from this) and
 * guarded against find_context's search set by a drift test. Adding or moving a
 * content type's directory HERE — rather than in four hand-maintained tables
 * across intelligent-save, find-context, project-init and init-profession — is
 * what keeps the write and search sides from diverging. (The Profession/Termin
 * regression, where term reflections were written to a folder find_context
 * never scanned, was the first symptom of that drift.)
 */

export type ContentScope = 'course' | 'workspace_root';

export interface ContentTypeDirectory {
  /**
   * Default workspace directory. Course-relative, except for
   * workspace_root-scoped types where it is workspace-root-relative.
   */
  directory: string;
  /** Override directory for the course_v2 layout, when it differs. */
  courseV2Directory?: string;
  /**
   * 'workspace_root' types (manifest, term_reflection) span all courses and
   * live above any single course folder — suggestDirectory() routes them to
   * the server workspace root, and they validate against it. Defaults to
   * 'course' when omitted.
   *
   * Per the maintainer + Cowork (2026-05-05): manifest is the teacher's own
   * pedagogical declaration; term_reflection is integrated across all courses
   * in the term. Saving either inside one course folder fragments the
   * teacher's reflective practice.
   */
  scope?: ContentScope;
}

/**
 * Registry keyed by content type. Every `ContentType` in
 * intelligent-save's `ContentTypeEnum` must have an entry here — enforced by
 * the completeness test in tests/content-types.test.ts.
 */
export const CONTENT_TYPE_DIRECTORIES: Record<string, ContentTypeDirectory> = {
  analysis: { directory: 'Analysis/' },
  reflection: { directory: 'Reflections/' },
  lesson_plan: { directory: 'Lesson_Plans/' },
  course_plan: { directory: 'Planning/' },
  idea: { directory: 'Ideas/' },
  decision: { directory: 'Decisions/' },
  documentation: { directory: 'Documentation/' },
  note: { directory: 'Notes/', courseV2Directory: 'Memos/' },
  transcript_analysis: { directory: 'Notes/' },
  synthesis: { directory: 'Synteser/' },
  plan: { directory: 'Planning/' },
  plan_update: { directory: 'Planning/' },
  progress_check: { directory: 'Reflections/' },
  conversation_analysis: { directory: 'Notes/' },
  other: { directory: 'Misc/' },
  // Redesign types
  deep_analysis: { directory: 'Analysis/' },
  material: { directory: 'Material/' },
  lesson_summary: { directory: 'Analysis/' },
  student_summary: { directory: 'Material/Student_Summaries/' },
  // post_lesson_auto outputs
  content: { directory: 'Student_Materials/' },
  recap: { directory: 'Student_Materials/' },
  auto_log: { directory: 'Analysis/' },
  // v3 cycle outputs (Wave A)
  bridge_intention: { directory: 'Reflections/Bryggor/' },
  pre_course_context_report: { directory: 'Planning/' },
  course_evaluation: { directory: 'Analysis/' },
  // Workspace-root profession concepts (routed to the server workspace root)
  term_reflection: { directory: 'Profession/Termin/', scope: 'workspace_root' },
  manifest: { directory: 'Profession/Manifest/', scope: 'workspace_root' },
};

/**
 * Workspace-root content types as `{ type, directory }`, with the trailing
 * slash stripped from each directory. The single place that answers "which
 * types live at the workspace root, and where" — consumed by init_profession
 * (folder creation) and find_context (search set) so neither re-hardcodes the
 * Profession/* paths and drifts from intelligent_save's write routing.
 */
export function workspaceRootDirectoryEntries(): Array<{ type: string; directory: string }> {
  return Object.entries(CONTENT_TYPE_DIRECTORIES)
    .filter(([, def]) => def.scope === 'workspace_root')
    .map(([type, def]) => ({ type, directory: def.directory.replace(/\/$/, '') }));
}

/** Workspace-root directories (no trailing slash), e.g. ['Profession/Termin', …]. */
export function workspaceRootDirectories(): string[] {
  return workspaceRootDirectoryEntries().map((e) => e.directory);
}

/**
 * Every content type name in the registry, in declaration order. find_context
 * derives its searchable `content_types` enum from this so the search side can
 * never drift behind the write side (the 27/20 divergence 3c closes). Guarded
 * by the registry-equality test in tests/content-types.test.ts.
 */
export function contentTypeNames(): string[] {
  return Object.keys(CONTENT_TYPE_DIRECTORIES);
}
