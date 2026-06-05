/**
 * project_init — Create project structure and copy methodology docs.
 *
 * Mechanical tool: creates folders, copies files, writes state.
 * Zero domain knowledge.
 *
 * Ensures the central v3 methodology tree exists at the workspace root
 * (<workspace>/Teaching_Suite/methodology/), shared across all courses.
 */

import { z } from 'zod';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { validatePathInWorkspace, getServerWorkspace } from '../core/workspace.js';
import { initialiseProcessLog } from '../../utils/process-log.js';

// ============================================================================
// RESOLVE METHODOLOGY PATHS
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// v3 methodology root (course init copies the whole tree).
const V3_METHODOLOGY_SOURCE = path.resolve(__dirname, '../../../methodology');

// Path to package.json — used to read the running MCP server's version
// when populating the central methodology version metadata.
const PACKAGE_JSON_PATH = path.resolve(__dirname, '../../../package.json');

// Subfolders within v3 methodology to copy at init time.
const V3_METHODOLOGY_SUBFOLDERS = [
  'lesson',
  'course',
  'profession',
  'bridges',
  'reflection_frameworks',
] as const;
const V3_METHODOLOGY_TOP_FILES = [
  'README.md',
  'shared_principles.md',
  'synlighetsprincip.md',
  'tensions.md',
  'pedagogisk_arkitektur.md',
] as const;

// ============================================================================
// SCHEMA
// ============================================================================

export const ProjectInitInputSchema = z.object({
  project_path: z.string().min(1).describe('Path to project folder'),
  name: z.string().optional().describe('Project name'),
  type: z
    .literal('course')
    .default('course')
    .describe('Project type. Only "course" is supported; defaults to "course" when omitted.'),
  course: z.string().optional().describe('Course identifier'),
  force_update: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'When true and the local central methodology version differs from the running MCP server, back up the existing Teaching_Suite/methodology/ folder to Teaching_Suite/methodology.backup-<ISO-timestamp>/ and overwrite with the repo version. Default false (caller is asked instead of overwriting).',
    ),
});

// ============================================================================
// TYPES
// ============================================================================

interface ProjectState {
  name: string;
  type?: string;
  course?: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  created: string;
  updated: string;
  methodology_version: string;
  methodology_copied: boolean;
  current_phase?: string;
  notes?: string;
}

interface MethodologyDocInfo {
  filename: string;
  description: string;
}

/**
 * Reports the location and state of the central methodology after project_init.
 * Lets the caller (Cowork) tell the teacher *where* methodology lives — without
 * this, callers would only see the file list and might wrongly assume the
 * docs landed inside the course folder. The path is workspace-root-level
 * (`<workspace>/Teaching_Suite/methodology/`), shared by all courses.
 */
export interface CentralMethodologyInfo {
  action: 'created' | 'unchanged' | 'update_available' | 'local_ahead' | 'updated' | 'failed';
  path: string;
  version?: string;
  message: string;
  /**
   * Set when force_update triggered an overwrite. Points to the timestamped
   * backup of the previous methodology so the teacher can review/merge edits.
   */
  backup_path?: string;
}

