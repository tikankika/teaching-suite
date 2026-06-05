---
type: exploration
status: draft
created: 2026-04-27T20:00:24
origin: desktop
project: Teaching Suite
---

# Methodology — Kurscykeln: Genomförande

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **genomförande-fasen i kurscykeln** — där kursdesignen möter verkligheten och iteras kontinuerligt baserat på lektionsdata.

```
KURSDESIGN  →  GENOMFÖRANDE  →  BEDÖMNING  →  UTVÄRDERING  →  REVISION
                  (många lektionscykler nästade här inne)
                                    ↑
                                    detta dokument
```

**Lärarens fråga (här):** *Hur går kursen som helhet? Stämmer den med designen, eller har den driftat? Behöver jag justera mitt i?*

**Tempo:** Kontinuerligt + diskreta check-points. Lektioner körs löpande; genomförande-reflektion sker periodiskt (varje vecka, mid-term, vid varje modulslut).

---

## Grundprincip — designen är hypotes som prövas

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I genomförande-fasen blir principen särskilt tydlig: AI kan *aggregera och visualisera* mönster från lektionscyklerna, men *bedömningen om kursen håller* är meningsbärande arbete som bara läraren kan göra.

**Sub-princip från arkitekturen: kursen är hypotes (Stenhouse), inte plan.** Genomförandet är där hypotesen testas. Drift från ursprungsdesign är inte automatiskt fel — det kan vara *upptäckt*.

| Drift som problem | Drift som upptäckt |
|---|---|
| ILO ej täcks → studenter missar viktigt innehåll | Spontant ämne väcker engagemang → väg in i ny ILO? |
| Bedömning skjuts upp → kontinuitet bryts | En modul tar längre → kanske den var underestimerad |
| Modul hoppas över utan plan → systemkostnad | Aktivitet ersätts med bättre → designen kan revideras |

**Methodology hjälper inte att avgöra vilket.** Det är lärarens omdöme. Methodology ger underlag för beslutet.

---

## Teoretisk grund

### Laurillard — Teaching as a Design Science (2012)

Laurillards huvudtes: undervisning är iterativ design som ständigt justeras. Läraren är inte plan-utförare utan *designer i realtid*. Genomförande-fasen är där Laurillards modell levande blir.

Implikation: kursdesignen är *aldrig låst*. Versioneras. Revideras. Genomförandet matar designen tillbaka.

### Stenhouse — curriculum as inquiry (1975)

*"It is not enough that teachers' work should be studied; they need to study it themselves."* Stenhouse formulerade det innan vi hade infrastruktur — nu har vi det. Genomförande-fasen är där läraren *studerar sitt eget arbete* med stöd av AUTO-aggregering.

Stenhouses *teacher as researcher* är genomförande-fasens inneboende ideal: läraren är inte konsument av forskningsresultat utan producent av lokal kunskap om sin praktik.

### Schön — reflection-on-action på kursnivå (1983)

Schöns reflektion-efter-handling skalar upp från lektion till kurs. Varje vecka, varje modul, vid varje check-point: *vad har vi gjort, vad lärde det oss om kursen som helhet?*

På kursnivå är reflektionen mindre känslodriven, mer mönsterorienterad — men samma rörelse. AUTO-loggar är råmaterialet; lärarens reflektion gör meningen.

### Aggregeringsforskning — från lokala data till mönster

Tre principer från learning analytics-tradition (Siemens & Long 2011, Lockyer et al. 2013) — men teacher-facing, inte administrator-facing:

1. **Lokal aggregering är meningsfull** — mönster över 5–10 lektioner i en kurs säger mer än globala statistik
2. **Triangulering** — AUTO + REFL + bedömningsdata + studentutvärdering tillsammans starkare än någon ensam
3. **Mönster är hypoteser, inte slutsatser** — *"detta upprepas"* öppnar fråga, inte stänger den

Selwyn-kritiken (2019): aggregerings-faran är att *det mätbara* tränger ut *det meningsfulla*. Methodology motarbetar genom att hålla det kvalitativa (REFL-citat, brygga-intentioner) sida vid sida med det kvantitativa (timing, test-resultat, alignment).

---

## Trigger

Genomförande-fasen har tre triggermönster:

### 1. Lärar-initierad mid-course check

Lärare frågar:

- *"Hur går [kurs] hittills?"*
- *"Visa kursprogress"*
- *"Drift-check för [kurs]"*
- *"Sammanfatta vecka 1–4"*

Methodology kör aggregering + presenterar.

### 2. Periodisk på beslutade check-points

