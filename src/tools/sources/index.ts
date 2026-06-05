/**
 * Source Tools
 *
 * Generic tools for project scanning and source tracking.
 * Used by all processes (course_design, lesson_planning, etc.)
 */

export {
  projectScan,
  ProjectScanInputSchema,
  type ProjectScanOutput,
  type FileInfo,
  type Suggestion,
} from './scan.js';

export {
  sourceAdd,
  SourceAddInputSchema,
  sourceList,
  SourceListInputSchema,
  sourceRemove,
  SourceRemoveInputSchema,
  sourceUpdateUsage,
  SourceUpdateUsageInputSchema,
  loadSourcesYaml,
  saveSourcesYaml,
  SOURCE_ROLES,
  type SourceRole,
  type SourceAddOutput,
  type SourceListOutput,
  type SourceRemoveOutput,
  type SourceUpdateUsageOutput,
  type SourceEntry,
  type SourcesYaml,
} from './track.js';
