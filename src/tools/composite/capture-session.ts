import { z } from 'zod';
import { extractTitle as baseExtractTitle } from '../../utils/text-helpers.js';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Item types that can be captured from session content.
 */
export const ItemTypeEnum = z.enum([
  'idea',
  'decision',
  'reflection',
  'question',
  'observation',
  'action',
]);

export type ItemType = z.infer<typeof ItemTypeEnum>;

/**
 * Priority levels for captured items.
 */
export const PriorityEnum = z.enum(['high', 'medium', 'low']);

export type Priority = z.infer<typeof PriorityEnum>;

/**
 * Input schema for capture_session tool.
 */
export const CaptureSessionInputSchema = z.object({
  content: z.string().min(1).describe('Session content to analyze'),
  source: z.string().default('claude-desktop').describe('Source of the capture'),
  project: z.string().optional().describe('Project wikilink'),
  course: z.string().optional().describe('Course wikilink'),
});

export type CaptureSessionInput = z.infer<typeof CaptureSessionInputSchema>;

/**
 * A single captured item from session content.
 */
export interface CapturedItem {
  type: ItemType;
  title: string;
  content: string;
  priority: Priority;
  captured: string; // ISO timestamp
}

/**
 * Session metadata generated during capture.
 */
export interface SessionMetadata {
  type: 'captured-session';
  source: string;
  date: string;
  status: 'raw';
  reviewed: false;
  itemCount: number;
  tags: string[];
  project?: string;
  course?: string;
}

/**
 * Output from capture_session tool.
 *
 * NOTE: This is PURE DATA - no file I/O happens.
 * Use format_captured_session to convert to markdown,
 * then intelligent_save to write to file.
 */
export interface CaptureSessionOutput {
  items: CapturedItem[];
  metadata: SessionMetadata;
}

// ============================================================================
// PARSING PATTERNS
// ============================================================================

/**
 * Patterns to identify different types of items in content.
 * Supports both Swedish and English keywords.
 */
