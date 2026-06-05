/**
 * Tests for capture_idea tool
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { captureIdea } from '../src/tools/composite/capture-idea.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('captureIdea', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create temp directory for tests
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'capture-idea-test-'));
  });

  afterEach(async () => {
    // Clean up
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('input validation', () => {
    it('should require idea_text', async () => {
      const result = await captureIdea({});
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should reject empty idea_text', async () => {
      const result = await captureIdea({ idea_text: '' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should validate priority enum', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        priority: 'invalid',
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid input');
    });

    it('should accept valid priority values', async () => {
      for (const priority of ['nu', 'snart', 'någon_gång']) {
        const result = await captureIdea({
          idea_text: 'Test idea',
          priority,
          workspace: testDir,
        });
        // Should not fail on validation
        expect(result.success).toBe(true);
      }
    });
  });

  describe('confirmation flow', () => {
    it('should return confirmation request by default', async () => {
      const result = await captureIdea({
        idea_text: 'Use SRL strategies in lab',
        workspace: testDir,
      });

      expect(result.success).toBe(true);
      expect(result.confirmation_needed).toBe(true);
      expect(result.suggestion).toBeDefined();
      expect(result.suggestion?.filename).toMatch(/^\d{4}-\d{2}-\d{2}-.+\.md$/);
      expect(result.suggestion?.directory).toContain('Ideas');
    });

    it('should include Swedish message in confirmation', async () => {
      const result = await captureIdea({
        idea_text: 'Testa nya pedagogiska metoder',
        workspace: testDir,
      });

      expect(result.suggestion?.message).toContain('Spara');
      expect(result.suggestion?.message).toContain('auto_confirm');
    });

    it('should save directly with auto_confirm', async () => {
      const result = await captureIdea({
        idea_text: 'Implement peer assessment',
        workspace: testDir,
        auto_confirm: true,
      });

      expect(result.success).toBe(true);
      expect(result.confirmation_needed).toBeUndefined();
      expect(result.filepath).toBeDefined();
      expect(result.filepath).toContain('Ideas');

      // Verify file exists
      const exists = await fs
        .access(result.filepath!)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);
    });
  });

  describe('title generation', () => {
    it('should generate title from idea_text', async () => {
      const result = await captureIdea({
        idea_text: 'Use SRL strategies in lab sessions',
        workspace: testDir,
      });

      expect(result.title).toBe('Use SRL strategies in lab sessions');
    });

    it('should truncate long titles', async () => {
      const longIdea =
        'This is a very long idea text that should be truncated when generating the title because it exceeds the maximum allowed length';
      const result = await captureIdea({
        idea_text: longIdea,
        workspace: testDir,
      });

      expect(result.title!.length).toBeLessThanOrEqual(60);
    });

    it('should handle Swedish characters', async () => {
      const result = await captureIdea({
        idea_text: 'Använd formativ bedömning i kursen',
        workspace: testDir,
      });

      expect(result.title).toBe('Använd formativ bedömning i kursen');
    });
  });

  describe('tag generation', () => {
    it('should always include idea tag', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        workspace: testDir,
      });

      expect(result.tags).toContain('idea');
    });

    it('should extract course code from context', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        context: 'KURS101_2026',
        workspace: testDir,
      });

      expect(result.tags).toContain('kurs101');
    });

    it('should add priority tag', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        priority: 'snart',
        workspace: testDir,
      });

      expect(result.tags).toContain('priority-snart');
    });

    it('should extract hashtags from idea_text', async () => {
      const result = await captureIdea({
        idea_text: 'Implement #srl and #formativ assessment',
        workspace: testDir,
      });

      expect(result.tags).toContain('srl');
      expect(result.tags).toContain('formativ');
    });

    it('should detect keywords in context', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        context: 'SRL implementation for KURS101',
        workspace: testDir,
      });

      expect(result.tags).toContain('srl');
    });
  });

  describe('priority handling', () => {
    it('should default to någon_gång', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        workspace: testDir,
        auto_confirm: true,
      });

      // Read the file and check content
      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('**Priority:** någon_gång');
      expect(content).toContain('**Status:** BACKLOG');
    });

    it('should set ACTIVE status for priority nu', async () => {
      const result = await captureIdea({
        idea_text: 'Urgent idea',
        priority: 'nu',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('**Priority:** nu');
      expect(content).toContain('**Status:** ACTIVE');
    });

    it('should set BACKLOG status for priority snart', async () => {
      const result = await captureIdea({
        idea_text: 'Soon idea',
        priority: 'snart',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('**Priority:** snart');
      expect(content).toContain('**Status:** BACKLOG');
    });
  });

  describe('file content', () => {
    it('should create proper markdown structure', async () => {
      const result = await captureIdea({
        idea_text: 'Implement formative assessment',
        context: 'KURS101_2026',
        priority: 'snart',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');

      // Check sections
      expect(content).toContain('## Idé');
      expect(content).toContain('## Kontext');
      expect(content).toContain('## Nästa steg');
      expect(content).toContain('- [ ]');
      expect(content).toContain('*Captured via Teaching Suite*');
    });

    it('should include YAML frontmatter', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toMatch(/^---\n/);
      expect(content).toContain('title:');
      expect(content).toContain('type: idea');
    });

    it('should include context in content', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        context: 'KURS101_2026',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('KURS101_2026');
    });

    it('should show Generellt when no context', async () => {
      const result = await captureIdea({
        idea_text: 'General idea',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('Generellt');
    });
  });

  describe('filename generation', () => {
    it('should include date prefix', async () => {
      const result = await captureIdea({
        idea_text: 'Test idea',
        workspace: testDir,
      });

      const today = new Date().toISOString().split('T')[0];
      expect(result.suggestion?.filename).toContain(today);
    });

    it('should create slug from title', async () => {
      const result = await captureIdea({
        idea_text: 'Use SRL in Labs',
        workspace: testDir,
      });

      expect(result.suggestion?.filename).toContain('use-srl-in-labs');
    });

    it('should convert Swedish characters to ASCII', async () => {
      const result = await captureIdea({
        idea_text: 'Använd formativ bedömning',
        workspace: testDir,
      });

      expect(result.suggestion?.filename).toContain('anvand-formativ-bedomning');
      expect(result.suggestion?.filename).not.toContain('ä');
      expect(result.suggestion?.filename).not.toContain('ö');
    });
  });

  describe('related_to handling', () => {
    it('should format wikilink from path', async () => {
      const result = await captureIdea({
        idea_text: 'Related idea',
        related_to: 'Lesson_Plans/KURS101_Lab3.md',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('[[KURS101_Lab3]]');
    });

    it('should preserve existing wikilinks', async () => {
      const result = await captureIdea({
        idea_text: 'Related idea',
        related_to: '[[My Document]]',
        workspace: testDir,
        auto_confirm: true,
      });

      const content = await fs.readFile(result.filepath!, 'utf-8');
      expect(content).toContain('[[My Document]]');
    });
  });
});
