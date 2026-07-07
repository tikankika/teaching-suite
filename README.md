# Teaching Suite

[![Version](https://img.shields.io/badge/version-0.6.0-blue.svg)](CHANGELOG.md)
[![License: PolyForm Noncommercial 1.0.0](https://img.shields.io/badge/License-PolyForm%20Noncommercial%201.0.0-lightgrey.svg)](LICENSE)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)

> MCP server that scaffolds guided processes for teachers. Capture ideas, plan lessons, reflect on teaching.

**Philosophy:** Process scaffolding, not automation. The teacher thinks, MCP structures.

## What is Teaching Suite?

Teaching runs in cycles — you plan a lesson, teach it, reflect on what happened, and
carry that forward into the next one. The thinking that makes those cycles worthwhile
is the easiest thing to lose: ideas half-noted and forgotten, reflections never written
down, each course planned from scratch.

Teaching Suite helps you hold onto it. Working through Claude Desktop, it guides you as
you plan a lesson, capture an idea the moment it arrives, or reflect after teaching — and
saves each as a plain Markdown file in your own folder. The pedagogy lives in editable
methodology documents, not in the code; the tools only structure the conversation and
write the result down. You do the thinking; the tool gives the process a shape.

By design it holds **no student personal data** — it works with your teaching (plans,
ideas, reflections), not your students' work.

## Development status

> **This is an active development project.** The tool architecture is stable and well-tested across 24 MCP tools. The core reflection cycle — plan → teach → reflect → improve — works end-to-end, with data flowing between three independent MCP servers via the filesystem.
>
> **Methodology (draft):** Three nested cycles — *lesson*, *course*, *profession* — drawing on Klafki's didactical analysis, Wiggins & McTighe's Understanding by Design, Schön's reflective practice, Black & Wiliam's formative assessment, and Biesta's pedagogy of subjectification. The frameworks are named but not yet worked through to the theoretical depth a 1.0 would need; `methodology/tensions.md` records the tensions between them. Published at this early stage deliberately — to invite critique.
>
> **Validation status:** Validated through the maintainer's own ongoing teaching use. Not yet tested with external teachers; an external pilot is planned.

### Methodology readiness

The methodology is published as a draft, but maturity varies by area. Every cycle document carries a `status:` field in its front matter; this table summarises where each part stands.

| Area | Readiness | Notes |
|------|-----------|-------|
| Lesson cycle (`methodology/lesson/`) | Working draft | Four documents (`pre_lesson`, `post_lesson_auto`, `post_lesson_refl`, `bridge`), substantial and in everyday use; marked `status: draft`. |
| Course cycle (`methodology/course/`) | Working draft | Six documents, `pre_course` → `revision`; complete in structure, marked `status: draft`. |
| Profession cycle (`methodology/profession/`) | Working draft | `manifest` and `term_reflection`; substantial, marked `status: draft`. |
| Foundations (`pedagogisk_arkitektur.md`, `shared_principles.md`, `methodology/README.md`) | Working draft | Architectural spine and operative guide; `shared_principles.md` is v0.5 with theory under continued revision. |
| Reflection frameworks (`methodology/reflection_frameworks/`) | Stable | Reference cards for Gibbs, Brookfield, Kolb and Driscoll. |
| System conventions (`methodology/system/`, `synlighetsprincip.md`) | Stable | Output conventions, analysis prompts and the visibility principle — settled reference material. |
| Cross-cycle bridges (`methodology/bridges/`) | Early draft | Four short specs awaiting enum-registration; not yet operational. |
| Tensions (`methodology/tensions.md`) | Early draft | Names the unresolved theoretical tensions, published early to invite critique. |

**Readiness key:** **Stable** — settled, used as reference · **Working draft** — substantial and in everyday use, theory still maturing · **Early draft** — a spec or sketch, not yet operational.

## Part of a teaching-and-assessment ecosystem

These tools share one philosophy — *teacher-led: scaffolding, not automation* — and
one design: MCP servers (and one pipeline) that run locally over plain-Markdown
workspaces, each locked to a folder with no network service of their own. They are
split along a deliberate data boundary: the **teaching side never holds student
personal data**, and the **assessment side keeps student work walled off** in its
own workspace.

| Tool | Role | Side |
|------|------|------|
| **edusafe-pipeline** | Anonymise Swedish classroom recordings and transcripts offline (names → pseudonyms) before anything is shared or reused. | Data-safety gate |
| **Teaching Suite** | Plan lessons, capture ideas, and reflect across lesson, course, and profession cycles. | Teaching — course workspace, no student PII |
| **QuestionForge** | Author exam questions from what was actually taught and export them to QTI for Inspera. Belongs to the teaching side by data zone (course material, no student data) but runs fully on its own — Teaching Suite is not required. | Teaching — course workspace, no student PII |
| **Assessment Suite** | Assess open-response answers aspect by aspect, with cited evidence and feedback — the teacher deciding every judgement. | Assessment — separate workspace, student data stays here |

How they fit together over one teaching cycle:

```
   edusafe-pipeline     anonymise recordings/transcripts (offline, names → pseudonyms)
        │
        ▼
   Teaching Suite       plan lessons, capture ideas, reflect
        │
        ▼
   QuestionForge        author exam questions from what was taught
        │
        ▼
   Inspera / QTI LMS    exam delivered and sat
        │
        ▼
   Assessment Suite     assess answers; reports and formative feedback
        │               (student work stays in this workspace)
        ▼
   Teaching Suite       only teacher insights flow back — by design, no student data
                        (aggregate_logs unifies the timeline)
```

**Your folders, your files.** Everything every tool writes is plain Markdown in your
own Nextcloud workspace — no database, no lock-in. The files are the source of truth
and stay readable on their own, with or without the tools. The teaching side and the
assessment side are deliberately *separate* folders, so student work never lands in the
course workspace; only anonymised *insights about teaching* flow from Assessment Suite
back to Teaching Suite. Point an Obsidian vault at a workspace (one per side, to keep the
data boundary intact) and your Markdown becomes a browsable, linkable web of your
practice — richer still where a tool writes `[[wikilinks]]` and `#tags`, as Teaching
Suite does. Sync the folders — for example via Nextcloud — and they follow you across
machines.

All tools are licensed under PolyForm Noncommercial 1.0.0.

> You are reading the **Teaching Suite** README — see also
> [Assessment Suite](https://github.com/tikankika/assessment-suite) and
> [QuestionForge](https://github.com/tikankika/question-forge).

## Who is this for?

Teaching Suite serves three audiences. Pick the door that fits — each needs something different.

### I'm a teacher

You plan lessons, capture ideas as they arrive, and reflect across the lesson, course, and profession cycles — and everything is saved as plain Markdown in your own folder. You work through Claude Desktop; the methodology guides the conversation and the tools write the result down.

If you are not the person who installs software, hand the developer door below to a colleague, then start here:

- [docs/TEACHER_GUIDE.md](docs/TEACHER_GUIDE.md) — how to work with Teaching Suite as a teacher

### I'm a researcher (pedagogy, teacher reflection, AI in education)

The interesting part is the **methodology**, not the plumbing — three nested cycles (lesson, course, profession) drawing on Klafki, Wiggins & McTighe, Schön, Black & Wiliam and Biesta, published as a working draft to invite critique.

- [methodology/](methodology/) — the pedagogical framework (start with `methodology/README.md`)
- [docs/decisions/](docs/decisions/) — architecture decision records
- The **Development status** above is explicit about where each part is mature and where it is still being built.

### I'm a developer (or setting this up for a teacher)

Clone, build, and point it at a folder. It is an MCP server (Node.js) that runs inside Claude Desktop.

- [Quick start](#quick-start) — install, build, test, and the Claude Desktop configuration
- [CLAUDE.md](CLAUDE.md) — architecture and the full tool reference

## Features

- **24 MCP tools** for teacher workflows
- **Methodology-driven**: pedagogical knowledge in markdown, tools stay generic
- **Swedish-language interface** with Obsidian integration (wikilinks, tags)
- **YAML frontmatter** for structured data
- **Workspace security**: `--workspace` flag locks all file operations to a directory

## Quick start

```bash
# Install
git clone https://github.com/tikankika/teaching-suite.git
cd teaching-suite
npm install
npm run build

# Test
npm test  # run the full test suite
```

### Claude Desktop configuration

Add to `claude_desktop_config.json`:

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

> **Important:** The `--workspace` flag is required. Without it, all file operations are rejected. Point it to your courses/teaching folder.

## Workflow: how the pieces fit

Teaching Suite spans three surfaces over a single folder of plain Markdown files. Understanding how they relate is the key to using it well.

- **Local files — the source of truth.** Everything Teaching Suite produces is a plain Markdown file in your workspace folder: ideas, lesson plans, reflections, logs. Nothing is locked in a database or the cloud — the folder is yours and stays readable without any of the other tools.
- **Claude Desktop — the engine.** The MCP server runs inside Claude Desktop and reads and writes those files via the `--workspace` flag. This is where the work happens: you think and converse, the methodology guides the conversation, and the tools structure the result onto disk.
- **Obsidian — the reading lens (optional).** Point an Obsidian vault at the same folder and the `[[wikilinks]]` and `#tags` Teaching Suite writes become a navigable web of your teaching practice. Obsidian does not run the tools; it is a way to read, link, and browse what is already on disk.

In short: **Claude Desktop writes, the folder stores, Obsidian reads** — one folder, three views. Sync the folder (e.g. via Nextcloud) and the same files follow you across machines.

## Tools overview

### Core tools (4)

| Tool | Purpose |
|------|---------|
| `file_read` | Read file content + metadata |
| `file_write` | Create/write files |
| `file_edit` | Edit existing files |
| `file_search` | Search text across files |

### Composite tools (6)

| Tool | Purpose |
|------|---------|
| `capture_idea` | Quick capture with Swedish priority (nu/snart/någon_gång) |
| `intelligent_save` | Save with metadata and YAML frontmatter |
| `capture_session` | Parse chat → structured items |
| `format_captured_session` | Items → Obsidian markdown |
| `quick_save_session` | Full workflow: capture → format → save |
| `log_process_event` | Append a structured event to the course process log |

### Mechanical tools (7)

| Tool | Purpose |
|------|---------|
| `load_methodology` | Load pedagogical methodology docs by process |
| `find_context` | Search workspace for existing files by content type |
| `context_load` | Load `_config/` (CLAUDE.md, course context, sources) at session start |
| `parse_conversation` | Parse email/meeting transcripts into structured messages |
| `parse_lesson_transcript` | Parse pyannote-formatted transcripts into structured segments |
| `parse_lesson_plan_yaml` | Parse a lesson plan's YAML frontmatter and body |
| `aggregate_logs` | Unified chronological timeline across Teaching Suite, QuestionForge, Assessment Suite |

### Setup tools (2)

| Tool | Purpose |
|------|---------|
| `project_init` | Initialise a course: folder structure, methodology docs, project state |
| `init_profession` | Initialise workspace-level `Profession/Manifest/` (sibling to course folders) |

### Source management (5)

| Tool | Purpose |
|------|---------|
| `project_scan` | Scan folder, suggest source roles |
| `source_add` | Add source with role |
| `source_list` | List tracked sources |
| `source_remove` | Remove source |
| `source_update_usage` | Track source usage |

## Example: capture an idea

```
User: "Idé: Använd solpaneler som analogi för fotosyntes"

→ capture_idea creates:
  Ideas/2025-10-02-solpanel-analogi.md

  With YAML frontmatter:
  - type: idea
  - priority: snart
  - tags: [fotosyntes, analogi]
  - status: BACKLOG
```

## Example: methodology-driven lesson planning

```
1. load_methodology(process: "pre_lesson_planning")
   → Returns pedagogical guide + shared principles

2. find_context(content_type: "reflection", workspace: "/courses/KURS101")
   → Finds previous reflections on the topic

3. Claude Desktop reads methodology, reviews context,
   guides teacher through planning questions

4. intelligent_save(content_type: "plan", ...)
   → Saves structured lesson plan with YAML frontmatter
```

## Data privacy

Teaching Suite includes a lightweight **content scanner** that warns (it never blocks) when a file contains any of a fixed list of Swedish sensitivity keywords (e.g. *personnummer*, *elevhälsa*). It is an advisory reminder — **not anonymisation or reliable PII detection**: it matches keywords, not actual personal-number patterns or names. Anonymise sensitive data before importing it.

The real privacy guarantees are the `--workspace` lockdown and the absence of network access: teaching data stays on your machine.

## Documentation

- [docs/TEACHER_GUIDE.md](docs/TEACHER_GUIDE.md) - How to work with Teaching Suite as a teacher
- [CLAUDE.md](CLAUDE.md) - Architecture and tool reference
- [ROADMAP.md](ROADMAP.md) - Direction towards 1.0
- [CHANGELOG.md](CHANGELOG.md) - Release history
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [docs/decisions/](docs/decisions/) - Architecture Decision Records

## Requirements

- Node.js 18+
- npm

## Licence

[PolyForm Noncommercial 1.0.0](LICENSE) — free for noncommercial use (including education and research); commercial use requires a separate licence. See [ADR-008](docs/decisions/ADR-008-license-polyform-noncommercial.md).

## Support

- Questions and bugs: [GitHub Issues](https://github.com/tikankika/teaching-suite/issues)
- Discussion: [GitHub Discussions](https://github.com/tikankika/teaching-suite/discussions)

---

*Version 0.6.0*
