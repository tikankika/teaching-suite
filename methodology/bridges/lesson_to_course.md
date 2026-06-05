# Brygga: Lesson → Course

*Methodology v3.0, 2026-04-29 (DRAFT). Spec-dokument — väntar på enum-registrering.*

---

## Vad denna brygga gör

Aggregerar lektionsreflektioner till kursnivå-insikter. När mönster återkommer över flera lektioner blir det material för **kursrevision**, inte bara en ny lektionsplan.

```
Lektionsreflektioner (många)  ─┐
                                ├─→  Mönster-detektion  ─→  Kursrevision-trigger
Carry-forward-data (åtta lekt) ─┘
```

---

## Trigger — när aktiveras bryggan?

**Operationella triggers:**

1. **Lärare uttrycker mönster** — *"Jag hinner aldrig X"*, *"Samma sak händer varje gång"*, *"Tredje lektionen i rad..."*
2. **Slutet av modul/vecka** — naturlig pausspunkt för aggregering
3. **AUTO upptäcker återkommande tema** — flera lektioners carry-forward delar samma tema
4. **Bedömningsdata visar mönster** — Q3 har 30% rätt över tre cykler

**Inte trigger:** enskild lektion som gick dåligt. En enskild punkt = lesson cycle, inte course cycle.

---

## Teoretisk grund

**Stenhouse — curriculum as inquiry.** Lektionsdata är *empirisk grund*; kursrevision är *slutsatsen*. Bryggan är där empirin tolkas till hypotes-revision.

**Laurillard — iterativ designvetenskap.** Designern (läraren) iterar baserat på data. Lesson→Course-bryggan är iteration på kursnivå, inte på lektionsnivå.

---

## Mekanism — vad gör Cowork

```
1. aggregate_logs(workspace, after: <window_start>, content_types: ['post_lesson_refl', 'post_lesson_auto'])
        ↓
2. Identifiera återkommande tema (LLM-klassificering)
        ↓
3. Jämför mot course/design.md eller course/pre_course.md (planerade ILO/aktiviteter)
        ↓
4. Om drift detekteras → presentera för läraren
        ↓
5. Lärare bekräftar / avvisar bryggans aktivering
        ↓
6. Om bekräftat → load_methodology('course_revision') → fortsätt där
```

**Princip:** Cowork *föreslår*, läraren *beslutar*. AI ska inte starta kursrevision automatiskt.

---

## Vad sparas

```yaml
type: lesson_to_course_bridge
window:
  start_date: 2026-04-15
  end_date: 2026-04-29
  lessons_count: 8
recurring_themes:
  - theme: "Calvin-cykeln tar mer tid än planerat"
    occurrences: 4
    confidence: HIGH
divergences_from_plan:
  - planned: "Föreläsning 8 min"
    actual_avg: 14
    drift: "+75%"
suggested_course_revisions:
  - "Korta bort C4-växter — ej hunnit i 3 av 4 cykler"
  - "Splittra fotosyntes-modul i två separata lektioner"
triggered_action: course_revision   # eller: deferred / dismissed
```

**suggested_path:** `Reflections/Bryggor/<datum>-lesson_to_course-<topic>.md`

---

## Vad denna brygga INTE är

- **Inte automatisk:** Cowork upptäcker mönster, läraren beslutar
- **Inte lärar-överrullning:** även om data är tydlig, läraren har vetorätt
- **Inte ersättning för terminsreflektion:** detta är *löpande* aggregering, inte års-perspektiv (det är `course_to_profession`-bryggan)

---

**Status:** DRAFT — väntar på enum-registrering i load_methodology + referens i SYSTEM_INSTRUCTIONS.
**Version:** 0.1 (2026-04-29)
