# Architecture

Teaching Suite is an MCP (Model Context Protocol) server that scaffolds guided processes for teachers. It helps capture ideas, reflect on lessons, plan teaching, and track pedagogical goals.

**Philosophy:** Process scaffolding, not automation. The teacher thinks, MCP structures.

**Version:** 0.6.0

## Repository layout

```
teaching-suite/
├── src/
│   ├── index.ts                    # MCP server entry point
│   │
│   ├── tools/
│   │   ├── core/                   # Core tools (4 tools)
│   │   │   ├── index.ts
│   │   │   ├── workspace.ts        # Path validation, security
│   │   │   ├── file-read.ts
│   │   │   ├── file-write.ts
│   │   │   ├── file-edit.ts
│   │   │   └── file-search.ts
│   │   │
│   │   ├── composite/              # Composite tools (6 tools)
│   │   │   ├── index.ts
│   │   │   ├── capture-idea.ts           # Quick idea capture
│   │   │   ├── intelligent-save.ts       # Smart file saving
│   │   │   ├── capture-session.ts        # Parse chat → structured items
│   │   │   ├── format-captured-session.ts
│   │   │   ├── quick-save-session.ts
│   │   │   └── log-process-event.ts      # Append event to course process log
│   │   │
│   │   ├── mechanical/             # Mechanical tools (7 tools)
│   │   │   ├── load-methodology.ts       # Load methodology docs
│   │   │   ├── find-context.ts           # Search workspace for files (types derived from registry; Material/ recursive)
│   │   │   ├── context-load.ts           # Load _config/ at session start
│   │   │   ├── parse-conversation.ts     # Parse email/transcripts
│   │   │   ├── parse-lesson-transcript.ts # Parse pyannote transcripts
│   │   │   ├── parse-lesson-plan-yaml.ts # Parse lesson-plan YAML
│   │   │   └── aggregate-logs.ts         # Cross-server chronological timeline
│   │   │
│   │   ├── setup/                  # Setup tools (2 tools)
│   │   │   ├── project-init.ts           # Initialise course structure
│   │   │   └── init-profession.ts        # Initialise Profession/Manifest/
│   │   │
│   │   └── sources/                # Source tools (5 tools)
│   │       ├── index.ts
│   │       ├── scan.ts
│   │       └── track.ts
│   │
│   └── utils/
│       ├── content-scanner.ts      # Advisory Swedish keyword matcher (privacy/exam terms)
│       ├── content-types.ts        # Single source of truth: content type → directory (write routing + find_context search set)
│       ├── file-helpers.ts
│       ├── process-log.ts
│       ├── text-helpers.ts
│       └── zod-to-json-schema.ts
│
├── methodology/                    # Pedagogical guides (for Claude Desktop)
│   ├── README.md                   # Top-level operative guide (v3)
│   ├── pedagogisk_arkitektur.md    # Conceptual spine (v3)
│   ├── synlighetsprincip.md        # Visibility principle (v3)
│   ├── tensions.md                 # Pedagogical tensions (v3)
│   ├── lesson/                     # Lesson cycle (v3): pre_lesson, post_lesson_auto, post_lesson_refl, bridge
│   ├── course/                     # Course cycle (v3): pre_course, design, conduct, assessment, evaluation, revision
│   ├── profession/                 # Profession cycle (v3): term_reflection, manifest
│   ├── bridges/                    # Cross-cycle bridges (e.g. course_to_profession)
│   ├── reflection_frameworks/      # Brookfield, Gibbs, Driscoll, Kolb (theoretical models)
│   └── system/                     # AI behaviour specs (cross-cutting)
│       ├── capture-session.md
│       ├── pedagogical_analysis/   # LLM prompt templates (Bloom, key moments)
│       └── output_conventions/     # confidence labels, source attribution, limitations
│
├── docs/
│   └── decisions/                  # Architecture Decision Records (ADRs)
│
├── tests/                          # Test suite (Vitest)
│
└── package.json
```

