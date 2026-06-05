# Bloom's Level Classification — LLM Prompt Template

**Document:** bloom_classification.md
**Purpose:** Classify teacher questions and learning activities by Bloom's cognitive level
**Taxonomy:** Anderson & Krathwohl (2001), revised Bloom's taxonomy
**Used by:** `post_lesson_refl.md`, pedagogical-analysis prompts (alignment check)
**Confidence:** MEDIUM (~70–80% accuracy)
**Reference:** Bloom's revised taxonomy (Anderson & Krathwohl, 2001)

---

## Prompt — For Questions

```
Classify each teacher question by Bloom's cognitive level (1–6):

1 REMEMBER  — Recall facts. Signals: "vad heter", "lista", "definiera"
2 UNDERSTAND — Explain meaning. Signals: "förklara", "beskriv", "varför" (rehearsed)
3 APPLY     — Use in new context. Signals: "vad händer om", "tillämpa", "beräkna"
4 ANALYSE   — Find relationships. Signals: "jämför", "klassificera", "hur skiljer sig"
5 EVALUATE  — Judge with criteria. Signals: "bedöm", "motivera", "vilken är bäst"
6 CREATE    — Produce new. Signals: "designa", "formulera", "konstruera"

Rules:
- Classify based on what the student must DO to answer, not the topic complexity
- If the teacher says "tänk på varför" but accepts a one-word answer, classify
  based on what was actually demanded (level 1, not level 4)
- "Compare" and "contrast" are always at minimum level 4
- "Why" questions: level 2 if expecting a textbook explanation, level 4 if
  expecting original analysis

For each question, provide:
1. The question (quoted)
2. Bloom's level (1–6)
3. Brief justification
```

---

## Prompt — For Activities

```
Classify each learning activity by the highest Bloom's level it demands:

Activity types and typical levels:
- Lecture (listen/note): 1–2
- Read and summarise: 2
- Label/identify exercise: 1
- Explain to partner: 2–3
- Open discussion: 2–4 (classify based on the questions asked)
- Problem-solving: 3–4
- Compare/contrast task: 4
- Debate or evaluation: 5
- Design/create task: 6

For each activity from the lesson plan, provide:
1. Activity name and description
2. Bloom's level (1–6)
3. Brief justification
```

---

## Output Format

```yaml
question_levels:
  - text: "Vad heter den här delen?"
    blooms_level: 1
    justification: "Factual recall of anatomical name"
  - text: "Jämför elektrisk och kemisk signalering"
    blooms_level: 4
    justification: "Requires finding relationships between two processes"

activity_levels:
  - name: "Föreläsning — nervcellens delar"
    blooms_level: 2
    justification: "Students listen and process explanation"
  - name: "Pararbete — identifiera signalvägen"
    blooms_level: 1
    justification: "Labelling task, factual recall"

alignment_check:
  - objective: "Jämför elektrisk och kemisk signalering"
    objective_level: 4
    highest_activity_level: 2
    aligned: false
    gap: "No activity at analyse level"
```

---

## Accuracy Notes

- Bloom's level classification is more reliable at the extremes (level 1 and level 6) than in the middle (levels 2–4)
- The boundary between level 2 (Understand) and level 4 (Analyse) is the most common disagreement
- Context and student response matter: the same question can function at different levels depending on what answer is accepted
- Always report as MEDIUM confidence
- See Bloom's revised taxonomy (Anderson & Krathwohl, 2001) for the full reference

---

**Version:** 1.0
**Created:** 2026-02-24
