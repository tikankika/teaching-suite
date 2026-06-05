/**
 * Tests for text-helpers utility — title extraction.
 */

import { describe, it, expect } from 'vitest';
import { extractTitle } from '../../src/utils/text-helpers.js';

describe('extractTitle', () => {
  describe('markdown heading extraction', () => {
    it('should extract a simple markdown heading', () => {
      const content = '# My Title\n\nSome body text.';
      expect(extractTitle(content)).toBe('My Title');
    });

    it('should take the first heading when multiple exist', () => {
      const content = '# First Heading\n\n## Second Heading\n\n# Third Heading';
      expect(extractTitle(content)).toBe('First Heading');
    });

    it('should trim whitespace from extracted heading', () => {
      const content = '#   Spaced Title   \n\nBody.';
      expect(extractTitle(content)).toBe('Spaced Title');
    });

    it('should match heading not on the first line', () => {
      const content = 'Some preamble text\n\n# Actual Title\n\nBody.';
      expect(extractTitle(content)).toBe('Actual Title');
    });
  });

  describe('first-line fallback', () => {
    it('should use first line when no heading exists', () => {
      const content = 'Just a plain text document.\nSecond line.';
      expect(extractTitle(content)).toBe('Just a plain text document.');
    });

    it('should trim the first line', () => {
      const content = '  Leading spaces  \nMore text.';
      expect(extractTitle(content)).toBe('Leading spaces');
    });
  });

  describe('empty and whitespace content', () => {
    it('should return empty string for empty content', () => {
      expect(extractTitle('')).toBe('');
    });

    it('should return empty string for whitespace-only content', () => {
      expect(extractTitle('   \n  \n  ')).toBe('');
    });
  });

  describe('truncation', () => {
    it('should truncate to maxLength', () => {
      const longTitle = 'A'.repeat(100);
      const content = `# ${longTitle}\n\nBody.`;
      const result = extractTitle(content, 20);
      expect(result).toHaveLength(20);
      expect(result).toBe('A'.repeat(20));
    });

    it('should not truncate titles shorter than maxLength', () => {
      const content = '# Short\n\nBody.';
      const result = extractTitle(content, 60);
      expect(result).toBe('Short');
    });

    it('should truncate first-line fallback too', () => {
      const longLine = 'B'.repeat(100);
      const content = longLine;
      const result = extractTitle(content, 30);
      expect(result).toHaveLength(30);
    });

    it('should respect custom maxLength', () => {
      const content = '# Exactly Ten!!\n\nBody.';
      const result = extractTitle(content, 10);
      expect(result).toHaveLength(10);
    });
  });

  describe('ellipsis parameter', () => {
    it('should append ellipsis when truncating with ellipsis=true', () => {
      const longTitle = 'A'.repeat(100);
      const content = `# ${longTitle}\n\nBody.`;
      const result = extractTitle(content, 20, true);
      expect(result).toHaveLength(20);
      expect(result).toMatch(/\.\.\.$/);
      expect(result).toBe('A'.repeat(17) + '...');
    });

    it('should not append ellipsis when title fits', () => {
      const content = '# Short\n\nBody.';
      const result = extractTitle(content, 60, true);
      expect(result).toBe('Short');
      expect(result).not.toContain('...');
    });

    it('should not append ellipsis by default', () => {
      const longTitle = 'C'.repeat(100);
      const content = `# ${longTitle}\n\nBody.`;
      const result = extractTitle(content, 20);
      expect(result).not.toContain('...');
      expect(result).toBe('C'.repeat(20));
    });

    it('should apply ellipsis to first-line fallback too', () => {
      const longLine = 'D'.repeat(80);
      const result = extractTitle(longLine, 25, true);
      expect(result).toHaveLength(25);
      expect(result).toBe('D'.repeat(22) + '...');
    });
  });
});