## Tool inventory (24 tools)

### Core tools (4)

| Tool | Purpose |
|------|---------|
| `file_read` | Read file content + metadata |
| `file_write` | Create/write files |
| `file_edit` | Edit existing files (replace, insert, append, delete) |
| `file_search` | Search text across files in workspace |

All core tools enforce **workspace validation** via the `--workspace` flag.

### Composite tools (6)

| Tool | Purpose |
|------|---------|
| `capture_idea` | Quick capture with Swedish priority (nu/snart/någon_gång) |
| `intelligent_save` | Save with metadata, suggestions, YAML frontmatter |
| `capture_session` | Parse chat → structured items |
| `format_captured_session` | Items → Obsidian markdown |
| `quick_save_session` | Full workflow: capture → format → save |
| `log_process_event` | Append a structured event to the course process log |

### Mechanical tools (7)

| Tool | Purpose |
|------|---------|
| `load_methodology` | Load methodology docs for teaching-cycle or course-design processes |
| `find_context` | Search workspace for existing files by content type — the searchable types are derived from the shared content-type registry (every type `intelligent_save` can write is searchable), and `Material/` is scanned recursively |
| `context_load` | Load `_config/` (CLAUDE.md, course context, sources) at session start |
| `parse_conversation` | Parse email/meeting transcripts into structured messages |
| `parse_lesson_transcript` | Parse pyannote-formatted transcripts into structured segments |
| `parse_lesson_plan_yaml` | Parse a lesson plan's YAML frontmatter and body |
| `aggregate_logs` | Unified chronological timeline across Teaching Suite, QuestionForge, Assessment Suite |

### Setup tools (2)

| Tool | Purpose |
|------|---------|
| `project_init` | Create folder structure, copy methodology docs, initialise project state |
| `init_profession` | Initialise workspace-level `Profession/Manifest/` (sibling to course folders) |

### Source tools (5)

| Tool | Purpose |
|------|---------|
| `project_scan` | Scan folder, suggest source roles |
| `source_add` | Add source with role to sources.yaml |
| `source_list` | List tracked sources |
| `source_remove` | Remove source by role |
| `source_update_usage` | Track source usage |

## Course workspace structure

When `project_init` is called with `type: 'course'`, it creates this structure in the workspace:

```
/Nextcloud/Courses/KURS/
│
├── _config/                        # Per-course configuration (context_load reads here)
│   ├── course_context.md           # Course goals, challenges, journal
│   └── CLAUDE.md                   # Orchestration instructions for this course
│
│  — Teacher's process files —
├── Reflections/                    # Post-lesson, deep reflection, progression analyses
├── Lesson_Plans/                   # Lesson plans with YAML frontmatter
├── Ideas/                          # Spontaneous ideas, quick captures
├── Planning/                       # Course planning (syllabus analysis, weekly plan, LOs)
├── Analysis/                       # Didactic analyses, deep analyses
├── Notes/                          # Anything that doesn't fit elsewhere
│
│  — Imported data —
├── Data/                           # One folder, subfolders per data type
│   ├── Transkript/                 # Lesson recordings (.json, .srt, .txt)
│   ├── Labbdata/                   # Images, measurements, lab work
│   ├── Elevreflektioner/           # Student reflections (GDPR-sensitive)
│   └── Teacher_Insights/           # ← Imported from Assessment Suite
│
│  — Course material —
├── Styrdokument/                   # Syllabus, curriculum, commentary
├── Material/                       # Course material (own + imported)
│   ├── WIP/                        # Work in progress (drafts)
│   ├── Klart/                      # Ready for lesson
│   │   ├── Presentationer/         # .pptx, .pdf
│   │   ├── Övningar/               # Exercises, lab instructions
│   │   └── Övrigt/                 # Films, links, handouts
│   └── Resurser/                   # Imported (others' material, references)
├── Exams/                          # Exams, QuestionForge material
│
│  — System —
├── methodology/                    # Copied at init
├── activity_logs/
├── sources.yaml                    # Source tracking (project root)
└── project_state.json              # Process state (project root)
```

