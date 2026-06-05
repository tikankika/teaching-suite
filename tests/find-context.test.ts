import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { findContext } from '../src/tools/mechanical/find-context.js';
import { setServerWorkspace } from '../src/tools/core/workspace.js';

// ============================================================================
// TEST SETUP
// ============================================================================

let tmpDir: string;
let workspaceDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'teaching-suite-test-'));
  workspaceDir = tmpDir;
  setServerWorkspace(workspaceDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// Helper to create a markdown file with optional frontmatter
async function createMdFile(
  relativePath: string,
  frontmatter?: Record<string, unknown>,
  body?: string
): Promise<string> {
  const filePath = path.join(workspaceDir, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  let content = '';
  if (frontmatter) {
    const lines = Object.entries(frontmatter).map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.join(', ')}]`;
      return `${k}: ${v}`;
    });
    content = `---\n${lines.join('\n')}\n---\n`;
  }
  content += body || '';
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

// ============================================================================
// LEGACY STRUCTURE (backward compatibility)
// ============================================================================

describe('find_context — legacy flat structure', () => {
  it('finds reflections in Reflections/', async () => {
    await createMdFile('Reflections/2026-03-01.md', { type: 'reflection', title: 'Lektion om ekologi' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('reflection');
    expect(result.results[0].match_source).toBe('frontmatter');
  });

  it('finds lesson plans by directory fallback', async () => {
    await createMdFile('Lesson_Plans/plan-2026-03-05.md', {}, 'Some lesson plan without type');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['lesson_plan'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].match_source).toBe('directory');
  });

  it('filters by topic', async () => {
    await createMdFile('Reflections/r1.md', { type: 'reflection', title: 'Ekologi' });
    await createMdFile('Reflections/r2.md', { type: 'reflection', title: 'Genetik' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      topic: 'ekologi',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].title).toBe('Ekologi');
  });
});

// ============================================================================
// COURSE STRUCTURE (Input/Process/Output)
// ============================================================================

describe('find_context — course structure', () => {
  it('finds reflections in Process/Reflections/', async () => {
    await createMdFile('Process/Reflections/2026-03-10.md', {
      type: 'reflection',
      title: 'Post-lektion reflektion',
      course: 'KURS101_2026',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('reflection');
    expect(result.results[0].path).toContain('Process/Reflections');
  });

  it('finds lesson plans in Process/Lesson_Plans/', async () => {
    await createMdFile('Process/Lesson_Plans/lektion-ekologi.md', {
      type: 'lesson_plan',
      title: 'Ekologi lektion 3',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['lesson_plan'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('lesson_plan');
  });

  it('finds ideas in Process/Ideas/', async () => {
    await createMdFile('Process/Ideas/ny-laboration.md', {
      type: 'idea',
      title: 'Ny laboration om celldelning',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['idea'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('idea');
  });

  it('finds analysis in Process/Analysis/', async () => {
    await createMdFile('Process/Analysis/kursanalys.md', {
      type: 'analysis',
      title: 'Kursanalys HT2025',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['analysis'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('analysis');
  });

  it('finds transcript analysis in Input/Transkript/', async () => {
    await createMdFile('Input/Transkript/lektion-2026-03-12.md', {
      type: 'transcript_analysis',
      title: 'Transkript lektion 12 mars',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['transcript_analysis'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('transcript_analysis');
  });

  it('finds reports in Output/Reports/', async () => {
    await createMdFile('Output/Reports/terminsammanfattning.md', {
      type: 'documentation',
      title: 'Terminsammanfattning',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['documentation'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('documentation');
  });

  it('uses directory fallback for course folders without frontmatter type', async () => {
    await createMdFile('Process/Reflections/no-type.md', {}, 'A reflection without type field');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].match_source).toBe('directory');
    expect(result.results[0].canonical_type).toBe('reflection');
  });

  it('uses directory fallback for Input/Styrdokument/', async () => {
    await createMdFile('Input/Styrdokument/kursplan-bio2.md', {}, 'Kursplan utan type');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['course_plan'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].match_source).toBe('directory');
    expect(result.results[0].canonical_type).toBe('course_plan');
  });

  it('uses directory fallback for Input/Teacher_Insights/', async () => {
    await createMdFile('Input/Teacher_Insights/insights-march.md', {}, 'Insights from Assessment Suite');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['analysis'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].match_source).toBe('directory');
    expect(result.results[0].canonical_type).toBe('analysis');
  });
});

// ============================================================================
// BOTH STRUCTURES (backward compatibility)
// ============================================================================

describe('find_context — searches both structures', () => {
  it('finds reflections from both legacy and course folders', async () => {
    await createMdFile('Reflections/legacy.md', { type: 'reflection', title: 'Legacy reflection', date: '2026-03-01' });
    await createMdFile('Process/Reflections/course.md', { type: 'reflection', title: 'Course reflection', date: '2026-03-10' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(2);
    // Sorted by date descending
    expect(result.results[0].title).toBe('Course reflection');
    expect(result.results[1].title).toBe('Legacy reflection');
  });

  it('respects max_results across both structures', async () => {
    // Create 3 in legacy + 3 in course
    for (let i = 1; i <= 3; i++) {
      await createMdFile(`Reflections/r${i}.md`, { type: 'reflection', title: `Legacy ${i}`, date: `2026-03-0${i}` });
      await createMdFile(`Process/Reflections/r${i}.md`, { type: 'reflection', title: `Course ${i}`, date: `2026-03-1${i}` });
    }

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      max_results: 4,
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(4);
    expect(result.total_found).toBe(6);
  });
});

// ============================================================================
// RFC-014: TIER 2 FIELD SEARCH
// ============================================================================

describe('find_context — supports and framework filters (RFC-014)', () => {
  it('filters by supports code', async () => {
    await createMdFile('Reflections/r1.md', { type: 'reflection', title: 'Ekologi', supports: '[G1, LO3]' });
    await createMdFile('Reflections/r2.md', { type: 'reflection', title: 'Genetik', supports: '[G2]' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      supports: 'G1',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].title).toBe('Ekologi');
  });

  it('filters by framework', async () => {
    await createMdFile('Reflections/r1.md', { type: 'reflection', title: 'Gibbs reflection', framework: 'gibbs' });
    await createMdFile('Reflections/r2.md', { type: 'reflection', title: 'Kolb reflection', framework: 'kolb' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      framework: 'gibbs',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].title).toBe('Gibbs reflection');
  });

  it('extracts Tier 2 fields in results', async () => {
    await createMdFile('Lesson_Plans/lp1.md', {
      type: 'lesson_plan',
      title: 'Vaccination',
      supports: '[LO13, LO15]',
      framework: 'constructive_alignment',
      status: 'active',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['lesson_plan'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].supports).toEqual(['LO13', 'LO15']);
    expect(result.results[0].framework).toBe('constructive_alignment');
    expect(result.results[0].status).toBe('active');
  });
});

// ============================================================================
// VALIDATION
// ============================================================================

describe('find_context — validation', () => {
  it('rejects path outside workspace', async () => {
    const result = await findContext({
      workspace: '/tmp/outside-workspace',
      content_types: ['reflection'],
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('outside the allowed workspace');
  });

  it('returns empty results for non-existent directories', async () => {
    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(0);
  });
});

// ============================================================================
// V3 CYCLE OUTPUTS (Wave A — added after PR #31 workspace structure)
// ============================================================================

describe('find_context — v3 cycle outputs', () => {
  it('finds bridge_intention in Reflections/Bryggor/ via directory fallback', async () => {
    await createMdFile('Reflections/Bryggor/2026-04-15-brygga-fotosyntes.md', {}, 'Bridge intention without frontmatter');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['bridge_intention'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('bridge_intention');
    expect(result.results[0].match_source).toBe('directory');
  });

  it('finds term_reflection in Reflections/Term/ by frontmatter type', async () => {
    await createMdFile('Reflections/Term/HT26_terminsreflektion.md', {
      type: 'term_reflection',
      title: 'HT26 — Brookfield 4 lenser',
    });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['term_reflection'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('term_reflection');
    expect(result.results[0].match_source).toBe('frontmatter');
  });

  it('finds manifest in Profession/Manifest/ via directory fallback', async () => {
    await createMdFile('Profession/Manifest/manifest_v1_2026-04-29.md', {}, '# Pedagogisk manifest v1');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['manifest'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('manifest');
  });

  it('finds pre_course_context_report in Planning/ by filename pattern', async () => {
    await createMdFile('Planning/KURS101_2026_pre_kurs.md', {}, '# Pre-kurs rapport');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['pre_course_context_report'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('pre_course_context_report');
    expect(result.results[0].match_source).toBe('filename');
  });

  it('finds course_evaluation by filename pattern in Analysis/', async () => {
    await createMdFile('Analysis/KURS101_2026_evaluation.md', {}, '# Kursutvärdering');

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['course_evaluation'],
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].canonical_type).toBe('course_evaluation');
  });
});

// ============================================================================
// BRIDGE METHODOLOGY FILTER: since (PR-δ-a-2)
// ============================================================================

describe('find_context — since filter (bridge methodology)', () => {
  it('excludes files older than `since`', async () => {
    await createMdFile('Reflections/old.md', { type: 'reflection', title: 'Old', date: '2026-01-15' });
    await createMdFile('Reflections/new.md', { type: 'reflection', title: 'New', date: '2026-04-15' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      since: '2026-04-01',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].title).toBe('New');
  });

  it('keeps files at-or-after `since` (inclusive)', async () => {
    await createMdFile('Reflections/exact.md', { type: 'reflection', title: 'Exact', date: '2026-04-01' });
    await createMdFile('Reflections/later.md', { type: 'reflection', title: 'Later', date: '2026-04-15' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      since: '2026-04-01',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(2);
  });

  it('keeps files without dated frontmatter (do not exclude on missing date)', async () => {
    await createMdFile('Reflections/dated.md', { type: 'reflection', title: 'Dated', date: '2026-04-15' });
    await createMdFile('Reflections/undated.md', { type: 'reflection', title: 'Undated' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      since: '2026-04-01',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(2);
    expect(result.results.map(r => r.title).sort()).toEqual(['Dated', 'Undated']);
  });

  it('combines with topic filter (AND semantics)', async () => {
    await createMdFile('Reflections/r1.md', { type: 'reflection', title: 'Ekologi old', date: '2026-01-15' });
    await createMdFile('Reflections/r2.md', { type: 'reflection', title: 'Genetik old', date: '2026-01-15' });
    await createMdFile('Reflections/r3.md', { type: 'reflection', title: 'Ekologi new', date: '2026-04-15' });

    const result = await findContext({
      workspace: workspaceDir,
      content_types: ['reflection'],
      topic: 'ekologi',
      since: '2026-04-01',
    });

    expect(result.success).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].title).toBe('Ekologi new');
  });
});
