# Changelog

All notable changes to Teaching Suite are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Process-name guard (CI test).** `tests/process-name-guard.test.ts` asserts a one-directional contract — every `load_methodology` process name referenced in the public docs (`README.md`, `docs/TEACHER_GUIDE.md`, and the whole `methodology/` tree) exists in the tool's `z.enum`. It reads two structured sources (the `load_methodology(...)` calls and the methodology table's `Process` column) so a renamed or removed process can no longer leave a published doc pointing teachers at a process the tool rejects. Same family as `tests/content-types.test.ts`; no runtime change to `load_methodology`.
- **README — "Part of a teaching-and-assessment ecosystem" section.** A shared cross-suite block (edusafe-pipeline, Teaching Suite, QuestionForge, Assessment Suite) describing the deliberate data boundary and how the tools fit over one teaching cycle. Mirrored verbatim across the three suite READMEs; sibling repositories are named without links until they are public.
- **README — a plain-language "What is Teaching Suite?" opening** so a newcomer grasps the tool within the first lines, before the architecture and jargon.
- **README — a "Who is this for?" section** with three audience doors (teacher / researcher / developer), each routed to its starting point.
- **README — status, licence and Node badges, and a Support section** (Issues and Discussions).

### Changed

- **`find_context` searches every content type `intelligent_save` can write (3c).** The search-side `content_types` enum is now derived from the shared content-type registry (`src/utils/content-types.ts`) instead of a separate hand-maintained list, so the seven types that could be saved but never searched by name — `deep_analysis`, `material`, `lesson_summary`, `student_summary`, `content`, `recap`, `auto_log` — are now searchable. This is an additive public schema change (`find_context` input grows by 7 types). The drift guard in `tests/content-types.test.ts` now asserts the search enum equals the registry, so the 27/20 divergence cannot silently return. (The deferred consolidation of default-status, validation rules and event mapping into registry columns is intentionally **not** in this batch — they are internal to `intelligent_save` with no drifting reader.)
- **`find_context` scans `Material/` recursively.** Material is the teacher's hand-sorted tree (`Material/Klart`, `Material/Övningar`, …); a flat scan hid everything below the top level. A new `RECURSIVE_SEARCH_DIRS` marks Material for whole-subtree scanning, which also subsumes `Material/Student_Summaries/` (`student_summary`'s write dir). Directory-based type fallback now resolves most-specific-first, so a frontmatter-less file under `Material/Student_Summaries` is typed `student_summary` and anything else under `Material` is typed `material`. Only `.md` files are read (first 2 KB), and symlinks are never followed.
- **README — methodology framed honestly as a draft.** Dropped the "v3.0 (current)" label; the named frameworks (Klafki, Wiggins & McTighe, Schön, Black & Wiliam, Biesta) are now described as named but not yet worked through to the depth a 1.0 would need, with the methodology published deliberately to invite critique. The product version (0.5.0) is the single readiness signal (#8).
- **README — added a "Workflow: how the pieces fit" section** explaining the three surfaces over one folder of Markdown: local files (source of truth), Claude Desktop (engine), Obsidian (reading lens). Replaced the thin "Integration" list (#8).
- **README — added a "Methodology readiness" table** giving per-area maturity (Stable / Working draft / Early draft) across the lesson, course and profession cycles, foundations, reflection frameworks, system conventions, bridges and tensions; grounded in each document's `status:` front matter. The same readiness markers were mirrored into `methodology/README.md`'s related-documents list (#8).
- **README — headings set to sentence case** to match the family house style; the hard-coded test count was de-numbered (it had drifted from the suite) and the licence heading corrected to British spelling.
- **CONTRIBUTING — sentence-case headings and a standardised licence line.**
- **SECURITY — vulnerability reporting standardised** to GitHub's private vulnerability reporting (the alternative "email the maintainer" removed), with a unified supported-versions table and a response-time expectation.

### Documentation

- **Teacher-guide direction (planned, #8).** Teacher-facing guides across the ecosystem (Teaching Suite, QuestionForge, Assessment Suite) will be written in English from a shared template extracted from Assessment Suite, with worked examples that are **fully fabricated** — not real-but-anonymised. Examples will be grounded in a shared, deliberately fabricated **demo course (RFC-009)**, which can also ship as a try-it sandbox.

### Fixed

- **Two dead process references in bridge methodology docs.** `methodology/bridges/course_to_profession.md` called `load_methodology('manifest_revision')` (no such enum value → `manifest`) and `methodology/bridges/profession_to_lesson.md` called `load_methodology('pre_lesson')` (→ `pre_lesson_planning`). Caught by the new process-name guard; both now point at real enum values.
- **SECURITY.md — corrected the supported-version table** from 0.8.x to 0.5.x; it had been copied from a sibling project and did not match this product's version.

## [0.5.0] - 2026-06-06

Initial public release.

- 24 MCP tools for teacher workflows — idea capture, reflection, lesson and
  course planning, methodology loading, and source tracking.
- Methodology v3.0: three nested cycles — *lesson*, *course*, *profession*.
- Workspace-locked file operations; no network access.
- Licensed PolyForm Noncommercial 1.0.0 (see ADR-008); bilingual — code in
  English, methodology and UX in Swedish (see ADR-007).
