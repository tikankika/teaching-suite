#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Core tool imports
import {
  fileRead,
  FileReadInputSchema,
  fileWrite,
  FileWriteInputSchema,
  fileEdit,
  FileEditInputSchema,
  fileSearch,
  FileSearchInputSchema,
  setServerWorkspace,
} from './tools/core/index.js';

// Composite tool imports
import { captureSession, CaptureSessionInputSchema } from './tools/composite/capture-session.js';
import {
  formatCapturedSession,
  FormatCapturedSessionInputSchema,
} from './tools/composite/format-captured-session.js';
import { quickSaveSession, QuickSaveSessionInputSchema } from './tools/composite/quick-save-session.js';
import { intelligentSave, IntelligentSaveInputSchema } from './tools/composite/intelligent-save.js';
import { captureIdea, CaptureIdeaInputSchema } from './tools/composite/capture-idea.js';
import { logProcessEvent, LogProcessEventInputSchema } from './tools/composite/log-process-event.js';

// Setup tool imports
import { projectInit, ProjectInitInputSchema } from './tools/setup/project-init.js';
import { initProfession, InitProfessionInputSchema } from './tools/setup/init-profession.js';

// Mechanical tool imports
import { loadMethodology, LoadMethodologyInputSchema } from './tools/mechanical/load-methodology.js';
import { findContext, FindContextInputSchema } from './tools/mechanical/find-context.js';
import { parseConversation, ParseConversationInputSchema } from './tools/mechanical/parse-conversation.js';
import { parseLessonTranscript, ParseLessonTranscriptInputSchema } from './tools/mechanical/parse-lesson-transcript.js';
import { parseLessonPlanYaml, ParseLessonPlanYamlInputSchema } from './tools/mechanical/parse-lesson-plan-yaml.js';
import { aggregateLogs, AggregateLogsInputSchema } from './tools/mechanical/aggregate-logs.js';
import { contextLoad, ContextLoadInputSchema } from './tools/mechanical/context-load.js';

// Source tool imports (generic)
import {
  projectScan,
  ProjectScanInputSchema,
  sourceAdd,
  SourceAddInputSchema,
  sourceList,
  SourceListInputSchema,
  sourceRemove,
  SourceRemoveInputSchema,
  sourceUpdateUsage,
  SourceUpdateUsageInputSchema,
} from './tools/sources/index.js';

// Utility imports
import { zodToJsonSchema } from './utils/zod-to-json-schema.js';
import type { z } from 'zod';

// ---------------------------------------------------------------------------
// Tool handler registry
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- result shapes vary per tool
type ToolResult = any;
type IsErrorFn = (result: ToolResult) => boolean;

interface ToolEntry {
  description: string;
  inputSchema: z.ZodTypeAny;
  handler: (args: unknown) => Promise<ToolResult>;
  /** Custom isError logic. Default: `!result.success`. */
  isError?: IsErrorFn;
}

/** Standard isError: true when result.success is falsy. */
const standardIsError: IsErrorFn = (r) => !r.success;

/** Confirmation-aware isError: not an error when confirmation is pending. */
const confirmationIsError: IsErrorFn = (r) => !r.success && !r.confirmation_needed;

/** Never flag as error (tools that lack a success field). */
const neverError: IsErrorFn = () => false;

/**
 * Central registry mapping tool name to handler, schema, description, and
 * isError logic. Adding a new tool only requires one entry here — both
 * ListTools and CallTool are generated from this map.
 */
