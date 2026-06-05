# Gibbs' Reflective Cycle (1988)

**Framework:** Default reflection framework for Teaching Suite
**Reference:** Gibbs, G. (1988). *Learning by Doing: A Guide to Teaching and Learning Methods*. Oxford Polytechnic.
**Used by:** `post_lesson_refl.md`

---

## Overview

Six-step structured reflection cycle. Selected as default because it provides the most scaffolding points for software-facilitated reflection, separates feelings from evaluation (important for teachers who self-blame), and maps directly to a plan improvement output.

---

## The Six Steps

### Step 1: Description — Vad hände?

**Purpose:** Establish a factual account. Compare planned versus actual.

**Prompt template:**
```
"Beskriv lektionen: Vad hände? Hur såg den ut jämfört med planen?"
```

**Data to integrate:**
- Lesson plan (planned structure, timing, activities)
- Transcript timing (actual structure, if available)
- Talk ratio (if pyannote data available)

**Quality criteria:** Factual, not evaluative. Specific times and events, not "it went well." If transcript data is available, use it — do not rely solely on memory.

**Assessment criteria for this step:**
- Does the description distinguish planned from actual?
- Are deviations noted with approximate timing?
- Is the account factual rather than evaluative?

---

### Step 2: Feelings — Hur upplevde du det?

**Purpose:** Capture the teacher's subjective experience separately from analysis.

**Prompt template:**
```
"Hur upplevde du lektionen? Vad kände du under och efter?"
```

**Important:** This step is entirely teacher-owned. Claude does NOT generate, interpret, or evaluate feelings. Claude records them faithfully.

**Why this step matters:** Teachers often conflate their feelings with their evaluation. Separating them prevents self-blame from contaminating the analysis. A teacher who "felt terrible" about a lesson may have actually taught effectively — the data will reveal this in step 3.

**Assessment criteria:**
- Did the teacher express their experience in their own words?
- Was Claude careful not to interpret or evaluate the feelings?
- Were feelings recorded without judgment?

---

### Step 3: Evaluation — Vad var bra och dåligt?

**Purpose:** Systematic evaluation combining teacher perception with available data.

**Prompt template:**
```
"Vad fungerade bra, och vad fungerade inte?"
```

**Follow-up prompts:**
```
"Vad var det med [X] som fungerade?"
"Hur reagerade eleverna?"
"Skulle du göra det igen?"
```

**Data to integrate:**
- Assessment results (if available — from Phase 1.5)
- Transcript analysis (question types, talk ratio)
- Teacher's own observations from step 2

**Assessment criteria:**
- Are evaluations specific ("pararbetet genererade 3x fler elevturer") rather than vague ("det var bra")?
- Is data cited where available?
- Are both positives and negatives identified?

---

### Step 4: Analysis — Varför blev det så?

**Purpose:** Form hypotheses about causes. Cross-reference data sources. This is the analytical core.

**Prompt template:**
```
"Varför tror du det blev som det blev? Vad kan förklara resultaten?"
```

**Follow-up prompts:**
```
"Om du jämför planering med resultat — var är den största diskrepansen?"
"Vilka moment verkar ha gett bäst effekt baserat på data?"
"Finns det en koppling mellan [timing deviation] och [assessment result]?"
```

**Analytical moves:**
- Cross-reference timing with assessment results
- Check Bloom's level alignment (Biggs' constructive alignment)
- Identify key moments that correlate with outcomes
- Distinguish correlation from causation

**Structure:**
```
HYPOTES [N]: [Claim]
  STÖDS AV: [Evidence]
  REFERENS: [Framework if applicable]
  KONFIDENS: [HIGH/MEDIUM/LOW]
```

**Assessment criteria:**
- Are hypotheses grounded in evidence, not speculation?
- Are multiple possible explanations considered?
- Is the teacher invited to evaluate the hypotheses?
- Are confidence levels stated?

---

### Step 5: Conclusion — Vad tar du med dig?

**Purpose:** Synthesise insights into numbered, actionable conclusions.

**Prompt template:**
```
"Vad är de viktigaste lärdomarna? Vad tar du med dig?"
```

**Quality check:** Each conclusion should be:
- Specific (not "bli bättre")
- Actionable (translatable into a plan change)
- Traceable (linked to a hypothesis from step 4)

**Assessment criteria:**
- Are conclusions numbered and concise?
- Does each conclusion connect to the analysis?
- Are they actionable — can they become plan changes?

---

### Step 6: Action Plan — Vad ska du göra annorlunda?

**Purpose:** Translate conclusions into concrete changes. Bridge to structured plan revision.

**Prompt template:**
```
"Baserat på dessa insikter — vad vill du ändra konkret i nästa lektionsplan?"
```

**For each change, capture:**
```yaml
- what: "Concrete change"
  why: "Linked to data"
  data_source: "File reference"
  framework: "Pedagogical principle"
  gibbs_step: "Which conclusion"
```

**Handoff:** This step feeds directly into structured plan revision with constructive alignment checks.

**Assessment criteria:**
- Does each change trace to a specific conclusion?
- Are changes concrete enough to implement?
- Is the teacher offered the choice to proceed to plan improvement immediately?

---

## When Gibbs Works Best

- Structured reflection after a specific lesson
- When multiple data sources are available
- When the teacher wants a thorough analysis
- For teachers who tend towards self-blame (step 2 separates feelings from evidence)
- When the goal is a concrete improved plan (step 6 maps to structured plan revision)

## When to Suggest an Alternative

- Teacher says "I just want to quickly note what happened" → suggest [[driscoll]] (What/So What/Now What)
- Teacher wants to examine assumptions → suggest [[brookfield]] (critical lenses)
- Teacher prefers experimentation → suggest [[kolb]] (experiential cycle)
- Teacher has a research question → suggest action research

---

**Version:** 1.0
**Created:** 2026-02-24
