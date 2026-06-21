import { describe, it, expect } from 'vitest';
import {
  CONTENT_TYPE_DIRECTORIES,
  workspaceRootDirectories,
} from '../src/utils/content-types.js';
import { ContentTypeEnum, suggestDirectory } from '../src/tools/composite/intelligent-save.js';
import { FindContextInputSchema, SEARCH_DIRS, RECURSIVE_SEARCH_DIRS } from '../src/tools/mechanical/find-context.js';

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

  it('3c: find_context searchable types == the registry (no 27/20 divergence)', () => {
    // The whole point of unifying the enums: every type intelligent_save can
    // write is a type find_context can search. Deriving find_context's enum
    // from the registry makes this true by construction; this test pins it so
    // a future re-hardcoded list cannot silently reintroduce the gap.
    const searchable = (FindContextInputSchema.shape.content_types.element.options as string[])
      .slice()
      .sort();
    const registry = Object.keys(CONTENT_TYPE_DIRECTORIES).slice().sort();
    expect(searchable).toEqual(registry);
  });

  it('drift guard: find_context scans the directory every searchable type is written to', () => {
    const searchable = FindContextInputSchema.shape.content_types.element.options as string[];
    const searchSet = new Set(SEARCH_DIRS);

    // A registry dir is covered if it is in SEARCH_DIRS directly, or if it sits
    // under a recursive root (which walks the whole subtree — e.g. Material/
    // covers Material/Student_Summaries).
    const isCovered = (normalised: string): boolean =>
      searchSet.has(normalised) ||
      RECURSIVE_SEARCH_DIRS.some((root) => normalised === root || normalised.startsWith(`${root}/`));

    const unscanned: string[] = [];
    for (const type of searchable) {
      const entry = CONTENT_TYPE_DIRECTORIES[type];
      if (!entry) continue; // 'other' etc. — covered by the completeness test
      // Registry dirs carry a trailing slash; SEARCH_DIRS entries do not.
      const dirs = [entry.directory, entry.courseV2Directory].filter(Boolean) as string[];
      for (const dir of dirs) {
        const normalised = dir.replace(/\/$/, '');
        if (!isCovered(normalised)) unscanned.push(`${type} -> ${dir}`);
      }
    }

    // If this fails, a content type is written somewhere find_context never
    // looks (the Profession/Termin class of bug). Add the directory to
    // SEARCH_DIRS + DIR_TYPE_MAP, or fix the registry.
    expect(unscanned).toEqual([]);
  });

  it('no SEARCH_DIRS entry overlaps a recursive root (so files are never scanned twice)', () => {
    // find_context drops per-path de-duplication on the assumption that search
    // dirs are non-overlapping. This pins that invariant: a recursive root walks
    // its whole subtree, so no other SEARCH_DIRS entry may equal it or sit under
    // it — otherwise that subtree would be collected twice (duplicate results,
    // and the per-type max_results cap consumed by dupes).
    const overlaps: string[] = [];
    for (const root of RECURSIVE_SEARCH_DIRS) {
      const occurrences = SEARCH_DIRS.filter((d) => d === root).length;
      if (occurrences !== 1) overlaps.push(`${root} appears ${occurrences}× in SEARCH_DIRS (expected 1)`);
      for (const dir of SEARCH_DIRS) {
        if (dir !== root && dir.startsWith(`${root}/`)) {
          overlaps.push(`${dir} is nested under recursive root ${root}`);
        }
      }
    }
    expect(overlaps).toEqual([]);
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
