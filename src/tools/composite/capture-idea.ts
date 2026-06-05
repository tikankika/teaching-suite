/**
 * capture_idea - Quick capture of spontaneous ideas
 *
 * Guided process that helps teachers capture ideas quickly without
 * breaking flow. Uses Swedish priorities and template format.
 *
 * Spec: docs/specs/capture-idea-spec.md
 */

import { z } from 'zod';
import { intelligentSave } from './intelligent-save.js';
import { extractTitle } from '../../utils/text-helpers.js';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Swedish priority levels for ideas.
 * - nu: Do soon (high priority)
 * - snart: This semester (medium priority)
 * - någon_gång: Backlog (low priority)
 */
export const PriorityEnum = z.enum(['nu', 'snart', 'någon_gång']);
export type Priority = z.infer<typeof PriorityEnum>;

/**
 * Status for idea tracking.
 */
export const StatusEnum = z.enum(['BACKLOG', 'ACTIVE', 'DONE', 'ARCHIVED']);
export type Status = z.infer<typeof StatusEnum>;

/**
 * Input schema for capture_idea tool.
 */
export const CaptureIdeaInputSchema = z.object({
  idea_text: z.string().min(1).describe('The idea to capture'),
  context: z
    .string()
    .optional()
    .describe('Course or area this relates to'),
  priority: PriorityEnum.optional()
    .default('någon_gång')
    .describe('Priority: nu (soon), snart (this semester), någon_gång (backlog)'),
  related_to: z.string().optional().describe('Path or name of related document'),
  workspace: z.string().optional().describe('Root workspace path for file placement'),
  auto_confirm: z.boolean().default(false).describe('Skip confirmation dialog'),
});

export type CaptureIdeaInput = z.infer<typeof CaptureIdeaInputSchema>;

/**
 * Output from capture_idea tool.
 */
