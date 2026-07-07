---
type: decision
status: active
created: 2026-07-07
origin: code
project: teaching-suite
relates_to: [ADR-007]
---

# ADR-009: Root `CLAUDE.md` is dev-tooling — the public reference lives in `docs/ARCHITECTURE.md`

## Context

ACDM ADR-017 (2026-06-24) settled that `.claude/` is local dev-tooling and is
gitignored in every downstream repo; the public form of any policy lives in
conventional docs. It left one artefact undecided for this repo: the root
`CLAUDE.md`, which teaching-suite alone in the family still shipped publicly
(QuestionForge and Assessment Suite never tracked theirs; edusafe-pipeline
excludes it at its public flip). The file doubled as the project's architecture
and tool reference, and README's developer door linked to it.

## Problem

Should teaching-suite keep shipping its root `CLAUDE.md` publicly, or align
with the family boundary — and if it aligns, where does the architecture
reference go?

## Alternatives considered

1. **Keep `CLAUDE.md` public.** It contained nothing sensitive and served as
   the developer reference. Rejected: it is an agent-instruction file by name
   and convention, and keeping it tracked leaves the family inconsistent —
   the same rationale ADR-017 rejected for `.claude/rules/`.
2. **Keep it public and document the exception.** Rejected: the exception has
   no benefit over a conventional docs file; readers expect architecture in
   `docs/`, not in an agent file.
3. **Exclude it; move the reference to `docs/ARCHITECTURE.md`. (chosen)**
   The content is architecture documentation and gets a human-facing home;
   the agent file becomes local dev-tooling like everything else under
   `.claude/`.

## Decision

- The architecture and full tool reference lives in **`docs/ARCHITECTURE.md`**
  (tracked, public, human-facing).
- Root **`CLAUDE.md` is untracked and gitignored** (`/CLAUDE.md`,
  root-anchored). It remains on disk as a thin local pointer that imports
  `docs/ARCHITECTURE.md`, so agent sessions and public readers share one
  source of truth — the architecture is edited in `docs/ARCHITECTURE.md`,
  never in the pointer.

## Consequences

- No public repo in the family ships agent-instruction files; the B7
  exclusion (`.claude/` out of the public artefact) extends to root
  `CLAUDE.md`.
- All public links (README developer door, TEACHER_GUIDE, EXAMPLES_POLICY,
  examples, methodology) point at `docs/ARCHITECTURE.md`.
- The historical `CLAUDE.md` revisions remain in git history; nothing
  sensitive was in them (reviewed — architecture reference only).
- A fresh clone has no root `CLAUDE.md`; contributors read
  `docs/ARCHITECTURE.md`, and ACDM's `init_project` can seed a local pointer
  where needed.