export interface ProjectInitOutput {
  success: boolean;
  project_path: string;
  folders_created: string[];
  methodology_docs: MethodologyDocInfo[];
  /**
   * For course / course_v2 projects: where the central methodology now lives
   * and what action ensureCentralMethodology took. Surface `path` to the
   * teacher so they understand methodology is at the workspace root, not
   * inside the course folder.
   */
  central_methodology?: CentralMethodologyInfo;
  project_state: string;
  warnings?: string[];
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// v3 workspace structure (2026-05-05) — derived from actual v3 course
// usage + v3 methodology design. English umbrellas (Reflections, Lesson_Plans,
// Material, Analysis, Planning), Swedish nested folders (Transkript, Klart,
// Resurser, etc.). See docs/decisions/ for design rationale.
//
// Profession/Manifest/ and Profession/Termin/ deliberately NOT created here —
// they are workspace-root concepts, created by init_profession tool.
const COURSE_V2_FOLDERS = [
  '_config',
  '_system/logs',
  'Reflections',
  'Reflections/Bryggor',
  'Lesson_Plans',
  'Ideas',
  'Decisions',
  'Memos',
  'Planning',
  'Analysis',
  'Data/Transkript',
  'Data/Labbdata',
  'Data/Elevreflektioner',
  'Data/Teacher_Insights',
  'Styrdokument',
  'Styrdokument/Tolkning',
  'Material/WIP',
  'Material/Klart/Presentationer',
  'Material/Klart/Övningar',
  'Material/Klart/Övrigt',
  'Material/Resurser',
  'Material/Uppgifter',
  'Material/Sammanfattningar',
  'Exams/Formativa',
  'Exams/Summativa',
  'Student_Materials',
  'activity_logs',
];

const TEACHING_CYCLE_DESCRIPTIONS: Record<string, string> = {
  '00_shared_principles.md': 'Shared principles: reflective practice, evidence-based, student-centered',
  '01_context_gathering.md': 'Context: search strategy, 3+5 problem, structured retrieval',
  '02_pre_lesson_planning.md': 'Lesson planning: 7-phase process, default structures, timing',
  '03_post_lesson_reflection.md': 'Post-lesson: 4-phase reflection, transcript analysis, insights',
  '04_lesson_metadata.md': 'Metadata: YAML spec, tags, wikilinks, search strategies',
  '05_pedagogical_foundation.md': 'Reference: theoretical grounding (Schön, Kolb, Hattie)',
};

// ============================================================================
// HELPERS
// ============================================================================

async function copyMethodologyFolder(
  source: string,
  dest: string
): Promise<MethodologyDocInfo[]> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(source);
  const mdFiles = entries.filter(f => f.endsWith('.md')).sort();
  const docs: MethodologyDocInfo[] = [];

  for (const filename of mdFiles) {
    const src = path.join(source, filename);
    const dst = path.join(dest, filename);
    await fs.copyFile(src, dst);
    docs.push({
      filename,
      description: TEACHING_CYCLE_DESCRIPTIONS[filename] || filename,
    });
  }

  return docs;
}

/**
 * Read the running MCP server's version from package.json.
 * Used when writing methodology version metadata.
 */
async function getMcpServerVersion(): Promise<string> {
  try {
    const raw = await fs.readFile(PACKAGE_JSON_PATH, 'utf-8');
    const pkg = JSON.parse(raw) as { version: string };
    return pkg.version;
  } catch {
    return 'unknown';
  }
}

interface MethodologyVersionMeta {
  version: string;
  copied_at: string;
  from: string;
}

interface CentralMethodologyResult {
  action: 'created' | 'unchanged' | 'update_available' | 'local_ahead' | 'updated' | 'failed';
  path: string;
  local_version?: string;
  repo_version?: string;
  /** Human-readable message for the caller (Cowork) to surface to the teacher. */
  message: string;
  docs?: MethodologyDocInfo[];
  /** Set when force_update triggered an overwrite — backup of previous tree. */
  backup_path?: string;
  error?: string;
}

/**
 * Ensure the workspace-root central methodology exists at
 * <workspace_root>/Teaching_Suite/methodology/.
 *
 * Synlighetsprincipen-grounded: methodology is data the teacher must be able
 * to see, edit, audit. Hiding it inside per-course `_system/methodology/`
 * (PR #59) or in the MCP install dir is the same kind of mistake we fixed
 * with SYSTEM_INSTRUCTIONS do-what-rules. Centralisation gives:
 *   - stable location independent of install method
 *   - visible in Finder / Obsidian
 *   - editable by the teacher
 *   - synced + version-controlled by Nextcloud
 *
 * Behaviour:
 *   - If `Teaching_Suite/methodology/` is missing: copy from repo, write version
 *     metadata, return action='created'.
 *   - If it exists: compare local _meta/methodology_version.json to running
 *     MCP server version. Return 'unchanged' / 'update_available' /
 *     'local_ahead'. The caller (Cowork) decides whether to surface a prompt.
 *   - This function never overwrites without explicit confirmation — local
 *     edits are preserved.
 */
