import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { parseLessonTranscript } from '../src/tools/mechanical/parse-lesson-transcript.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'parse-transcript-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function writeTranscript(content: string, name = 'transcript.txt'): Promise<string> {
  const filePath = path.join(workspaceDir, name);
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

function makeLines(n: number, speakerCycle = 2): string {
  const lines: string[] = [];
  for (let i = 0; i < n; i++) {
    const speaker = `SPEAKER_0${i % speakerCycle}`;
    const startSec = i * 2;
    const endSec = startSec + 2;
    const fmt = (s: number) => {
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      return `${h}:${m}:${sec}.000`;
    };
    lines.push(`[${speaker}] ${fmt(startSec)} --> ${fmt(endSec)}: Segment number ${i}.`);
  }
  return lines.join('\n') + '\n';
}

// ============================================================================
// PARSING — pyannote format (back-compat via mode: 'full')
// ============================================================================

describe('parse_lesson_transcript — pyannote format parsing (full mode)', () => {
  it('parses a single segment', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.500: Hello there.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.success).toBe(true);
    expect(result.segments).toHaveLength(1);
    expect(result.segments![0].speaker).toBe('SPEAKER_00');
    expect(result.segments![0].start_time).toBe(0);
    expect(result.segments![0].end_time).toBe(2.5);
    expect(result.segments![0].text).toBe('Hello there.');
  });

  it('parses multiple segments with multiple speakers', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: First segment.\n' +
      '[SPEAKER_01] 00:00:02.000 --> 00:00:05.000: Second segment.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.success).toBe(true);
    expect(result.segments).toHaveLength(2);
    expect(result.segments![1].speaker).toBe('SPEAKER_01');
  });

  it('text_flat concatenates all segment texts', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: One.\n' +
      '[SPEAKER_00] 00:00:02.000 --> 00:00:04.000: Two.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.text_flat).toContain('One.');
    expect(result.text_flat).toContain('Two.');
  });

  it('total_duration_seconds equals the last segment end_time', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: First.\n' +
      '[SPEAKER_00] 00:01:30.000 --> 00:01:35.500: Last.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.total_duration_seconds).toBe(95.5);
  });

  it('computes segment duration', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.500: Hello.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.segments![0].duration).toBe(2.5);
  });
});

// ============================================================================
// DIARISATION STATUS (mode-independent — assert via summary default)
// ============================================================================

describe('parse_lesson_transcript — diarisation status', () => {
  it('reports failed when only one unique speaker present', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: Hello.\n' +
      '[SPEAKER_00] 00:00:02.000 --> 00:00:04.000: World.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.diarisation_status).toBe('failed');
    expect(result.speaker_count).toBe(1);
    expect(result.unique_speakers).toEqual(['SPEAKER_00']);
  });

  it('reports ok when multiple speakers present', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: Hello.\n' +
      '[SPEAKER_01] 00:00:02.000 --> 00:00:04.000: World.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.diarisation_status).toBe('ok');
    expect(result.speaker_count).toBe(2);
    expect(result.unique_speakers.sort()).toEqual(['SPEAKER_00', 'SPEAKER_01']);
  });

  it('reports no_speakers when file has no parseable pyannote lines', async () => {
    const filePath = await writeTranscript('Just some prose without speaker tags.\nAnother line.\n');

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.diarisation_status).toBe('no_speakers');
    expect(result.total_segments).toBe(0);
    expect(result.speaker_count).toBe(0);
  });
});

// ============================================================================
// COVERAGE AND METADATA
// ============================================================================

describe('parse_lesson_transcript — coverage and metadata', () => {
  it('full_coverage is true when entire file successfully read', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: Segment.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.full_coverage).toBe(true);
  });

  it('total_chars matches the on-disk file size', async () => {
    const content = '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: Hello.\n';
    const filePath = await writeTranscript(content);

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.total_chars).toBe(content.length);
  });

  it('returns the file_path in output', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: Hello.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.file_path).toBe(filePath);
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

