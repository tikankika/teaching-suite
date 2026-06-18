# Changelog

All notable changes to Teaching Suite are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **README — "Part of a teaching-and-assessment ecosystem" section.** A shared cross-suite block (edusafe-pipeline, Teaching Suite, QuestionForge, Assessment Suite) describing the deliberate data boundary and how the tools fit over one teaching cycle. Mirrored verbatim across the three suite READMEs; sibling repositories are named without links until they are public.

### Changed

- **README — methodology framed honestly as a draft.** Dropped the "v3.0 (current)" label; the named frameworks (Klafki, Wiggins & McTighe, Schön, Black & Wiliam, Biesta) are now described as named but not yet worked through to the depth a 1.0 would need, with the methodology published deliberately to invite critique. The product version (0.5.0) is the single readiness signal (#8).
- **README — added a "Workflow: how the pieces fit" section** explaining the three surfaces over one folder of Markdown: local files (source of truth), Claude Desktop (engine), Obsidian (reading lens). Replaced the thin "Integration" list (#8).

### Documentation

- **Teacher-guide direction (planned, #8).** Teacher-facing guides across the ecosystem (Teaching Suite, QuestionForge, Assessment Suite) will be written in English from a shared template extracted from Assessment Suite, with worked examples that are **fully fabricated** — not real-but-anonymised. Examples will be grounded in a shared, deliberately fabricated **demo course (RFC-009)**, which can also ship as a try-it sandbox.

### Fixed

- **SECURITY.md — corrected the supported-version table** from 0.8.x to 0.5.x; it had been copied from a sibling project and did not match this product's version.

## [0.5.0] - 2026-06-06

Initial public release.

- 24 MCP tools for teacher workflows — idea capture, reflection, lesson and
  course planning, methodology loading, and source tracking.
- Methodology v3.0: three nested cycles — *lesson*, *course*, *profession*.
- Workspace-locked file operations; no network access.
- Licensed PolyForm Noncommercial 1.0.0 (see ADR-008); bilingual — code in
  English, methodology and UX in Swedish (see ADR-007).