Vid kursdesignens bestämda check-points (mid-term, modulslut, etc.) kan methodology påminna:

> *"Modul 3 är klar. Vill du köra mid-course check innan du planerar modul 4?"*

(Påminnelser kommer från process-loggens schemaläggning — inte methodology själv.)

### 3. Automatisk drift-flagga

När AUTO-aggregering visar mönster som överskrider drift-tröskel (definieras nedan), flaggar methodology proaktivt:

> *"Drift-detektion: Modul 3 har överskridit planerad tid med >25% på 4 av 5 lektioner. Vill vi titta på det?"*

**Förutsättningar (minimum):**

- Kursen är aktiv (har minst 2–3 lektioner körda)
- Minst en AUTO-logg finns
- Kursdesign-dokument finns

---

## Process

### Fas 0 — Trigger + scope-bestämning

Methodology frågar:

> *"Vill vi titta på hela kursen sedan start, eller en viss period (t.ex. senaste modulen, senaste 2 veckorna)?"*

Scope styr aggregeringen.

### Fas 1 — Aggregera lektionsdata (Stenhouse + AUTO)

Hämta alla lektionscykel-artefakter inom scope:

```typescript
aggregate_logs({
  course: "[course]",
  period_start: "[start]",
  period_end: "[end]"
})
// → returnerar lista av events: taught, material_produced, reflected, bridge_completed, lesson_planned
```

Plus parallellt:

```typescript
find_context({
  content_types: ['post_lesson_auto', 'reflection', 'brygga_intention'],
  course: "[course]",
  period: "[start, end]"
})
```

Output: lista av lektioner med deras AUTO + REFL + brygga-spår.

### Fas 2 — Tre tabeller (kvantitativt)

Methodology genererar tre tabeller från aggregeringen — *fakta utan tolkning* (samma princip som AUTO på lektionsnivå):

#### Tabell 1: Timing per modul

| Modul | Planerat | Faktiskt | Avvikelse |
|---|---|---|---|
| 1 — Celler | 4 lektioner / 240 min | 5 lektioner / 312 min | +30% |
| 2 — Genetik | 3 lektioner / 180 min | 3 lektioner / 195 min | +8% |
| 3 — Energiomsättning | 4 lektioner / 240 min | 5 lektioner / 308 min | +28% |
| ... | | | |

#### Tabell 2: ILO-täckning

| ILO | Planerade lektioner | Genomförd? | Källa |
|---|---|---|---|
| KURS101.01.celler.struktur | Modul 1, lektion 1–2 | Ja, full | both |
| KURS101.01.celler.organeller | Modul 1, lektion 3–4 | Ja, partiell | plan_yaml + transcript |
| KURS101.04.fotosyntes.morkerreaktion | Modul 4, lektion 14–15 | Partiellt — Calvin-cykel inte landad | concepts_missing |
| KURS101.04.fotosyntes.c4 | Modul 4, lektion 15 | **Inte genomförd** | plan_yaml |
| ... | | | |

#### Tabell 3: Reflektions-mönster

Sammanställning av återkommande teman från REFL:

```
✅ Återkommande positivt:
  • Solpanel-analogi för fotosyntes (lektion 14, 15) — väckte spontan klimat-diskussion
  • Whiteboard > slides (lektion 7, 12, 14)
  • Korta retrieval-tester (Assessment_suite) — eleverna gillar formatet

⚠️ Återkommande utmaning:
  • Mörkerreaktion / Calvin-cykel (lektion 14, 15) — landar inte trots flera försök
  • Block-2-introduktioner blir genomgångar istället för aktivering (4 av 7 lektioner)
  • Diskussioner exploderar i tid (3 av 7 lektioner)

🎯 Återkommande carry-forward (samma idé över flera reflektioner):
  • "Korta inledningen, ge mer tid till diskussion" — i 3 reflektioner
```

### Fas 3 — Drift-detektion

Med tabellerna tillgängliga: identifiera *drift* — där genomförandet avviker från designen i mätbar omfattning.

**Drift-typer:**

| Typ | Tröskel | Exempel |
|---|---|---|
| Timing-drift | Modul >25% tidsöverskridande | "Modul 3 tog 308 min av 240 planerade" |
| ILO-drift | ILO ej genomförd när modul är klar | "C4-växter aldrig taget upp i modul 4" |
| Bedömnings-drift | Planerad bedömning ej genomförd | "Quiz 3 sköts upp 2 veckor" |
| Aktivitets-drift | TLA-typ avviker från design (t.ex. mer föreläsning än planerat) | "Designat 50% diskussion, faktiskt 25%" |