describe('parse_lesson_transcript — error handling', () => {
  it('rejects when file does not exist', async () => {
    const result = await parseLessonTranscript({
      file_path: path.join(workspaceDir, 'nonexistent.txt'),
      workspace: workspaceDir,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.full_coverage).toBe(false);
  });

  it('rejects file outside workspace', async () => {
    const outsidePath = path.join(os.tmpdir(), 'definitely-outside-workspace.txt');
    await fs.writeFile(outsidePath, 'whatever', 'utf-8');

    try {
      const result = await parseLessonTranscript({
        file_path: outsidePath,
        workspace: workspaceDir,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    } finally {
      await fs.rm(outsidePath, { force: true });
    }
  });

  it('rejects file outside workspace even when caller omits workspace argument', async () => {
    // Security regression test: previously the validation guard ran only
    // when workspace was supplied, leaving an arbitrary-file-read path
    // when callers omitted it. With the fix, validation falls back to the
    // server-level workspace.
    const outsidePath = path.join(os.tmpdir(), 'no-caller-ws-secret.txt');
    await fs.writeFile(outsidePath, 'sensitive content', 'utf-8');

    try {
      const result = await parseLessonTranscript({
        file_path: outsidePath,
        // workspace deliberately omitted
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    } finally {
      await fs.rm(outsidePath, { force: true });
    }
  });

  it('rejects empty input', async () => {
    const result = await parseLessonTranscript({});

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });

  it('skips malformed lines and parses valid ones', async () => {
    const filePath = await writeTranscript(
      '[SPEAKER_00] 00:00:00.000 --> 00:00:02.000: Valid one.\n' +
      'This is not a valid pyannote line at all.\n' +
      '[SPEAKER_00] 00:00:02.000 --> 00:00:04.000: Valid two.\n'
    );

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.success).toBe(true);
    expect(result.segments).toHaveLength(2);
  });
});

// ============================================================================
// SUMMARY MODE — default, metadata only, always wire-safe
// ============================================================================

describe('parse_lesson_transcript — summary mode (default)', () => {
  it('default mode is summary — no segments array in response', async () => {
    const filePath = await writeTranscript(makeLines(10));

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.success).toBe(true);
    expect(result.segments).toBeUndefined();
    expect(result.text_flat).toBeUndefined();
  });

  it('summary returns total_segments count', async () => {
    const filePath = await writeTranscript(makeLines(42));

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.total_segments).toBe(42);
  });

  it('summary returns metadata fields', async () => {
    const filePath = await writeTranscript(makeLines(5, 2));

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'summary' });

    expect(result.success).toBe(true);
    expect(result.total_chars).toBeGreaterThan(0);
    expect(result.total_segments).toBe(5);
    expect(result.total_duration_seconds).toBe(10);
    expect(result.speaker_count).toBe(2);
    expect(result.unique_speakers.sort()).toEqual(['SPEAKER_00', 'SPEAKER_01']);
    expect(result.diarisation_status).toBe('ok');
    expect(result.full_coverage).toBe(true);
  });

  it('summary wire-size stays small even for large transcripts', async () => {
    // Build a transcript well above 50k chars to confirm summary stays bounded.
    const largeContent = makeLines(2000);
    const filePath = await writeTranscript(largeContent);
    expect(largeContent.length).toBeGreaterThan(60_000);

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    const wireSize = JSON.stringify(result).length;
    expect(wireSize).toBeLessThan(2_000);
  });

  it('summary does not include warning even for large transcripts', async () => {
    const filePath = await writeTranscript(makeLines(2000));

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir });

    expect(result.warning).toBeUndefined();
  });
});

// ============================================================================
// SEGMENTS MODE — paginated, full coverage via iteration
// ============================================================================

