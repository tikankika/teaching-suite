# Teaching Suite: Teacher Collaboration Guide

> **This is not software you operate. It's an AI colleague you think with.**

---

## What This Is (And What It Isn't)

| Traditional software | Teaching Suite |
|----------------------|----------------|
| Fixed menus and forms | Adaptive dialogue that follows your thinking |
| You enter data | You think out loud; the tools structure the result |
| Stores records | Builds a navigable web of your practice over time |
| Same steps every time | Adjusts to the lesson, the course, and where you are |

**Teaching Suite** scaffolds the guided processes of teaching — capturing ideas, planning
lessons, reflecting after them, and tracking pedagogical goals across three cycles. The AI
(Claude) reads pedagogical methodology and structures the conversation; the writing lands
as plain Markdown in your own folder.

**The principle is process scaffolding, not automation: the teacher thinks, the tools
structure.** Claude prompts, organises, and remembers — it does not decide your pedagogy
for you.

> The methodology is published deliberately at an early stage to invite critique. The
> named frameworks (Klafki, Wiggins & McTighe, Schön, Black & Wiliam, Biesta) are in
> active development — see `methodology/` and `ROADMAP.md`.

---

## The Three Cycles

Teaching Suite is organised around three nested cycles. You move between them as your work
moves:

- **Lesson** — plan a lesson, teach it, reflect on it, carry forward what you learned.
- **Course** — see patterns across lessons; revise the course as it runs.
- **Profession** — step back at term's end; develop your practice and your teaching manifest over time.

Most days you work in the lesson cycle. The course and profession cycles are where the
smaller reflections accumulate into something larger.

---

## Where Your Work Lives

- **Your folder is the source of truth.** Everything Teaching Suite writes is plain
  Markdown in your workspace — ideas, lesson plans, reflections, logs. No database, no
  lock-in; the files stay readable on their own.
- **Claude Desktop is the engine.** The tools run inside Claude Desktop and read and write
  those files (locked to your `--workspace` folder).
- **Obsidian is an optional reading lens.** Point a vault at the same folder and the
  `[[wikilinks]]` and `#tags` become a browsable map of your teaching.

Sync the folder (for example via Nextcloud) and your practice follows you across machines.

---

## How to Start a Session

### 1. Load your context

At the start of a session, let Claude load where you left off:

```
Load context for my course at /Nextcloud/Courses/BIOLOGY_2026/.
```

Claude runs `context_load` to pick up the course context, sources, and carry-forward from
previous work — so you start from something, not from nothing.

### 2. Describe what you're doing

Tell Claude the task and the cycle:

```
I'm planning next week's lesson on cell respiration.
```

or

```
I just taught the photosynthesis lesson — here's the transcript. Let's reflect.
```

### 3. State your goal and the depth you want

Be explicit about scope — a quick capture is not a full backward-design plan:

- "Just capture this idea for later."
- "Full lesson plan with a Klafki sketch and backward design."
- "A short post-lesson reflection — five minutes, not a deep dive."

---

## The Methodology: Capabilities, Not Mandatory Steps

Claude loads methodology by process with `load_methodology`. These are capabilities you
invoke when they fit — not a fixed sequence.

| Process | Purpose | When to use |
|---------|---------|-------------|
| `pre_lesson_planning` | Plan a lesson — Klafki didactical analysis + backward design (Wiggins & McTighe) + anticipatory reflection | Before teaching |
| `post_lesson_auto` | Structure content and a recap from a lesson transcript (drafts) | Right after a lesson, when you have a transcript |
| `post_lesson_reflection` | Guided reflection — Rolfe (quick, daily) or Gibbs (fuller, weekly) | After a lesson, to learn from it |
| `course_assessment` | Design assessment at the course level | When planning how a course is assessed |

Profession-level work (term reflection, teaching manifest) lives in the profession cycle
and is used when it serves your development — not as a default.

### Typical Paths

**Capture an idea (seconds):**
```
capture_idea  →  saved to Ideas/ with a Swedish priority (nu / snart / någon_gång)
```

