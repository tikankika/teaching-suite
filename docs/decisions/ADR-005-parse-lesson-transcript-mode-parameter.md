---
type: decision
status: active
created: 2026-05-10
origin: code
project: Teaching Suite
relates_to: [ADR-003-teaching-cycle-methodology]
---

# ADR-005: parse_lesson_transcript — mode parameter for safe pagination

**Status:** Active
**Date:** 2026-05-10
**Author:** Niklas + Claude (Code, post-mortem from Cowork 2026-05-09)

---

## Context

`parse_lesson_transcript` parses pyannote-formatted transcripts and returns
structured segment data. The current contract returns the full segment array
plus `text_flat` (the same content concatenated again) plus `total_chars` in a
single response. For a 236k-character lesson transcript the JSON wire payload
is ~2× the content — well above the practical MCP tool-result limit (~50–65 kB).

On 2026-05-07 the post_lesson_auto process failed at the transcript-ingest
stage because the `parse_lesson_transcript` response overflowed the transport.
The Cowork-side caller fell back to a degraded methodology path (oral report)
rather than escalating the read failure. The full post-mortem is in the Cowork
note dated 2026-05-10.

The same constraint already drove the v0.5.0 `load_methodology` redesign
(path-only return). `parse_lesson_transcript` is the next tool with the same
shape problem.

A non-negotiable constraint applies: **post_lesson_auto must analyse the entire
transcript**. Full coverage is the basis of the `full_coverage: true` guarantee
the tool gives today. Any redesign must preserve that guarantee.

## Problem

The default response shape is unsafe for the common case (real lesson
transcripts of 30–250k characters). Caller has no way to ask for less data,
and no way to request data in chunks.

## Alternatives considered

### A. `summary` default + paginated `segments` mode (chosen)

- Default response is metadata only (~300 bytes).
- Caller iterates `mode: 'segments'` with `segment_offset` + `segment_limit`
  until `has_more: false`.
- Each segments response carries a `coverage` object so methodology can enforce
  "no auto-log unless coverage.complete is true".
- **Pros:** Default is safe. Wire-size bounded. Full coverage preserved by
  iteration. Same pattern as `file_read` (offset/limit + has_more) and
  `load_methodology` v0.5.0 (path-only).
- **Cons:** Breaking change. Existing callers that rely on `result.segments`
  in default mode must migrate (set `mode: 'full'` explicitly or switch to
  the iteration pattern).

### B. `full` default + deprecation warning at total_chars > 50k

- Default behaviour preserved. New `mode` parameter is opt-in.
- Warning field added to response when payload approaches limit.
- **Pros:** Non-breaking. No caller migration.
- **Cons:** The warning is embedded in the same response that overflows the
  transport. When the warning is most needed, it is in a payload the caller
  cannot read. Default remains the bug. Methodology must carry the entire
  burden of preventing the failure.

### C. Drop `text_flat`, keep `segments` as default

- Halves wire-size but does not solve the problem for large transcripts.
- Pre_lesson-class transcripts (53k content alone) still bust the limit even
  without `text_flat`.

### D. Compress (gzip + base64) the response

- Adds complexity downstream. Does not address the underlying responsibility
  question. Same problem class as load_methodology — solved there by
  separating routing from content delivery, not by compressing.

## Decision

**Option A.** Add a `mode` parameter to `parse_lesson_transcript`:

```ts
mode: z.enum(['summary', 'segments', 'full']).default('summary')
segment_offset: z.number().int().min(0).default(0)
segment_limit: z.number().int().min(1).default(50)
```

- `summary` (default): metadata only — `total_chars`, `total_segments`,
  `total_duration_seconds`, `speaker_count`, `unique_speakers`,
  `diarisation_status`, `full_coverage`. Always safe. Wire ~300 bytes.
- `segments`: paginated segments — `segments[segment_offset..+segment_limit]`
  plus `has_more`, `next_offset`, `coverage: { processed_to, total, complete }`.
- `full`: back-compat — current behaviour, returns segments + text_flat.
  Emits `warning` when `total_chars > 50_000`. Kept for existing callers,
  to be removed in v1.0.

`text_only` mode rejected as redundant — callers needing flat text iterate
`segments` and join `.text`.

**Full coverage is preserved through three layers:**

1. `summary.total_segments` is the hard count. Caller knows exactly how many
   pages remain.
2. `coverage.complete: false` flag in every `segments` response until the
   final page. Methodology uses this as a precondition.
3. Methodology prose in `post_lesson_auto.md` makes the iteration pattern
   explicit and forbids producing auto-log when `coverage.complete` is false.

## Consequences

### Breaking change scope

- **Tool registration** (`src/index.ts`): no signature change at MCP boundary
  (input is opt-in), but default behaviour changes.
- **Tests** (`tests/parse-lesson-transcript.test.ts`): existing tests assume
  segments + text_flat in default response. Update to either pass
  `mode: 'full'` explicitly (back-compat assertion) or migrate to summary +
  segments iteration (forward-looking assertion). Mix of both for coverage.
- **Methodology** (`methodology/lesson/post_lesson_auto.md`,
  `methodology/lesson/post_lesson_refl.md`): tool-section + iteration
  pattern + coverage-enforcement prose.
- **Version**: v0.7.x → v0.8.0. Breaking default behaviour even though the
  schema is additive.

### Risk

If methodology is not updated in lockstep with code, Cowork-Claude will
continue to call `parse_lesson_transcript` without a mode, get the new
`summary` default, and silently produce auto-logs without segment data.
Mitigation: the methodology update is in the same PR as the code change,
and the SYSTEM_INSTRUCTIONS in `src/index.ts:262` already require Cowork
to load methodology before invoking process tools.

### Future deprecation

`mode: 'full'` is back-compat scaffolding. Track removal in v1.0 milestone.
Once no callers reference it (verifiable via grep on methodology + Cowork
session memory), remove it and simplify to two modes (`summary`, `segments`).

## References

- Cowork note 2026-05-10: post-mortem on post_lesson_auto failure
- ADR for `load_methodology` v0.5.0 path-only (precedent for this pattern)
- `src/tools/core/file-read.ts` — offset/limit + has_more pattern (PR #74)
- `methodology/synlighetsprincip.md` — "code is plumbing, methodology is data"
