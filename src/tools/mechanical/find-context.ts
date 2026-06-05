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
import * as path from 'path';
import * as yaml from 'js-yaml';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const FindContextInputSchema = z.object({
  workspace: z.string().min(1).describe('Project workspace path'),
  content_types: z.array(z.enum([
    // Teaching types
    'lesson_plan', 'reflection', 'idea', 'note', 'analysis',
    'course_plan', 'transcript_analysis', 'decision', 'documentation',
    // Carpenter-compatible canonical types
    'synthesis', 'plan', 'plan_update', 'progress_check',
    'conversation_analysis',
    // v3 cycle outputs (Wave A — match intelligent_save additions)
    'bridge_intention', 'pre_course_context_report', 'course_evaluation',
    'term_reflection', 'manifest',
    // Other
    'other',
  ])).describe('Types of content to search for'),
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

const SEARCH_DIRS: string[] = [
  // Flat structure (current standard)
  'Reflections', 'Reflektioner',
  'Lesson_Plans', 'Lektions planeringar',
  'Ideas', 'Idéer',
  'Notes', 'Anteckningar',
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
  'Reflections/Term',
  'Profession/Manifest',
  'Student_Materials',
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
];

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
  'Profession/Manifest': 'manifest',
  'Student_Materials': 'material',
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

function findCanonicalType(fileType: string): string | null {
  for (const [canonical, aliases] of Object.entries(TYPE_ALIASES)) {
    if (aliases.includes(fileType)) {
      return canonical;
    }
  }
  return null;
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

  // Scan all directories in parallel
  const scanDir = async (dir: string): Promise<ContextResult[]> => {
    const dirPath = path.join(workspace, dir);
    const dirResults: ContextResult[] = [];

    let entries: string[];
    try {
      entries = await fs.readdir(dirPath);
    } catch {
      return []; // Directory doesn't exist — skip
    }

    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;

      const filePath = path.join(dirPath, entry);

      let stat;
      try {
        stat = await fs.lstat(filePath);
        if (stat.isSymbolicLink()) continue; // defence-in-depth: skip symlinks
        if (!stat.isFile()) continue;
      } catch {
        continue;
      }

      let content: string;
      try {
        const buf = Buffer.alloc(2048);
        const fd = await fs.open(filePath, 'r');
        await fd.read(buf, 0, 2048, 0);
        await fd.close();
        content = buf.toString('utf-8');
      } catch {
        continue;
      }

      const fm = parseYamlFrontmatter(content);
      const fileType = String(fm.type || '');

      let matchedType = '';
      let matchSource: 'frontmatter' | 'directory' | 'filename' = 'frontmatter';

      if (fileType && typeStringsToMatch.has(fileType)) {
        matchedType = fileType;
      } else {
        const dirType = DIR_TYPE_MAP[dir];
        if (dirType && content_types.includes(dirType as typeof content_types[number])) {
          matchedType = dirType;
          matchSource = 'directory';
        } else {
          for (const { pattern, type: fnType } of FILENAME_PATTERNS) {
            if (pattern.test(entry) && content_types.includes(fnType as typeof content_types[number])) {
              matchedType = fnType;
              matchSource = 'filename';
              break;
            }
          }
        }
      }

      if (!matchedType) continue;

      if (topic) {
        const topicLower = topic.toLowerCase();
        if (!matchesTopic(fm, topic, content) && !entry.toLowerCase().includes(topicLower)) continue;
      }

      if (supports) {
        if (!matchesSupports(fm, supports)) continue;
      }

      if (framework) {
        const fmFramework = String(fm.framework || '');
        if (fmFramework.toLowerCase() !== framework.toLowerCase()) continue;
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
        if (fileDate && fileDate < since) continue;
      }

      const canonical = canonicalMap.get(matchedType) || findCanonicalType(matchedType) || matchedType;

      dirResults.push({
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
      });
    }

    return dirResults;
  };

  const nestedResults = await Promise.all(SEARCH_DIRS.map(scanDir));
  const results = nestedResults.flat();

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
