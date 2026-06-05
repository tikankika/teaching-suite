import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';

// New refactored tools (RFC-006)
import { captureSession, parseContent } from '../src/tools/composite/capture-session.js';
import { formatCapturedSession } from '../src/tools/composite/format-captured-session.js';
import { quickSaveSession } from '../src/tools/composite/quick-save-session.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

// ============================================================================
// capture_session (NEW - pure parsing, no file I/O)
// ============================================================================

describe('capture_session (refactored)', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return items and metadata without filepath', async () => {
    const result = await captureSession({
      content: 'Beslut: Använd TypeScript.\nIdé: Lägg till tester.',
      source: 'test',
    });

    // New output format - no filepath!
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('metadata');
    expect(result).not.toHaveProperty('filepath');
  });

  it('should parse items correctly', async () => {
    const result = await captureSession({
      content: 'Beslut: Använd TypeScript.\nIdé: Lägg till tester.',
      source: 'test',
    });

    expect(result.items).toHaveLength(2);
    expect(result.items[0].type).toBe('decision');
    expect(result.items[1].type).toBe('idea');
  });

  it('should generate correct metadata', async () => {
    const result = await captureSession({
      content: 'Beslut: Test',
      source: 'claude-desktop',
      project: '[[Teaching Suite]]',
      course: '[[KURS101_2026]]',
    });

    expect(result.metadata.type).toBe('captured-session');
    expect(result.metadata.source).toBe('claude-desktop');
    expect(result.metadata.date).toBe('2026-01-11');
    expect(result.metadata.status).toBe('raw');
    expect(result.metadata.reviewed).toBe(false);
    expect(result.metadata.itemCount).toBe(1);
    expect(result.metadata.project).toBe('[[Teaching Suite]]');
    expect(result.metadata.course).toBe('[[KURS101_2026]]');
  });

  it('should add captured timestamp to items', async () => {
    const result = await captureSession({
      content: 'Beslut: Test',
      source: 'test',
    });

    expect(result.items[0].captured).toBe('2026-01-11T10:00');
  });

  it('should throw on invalid input', async () => {
    await expect(
      captureSession({ content: '', source: 'test' })
    ).rejects.toThrow();
  });
});

// ============================================================================
// format_captured_session
// ============================================================================

describe('format_captured_session', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should convert captured data to markdown', async () => {
    const capturedData = await captureSession({
      content: 'Beslut: Använd TypeScript.',
      source: 'test',
    });

    const result = await formatCapturedSession(capturedData);

    expect(result.markdown).toContain('---');
    expect(result.markdown).toContain('type: captured-session');
    expect(result.markdown).toContain('## ✅ Beslut:');
  });

  it('should suggest filename', async () => {
    const capturedData = await captureSession({
      content: 'Beslut: Test',
      source: 'claude-desktop',
    });

    const result = await formatCapturedSession(capturedData);

    expect(result.suggested_filename).toContain('captured_');
    expect(result.suggested_filename).toContain('2026-01-11');
    expect(result.suggested_filename).toContain('claude-desktop');
    expect(result.suggested_filename.endsWith('.md')).toBe(true);
  });

  it('should suggest content_type as reflection', async () => {
    const capturedData = await captureSession({
      content: 'Reflektion: Det fungerade bra.',
      source: 'test',
    });

    const result = await formatCapturedSession(capturedData);

    expect(result.suggested_content_type).toBe('reflection');
  });

  it('should include Dataview inline fields', async () => {
    const capturedData = await captureSession({
      content: 'Idé: Ny funktion.\nBeslut: Implementera det.',
      source: 'test',
    });

    const result = await formatCapturedSession(capturedData);

    expect(result.markdown).toContain('[type:: idea]');
    expect(result.markdown).toContain('[type:: decision]');
    expect(result.markdown).toContain('[priority::');
    expect(result.markdown).toContain('[status:: raw]');
    expect(result.markdown).toContain('[captured::');
  });
});

// ============================================================================
// quick_save_session
// ============================================================================