async function ensureCentralMethodology(
  workspace_root: string,
  force_update: boolean = false,
): Promise<CentralMethodologyResult> {
  const teachingSuiteRoot = path.join(workspace_root, 'Teaching_Suite');
  const methodologyDir = path.join(teachingSuiteRoot, 'methodology');
  const metaDir = path.join(teachingSuiteRoot, '_meta');
  const versionFile = path.join(metaDir, 'methodology_version.json');

  const repoVersion = await getMcpServerVersion();

  // Check if methodology already exists at the central location.
  let exists = false;
  try {
    const stat = await fs.stat(methodologyDir);
    exists = stat.isDirectory();
  } catch {
    // doesn't exist — fall through to creation
  }

  if (!exists) {
    // First-time setup — copy from repo and write version metadata.
    try {
      const docs = await copyV3Methodology(methodologyDir);
      await fs.mkdir(metaDir, { recursive: true });
      const meta: MethodologyVersionMeta = {
        version: repoVersion,
        copied_at: new Date().toISOString(),
        from: `Teaching Suite-repo@v${repoVersion}`,
      };
      await fs.writeFile(versionFile, JSON.stringify(meta, null, 2), 'utf-8');
      return {
        action: 'created',
        path: methodologyDir,
        repo_version: repoVersion,
        message: `Central methodology created at ${teachingSuiteRoot} (version ${repoVersion}).`,
        docs,
      };
    } catch (err) {
      return {
        action: 'failed',
        path: methodologyDir,
        message: 'Failed to create central methodology.',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Already exists — read version metadata and compare to repo.
  let localMeta: MethodologyVersionMeta | undefined;
  try {
    const raw = await fs.readFile(versionFile, 'utf-8');
    localMeta = JSON.parse(raw) as MethodologyVersionMeta;
  } catch {
    // No version file — treat as unknown (probably hand-created or pre-v0.6).
    localMeta = undefined;
  }

  if (!localMeta) {
    return {
      action: 'unchanged',
      path: methodologyDir,
      repo_version: repoVersion,
      message: `Central methodology exists at ${teachingSuiteRoot} but has no version metadata. Treating as local copy; no changes made.`,
    };
  }

  // Simple lexicographic version compare (semver-like x.y.z works for our 0.x range).
  // For more rigorous handling we'd pull in semver, but our version range is small.
  if (localMeta.version === repoVersion) {
    return {
      action: 'unchanged',
      path: methodologyDir,
      local_version: localMeta.version,
      repo_version: repoVersion,
      message: `Central methodology up-to-date (version ${localMeta.version}).`,
    };
  }

  // Versions differ — surface to caller. We don't choose; Cowork asks the teacher.
  const localParts = localMeta.version.split('.').map(Number);
  const repoParts = repoVersion.split('.').map(Number);
  const localIsLower =
    localParts[0] < repoParts[0] ||
    (localParts[0] === repoParts[0] && localParts[1] < repoParts[1]) ||
    (localParts[0] === repoParts[0] && localParts[1] === repoParts[1] && localParts[2] < repoParts[2]);

  if (localIsLower) {
    if (!force_update) {
      return {
        action: 'update_available',
        path: methodologyDir,
        local_version: localMeta.version,
        repo_version: repoVersion,
        message: `Central methodology is at v${localMeta.version}; the running MCP server ships v${repoVersion}. Re-run project_init with force_update=true to overwrite (a backup will be made), or keep local edits as-is.`,
      };
    }

    // force_update=true + local is older — back up and overwrite.
    const backupTimestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .replace('Z', 'Z');
    const backupPath = path.join(teachingSuiteRoot, `methodology.backup-${backupTimestamp}`);
    try {
      // Atomic rename — old folder becomes the backup, then fresh copy goes
      // into the original location. If the copy fails, the backup remains;
      // caller can rename it back manually.
      await fs.rename(methodologyDir, backupPath);
      const docs = await copyV3Methodology(methodologyDir);
      const meta: MethodologyVersionMeta = {
        version: repoVersion,
        copied_at: new Date().toISOString(),
        from: `Teaching Suite-repo@v${repoVersion}`,
      };
      await fs.writeFile(versionFile, JSON.stringify(meta, null, 2), 'utf-8');
      return {
        action: 'updated',
        path: methodologyDir,
        local_version: localMeta.version,
        repo_version: repoVersion,
        backup_path: backupPath,
        message: `Central methodology updated v${localMeta.version} → v${repoVersion}. Previous version backed up to ${backupPath} — review for any local edits and merge by hand if needed.`,
        docs,
      };
    } catch (err) {
      return {
        action: 'failed',
        path: methodologyDir,
        local_version: localMeta.version,
        repo_version: repoVersion,
        message: 'Force-update failed during backup or copy.',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return {
    action: 'local_ahead',
    path: methodologyDir,
    local_version: localMeta.version,
    repo_version: repoVersion,
    message: `Central methodology v${localMeta.version} is newer than running MCP v${repoVersion}. No changes made — local edits preserved.`,
  };
}

/**
 * Copy v3 methodology tree (lesson/, course/, profession/, bridges/,
 * reflection_frameworks/, plus top-level docs — including shared_principles.md)
 * into <dest>/. Used by ensureCentralMethodology() to populate the central
 * workspace-root location.
 */
async function copyV3Methodology(dest: string): Promise<MethodologyDocInfo[]> {
  const allDocs: MethodologyDocInfo[] = [];

  // Top-level files (synlighetsprincip.md, tensions.md, README.md, etc.)
  await fs.mkdir(dest, { recursive: true });
  for (const filename of V3_METHODOLOGY_TOP_FILES) {
    const src = path.join(V3_METHODOLOGY_SOURCE, filename);
    const dst = path.join(dest, filename);
    try {
      await fs.copyFile(src, dst);
      allDocs.push({ filename, description: filename });
    } catch {
      // Non-fatal: top-level file missing in source — skip
    }
  }

  // Subfolders (lesson/, course/, profession/, bridges/, reflection_frameworks/)
  for (const sub of V3_METHODOLOGY_SUBFOLDERS) {
    const src = path.join(V3_METHODOLOGY_SOURCE, sub);
    const dst = path.join(dest, sub);
    try {
      const docs = await copyMethodologyFolder(src, dst);
      allDocs.push(...docs.map(d => ({ ...d, filename: `${sub}/${d.filename}` })));
    } catch {
      // Non-fatal: subfolder missing — skip
    }
  }

  return allDocs;
}

// ============================================================================
// TEMPLATES (course type)
// ============================================================================

function generateCourseV2Context(courseName: string, courseId: string, date: string): string {
  return `---
type: course_context
course_instance: ${courseId}
created: ${date}
metadata_version: "1.0"
---

# Kurskontext — ${courseName}

## Mission
[Kursens övergripande syfte]

## Goals
- G1: [Kursmål 1]
- G2: [Kursmål 2]

## Learning Objectives
- LO1: [Lärandemål 1]
- LO2: [Lärandemål 2]

## Challenges
- C1: [Utmaning 1]

## Journal
- ${date.split('T')[0]}: Projekt initierat.
`;
}

function generateCourseV2ClaudeMd(courseId: string): string {
  return `# CLAUDE.md — ${courseId}

## Methodology v3 — three nested cycles

This workspace operates inside the lesson cycle of Teaching Suite v3.0:
\`\`\`
PROFESSION  →  COURSE  →  LESSON
(term–year)  (week–month)  (hours–days)
\`\`\`

Manifest and term-reflection are workspace-root concepts (above the
course). The course folder hosts lesson and course cycle work.
See \`methodology/pedagogisk_arkitektur.md\` and
\`methodology/README.md\` in the Teaching Suite repo.

## Workflow
- At session start: run \`context_load\` to get course context and carry-forward
- After a lesson (with transcript): \`load_methodology('post_lesson_auto')\`
  — deterministic pipeline (A1 Content + A2 Recap + Auto-log, all drafts)
- For guided post-lesson reflection: \`load_methodology('post_lesson_reflection')\`
  — Rolfe / Gibbs cadens, Klafki + Black & Wiliam grounded
- For lesson planning: \`load_methodology('pre_lesson_planning')\`
  — Klafki didaktisk analys + Wiggins & McTighe (UbD) backward design
- For course assessment design: \`load_methodology('course_assessment')\`
- Save with metadata: course_instance, based_on, supports

## load_methodology returns a path (v0.5.0)
\`load_methodology(process)\` returns \`result.file.path\` — call \`file_read(path)\`
to get the content. \`shared_principles\` is no longer auto-bundled; load
explicitly via \`load_methodology('shared_principles')\` only when needed.

<!-- Course-specific rules emerge here during the course. -->
<!-- System rules are delivered automatically via MCP server instructions. -->
<!-- Deprecated: post_lesson_summary and student_summary — use post_lesson_auto instead. -->
`;
}

function generateOutputTargets(courseId: string): string {
  return `# Output targets — ${courseId}
# Defines which folders contain student-facing material
# and where they should be copied when status is 'ready'.
# The copy mechanism is external (Nextcloud sync, script, manual).

targets: {}
  # google_drive:
  #   base_path: "/path/to/google/drive/${courseId}/"
  #   folders:
  #     - source: Material/Presentationer
  #       destination: Presentationer
  #     - source: Material/Övningar
  #       destination: Övningar
  #     - source: Material/Elevsammanfattningar
  #       destination: Elevsammanfattningar
`;
}

// ============================================================================
// MAIN
// ============================================================================

export async function projectInit(input: unknown): Promise<ProjectInitOutput> {
  const parseResult = ProjectInitInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      project_path: '',
      folders_created: [],
      methodology_docs: [],
      project_state: '',
      error: `Invalid input: ${parseResult.error.message}`,
    };
  }

  const { project_path, name, type, course, force_update } = parseResult.data;

  // Validate path
  const pathValidation = await validatePathInWorkspace(project_path);
  if (!pathValidation.valid) {
    return {
      success: false,
      project_path,
      folders_created: [],
      methodology_docs: [],
      project_state: '',
      error: pathValidation.error || 'Path outside workspace',
    };
  }

  // Check workspace coverage
  const warnings: string[] = [];
  const serverWorkspace = getServerWorkspace();
  if (!serverWorkspace) {
    warnings.push('No --workspace configured on server. File tools (file_read, file_write, file_edit) will not work in this project. Restart teaching-suite with: --workspace <path>');
  } else {
    const resolvedProject = path.resolve(project_path);
    const wsWithSep = serverWorkspace.endsWith(path.sep) ? serverWorkspace : serverWorkspace + path.sep;
    if (!resolvedProject.startsWith(wsWithSep) && resolvedProject !== serverWorkspace) {
      warnings.push(`Project path "${resolvedProject}" is outside server workspace "${serverWorkspace}". File tools will reject operations in this project. Restart teaching-suite with a broader --workspace.`);
    }
  }

  try {
    const folders = COURSE_V2_FOLDERS;

    // 1. Create folder structure (parallel)
    await Promise.all(
      folders.map(folder => fs.mkdir(path.join(project_path, folder), { recursive: true }))
    );
    const uniqueFolders = [...new Set(folders.map(f => f.split('/')[0]))];

    // 2. Methodology setup: ensure CENTRAL methodology exists at
    //    <workspace_root>/Teaching_Suite/methodology/. Per-course copy
    //    removed in v0.6.0 — methodology is now a workspace-root concept,
    //    visible and editable by the teacher (Synlighetsprincipen-grounded).
    const allDocs: MethodologyDocInfo[] = [];
    let methodologyAction: CentralMethodologyResult | undefined;

    const serverWorkspaceForMethodology = getServerWorkspace();
    if (!serverWorkspaceForMethodology) {
      warnings.push(
        'No --workspace configured; cannot place central methodology at a workspace root. Methodology will not be available locally.',
      );
    } else {
      methodologyAction = await ensureCentralMethodology(
        serverWorkspaceForMethodology,
        force_update,
      );
      if (methodologyAction.docs) {
        allDocs.push(...methodologyAction.docs);
      }
      if (methodologyAction.action === 'failed') {
        warnings.push(`Central methodology setup failed: ${methodologyAction.error || 'unknown error'}`);
      } else if (methodologyAction.action === 'update_available') {
        warnings.push(methodologyAction.message);
      } else if (methodologyAction.action === 'updated') {
        // Surface the backup location prominently — the teacher needs to
        // review it for any local edits that should merge into the new copy.
        warnings.push(methodologyAction.message);
      }
    }

    // 3. Create project_state.json
    const now = new Date().toISOString();
    const projectState: ProjectState = {
      name: name || path.basename(project_path),
      type,
      course,
      status: 'planning',
      created: now,
      updated: now,
      methodology_version: '3.0',
      methodology_copied: true,
      current_phase: 'context_gathering',
    };

    // State files always in project root (source tools expect them here)
    const statePath = path.join(project_path, 'project_state.json');
    await fs.writeFile(statePath, JSON.stringify(projectState, null, 2), 'utf-8');

    // 4. Update sources.yaml — always in project root (source tools expect it here)
    const sourcesPath = path.join(project_path, 'sources.yaml');
    let sourcesData: Record<string, unknown> = {};

    try {
      const existing = await fs.readFile(sourcesPath, 'utf-8');
      sourcesData = (yaml.load(existing) as Record<string, unknown>) || {};
    } catch {
      // No existing file — start fresh
    }

    // Ensure project key exists (compatible with source_add/source_list)
    if (!sourcesData.project) {
      sourcesData.project = {
        name: name || path.basename(project_path),
        type,
        created: now,
        updated: now,
      };
    }

    // Ensure sources dict exists
    if (!sourcesData.sources) {
      sourcesData.sources = {};
    }

    // Store methodology metadata
    sourcesData._methodology = {
      source: 'teaching-suite v3.0',
      copied_at: now,
      docs: allDocs.filter(d => d.filename !== '_error').map(d => d.filename),
    };

    await fs.writeFile(sourcesPath, yaml.dump(sourcesData, { indent: 2, lineWidth: 120 }), 'utf-8');

    // 5. Initialise process log
    const courseId = course || path.basename(project_path);
    await initialiseProcessLog(project_path, courseId);

    // 6. Generate config templates in _config/ (v3 canonical, was _system/config/)
    const courseName = name || path.basename(project_path);
    const configDir = path.join(project_path, '_config');

    await fs.writeFile(
      path.join(configDir, 'course_context.md'),
      generateCourseV2Context(courseName, courseId, now),
      'utf-8'
    );
    // CLAUDE.md in project root (Desktop/Cowork reads it automatically)
    const claudeMdContent = generateCourseV2ClaudeMd(courseId);
    await fs.writeFile(
      path.join(project_path, 'CLAUDE.md'),
      claudeMdContent,
      'utf-8'
    );
    // Copy to _config/ (context_load reads it from here)
    await fs.writeFile(
      path.join(configDir, 'CLAUDE.md'),
      claudeMdContent,
      'utf-8'
    );
    await fs.writeFile(
      path.join(configDir, 'output_targets.yaml'),
      generateOutputTargets(courseId),
      'utf-8'
    );

    const central_methodology: CentralMethodologyInfo | undefined = methodologyAction
      ? {
          action: methodologyAction.action,
          path: methodologyAction.path,
          version: methodologyAction.local_version || methodologyAction.repo_version,
          message: methodologyAction.message,
          ...(methodologyAction.backup_path
            ? { backup_path: methodologyAction.backup_path }
            : {}),
        }
      : undefined;

    return {
      success: true,
      project_path,
      folders_created: uniqueFolders,
      methodology_docs: allDocs,
      ...(central_methodology ? { central_methodology } : {}),
      project_state: statePath,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err) {
    return {
      success: false,
      project_path,
      folders_created: [],
      methodology_docs: [],
      project_state: '',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