Methodology presenterar drift som *konstaterande*, inte som *anklagelse*:

```
🔍 Drift identifierad:

1. Modul 3 (energiomsättning) tog 30% längre än planerat
   - Inte ovanligt men värt att titta på

2. C4-växter (KURS101.04.fotosyntes.c4) ej genomförd
   - Var planerad för lektion 15
   - Carry-forward från lektion 14 sa "släpp för denna kurs"
   - Status: medvetet avvik?

3. Quiz 3 sköts upp 2 veckor
   - Påverkar ev. spacing-effekt — Assessment_suite kan kommentera
```

### Fas 4 — Mönster-tolkning (lärar-driven)

Detta är meningsbärande arbete. Methodology lägger fram tabellerna och frågar — *en åt gången*:

**På timing-drift:**

> *"Modul 3 tog 30% längre. Är det en fråga om vad innehållet kräver, eller är designen för knaper?"*

> *"Är det samma mönster som tidigare år? Auto-log från KURS101_2025 modul 3: tog 26% längre. Det här verkar återkommande — kandidat för design-revision."*

**På ILO-drift:**

> *"C4-växter ej genomförd. Carry-forward från lektion 14 sa 'släpp för denna kurs'. Är det fortfarande beslutet, eller behöver vi planera in den?"*

**På reflektions-mönster:**

> *"Calvin-cykel landar inte trots flera försök. Tre reflektioner sedan har du noterat det. Vad tror du om innehållet — är det det elever inte har förförståelse för, eller är det förklaringssättet?"*

> *"Solpanel-analogin har triggat klimat-diskussion två gånger. Det är ett återkommande spontanfynd. Vill vi designa in det medvetet, eller behålla som spontant?"*

**På carry-forward-konvergens:**

> *"'Korta inledningen' har dykt upp i 3 reflektioner. Du brygjar det varje gång. Är det en *insikt* (du har förstått något) eller en *vana* (du upprepar utan förändring)? Det är värt att titta på i nästa pre-lesson."*

**Princip:** methodology pushar mot *systemnivå*-frågor som lektionsnivå-reflektion sällan kommer åt. Larrivee-Pedagogisk eller Larrivee-Kritisk nivå snarare än ytligt teknisk.

### Fas 5 — Beslutsfas: justera mitt i kursen, eller fortsätta?

Med drift identifierad och mönster tolkade — vad gör läraren?

**Tre möjliga beslut:**

#### A. Fortsätta utan ändring

Mönster identifierat men beslut är att inte ändra mid-course. Skäl:

- Kontinuitet för eleverna prioriteras
- Designen är robust nog att håller över små avvikelser
- Revision sparas till termins-revision-fasen

Output: drift loggad, ingen mid-course-ändring.

#### B. Justera mid-course

Konkret ändring i kursdesignen som påverkar resterande lektioner:

- Skippa eller skjuta upp en modul
- Ersätta en aktivitet
- Lägga till retrieval-tester på Assessment_suite-rekommendation
- Ändra bedömningstidpunkt

Output: kursdesign-dokumentet *uppdateras* med revision-not. ILO-register uppdateras om relevanta. Eleverna informeras.

#### C. Större omtag — gå tillbaka till kursdesignsfasen

Om driften är dramatisk eller systemiskt fel, methodology rekommenderar att läraren går tillbaka till `design.md` för riktig revision. Detta är ovanligt mid-term — vanligare som start på nästa upplaga.

**Methodology stöder beslutet utan att ta det.** Lägger fram alternativ:

> *"Tre vägar:*
> *A) Kör vidare som planerat — drift loggas, revision väntar till slutet*
> *B) Mindre justering nu — vad konkret?*
> *C) Stora ändringar behöver — gå tillbaka till kursdesign-arbetet?"*

### Fas 6 — Save genomförande-rapport

Methodology sparar rapporten oavsett vilket beslut som tas. Detta är *körkort* för fortsatt iteration.

```typescript
intelligent_save({
  content: <YAML + markdown>,
  content_type: "course_progress_report",
  suggested_path: "Analysis/<course>_<period>_progress.md"
})
```

Innehåll:

- Tabell 1–3 (faktagrund)
- Drift-listan (Fas 3)
- Lärar-tolkning per drift (Fas 4)
- Beslut (Fas 5) — A, B, eller C
- Eventuella mid-course-ändringar (om B)

Vid mid-course-ändring (B): kursdesign-dokumentet *uppdateras* parallellt:

