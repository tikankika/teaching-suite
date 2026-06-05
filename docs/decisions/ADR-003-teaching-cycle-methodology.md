# ADR-003: Teaching Cycle Methodology Structure

**Status:** Accepted  
**Date:** 2026-01-28  
**Author:** Niklas Karlsson + Claude Desktop  
**Related:** [[ADR-001]]

---

## Context and Problem Statement

The teaching cycle consists of two interconnected processes:
1. **plan_lesson** - Planning before a lesson (forward-looking)
2. **post_lesson_reflection** - Reflecting after a lesson (backward-looking)

These processes share:
- Same pedagogical principles
- Same data sources (curriculum, previous lessons, reflections)
- Same theoretical foundation
- Same workflow patterns (context gathering, guided dialog, structured output)

BUT they have different purposes and different specific guidance.

**Key Question:** How do we structure methodology to avoid duplication while maintaining clarity?

---

## Decision Drivers

* **Avoid Duplication:** Don't write the same principles twice
* **Clarity:** Each tool should have clear, specific guidance
* **Proven Pattern:** Assessment_suite uses progressive methodology loading successfully
* **Methodology-Driven:** Logic in `.md` files, not hardcoded in TypeScript
* **Maintainability:** Changes to shared principles should propagate to both tools
* **Teacher Control:** Teacher decides what methodology to load and when

---

## The 3+5 Problem

A critical challenge emerged during RFC-007 discussion:

**For a lesson on "fotosyntes" (2025-09-15), we have:**
```
File 1: lektionsplanering_2025-09-15_fotosyntes.md  (PLAN - what we intended)
File 2: transkription_2025-09-15_fotosyntes.txt     (ACTUAL - what happened)
File 3: daily_note_2025-09-15.md                    (REFLECTION - learnings)
```

**When planning NEXT fotosyntes lesson:**
- Read only (1)? → Miss what actually happened
- Read only (2)? → Miss intention and insights
- Read only (3)? → Miss plan and reality
- Read all 3 separately? → Confusing, redundant, hard to synthesize

**This must be solved systematically in methodology.**

---

## Considered Options

### Option A: Separate Methodology Folders
```
methodology/
├── plan_lesson/
│   ├── shared_principles.md
│   ├── pedagogical_foundation.md
│   └── planning_specific.md
└── post_lesson_reflection/
    ├── shared_principles.md  # DUPLICATE!
    ├── pedagogical_foundation.md  # DUPLICATE!
    └── reflection_specific.md
```

**Pros:** Clear separation, each tool has its own folder  
**Cons:** Duplication, divergence risk, harder maintenance

---

### Option B: One Methodology Folder, Shared Docs
```
methodology/processes/teaching-cycle/
├── 00_shared_principles.md       # BOTH read
├── 01_pedagogical_foundation.md  # BOTH read
├── 02_context_gathering.md       # BOTH read (solves 3+5!)
├── 03_pre_lesson_planning.md     # Only plan_lesson reads
├── 04_post_lesson_reflection.md  # Only post_lesson_reflection reads
└── 05_lesson_metadata.md         # BOTH read
```

**Pros:** No duplication, single source of truth, shared solving of 3+5  
**Cons:** Must be clear which docs each tool reads

---

### Option C: Monolithic Document
```
methodology/teaching_cycle.md  (single 100+ KB file)
```

**Pros:** Everything in one place  
**Cons:** Too large to load at once, no progressive loading, hard to navigate

---

## Decision Outcome

**Chosen Option:** Option B - One Methodology Folder, Shared Docs

### Rationale

1. **Proven Pattern:** Assessment_suite uses this successfully
   - Shared: `phases9-12_ai_assisted_methodology.md`
   - Specific: `phase9_generalization_methodology.md`, etc.

2. **Single Source of Truth:** Shared principles defined once
   - Changes propagate automatically
   - No risk of divergence

3. **Solves 3+5 Systematically:** `02_context_gathering.md` defines strategy once
   - Both tools apply same logic
   - Consistent historical search

4. **Progressive Loading:** Teacher controls what to load
   - Can skip docs they already know
   - Transparent what each tool needs

