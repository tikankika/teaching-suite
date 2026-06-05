# Confidence Levels for AI-Generated Insights

**Document:** confidence_levels.md
**Purpose:** Define when the system says "strong evidence" versus "hypothesis"
**Used by:** `post_lesson_refl.md` (Gibbs steps 3–4), pedagogical-analysis prompts
**Related:** [[data_source_labels]], [[limitations]]

---

## Three Levels

### HIGH — Quantitative data, direct measurement

The insight is derived from numerical data with minimal interpretation.

**Examples:**
- "70% of students missed dendrite function" — directly from assessment scores
- "Talk ratio: 62% teacher / 38% student" — from pyannote speaker diarization
- "Lecture ran 22 minutes (planned 15)" — from transcript timestamps
- "Q3 average: 30%" — from Assessment Suite calculations

**When to assign HIGH:**
- Assessment scores (per-question, per-student)
- Timing data from pyannote or transcript timestamps
- Count-based metrics (number of questions, number of student turns)
- Data comes from a tool output, not from LLM interpretation

---

### MEDIUM — Pattern matching, algorithmic inference

The insight is derived from LLM classification or pattern recognition. The underlying data is real, but the interpretation step introduces uncertainty.

**Examples:**
- "3 of 12 questions were focusing" — LLM classified question types (~70–80% accuracy)
- "Student showed confusion at 00:14" — LLM detected confusion signals in transcript
- "Activity at Bloom's level 2, not level 4" — LLM classified against taxonomy
- "Recurring misconception: myelin = insulation only" — LLM identified pattern across responses

**When to assign MEDIUM:**
- LLM classification of question types (Demszky taxonomy)
- LLM classification of Bloom's levels
- Theme or pattern detection across student responses
- Cross-referencing two HIGH-confidence data points to form an inference
- Transcript-derived qualitative observations

**Accuracy note:** LLM-based classification typically achieves 70–80% agreement with human raters for question type and Bloom's level classification. Always state this when presenting MEDIUM-confidence findings.

---

### LOW — Interpretation, limited data, subjective input

The insight relies on interpretation, single observations, or the teacher's recollection rather than systematic data.

**Examples:**
- "Students seemed disengaged during the lecture" — teacher's impression
- "The analogy probably helped" — plausible but not measured
- "Timing was approximately 20 minutes" — teacher recollection, no transcript
- "This misconception likely stems from textbook phrasing" — hypothesis without evidence

**When to assign LOW:**
- Teacher recollection without transcript verification
- Single observations (one student, one moment)
- Pedagogical judgment without data backing
- Hypotheses that have not been tested
- Inferences from very small sample sizes (< 5 students)

---

## Presentation Rules

### Always state confidence

Every AI-generated insight in a reflection or analysis must include its confidence level. No exceptions.

```
KONFIDENS: HÖG — kvantitativ bedömningsdata
KONFIDENS: MEDIUM — LLM-klassificering (~75% noggrannhet)
KONFIDENS: LÅG — baserat på lärarens upplevelse
```

### Never inflate confidence

If the underlying data is MEDIUM, the insight cannot be HIGH — even if the conclusion seems obvious. The confidence level reflects the weakest link in the evidence chain.

### Combine levels transparently

When an insight draws from multiple sources at different confidence levels, state both:

```
KONFIDENS: HÖG för bedömningsdata (Q2: 45%), MEDIUM för diskursklassificering (3/12 fokuserande)
```

### Teacher's perception has no confidence rating

Gibbs step 2 (Feelings) is the teacher's subjective experience. It is not AI-assessed and receives no confidence rating. Mark as:

```
KONFIDENS: — (subjektiv upplevelse, ej AI-bedömd)
```

---

## Mapping to Academic Research Standards

| Our Level | Approximate Equivalent | Suitable For |
|-----------|----------------------|-------------|
| HIGH | Quantitative findings | Reporting as fact in a pilot study |
| MEDIUM | Qualitative coding with inter-rater reliability | Reporting as "analysis suggests" |
| LOW | Researcher memo / field note | Reporting as "the teacher noted" or "preliminary observation" |

---

**Version:** 1.0
**Created:** 2026-02-24