```typescript
// uppdatera Planning/<course>_design.md med revision-anteckning
intelligent_save({
  content: <updated course design>,
  content_type: "course_design",
  suggested_path: "Planning/<course>_<year>_design.md",
  mode: "update"
})
```

### Fas 7 — Log + handoffs

```typescript
log_process_event({
  type: "course_progress_checked",
  files: ["Analysis/..."],
  trigger: "kurs_genomforande",
  scope: "modul_3" | "mid_term" | "kontinuerlig"
})

// Vid drift-detektion:
log_process_event({
  type: "course_drift_detected",
  drift_type: "timing" | "ilo" | "assessment" | "activity",
  severity: "low" | "medium" | "high"
})

// Vid mid-course-ändring:
log_process_event({
  type: "course_design_revised",
  trigger: "mid_course",
  changes: [...]
})
```

**Cross-MCP-handoff:**

Vid ILO-ändringar (mid-course): notifiera QuestionForge att items mot förändrade ILO-koder kan behöva uppdateras.

Vid bedömningsuppdateringar: notifiera Assessment_suite om nya bedömningstidpunkter.

---

## Output-struktur

### YAML frontmatter

```yaml
---
type: course_progress_report
created: 2026-10-15T18:00:00Z
date: 2026-10-15
course_instance: KURS101_2026
tags: [genomforande, kurs101, mid-term]
status: draft
metadata_version: 1
provenance: course_genomforande_v3
framework: [laurillard, stenhouse]
period:
  start: 2026-08-15    # kursstart
  end: 2026-10-15      # rapportdatum
  scope: "mid_term"    # eller "modul_3", "kontinuerlig" etc.
based_on:
  - "[[Planning/KURS101_2026_design]]"
lessons_covered: 14    # antal lektioner i scope
modules_covered:
  - "modul 1 (klar)"
  - "modul 2 (klar)"
  - "modul 3 (klar)"
  - "modul 4 (pågående, 2 av 4 lektioner)"
drift_detected:
  - type: "timing"
    target: "modul 3"
    severity: "medium"
    description: "+30% tidsöverskridande"
  - type: "ilo"
    target: "KURS101.04.fotosyntes.c4"
    severity: "low"
    description: "Ej genomförd, medvetet avvik"
recurring_patterns:
  positive:
    - "Solpanel-analogi väcker klimat-diskussion"
    - "Korta retrieval-tester landar"
  challenge:
    - "Calvin-cykel landar inte"
    - "Block-2-introduktioner blir genomgångar"
mid_course_decision: "B"   # A=fortsätt, B=justera, C=större omtag
mid_course_changes:
  - "Skippa C4-växter formellt — uppdatera kursdesign"
  - "Lägg till extra retrieval-test på Calvin-cykel-begrepp"
---
```

### Markdown body — strukturella sektioner

1. **Översikt** — period, lektioner, moduler täckta
2. **Tabell 1: Timing per modul**
3. **Tabell 2: ILO-täckning**
4. **Tabell 3: Reflektions-mönster**
5. **Drift-detektion** — vad sticker ut
6. **Mönster-tolkning** — lärarens syn på vad mönstren betyder
7. **Beslut** — A, B, eller C, med motivering
8. **Eventuella mid-course-ändringar** (om B) — konkret vad ändras
9. **Kvarvarande frågor** — vad ska följas vidare till revision
10. **Cross-MCP-noteringar** — om QuestionForge eller Assessment_suite behöver uppdateras

---

## Spänningar att hålla i genomförandet

### Drift som problem vs. drift som upptäckt

Den centrala spänningen — och en ärlig.

**Hur hanteras spänningen?** Methodology presenterar drift som *konstaterande*, inte som *värdering*. Lärarens omdöme avgör om det är fel eller upptäckt. Inga emoji-ledda "varning"-flaggor.

### Mid-course adjustment vs. kontinuitet för eleverna

Att ändra mitt i kursen kan förvirra eleverna. Att inte ändra kan låsa fast en design som inte fungerar.

**Hur hanteras spänningen?** Princip: *justera så lite som möjligt, så ofta som behövs*. Drift loggas alltid, justeringar görs sparsamt. Om läraren tvekar — fördelen går till kontinuitet. Större omtag väntar till revisions-fasen.

### Aggregering vs. det enskilda fallets specifik

Att aggregera kan dölja det specifika. Calvin-cykel-svårigheten kan vara ett mönster — eller bara denna grupps specifika kontext.