export interface CaptureIdeaOutput {
  success: boolean;
  filepath?: string;
  title?: string;
  tags?: string[];
  confirmation_needed?: boolean;
  suggestion?: {
    filename: string;
    directory: string;
    full_path: string;
    preview: string;
    message: string;
  };
  error?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map Swedish priority to English for internal metadata.
 */
function priorityToEnglish(priority: Priority): string {
  switch (priority) {
    case 'nu':
      return 'high';
    case 'snart':
      return 'medium';
    case 'någon_gång':
      return 'low';
  }
}

/**
 * Map priority to initial status.
 */
function priorityToStatus(priority: Priority): Status {
  return priority === 'nu' ? 'ACTIVE' : 'BACKLOG';
}

/**
 * Generate title from idea text.
 * Strips leading punctuation then delegates to shared extractTitle.
 */
function generateTitle(ideaText: string): string {
  const cleaned = ideaText.split('\n')[0].trim().replace(/^[#\-*\s]+/, '').trim();
  return extractTitle(cleaned, 60, true);
}

/**
 * Generate slug from title for filename.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

/**
 * Generate tags from context and priority.
 */
function generateTags(
  context?: string,
  priority?: Priority,
  ideaText?: string
): string[] {
  const tags: string[] = ['idea'];

  // Add context-based tags
  if (context) {
    // Extract a course-code-like token from the context string
    const courseMatch = context.match(/([A-Za-z]+\d+[A-Za-z]?)/i);
    if (courseMatch) {
      tags.push(courseMatch[1].toLowerCase());
    }
    // Check for specific keywords
    const keywords = ['srl', 'bedömning', 'assessment', 'feedback', 'ai', 'formativ'];
    const contextLower = context.toLowerCase();
    for (const kw of keywords) {
      if (contextLower.includes(kw)) {
        tags.push(kw);
      }
    }
  }

  // Add priority tag
  if (priority) {
    tags.push(`priority-${priority}`);
  }

  // Extract potential tags from idea text (words after #)
  if (ideaText) {
    const hashTags = ideaText.match(/#(\w+)/g);
    if (hashTags) {
      for (const ht of hashTags) {
        tags.push(ht.slice(1).toLowerCase());
      }
    }
  }

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Format wikilink from related path or name.
 */
function formatWikilink(related: string): string {
  // If it's already a wikilink, return as-is
  if (related.startsWith('[[') && related.endsWith(']]')) {
    return related;
  }
  // Extract filename without extension and path
  const basename = related.split('/').pop() || related;
  const name = basename.replace(/\.[^.]+$/, '');
  return `[[${name}]]`;
}

/**
 * Generate idea content in spec template format.
 */
function generateIdeaContent(
  title: string,
  ideaText: string,
  status: Status,
  priority: Priority,
  tags: string[],
  context?: string,
  related?: string
): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${title}`);
  lines.push('');

  // Metadata block (will be replaced by frontmatter in intelligent_save)
  // But keep some visible metadata for quick scanning
  lines.push(`**Status:** ${status}`);
  lines.push(`**Priority:** ${priority}`);
  lines.push(`**Tags:** ${tags.map((t) => `#${t}`).join(' ')}`);
  if (related) {
    lines.push(`**Relaterad:** ${formatWikilink(related)}`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Idea section
  lines.push('## Idé');
  lines.push('');
  lines.push(ideaText);
  lines.push('');

  // Context section
  lines.push('## Kontext');
  lines.push('');
  if (context) {
    lines.push(`- **Kurs/område:** ${context}`);
  } else {
    lines.push('- **Kurs/område:** Generellt');
  }
  lines.push('');

  // Next steps section
  lines.push('## Nästa steg');
  lines.push('');
  lines.push('- [ ] ');
  lines.push('');

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Captured via Teaching Suite*');

  return lines.join('\n');
}

// ============================================================================
// MAIN TOOL LOGIC
// ============================================================================

/**
 * capture_idea - Capture a spontaneous idea with context and priority.
 *
 * Flow:
 * 1. Parse and validate input
 * 2. Generate title, tags, and content
 * 3. Call intelligent_save with formatted content
 * 4. Return result with filepath or confirmation request
 */
export async function captureIdea(input: unknown): Promise<CaptureIdeaOutput> {
  // Validate input
  const parseResult = CaptureIdeaInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { idea_text, context, priority, related_to, workspace, auto_confirm } =
    parseResult.data;

  // Generate components
  const title = generateTitle(idea_text);
  const status = priorityToStatus(priority);
  const tags = generateTags(context, priority, idea_text);

  // Generate formatted content
  const content = generateIdeaContent(
    title,
    idea_text,
    status,
    priority,
    tags,
    context,
    related_to
  );

  // Generate filename
  const date = new Date().toISOString().split('T')[0];
  const slug = slugify(title);
  const filename = `${date}-${slug}.md`;

  // Call intelligent_save
  const saveResult = await intelligentSave({
    content,
    content_type: 'idea',
    context: {
      workspace,
      course: context,
      tags,
      related_files: related_to ? [related_to] : undefined,
    },
    suggested_filename: filename,
    auto_confirm,
  });

  // Map result to capture_idea output format
  if (saveResult.confirmation_needed && saveResult.suggestion) {
    return {
      success: true,
      confirmation_needed: true,
      title,
      tags,
      suggestion: {
        filename: saveResult.suggestion.filename,
        directory: saveResult.suggestion.directory,
        full_path: saveResult.suggestion.full_path,
        preview: content.substring(0, 300) + '...',
        message: `Spara idé som '${saveResult.suggestion.filename}' i ${saveResult.suggestion.directory}? Anropa igen med auto_confirm: true för att bekräfta.`,
      },
    };
  }

  if (saveResult.success && saveResult.filepath) {
    return {
      success: true,
      filepath: saveResult.filepath,
      title,
      tags,
    };
  }

  // Error case
  return {
    success: false,
    error: saveResult.error?.message || 'Unknown error saving idea',
  };
}

/**
 * Tool definition for MCP registration.
 */
export const captureIdeaTool = {
  name: 'capture_idea',
  description:
    'Capture a spontaneous idea with context and priority. Quick capture without breaking flow - MCP generates structure, tags, and saves to Ideas/ folder with proper frontmatter.',
  inputSchema: CaptureIdeaInputSchema,
  handler: captureIdea,
};
