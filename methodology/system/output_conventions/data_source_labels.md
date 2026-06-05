# Data Source Labels

**Document:** data_source_labels.md
**Purpose:** Standard labels for traceability — every claim names its source
**Used by:** `post_lesson_refl.md` (Gibbs steps 3–4), pedagogical-analysis prompts
**Related:** [[confidence_levels]], [[limitations]]

---

## Standard Labels

| Label | Meaning | Typical Files | Confidence |
|-------|---------|--------------|------------|
| **TRANSCRIPT** | From KB-Whisper transcription + pyannote diarization | `data_recordings_lessons/*.txt` | HIGH (timing), MEDIUM (content classification) |
| **ASSESSMENT** | From Assessment Suite output | `Teacher_Insights.md`, `Class_Summary_Formative.md` | HIGH |
| **PLAN** | From the lesson plan | `Lesson_Plans/*.md` | HIGH |
| **TEACHER_NOTE** | From the teacher's own words in dialogue or written notes | Reflections, daily notes | — (subjective, not AI-rated) |
| **DERIVED** | Calculated by combining two or more sources | N/A — computed | Inherits lowest source confidence |
| **FRAMEWORK** | Referenced from pedagogical theory, not from lesson data | pedagogical theory, research literature | N/A — theoretical reference |

---

## Usage in Practice

### In Reflection Output (YAML)

```yaml
insights:
  problematic:
    - insight: "70% missade dendritens funktion"
      source: "ASSESSMENT: Teacher_Insights.md Q2"
      confidence: HIGH
    - insight: "Fokuserande frågor: 3/12"
      source: "TRANSCRIPT: LLM-klassificering av transkript"
      confidence: MEDIUM
```

### In Prose (Gibbs Steps 3–4)

```
Bedömningsdata visar att 70% missade dendritens funktion (KÄLLA: ASSESSMENT,
Teacher_Insights.md Q2, KONFIDENS: HÖG).

Transkriptanalysen identifierade 3 fokuserande frågor av 12 totalt (KÄLLA:
TRANSCRIPT, LLM-klassificering, KONFIDENS: MEDIUM — ~75% noggrannhet).

Läraren noterade att diskussionen "kändes kort" (KÄLLA: TEACHER_NOTE).

Jämförelse av föreläsningstid (22 min) med bedömningsresultat (Q2: 45%)
antyder att passivt lyssnande var ineffektivt (KÄLLA: DERIVED —
TRANSCRIPT × ASSESSMENT, KONFIDENS: MEDIUM).

Biggs' constructive alignment (KÄLLA: FRAMEWORK) förklarar varför: om
lärandemålet är på Bloom's nivå 4 men aktiviteten på nivå 1–2, kan vi
inte förvänta oss analysresultat.
```

---

## Rules

1. **Every AI-generated claim has a source label.** No exceptions.
2. **DERIVED inherits the lowest confidence** of its component sources. If one source is HIGH and another is MEDIUM, the derived insight is MEDIUM.
3. **TEACHER_NOTE is never confidence-rated.** The teacher's perception is valid input but not AI-assessed.
4. **FRAMEWORK is never confidence-rated.** It is a theoretical reference, not an empirical claim about this specific lesson.
5. **Multiple sources strengthen confidence** but do not automatically elevate it. Two MEDIUM sources remain MEDIUM — they are corroborative, not cumulative.

---

**Version:** 1.0
**Created:** 2026-02-24