**Hur hanteras spänningen?** Tabell 3 (reflektions-mönster) listar lektion-IDn — så läraren kan gå tillbaka till enskild reflektion vid behov. Mönster-tolkning är inte slutsats, det är hypotes som triggar närmare läsning.

### Læraren som designer vs. læraren som genomförare

Laurillard säger designer-i-realtid. Praktiken är ofta "kör planen, reflektera senare". Att designa under genomförandet är mentalt ansträngande.

**Hur hanteras spänningen?** Genomförande-fasen är *avlast*. Methodology gör aggregeringen, läraren tolkar. Inga design-beslut krävs varje vecka — bara medvetenhet. Större designval samlas i revisionsfasen.

### Selwyn-kritiken: learning analytics som maktförskjutning

Genomförande-fasens aggregering ÄR learning analytics. Att den är teacher-facing skyddar mot administrationsdrift, men kvarvarande risk är att lärarens egen reflektion förskjuts till tabeller och mönster.

**Hur hanteras spänningen?** Reflektions-mönster (Tabell 3) är *citat och teman från REFL* — inte aggregerat tal eller automatiskt kategoriserat. Det kvalitativa hålls explicit närvarande. Och: methodology *stöder*, läraren *tolkar*. Beslut A/B/C kommer aldrig från systemet.

---

## GDPR

| Datatyp | Hantering |
|---|---|
| AUTO-aggregering (timing, ILO-täckning) | Härledd från lärar-data + transkript — OK i kursmappen |
| Reflektions-mönster (citat från REFL) | Lärarens egna ord — OK |
| Carry-forward-mönster | Lärarens egna ord — OK |
| Studentbedömningsdata | Aggregerad nivå (täckning, ej individuella resultat) — OK; rådata stannar i Assessment_suite |
| Kvalitativa elevcitat (om de förekommer i reflektioner) | Aggregerad nivå (*"någon elev sa…"*), aldrig attribuerad |

**Princip:** Genomförande-rapporten kan delas (kollegor, skolledning) — innehåller inga elevidentifierare. Drift-flaggor är om kursen, inte om eleverna.

---

## Tools som används

| Tool | Roll i genomförandet |
|---|---|
| `load_methodology` | Laddar detta dokument vid trigger |
| `aggregate_logs` | Hämtar process-events över period |
| `find_context` | Hämtar AUTO-logs, reflektioner, bryggor inom scope |
| `file_read` | Läser kursdesign-dokument, ILO-register |
| `intelligent_save` | Sparar `course_progress_report` |
| `log_process_event` | Loggar `course_progress_checked`, `course_drift_detected`, ev. `course_design_revised` |

**Inga nya tools krävs** — `aggregate_logs` är central och redan implementerad.

---

## Integration med andra processer

### Genomförande ← Kursdesign

Kursdesignen är referenspunkten. Drift mäts mot den.

### Genomförande ← Lektionscykel

AUTO-logs, reflektioner och bryggor från lektionscykler är råmaterialet. Genomförande-fasen är *aggregeringen* — den fas där lokala spår blir kursnivå-mönster.

### Genomförande → Bedömning

Drift-flaggor om bedömning (uppskjutet, för enkelt, för svårt) blir input till `assessment.md`-arbetet.

### Genomförande → Utvärdering

Genomförande-rapporter över hela terminen är input till slutlig utvärdering.

### Genomförande → Revision

Vid mid-course-ändringar uppdateras kursdesignen direkt. Större ändringar samlas till revisionsfasen efter terminen.

### Genomförande → Pre-lesson (cykliskt återflöde)

Mönster som identifieras i genomförandet (t.ex. *"Calvin-cykel landar inte"*) blir explicit input till pre-lesson Fas 2E (tidigare upplagors revision-anteckningar) — fast inom samma upplaga.

### Genomförande → Manifest (vision)

Återkommande mönster över hela kursens genomförande blir material för terminsreflektionen i professionscykeln. Drift-mönster pekar på var praxis avviker från espoused theory (manifestet).

### Cross-MCP — Assessment_suite och QuestionForge

Vid bedömnings-justering (mid-course): Assessment_suite-arbete kan behöva schemaläggas om. Vid ILO-ändring: QuestionForge-items kan behöva revideras.

Methodology *flaggar*. Notifieringar ligger utanför scope för nu — manuell handoff via note eller process-event.

---

## Brygga framåt — när conduct triggar lesson_to_course-bryggan i realtid

Conduct är där läraren *lever inuti* en kurs. Mönster blir synliga genom flera lektioner i sekvens — men kursrevision ska inte vänta till slutet. Mid-course aktivering av `lesson_to_course_bridge` är en operativ möjlighet. Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): policyn (B) + handlingen (C) här som prosa; detektionen (A) i kod.

