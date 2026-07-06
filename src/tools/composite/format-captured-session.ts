import { z } from 'zod';
import * as yaml from 'js-yaml';
import type { CapturedItem, SessionMetadata, ItemType } from './capture-session.js';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Input schema for format_captured_session tool.
 */
export const FormatCapturedSessionInputSchema = z.object({
  items: z.array(
    z.object({
      type: z.enum(['idea', 'decision', 'reflection', 'question', 'observation', 'action']),
      title: z.string(),
      content: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      captured: z.string(),
    })
  ),
  metadata: z.object({
    type: z.literal('captured-session'),
    source: z.string(),
    date: z.string(),
    status: z.literal('raw'),
    reviewed: z.literal(false),
    itemCount: z.number(),
    tags: z.array(z.string()),
    project: z.string().optional(),
    course: z.string().optional(),
  }),
});

export type FormatCapturedSessionInput = z.infer<typeof FormatCapturedSessionInputSchema>;

/**
 * Output from format_captured_session tool.
 */
export interface FormatCapturedSessionOutput {
  markdown: string;
  suggested_content_type: 'reflection' | 'note';
  suggested_filename: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Combined emoji and Swedish label for each item type.
 */
const TYPE_CONFIG: Record<ItemType, { emoji: string; label: string }> = {
  idea:        { emoji: '💡', label: 'Idé' },
  decision:    { emoji: '✅', label: 'Beslut' },
  reflection:  { emoji: '🤔', label: 'Reflektion' },
  question:    { emoji: '❓', label: 'Fråga' },
  observation: { emoji: '👁️', label: 'Observation' },
  action:      { emoji: '🎯', label: 'Åtgärd' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate YAML frontmatter from metadata.
 */
function generateFrontmatter(metadata: SessionMetadata): string {
  const frontmatterObj: Record<string, unknown> = {
    type: metadata.type,
    source: metadata.source,
    date: metadata.date,
    status: metadata.status,
    reviewed: metadata.reviewed,
    'item-count': metadata.itemCount,
    tags: metadata.tags,
  };

  if (metadata.project) {
    frontmatterObj.project = metadata.project;
  }
  if (metadata.course) {
    frontmatterObj.course = metadata.course;
  }

  const yamlStr = yaml.dump(frontmatterObj, {
    lineWidth: -1,
    quoteStyle: 'double',
    forceQuotes: false,
  });

  return `---\n${yamlStr}---`;
}

/**
 * Generate markdown section for a single item.
 */
function generateItemSection(item: CapturedItem): string {
  const { emoji, label } = TYPE_CONFIG[item.type];

  const lines = [
    `## ${emoji} ${label}: ${item.title}`,
    '',
    `[type:: ${item.type}] [priority:: ${item.priority}] [status:: raw] [captured:: ${item.captured}]`,
    '',
    item.content,
    '',
    '---',
  ];

  return lines.join('\n');
}

/**
 * Generates a short description from the items for the filename.
 */
function generateDescription(items: CapturedItem[]): string {
  if (items.length === 0) {
    return 'session';
  }

  const types = [...new Set(items.map((i) => i.type))];
  if (types.length === 1) {
    return types[0] + 's';
  }

  return types.slice(0, 2).join('-');
}

/**
 * Sanitizes a string for use in a filename.
 */
function sanitizeForFilename(str: string): string {
  return str
    .toLowerCase()
    .replace(/[åäà]/g, 'a')
    .replace(/[öô]/g, 'o')
    .replace(/[éèê]/g, 'e')
    .replace(/[üû]/g, 'u')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    .replace(/-$/, '');
}

// ============================================================================
// MAIN TOOL LOGIC
// ============================================================================

/**
 * format_captured_session - Convert captured items to markdown.
 *
 * Takes the output from capture_session and formats it as
 * Obsidian-compatible markdown with YAML frontmatter.
 *
 * @param input - Captured items and metadata from capture_session
 * @returns Formatted markdown and suggestions for intelligent_save
 */
export async function formatCapturedSession(
  input: unknown
): Promise<FormatCapturedSessionOutput> {
  const parseResult = FormatCapturedSessionInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error(`Invalid input: ${parseResult.error.message}`);
  }

  const { items, metadata } = parseResult.data;

  // Generate frontmatter
  const frontmatter = generateFrontmatter(metadata as SessionMetadata);

  // Generate item sections
  const itemSections = items.map((item) =>
    generateItemSection(item as CapturedItem)
  );

  // Combine into full markdown
  const markdown = [frontmatter, '', ...itemSections].join('\n');

  // Generate filename suggestion
  const description = generateDescription(items as CapturedItem[]);
  const sanitizedSource = sanitizeForFilename(metadata.source);
  const sanitizedDesc = sanitizeForFilename(description);
  const suggested_filename = `captured_${metadata.date}_${sanitizedSource}_${sanitizedDesc}.md`;

  // Determine content type for intelligent_save
  // Sessions are typically reflections, but could be notes
  const suggested_content_type = 'reflection' as const;

  return {
    markdown,
    suggested_content_type,
    suggested_filename,
  };
}

/**
 * Tool definition for MCP registration.
 */
export const formatCapturedSessionTool = {
  name: 'format_captured_session',
  description:
    'Convert captured session items to Obsidian-compatible markdown with YAML frontmatter and Dataview fields. Takes output from capture_session, returns markdown ready for intelligent_save.',
  inputSchema: FormatCapturedSessionInputSchema,
  handler: formatCapturedSession,
};
