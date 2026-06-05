/**
 * parse_lesson_plan_yaml — Parse a lesson plan markdown file and return its
 * YAML frontmatter as structured data plus the markdown body.
 *
 * Mechanical tool: reads the entire file once, extracts frontmatter via the
 * `---\n…\n---\n` convention, parses with js-yaml.
 *
 * Designed to support the post_lesson_auto pipeline where the plan YAML is
 * the primary source of truth for `uppgifter:` and `presentationer:` (per
 * RFC-014). Files without frontmatter are still readable — `has_frontmatter`
 * is false and the entire file content is returned in `body`.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// SCHEMA
// ============================================================================

export const ParseLessonPlanYamlInputSchema = z.object({
  file_path: z.string().min(1).describe('Absolute path to the lesson plan file'),
  workspace: z.string().optional().describe('Workspace path for security validation (recommended)'),
});

// ============================================================================
// TYPES
// ============================================================================

export interface ParseLessonPlanYamlOutput {
  success: boolean;
  file_path: string;
  total_chars: number;
  has_frontmatter: boolean;
  frontmatter: Record<string, unknown> | null;
  body: string;
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// ============================================================================
// HELPERS
// ============================================================================

function emptyOutput(file_path: string, error: string): ParseLessonPlanYamlOutput {
  return {
    success: false,
    file_path,
    total_chars: 0,
    has_frontmatter: false,
    frontmatter: null,
    body: '',
    error,
  };
}

// ============================================================================
// MAIN
// ============================================================================

export async function parseLessonPlanYaml(input: unknown): Promise<ParseLessonPlanYamlOutput> {
  const parseResult = ParseLessonPlanYamlInputSchema.safeParse(input);
  if (!parseResult.success) {
    return emptyOutput('', `Invalid input: ${parseResult.error.message}`);
  }

  const { file_path, workspace } = parseResult.data;

  // Always validate file_path against the effective workspace (server-level
  // lock if --workspace is set; caller-supplied workspace must be inside it).
  // Previously this guard ran only when workspace was supplied — leaving an
  // arbitrary-file-read path when callers omitted it.
  const fileValidation = await validatePathInWorkspace(file_path, workspace);
  if (!fileValidation.valid) {
    return emptyOutput(file_path, fileValidation.error || 'File path outside workspace');
  }

  // Read entire file
  let content: string;
  try {
    content = await fs.readFile(file_path, 'utf-8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return emptyOutput(file_path, `Could not read file: ${message}`);
  }

  // Look for frontmatter
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    // No frontmatter — return whole content as body
    return {
      success: true,
      file_path,
      total_chars: content.length,
      has_frontmatter: false,
      frontmatter: null,
      body: content,
    };
  }

  const yamlText = match[1];
  const body = content.slice(match[0].length);

  // Parse YAML — JSON_SCHEMA keeps dates as strings (matching how Obsidian
  // and most other tools in our stack treat YAML date values).
  let frontmatter: Record<string, unknown> | null = null;
  try {
    const parsed = yaml.load(yamlText, { schema: yaml.JSON_SCHEMA });
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      frontmatter = parsed as Record<string, unknown>;
    } else if (parsed === null || parsed === undefined) {
      // Empty frontmatter — treat as has_frontmatter true with empty object
      frontmatter = {};
    } else {
      // Frontmatter parsed but is a scalar / array — not standard. Flag.
      return {
        success: false,
        file_path,
        total_chars: content.length,
        has_frontmatter: true,
        frontmatter: null,
        body,
        error: 'Frontmatter parsed but is not an object (top-level should be key/value pairs)',
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      file_path,
      total_chars: content.length,
      has_frontmatter: true,
      frontmatter: null,
      body,
      error: `Malformed YAML in frontmatter: ${message}`,
    };
  }

  return {
    success: true,
    file_path,
    total_chars: content.length,
    has_frontmatter: true,
    frontmatter,
    body,
  };
}
