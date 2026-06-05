# Examples

This directory contains one worked example for Teaching Suite, built from
**fabricated data only**. No real student, course, or classroom data appears
here — the course code (`KURS101`), the lesson content, and the reflection text
are all invented.

The example shows the core **post-lesson reflection cycle**: how an AI assistant
(e.g. Claude Desktop) reads the methodology, guides the teacher through a
structured reflection, and persists the result with the MCP tools.

---

## The example

[`kurs101_reflektion/`](kurs101_reflektion/) — a single post-lesson reflection
for a fabricated biology course (`KURS101`, *Biologi 1*), lesson 3 on cell
division (*celldelning*). It contains:

- [`README.md`](kurs101_reflektion/README.md) — the walkthrough: the scenario,
  which tools run in what order, and what files result.
- [`Reflections/2026-05-20_lektion3_celldelning.md`](kurs101_reflektion/Reflections/2026-05-20_lektion3_celldelning.md)
  — the reflection artifact, exactly as `intelligent_save` would write it
  (YAML frontmatter + a Gibbs-structured body).

Start with the walkthrough README.

> **Note on language.** The reflection content is in Swedish — Teaching Suite's
> primary audience is Swedish teachers, and teacher-facing artifacts stay in
> Swedish (see the Language Policy in the root `CLAUDE.md`). The walkthrough
> prose is in English.