> **Läs-mönster:** Vid conduct-monitoring-checkpoints (vecka–varannan vecka) — utvärdera bryggan nedan. Om villkoret slår — föreslå mid-course-revision istället för att invänta kursens slut.

### `lesson_to_course_bridge` — mid-course aktivering

**Villkor (B):** Cowork ska föreslå bryggan i realtid när minst ett gäller, sett över löpande conduct-monitoring:

- §Drift och tolkning visar systematisk drift (>20 % off i ≥3 av kursens senaste 5 lektioner) på samma block-typ
- §Reflektions-mönster (aggregerat från carry-forward) visar samma tema över ≥3 lektioner i rad
- Läraren explicit signalerar i conduct-dialogen: *"vi måste justera kursen"*, *"detta är inte en enskild lektionsfråga längre"*

**Skiljelinjen:** mid-course-bryggan triggar när drift är *fortfarande korrigerbar inom kursen*. Slutet-av-kurs-mönster hanteras via `course/evaluation.md` → `course/revision.md`.

**Handling (C):** Cowork erbjuder två vägar — justering nu, eller dokumentation för senare revision:

> *"Conduct-monitoringen visar [konkret mönster, t.ex. 'Calvin-cykel-blocket har dragit över planerat tid i 4 av 5 lektioner']. Vi kan antingen justera kursen mid-course nu — bygga bron till kursnivån via `lesson_to_course_bridge` och uppdatera `Planning/`-dokumenten — eller dokumentera mönstret för slutet-av-kurs-revisionen. Vad föredrar du?"*

Vid **mid-course-justering:** invokera `load_methodology('lesson_to_course_bridge')` och uppdatera `Planning/`-dokument. Vid **dokumentation för senare:** notera i `Reflections/Bryggor/<datum>-mid_course_pattern_observed.md` med `triggered_action: deferred_to_revision`.

**Detektion (A):** Cowork använder `aggregate_logs(workspace, content_types: ['post_lesson_auto', 'post_lesson_refl'], window: '21 days')` mot kursens lektionssekvens, plus textanalys av lärarens conduct-dialog för explicita signaler.

**Princip:** Mid-course-revision är *kostsam* för eleverna (förändring mitt i kurs kan förvirra). Bryggan ska föreslå det bara när mönstret är *robust* (≥3 förekomster) och läraren själv har möjlighet att agera (kursen pågår fortfarande, inte sista veckan). Om kursen är ≤2 veckor från avslut — defer till revision i stället.

Se `methodology/bridges/lesson_to_course.md` för bryggans interna mekanism.

---

## Edge cases

### Datatorka — få AUTO-logs eller få reflektioner

Lärare har inte hunnit köra AUTO på alla lektioner, eller har skippat REFL.

**Methodology fallback:**

- Aggregera vad som finns
- Flagga avsaknad: *"Du har 8 lektioner körda men bara 3 AUTO-loggar och 2 reflektioner. Bilden blir partiell."*
- Fortsätt — partiell aggregering är bättre än ingen

### Stor avvikelse mid-course — skippa hel modul

Lärare bestämmer att skippa modul 5 helt mid-course.

**Methodology stöd:**

- Acceptera utan dom
- Uppdatera kursdesign-dokumentet med revision-not
- ILO för modul 5 markeras `superseded` eller `skipped` med motivering
- QuestionForge-handoff: *"Modul 5 ILOs skippade — items mot dem behöver inte produceras"*
- Logga som `course_design_revised` med trigger `mid_course`

### Kontinuerligt vs. diskret genomförande

Vissa lärare vill ha *kontinuerlig* feedback (varje vecka). Andra föredrar *diskreta check-points* (mid-term, modulslut).

**Methodology fallback:**

- Bägge stöds
- Kontinuerlig: methodology kör snabbare aggregation (senaste vecka), tunnare rapport
- Diskret: full aggregation över period, fullständig rapport
- Inställning kan bo i kursdesign-dokumentet (`progress_check_cadence`-fält)

### Drift men ingen tid att hantera

Lärare ser drift men har inte tid att besluta nu.

**Methodology fallback:**

- Spara genomförande-rapport med `mid_course_decision: "deferred"` och kort motivering
- Drift loggas — inte glömt
- Methodology påminner senare: *"Du noterade drift för 3 veckor sedan utan beslut. Fortfarande aktuellt?"*

### Två lärare på samma kurs

Course-team där flera personer undervisar. Lektionsdata kommer från olika lärare.

