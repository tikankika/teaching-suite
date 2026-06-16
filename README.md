# Teaching Suite

> MCP server that scaffolds guided processes for teachers. Capture ideas, plan lessons, reflect on teaching.

**Philosophy:** Process scaffolding, not automation. The teacher thinks, MCP structures.

## Development Status

> **This is an active development project.** The tool architecture is stable and tested (642 tests across 24 MCP tools). The core reflection cycle — plan → teach → reflect → improve — works end-to-end, with data flowing between three independent MCP servers via the filesystem.
>
> **Methodology (draft):** Three nested cycles — *lesson*, *course*, *profession* — drawing on Klafki's didactical analysis, Wiggins & McTighe's Understanding by Design, Schön's reflective practice, Black & Wiliam's formative assessment, and Biesta's pedagogy of subjectification. The frameworks are named but not yet worked through to the theoretical depth a 1.0 would need; `methodology/tensions.md` records the tensions between them. Published at this early stage deliberately — to invite critique.
>
> **Validation status:** Validated through the maintainer's own ongoing teaching use. Not yet tested with external teachers; an external pilot is planned.

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

> You are reading the **Teaching Suite** README. Assessment Suite and
> QuestionForge are sibling projects in the same ecosystem; links will be added
> once their repositories are public.

## Features

- **24 MCP tools** for teacher workflows
- **Methodology-driven**: pedagogical knowledge in markdown, tools stay generic
- **Swedish-language interface** with Obsidian integration (wikilinks, tags)
- **YAML frontmatter** for structured data
- **Workspace security**: `--workspace` flag locks all file operations to a directory

## Quick Start

```bash
# Install
git clone https://github.com/tikankika/teaching-suite.git
cd teaching-suite
npm install
npm run build

# Test
npm test  # 642 tests
```

### Claude Desktop Configuration

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

## Tools Overview

### Core Tools (4)

| Tool | Purpose |
|------|---------|
| `file_read` | Read file content + metadata |
| `file_write` | Create/write files |
| `file_edit` | Edit existing files |
| `file_search` | Search text across files |

### Composite Tools (6)

| Tool | Purpose |
|------|---------|
| `capture_idea` | Quick capture with Swedish priority (nu/snart/någon_gång) |
| `intelligent_save` | Save with metadata and YAML frontmatter |
| `capture_session` | Parse chat → structured items |
| `format_captured_session` | Items → Obsidian markdown |
| `quick_save_session` | Full workflow: capture → format → save |
| `log_process_event` | Append a structured event to the course process log |

### Mechanical Tools (7)

| Tool | Purpose |
|------|---------|
| `load_methodology` | Load pedagogical methodology docs by process |
| `find_context` | Search workspace for existing files by content type |
| `context_load` | Load `_config/` (CLAUDE.md, course context, sources) at session start |
| `parse_conversation` | Parse email/meeting transcripts into structured messages |
| `parse_lesson_transcript` | Parse pyannote-formatted transcripts into structured segments |
| `parse_lesson_plan_yaml` | Parse a lesson plan's YAML frontmatter and body |
| `aggregate_logs` | Unified chronological timeline across Teaching Suite, QuestionForge, Assessment Suite |

### Setup Tools (2)

| Tool | Purpose |
|------|---------|
| `project_init` | Initialise a course: folder structure, methodology docs, project state |
| `init_profession` | Initialise workspace-level `Profession/Manifest/` (sibling to course folders) |

### Source Management (5)

| Tool | Purpose |
|------|---------|
| `project_scan` | Scan folder, suggest source roles |
| `source_add` | Add source with role |
| `source_list` | List tracked sources |
| `source_remove` | Remove source |
| `source_update_usage` | Track source usage |

## Example: Capture an Idea

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

## Example: Methodology-Driven Lesson Planning

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

## Data Privacy

Teaching Suite includes a lightweight **content scanner** that warns (it never blocks) when a file contains any of a fixed list of Swedish sensitivity keywords (e.g. *personnummer*, *elevhälsa*). It is an advisory reminder — **not anonymisation or reliable PII detection**: it matches keywords, not actual personal-number patterns or names. Anonymise sensitive data before importing it.

The real privacy guarantees are the `--workspace` lockdown and the absence of network access: teaching data stays on your machine.

## Documentation

- [CLAUDE.md](CLAUDE.md) - Architecture and tool reference
- [ROADMAP.md](ROADMAP.md) - Direction towards 1.0
- [CHANGELOG.md](CHANGELOG.md) - Release history
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [docs/decisions/](docs/decisions/) - Architecture Decision Records

## Requirements

- Node.js 18+
- npm

## License

[PolyForm Noncommercial 1.0.0](LICENSE) — free for noncommercial use (including education and research); commercial use requires a separate licence. See [ADR-008](docs/decisions/ADR-008-license-polyform-noncommercial.md).

---

*Version 0.5.0*
