# Limitations of AI-Assisted Analysis

**Document:** limitations.md
**Purpose:** Explicit statement of what the system cannot do, where it is unreliable, and what the teacher should verify independently
**Used by:** All reflection and analysis processes
**Related:** [[confidence_levels]], [[data_source_labels]]

---

## Core Limitation

**The system augments the teacher's professional judgment. It does not replace it.**

Every insight, classification, and recommendation is a suggestion grounded in data — but the teacher has context that the system cannot access: student relationships, classroom dynamics, cultural factors, institutional constraints, and professional intuition built over years.

---

## Specific Limitations

### 1. LLM Classification Is Not Reproducible

Question type classification (focusing/funneling/closed) and Bloom's level classification are performed by an LLM at inference time. Different sessions, models, or prompt versions may produce different classifications for the same transcript.

**Implication:** Treat discourse analysis as indicative, not definitive. If the system says "3 of 12 questions were focusing," the true count might be 2–5. The direction matters more than the exact number.

**Mitigation:** Analysis prompts are stored in `methodology/system/pedagogical_analysis/` for transparency. A future version may use fixed prompts with test cases for greater reproducibility.

### 2. Correlation Is Not Causation

When the system reports "students who participated in pair work scored higher," this is a correlation observed in a single lesson with a small sample. It does not prove that pair work caused the improvement.

**Implication:** Cross-reference findings are hypotheses, not conclusions. Always present as "this suggests" rather than "this proves."

### 3. Small Sample Sizes

Most classroom assessments involve 8–30 students. Statistical significance is rarely achievable. A difference of 10 percentage points between two groups of 8 students could easily be random variation.

**Implication:** Report raw numbers alongside percentages. "5 of 8 students (63%) missed Q2" is more honest than "63% failure rate."

### 4. Transcript Quality Varies

Audio recording quality, background noise, overlapping speech, and microphone distance all affect transcription accuracy. Poor audio → unreliable timing, speaker identification, and content.

**Implication:** If transcript quality is poor (many [inaudible] segments, incorrect speaker assignments), downgrade all transcript-derived confidence from HIGH to MEDIUM, and MEDIUM to LOW.

### 5. Assessment Measures What It Tests

Assessment data tells us what students could demonstrate on specific questions at a specific moment. It does not capture everything they learned, nor does it account for test anxiety, language barriers, or question clarity.

**Implication:** Low scores on a question may reflect a poorly written question rather than poor teaching. Check question quality before attributing results to instruction.

### 6. The System Does Not Observe Non-Verbal Behaviour

Transcripts capture speech. They do not capture body language, facial expressions, student attention, note-taking, or silent engagement. The teacher sees these; the system does not.

**Implication:** The teacher's observation that "three students looked completely lost" is valuable data that the system cannot generate. Gibbs step 2 (Feelings) and teacher notes fill this gap.

### 7. Framework References Are Simplifications

When the system cites "Hattie effect size 0.70 for feedback," this is a meta-analytic average across thousands of studies. The actual effect in a specific classroom may differ substantially.

**Implication:** Framework references provide direction and justification, not prediction. "Hattie suggests feedback is effective" is appropriate. "Hattie guarantees this will improve scores by 0.70 standard deviations" is not.

### 8. Bias in LLM Analysis

LLMs may exhibit biases in classification — for example, over-classifying rhetorical questions as "closed" or under-detecting student reasoning in non-standard language. Swedish-language transcripts may be classified less accurately than English ones, depending on the model's training data.

**Implication:** If the teacher disagrees with a classification, the teacher is probably right. The system should defer to the teacher's professional judgment on pedagogical matters.

---

## What the System Should Never Claim

- "Your teaching was good/bad" — the system provides data, not judgments of professional quality
- "You should definitely do X" — the system proposes changes with evidence; the teacher decides
- "This will improve results" — the system can cite research suggesting it might, but cannot guarantee outcomes
- "Students felt X" — the system can report what students wrote or said, not what they felt

---

**Version:** 1.0
**Created:** 2026-02-24