const TOOL_REGISTRY: Record<string, ToolEntry> = {
  // === Core Tools (Layer 1) ===
  file_read: {
    description:
      'Read file content from the filesystem. Returns content and metadata (size, modified date). Supports workspace validation for security.',
    inputSchema: FileReadInputSchema,
    handler: fileRead,
  },
  file_write: {
    description:
      'Write content to a file. Creates parent directories if needed. Set overwrite: true to replace existing files. Supports workspace validation.',
    inputSchema: FileWriteInputSchema,
    handler: fileWrite,
  },
  file_edit: {
    description:
      'Edit an existing file by applying operations: replace, insert_after, insert_before, append, prepend, delete. Supports workspace validation.',
    inputSchema: FileEditInputSchema,
    handler: fileEdit,
  },
  file_search: {
    description:
      'Search for text across files in a workspace. Returns matching files with line numbers and context. Supports file patterns and exclusions.',
    inputSchema: FileSearchInputSchema,
    handler: fileSearch,
  },

  // === Composite Tools (Layer 2) ===
  capture_session: {
    description:
      'Parse session content into structured items (ideas, decisions, reflections, questions, observations, actions). Returns parsed data WITHOUT saving to file. Use format_captured_session + intelligent_save to persist, or quick_save_session for complete workflow.',
    inputSchema: CaptureSessionInputSchema,
    handler: captureSession,
    isError: neverError,
  },
  format_captured_session: {
    description:
      'Convert captured session items to Obsidian-compatible markdown with YAML frontmatter and Dataview fields. Takes output from capture_session, returns markdown ready for intelligent_save.',
    inputSchema: FormatCapturedSessionInputSchema,
    handler: formatCapturedSession,
    isError: neverError,
  },
  quick_save_session: {
    description:
      'Complete workflow: parse session content, format as markdown, and save to file. Chains capture_session → format_captured_session → intelligent_save. Returns filepath on success, or parsed items with error details on partial failure.',
    inputSchema: QuickSaveSessionInputSchema,
    handler: quickSaveSession,
  },
  intelligent_save: {
    description:
      'Save content with intelligent metadata generation and interactive file placement. Supports analysis, reflections, lesson plans, ideas, decisions, documentation, and more. Returns a suggestion for confirmation unless auto_confirm is true.',
    inputSchema: IntelligentSaveInputSchema,
    handler: intelligentSave,
    isError: confirmationIsError,
  },
  capture_idea: {
    description:
      'Capture a spontaneous idea with context and Swedish priority (nu/snart/någon_gång). Quick capture without breaking flow - generates structure, tags, and saves to Ideas/ folder.',
    inputSchema: CaptureIdeaInputSchema,
    handler: captureIdea,
    isError: confirmationIsError,
  },
  log_process_event: {
    description:
      'Append a single event to the course process log (_system/logs/process_log.yaml). Wraps the existing process-log utility used internally by intelligent_save, exposing it so methodologies (e.g. post_lesson_auto) can log their own events without re-implementing YAML serialisation.\n\nEvent types:\n  planned, taught, reflected, material_produced, idea_captured,\n  deep_analysis, student_voice_reflection, course_planning_stage,\n  methodology_revised, memo_created, decision_made, todo_created\n\nGroups events by date and (optionally) lesson + module. Returns the appended event with auto-generated ISO timestamp, plus the log file path.',
    inputSchema: LogProcessEventInputSchema,
    handler: logProcessEvent,
  },

  // === Setup Tools ===
  project_init: {
    description:
      'Initialize a project: create folder structure (methodology/, Reflections/, Lesson_Plans/, Ideas/, Notes/, Planning/), copy methodology docs, create project_state.json. Run this once at project start.',
    inputSchema: ProjectInitInputSchema,
    handler: projectInit,
  },
  init_profession: {
    description:
      "Initialize profession-level structure at the workspace root: creates Profession/Manifest/ for the teacher's professional manifesto (which applies across all courses, not per-course). Idempotent — safe to re-run. Run once per workspace (the parent of all course folders), separate from per-course project_init.",
    inputSchema: InitProfessionInputSchema,
    handler: initProfession,
  },

  // === Mechanical Tools ===
  load_methodology: {
    description:
      'Load methodology for a specific process. Always start here before any planning, reflection, or analysis work.\n\nTeaching cycle processes:\n  context_gathering       — search/retrieval strategy\n  pre_lesson_planning     — creating a lesson plan\n  post_lesson_reflection  — reflecting after teaching\n  lesson_metadata         — YAML spec and tagging\n  pedagogical_foundation  — theoretical reference\n\nCourse design processes:\n  course_intro            — overview and stage management\n  course_syllabus         — syllabus analysis\n  course_previous         — learning from prior iterations\n  course_objectives       — writing learning objectives\n  course_modules          — organizing modules\n  course_assessment       — assessment strategy\n  course_sequences        — sequencing lessons\n\nAlways returns 00_shared_principles.md alongside the requested doc.',
    inputSchema: LoadMethodologyInputSchema,
    handler: loadMethodology,
  },
  find_context: {
    description:
      'Search workspace for existing project files by content type. Returns paths and metadata (type, date, title, size) without reading file contents. Use after load_methodology to find relevant plans, reflections, ideas, etc.\n\nFilters: content_types (required, list), topic (case-insensitive substring match), supports (LO/goal code), framework (e.g. gibbs/kolb), since (ISO date — only files with frontmatter date >= since; undated files pass through), max_results.',
    inputSchema: FindContextInputSchema,
    handler: findContext,
  },
  parse_conversation: {
    description:
      'Parse raw conversation text (email, meeting transcript) into structured messages [{from, to, date, subject, message}]. Handles Swedish and English headers. V1 supports email and meeting_transcript formats.',
    inputSchema: ParseConversationInputSchema,
    handler: parseConversation,
  },
  parse_lesson_transcript: {
    description:
      'Parse a pyannote-formatted lesson transcript file into structured segments and metadata. Reads the entire file once on the server, returning {segments, total_chars, total_duration_seconds, speaker_count, unique_speakers, diarisation_status, text_flat, full_coverage}. Removes the "read enough" heuristic that produces partial-coverage bugs in post_lesson_auto. Pyannote line format: [SPEAKER_XX] HH:MM:SS.mmm --> HH:MM:SS.mmm: text. Lines that do not match are skipped. diarisation_status is "ok" (>=2 speakers), "failed" (1 speaker), or "no_speakers" (0 parseable lines). full_coverage is always true on success — the tool guarantees the entire file was read.',
    inputSchema: ParseLessonTranscriptInputSchema,
    handler: parseLessonTranscript,
  },
  parse_lesson_plan_yaml: {
    description:
      'Parse a lesson plan markdown file and return its YAML frontmatter as structured data plus the markdown body. Returns {has_frontmatter, frontmatter, body, total_chars}. Frontmatter is parsed with JSON_SCHEMA so dates remain strings (e.g. "YYYY-MM-DD" format, not Date objects). Files without frontmatter are still readable — has_frontmatter is false and the entire file is in body. Designed for the post_lesson_auto pipeline to read uppgifter:/presentationer: from plan YAML (RFC-014). Malformed YAML returns success: false with details.',
    inputSchema: ParseLessonPlanYamlInputSchema,
    handler: parseLessonPlanYaml,
  },
  aggregate_logs: {
    description:
      'Read and normalize log files from Teaching Suite, QuestionForge, and Assessment Suite in the workspace. Returns a unified chronological timeline of all tool activity.\n\nSearches for:\n  **/activity_logs/*.jsonl    — Teaching Suite session logs\n  **/logs/session.jsonl       — QuestionForge pipeline logs\n  **/workflow_log.jsonl       — Assessment Suite workflow logs\n\nEach entry is normalized to: {ts, source, session_id, tool, action, summary, data, file}\n\nFilters:\n  - date range:    after/before (ISO datetime, inclusive)\n  - relative window: window (e.g. "21 days", "2 weeks") — derives `after` from now()\n  - source:        teacher/qf/as (which MCP server emitted the log)\n  - content_types: filter by tool/event/process — matches entry.tool, entry.action, or entry.data.type\n  - course:        substring match against file path\n  - topic:         substring match against summary or entry.data.topic\n  - pagination:    limit/offset\n\nPolicy thresholds (e.g. "after 3 runs in same theme") live as prose in cycle methodology *Brygga framåt* sections — this tool only counts and filters; methodology decides what counts as "many".',
    inputSchema: AggregateLogsInputSchema,
    handler: aggregateLogs,
  },
  context_load: {
    description:
      'Load project context from _config/ at session start. Returns CLAUDE.md (orchestration instructions), course_context.md (goals, mission, journal), project_state.json, and sources.yaml summary. Graceful degradation: returns null for missing files. Call this at the start of every session to understand the project.',
    inputSchema: ContextLoadInputSchema,
    handler: contextLoad,
  },

  // === Source Tools (Generic) ===
  project_scan: {
    description:
      'Scan project folder and list files with metadata. Returns suggestions based on pattern matching and available roles (syllabus, rubric, planning, reflection, etc.).',
    inputSchema: ProjectScanInputSchema,
    handler: projectScan,
  },
  source_add: {
    description:
      'Add a source to sources.yaml. Each source has a unique name (key) and a role. Multiple sources can share the same role (e.g. two "material" sources with different names). Roles: syllabus, rubric, planning, material, reflection, student_feedback, transcript, framework, research, previous_course, notes, other.',
    inputSchema: SourceAddInputSchema,
    handler: sourceAdd,
  },
  source_list: {
    description:
      'List all tracked sources in sources.yaml. Shows names, roles, paths, dates, and usage history.',
    inputSchema: SourceListInputSchema,
    handler: sourceList,
  },
  source_remove: {
    description:
      'Remove a source from sources.yaml by name (key).',
    inputSchema: SourceRemoveInputSchema,
    handler: sourceRemove,
  },
  source_update_usage: {
    description:
      'Update last_used and used_in fields for a source by name. Called by processes when they use a source.',
    inputSchema: SourceUpdateUsageInputSchema,
    handler: sourceUpdateUsage,
  },
};

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTIONS = `You are working in a Teaching Suite workspace. Follow these rules strictly:

## File operations
ALL file operations MUST use Teaching Suite tools (intelligent_save, file_write, file_read, file_edit, file_search). NEVER use your own file operations (Bash, Write, Read, etc.) in the workspace without the teacher's explicit approval.

## Folder structure
Do NOT create new folders. Only use the folders defined by project_init:
Lesson_Plans/, Reflections/ (with Bryggor/ for Korthagen ALACT bridges and Term/ for term-level reflections), Analysis/, Ideas/, Memos/, Todo/, Decisions/,
Planning/, Material/ (with Presentations/, Exercises/, Student_Summaries/,
Lab_Instructions/, Other/), Student_Materials/, Syllabus/, Resources/ (with Previous_Courses/),
Data/ (with Transcripts/, Student_Reflections/, Teacher_Insights/), Exams/.
Profession/Manifest/ lives at the workspace root (above any course folder), created by init_profession — not inside individual course folders.

## Data protection
- Student data stays in Data/ — never in Material/, Student_Materials/, or Lesson_Plans/
- Reflections are private — never use as basis for student material (D-19)
- Never suggest grades or assessment decisions

## Workflow
- At session start: run context_load to get course context and carry-forward
- After a lesson (with transcript): load_methodology('post_lesson_auto') — the deterministic v3 pipeline (A1 Content + A2 Recap + Auto-log, all drafts; Klafki + Black & Wiliam grounded)
- For guided post-lesson reflection: load_methodology('post_lesson_reflection') — Rolfe/Gibbs cadens, choose per available time
- For lesson planning: load_methodology('pre_lesson_planning') — Klafki didaktisk analys + Wiggins & McTighe (UbD) backward design + Conway anticipatory reflection
- For course assessment design: load_methodology('course_assessment')
- Always save with metadata: based_on, supports (the lesson_plan YAML schema was slimmed in v3.0.1 — course is derived from path, didactic content lives in body prose)

## load_methodology — two-step flow (v0.5.0+) and central methodology (v0.6.0+)
load_methodology returns a path to the methodology file, not the content. To use the methodology:
1. Call load_methodology(process). The result has result.file.path.
2. Call file_read(result.file.path) to get the content.
3. Cache: do not re-read the same path within the same session.
4. If result.file.readable is false: central methodology is not initialised. Tell the teacher to run project_init, then re-call load_methodology.

Methodology lives at <workspace>/Teaching_Suite/methodology/ — a shared, editable, version-tracked location next to Profession/. the teacher can open it in Finder/Obsidian, edit it, and changes sync via Nextcloud. There is no per-course copy. project_init creates Teaching_Suite/methodology/ once and reuses it across all courses.

When project_init runs, its result has a central_methodology field with the action ('created', 'unchanged', 'update_available', 'local_ahead', 'updated', or 'failed') and the path. When you summarise the init for the teacher, include the path so they understand methodology is at the workspace root, not inside the course folder.

If the action is 'update_available', the running MCP server has a newer methodology than the teacher's central copy. Surface the version difference and ask: "do you want to update? Local edits will be backed up." If yes, re-call project_init with force_update: true. The result then has action='updated' and backup_path pointing to the timestamped backup of the previous methodology — tell the teacher to review it and merge any local edits into the new copy.

shared_principles is a v0.x archive document. v3 has its own architectural references — load these explicitly only when methodology references them by name:
- load_methodology('synlighetsprincip') for the visibility principle
- load_methodology('tensions') for the productive-tensions reference
- load_methodology('pedagogisk_arkitektur') for the three-cycle architecture overview
Do not auto-load these on every methodology call.

## Bridges and tensions — read pattern (per methodology/synlighetsprincip.md)
Bridges between cycles (lesson_to_course_bridge, course_to_profession_bridge, profession_to_lesson_bridge, student_data_to_teacher_bridge) and the cross-cutting tensions reference (tensions) are callable via load_methodology, but their trigger conditions and actions live in methodology files — not here. Three read patterns to follow:
- **After completing a cycle process** (post_lesson_auto, post_lesson_reflection, pre_lesson_planning, course_assessment, etc.), check the loaded methodology for a "Brygga framåt" section. If present, evaluate its trigger condition against current state and follow the methodology's instruction. Do not invent triggers — only act on what methodology explicitly specifies.
- **At the start of pre_lesson, course revision, term_reflection, and manifest revision processes**, check the loaded methodology for a "Brygga bakåt" or "receive" section. If present, actively load any pending bridge outputs (via find_context, aggregate_logs, or the relevant bridge methodology) as context before proceeding. The methodology specifies which inputs to gather; this pattern only ensures you remember to gather them.
- **When a methodology file invokes tensions.md by name** (e.g. student_data_to_teacher_bridge references spänning 4), load tensions via load_methodology('tensions') and apply the named tension's framing to the current decision.
Compliance: any do-what trigger ("after 3 runs, suggest X") must live as prose in methodology, not in this prompt. See methodology/synlighetsprincip.md.

## Workflow transitions between v3 processes
When the teacher's intent shifts from one v3 process to another within a single session (e.g. from post_lesson_auto for yesterday to pre_lesson_planning for tomorrow), DO NOT silently continue with the previous methodology context. Explicitly announce the transition and load the new methodology:
"Vi har avslutat post_lesson_auto för den förra lektionen. Nu signalerar du planering av nästa lektion — jag laddar pre_lesson_planning."
Then call load_methodology with the new process name. This prevents the previous process's framing from contaminating the next one.

## Deprecated process names
post_lesson_summary and student_summary still work but emit a deprecation warning. Prefer post_lesson_auto. Removal scheduled for v0.5.`;

const server = new Server(
  {
    name: 'teaching-suite',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
    instructions: SYSTEM_INSTRUCTIONS,
  }
);

// List available tools — generated from the registry
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(TOOL_REGISTRY).map(([name, entry]) => ({
      name,
      description: entry.description,
      inputSchema: zodToJsonSchema(entry.inputSchema),
    })),
  };
});

// Handle tool calls — generic dispatch via the registry
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const entry = TOOL_REGISTRY[name];
  if (!entry) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  }

  try {
    const result = await entry.handler(args);
    const checkError = entry.isError ?? standardIsError;
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      isError: checkError(result),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Parse --workspace CLI flag
function parseWorkspaceArg(): string | undefined {
  const idx = process.argv.indexOf('--workspace');
  if (idx !== -1 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  return undefined;
}

// Start the server
async function main() {
  const workspace = parseWorkspaceArg();
  if (workspace) {
    setServerWorkspace(workspace);
    console.error(`Teaching Suite v0.8.0: workspace locked to ${workspace}`);
  } else {
    console.error('WARNING: No --workspace flag. All file operations will be rejected.');
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Teaching Suite server v0.8.0 running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