**Plan a lesson:**
```
context_load → load_methodology(pre_lesson_planning) → find_context (past reflections)
→ intelligent_save (the plan)
```

**Reflect after a lesson:**
```
load_methodology(post_lesson_auto)  (content + recap, drafts)
→ load_methodology(post_lesson_reflection)  (Rolfe daily / Gibbs weekly)
```

**End of term:**
```
Work in the profession cycle — term reflection, then update your manifest.
```

---

## Working With Claude: Key Principles

### 1. Claude proposes, you decide

Claude will suggest structure and depth:

> *"For a single idea you want to revisit, a quick capture is enough — I don't need to run
> the full planning process. Save it to Ideas with priority 'snart'?"*

You accept, decline, or modify. The pedagogy is yours.

### 2. The methodology guides, not dictates

The methodology documents describe approaches grounded in named frameworks. They are
applied to your context — a quick formative lesson needs a lighter touch than a unit you
are redesigning.

### 3. Interrupt and redirect anytime

- "Skip the full plan — just give me the lesson outline."
- "Go back to last week's reflection on this topic."
- "Use Gibbs this time, not Rolfe."

### 4. Your judgement is final

Claude structures and remembers; you decide what good teaching looks like in your
classroom. Reflections are yours and private — they are never used as the basis for
student-facing material.

---

## Example: Adaptive Decision-Making

**Teacher:** "I want to plan Thursday's lesson on the nerve cell."

**Claude:**
> *Let me load the course context first... I can see your reflection from the last nerve
> cell lesson — students struggled with the action potential, not the structure.*
>
> *For Thursday, backward design suggests starting from what you want them to be able to
> do, then the evidence, then the activities. Given last time, I'd weight the lesson
> towards the action potential.*
>
> *Want a full plan with a Klafki sketch, or a lighter outline?*

**Teacher:** "Lighter outline — but keep the focus on the action potential."

**Claude:** Drafts a focused outline and saves it for your review.

---

## Practical Tips

### Starting fresh
```
"Load context for /Nextcloud/Courses/BIOLOGY_2026/ and show me where I left off."
```

### Capturing on the fly
```
"Idé: use a battery as an analogy for the membrane potential."
```

### Reflecting quickly
```
"Quick reflection on today's lesson — Rolfe, a few minutes."
```

### Looking back
```
"Find my previous reflections on the action potential."
```

---

## Common Questions

**Q: Does any student data go through Teaching Suite?**

A: No. Teaching Suite handles your professional processes — planning, reflection, ideas.
Student work and grades stay in the separate assessment workflow; only *insights about
teaching* flow back here. Keep student personal data out of your course workspace.

**Q: What is the content scanner?**

A: A lightweight advisory warner. It flags a fixed list of Swedish sensitivity keywords
(for example *personnummer*, *elevhälsa*) before saving. It only warns — it never blocks —
and it is **not** anonymisation or reliable PII detection. Anonymise sensitive data before
importing it.

**Q: What language does it work in?**

A: The interface and the methodology are in Swedish (the tool was built with and for
Swedish teachers). The code and documentation are in English.

**Q: Do I have to use Obsidian?**

A: No. Obsidian is an optional way to read and browse what is already on disk. The files
are plain Markdown and stand on their own.

---

## Philosophy

Teaching Suite embodies a specific philosophy:

1. **AI augments, not replaces, teacher judgement** — you think; the tools structure.
2. **Your folder, your files** — plain Markdown you own, readable without the tools.
3. **Flexibility** — match the depth to the stakes rather than forcing a fixed process.
4. **Reflection is private** — your reflections are for your development, not for output.

The goal is to make the guided processes of good teaching *sustainable* over a career —
not to automate the thinking away.

---

*For the methodology, see the cycle folders in `methodology/` (`lesson/`, `course/`,
`profession/`); for architecture and the full tool reference, see `docs/ARCHITECTURE.md`.*
