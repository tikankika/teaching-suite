/**
 * find_context — Search workspace for files by content_type.
 *
 * Mechanical tool: finds files, reads YAML frontmatter metadata.
 * Does NOT read file contents — just returns paths + metadata.
 * Backward compatible: searches both old and new type names.
 *
 * Adapted from Carpenter MCP for teaching domain.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import type { Dirent } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { validatePathInWorkspace } from '../core/workspace.js';
import { workspaceRootDirectoryEntries, contentTypeNames } from '../../utils/content-types.js';

// ============================================================================
// SCHEMA
// ============================================================================

// Searchable content types are derived from the shared registry (the same
// single source intelligent_save writes by), so the search side can never drift
// behind the write side — every type that can be saved can be searched. Pinned
// by the registry-equality test in tests/content-types.test.ts.
const SEARCHABLE_CONTENT_TYPES = contentTypeNames() as [string, ...string[]];

export const FindContextInputSchema = z.object({
  workspace: z.string().min(1).describe('Project workspace path'),
  content_types: z.array(z.enum(SEARCHABLE_CONTENT_TYPES)).describe('Types of content to search for'),
  topic: z.string().optional().describe('Filter by topic keyword in title or tags'),
  supports: z.string().optional().describe('Filter by course goal or LO code (e.g., "LO15", "G1")'),
  framework: z.string().optional().describe('Filter by pedagogical framework (e.g., "gibbs", "kolb")'),
  since: z.string().optional().describe('Filter by date — only return files whose frontmatter date is >= since (ISO date string). Files without dated frontmatter are kept (no exclusion on missing data).'),
  max_results: z.number().default(10).describe('Max results per type'),
});

// ============================================================================
// TYPES
// ============================================================================

interface ContextResult {
  path: string;
  content_type: string;
  canonical_type: string;
  match_source: 'frontmatter' | 'directory' | 'filename';
  date: string;
  title: string;
  size: number;
  supports?: string[];
  learning_objectives?: string[];
  based_on?: string[];
  framework?: string;
  status?: string;
}

export interface FindContextOutput {
  success: boolean;
  results: ContextResult[];
  total_found: number;
  error?: string;
}

// ============================================================================
// BACKWARD COMPATIBILITY
// ============================================================================

const TYPE_ALIASES: Record<string, string[]> = {
  'lesson_plan':            ['lesson_plan', 'lektionsplan'],
  'reflection':             ['reflection', 'reflektion'],
  'idea':                   ['idea', 'idé'],
  'note':                   ['note', 'anteckning'],
  'course_plan':            ['course_plan', 'kursplan'],
  'transcript_analysis':    ['transcript_analysis', 'transkript'],
  'synthesis':              ['synthesis', 'syntes'],
  'plan':                   ['plan'],
  'plan_update':            ['plan_update'],
  'progress_check':         ['progress_check', 'mid_check'],
  'conversation_analysis':  ['conversation_analysis', 'konversationsanalys'],
  'analysis':               ['analysis', 'analys'],
  'decision':               ['decision', 'beslut'],
  'documentation':          ['documentation', 'dokumentation'],
  // v3 cycle outputs
  'bridge_intention':         ['bridge_intention', 'brygga', 'bridge'],
  'pre_course_context_report':['pre_course_context_report', 'pre_kurs_rapport', 'pre_course_report'],
  'course_evaluation':        ['course_evaluation', 'kursutvardering', 'kurs_evaluation'],
  'term_reflection':          ['term_reflection', 'terminsreflektion'],
  'manifest':                 ['manifest', 'profession_manifest'],
  'other':                  ['other'],
};

export const SEARCH_DIRS: string[] = [
  // Flat structure (current standard)
  'Reflections', 'Reflektioner',
  'Lesson_Plans', 'Lektions planeringar',
  'Ideas', 'Idéer',
  'Notes', 'Anteckningar', 'Memos',
  'Planning', 'Analysis',
  'Decisions', 'Documentation',
  'Transcripts', 'Misc',
  // Course-specific flat dirs
  'Styrdokument',
  'Data/Transkript',
  'Data/Teacher_Insights',
  'Data/Elevreflektioner',
  'Exams',
  // v3 workspace dirs (added in PR #31)
  'Reflections/Bryggor',
  'Reflections/Term',        // legacy term-reflection location (back-compat)
  'Student_Materials',
  // 3c: course material. Scanned RECURSIVELY (see RECURSIVE_SEARCH_DIRS) so the
  // teacher's own hand-sorted subtree (Material/Klart, Material/Övningar …) and
  // Material/Student_Summaries (student_summary's write dir) are all reachable.
  'Material',
  // Backward compat with Carpenter-style dirs
  'Synteser', 'Planer',
  // Legacy course structure (Input/Process/Output)
  'Process/Reflections',
  'Process/Lesson_Plans',
  'Process/Ideas',
  'Process/Analysis',
  'Process/Planning',
  'Input/Styrdokument',
  'Input/Material',
  'Input/Transkript',
  'Input/Teacher_Insights',
  'Output/Reports',
  // Workspace-root content-type dirs (Profession/*) — derived from the shared
  // registry so they cannot drift from intelligent_save's write routing.
  ...workspaceRootDirectoryEntries().map((e) => e.directory),
];

/**
 * Search dirs scanned RECURSIVELY (whole subtree), not just their top level.
 * Material/ is the teacher's hand-sorted material tree — a flat scan would hide
 * everything below Material/Klart, Material/Övningar, etc. (a silent hole the
 * teacher would hit). A recursive Material/ also subsumes Material/Student_Summaries
 * (student_summary's write dir), so that type needs no separate entry. The drift
 * guard in tests/content-types.test.ts is recursion-aware via this list.
 */
