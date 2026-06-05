# Brygga: Profession → Lesson

*Methodology v3.0, 2026-04-29 (DRAFT). Spec-dokument — väntar på enum-registrering.*

---

## Vad denna brygga gör

Manifestet (lärarens pedagogiska credo) **informerar pre-lesson-design** så att enskilda lektioner gestaltar de värden läraren har deklarerat.

```
Manifest (workspace-root)  ─→  Pre-lesson Fas 1 (Klafki)  ─→  Lektionsplan med manifest-test
```

Skiljer sig från andra bryggor: den är **inte sällan-aktiverad** — den triggas vid *varje* pre_lesson.

---

## Trigger — när aktiveras bryggan?

**Vid varje pre_lesson Fas 1** (Klafki didaktisk analys). Inte konditionellt, utan rutinmässigt.

Specifikt: när läraren ställer Klafkis 5 frågor (Exemplarische Bedeutung, Gegenwartsbedeutung, Zukunftsbedeutung, Sachstruktur, Zugänglichkeit), bryggan introducerar en **6:e fråga**: *"Hur gestaltar denna lektion mitt manifest?"*

---

## Teoretisk grund

**Klafki — didaktisk analys.** De 5 grundfrågorna är de klassiska. Manifest-frågan blir den 6:e och knyter individuell lektion till lärarens Bildung-position.

**Biesta — subjectifikation.** Manifestet artikulerar *vilken slags subjekt* läraren vill att eleven blir. Pre-lesson-bryggan gör den intentionen operativ.

---

## Mekanism — vad gör Cowork

```
1. Lärare initierar pre_lesson → load_methodology('pre_lesson')
        ↓
2. Pre_lesson Fas 1 (Klafki didaktisk analys) når slutet
        ↓
3. Cowork läser manifest från workspace-root: <workspace>/Profession/Manifest/manifest_v<senaste>.md
        ↓
4. Cowork ställer manifest-test-fråga: "Du planerar [topic]. I ditt manifest står [relevant_aspect]. Hur gestaltas det här?"
        ↓
5. Lärare reflekterar — kan modifiera lektionsplan eller acceptera som är
        ↓
6. Manifest-test-svar sparas i lektionsplanens YAML
```

**Princip:** Bryggan är *frågan*, inte *kravet*. Läraren kan svara *"detta är inte en manifest-relevant lektion"* och det är OK. Bryggan tvingar bara *medveten avsikt*.

---

## Vad sparas

I lektionsplanens YAML (sparas via `intelligent_save` från pre_lesson):

```yaml
manifest_test:
  manifest_version: "v2_2026-09-01"
  relevant_aspect: "Studentcentrerad dialog som primär lärform"
  question_asked: "Hur gestaltar fotosyntes-lektionen detta?"
  teacher_response: |
    Bygger in 15 min strukturerad pardiskussion efter solpanel-analogin.
    Inte bara dialog för dialogens skull — diskussionen är där förståelsen prövas.
  modification_made: true   # om planen ändrades baserat på manifest-test
```

---

## Vad denna brygga INTE är

- **Inte filosofi-tribunal:** manifest-frågan är *påminnelse*, inte *prövning*. Cowork ska inte värdera lärarens svar.
- **Inte tillämpbart varje lektion:** vissa lektioner är manifest-neutrala (rena färdighetsövningar t.ex.). Det är OK.
- **Inte ersättning för Klafki:** kompletterar, inte ersätter, de 5 didaktiska analys-frågorna.

---

## Specialfall — när manifest saknas

Om `<workspace>/Profession/Manifest/` är tom: Cowork föreslår manifest-skrivning som separat process (`load_methodology('manifest')`). Pre_lesson kan fortsätta utan manifest-test, men flagga sparas:

```yaml
manifest_test:
  status: no_manifest_available
  recommendation: "Skriv manifest via init_profession + load_methodology('manifest') när tid finns"
```

---

**Status:** DRAFT — väntar på enum-registrering + integration med pre_lesson Fas 1.
**Version:** 0.1 (2026-04-29)
