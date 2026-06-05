---
type: decision
status: active
created: 2026-05-27
origin: code
project: Teaching Suite
relates_to: [ADR-007-bilingual-language-policy]
---

# ADR-008: License — PolyForm Noncommercial 1.0.0

**Status:** Active
**Date:** 2026-05-27
**Author:** Niklas + Claude (Code)

---

## Context

Teaching Suite is being prepared for a public/open-source release. A licence
review found that the project carried **three contradictory signals**:

- The `LICENSE` file was Creative Commons Attribution-NonCommercial-ShareAlike
  4.0 (CC BY-NC-SA) — a content licence, noncommercial.
- `package.json` declared `"license": "MIT"` — a software licence, permissive,
  commercial use allowed.
- No single, authoritative answer for the question a public reader actually
  asks: *may I use this commercially?*

MIT and CC BY-NC-SA give opposite answers on commercial use, so a reader
comparing the two files would not know which governs.

## Problem

What licence should govern a public release of Teaching Suite, given that (a) it
is software, not prose or data, and (b) the maintainer's intent is to permit
educational and research use but not commercial exploitation?

## Alternatives considered

**(a) MIT (or another permissive licence).**
- *Pros:* maximal adoption; familiar to contributors; minimal friction.
- *Cons:* permits commercial use, which contradicts the maintainer's intent;
  contradicts the existing noncommercial `LICENSE` file.

**(b) Keep CC BY-NC-SA 4.0.**
- *Pros:* already in the `LICENSE` file; noncommercial intent is correct.
- *Cons:* Creative Commons itself advises against using CC licences for
  software — they have no patent grant and no warranty/liability terms suited
  to code. A poor fit for a distributable software package.

**(c) PolyForm Noncommercial 1.0.0 — CHOSEN.**
- *Pros:* purpose-built **software** licence that permits any noncommercial
  purpose (explicitly including educational institutions and public research
  organisations — the project's audience), while reserving commercial use;
  includes patent and liability terms that CC lacks; has a recognised SPDX
  identifier (`PolyForm-Noncommercial-1.0.0`) so tooling can resolve it.
- *Cons:* less universally recognised than MIT; noncommercial licences are not
  OSI "open source", so the project is *source-available*, not OSI-open.

## Decision

Adopt **(c) PolyForm Noncommercial 1.0.0**. It encodes the intended permission
(noncommercial use, including by educational and research organisations) in a
licence designed for software, and it removes the MIT/CC contradiction by being
the single authority. This also aligns the wider tool family on a consistent
noncommercial, software-appropriate licence.

## Consequences

- The `LICENSE` file now contains the canonical PolyForm Noncommercial 1.0.0
  text, with a `Required Notice:` carrying the copyright line.
- `package.json` `"license"` is the SPDX identifier
  `PolyForm-Noncommercial-1.0.0` (was `MIT`).
- The project is **source-available, not OSI open source**. Documentation that
  calls it "open source" should be read as "publicly available under a
  noncommercial licence".
- Commercial use requires a separate licence from the copyright holder.
- Authorship/copyright attribution is retained (the maintainer publishes under
  their own name); this is deliberate and not subject to anonymisation.