**Methodology fallback:**

- Aggregering inkluderar alla lärares lektioner (om de skriver till samma kursmapp)
- Tabell 3 reflektions-mönster kan tagga lärare per reflektion (om författarinfo finns)
- Mid-course-beslut är gemensamma — methodology påpekar: *"Vill du diskutera detta med kollegan innan beslut?"*
- GDPR: kollegors reflektioner *inte* aggregeras automatiskt. Aggregering kräver explicit samtycke.

### Drift som ärver från föregående upplaga

*"Calvin-cykel landar inte"* — mönster som även fanns i KURS101_2025.

**Methodology stöd:**

- find_context söker tidigare upplagors progress-rapporter och revisioner
- Methodology flaggar: *"Detta mönster fanns i 2025 också. Värt att skifta strategi nu, eller läggs det vidare till revisionsfasen?"*

---

## Kvalitetskriterier

### En bra genomförande-rapport har:

**Faktagrund:**

- Alla tre tabeller (timing, ILO, reflektion) ifyllda
- Källor (lektion-IDn, modul-IDn) spårbara
- Drift kvantifierat med tröskelvärden

**Tolkning:**

- Lärarens egna ord per drift-punkt
- Distinktion: drift som problem vs upptäckt
- Inga slutsatser från methodology — bara från läraren

**Beslut:**

- A/B/C-val explicit
- Motivering kort
- Eventuella mid-course-ändringar konkreta

**Spårbarhet:**

- Wikilinks till källmaterial (AUTO, REFL, brygga)
- Wikilink till kursdesign
- Cross-MCP-noteringar (om relevant)

### En dålig genomförande-rapport har:

- Tabeller utan tolkning
- Drift-flaggor utan beslut
- Methodology-genererad "slutsats" (signal att designprincipen brutits)
- Saknad spårbarhet — siffror utan källa
- Mid-course-ändring utan att kursdesign uppdateras parallellt

---

## Output-exempel (kort)

```yaml
---
type: course_progress_report
created: 2026-10-15T18:00:00Z
date: 2026-10-15
course_instance: KURS101_2026
tags: [genomforande, kurs101, mid-term]
status: draft
metadata_version: 1
provenance: course_genomforande_v3
framework: [laurillard, stenhouse]
period:
  start: 2026-08-15
  end: 2026-10-15
  scope: "mid_term"
based_on:
  - "[[Planning/KURS101_2026_design]]"
lessons_covered: 14
drift_detected:
  - type: "timing"
    target: "modul 3"
    severity: "medium"
    description: "+30% tidsöverskridande"
  - type: "ilo"
    target: "KURS101.04.fotosyntes.c4"
    severity: "low"
    description: "Ej genomförd, medvetet avvik"
recurring_patterns:
  positive:
    - "Solpanel-analogi väcker klimat-diskussion"
  challenge:
    - "Calvin-cykel landar inte (3 lektioner)"
mid_course_decision: "B"
mid_course_changes:
  - "Skippa C4 formellt — uppdatera kursdesign"
  - "Lägg till extra retrieval-test på Calvin-cykel-begrepp"
---

# Mid-term genomförande-rapport — KURS101_2026

## Översikt

14 lektioner körda. Modul 1–3 klara, modul 4 pågående.

## Timing per modul

[Tabell 1]

## ILO-täckning

[Tabell 2]

## Reflektions-mönster

[Tabell 3]

## Drift och tolkning

### Modul 3 +30% tidsöverskridande

Energiomsättningens innehåll var underestimerat. Inte konstigt — det är samma
mönster som i 2025 (+26%). Designen behöver revideras till nästa upplaga, men
mid-course gör jag inget — kontinuiteten viktigare.

### C4-växter ej genomförd

Carry-forward från lektion 14 sa "släpp för denna kurs". Fortfarande beslutet —
flyttar formellt till ekologi-modulen.

### Calvin-cykel landar inte

Tre reflektioner i rad. Det är inte längre en svårighet vid en lektion utan ett
mönster. Behöver titta på *vad i innehållet* som inte landar — och pröva
retrieval-tester på begreppen.

## Beslut: B (justera mid-course)

1. **Skippa C4 formellt** — uppdatera kursdesign-dokumentet, ILO ändras till
   `superseded`. QuestionForge-items mot C4-koden behöver inte produceras.
2. **Lägg till retrieval-test på Calvin-cykel-begrepp** — Assessment_suite får
   ny instruktion för veckas tester (Karpicke & Roediger spacing).
3. **Modul 3 timing** — ingen mid-course-åtgärd. Notera för revisionsfasen.

## Cross-MCP

- QuestionForge: ändra ILO-status för KURS101.04.fotosyntes.c4 till `superseded`
- Assessment_suite: nytt retrieval-test-tema för Calvin-cykel-begrepp

## Kvarvarande frågor till revisionsfasen

- Modul 3 underestimering — strukturellt eller metodologiskt?
- Calvin-cykel-svårighet — är det innehållet eller mitt sätt att förklara?
- Ska C4 in i ekologi-modulen eller helt ut ur kursen?
```

