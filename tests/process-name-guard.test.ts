import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { LoadMethodologyInputSchema } from '../src/tools/mechanical/load-methodology.js';

// Process-name guard — a one-directional drift assertion: docs ⊆ enum.
//
// load_methodology's z.enum is the source of truth for which methodology
// processes a teacher can invoke. The public docs send teachers to those
// processes by name. If a name is renamed or removed in the enum but not in
// the docs, nothing fails loudly — yet the next teacher who follows a
// published doc gets a "no" from the tool on a name we ourselves published.
// This is the documentation-side twin of the term_reflection regression
// (saved but unsearchable). The guard turns the human "did I check the four
// guide names against the enum?" discipline (commit abdabf3) into CI.
//
// Direction matters: docs ⊆ enum, NOT enum == docs. The guide deliberately
// documents only the common processes while the system has more (the full
// lesson/course/profession cycles). We catch *dead references*, not
// "undocumented processes". Per the SHAPE (2026-06-19), this batch is the
// dead-reference check only; an orphan-process lint (a methodology file with
// no enum entry) is explicitly out of scope.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

/** Recursively collect repo-relative paths of every .md file under a directory. */
function collectMarkdown(absDir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) out.push(...collectMarkdown(abs));
    else if (entry.name.endsWith('.md')) out.push(path.relative(REPO_ROOT, abs));
  }
  return out;
}

// The reader set: the public docs that send a teacher to a process by name.
// Per the SHAPE §4 amendment (2026-06-21), this is the two root docs plus the
// WHOLE methodology/ tree — not just bridges/. The cycle docs (lesson/, course/,
// profession/) and synlighetsprincip.md also carry load_methodology('...') calls
// with the drift-prone bridge/cycle names, so a hand-held file list was itself a
// vocabulary that could drift. Globbing methodology/ closes that meta-hole
// structurally; extractCallNames matches only the load_methodology(...) shape, so
// widening the file set adds no false positives. Scoped to methodology/ (+ the two
// root docs) so test fixtures and node_modules are never pulled in.
const READER_SET: string[] = [
  'README.md',
  'docs/TEACHER_GUIDE.md',
  ...collectMarkdown(path.join(REPO_ROOT, 'methodology')),
];

const ENUM = new Set(LoadMethodologyInputSchema.shape.process.options as string[]);

/**
 * Source (a): process names passed to load_methodology(...).
 * Handles the three call shapes that occur in the docs:
 *   load_methodology(pre_lesson_planning)            — bare
 *   load_methodology('manifest')                     — quoted
 *   load_methodology(process: "pre_lesson_planning") — keyword + quoted
 */
function extractCallNames(text: string): string[] {
  const re = /load_methodology\(\s*(?:process:\s*)?['"]?([a-z][a-z0-9_]*)['"]?/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) names.push(m[1]);
  return names;
}

/**
 * Source (b): the first column of the methodology table whose header is
 * `| Process | ... |`. course_assessment lives ONLY here (never in a call),
 * so a guard that reads calls alone would miss it. We anchor strictly on this
 * header and read only the first-cell backtick token — we do NOT sweep every
 * backtick token in the file, which would catch tool names (intelligent_save,
 * find_context) that are not processes.
 */
function extractProcessTableNames(text: string): string[] {
  const names: string[] = [];
  let inTable = false;
  for (const line of text.split('\n')) {
    if (/^\s*\|\s*Process\s*\|/i.test(line)) {
      inTable = true; // header row — skip it, rows follow
      continue;
    }
    if (!inTable) continue;
    if (/^\s*\|\s*:?-+/.test(line)) continue; // separator row
    if (!/^\s*\|/.test(line)) {
      inTable = false; // table ended
      continue;
    }
    const firstCell = line.split('|')[1] ?? '';
    const m = firstCell.match(/`([a-z][a-z0-9_]*)`/);
    if (m) names.push(m[1]);
  }
  return names;
}

interface Reference {
  name: string;
  file: string;
}

const references: Reference[] = [];
for (const rel of READER_SET) {
  const text = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf-8');
  for (const n of extractCallNames(text)) references.push({ name: n, file: rel });
  for (const n of extractProcessTableNames(text)) references.push({ name: n, file: rel });
}

describe('process-name guard (docs ⊆ load_methodology enum)', () => {
  it('extracts process references from the reader set (no silent empty scan)', () => {
    // A regex drift that captured nothing would make the guard pass vacuously.
    expect(references.length).toBeGreaterThan(0);
    // course_assessment is only in the methodology table, never in a call —
    // pin that source (b) is actually parsed.
    expect(references.some((r) => r.name === 'course_assessment')).toBe(true);
    // pre_lesson_planning appears only in a call — pin that source (a) works.
    expect(references.some((r) => r.name === 'pre_lesson_planning')).toBe(true);
  });

  it('every process name referenced in docs exists in the enum', () => {
    const dead = references.filter((r) => !ENUM.has(r.name));
    expect(dead).toEqual([]);
  });
});
