# Key Moments Detection — LLM Prompt Template

**Document:** key_moments.md
**Purpose:** Identify critical teaching moments in a transcript — pivots, breakthroughs, missed opportunities
**Used by:** `post_lesson_refl.md` (Gibbs steps 3–4)
**Confidence:** LOW–MEDIUM (interpretive, context-dependent)

---

## Prompt

```
Analyse the following transcript segment and identify key teaching moments.
A key moment is any point where the interaction shifts, learning visibly
occurs or fails, or the teacher makes a significant pedagogical decision.

Categories:

STUDENT_QUESTION — Student asks a substantive question
  Flag as OPPORTUNITY if the teacher could have used it for deeper learning
  Flag as ADDRESSED if the teacher effectively built on it
  Flag as DEFLECTED if the teacher answered briefly and moved on

CONFUSION_SIGNAL — Evidence of student misunderstanding
  Indicators: incorrect answer, hesitation, "jag förstår inte",
  silence after a question, student restating incorrectly
  Flag with the specific misconception if identifiable

AHA_MOMENT — Evidence of student understanding
  Indicators: "ah, så det är därför!", student explains to peer correctly,
  student asks a follow-up that shows deeper thinking

TEACHER_PIVOT — Teacher deviates from plan in response to classroom dynamics
  Classify as RESPONSIVE (adapted to student needs) or DIGRESSION (lost focus)

MISSED_OPPORTUNITY — Moment where a different teacher response could have
  deepened learning
  Be specific: what happened, what could have happened instead
  NOTE: This is interpretive. Present as a suggestion, not a judgment.

For each moment, provide:
1. Timestamp (from transcript)
2. Category
3. What happened (brief quote or description)
4. Significance (why this moment matters for the reflection)
5. Confidence (HIGH if based on explicit student words, MEDIUM if inferred
   from context, LOW if interpretive)
```

---

## Output Format

```yaml
key_moments:
  - timestamp: "00:14:05"
    category: STUDENT_QUESTION
    flag: DEFLECTED
    description: "Student asked about myelin sheath damage; teacher gave brief
                  factual answer instead of exploring implications"
    significance: "Missed opportunity to connect to real-world applications (MS)
                   and deepen understanding at Bloom's level 3–4"
    confidence: MEDIUM
    suggestion: "Could have asked 'Vad tror ni händer om myelinskidan skadas?'
                 to encourage student reasoning"

  - timestamp: "00:09:20"
    category: AHA_MOMENT
    description: "Student explained nerve signal to partner using own words,
                  correctly describing dendrite → soma → axon pathway"
    significance: "Confirms pair work is generating understanding at Bloom's level 2"
    confidence: HIGH

  - timestamp: "00:07:40"
    category: CONFUSION_SIGNAL
    description: "Several students gave an incorrect answer about dendrite function
                  (said 'sends signals' instead of 'receives')"
    significance: "Indicates dendrite/axon confusion — matches assessment data
                   (Q2: 45% correct)"
    confidence: HIGH

  - timestamp: "00:21:15"
    category: TEACHER_PIVOT
    flag: RESPONSIVE
    description: "Teacher abandoned planned summary to address student question
                  about synaptic transmission"
    significance: "Extended discussion (8 min unplanned) — check if this topic
                   showed better assessment results"
    confidence: HIGH
```

---

## Accuracy Notes

- Key moment detection is the most interpretive analysis task. Confidence is typically LOW–MEDIUM.
- MISSED_OPPORTUNITY is inherently subjective — always present as "one possibility" rather than "the right answer"
- CONFUSION_SIGNAL is most reliable when students explicitly state confusion; inferred confusion from silence is LOW confidence
- AHA_MOMENT is most reliable when students use their own words to explain; excitement alone is not evidence of understanding
- The teacher's context matters. A "deflected" question may have been intentional — the teacher may have planned to return to it later.
- Always invite the teacher to evaluate: "Stämmer detta med din upplevelse?"

---

**Version:** 1.0
**Created:** 2026-02-24