---

## Detailed Decisions

### D1: Progressive Loading (Q1 from RFC-007)

**Decision:** Progressive methodology loading ✅

**Approach:**
```typescript
// New tool for loading methodology
teaching_cycle_methodology(index: number)
→ Returns: { document: { name, content }, progress: { current, total } }

// Workflow example:
1. plan_lesson("fotosyntes")
   → Returns: { methodology_available: ["00_shared...", "01_pedagogical..."] }

2. Claude Desktop: "Vill du ladda metodologi först?"

3. teaching_cycle_methodology(0)  // Loads 00_shared_principles.md
4. teaching_cycle_methodology(1)  // Loads 01_pedagogical_foundation.md
5. teaching_cycle_methodology(2)  // Loads 02_context_gathering.md
...
```

**Why Progressive (not automatic)?**
- Teacher may already know principles
- Allows skipping irrelevant docs
- Transparent which docs exist
- Mirrors proven Assessment_suite pattern

---

### D2: Lesson Summary Strategy (Q2 from RFC-007)

**Decision:** Part of reflection process + separate tool ✅

**Approach:**
```
post_lesson_reflection workflow:
  1. Load methodology (progressive)
  2. Gather context (plan, transcript)
  3. Guide reflection dialog
  4. Save reflection to Daily notes/
  5. ASK: "Skapa lesson summary? (Rekommenderas för framtida planering)"
     → If YES: Call summarize_lesson() internally
     → If NO: Skip

Separate tool for retroactive use:
  summarize_lesson(lesson_date, topic)
  → Finds: plan + transcript + reflection
  → Generates: Lesson summaries/YYYY-MM-DD-topic_SUMMARY.md
```

**This solves the 3+5 problem:**
```
Instead of reading 3 separate files:
  lektionsplanering_2025-09-15_fotosyntes.md  (plan)
  transkription_2025-09-15_fotosyntes.txt     (transcript)
  daily_note_2025-09-15.md                    (reflection)

We create ONE synthesized file:
  Lesson summaries/2025-09-15-fotosyntes_SUMMARY.md
  ├─ Planned vs Actual (comparison)
  ├─ What worked
  ├─ What didn't work
  ├─ Key insights
  └─ Recommendation for next time
```

**When planning next lesson:**
- `plan_lesson` searches for summaries FIRST
- Falls back to individual files if summary doesn't exist
- Teacher can create summaries retroactively

**Why this approach?**
- Optional (not forced) - teacher decides value
- Solves 3+5 systematically
- Enables better historical search
- Can be created retroactively for old lessons

---

### D3: Transcript Analysis (Q3 from RFC-007)

**Decision:** Offer analysis, don't force ✅

**Approach:**
```
post_lesson_reflection workflow:
  ...
  3. If transcript found:
     → Display: "Transkription finns: recordings/2026-01-28.txt"
     → OFFER: "Vill du att jag analyserar transkriptionen?"
              "(tidsjämförelse, topics, keywords)"
        - If YES: Read transcript, extract insights, include in reflection
        - If NO: Make available but don't analyse
  ...
```

**Why offer, not automatic?**
- Transcripts are valuable as-is for teacher reading
- Analysis is part of DIALOG (teacher + Claude)
- Keeps complexity low for MVP
- Future: separate `analyze_transcript()` tool for advanced use

---

### D4: Tool Architecture (Q4 from RFC-007)

**Decision:** Two main tools + sub-tools + core tool reuse ✅

**Architecture:**
```
MAIN TOOLS (process orchestration):
├── plan_lesson
│   ├─ Uses: file_search (find history)
│   ├─ Uses: file_read (read curriculum, reflections)
│   ├─ Uses: intelligent_save (save lesson plan)
│   └─ Can trigger: teaching_cycle_methodology (progressive loading)
│
└── post_lesson_reflection
    ├─ Uses: file_search (find lesson plan)
    ├─ Uses: file_read (read plan, transcript)
    ├─ Uses: intelligent_save (save reflection)
    ├─ Can trigger: summarize_lesson (if user wants)
    └─ Can trigger: teaching_cycle_methodology (progressive loading)

SUB-TOOLS (specific tasks):
├── summarize_lesson(lesson_date, topic)
├── teaching_cycle_methodology(index)
└── analyze_transcript(file, lesson_plan?) [FUTURE]

CORE TOOLS (reused):
├── intelligent_save (RFC-005) ✅
├── file_search (exists) ✅
├── file_read (exists) ✅
└── file_write (exists) ✅
```

