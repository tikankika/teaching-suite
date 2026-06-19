import { describe, it, expect } from 'vitest';
import {
  CONTENT_TYPE_DIRECTORIES,
  workspaceRootDirectories,
} from '../src/utils/content-types.js';
import { ContentTypeEnum, suggestDirectory } from '../src/tools/composite/intelligent-save.js';
import { FindContextInputSchema, SEARCH_DIRS } from '../src/tools/mechanical/find-context.js';

// The shared content-type registry is the single source of truth for directory
// routing. These tests pin that contract: every content type is described, and
// every type find_context can search is actually scanned where it is written.

describe('content-type registry', () => {
  it('has a directory entry for every ContentType in intelligent_save', () => {
    const missing = ContentTypeEnum.options.filter((t) => !CONTENT_TYPE_DIRECTORIES[t]);
    expect(missing).toEqual([]);
  });

  it('drives suggestDirectory (registry path = suggested directory)', () => {
    // Spot-check a course type and a workspace-root type route from the registry.
    expect(suggestDirectory('idea')).toBe(CONTENT_TYPE_DIRECTORIES.idea.directory);
    expect(suggestDirectory('reflection')).toBe(CONTENT_TYPE_DIRECTORIES.reflection.directory);
    expect(CONTENT_TYPE_DIRECTORIES.term_reflection.scope).toBe('workspace_root');
    expect(CONTENT_TYPE_DIRECTORIES.manifest.scope).toBe('workspace_root');
  });

  it('drift guard: find_context scans the directory every searchable type is written to', () => {
    const searchable = FindContextInputSchema.shape.content_types.element.options as string[];
    const searchSet = new Set(SEARCH_DIRS);

    const unscanned: string[] = [];
    for (const type of searchable) {
      const entry = CONTENT_TYPE_DIRECTORIES[type];
      if (!entry) continue; // 'other' etc. — covered by the completeness test
      // Registry dirs carry a trailing slash; SEARCH_DIRS entries do not.
      const dirs = [entry.directory, entry.courseV2Directory].filter(Boolean) as string[];
      for (const dir of dirs) {
        const normalised = dir.replace(/\/$/, '');
        if (!searchSet.has(normalised)) unscanned.push(`${type} -> ${dir}`);
      }
    }

    // If this fails, a content type is written somewhere find_context never
    // looks (the Profession/Termin class of bug). Add the directory to
    // SEARCH_DIRS + DIR_TYPE_MAP, or fix the registry.
    expect(unscanned).toEqual([]);
  });

  it('exposes workspace-root directories driven by scope (manifest, term_reflection)', () => {
    // 3b: init_profession and find_context derive their Profession/* dirs from
    // this, rather than hardcoding their own lists.
    const types = Object.entries(CONTENT_TYPE_DIRECTORIES)
      .filter(([, d]) => d.scope === 'workspace_root')
      .map(([t]) => t)
      .sort();
    expect(types).toEqual(['manifest', 'term_reflection']);
    expect(workspaceRootDirectories().sort()).toEqual([
      'Profession/Manifest',
      'Profession/Termin',
    ]);
  });
});
