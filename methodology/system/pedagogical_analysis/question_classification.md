# Question Classification — LLM Prompt Template

**Document:** question_classification.md
**Purpose:** Classify teacher questions from transcript into focusing, funneling, closed, or rhetorical
**Taxonomy:** Demszky, D., et al. (2023)
**Used by:** `post_lesson_refl.md`, pedagogical-analysis prompts (transcript analysis)
**Confidence:** MEDIUM (~70–80% accuracy)

---

## Prompt

When analysing a transcript segment, use this classification framework:

```
Classify each teacher question in the following transcript into one of four types:

FOCUSING — Directs student attention to a key concept while allowing multiple
valid responses. Encourages reasoning and explanation.
  Examples: "Varför tror ni dendriterna ser ut som de gör?"
            "Vad skulle hända om myelinskidan försvann?"
            "Hur hänger detta ihop med det vi pratade om förra veckan?"

FUNNELING — Guides students towards a specific answer through a sequence of
narrowing questions. Checks understanding of a particular point.
  Examples: "Är det dendriter eller axon som tar emot signaler?"
            "Och vad kallas det ämne som frisätts i synapsen?"
            "Så om vi sätter ihop det — vad blir slutresultatet?"

CLOSED — Single correct answer expected. Tests factual recall.
  Examples: "Vad heter den här delen?"
            "Hur många kromosomer har en människa?"
            "Är fotosyntes en endoterm eller exoterm reaktion?"

RHETORICAL — No answer expected. Used for engagement or transition.
  Examples: "Visst är det fascinerande?"
            "Ska vi gå vidare?"
            "Har ni tänkt på det?"

For each question, provide:
1. The question (quoted from transcript)
2. Classification (FOCUSING / FUNNELING / CLOSED / RHETORICAL)
3. Brief justification (one sentence)

If a question is ambiguous, classify based on how it functioned in context —
did students give extended reasoning (→ FOCUSING) or a single-word answer
(→ CLOSED)?
```

---

## Output Format

```yaml
questions:
  - text: "Varför tror ni dendriterna ser ut som de gör?"
    type: focusing
    justification: "Open-ended, invites reasoning about structure-function relationship"
    timestamp: "00:15:32"

  - text: "Vad heter den här delen?"
    type: closed
    justification: "Single correct answer expected (dendrit/axon/soma)"
    timestamp: "00:08:45"

  - text: "Är det dendriter eller axon som tar emot?"
    type: funneling
    justification: "Binary choice guiding towards specific understanding"
    timestamp: "00:12:10"

summary:
  focusing: 3
  funneling: 2
  closed: 6
  rhetorical: 1
  total: 12
  focusing_ratio: 0.25
```

---

## Accuracy Notes

- LLM classification achieves approximately 70–80% agreement with human raters
- The boundary between FOCUSING and FUNNELING is the most common disagreement
- Context matters: the same question can be FOCUSING in one context and FUNNELING in another
- Always report as MEDIUM confidence
- If the teacher disagrees with a classification, defer to the teacher

---

**Version:** 1.0
**Created:** 2026-02-24