**Why this architecture?**
- **Separation of concerns:** plan ≠ reflect (different purposes)
- **Composition over monoliths:** Thin orchestration, heavy reuse
- **Single responsibility:** Each tool does ONE thing well
- **Proven pattern:** RFC-006 (teaching-suite refactoring) uses this

---

## Methodology Document Structure

### Shared Documents (read by BOTH tools)

| Doc | Size Est. | Content | Read By |
|-----|-----------|---------|---------|
| `00_shared_principles.md` | ~3 KB | Core philosophy, values, teaching cycle concept | Both |
| `01_pedagogical_foundation.md` | ~5 KB | Theoretical framework (constructivism, SRL, etc.) | Both |
| `02_context_gathering.md` | ~7 KB | **How to solve 3+5 problem**, search strategies | Both |
| `05_lesson_metadata.md` | ~3 KB | YAML structure, tags, wikilinks, file organisation | Both |

**Total Shared:** ~18 KB

### Specific Documents (read by ONE tool)

| Doc | Size Est. | Content | Read By |
|-----|-----------|---------|---------|
| `03_pre_lesson_planning.md` | ~8 KB | Structure generation, duration-based templates, dialog prompts | plan_lesson only |
| `04_post_lesson_reflection.md` | ~8 KB | Reflection questions, comparison strategies, learning extraction | post_lesson_reflection only |

**Total Specific:** ~16 KB

**Grand Total:** ~34 KB (manageable, progressive)

---

## Loading Strategy

### plan_lesson loads (in order):
1. `00_shared_principles.md`
2. `01_pedagogical_foundation.md`
3. `02_context_gathering.md` ← **Critical for 3+5 solution**
4. `03_pre_lesson_planning.md`
5. `05_lesson_metadata.md`

### post_lesson_reflection loads (in order):
1. `00_shared_principles.md`
2. `01_pedagogical_foundation.md`
3. `02_context_gathering.md` ← **Same 3+5 solution**
4. `04_post_lesson_reflection.md`
5. `05_lesson_metadata.md`

**Notice:** 3 of 5 docs are SHARED → consistency guaranteed

---

## Consequences

### Positive

✅ **No duplication** - Shared principles defined once  
✅ **Consistency** - Both tools use same context gathering logic  
✅ **3+5 Problem solved** - Systematically via lesson summaries  
✅ **Teacher control** - Progressive loading, optional analysis  
✅ **Proven pattern** - Mirrors Assessment_suite success  
✅ **Maintainable** - Clear which docs serve which purpose  
✅ **Compositional** - Reuses core tools (intelligent_save, file_search)

### Negative

⚠️ **More tools** - 3 new tools (main + sub + methodology loader)  
⚠️ **More docs** - 6 methodology docs to create and maintain  
⚠️ **Learning curve** - Teacher must understand progressive loading  

### Mitigations

- **More tools:** But each is simpler, follows single responsibility
- **More docs:** But total 34 KB is manageable, progressive loading helps
- **Learning curve:** Claude Desktop guides the process, can auto-suggest

---

## Validation

### Methodology Structure
- [ ] All 6 docs created in `methodology/processes/teaching-cycle/`
- [ ] No duplication between shared docs
- [ ] Each doc has clear purpose and scope

### Progressive Loading
- [ ] `teaching_cycle_methodology(index)` implemented
- [ ] Claude Desktop can load docs in sequence
- [ ] Teacher can skip docs they know

### 3+5 Solution
- [ ] `02_context_gathering.md` defines lesson summary strategy
- [ ] `summarize_lesson()` creates summaries correctly
- [ ] `plan_lesson` searches summaries first, falls back to individual files
- [ ] Retroactive summarization works for old lessons

