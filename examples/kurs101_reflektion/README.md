# Worked example — post-lesson reflection (KURS101, fabricated)

This is a complete, fabricated run of Teaching Suite's **post-lesson reflection
cycle**. It shows how an AI assistant reads the methodology, guides the teacher
through a structured reflection, and persists the result — with the teacher as
the thinker and the tools doing only the structuring.

All data is invented: `KURS101` (*Biologi 1*) is a fabricated course, lesson 3
on cell division is a generic biology topic, and the reflection text is written
for this example. No real student appears — the reflection is about the lesson
and the teacher's own practice, never about identifiable individuals.

---

## The scenario

A teacher has just taught lesson 3 of *Biologi 1* (`KURS101`): an introduction
to cell division (*celldelning* / mitosis). They open Claude Desktop, which is
configured with the Teaching Suite MCP server pointed at the course workspace,
and ask to reflect on the lesson.

## The flow (which tools run, in what order)

1. **`context_load`** — at session start, reads `_config/` (course context,
   orchestration CLAUDE.md) so the assistant knows it is in `KURS101` and what
   the course goals are.
2. **`load_methodology`** with `process: "post_lesson_reflection"` — loads
   `methodology/lesson/post_lesson_refl.md`, the Gibbs-grounded reflection
   guide. The assistant follows it to ask one stage at a time
   (Description → Feelings → Evaluation → Analysis → Conclusion → Carry-forward)
   rather than dumping a form. The teacher answers in their own words.
3. **`intelligent_save`** with `content_type: "reflection"` and
   `context: { workspace, course: "KURS101", lesson: 3, framework: "gibbs",
   tags: [...] }` — writes the reflection to `Reflections/` with YAML
   frontmatter and a suggested filename. The result is the artifact below.
4. **`log_process_event`** with `type: "reflected"` — appends an event to the
   course process log, recording that lesson 3 was reflected on and where the
   reflection lives, so the next planning session can pick up the carry-forward.

## The result

[`Reflections/2026-05-20_lektion3_celldelning.md`](Reflections/2026-05-20_lektion3_celldelning.md)
— the reflection artifact, exactly as `intelligent_save` writes it. Note the
`## Carry-forward` section: it is the bridge into planning lesson 4. When the
teacher later plans the next lesson, the assistant surfaces these points as
context (via `context_load` / `find_context`), closing the
plan → teach → reflect → improve loop.

## Try it yourself

Point a Teaching Suite workspace at a scratch folder, run `project_init`
(`type: "course"`, `course: "KURS101"`), and walk through the four steps above
with your own (fabricated) lesson. You should end up with the same shape of
artifact and a `reflected` event in the process log.
