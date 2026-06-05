---
type: decision
status: active
created: 2026-05-26
origin: code
project: Teaching Suite
relates_to: [ADR-001-mvp-scope-and-architecture]
---

# ADR-007: Bilingual language policy (English code, Swedish methodology/UX)

**Status:** Active
**Date:** 2026-05-26
**Author:** Niklas + Claude (Code)

---

## Context

Teaching Suite is being prepared for a public/open-source release. That prompted a
review of the project's language conventions. Two committed artefacts disagreed:

- `CLAUDE.md` describes a deliberately **bilingual** project — English code,
  Swedish UX strings and methodology.
- `.claude/rules/language-british-english.md` stated that *all* files committed
  to git must be British English, and explicitly listed "methodology docs" as
  subject to that rule.

That contradiction would have driven a language sweep against the ~10,500 lines
of Swedish pedagogical methodology — content that is Swedish by design.

## Problem

What language policy applies to a public repository whose code is meant for
international contributors but whose domain content serves Swedish teachers?

## Alternatives considered

**(a) English-only.** Translate everything, including the methodology, to
English.
- *Pros:* single language; lowest friction for international contributors;
  one language linter, one convention.
- *Cons:* requires translating ~10,500 lines of Swedish pedagogy; the result
  would not serve the primary audience, who think and work in Swedish.

**(b) Bilingual with scope separation — CHOSEN.** English for code and
English-language docs (README, CONTRIBUTING, ADRs); Swedish for UX strings and
methodology.
- *Pros:* serves the primary audience while keeping the codebase accessible to
  international contributors; matches the project's actual structure.
- *Cons:* contributors must understand which content is which; language linters
  and reviews must be scoped to English-language content only.

**(c) Full Swedish.** Swedish across the board, including code.
- *Cons:* not viable — excludes international contributors from the code.

## Decision

Adopt **(b)**. The ~10,500 lines of Swedish methodology are a deliberate
investment for the primary audience — Swedish teachers — not a translation
backlog. Code and English-language documentation use British English so the
project remains approachable to international contributors.

## Consequences

- `language-british-english.md` is scoped to **English-language content**.
  Methodology (`methodology/`), UX strings, and user conversations are listed as
  intentionally Swedish and out of scope for the British-English rule.
- `CLAUDE.md` Language Policy records the rationale so the choice is not
  re-litigated or "corrected" by a future contributor.
- Language sweeps and `/publish-check`'s language axis target English-language
  content only; flagging Swedish methodology as drift is a false positive.
- The policy can be revisited if the audience changes (e.g. an
  international teacher base), which would reopen alternative (a).