export const RECURSIVE_SEARCH_DIRS: string[] = ['Material'];

// Directory name → canonical type (fallback when no YAML frontmatter)
const DIR_TYPE_MAP: Record<string, string> = {
  'Reflections': 'reflection',
  'Reflektioner': 'reflection',
  'Lesson_Plans': 'lesson_plan',
  'Lektions planeringar': 'lesson_plan',
  'Ideas': 'idea',
  'Idéer': 'idea',
  'Notes': 'note',
  'Anteckningar': 'note',
  'Memos': 'note',
  'Planning': 'course_plan',
  'Analysis': 'analysis',
  'Decisions': 'decision',
  'Documentation': 'documentation',
  'Transcripts': 'transcript_analysis',
  'Synteser': 'synthesis',
  'Planer': 'plan',
  'Misc': 'note',
  // Course-specific flat dirs
  'Styrdokument': 'course_plan',
  'Data/Transkript': 'transcript_analysis',
  'Data/Teacher_Insights': 'analysis',
  'Data/Elevreflektioner': 'note',
  'Exams': 'note',
  // Legacy course structure (Input/Process/Output)
  'Process/Reflections': 'reflection',
  'Process/Lesson_Plans': 'lesson_plan',
  'Process/Ideas': 'idea',
  'Process/Analysis': 'analysis',
  'Process/Planning': 'course_plan',
  'Input/Styrdokument': 'course_plan',
  'Input/Material': 'note',
  'Input/Transkript': 'transcript_analysis',
  'Input/Teacher_Insights': 'analysis',
  'Output/Reports': 'documentation',
  // v3 workspace dirs
  'Reflections/Bryggor': 'bridge_intention',
  'Reflections/Term': 'term_reflection',
  'Student_Materials': 'material',
  // 3c: Material tree. The walk-up resolver picks the most specific match, so a
  // frontmatter-less file under Material/Student_Summaries resolves to
  // student_summary, while anything else under Material resolves to material.
  'Material': 'material',
  'Material/Student_Summaries': 'student_summary',
  // Workspace-root dirs (Profession/*) — derived from the shared registry.
  ...Object.fromEntries(workspaceRootDirectoryEntries().map((e) => [e.directory, e.type])),
};

// Filename patterns → canonical type (fallback when no YAML frontmatter)
const FILENAME_PATTERNS: Array<{ pattern: RegExp; type: string }> = [
  { pattern: /lektionsplan/i, type: 'lesson_plan' },
  { pattern: /lesson.?plan/i, type: 'lesson_plan' },
  { pattern: /reflektion/i, type: 'reflection' },
  { pattern: /reflection/i, type: 'reflection' },
  { pattern: /syntes/i, type: 'synthesis' },
  { pattern: /synthesis/i, type: 'synthesis' },
  { pattern: /plan/i, type: 'plan' },
  { pattern: /konversationsanalys/i, type: 'conversation_analysis' },
  { pattern: /conversation/i, type: 'conversation_analysis' },
  { pattern: /transkript/i, type: 'transcript_analysis' },
  { pattern: /transcript/i, type: 'transcript_analysis' },
  { pattern: /idea/i, type: 'idea' },
  { pattern: /idé/i, type: 'idea' },
  // v3 cycle outputs
  { pattern: /brygga/i, type: 'bridge_intention' },
  { pattern: /bridge/i, type: 'bridge_intention' },
  { pattern: /pre_kurs|pre_course/i, type: 'pre_course_context_report' },
  { pattern: /terminsreflektion|term_reflection/i, type: 'term_reflection' },
  { pattern: /manifest/i, type: 'manifest' },
  { pattern: /evaluation|utvärdering|utvardering/i, type: 'course_evaluation' },
];