describe('quick_save_session', () => {
  const testDir = '/tmp/quick-save-session-test';

  beforeEach(async () => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
    // Set server workspace so core validation accepts paths
    setServerWorkspace('/');
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  });

  afterEach(async () => {
    vi.useRealTimers();
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  it('should return items even on success', async () => {
    const result = await quickSaveSession({
      content: 'Beslut: Test beslut.',
      source: 'test',
      workspace: testDir,
    });

    // Always includes items
    expect(result.items).toBeDefined();
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.metadata).toBeDefined();
  });

  it('should save file and return filepath on success', async () => {
    const result = await quickSaveSession({
      content: 'Beslut: Test beslut.',
      source: 'test',
      workspace: testDir,
    });

    expect(result.success).toBe(true);
    expect(result.filepath).toBeDefined();
    expect(result.filepath).toContain(testDir);

    // Verify file exists
    const stats = await fs.stat(result.filepath!);
    expect(stats.isFile()).toBe(true);
  });

  it('should include parsed items in success response', async () => {
    const result = await quickSaveSession({
      content: 'Beslut: Första.\nIdé: Andra.',
      source: 'test',
      workspace: testDir,
    });

    expect(result.success).toBe(true);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].type).toBe('decision');
    expect(result.items[1].type).toBe('idea');
  });

  it('should return partial success with items on save failure', async () => {
    // Try to save to non-writable location
    const result = await quickSaveSession({
      content: 'Beslut: Test.',
      source: 'test',
      workspace: '/nonexistent/readonly/path',
    });

    // Should have items even if save failed
    expect(result.items).toBeDefined();
    expect(result.metadata).toBeDefined();

    if (!result.success) {
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('SAVE_FAILED');
    }
  });

  it('should return error details on parse failure', async () => {
    const result = await quickSaveSession({
      content: '', // Empty content should fail
      source: 'test',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe('PARSE_FAILED');
  });

  it('should pass project and course to metadata', async () => {
    const result = await quickSaveSession({
      content: 'Beslut: Test.',
      source: 'test',
      workspace: testDir,
      project: '[[Teaching Suite]]',
      course: '[[KURS101_2026]]',
    });

    expect(result.metadata.project).toBe('[[Teaching Suite]]');
    expect(result.metadata.course).toBe('[[KURS101_2026]]');
  });
});

// ============================================================================
// Integration: capture → format → intelligent_save chain
// ============================================================================

describe('tool chain integration', () => {
  const testDir = '/tmp/tool-chain-test';

  beforeEach(async () => {
    vi.setSystemTime(new Date('2026-01-11T10:00:00Z'));
    // Set server workspace so core validation accepts paths
    setServerWorkspace('/');
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch {
      // Directory might exist
    }
  });

  afterEach(async () => {
    vi.useRealTimers();
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  it('should work as manual chain: capture → format → intelligent_save', async () => {
    // Import intelligent_save
    const { intelligentSave } = await import('../src/tools/composite/intelligent-save.js');

    // Step 1: Capture
    const captured = await captureSession({
      content: `Vi diskuterade refaktorering.
Beslut: Separera parsing från fil-I/O.
Idé: Använd intelligent_save för alla verktyg.
Reflektion: Det blev mycket renare kod.`,
      source: 'test',
      project: '[[Teaching Suite]]',
    });

    expect(captured.items).toHaveLength(3);

    // Step 2: Format
    const formatted = await formatCapturedSession(captured);

    expect(formatted.markdown).toContain('type: captured-session');
    expect(formatted.markdown).toContain('## ✅ Beslut:');
    expect(formatted.markdown).toContain('## 💡 Idé:');
    expect(formatted.markdown).toContain('## 🤔 Reflektion:');

    // Step 3: Save
    const saved = await intelligentSave({
      content: formatted.markdown,
      content_type: formatted.suggested_content_type,
      suggested_filename: formatted.suggested_filename,
      suggested_location: testDir,
      auto_confirm: true,
    });

    expect(saved.success).toBe(true);
    expect(saved.filepath).toBeDefined();

    // Verify file content
    const fileContent = await fs.readFile(saved.filepath!, 'utf-8');
    expect(fileContent).toContain('Separera parsing från fil-I/O');
  });
});
