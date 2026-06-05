/**
 * Tests for core file operation tools:
 *   file_read, file_write, file_edit, file_search.
 *
 * Each tool is tested for happy-path behaviour, error handling,
 * and workspace security enforcement.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileRead, FileReadInputSchema } from '../../src/tools/core/file-read.js';
import { zodToJsonSchema } from '../../src/utils/zod-to-json-schema.js';
import { fileWrite } from '../../src/tools/core/file-write.js';
import { fileEdit } from '../../src/tools/core/file-edit.js';
import { fileSearch } from '../../src/tools/core/file-search.js';
import { setServerWorkspace, MAX_FILE_SIZE } from '../../src/tools/core/workspace.js';
import { createTempWorkspace, type TempWorkspace } from '../helpers/setup.js';

// ============================================================================
// SETUP
// ============================================================================

let ws: TempWorkspace;

beforeEach(async () => {
  ws = await createTempWorkspace('file-ops-');
  setServerWorkspace(ws.dir);
});

afterEach(async () => {
  await ws.cleanup();
});

// ============================================================================
// file_read
// ============================================================================

describe('fileRead', () => {
  it('should read an existing file and return content + metadata', async () => {
    const target = path.join(ws.dir, 'hello.md');
    await fs.writeFile(target, '# Hello World\n', 'utf-8');

    const result = await fileRead({ path: target, workspace: ws.dir });

    expect(result.success).toBe(true);
    expect(result.content).toBe('# Hello World\n');
    expect(result.metadata).toBeDefined();
    expect(result.metadata!.size).toBeGreaterThan(0);
    expect(result.metadata!.modified).toBeTruthy();
    expect(result.metadata!.created).toBeTruthy();
  });

  it('should return NOT_FOUND for non-existent file', async () => {
    const result = await fileRead({
      path: path.join(ws.dir, 'missing.txt'),
      workspace: ws.dir,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('NOT_FOUND');
  });

  it('should block read outside workspace', async () => {
    const result = await fileRead({
      path: '/etc/hosts',
      workspace: ws.dir,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('OUTSIDE_WORKSPACE');
  });

  it('should reject file exceeding MAX_FILE_SIZE', async () => {
    const bigFile = path.join(ws.dir, 'big.bin');
    // Create a file that is just over the limit.
    // We write a sparse file by truncating to MAX_FILE_SIZE + 1.
    const handle = await fs.open(bigFile, 'w');
    await handle.truncate(MAX_FILE_SIZE + 1);
    await handle.close();

    const result = await fileRead({ path: bigFile, workspace: ws.dir });

    expect(result.success).toBe(false);
    expect(result.error?.message).toMatch(/too large/i);
  });

  it('should read file with base64 encoding', async () => {
    const target = path.join(ws.dir, 'binary.bin');
    const buffer = Buffer.from([0x00, 0x01, 0x02, 0xff]);
    await fs.writeFile(target, buffer);

    const result = await fileRead({
      path: target,
      workspace: ws.dir,
      encoding: 'base64',
    });

    expect(result.success).toBe(true);
    expect(result.content).toBe(buffer.toString('base64'));
  });

  it('should return INVALID_PATH for invalid input', async () => {
    const result = await fileRead({ path: 123 });
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('INVALID_PATH');
  });

  it('should use server workspace when no tool-level workspace is provided', async () => {
    const target = path.join(ws.dir, 'server-ws.txt');
    await fs.writeFile(target, 'data', 'utf-8');

    // Omit workspace — falls back to server workspace
    const result = await fileRead({ path: target });
    expect(result.success).toBe(true);
    expect(result.content).toBe('data');
  });

  describe('line-based pagination', () => {
    const tenLines = Array.from({ length: 10 }, (_, i) => `line ${i + 1}`).join('\n');

    it('should return first N lines with limit only', async () => {
      const target = path.join(ws.dir, 'paged.md');
      await fs.writeFile(target, tenLines, 'utf-8');

      const result = await fileRead({ path: target, workspace: ws.dir, limit: 3 });

      expect(result.success).toBe(true);
      expect(result.content).toBe('line 1\nline 2\nline 3');
      expect(result.metadata?.total_lines).toBe(10);
      expect(result.metadata?.has_more).toBe(true);
      expect(result.metadata?.lines_returned).toBe(3);
    });

    it('should return middle slice with offset + limit', async () => {
      const target = path.join(ws.dir, 'paged.md');
      await fs.writeFile(target, tenLines, 'utf-8');

      const result = await fileRead({ path: target, workspace: ws.dir, offset: 4, limit: 3 });

      expect(result.success).toBe(true);
      expect(result.content).toBe('line 4\nline 5\nline 6');
      expect(result.metadata?.has_more).toBe(true);
    });

    it('should return tail with offset reaching end', async () => {
      const target = path.join(ws.dir, 'paged.md');
      await fs.writeFile(target, tenLines, 'utf-8');

      const result = await fileRead({ path: target, workspace: ws.dir, offset: 8, limit: 100 });

      expect(result.success).toBe(true);
      expect(result.content).toBe('line 8\nline 9\nline 10');
      expect(result.metadata?.has_more).toBe(false);
      expect(result.metadata?.lines_returned).toBe(3);
    });

    it('should return empty content when offset is past end of file', async () => {
      const target = path.join(ws.dir, 'paged.md');
      await fs.writeFile(target, tenLines, 'utf-8');

      const result = await fileRead({ path: target, workspace: ws.dir, offset: 99 });

      expect(result.success).toBe(true);
      expect(result.content).toBe('');
      expect(result.metadata?.has_more).toBe(false);
      expect(result.metadata?.lines_returned).toBe(0);
    });

    it('should not include pagination fields when no offset/limit given', async () => {
      const target = path.join(ws.dir, 'plain.md');
      await fs.writeFile(target, tenLines, 'utf-8');

      const result = await fileRead({ path: target, workspace: ws.dir });

      expect(result.success).toBe(true);
      expect(result.content).toBe(tenLines);
      expect(result.metadata?.has_more).toBeUndefined();
      expect(result.metadata?.lines_returned).toBeUndefined();
      expect(result.metadata?.total_lines).toBeUndefined();
    });

    it('should expose path/offset/limit in introspected JSON schema (regression: v0.7.1 .refine() hid them)', () => {
      const json = zodToJsonSchema(FileReadInputSchema) as {
        type: string;
        properties?: Record<string, unknown>;
        required?: string[];
      };
      expect(json.type).toBe('object');
      expect(json.properties).toBeDefined();
      expect(json.properties).toHaveProperty('path');
      expect(json.properties).toHaveProperty('offset');
      expect(json.properties).toHaveProperty('limit');
      expect(json.required).toContain('path');
    });

    it('should reject base64 encoding combined with pagination', async () => {
      const target = path.join(ws.dir, 'bin.bin');
      await fs.writeFile(target, Buffer.from([0, 1, 2]));

      const result = await fileRead({
        path: target,
        workspace: ws.dir,
        encoding: 'base64',
        limit: 1,
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_PATH');
    });
  });
});

// ============================================================================
// file_write
// ============================================================================

describe('fileWrite', () => {
  it('should create a new file', async () => {
    const target = path.join(ws.dir, 'new-file.md');

    const result = await fileWrite({
      path: target,
      content: '# New File\n',
      workspace: ws.dir,
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(true);
    expect(result.bytes_written).toBeGreaterThan(0);

    const ondisk = await fs.readFile(target, 'utf-8');
    expect(ondisk).toBe('# New File\n');
  });

  it('should reject overwrite when overwrite=false and file exists', async () => {
    const target = path.join(ws.dir, 'existing.md');
    await fs.writeFile(target, 'original', 'utf-8');

    const result = await fileWrite({
      path: target,
      content: 'replacement',
      workspace: ws.dir,
      overwrite: false,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('FILE_EXISTS');

    // Original content untouched
    const ondisk = await fs.readFile(target, 'utf-8');
    expect(ondisk).toBe('original');
  });

  it('should overwrite when overwrite=true', async () => {
    const target = path.join(ws.dir, 'overwritable.md');
    await fs.writeFile(target, 'old content', 'utf-8');

    const result = await fileWrite({
      path: target,
      content: 'new content',
      workspace: ws.dir,
      overwrite: true,
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(false); // it was overwritten, not created

    const ondisk = await fs.readFile(target, 'utf-8');
    expect(ondisk).toBe('new content');
  });

  it('should report created=true for overwrite=true on new file', async () => {
    const target = path.join(ws.dir, 'fresh.md');

    const result = await fileWrite({
      path: target,
      content: 'brand new',
      workspace: ws.dir,
      overwrite: true,
    });

    expect(result.success).toBe(true);
    expect(result.created).toBe(true);
  });

  it('should block write outside workspace', async () => {
    const result = await fileWrite({
      path: '/tmp/evil-write.txt',
      content: 'nope',
      workspace: ws.dir,
    });

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('OUTSIDE_WORKSPACE');
  });

  it('should create parent directories by default', async () => {
    const target = path.join(ws.dir, 'deep', 'nested', 'dir', 'file.md');

    const result = await fileWrite({
      path: target,
      content: 'nested content',
      workspace: ws.dir,
    });

    expect(result.success).toBe(true);

    const ondisk = await fs.readFile(target, 'utf-8');
    expect(ondisk).toBe('nested content');
  });

  it('should return correct bytes_written for multi-byte content', async () => {
    const target = path.join(ws.dir, 'swedish.md');
    const content = 'Ovning med formativ bedomning'; // Swedish chars

    const result = await fileWrite({
      path: target,
      content,
      workspace: ws.dir,
    });

    expect(result.success).toBe(true);
    expect(result.bytes_written).toBe(Buffer.byteLength(content, 'utf-8'));
  });

  it('should return INVALID_PATH for invalid input', async () => {
    const result = await fileWrite({ content: 'x' }); // missing path
    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('INVALID_PATH');
  });
});

// ============================================================================
// file_edit
// ============================================================================

describe('fileEdit', () => {
  const seedFile = async (name: string, content: string): Promise<string> => {
    const target = path.join(ws.dir, name);
    await fs.writeFile(target, content, 'utf-8');
    return target;
  };

  // ------------------------------------------------------------------
  // Replace
  // ------------------------------------------------------------------

  describe('replace operation', () => {
    it('should replace first occurrence', async () => {
      const target = await seedFile('replace.md', 'foo bar foo');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'replace', target: 'foo', content: 'baz' }],
      });

      expect(result.success).toBe(true);
      expect(result.edits_applied).toBe(1);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('baz bar foo');
    });

    it('should replace all occurrences when all=true', async () => {
      const target = await seedFile('replace-all.md', 'foo bar foo baz foo');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'replace', target: 'foo', content: 'qux', all: true }],
      });

      expect(result.success).toBe(true);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('qux bar qux baz qux');
    });

    it('should report failure when target string not found', async () => {
      const target = await seedFile('no-match.md', 'hello world');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'replace', target: 'missing', content: 'x' }],
      });

      expect(result.success).toBe(true); // overall succeeds, but edit failed
      expect(result.edits_applied).toBe(0);
      expect(result.edits_failed).toBe(1);
    });
  });

  // ------------------------------------------------------------------
  // Insert after
  // ------------------------------------------------------------------

  describe('insert_after operation', () => {
    it('should insert content after target', async () => {
      const target = await seedFile('insert-after.md', 'line one\nline two\n');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'insert_after', target: 'line one', content: '\ninserted' }],
      });

      expect(result.success).toBe(true);
      expect(result.edits_applied).toBe(1);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('line one\ninserted\nline two\n');
    });
  });

  // ------------------------------------------------------------------
  // Insert before
  // ------------------------------------------------------------------

  describe('insert_before operation', () => {
    it('should insert content before target', async () => {
      const target = await seedFile('insert-before.md', 'line one\nline two\n');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'insert_before', target: 'line two', content: 'inserted\n' }],
      });

      expect(result.success).toBe(true);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('line one\ninserted\nline two\n');
    });
  });

  // ------------------------------------------------------------------
  // Append
  // ------------------------------------------------------------------

  describe('append operation', () => {
    it('should add content at the end of the file', async () => {
      const target = await seedFile('append.md', 'existing content');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'append', content: '\nappended line' }],
      });

      expect(result.success).toBe(true);
      expect(result.edits_applied).toBe(1);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('existing content\nappended line');
    });
  });

  // ------------------------------------------------------------------
  // Prepend
  // ------------------------------------------------------------------

  describe('prepend operation', () => {
    it('should add content at the beginning of the file', async () => {
      const target = await seedFile('prepend.md', 'existing content');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'prepend', content: 'prepended\n' }],
      });

      expect(result.success).toBe(true);
      expect(result.edits_applied).toBe(1);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('prepended\nexisting content');
    });
  });

  // ------------------------------------------------------------------
  // Delete
  // ------------------------------------------------------------------

  describe('delete operation', () => {
    it('should remove first occurrence of target', async () => {
      const target = await seedFile('delete.md', 'keep remove keep');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'delete', target: ' remove' }],
      });

      expect(result.success).toBe(true);
      expect(result.edits_applied).toBe(1);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('keep keep');
    });

    it('should remove all occurrences when all=true', async () => {
      const target = await seedFile('delete-all.md', 'x y x z x');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [{ type: 'delete', target: 'x', all: true }],
      });

      expect(result.success).toBe(true);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe(' y  z ');
    });
  });

  // ------------------------------------------------------------------
  // Multiple edits in sequence
  // ------------------------------------------------------------------

  describe('multiple edits', () => {
    it('should apply edits sequentially', async () => {
      const target = await seedFile('multi.md', 'aaa bbb ccc');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [
          { type: 'replace', target: 'aaa', content: 'AAA' },
          { type: 'replace', target: 'bbb', content: 'BBB' },
          { type: 'append', content: ' ddd' },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.edits_applied).toBe(3);
      expect(result.edits_failed).toBe(0);

      const ondisk = await fs.readFile(target, 'utf-8');
      expect(ondisk).toBe('AAA BBB ccc ddd');
    });

    it('should count both applied and failed edits', async () => {
      const target = await seedFile('partial.md', 'hello world');

      const result = await fileEdit({
        path: target,
        workspace: ws.dir,
        edits: [
          { type: 'replace', target: 'hello', content: 'hi' },
          { type: 'replace', target: 'missing', content: 'x' },
          { type: 'append', content: '!' },
        ],
      });

      expect(result.edits_applied).toBe(2);
      expect(result.edits_failed).toBe(1);
    });
  });

  // ------------------------------------------------------------------
  // Error handling
  // ------------------------------------------------------------------

  describe('error handling', () => {
    it('should return NOT_FOUND for non-existent file', async () => {
      const result = await fileEdit({
        path: path.join(ws.dir, 'ghost.md'),
        workspace: ws.dir,
        edits: [{ type: 'append', content: 'x' }],
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NOT_FOUND');
    });

    it('should block edit outside workspace', async () => {
      const result = await fileEdit({
        path: '/etc/hosts',
        workspace: ws.dir,
        edits: [{ type: 'append', content: 'evil' }],
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('OUTSIDE_WORKSPACE');
    });

    it('should reject file exceeding MAX_FILE_SIZE', async () => {
      const bigFile = path.join(ws.dir, 'big-edit.bin');
      const handle = await fs.open(bigFile, 'w');
      await handle.truncate(MAX_FILE_SIZE + 1);
      await handle.close();

      const result = await fileEdit({
        path: bigFile,
        workspace: ws.dir,
        edits: [{ type: 'append', content: 'x' }],
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/too large/i);
    });

    it('should return INVALID_PATH for invalid input', async () => {
      const result = await fileEdit({ path: '', edits: [] });
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_PATH');
    });
  });
});

// ============================================================================
// file_search
// ============================================================================

describe('fileSearch', () => {
  // Seed a small workspace with files for searching
  const seedSearchWorkspace = async (): Promise<void> => {
    // Markdown files
    await fs.writeFile(
      path.join(ws.dir, 'lesson-plan.md'),
      '# Lesson Plan\n\nTopic: Photosynthesis\nStudents will learn about light reactions.\n',
      'utf-8'
    );
    await fs.writeFile(
      path.join(ws.dir, 'reflection.md'),
      '# Reflection\n\nThe lesson went well.\nPhotosynthesis was engaging.\n',
      'utf-8'
    );

    // Nested file
    await fs.mkdir(path.join(ws.dir, 'Ideas'), { recursive: true });
    await fs.writeFile(
      path.join(ws.dir, 'Ideas', 'quick-idea.md'),
      '# Quick Idea\n\nUse peer assessment for lab reports.\n',
      'utf-8'
    );

    // Non-markdown file
    await fs.writeFile(
      path.join(ws.dir, 'notes.txt'),
      'Some notes about photosynthesis.\n',
      'utf-8'
    );
  };

  // ------------------------------------------------------------------
  // Basic search
  // ------------------------------------------------------------------

  describe('basic search', () => {
    it('should find matching content across files', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'Photosynthesis',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      expect(result.matches.length).toBeGreaterThanOrEqual(2);
      expect(result.files_matched).toBeGreaterThanOrEqual(2);
    });

    it('should return relative paths', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'Photosynthesis',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      for (const match of result.matches) {
        expect(match.relative_path).not.toContain(ws.dir);
        expect(match.file).toContain(ws.dir);
      }
    });

    it('should include line and column numbers (1-indexed)', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'Topic',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      expect(result.matches.length).toBeGreaterThanOrEqual(1);
      expect(result.matches[0].line).toBeGreaterThanOrEqual(1);
      expect(result.matches[0].column).toBeGreaterThanOrEqual(1);
    });

    it('should include context lines', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'Topic',
        workspace: ws.dir,
        patterns: ['**/*.md'],
        context_lines: 1,
      });

      expect(result.success).toBe(true);
      const match = result.matches[0];
      // context_lines: 1 means 1 line before and 1 line after
      expect(match.context).toBeDefined();
      expect(match.context.before).toBeInstanceOf(Array);
      expect(match.context.after).toBeInstanceOf(Array);
    });
  });

  // ------------------------------------------------------------------
  // Pattern filtering
  // ------------------------------------------------------------------

  describe('pattern filtering', () => {
    it('should only search files matching the pattern', async () => {
      await seedSearchWorkspace();

      // Search only .txt files
      const result = await fileSearch({
        query: 'photosynthesis',
        workspace: ws.dir,
        patterns: ['**/*.txt'],
      });

      expect(result.success).toBe(true);
      // notes.txt has "photosynthesis" — case-insensitive by default
      expect(result.files_matched).toBe(1);
      expect(result.matches[0].relative_path).toBe('notes.txt');
    });

    it('should search nested directories', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'peer assessment',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      expect(result.files_matched).toBe(1);
      expect(result.matches[0].relative_path).toContain('Ideas');
    });
  });

  // ------------------------------------------------------------------
  // Case sensitivity
  // ------------------------------------------------------------------

  describe('case sensitivity', () => {
    it('should be case-insensitive by default', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'photosynthesis', // lowercase
        workspace: ws.dir,
        patterns: ['**/*.md'],
        case_sensitive: false,
      });

      expect(result.success).toBe(true);
      // Should match "Photosynthesis" in the files
      expect(result.matches.length).toBeGreaterThanOrEqual(2);
    });

    it('should respect case_sensitive=true', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'photosynthesis', // lowercase — won't match "Photosynthesis"
        workspace: ws.dir,
        patterns: ['**/*.md'],
        case_sensitive: true,
      });

      expect(result.success).toBe(true);
      // No matches because the files have capital "Photosynthesis"
      expect(result.matches.length).toBe(0);
    });
  });

  // ------------------------------------------------------------------
  // max_results / truncation
  // ------------------------------------------------------------------

  describe('max_results', () => {
    it('should limit results and report truncated=true', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'Photosynthesis',
        workspace: ws.dir,
        patterns: ['**/*.md'],
        max_results: 1,
        case_sensitive: false,
      });

      expect(result.success).toBe(true);
      expect(result.matches.length).toBeLessThanOrEqual(1);
      // There are at least 2 matches in the workspace, so truncated should be true
      expect(result.truncated).toBe(true);
    });
  });

  // ------------------------------------------------------------------
  // Empty/no results
  // ------------------------------------------------------------------

  describe('no results', () => {
    it('should return empty matches for non-matching query', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'xyzzy_no_match_here',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      expect(result.matches.length).toBe(0);
      expect(result.files_matched).toBe(0);
    });

    it('should return success with empty results for empty workspace', async () => {
      // ws.dir has no files yet (seedSearchWorkspace not called)
      const result = await fileSearch({
        query: 'anything',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      expect(result.matches.length).toBe(0);
      expect(result.files_searched).toBe(0);
    });
  });

  // ------------------------------------------------------------------
  // Workspace security
  // ------------------------------------------------------------------

  describe('workspace security', () => {
    it('should validate that workspace directory exists', async () => {
      const result = await fileSearch({
        query: 'test',
        workspace: path.join(ws.dir, 'nonexistent-subdir'),
      });

      // The workspace directory does not exist, so stat() will fail
      // and the search should either return an error or zero results
      // depending on implementation. The key is it does not crash.
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect(result.files_searched).toBe(0);
      }
    });

    it('should reject non-directory workspace', async () => {
      const filePath = path.join(ws.dir, 'not-a-dir.txt');
      await fs.writeFile(filePath, 'content', 'utf-8');

      const result = await fileSearch({
        query: 'test',
        workspace: filePath,
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_WORKSPACE');
    });
  });

  // ------------------------------------------------------------------
  // Exclude patterns
  // ------------------------------------------------------------------

  describe('exclude patterns', () => {
    it('should skip files matching exclude patterns', async () => {
      await seedSearchWorkspace();

      const result = await fileSearch({
        query: 'peer assessment',
        workspace: ws.dir,
        patterns: ['**/*.md'],
        exclude: ['Ideas'],
      });

      expect(result.success).toBe(true);
      // The Ideas/quick-idea.md file should be excluded
      expect(result.matches.length).toBe(0);
    });
  });

  // ------------------------------------------------------------------
  // Symlink skipping
  // ------------------------------------------------------------------

  describe('symlink handling', () => {
    it('should skip symlinked files during search', async () => {
      await seedSearchWorkspace();

      // Create a symlink to a file inside the workspace
      const linkPath = path.join(ws.dir, 'link-to-plan.md');
      await fs.symlink(path.join(ws.dir, 'lesson-plan.md'), linkPath);

      const result = await fileSearch({
        query: 'Photosynthesis',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      // The symlink should be skipped, so we only get matches from real files
      const matchFiles = result.matches.map((m) => m.relative_path);
      expect(matchFiles).not.toContain('link-to-plan.md');
    });
  });

  // ------------------------------------------------------------------
  // Hidden files
  // ------------------------------------------------------------------

  describe('hidden files', () => {
    it('should skip hidden files and directories', async () => {
      await seedSearchWorkspace();

      // Create a hidden file
      await fs.writeFile(
        path.join(ws.dir, '.hidden-note.md'),
        '# Hidden\n\nPhotosynthesis secret.\n',
        'utf-8'
      );

      const result = await fileSearch({
        query: 'Photosynthesis',
        workspace: ws.dir,
        patterns: ['**/*.md'],
      });

      expect(result.success).toBe(true);
      const matchFiles = result.matches.map((m) => m.relative_path);
      expect(matchFiles).not.toContain('.hidden-note.md');
    });
  });
});