---

## Bibliotek — prompts & frågor

### Trigger

- *"Hur går [kurs] hittills?"*
- *"Mid-term check för [kurs]"*
- *"Drift-check senaste 4 veckorna"*
- *"Sammanfatta vad som hänt sedan kursstart"*

### Scope-bestämning

- *"Hela kursen sedan start, eller en specifik period?"*
- *"Senaste modulen klar — vill vi titta på just den?"*

### Drift-presentation

- *"Tre saker sticker ut i tabellerna. Vill du gå igenom dem en åt gången?"*
- *"Modul X tog Y% mer än planerat. Är det innehållet eller designen?"*
- *"ILO Z är ej genomförd. Medvetet eller missad?"*

### Mönster-tolkning (Larrivee-pushande)

- *"Detta upprepas i flera lektioner. Är det innehållet, gruppen, eller ditt sätt?"*
- *"Tre carry-forwards säger samma sak — har det blivit insikt eller vana?"*
- *"Detta verkar systemiskt. Ser du samma mönster i andra kurser?"*

### Cross-cykel-koppling

- *"Detta fanns i förra upplagan också. Vill vi pröva en ny strategi nu?"*
- *"Spontant fynd från lektion 14 (klimat-diskussion) — designa in eller behålla spontant?"*

### Beslutsfas

- *"Tre vägar — fortsätta, justera mitt i, eller större omtag. Vad känns rätt?"*
- *"Mid-course-ändring kostar elever kontinuitet. Är ändringen värd det, eller väntar vi till revisionsfasen?"*

### Mid-course-ändring konkret

- *"Vad konkret ändras? Skip, modify, replace, eller add?"*
- *"Påverkar detta bedömningen? Assessment_suite behöver veta."*
- *"Påverkar detta ILO-koderna? QuestionForge har items mot dem."*

### Avslut

- *"Spara progress-rapporten. Vill du också uppdatera kursdesignen nu, eller senare?"*
- *"Loggar drift och beslut. Methodology påminner om kvarvarande frågor när vi kommer till revisionen."*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — arkitektur, kurscykeln
- **`design.md`** — designen som genomförandet prövar
- **`assessment.md`** — bedömnings-data är input till genomförande
- **`evaluation.md`** — slutlig utvärdering, mid-term-rapporter är input
- **`revision.md`** — drift-mönster matar revisionen
- **`lesson/*.md`** — alla fyra lektion-docs är råmaterialet

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Laurillard (Teaching as a Design Science — iterativ design), Stenhouse (curriculum as inquiry — kursen som hypotes), Schön reflection-on-action på kursnivå, learning analytics-tradition (Siemens & Long, Lockyer et al.) med Selwyn-kritik som motvikt.

**Process — 7 faser:**

- Fas 0: Trigger + scope-bestämning
- Fas 1: Aggregera lektionsdata (`aggregate_logs` + `find_context`)
- Fas 2: Tre tabeller (timing, ILO-täckning, reflektions-mönster)
- Fas 3: Drift-detektion (4 drift-typer med tröskelvärden)
- Fas 4: Mönster-tolkning (lärar-driven, Larrivee-pushande)
- Fas 5: Beslutsfas (A/B/C — fortsätt / justera / större omtag)
- Fas 6: Save genomförande-rapport
- Fas 7: Log + cross-MCP-handoffs

**Spänningar (fem):**

- Drift som problem vs upptäckt
- Mid-course adjustment vs kontinuitet
- Aggregering vs det enskilda fallet
- Læraren som designer vs som genomförare
- Selwyn-kritiken (LA som maktförskjutning)

**Cross-MCP-impact:**

ILO-ändringar vid mid-course → QuestionForge.
Bedömnings-justering → Assessment_suite.
Methodology flaggar; konkret notifiering separat spår.


**Föregångare:** Inget direkt föregångare-dokument. Genomförande-fasen har funnits implicit i kurs-arbetet men inte explicit metodologerats. v3.0 formaliserar.
