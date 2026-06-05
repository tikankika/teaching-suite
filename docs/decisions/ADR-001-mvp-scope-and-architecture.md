# ADR-001: MVP Scope and Architecture

**Status:** Accepted
**Date:** 2026-01-02
**Author:** Niklas + Claude Desktop

---

## Context

Teaching Suite needs to deliver value quickly while remaining manageable for solo development. The Discovery Brief identified 7 potential processes and 4 key architectural decisions. We need to decide what to build first and how.

## Options Considered

### D1: MVP Scope

**Option A: All 7 processes**
- Pros: Complete solution
- Cons: High effort, scope creep risk, delayed value

**Option B: Core 3 (capture_idea, post_lesson_reflection, plan_lesson)**
- Pros: Addresses main pain points (1,2,3,4b,8,10), manageable scope
- Cons: Missing goal tracking and critical friend

**Option C: Just capture_idea**
- Pros: Fastest to build
- Cons: Limited value, doesn't show full potential

### D2: Obsidian Integration

**Option A: Just read/write files**
- Pros: Simplest
- Cons: No structure benefits

**Option B: Create `[[wikilinks]]` and `#tags`**
- Pros: Enables Obsidian graph, searchable, connected
- Cons: Must understand Obsidian format

**Option C: Full Obsidian plugin**
- Pros: Deep integration
- Cons: Very complex, different tech stack

### D3: Memory/State Storage

**Option A: metadata.yaml per course folder**
- Pros: Simple, portable, git-friendly, Nextcloud-safe
- Cons: Manual sync between courses

**Option B: Central database**
- Pros: Powerful queries
- Cons: Complex, sync issues, overkill

**Option C: Obsidian's native index**
- Pros: Already exists
- Cons: Dependency on Obsidian internals

### D4: Template System

**Option A: Hardcoded templates**
- Pros: Simple
- Cons: Hard to customise

**Option B: Configurable templates in `/templates/`**
- Pros: Flexible, teacher can customise
- Cons: More to maintain

**Option C: Obsidian Templates plugin**
- Pros: Existing solution
- Cons: External dependency

## Decision

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **D1** | Option B (Core 3) | Best value-to-effort ratio. Addresses 6 of 10 pain points |
| **D2** | Option B (Links + Tags) | Enables Obsidian features without plugin complexity |
| **D3** | Option A (metadata.yaml) | Simple, portable, works with Nextcloud sync |
| **D4** | Option B (Configurable) | Flexibility for teacher customization |

### MVP Process Priority

1. **capture_idea** - Simplest, immediate value, foundation for others
2. **post_lesson_reflection** - Uses transcripts (rich data exists)
3. **plan_lesson** - Builds on reflection data, enables KURS101_2026

## Consequences

### Positive
- Focused scope = faster delivery
- Core 3 processes address main pain points
- Obsidian integration enables existing workflows
- metadata.yaml is portable and debuggable

### Negative
- Goal tracking (RFC-001) delayed
- Critical friend (RFC-004) delayed
- No course_design yet (relevant for KURS101_2026)

### Trade-offs
- Simplicity over power (can extend later)
- Files over database (less query power, more portable)
- Obsidian-aware but not Obsidian-dependent

## Validation

To be added after implementation:
- [ ] capture_idea works end-to-end
- [ ] Ideas are findable in Obsidian
- [ ] Metadata tracks files correctly

---

*This ADR documents the MVP decisions for Teaching Suite*