// ============================================================================
// HELPERS
// ============================================================================

function parseYamlFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  try {
    return (yaml.load(match[1]) as Record<string, unknown>) || {};
  } catch {
    return {};
  }
}

function matchesTopic(frontmatter: Record<string, unknown>, topic: string, content: string): boolean {
  const lower = topic.toLowerCase();

  // Check frontmatter fields
  const title = String(frontmatter.title || frontmatter.topic || '');
  if (title.toLowerCase().includes(lower)) return true;

  const tags = frontmatter.tags;
  if (Array.isArray(tags)) {
    if (tags.some(t => String(t).toLowerCase().includes(lower))) return true;
  }

  const typ = String(frontmatter.type || '');
  if (typ.toLowerCase().includes(lower)) return true;

  // Course identifier: check course_instance, course, kurs (deprecated)
  const kurs = String(frontmatter.course_instance || frontmatter.course || frontmatter.kurs || '');
  if (kurs.toLowerCase().includes(lower)) return true;

  // Check body text (first ~2KB)
  if (content.toLowerCase().includes(lower)) return true;

  return false;
}

/**
 * Check if frontmatter supports a given goal/LO code.
 * Searches both `supports` array and `learning_objectives` array.
 */
function matchesSupports(frontmatter: Record<string, unknown>, code: string): boolean {
  const upper = code.toUpperCase();

  const supports = frontmatter.supports;
  if (Array.isArray(supports)) {
    if (supports.some(s => String(s).toUpperCase() === upper)) return true;
  }

  const los = frontmatter.learning_objectives;
  if (Array.isArray(los)) {
    for (const lo of los) {
      // Handle both string format ("LO15") and object format ({ code: "LO15", ... })
      if (typeof lo === 'string' && lo.toUpperCase() === upper) return true;
      if (lo && typeof lo === 'object' && 'code' in lo) {
        if (String((lo as Record<string, unknown>).code).toUpperCase() === upper) return true;
      }
    }
  }

  return false;
}

/**
 * Extract array of strings from frontmatter field.
 */
function extractStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return value.map(v => String(v));
}

// ============================================================================
// MAIN
// ============================================================================