For non-course types (e.g., `lesson`), the legacy flat structure is used: `Reflections/`, `Lesson_Plans/`, `Ideas/`, etc.

## MCP ecosystem

Teaching Suite is one of several MCP servers that share the same Nextcloud workspace:

```
Teaching Suite (teaching-suite)
  --workspace /Nextcloud/Courses/
  Scope: lesson planning, reflection, idea capture, methodology
  Tools: 24

Assessment Suite (assessment-v2)
  --workspace /Nextcloud/Assessment/
  Scope: student assessment, rubric application, feedback
  Separate Nextcloud folder — student data never in course folder

QuestionForge (qf-scaffolding-v2, qf-pipeline-v2)
  Scope: exam construction, QTI export to Inspera
```

**Data flows between servers:**
- Assessment Suite exports `teacher_insights` → Teaching Suite `Data/Teacher_Insights/`
- Assessment Suite exports anonymised feedback → Teaching Suite (via teacher_insights)
- QuestionForge exports QTI → Inspera (external)

**Separation principle:** Teaching Suite handles the teacher's professional processes. Assessment data (student work, grades) stays in Assessment Suite's own workspace. Only *insights about teaching* flow back.

## Workspace security

All file operations require a `--workspace` flag at server startup:

```json
{
  "mcpServers": {
    "teaching-suite": {
      "command": "node",
      "args": ["/path/to/teaching-suite/dist/index.js", "--workspace", "/path/to/courses"]
    }
  }
}
```

- Without `--workspace`, all file operations are rejected
- Path traversal attempts (e.g., `../../etc/passwd`) are blocked
- The content scanner (`content-scanner.ts`) is an **advisory** keyword matcher: it flags a small set of Swedish privacy/exam-related terms in content and surfaces a warning. It does **not** detect names or personal numbers, does not anonymise, and never blocks an operation. It is a reminder, not a guarantee — anonymise sensitive data before importing it.

## Key commands

```bash
npm install    # Install dependencies
npm run build  # Build TypeScript
npm test       # Run the full test suite
npm start      # Start MCP server
```

## Design principles

1. **Methodology = Pedagogik** (markdown files for Claude Desktop)
2. **Core tools = Teknik** (generic MCP tools)
3. **Claude Desktop = Orkestrering** (reads methodology, uses tools)
4. **Teacher THINKS, MCP STRUCTURES**
5. **Never start from scratch** (build on history)

## Language policy

This project is **deliberately bilingual**. Swedish teachers are the primary
audience, so teacher-facing content stays in Swedish; the code stays in English
for international contributors. This is a design choice, not a translation backlog.

- **Code**: English (comments, variable names, documentation)
- **UX strings**: Swedish (priority enums like `nu/snart/någon_gång`, templates, GDPR patterns, search patterns)
- **Methodology docs**: Swedish (~10,500 lines of pedagogical content for teachers)
- **English-language content** (README, CONTRIBUTING, international-facing docs): British English — see ADR-007 (`docs/decisions/ADR-007-bilingual-language-policy.md`)
- **Why**: English code lowers the barrier for international contributors; Swedish UX and methodology because the teachers who use this tool think and work in Swedish. Translating the methodology to English would not serve the primary audience.

## Session workflow

When to use the session capture tools:

1. **During conversation** — ideas emerge naturally
2. **At session end** — `quick_save_session` to persist everything
3. **Quick ideas** — `capture_idea` for spontaneous thoughts
4. **Structured save** — `intelligent_save` for any content with metadata

## Integration

- **Obsidian:** Creates `[[wikilinks]]` and `#tags`
- **Claude Desktop:** MCP server via stdio with `--workspace` flag
- **Nextcloud:** File sync compatible

## Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol
- `zod` - Input validation
- `js-yaml` - YAML frontmatter
- Node.js 18+, TypeScript 5+

---

*Last updated: 2026-07-07*
