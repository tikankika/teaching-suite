# Examples Policy

**All example, illustrative and test data in this repository is fabricated.**

Teaching Suite works with real teaching material in a teacher's own workspace,
but **none of that material is ever committed here**. Every course code, lesson,
reflection, transcript snippet, idea, file path and name that appears anywhere in
this repository as an *example* is invented for documentation or testing. No real
student, teacher, colleague, school, or course is represented.

This policy exists so the question *"are these examples real?"* has a single,
documented answer: **no**.

## Scope

This applies to all illustrative and sample content, including:

- `examples/` — worked walkthroughs and the artefacts they produce
- Code and tool examples in `README.md`, `CLAUDE.md`, and `docs/`
- Illustrative snippets inside the methodology documents (`methodology/`)
- Test fixtures and sample inputs under `tests/`

It does **not** apply to genuine project metadata that is meant to be real:
authorship in git history, licence text, dependency lists, and similar.

## What "fabricated" means

- **Course codes** are placeholders such as `KURS101`, not real course identifiers.
- **People** are referred to generically (`School A`, `Colleague_A`, `SPEAKER_01`,
  `L1`) or not at all — never by a real name.
- **File paths** in examples use `/path/to/...`, never a real user-home path.
- **Lesson, reflection and transcript content** is written to be realistic but is
  entirely invented; it describes no real classroom event.

These conventions follow the repository's
[`.claude/rules/data-protection.md`](.claude/rules/data-protection.md) rule.

## The one example — and no more

The repository keeps **one** worked example, deliberately:

- [`examples/kurs101_reflektion/`](examples/kurs101_reflektion/) — a single
  post-lesson reflection for a fabricated biology course (`KURS101`, *Biologi 1*),
  lesson 3 on cell division (*celldelning*). The course, the lesson, and the
  reflection text are all invented. See
  [`examples/README.md`](examples/README.md) for the walkthrough.

**No new examples are added to this repository.** One minimal, fully fabricated
walkthrough is enough to show the core reflection cycle; more examples only widen
the surface where real workspace data could leak in by mistake. Richer or
course-specific material belongs in a teacher's own workspace, never here.

## For contributors

- **Do not add new example directories or sample files.** If you think an
  additional example is genuinely needed, raise it as an issue first rather than
  committing one.
- When editing the **existing** example, fixtures, or illustrative snippets, use
  **only fabricated data** — never paste from a real workspace, transcript, or
  course — and keep the placeholder conventions above (`KURS101`, `School A`,
  `/path/to/...`).
- Never commit anything synced from Nextcloud, Dropbox, OneDrive or another
  external store — see
  [`.claude/rules/internal-docs-boundary.md`](.claude/rules/internal-docs-boundary.md).

If you are ever unsure whether a piece of sample data is safe to commit, treat it
as real and leave it out.