export async function findContext(input: unknown): Promise<FindContextOutput> {
  const parseResult = FindContextInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      results: [],
      total_found: 0,
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { workspace, content_types, topic, supports, framework, since, max_results } = parseResult.data;

  // Validate path
  const pathValidation = await validatePathInWorkspace(workspace);
  if (!pathValidation.valid) {
    return {
      success: false,
      results: [],
      total_found: 0,
      error: pathValidation.error || 'Path outside workspace',
    };
  }

  // Build set of all type strings to match
  const typeStringsToMatch = new Set<string>();
  const canonicalMap = new Map<string, string>();

  for (const ct of content_types) {
    const aliases = TYPE_ALIASES[ct] || [ct];
    for (const alias of aliases) {
      typeStringsToMatch.add(alias);
      canonicalMap.set(alias, ct);
    }
  }

  // Resolve a file's directory to a canonical type via DIR_TYPE_MAP, trying the
  // most specific path first and walking up to parents — so a frontmatter-less
  // file under Material/Student_Summaries resolves to student_summary, while
  // anything else under Material resolves to material.
  const resolveDirType = (relDir: string): string | undefined => {
    let d = relDir;
    for (;;) {
      const t = DIR_TYPE_MAP[d];
      if (t) return t;
      const idx = d.lastIndexOf('/');
      if (idx === -1) return undefined;
      d = d.slice(0, idx);
    }
  };

  // Turn one .md file into a ContextResult, or null if it doesn't match the
  // requested types/filters. relDir is the file's workspace-relative directory.
  const processFile = async (filePath: string, relDir: string): Promise<ContextResult | null> => {
    const entry = path.basename(filePath);

    let stat;
    try {
      stat = await fs.lstat(filePath);
      if (stat.isSymbolicLink()) return null; // defence-in-depth: skip symlinks
      if (!stat.isFile()) return null;
    } catch {
      return null;
    }

    let content: string;
    try {
      const buf = Buffer.alloc(2048);
      const fd = await fs.open(filePath, 'r');
      await fd.read(buf, 0, 2048, 0);
      await fd.close();
      content = buf.toString('utf-8');
    } catch {
      return null;
    }

    const fm = parseYamlFrontmatter(content);
    const fileType = String(fm.type || '');

    let matchedType = '';
    let matchSource: 'frontmatter' | 'directory' | 'filename' = 'frontmatter';

    if (fileType && typeStringsToMatch.has(fileType)) {
      matchedType = fileType;
    } else {
      const dirType = resolveDirType(relDir);
      if (dirType && content_types.includes(dirType)) {
        matchedType = dirType;
        matchSource = 'directory';
      } else {
        for (const { pattern, type: fnType } of FILENAME_PATTERNS) {
          if (pattern.test(entry) && content_types.includes(fnType)) {
            matchedType = fnType;
            matchSource = 'filename';
            break;
          }
        }
      }
    }

    if (!matchedType) return null;

    if (topic) {
      const topicLower = topic.toLowerCase();
      if (!matchesTopic(fm, topic, content) && !entry.toLowerCase().includes(topicLower)) return null;
    }

    if (supports) {
      if (!matchesSupports(fm, supports)) return null;
    }

    if (framework) {
      const fmFramework = String(fm.framework || '');
      if (fmFramework.toLowerCase() !== framework.toLowerCase()) return null;
    }

    // since: ISO date filter — only exclude files where the date field
    // exists AND is strictly before `since`. Undated files pass through
    // (do not exclude on missing data). js-yaml parses unquoted dates as
    // Date objects, so normalise both Date and string forms to YYYY-MM-DD.
    if (since) {
      const rawDate = fm.date ?? fm.datum ?? fm.created;
      let fileDate = '';
      if (rawDate instanceof Date) {
        fileDate = rawDate.toISOString().slice(0, 10);
      } else if (rawDate != null && rawDate !== '') {
        fileDate = String(rawDate);
      }
      if (fileDate && fileDate < since) return null;
    }

    const canonical = canonicalMap.get(matchedType) || matchedType;

    return {
      path: filePath,
      content_type: matchedType,
      canonical_type: canonical,
      match_source: matchSource,
      date: String(fm.date || fm.datum || fm.created || ''),
      title: String(fm.title || fm.topic || fm.uppdrag || entry),
      size: stat.size,
      supports: extractStringArray(fm.supports),
      learning_objectives: extractStringArray(
        Array.isArray(fm.learning_objectives)
          ? fm.learning_objectives.map((lo: unknown) =>
              lo && typeof lo === 'object' && 'code' in lo
                ? String((lo as Record<string, unknown>).code)
                : String(lo)
            )
          : undefined
      ),
      based_on: extractStringArray(fm.based_on),
      framework: fm.framework ? String(fm.framework) : undefined,
      status: fm.status ? String(fm.status) : undefined,
    };
  };

  // Collect .md files under a search dir. Recursive roots (RECURSIVE_SEARCH_DIRS)
  // walk the whole subtree; every other dir is scanned flat (top level only).
  // Each file is paired with its workspace-relative directory for the fallback.
  const recursiveRoots = new Set(RECURSIVE_SEARCH_DIRS);
  const collectFiles = async (searchDir: string): Promise<Array<{ filePath: string; relDir: string }>> => {
    const recursive = recursiveRoots.has(searchDir);
    const out: Array<{ filePath: string; relDir: string }> = [];

    const walk = async (relDir: string): Promise<void> => {
      let entries: Dirent[];
      try {
        entries = await fs.readdir(path.join(workspace, relDir), { withFileTypes: true });
      } catch {
        return; // Directory doesn't exist — skip
      }
      for (const e of entries) {
        if (e.isSymbolicLink()) continue; // defence-in-depth: never follow symlinks
        if (e.isDirectory()) {
          if (recursive) await walk(`${relDir}/${e.name}`);
        } else if (e.isFile() && e.name.endsWith('.md')) {
          out.push({ filePath: path.join(workspace, relDir, e.name), relDir });
        }
      }
    };

    await walk(searchDir);
    return out;
  };

  // Gather candidate files across all search dirs. Search dirs — including
  // recursive roots — are non-overlapping, so every file is reached at most
  // once and no dedupe is needed. Invariant: a RECURSIVE_SEARCH_DIRS root must
  // not be (or sit under) another SEARCH_DIRS entry, or its subtree would be
  // scanned twice.
  const collected = (await Promise.all(SEARCH_DIRS.map(collectFiles))).flat();

  const processed = await Promise.all(collected.map((f) => processFile(f.filePath, f.relDir)));
  const results = processed.filter((r): r is ContextResult => r !== null);

  // Sort by date descending
  results.sort((a, b) => b.date.localeCompare(a.date));

  // Limit per type
  const limitedResults: ContextResult[] = [];
  const countPerType: Record<string, number> = {};

  for (const r of results) {
    const count = countPerType[r.canonical_type] || 0;
    if (count < max_results) {
      limitedResults.push(r);
      countPerType[r.canonical_type] = count + 1;
    }
  }

  return {
    success: true,
    results: limitedResults,
    total_found: results.length,
  };
}
