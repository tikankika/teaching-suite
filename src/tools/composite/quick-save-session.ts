import { z } from 'zod';
import { captureSession, type CapturedItem, type SessionMetadata } from './capture-session.js';
import { formatCapturedSession } from './format-captured-session.js';
import { intelligentSave, type IntelligentSaveOutput } from './intelligent-save.js';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

/**
 * Input schema for quick_save_session tool.
 */
export const QuickSaveSessionInputSchema = z.object({
  content: z.string().min(1).describe('Session content to analyze'),
  source: z.string().default('claude-desktop').describe('Source of the capture'),
  project: z.string().optional().describe('Project wikilink'),
  course: z.string().optional().describe('Course wikilink'),
  workspace: z.string().optional().describe('Workspace path for file location'),
});

export type QuickSaveSessionInput = z.infer<typeof QuickSaveSessionInputSchema>;

/**
 * Output from quick_save_session tool.
 *
 * Returns partial success if parsing works but save fails.
 */
export interface QuickSaveSessionOutput {
  success: boolean;
  filepath?: string;
  items: CapturedItem[];
  metadata: SessionMetadata;
  error?: {
    code: 'SAVE_FAILED' | 'PARSE_FAILED';
    message: string;
    suggestion: string;
    details?: unknown;
  };
}

// ============================================================================
// MAIN TOOL LOGIC
// ============================================================================

/**
 * quick_save_session - Complete workflow to capture, format, and save a session.
 *
 * This is a convenience tool that chains:
 * 1. capture_session → Parse content into items
 * 2. format_captured_session → Convert to markdown
 * 3. intelligent_save → Save to file
 *
 * Uses auto_confirm: true by default (saves immediately).
 *
 * For manual control, use the individual tools instead:
 * capture_session → format_captured_session → intelligent_save
 *
 * @param input - Session content and context
 * @returns Filepath and parsed items, or partial success with error
 */
export async function quickSaveSession(input: unknown): Promise<QuickSaveSessionOutput> {
  const parseResult = QuickSaveSessionInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      items: [],
      metadata: {
        type: 'captured-session',
        source: 'unknown',
        date: new Date().toISOString().split('T')[0],
        status: 'raw',
        reviewed: false,
        itemCount: 0,
        tags: [],
      },
      error: {
        code: 'PARSE_FAILED',
        message: `Invalid input: ${parseResult.error.message}`,
        suggestion: 'Check input format and try again',
      },
    };
  }

  const validatedInput = parseResult.data;

  // Step 1: Parse content
  let capturedData;
  try {
    capturedData = await captureSession({
      content: validatedInput.content,
      source: validatedInput.source,
      project: validatedInput.project,
      course: validatedInput.course,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      items: [],
      metadata: {
        type: 'captured-session',
        source: validatedInput.source,
        date: new Date().toISOString().split('T')[0],
        status: 'raw',
        reviewed: false,
        itemCount: 0,
        tags: [],
      },
      error: {
        code: 'PARSE_FAILED',
        message: `Parsing failed: ${err.message}`,
        suggestion: 'Check content format and try again',
      },
    };
  }

  // Step 2: Format to markdown
  let formattedData;
  try {
    formattedData = await formatCapturedSession({
      items: capturedData.items,
      metadata: capturedData.metadata,
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      items: capturedData.items,
      metadata: capturedData.metadata,
      error: {
        code: 'SAVE_FAILED',
        message: `Formatting failed: ${err.message}`,
        suggestion: 'Retry with format_captured_session tool manually',
      },
    };
  }

  // Step 3: Save with intelligent_save
  let saveResult: IntelligentSaveOutput;
  try {
    saveResult = await intelligentSave({
      content: formattedData.markdown,
      content_type: formattedData.suggested_content_type,
      context: {
        workspace: validatedInput.workspace,
        course: validatedInput.course,
        project: validatedInput.project,
      },
      suggested_filename: formattedData.suggested_filename,
      auto_confirm: true, // Decision 2: Save immediately
    });
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      items: capturedData.items,
      metadata: capturedData.metadata,
      error: {
        code: 'SAVE_FAILED',
        message: `Save failed: ${err.message}`,
        suggestion: 'Retry with intelligent_save tool manually',
        details: { markdown: formattedData.markdown },
      },
    };
  }

  // Check if save succeeded
  if (!saveResult.success) {
    return {
      success: false,
      items: capturedData.items,
      metadata: capturedData.metadata,
      error: {
        code: 'SAVE_FAILED',
        message: `Parsing succeeded but file save failed: ${saveResult.error?.message || 'Unknown error'}`,
        suggestion: 'Retry with intelligent_save tool manually',
        details: saveResult.error,
      },
    };
  }

  // Success!
  return {
    success: true,
    filepath: saveResult.filepath,
    items: capturedData.items,
    metadata: capturedData.metadata,
  };
}

/**
 * Tool definition for MCP registration.
 */
export const quickSaveSessionTool = {
  name: 'quick_save_session',
  description:
    'Complete workflow: parse session content, format as markdown, and save to file. Chains capture_session → format_captured_session → intelligent_save. Returns filepath on success, or parsed items with error details on partial failure.',
  inputSchema: QuickSaveSessionInputSchema,
  handler: quickSaveSession,
};