const ITEM_PATTERNS: Array<{
  type: ItemType;
  patterns: RegExp[];
  priority: Priority;
}> = [
  {
    type: 'decision',
    patterns: [
      /(?:^|\n)(?:Beslut|Decision|Bestämt|Decided):\s*(.+?)(?=\n(?:Beslut|Decision|Idé|Idea|Reflektion|Reflection|Fråga|Question|Observation|Åtgärd|Action):|$)/gis,
    ],
    priority: 'high',
  },
  {
    type: 'idea',
    patterns: [
      /(?:^|\n)(?:Idé|Idea|Kanske|Maybe|Möjligen):\s*(.+?)(?=\n(?:Beslut|Decision|Idé|Idea|Reflektion|Reflection|Fråga|Question|Observation|Åtgärd|Action):|$)/gis,
    ],
    priority: 'medium',
  },
  {
    type: 'reflection',
    patterns: [
      /(?:^|\n)(?:Reflektion|Reflection|Tanke|Thought):\s*(.+?)(?=\n(?:Beslut|Decision|Idé|Idea|Reflektion|Reflection|Fråga|Question|Observation|Åtgärd|Action):|$)/gis,
    ],
    priority: 'medium',
  },
  {
    type: 'question',
    patterns: [
      /(?:^|\n)(?:Fråga|Question):\s*(.+?)(?=\n(?:Beslut|Decision|Idé|Idea|Reflektion|Reflection|Fråga|Question|Observation|Åtgärd|Action):|$)/gis,
    ],
    priority: 'medium',
  },
  {
    type: 'observation',
    patterns: [
      /(?:^|\n)(?:Observation|Notering|Note):\s*(.+?)(?=\n(?:Beslut|Decision|Idé|Idea|Reflektion|Reflection|Fråga|Question|Observation|Åtgärd|Action):|$)/gis,
    ],
    priority: 'low',
  },
  {
    type: 'action',
    patterns: [
      /(?:^|\n)(?:Åtgärd|Action|TODO|Gör|Do):\s*(.+?)(?=\n(?:Beslut|Decision|Idé|Idea|Reflektion|Reflection|Fråga|Question|Observation|Åtgärd|Action):|$)/gis,
    ],
    priority: 'high',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extracts the first sentence or phrase as a title.
 * Splits on sentence boundary (`.`) or newline before delegating.
 */
export function extractTitle(content: string): string {
  const firstSentence = content.split(/[.\n]/)[0].trim();
  return baseExtractTitle(firstSentence, 60, true);
}

/**
 * Parses content to extract structured items.
 *
 * This is a PURE function - no side effects.
 */
export function parseContent(content: string): Array<{
  type: ItemType;
  title: string;
  content: string;
  priority: Priority;
}> {
  const items: Array<{
    type: ItemType;
    title: string;
    content: string;
    priority: Priority;
  }> = [];
  const usedRanges: Array<{ start: number; end: number }> = [];

  for (const itemDef of ITEM_PATTERNS) {
    for (const pattern of itemDef.patterns) {
      // Reset regex state
      pattern.lastIndex = 0;
      let match;

      while ((match = pattern.exec(content)) !== null) {
        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        // Skip if this range overlaps with an already captured item
        const overlaps = usedRanges.some(
          (range) =>
            (matchStart >= range.start && matchStart < range.end) ||
            (matchEnd > range.start && matchEnd <= range.end)
        );

        if (!overlaps && match[1]) {
          const itemContent = match[1].trim();
          if (itemContent.length > 0) {
            items.push({
              type: itemDef.type,
              title: extractTitle(itemContent),
              content: itemContent,
              priority: itemDef.priority,
            });
            usedRanges.push({ start: matchStart, end: matchEnd });
          }
        }
      }
    }
  }

  return items;
}

// ============================================================================
// MAIN TOOL LOGIC
// ============================================================================

/**
 * capture_session - Parse session content into structured items.
 *
 * This is a PURE PARSING tool. It does NOT write files.
 *
 * Workflow:
 * 1. capture_session → Get structured items
 * 2. format_captured_session → Convert to markdown
 * 3. intelligent_save → Save to file
 *
 * Or use quick_save_session for the complete workflow.
 *
 * @param input - Session content and context
 * @returns Parsed items and metadata (NO filepath)
 */
export async function captureSession(input: unknown): Promise<CaptureSessionOutput> {
  const parseResult = CaptureSessionInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error(`Invalid input: ${parseResult.error.message}`);
  }

  const validatedInput = parseResult.data;

  // Parse content into items
  const parsedItems = parseContent(validatedInput.content);

  // Generate timestamp
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const capturedTimestamp = now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm

  // Convert to CapturedItem format with timestamp
  const items: CapturedItem[] = parsedItems.map((item) => ({
    type: item.type,
    title: item.title,
    content: item.content,
    priority: item.priority,
    captured: capturedTimestamp,
  }));

  // Build metadata
  const metadata: SessionMetadata = {
    type: 'captured-session',
    source: validatedInput.source,
    date: dateStr,
    status: 'raw',
    reviewed: false,
    itemCount: items.length,
    tags: ['capture', 'auto-generated'],
  };

  if (validatedInput.project) {
    metadata.project = validatedInput.project;
  }
  if (validatedInput.course) {
    metadata.course = validatedInput.course;
  }

  return { items, metadata };
}

/**
 * Tool definition for MCP registration.
 */
export const captureSessionTool = {
  name: 'capture_session',
  description:
    'Parse session content into structured items (ideas, decisions, reflections, questions, observations, actions). Returns parsed data WITHOUT saving to file. Use format_captured_session + intelligent_save to persist, or quick_save_session for complete workflow.',
  inputSchema: CaptureSessionInputSchema,
  handler: captureSession,
};