describe('parse_lesson_transcript — segments mode (paginated)', () => {
  it('returns first page of segments with default offset/limit', async () => {
    const filePath = await writeTranscript(makeLines(120));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
    });

    expect(result.success).toBe(true);
    expect(result.segments).toHaveLength(50);
    expect(result.segments![0].text).toBe('Segment number 0.');
  });

  it('respects segment_offset', async () => {
    const filePath = await writeTranscript(makeLines(120));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_offset: 50,
    });

    expect(result.segments![0].text).toBe('Segment number 50.');
  });

  it('respects segment_limit', async () => {
    const filePath = await writeTranscript(makeLines(120));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_limit: 10,
    });

    expect(result.segments).toHaveLength(10);
  });

  it('has_more is true when more segments remain', async () => {
    const filePath = await writeTranscript(makeLines(120));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_limit: 50,
    });

    expect(result.has_more).toBe(true);
    expect(result.next_offset).toBe(50);
  });

  it('has_more is false on last page', async () => {
    const filePath = await writeTranscript(makeLines(60));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_offset: 50,
      segment_limit: 50,
    });

    expect(result.segments).toHaveLength(10);
    expect(result.has_more).toBe(false);
    expect(result.next_offset).toBeUndefined();
  });

  it('coverage.complete is false until last page', async () => {
    const filePath = await writeTranscript(makeLines(120));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_offset: 0,
      segment_limit: 50,
    });

    expect(result.coverage).toEqual({ processed_to: 50, total: 120, complete: false });
  });

  it('coverage.complete is true on last page', async () => {
    const filePath = await writeTranscript(makeLines(60));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_offset: 50,
      segment_limit: 50,
    });

    expect(result.coverage).toEqual({ processed_to: 60, total: 60, complete: true });
  });

  it('handles offset beyond end with empty segments + complete=true', async () => {
    const filePath = await writeTranscript(makeLines(10));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_offset: 100,
      segment_limit: 50,
    });

    expect(result.segments).toEqual([]);
    expect(result.has_more).toBe(false);
    expect(result.coverage!.complete).toBe(true);
  });

  it('caps segment_limit at the configured maximum', async () => {
    const filePath = await writeTranscript(makeLines(500));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
      segment_limit: 9999,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('iterating to has_more=false yields all segments (full coverage)', async () => {
    const filePath = await writeTranscript(makeLines(180));
    const collected: string[] = [];
    let offset = 0;
    let safetyCounter = 0;

    while (safetyCounter++ < 20) {
      const page = await parseLessonTranscript({
        file_path: filePath,
        workspace: workspaceDir,
        mode: 'segments',
        segment_offset: offset,
        segment_limit: 50,
      });
      for (const s of page.segments!) collected.push(s.text);
      if (!page.has_more) {
        expect(page.coverage!.complete).toBe(true);
        break;
      }
      offset = page.next_offset!;
    }

    expect(collected).toHaveLength(180);
    expect(collected[0]).toBe('Segment number 0.');
    expect(collected[179]).toBe('Segment number 179.');
  });

  it('omits text_flat in segments mode', async () => {
    const filePath = await writeTranscript(makeLines(10));

    const result = await parseLessonTranscript({
      file_path: filePath,
      workspace: workspaceDir,
      mode: 'segments',
    });

    expect(result.text_flat).toBeUndefined();
  });
});

// ============================================================================
// FULL MODE — back-compat, deprecation warning at >50k
// ============================================================================

describe('parse_lesson_transcript — full mode (back-compat)', () => {
  it('full mode returns segments + text_flat', async () => {
    const filePath = await writeTranscript(makeLines(5));

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.segments).toHaveLength(5);
    expect(result.text_flat).toBeTruthy();
    expect(result.text_flat).toContain('Segment number 0.');
  });

  it('full mode emits warning when total_chars > 50_000', async () => {
    const largeContent = makeLines(2000);
    expect(largeContent.length).toBeGreaterThan(50_000);
    const filePath = await writeTranscript(largeContent);

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.warning).toBeTruthy();
    expect(result.warning).toContain('summary');
  });

  it('full mode does NOT emit warning when total_chars <= 50_000', async () => {
    const filePath = await writeTranscript(makeLines(20));

    const result = await parseLessonTranscript({ file_path: filePath, workspace: workspaceDir, mode: 'full' });

    expect(result.warning).toBeUndefined();
  });
});
