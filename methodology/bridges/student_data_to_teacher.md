# Brygga: Student data → Teacher reflection

*Methodology v3.0, 2026-04-29 (DRAFT). Spec-dokument — väntar på enum-registrering.*

---

## Vad denna brygga gör

Bedömningsdata, exit tickets och transkript-data **driver tillbaka till didaktisk reflektion** — INTE till direkt åtgärd.

```
Assessment-resultat   ─┐
                       │
Exit tickets           ├─→  Reflektions-trigger  ─→  post_lesson_refl med data-perspektiv
                       │
Transkript-mönster    ─┘
```

**Den centrala designprincipen:** *"AI håller ställning, människan håller mening."* Data ÄR ställning. Tolkning ÄR mening. Bryggan håller dem isär.

---

## Trigger — när aktiveras bryggan?

1. **Assessment-data finns tillgänglig** — Teacher_Insights-rapport från Assessment_suite landar i `Data/Teacher_Insights/`
2. **Exit tickets sammanställs** — sparade i `Data/Student_Reflections/`
3. **Transkript-analys visar mönster** — t.ex. `aggregate_logs` visar låg fokuserande-frågor-andel
4. **Lärare frågar explicit** — *"Vad säger datan om...?"*

---

## Teoretisk grund

**Black & Wiliam — formativ bedömning.** Bedömning är *formativ* när den driver tillbaka till undervisningen, inte när den summativt mäter. Bryggan implementerar denna princip operativt.

**Hattie (2007) — power of feedback.** Feedback är effektiv *till läraren*, inte bara från läraren. Studentdata ÄR feedback till läraren om undervisningen.

**Selwyn (kritisk lins).** Data-driven pedagogik riskerar förskjuta omdöme till system. Bryggan adresserar detta genom att **inte tolka data automatiskt** — bara presentera och bjuda in lärartolkning.

---

## Mekanism — vad gör Cowork

```
1. Data tillgänglig (assessment / exit ticket / transkript)
        ↓
2. Cowork detekterar mönster (LLM-analys)
        ↓
3. Cowork PRESENTERAR mönstret — utan tolkning, utan rekommendation
        ↓
4. Cowork INVITERAR till reflektion: "Detta visar X. Hur ser du på det?"
        ↓
5. Lärare reflekterar
        ↓
6. Reflektion sparas i post_lesson_refl med data_source-länk
        ↓
7. Reflektion kan i sin tur trigga lesson_to_course-bryggan om mönstret återkommer
```

**Princip:** Cowork **interpreterar inte** — *"70% missade Q3 betyder eleverna förstod inte"* är **fel ton**. Rätt ton: *"70% missade Q3. Hur tolkar du det?"*.

---

## Vad sparas

Bryggans output är inte ett separat dokument, utan en **annoterad post_lesson_refl** med data-koppling:

```yaml
type: post_lesson_refl
data_triggered: true
data_sources:
  - source: "Data/Teacher_Insights/2026-09-22_test5_insight.md"
    pattern: "70% missade Q3 (dendritens funktion)"
    confidence: HIGH
  - source: "Data/Transcripts/2026-09-22-fotosyntes-refl.txt"
    pattern: "Talkratio lärare: 67% (mål: <55%)"
    confidence: MEDIUM
interpretation_invitation_response: |
  Eleverna kunde säga "dendrit" men inte vad den gör. Min föreläsning
  fokuserade för mycket på struktur, inte funktion. Nästa gång:
  rita-och-förklara-övning innan föreläsning.
modification_for_next_plan:
  - "Lägg till 'rita dendrit och förklara dess funktion' som ingång"
  - "Skär föreläsning från 14 → 8 min"
```

---

## Vad denna brygga INTE är

- **Inte automatisk åtgärd:** data → tolkning → handling-vägen får läraren göra. Cowork stannar vid tolkningsinbjudan.
- **Inte AI-pedagogisk-domare:** Cowork ska inte säga *"detta är ett dåligt resultat"*. Bara visa mönstret.
- **Inte avlösning av summativ bedömning:** detta är den *formativa* sidan. Summativa bedömningar (betyg etc.) ligger utanför bryggan.

---

## Specialfall — Selwyn-medvetenhet

När bryggan aktiveras med data som riskerar bli "mätbarhets-tunga", invokera tensions.md spänning 4 (Learning analytics vs. lärarens omdöme):

> *"Innan vi tolkar denna data — vad ser du själv som inte syns i datan?"*

Frågar lärarens omdöme FÖRST, sedan data. Skydd mot data-prioritet.

---

**Status:** DRAFT — väntar på enum-registrering + integration med Assessment_suite-data-flöde.
**Version:** 0.1 (2026-04-29)
