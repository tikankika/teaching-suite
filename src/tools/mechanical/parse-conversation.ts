/**
 * parse_conversation — Parse raw conversation text into structured messages.
 *
 * Mechanical tool: handles FORMAT, not meaning.
 * V1 scope: email + meeting_transcript only.
 * Other formats return format_not_supported with raw content.
 *
 * Verbatim from Carpenter MCP — domain-neutral.
 */

import { z } from 'zod';

// ============================================================================
// SCHEMA
// ============================================================================

export const ParseConversationInputSchema = z.object({
  content: z.string().min(1).describe('Raw conversation text'),
  format: z.enum(['email', 'meeting_transcript', 'auto'])
    .default('auto')
    .describe('Conversation format. V1 supports email and meeting_transcript. Auto-detects if not specified.'),
});

// ============================================================================
// TYPES
// ============================================================================

interface ParsedMessage {
  from: string;
  to?: string;
  date?: string;
  subject?: string;
  message: string;
}

export interface ParseConversationOutput {
  success: boolean;
  format_detected: string;
  format_not_supported?: boolean;
  messages: ParsedMessage[];
  message_count: number;
  raw_content?: string;
  error?: string;
}

// ============================================================================
// EMAIL PARSER
// ============================================================================

// Supports Swedish (Från/Till/Datum/Ämne) and English (From/To/Date/Subject)
const EMAIL_HEADER_PATTERNS = {
  from: /^(?:From|Från)\s*:\s*(.+)/im,
  to: /^(?:To|Till)\s*:\s*(.+)/im,
  date: /^(?:Date|Datum)\s*:\s*(.+)/im,
  subject: /^(?:Subject|Ämne)\s*:\s*(.+)/im,
};

function parseEmail(content: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];

  // Split on separators or forwarded markers
  const parts = content.split(/(?:^-{3,}\s*$|^={3,}\s*$|-{5,}\s*(?:Forwarded message|Vidarebefordrat meddelande)\s*-{5,})/im);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const fromMatch = trimmed.match(EMAIL_HEADER_PATTERNS.from);
    if (!fromMatch) {
      if (messages.length > 0) {
        messages[messages.length - 1].message += '\n\n' + trimmed;
      } else if (trimmed.length > 20) {
        messages.push({ from: 'unknown', message: trimmed });
      }
      continue;
    }

    const msg: ParsedMessage = {
      from: fromMatch[1].trim(),
      message: '',
    };

    const toMatch = trimmed.match(EMAIL_HEADER_PATTERNS.to);
    if (toMatch) msg.to = toMatch[1].trim();

    const dateMatch = trimmed.match(EMAIL_HEADER_PATTERNS.date);
    if (dateMatch) msg.date = dateMatch[1].trim();

    const subjectMatch = trimmed.match(EMAIL_HEADER_PATTERNS.subject);
    if (subjectMatch) msg.subject = subjectMatch[1].trim();

    // Message body: everything after the last header line
    const headerLines = [fromMatch, toMatch, dateMatch, subjectMatch]
      .filter(Boolean)
      .map(m => m![0]);

    let lastHeaderEnd = 0;
    for (const headerLine of headerLines) {
      const idx = trimmed.indexOf(headerLine);
      if (idx >= 0) {
        const end = idx + headerLine.length;
        if (end > lastHeaderEnd) lastHeaderEnd = end;
      }
    }

    const body = trimmed.substring(lastHeaderEnd).trim();
    msg.message = body.replace(/^\n+/, '').trim();

    messages.push(msg);
  }

  return messages;
}

// ============================================================================
// MEETING TRANSCRIPT PARSER
// ============================================================================

// Patterns: "Name:" or "[Name]" or "[14:30] Name:" at start of line
const SPEAKER_PATTERN = /^(?:\[(\d{1,2}:\d{2})\]\s*)?(?:\[([^\]]+)\]|([A-ZÅÄÖ][a-zåäöA-ZÅÄÖ\s]+?)\s*:)\s*(.*)/;

function parseMeetingTranscript(content: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];
  const lines = content.split('\n');

  let currentMsg: ParsedMessage | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentMsg) currentMsg.message += '\n';
      continue;
    }

    const match = trimmed.match(SPEAKER_PATTERN);
    if (match) {
      if (currentMsg) {
        currentMsg.message = currentMsg.message.trim();
        if (currentMsg.message) messages.push(currentMsg);
      }

      const timestamp = match[1] || undefined;
      const bracketName = match[2];
      const colonName = match[3];
      const text = match[4] || '';

      currentMsg = {
        from: (bracketName || colonName || 'unknown').trim(),
        date: timestamp,
        message: text,
      };
    } else if (currentMsg) {
      currentMsg.message += '\n' + trimmed;
    } else {
      if (trimmed.length > 20) {
        messages.push({ from: 'unknown', message: trimmed });
      }
    }
  }

  if (currentMsg) {
    currentMsg.message = currentMsg.message.trim();
    if (currentMsg.message) messages.push(currentMsg);
  }

  return messages;
}

// ============================================================================
// AUTO-DETECTION
// ============================================================================

function detectFormat(content: string): 'email' | 'meeting_transcript' | null {
  const hasEmailHeaders =
    /^(?:From|Från)\s*:/im.test(content) &&
    (/^(?:To|Till)\s*:/im.test(content) || /^(?:Date|Datum)\s*:/im.test(content));

  if (hasEmailHeaders) return 'email';

  const speakerMatches = content.match(/^(?:\[?\d{1,2}:\d{2}\]?\s*)?(?:\[[^\]]+\]|[A-ZÅÄÖ][a-zåäöA-ZÅÄÖ\s]+?)\s*:/gm);
  if (speakerMatches && speakerMatches.length >= 2) return 'meeting_transcript';

  return null;
}

// ============================================================================
// MAIN
// ============================================================================

export async function parseConversation(input: unknown): Promise<ParseConversationOutput> {
  const parseResult = ParseConversationInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      format_detected: '',
      messages: [],
      message_count: 0,
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { content, format } = parseResult.data;

  let resolvedFormat: string = format;
  if (format === 'auto') {
    const detected = detectFormat(content);
    if (!detected) {
      return {
        success: false,
        format_detected: 'unknown',
        format_not_supported: true,
        messages: [],
        message_count: 0,
        raw_content: content,
        error: 'Could not auto-detect conversation format. Try specifying format explicitly.',
      };
    }
    resolvedFormat = detected;
  }

  let messages: ParsedMessage[];

  switch (resolvedFormat) {
    case 'email':
      messages = parseEmail(content);
      break;
    case 'meeting_transcript':
      messages = parseMeetingTranscript(content);
      break;
    default:
      return {
        success: false,
        format_detected: resolvedFormat,
        format_not_supported: true,
        messages: [],
        message_count: 0,
        raw_content: content,
        error: `Format "${resolvedFormat}" is not yet supported. V1 supports: email, meeting_transcript.`,
      };
  }

  if (messages.length === 0) {
    return {
      success: false,
      format_detected: resolvedFormat,
      messages: [],
      message_count: 0,
      raw_content: content,
      error: `No messages could be parsed from the content using ${resolvedFormat} format.`,
    };
  }

  return {
    success: true,
    format_detected: resolvedFormat,
    messages,
    message_count: messages.length,
  };
}
