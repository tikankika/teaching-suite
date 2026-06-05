/**
 * parse_lesson_transcript — Parse a pyannote-formatted lesson transcript
 * into structured segments and metadata.
 *
 * Mechanical tool: reads the entire file once, returns structured data.
 * Removes the "read enough to synthesise" heuristic that surfaced as a
 * coverage bug seen early in development: full coverage is
 * guaranteed by the tool, not delegated to LLM discipline.
 *
 * Pyannote line format:
 *   [SPEAKER_XX] HH:MM:SS.mmm --> HH:MM:SS.mmm: text
 *
 * Lines that do not match the format are skipped silently. Files with
 * no matching lines return diarisation_status: 'no_speakers' and an
 * empty segments array — the caller decides whether that is an error.
 *
 * Modes (since v0.8.0 — see ADR-005):
 *   - 'summary' (default): metadata only. Always wire-safe (~300 bytes).
 *   - 'segments': paginated segments via segment_offset + segment_limit,
 *     with has_more / next_offset / coverage object for full-coverage
 *     iteration.
 *   - 'full': back-compat — full segments + text_flat. Emits warning when
 *     total_chars > 50 000. Removal tracked for v1.0.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import { validatePathInWorkspace } from '../core/workspace.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_SEGMENT_LIMIT = 200;
const FULL_MODE_WARNING_THRESHOLD = 50_000;

// ============================================================================
// SCHEMA
// ============================================================================

export const ParseLessonTranscriptInputSchema = z.object({
  file_path: z.string().min(1).describe('Absolute path to the transcript file'),
  workspace: z.string().optional().describe('Workspace path for security validation (recommended)'),
  mode: z.enum(['summary', 'segments', 'full']).default('summary').describe(
    'Response shape. summary (default): metadata only, always wire-safe. ' +
    'segments: paginated segments — use with segment_offset and segment_limit ' +
    'to iterate the full transcript. full: back-compat, returns segments + ' +
    'text_flat. Emits a warning when total_chars > 50 000.'
  ),
  segment_offset: z.number().int().min(0).default(0).describe(
    'For mode=segments: starting segment index (0-based).'
  ),
  segment_limit: z.number().int().min(1).max(MAX_SEGMENT_LIMIT).default(50).describe(
    `For mode=segments: number of segments per page (1–${MAX_SEGMENT_LIMIT}).`
  ),
});

// ============================================================================
// TYPES
// ============================================================================

export interface TranscriptSegment {
  speaker?: string;
  start_time?: number;
  end_time?: number;
  duration?: number;
  text: string;
}

export interface CoverageInfo {
  processed_to: number;
  total: number;
  complete: boolean;
}

export interface ParseLessonTranscriptOutput {
  success: boolean;
  file_path: string;
  total_chars: number;
  total_segments: number;
  total_duration_seconds?: number;
  speaker_count: number;
  unique_speakers: string[];
  diarisation_status: 'ok' | 'failed' | 'no_speakers';
  full_coverage: boolean;
  // Mode-specific fields
  segments?: TranscriptSegment[];
  text_flat?: string;
  has_more?: boolean;
  next_offset?: number;
  coverage?: CoverageInfo;
  warning?: string;
  error?: string;
}

// ============================================================================
// REGEX
// ============================================================================

const PYANNOTE_LINE_RE = /^\[([A-Z_]+\d+)\]\s+(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}):(\d{2}):(\d{2})\.(\d{3}):\s*(.*)$/;

// ============================================================================
// HELPERS
// ============================================================================

function timeToSeconds(h: string, m: string, s: string, ms: string): number {
  return parseInt(h, 10) * 3600
    + parseInt(m, 10) * 60
    + parseInt(s, 10)
    + parseInt(ms, 10) / 1000;
}

function emptyOutput(file_path: string, error: string): ParseLessonTranscriptOutput {
  return {
    success: false,
    file_path,
    total_chars: 0,
    total_segments: 0,
    speaker_count: 0,
    unique_speakers: [],
    diarisation_status: 'no_speakers',
    full_coverage: false,
    error,
  };
}

// ============================================================================
// MAIN
// ============================================================================

export async function parseLessonTranscript(input: unknown): Promise<ParseLessonTranscriptOutput> {
  const parseResult = ParseLessonTranscriptInputSchema.safeParse(input);
  if (!parseResult.success) {
    return emptyOutput('', `Invalid input: ${parseResult.error.message}`);
  }

  const { file_path, workspace, mode, segment_offset, segment_limit } = parseResult.data;

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

  // Parse line by line — skip lines that do not match the pyannote pattern
  const segments: TranscriptSegment[] = [];
  for (const line of content.split('\n')) {
    const m = line.match(PYANNOTE_LINE_RE);
    if (!m) continue;

    const start = timeToSeconds(m[2], m[3], m[4], m[5]);
    const end = timeToSeconds(m[6], m[7], m[8], m[9]);
    segments.push({
      speaker: m[1],
      start_time: start,
      end_time: end,
      duration: end - start,
      text: m[10].trim(),
    });
  }

  // Speaker stats
  const uniqueSpeakers = Array.from(
    new Set(segments.map(s => s.speaker).filter((s): s is string => Boolean(s))),
  );
  const speakerCount = uniqueSpeakers.length;

  let diarisationStatus: 'ok' | 'failed' | 'no_speakers';
  if (segments.length === 0) {
    diarisationStatus = 'no_speakers';
  } else if (speakerCount === 1) {
    diarisationStatus = 'failed';
  } else {
    diarisationStatus = 'ok';
  }

  const totalDurationSeconds = segments.length > 0
    ? Math.max(...segments.map(s => s.end_time ?? 0))
    : undefined;

  // Shared metadata block (every mode includes this).
  const base: ParseLessonTranscriptOutput = {
    success: true,
    file_path,
    total_chars: content.length,
    total_segments: segments.length,
    total_duration_seconds: totalDurationSeconds,
    speaker_count: speakerCount,
    unique_speakers: uniqueSpeakers,
    diarisation_status: diarisationStatus,
    full_coverage: true,
  };

  if (mode === 'summary') {
    return base;
  }

  if (mode === 'segments') {
    const total = segments.length;
    const start = Math.min(segment_offset, total);
    const end = Math.min(start + segment_limit, total);
    const page = segments.slice(start, end);
    const hasMore = end < total;
    const coverage: CoverageInfo = {
      processed_to: end,
      total,
      complete: !hasMore,
    };
    return {
      ...base,
      segments: page,
      has_more: hasMore,
      ...(hasMore ? { next_offset: end } : {}),
      coverage,
    };
  }

  // mode === 'full' — back-compat
  const textFlat = segments.map(s => s.text).join(' ');
  const result: ParseLessonTranscriptOutput = {
    ...base,
    segments,
    text_flat: textFlat,
  };
  if (content.length > FULL_MODE_WARNING_THRESHOLD) {
    result.warning =
      `total_chars (${content.length}) exceeds ${FULL_MODE_WARNING_THRESHOLD} — ` +
      `use mode: 'summary' for metadata, then iterate mode: 'segments' with ` +
      `segment_offset and segment_limit. mode: 'full' is retained for ` +
      `back-compat and may be removed in a future release.`;
  }
  return result;
}
