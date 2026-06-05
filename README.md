# Teaching Suite

> MCP server that scaffolds guided processes for teachers. Capture ideas, plan lessons, reflect on teaching.

**Philosophy:** Process scaffolding, not automation. The teacher thinks, MCP structures.

## Development Status

> **This is an active development project.** The tool architecture is stable and tested (642 tests across 24 MCP tools). The core reflection cycle — plan → teach → reflect → improve — works end-to-end, with data flowing between three independent MCP servers via the filesystem.
>
> **Methodology v3.0** (current): Three nested cycles — *lesson*, *course*, *profession* — grounded in Klafki's didactical analysis, Wiggins & McTighe's Understanding by Design, Schön's reflective practice, Black & Wiliam's formative assessment, and Biesta's pedagogy of subjectification. Each cycle document names its frameworks; `methodology/tensions.md` records the productive tensions between them so design choices stay traceable.
>
> **Validation status:** Validated through the maintainer's own ongoing teaching use. Not yet tested with external teachers; an external pilot is planned.

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
- [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- [docs/decisions/](docs/decisions/) - Architecture Decision Records

## Integration

- **Obsidian**: Creates `[[wikilinks]]` and `#tags`
- **Claude Desktop**: MCP server via stdio
- **Nextcloud**: File sync compatible

## Requirements

- Node.js 18+
- npm

## License

[PolyForm Noncommercial 1.0.0](LICENSE) — free for noncommercial use (including education and research); commercial use requires a separate licence. See [ADR-008](docs/decisions/ADR-008-license-polyform-noncommercial.md).

---

*Version 0.8.0*