### Tool Integration
- [ ] Both main tools use same core tools (intelligent_save, file_search)
- [ ] No code duplication between tools
- [ ] Workflow feels natural to teacher

---

## Implementation Notes

### Priority for Methodology Creation

**Phase 1a: Critical Foundation (write FIRST)**
1. `00_shared_principles.md` - Philosophy
2. `02_context_gathering.md` - **Solves 3+5!**

**Phase 1b: Theoretical (write SECOND)**
3. `01_pedagogical_foundation.md` - Framework

**Phase 1c: Tool-Specific (write THIRD)**
4. `03_pre_lesson_planning.md` - For plan_lesson
5. `04_post_lesson_reflection.md` - For post_lesson_reflection

**Phase 1d: Structural (write LAST)**
6. `05_lesson_metadata.md` - YAML, tags, links

**Rationale:** 
- Foundation + 3+5 solution = critical path
- Can start implementing tools after Phase 1a+1b
- Tool-specific docs can be refined based on implementation feedback

---

## REVISION: Simplified Design (2026-01-28)

**Context:** After creating initial methodology docs (00, 02), Code performed critical analysis.

**Key Finding:** "Reflektionen ÄR syntesen" - we were overcomplicating.

### What Changed:

**REMOVED from Q2 (Lesson Summary Strategy):**
- ❌ Separate lesson summary files
- ❌ summarize_lesson tool  
- ❌ Lesson summaries/ folder
- ❌ Ask user "create summary?" workflow

**NEW APPROACH:**
- ✅ Structured YAML frontmatter IN reflection
- ✅ `planned_vs_actual`, `insights`, `recommendation` fields
- ✅ Reflection file contains synthesis directly
- ✅ No extra step, no extra file

**Impact on Methodology Docs:**

`02_context_gathering.md` revised:
- v0.1: Described lesson summaries as solution
- v0.2: Describes structured reflection as solution
- Result: Simpler, more maintainable

**Impact on Implementation Priority:**

Original (from Q4):
```
1. plan_lesson.ts
2. post_lesson_reflection.ts
3. summarize_lesson.ts
```

Revised:
```
1. post_lesson_reflection.ts (creates data)
2. plan_lesson.ts (consumes data)
```

**Rationale:** Logical dependency - build producer before consumer

### Updated Decisions:

**Q2: Lesson Summary Strategy** → NOW: **Structured Reflection Format**

Decision: YAML Frontmatter + Free Text Body

Implementation:
```yaml
# Daily notes/YYYY-MM-DD.md
---
type: reflection
lesson: "[[path]]"
topic: ...
planned_vs_actual: {...}  # Solves 3+5!
insights:
  worked: [...]
  didnt_work: [...]
recommendation: "..."
---

[Free text narrative]
```

**Q4: Tool Architecture** → UPDATED

Removed:
- `summarize_lesson` sub-tool

Kept:
- `plan_lesson` (main)
- `post_lesson_reflection` (main)
- `teaching_cycle_methodology` (sub-tool)
- `analyze_transcript` (future sub-tool)

**Result:** 2 main tools (not 3), simpler architecture

---

## Related Decisions

* **RFC-007:** Teaching Cycle Architecture (parent document)
* **ADR-001:** MVP Scope (plan_lesson + post_lesson_reflection are Core 3)
* **RFC-005:** intelligent_save (core tool reused)
* **RFC-006:** teaching-suite refactoring (compositional pattern)
* **Assessment_suite ADR-003:** Progressive methodology loading (inspiration)

---

## Open Questions for Future

**Q1:** Should we create a visual diagram of methodology structure?
- Could help teacher understand what exists

**Q2:** Should methodology docs include examples from real lessons?
- Pros: Concrete, relatable
- Cons: Maintenance burden as courses change

**Q3:** Should we version methodology docs?
- If pedagogy changes, how do we track evolution?

---

**Status:** ✅ ACCEPTED (2026-01-28)  
**Last Updated:** 2026-01-28  
**Next Review:** After Phase 1 (methodology creation) - iterate based on feedback
