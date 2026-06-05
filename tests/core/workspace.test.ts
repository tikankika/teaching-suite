/**
 * Security-critical tests for workspace path validation.
 *
 * Covers: path traversal, prefix attacks, symlink escapes,
 * null bytes, empty paths, non-existent targets, and edge cases.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  validateWorkspace,
  validatePath,
  validatePathInWorkspace,
  setServerWorkspace,
  getServerWorkspace,
  MAX_FILE_SIZE,
} from '../../src/tools/core/workspace.js';
import { createTempWorkspace, type TempWorkspace } from '../helpers/setup.js';

// ============================================================================
// SETUP
// ============================================================================

let ws: TempWorkspace;

beforeEach(async () => {
  ws = await createTempWorkspace('workspace-sec-');
  setServerWorkspace(ws.dir);
});

afterEach(async () => {
  await ws.cleanup();
});

// ============================================================================
// MAX_FILE_SIZE constant
// ============================================================================

describe('MAX_FILE_SIZE', () => {
  it('should equal 10 MB', () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });
});

// ============================================================================
// setServerWorkspace / getServerWorkspace
// ============================================================================

describe('server workspace management', () => {
  it('should store and retrieve the server workspace', () => {
    setServerWorkspace('/tmp/test-ws');
    expect(getServerWorkspace()).toBe('/tmp/test-ws');
    // Restore for other tests
    setServerWorkspace(ws.dir);
  });

  it('should resolve relative paths on set', () => {
    const original = process.cwd();
    setServerWorkspace('relative/path');
    expect(getServerWorkspace()).toBe(path.resolve(original, 'relative/path'));
    // Restore
    setServerWorkspace(ws.dir);
  });
});

// ============================================================================
// validatePath — synchronous format checks
// ============================================================================

describe('validatePath', () => {
  it('should accept a normal path', () => {
    const result = validatePath('/some/file.txt');
    expect(result.valid).toBe(true);
  });

  it('should reject empty string', () => {
    const result = validatePath('');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/empty/i);
  });

  it('should reject whitespace-only string', () => {
    const result = validatePath('   ');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/empty/i);
  });

  it('should reject path containing null byte', () => {
    const result = validatePath('/some/path\0/file.txt');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/null/i);
  });

  it('should accept path with spaces', () => {
    const result = validatePath('/some/path with spaces/file.txt');
    expect(result.valid).toBe(true);
  });

  it('should accept path with unicode characters', () => {
    const result = validatePath('/some/path/filönamn.txt');
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// validateWorkspace — async containment checks
// ============================================================================

describe('validateWorkspace', () => {
  // ------------------------------------------------------------------
  // Basic containment
  // ------------------------------------------------------------------

  describe('basic containment', () => {
    it('should allow a path inside the workspace', async () => {
      const target = path.join(ws.dir, 'subdir', 'file.md');
      await fs.mkdir(path.join(ws.dir, 'subdir'), { recursive: true });
      await fs.writeFile(target, 'hello', 'utf-8');

      const result = await validateWorkspace(target, ws.dir);
      expect(result.valid).toBe(true);
    });

    it('should allow a path equal to workspace root', async () => {
      const result = await validateWorkspace(ws.dir, ws.dir);
      expect(result.valid).toBe(true);
    });

    it('should block path traversal with ..', async () => {
      const evil = path.join(ws.dir, '..', 'outside.txt');
      const result = await validateWorkspace(evil, ws.dir);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/outside/i);
    });

    it('should block deep path traversal', async () => {
      const evil = path.join(ws.dir, 'a', 'b', '..', '..', '..', 'outside.txt');
      const result = await validateWorkspace(evil, ws.dir);
      expect(result.valid).toBe(false);
    });
  });

  // ------------------------------------------------------------------
  // Prefix attack: /tmp/ws vs /tmp/ws-evil
  // ------------------------------------------------------------------

  describe('workspace prefix attack', () => {
    it('should block paths that share a prefix but are different directories', async () => {
      // Workspace = ws.dir (e.g. /tmp/workspace-sec-XXXXX)
      // Evil path = ws.dir + '-evil/file.txt' — shares the prefix but is outside
      const evilDir = ws.dir + '-evil';
      await fs.mkdir(evilDir, { recursive: true });
      const evilFile = path.join(evilDir, 'secret.txt');
      await fs.writeFile(evilFile, 'stolen', 'utf-8');

      const result = await validateWorkspace(evilFile, ws.dir);
      expect(result.valid).toBe(false);

      // Cleanup the evil directory
      await fs.rm(evilDir, { recursive: true, force: true });
    });
  });

  // ------------------------------------------------------------------
  // No workspace configured
  // ------------------------------------------------------------------

  describe('no workspace configured', () => {
    it('should reject when neither tool-level nor server-level workspace is set', async () => {
      // Temporarily clear server workspace by setting it to something,
      // then calling validateWorkspace without workspace param and with
      // a cleared server workspace.
      // We cannot easily "unset" _serverWorkspace, so we test the param path.
      const result = await validateWorkspace('/tmp/file.txt', undefined);
      // The function falls back to _serverWorkspace which IS set in beforeEach.
      // This path is outside that workspace, so it should be blocked.
      expect(result.valid).toBe(false);
    });
  });

  // ------------------------------------------------------------------
  // Symlink handling
  // ------------------------------------------------------------------

  describe('symlink handling', () => {
    it('should block symlink inside workspace that points outside', async () => {
      // Create a directory outside the workspace
      const outsideDir = ws.dir + '-outside-target';
      await fs.mkdir(outsideDir, { recursive: true });
      const outsideFile = path.join(outsideDir, 'secret.txt');
      await fs.writeFile(outsideFile, 'sensitive data', 'utf-8');

      // Create a symlink inside the workspace pointing outside
      const symlinkPath = path.join(ws.dir, 'escape-link');
      await fs.symlink(outsideFile, symlinkPath);

      const result = await validateWorkspace(symlinkPath, ws.dir);
      // realpath resolves to the outside target, which is not in workspace
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/outside/i);

      // Cleanup
      await fs.rm(outsideDir, { recursive: true, force: true });
    });

    it('should allow symlink inside workspace that points inside workspace', async () => {
      // Create a real file inside the workspace
      const realFile = path.join(ws.dir, 'real-file.txt');
      await fs.writeFile(realFile, 'safe content', 'utf-8');

      // Create a symlink inside the workspace pointing to the real file
      const symlinkPath = path.join(ws.dir, 'internal-link');
      await fs.symlink(realFile, symlinkPath);

      const result = await validateWorkspace(symlinkPath, ws.dir);
      // realpath resolves to ws.dir/real-file.txt which is inside
      expect(result.valid).toBe(true);
    });

    it('should block directory symlink pointing outside workspace', async () => {
      const outsideDir = ws.dir + '-outside-dir';
      await fs.mkdir(outsideDir, { recursive: true });
      await fs.writeFile(path.join(outsideDir, 'data.txt'), 'nope', 'utf-8');

      const symlinkDir = path.join(ws.dir, 'linked-dir');
      await fs.symlink(outsideDir, symlinkDir);

      const target = path.join(symlinkDir, 'data.txt');
      const result = await validateWorkspace(target, ws.dir);
      expect(result.valid).toBe(false);

      await fs.rm(outsideDir, { recursive: true, force: true });
    });
  });

  // ------------------------------------------------------------------
  // Non-existent paths (write targets)
  // ------------------------------------------------------------------

  describe('non-existent paths', () => {
    it('should allow new file in existing directory inside workspace', async () => {
      const newFile = path.join(ws.dir, 'new-file.md');
      const result = await validateWorkspace(newFile, ws.dir);
      expect(result.valid).toBe(true);
    });

    it('should allow new file in non-existent subdirectory inside workspace', async () => {
      const deepFile = path.join(ws.dir, 'a', 'b', 'c', 'new-file.md');
      const result = await validateWorkspace(deepFile, ws.dir);
      // The resolveRealPath walks up to nearest existing ancestor (ws.dir)
      // and re-appends the tail — so it should still be inside workspace.
      expect(result.valid).toBe(true);
    });

    it('should block new file whose resolved parent is outside workspace', async () => {
      const evil = path.join(ws.dir, '..', 'other-dir', 'new-file.md');
      const result = await validateWorkspace(evil, ws.dir);
      expect(result.valid).toBe(false);
    });
  });
});

// ============================================================================
// validatePathInWorkspace — combined validation
// ============================================================================

describe('validatePathInWorkspace', () => {
  it('should return valid result with resolvedPath for good path', async () => {
    const target = path.join(ws.dir, 'test.md');
    await fs.writeFile(target, 'content', 'utf-8');

    const result = await validatePathInWorkspace(target, ws.dir);
    expect(result.valid).toBe(true);
    expect(result.resolvedPath).toBeDefined();
    expect(result.resolvedPath).toContain(ws.dir);
  });

  it('should reject empty path before checking workspace', async () => {
    const result = await validatePathInWorkspace('', ws.dir);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/empty/i);
  });

  it('should reject null byte path before checking workspace', async () => {
    const result = await validatePathInWorkspace('/some\0path', ws.dir);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/null/i);
  });

  it('should reject path outside workspace', async () => {
    const result = await validatePathInWorkspace('/etc/passwd', ws.dir);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/outside/i);
  });

  it('should use server workspace when tool-level workspace is omitted', async () => {
    const target = path.join(ws.dir, 'file.txt');
    await fs.writeFile(target, 'ok', 'utf-8');

    // No explicit workspace — falls back to server workspace set in beforeEach
    const result = await validatePathInWorkspace(target);
    expect(result.valid).toBe(true);
  });

  it('should return a Promise (async behaviour)', () => {
    const resultPromise = validatePathInWorkspace(path.join(ws.dir, 'test'));
    expect(resultPromise).toBeInstanceOf(Promise);
  });

  // ------------------------------------------------------------------
  // Edge cases
  // ------------------------------------------------------------------

  describe('edge cases', () => {
    it('should handle path with spaces and unicode', async () => {
      const dirWithSpaces = path.join(ws.dir, 'kurs namn');
      await fs.mkdir(dirWithSpaces, { recursive: true });
      const target = path.join(dirWithSpaces, 'lektion-ovning.md');
      await fs.writeFile(target, 'content', 'utf-8');

      const result = await validatePathInWorkspace(target, ws.dir);
      expect(result.valid).toBe(true);
    });

    it('should handle very long path inside workspace', async () => {
      // Build a deep but valid path
      const segments = Array.from({ length: 20 }, (_, i) => `dir${i}`);
      const deepPath = path.join(ws.dir, ...segments, 'file.md');

      const result = await validatePathInWorkspace(deepPath, ws.dir);
      // The path is inside workspace (even if directories do not exist)
      expect(result.valid).toBe(true);
    });
  });

  // ============================================================================
  // NARROWING-ONLY: caller-supplied workspace cannot broaden the server lock
  // ============================================================================

  describe('narrowing-only — caller workspace cannot broaden server workspace', () => {
    it('rejects caller workspace OUTSIDE server workspace (broadening attempt)', async () => {
      // Server is locked to ws.dir; caller tries to broaden by passing /tmp
      const outside = '/tmp';
      const result = await validatePathInWorkspace('/tmp/anywhere.txt', outside);

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.error!.toLowerCase()).toContain('outside the server workspace');
    });

    it('rejects sibling-directory broadening attempt', async () => {
      // ws.dir is e.g. /tmp/.../workspace-sec-xxx/. A caller workspace of
      // /tmp/.../workspace-sec-xxx-2/ is a sibling, not inside.
      const sibling = ws.dir + '-sibling';
      const result = await validatePathInWorkspace(path.join(sibling, 'a.txt'), sibling);

      expect(result.valid).toBe(false);
      expect(result.error!.toLowerCase()).toContain('outside the server workspace');
    });

    it('accepts caller workspace INSIDE server workspace (legitimate narrowing)', async () => {
      const courseDir = path.join(ws.dir, 'Biologi', 'KURS201_2026_v3');
      await fs.mkdir(courseDir, { recursive: true });
      const target = path.join(courseDir, 'lesson.md');

      const result = await validatePathInWorkspace(target, courseDir);
      expect(result.valid).toBe(true);
    });

    it('accepts caller workspace equal to server workspace', async () => {
      const target = path.join(ws.dir, 'top-level.md');
      const result = await validatePathInWorkspace(target, ws.dir);
      expect(result.valid).toBe(true);
    });

    it('uses server workspace when caller omits the workspace argument', async () => {
      const target = path.join(ws.dir, 'no-caller-ws.md');
      const result = await validatePathInWorkspace(target);
      expect(result.valid).toBe(true);
    });

    it('still rejects file_path outside even when caller workspace is valid (narrowing)', async () => {
      const courseDir = path.join(ws.dir, 'Biologi', 'KURS201_2026_v3');
      await fs.mkdir(courseDir, { recursive: true });
      // Caller workspace is the course folder; file_path is outside the
      // course folder (but still inside the server workspace).
      const outsideCourse = path.join(ws.dir, 'OtherCourse', 'lesson.md');
      await fs.mkdir(path.dirname(outsideCourse), { recursive: true });

      const result = await validatePathInWorkspace(outsideCourse, courseDir);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Path is outside the allowed workspace');
    });
  });
});
