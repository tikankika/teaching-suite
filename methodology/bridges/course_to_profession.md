# Brygga: Course → Profession

*Methodology v3.0, 2026-04-29 (DRAFT). Spec-dokument — väntar på enum-registrering.*

---

## Vad denna brygga gör

Identifierar mönster i lärarens praktik som *överskrider en enskild kurs* och blir kandidater för **manifest-revision**.

```
Termins-reflektioner per kurs ─┐
                                ├─→  Cross-course-mönster  ─→  Manifest-revisions-trigger
Espoused vs in-use-flaggor    ─┘
```

---

## Trigger — när aktiveras bryggan?

1. **Slutet av termin** — `term_reflection.md` aktiverar bryggan
2. **Återkommande mönster över ≥2 kurser** — *"jag landar alltid på frontalundervisning trots manifest säger annat"*
3. **Espoused-vs-in-use-divergens persisterar** — gap mellan vad läraren *säger sig tro* och vad hen *gör* återkommer trots iteration

**Inte trigger:** enskild kurs som inte gick som planerat. Det är lesson_to_course-domän.

---

## Teoretisk grund

**Korthagen — lökmodellen.** Yttre lager (beteende, kompetens) lättare att ändra; inre (övertygelser, identitet, mission) djupare. När mönster når mission-skiktet är det manifest-arbete.

**Argyris & Schön — espoused vs theory-in-use.** Persisterande gap mellan deklarerade värderingar och faktisk praktik är *data* för manifest-revision. Inte moralisering, utan medveten omarbetning.

---

## Mekanism — vad gör Cowork

```
1. term_reflection.md sparas → bryggan får trigger
        ↓
2. find_context för terminsreflektioner från andra kurser samma termin
        ↓
3. Identifiera teman som återkommer över ≥2 kurser
        ↓
4. För varje sådant tema: jämför mot manifest (workspace-root)
        ↓
5. Detektera espoused-vs-in-use-gap
        ↓
6. Presentera för läraren: "Detta gap finns i 3 av 4 kurser denna termin. Vill du revidera manifestet?"
        ↓
7. Om bekräftat → load_methodology('manifest_revision') → fortsätt där
```

**Princip:** Manifest-revision är kostsam — bryggan ska bara aktivera när mönstret är *robust* (≥2 kurser, persisterar över ≥2 terminer för att räknas som hög konfidens).

---

## Vad sparas

```yaml
type: course_to_profession_bridge
term: VT2026
courses_analysed:
  - KURS201_2026_v3
  - KURS202_2026_v3
cross_course_patterns:
  - theme: "Frontalundervisning trots planer på diskussion"
    occurrences_courses: ["KURS201", "KURS202", "KURS601"]
    espoused_position: "Studentcentrerad, dialogisk pedagogik"
    in_use_observation: "Genomsnittlig lärartalkratio 64%"
    confidence: HIGH
manifest_revision_candidates:
  - aspect: "Diskussionsdesign — verktyg, inte intention"
    rationale: "Mönstret kvarstår trots intention; behöver konkret implementering, inte värderings-revision"
triggered_action: manifest_revision   # eller: deferred / dismissed
```

**suggested_path:** `<workspace_root>/Profession/Manifest/<termin>_<år>_revision_trigger.md`

---

## Vad denna brygga INTE är

- **Inte moralisk gotcha:** espoused-vs-in-use-gap är *data*, inte felidentifiering. Argyris & Schön varnar uttryckligen för moralisering.
- **Inte automatiskt manifest-byte:** bryggan föreslår *övervägande*, läraren beslutar
- **Inte tillräckligt med en kurs:** behöver mönster över ≥2 kurser för att skilja från lokal kontext-effekt

---

**Status:** DRAFT — väntar på enum-registrering + integration med `init_profession`.
**Version:** 0.1 (2026-04-29)
