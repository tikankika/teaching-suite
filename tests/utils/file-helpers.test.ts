/**
 * Tests for file-helpers utility — file system operations.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileOrNull, fileExists, ensureDirectory } from '../../src/utils/file-helpers.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('file-helpers', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-helpers-test-'));
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('readFileOrNull', () => {
    it('should read an existing file and return its content', async () => {
      const filePath = path.join(testDir, 'test.txt');
      await fs.writeFile(filePath, 'hello world', 'utf-8');

      const result = await readFileOrNull(filePath);
      expect(result).toBe('hello world');
    });

    it('should return null for a non-existent file', async () => {
      const filePath = path.join(testDir, 'does-not-exist.txt');
      const result = await readFileOrNull(filePath);
      expect(result).toBeNull();
    });

    it('should return empty string for an empty file', async () => {
      const filePath = path.join(testDir, 'empty.txt');
      await fs.writeFile(filePath, '', 'utf-8');

      const result = await readFileOrNull(filePath);
      expect(result).toBe('');
    });

    it('should handle UTF-8 content with Swedish characters', async () => {
      const filePath = path.join(testDir, 'swedish.txt');
      await fs.writeFile(filePath, 'Hej världen! Åäö.', 'utf-8');

      const result = await readFileOrNull(filePath);
      expect(result).toBe('Hej världen! Åäö.');
    });
  });

  describe('fileExists', () => {
    it('should return true for an existing file', async () => {
      const filePath = path.join(testDir, 'exists.txt');
      await fs.writeFile(filePath, 'content', 'utf-8');

      const result = await fileExists(filePath);
      expect(result).toBe(true);
    });

    it('should return false for a non-existent file', async () => {
      const filePath = path.join(testDir, 'nope.txt');
      const result = await fileExists(filePath);
      expect(result).toBe(false);
    });

    it('should return true for an existing directory', async () => {
      const dirPath = path.join(testDir, 'subdir');
      await fs.mkdir(dirPath);

      const result = await fileExists(dirPath);
      expect(result).toBe(true);
    });
  });

  describe('ensureDirectory', () => {
    it('should create a directory', async () => {
      const dirPath = path.join(testDir, 'new-dir');
      await ensureDirectory(dirPath);

      const stat = await fs.stat(dirPath);
      expect(stat.isDirectory()).toBe(true);
    });

    it('should create nested directories', async () => {
      const dirPath = path.join(testDir, 'a', 'b', 'c');
      await ensureDirectory(dirPath);

      const stat = await fs.stat(dirPath);
      expect(stat.isDirectory()).toBe(true);
    });

    it('should not throw if directory already exists', async () => {
      const dirPath = path.join(testDir, 'already');
      await fs.mkdir(dirPath);

      // Should not throw
      await expect(ensureDirectory(dirPath)).resolves.toBeUndefined();

      const stat = await fs.stat(dirPath);
      expect(stat.isDirectory()).toBe(true);
    });
  });
});
