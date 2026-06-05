---
type: exploration
status: draft
created: 2026-04-27T20:26:42
origin: desktop
project: Teaching Suite
---

# Methodology — Kurscykeln: Bedömning

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **bedömnings-fasen i kurscykeln** — där studenters lärande görs synligt över tid genom formativa retrieval-tester, dialogisk avläsning, och slutbedömningar.

```
KURSDESIGN  →  GENOMFÖRANDE  →  BEDÖMNING  →  UTVÄRDERING  →  REVISION
                                    ↑
                                    detta dokument
```

**Lärarens fråga (här):** *Vad lär sig eleverna? Hur visar de det? Hur använder jag den evidensen för att stötta lärandet?*

**Tempo:** Genomgripande genom kursen. Bedömningsstrategin designas i kursdesign-fasen, justeras i genomförande, fördjupas här. Konkret bedömning sker löpande (formativt) + i diskreta toppar (retrieval-tester, prov, projekt).

**Cross-MCP:** Detta är *den fas där cross-MCP-flödet är mest aktivt*. Tre system delar arbete:

- **Teaching Suite** — definierar bedömningsstrategin, mottar teacher_insights, integrerar i pre-lesson
- **QuestionForge** — skapar items mot ILO-koder, exporterar QTI till Inspera
- **Assessment_suite** — kör retrieval-tester, bedömer, aggregerar, exporterar teacher_insights tillbaka

---

## Grundprincip — bedömning är inte mätning, det är tolkning

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

Bedömning är meningsbärande arbete. Att avgöra *vad ett svar visar*, *vad det berättar om lärandet*, *vad nästa steg ska vara* — det är pedagogisk tolkning, inte mätning.

Methodology bidrar med:

- *Strategi-stöd* — vilka bedömningstyper passar vilka ILO?
- *Verb-alignment-check* — mekanisk kontroll mot Biggs alignment
- *Cross-MCP-koordinering* — handoffs mellan QuestionForge, Assessment_suite, Teaching Suite
- *Tolkningsstöd* — när teacher_insights kommer tillbaka, hjälp att förstå vad de betyder

Methodology bidrar *inte*:

- Bedömningens innehåll — vad räknas som *bra* svar
- Värdering av enskilda elever — det är lärarens omdöme
- Vad teacher_insights *betyder* för planeringen — det avgörs i pre-lesson Fas 2G

**Sub-princip från arkitekturen: bedömning lever i alla cykler.** Formativ avläsning i lektion (Fas 3 steg 2 i pre-lesson). Alignment-fråga i kurs (här). Mönster över år i profession. Detta dokument är *kursnivåns* bedömningsfas.

---

## Teoretisk grund

### Black & Wiliam — Inside the Black Box (1998)

*Formativ bedömning är en av de mest kraftfulla pedagogiska interventionerna som finns* — när den används som verktyg för lärande snarare än kontroll.

Bedömning är inte enbart mätning utan *tolkning av elevers möte med innehållet*. Distinktion: avläsning är att märka under, så jag kan justera; bedömning är att utvärdera efter. Båda finns i metodologin.

### Karpicke & Roediger — Testing Effect (2008)

*Att hämta fram ur minnet stärker minnet mer än att läsa om.* Effekten är robust över ämnen och åldrar.

Implikation: korta retrieval-tester är *både bedömning och undervisning* samtidigt. De ger lärar-data om vad som landat *och* förstärker elevernas inlärning.

Senare arbete (Roediger & Butler, 2011) bekräftar långtidsretentionseffekten.

### Bjork — Desirable Difficulties (1994)

*Det som upplevs enklare under inlärning ger ofta sämre långtidsretention.* Viss obekvämhet i hämtningen är produktiv.

Implikation: bedömningar får — bör — ha friktion. Om eleven *känner* att det går smidigt, har vi inte testat djupt nog. Detta står i spänning med constructive alignment som vill ha *transparent* alignment mellan ILO och AT.

### Cepeda et al. — Spacing Effect (2006)

*Korta tester utspridda över tid är dramatiskt mer effektiva än komprimerade.*

Implikation: spacing-schemat är central designvariabel. Var 14:e dag bättre än varje vecka för långtidsretention. Var 30:e dag ännu bättre för riktig långsiktighet. **Spacing-schemat ägs av Assessment_suite** — Teaching Suite definierar policy, Assessment_suite implementerar.

### Biggs — Constructive Alignment (1996)

På bedömningssidan: AT (Assessment Tasks) ska bära samma verb som ILO. Om ILO säger *"analysera"* men AT testar *"namnge"*, är kursen ur linje.

Detta är *mekaniskt kontrollerbart* — verbalignment-check. Methodology kan föreslå, läraren bekräftar eller avviker medvetet.

### Biggs & Collis — SOLO-taxonomi (1982)

Kvalitativ progressionsmodell:

- **Prestructural** — inget meningsfullt
- **Unistructural** — en aspekt
- **Multistructural** — flera aspekter, oförbundna
- **Relational** — aspekter förbundna meningsfullt
- **Extended abstract** — generaliserat, abstraherat, hypotes-genererande

Användbar när bedömningen ska fånga *kvalitet av förståelse* över tid — inte bara verb-listor (Bloom).

### Brown, Roediger & McDaniel — Make It Stick (2014)

Populärsyntes av evidence-based learning. Användbar som lärarreferens och för att förklara forskningsgrunden för elever (transparent learning theory).

### Selwyn-kritiken — vad mäts vs vad räknas (2019)

Bedömning är där Selwyn-kritiken biter mest: *"det mätbara tränger ut det meningsfulla"*. Standardiserade tester mäter det som lätt mäts. Det meningsfulla — kritiskt tänkande, kreativitet, moralisk omdöme — låter sig sällan kvantifieras.

Implikation: methodology ska *aldrig* göra retrieval-tester till hela bedömningen. De är *en av flera* — de tjänar testing effect, inte allt lärande. Större autentiska bedömningar (projekt, essäer, dialoger) hör hemma här.

---

## Trigger

Bedömnings-fasen aktiveras i tre lägen:

### 1. Vid kursdesign-fas (designfasen)

Bedömningsstrategin designas i kursdesign-fasen (`design.md` Fas 3). Det här dokumentet *fördjupar* strategi-arbetet om läraren vill gå in mer.

Trigger:

- *"Bedömningsstrategi för [kurs]"*
- *"Designa retrieval-test-schema"*
- *"Verb-alignment-check ILO/AT"*

### 2. Mid-course-justering

Genomförande-fasen (`conduct.md`) flaggar bedömnings-drift. Då aktiveras detta dokument för konkret justering.

Trigger (från genomförande):

- *"Quiz 3 sköts upp 2 veckor — påverkar spacing"*
- *"Calvin-cykel landar inte — lägg till retrieval-test"*

### 3. När teacher_insights kommer från Assessment_suite

Assessment_suite exporterar `teacher_insight`-filer till `Data/Teacher_Insights/` i kursmappen. Methodology hjälper läraren *tolka* vad insights säger.

Trigger:

- *"Visa nya teacher_insights"*
- *"Vad säger senaste retrieval-test-data?"*
- *"Calvin-cykel hämtningsgrad"*

**Förutsättningar (minimum):**

- Kursdesign finns med ILO-register
- För retrieval-tester: Assessment_suite + QuestionForge är konfigurerade

---

## Process

Bedömningsfasen har inte en linjär process — den har *flera processer* för olika triggers. Var och en behandlas separat.

### Process A — Designa bedömningsstrategi

Första gången bedömning planeras för kursen.

#### A1. Inventera ILO

```typescript
file_read({path: "_config/learning_objectives.yaml"})
```

Methodology presenterar:

```
📋 ILO för KURS101_2026 (12 stycken):

Modul 1 — Celler:
  • KURS101.01.celler.struktur (understand, explanation)
  • KURS101.01.celler.organeller (understand, explanation)

Modul 4 — Energiomsättning:
  • KURS101.04.fotosyntes.ljusreaktion (understand, explanation)
  • KURS101.04.fotosyntes.morkerreaktion (understand, explanation)
  ...

Vilka ska bedömas hur?
```

#### A2. Bedömningstyp per ILO-grupp

Tre frågor per ILO-grupp:

> *"För denna ILO — vad är det vi vill att eleven ska visa? Faktarekapitulation, förståelse, tillämpning, något annat?"*

> *"Hur ska den visa det? — Snabbt återkommande retrieval-test, längre skrivuppgift, projekt, dialog?"*

> *"När? — Löpande genom kursen, i samband med modulslut, eller bara i slutbedömningen?"*

Möjliga bedömningstyper:

| Typ | Tjänar | Cadens | Verktyg |
|---|---|---|---|
| **Formativ retrieval-test** | Begreppsförståelse, hämtningsgrad | Var 14:e dag (spacing) | Assessment_suite kör |
| **Korta skrivuppgifter** | Application, perspective, explanation | Per modul | Lärar-bedömning |
| **Större projekt / portfölj** | Analyze, create, evaluate | Termin | Lärar-bedömning |
| **Dialogisk avläsning** | Förståelse i samtal | Löpande, lektion | Lärar (formativ) |
| **Slutbedömning / examen** | Hela ILO-uppsättningen | Slutet av kursen | QuestionForge → Inspera |

**Princip — ingen typ är ensam tillräcklig.** Triangulering är central: olika typer fångar olika aspekter.

#### A3. Verb-alignment-check (Biggs)

För varje bedömningstyp + ILO:

```
ILO KURS101.04.fotosyntes.ljusreaktion: "förklara ATP-bildning"
  Bloom: understand → UbD: explanation
  
Bedömningsuppgift AT-04 (skriftlig): "Beskriv processen i thylakoiden"
  Bloom: remember → UbD: ?
  
⚠️ Möjlig misalignment — ILO: explain, AT: describe
```

Methodology kommenterar:

> *"ILO säger 'förklara'. Bedömningen säger 'beskriva'. Är det medvetet (du vill ha lägre svårighetsgrad i mid-term, högre i sluttest), eller är det ett glapp?"*

**Princip: alignment ligger på *ILO-nivå*, inte *aktivitetsnivå*.** Aktiviteten i lektionen får — bör — vara mer omvägsfull än ILO-verbet (desirable difficulty). Men *bedömningen* ska faktiskt testa det ILO säger. Annars kan studenten klara bedömningen utan att uppfylla ILO.

#### A4. Spacing-schema-design

För retrieval-tester specifikt: *när* ska de köras?

| Cadens | Effekt |
|---|---|
| Varje vecka | Bra korttid, lägre långtidsretention |
| Var 14:e dag | Klassisk spacing — bra balans |
| Var 30:e dag | Stark långtid, men risk att kunskap försvinner emellan |
| Adaptivt (Assessment_suite drivet) | Spacing baserat på individuell hämtningsgrad |

Methodology rekommenderar **var 14:e dag som default**, med option för adaptivt schema om Assessment_suite stöder det.

#### A5. Cross-MCP-koordinering: handoff till QuestionForge

ILO-register är *single source of truth*. När bedömningsstrategin är beslutad, behöver QuestionForge-arbetet startas:

> *"Bedömningsstrategin är klar. För retrieval-tester behöver QuestionForge skapa items mot ILO-koderna. När du är redo: kör QuestionForge mot dessa ILO."*

Methodology *flaggar* — initierar inte QuestionForge automatiskt. Lärare har kontroll över när det arbetet startas.

Vid kursrevision: gamla items kan finnas. Methodology pekar på det:

> *"KURS101_2025 hade items mot dessa ILO. Återanvänd? Modifiera? Ny set?"*

#### A6. Cross-MCP-koordinering: handoff till Assessment_suite

Assessment_suite *äger spacing-schemat och utförandet*. Methodology *definierar policy* (var 14:e dag, vilka ILO ska testas):

> *"Bedömningsstrategin specificerar var 14:e dag retrieval-test. När QuestionForge har items: handa över till Assessment_suite med schemat."*

Konvention för handoff:

```yaml
# I kursmappen: bedömningsstrategi-fil
assessment_handoff:
  questionforge:
    target_ilos: [...]
    item_count_per_ilo: 3-5
    ready_by: 2026-08-01
  assessment_suite:
    spacing_cadence: "biweekly"
    test_duration: 5    # minutes
    ilos_per_test: 5-7
    teacher_insight_cadence: "after each test"
```

#### A7. Save bedömningsstrategi

```typescript
intelligent_save({
  content: <YAML + markdown>,
  content_type: "assessment_strategy",
  suggested_path: "Planning/<course>_<year>_assessment.md"
})
```

### Process B — Mid-course-justering

Genomförande-fas flaggade drift. Vad gör vi?

#### B1. Identifiera vad som driftat

```typescript
find_context({
  content_types: ['course_progress_report'],
  course: "[course]",
  recent: true
})
```

Läs senaste progress-rapporten, hitta drift-flaggor om bedömning.

#### B2. Diagnos

Tre vanliga mönster:

**Pattern 1 — Test sköts upp:** Spacing bryts.

> *"Quiz 3 sköts från v.6 till v.8. Spacing-effekten påverkas. Vill vi: A) köra Quiz 3 nu med dubbla begrepp, B) hoppa över Quiz 3 och fortsätta från Quiz 4, C) komprimera resterande för att kompensera?"*

**Pattern 2 — Begrepp landar inte:** Calvin-cykel-mönstret.

> *"Calvin-cykel-begrepp har låg hämtningsgrad i 3 retrieval-tester i rad. Lägg till extra retrieval-test som riktar in sig specifikt på dessa? Eller är det innehållet som behöver presenteras annorlunda?"*

**Pattern 3 — Bedömning för enkel/svår:**

> *"Quiz-resultatet visar 95% korrekt — testen kanske är för enkel? Eller 30% — för svår? Svarar bedömningen mot ILO-nivå, eller behöver verb justeras?"*

#### B3. Beslut + cross-MCP-uppdatering

A: justera spacing
B: lägg till specifikt test
C: uppdatera item-svårighet (QuestionForge)

Methodology hjälper formulera handoffs:

```
Cross-MCP-uppdateringar:

→ Assessment_suite: "Quiz 3 → flytta till v.8. Kompensera med kortare extra test på 
                     Calvin-cykel i v.10."

→ QuestionForge:    "Item-set 4.fotosyntes.morkerreaktion: addera 3 nya items 
                     med högre svårighet (analyze-nivå)."
```

#### B4. Save uppdaterad bedömningsstrategi

Uppdatera filen från Process A med revision-not.

### Process C — Tolka teacher_insights

Assessment_suite har exporterat teacher_insight-filer.

#### C1. Inventera nya insights

```typescript
find_context({
  content_types: ['teacher_insight'],
  course: "[course]",
  recent: true
})
```

Methodology presenterar:

```
📊 Nya teacher_insights:

Test 5 (2026-11-15, modul 4 fotosyntes):
  • Hämtningsgrad genomsnitt: 65% (över alla 7 begrepp)
  • Calvin-cykel: 48% — fortsatt svagt
  • Solpanel-analogi: 86% — landar starkt
  • Vanlig missuppfattning: thylakoid vs stroma blandas (ungefär hälften av eleverna)

Test 4 (2026-09-24, modul 3 energiomsättning):
  • Hämtningsgrad genomsnitt: 78%
  • ATP-bildning: 92%
  • Cellandningsstegen: 64% — kandidat för återbesök
```

#### C2. Tolkning per insight

Methodology guidar tolkning — *en åt gången*, Larrivee-pushande:

**Hämtningsgrad:**

> *"Calvin-cykel 48% — vad tror du om det? Är det innehållet, sättet det presenterades, eller är det för tidigt att säga (testet kom tätt på lektionen)?"*

**Distraktoranalys (vanlig missuppfattning):**

> *"Thylakoid vs stroma blandas av halva klassen. Är det för dig en *missuppfattning* (de har fel modell) eller *otydlighet* (jag ritade dem för likt på whiteboard)?"*

**Mönster över tester:**

> *"Calvin-cykel 48% i test 5, var i förra terminen också 52% i motsvarande test. Det är systemiskt. Kandidat för design-revision i revisionsfasen — eller mid-course-åtgärd nu?"*

#### C3. Handlingsval

För varje tolkad insight: vad gör jag?

| Handling | När | Hur |
|---|---|---|
| **Lägga till i pre-lesson** | Direkt påverkan på nästa lektion | `goals_supported`-fält i nästa pre-lesson |
| **Ändra retrieval-test-schema** | Adaptivt — fler test på svaga begrepp | Process B (cross-MCP till Assessment_suite) |
| **Uppdatera kursdesign mid-course** | Större ändring | Process B (modul-omdesign) |
| **Notera till revisionsfasen** | Ingen mid-course-åtgärd | Sparas i progress-rapporten |
| **Lägga till i bedömningsstrategi** | Strukturell ändring | Uppdatera assessment_strategy-fil |

#### C4. Save tolkning + handoffs

```typescript
intelligent_save({
  content: <YAML + markdown>,
  content_type: "assessment_interpretation",
  suggested_path: "Analysis/<date>_<topic>_assessment_interpretation.md"
})
```

Plus eventuella cross-MCP-uppdateringar (Process B-handoffs).

---

## Output-struktur

### Bedömningsstrategi (Process A output)

YAML frontmatter:

```yaml
---
type: assessment_strategy
created: 2026-04-26T20:00:00Z
date: 2026-04-26
course_instance: KURS101_2026
tags: [bedomning, kurs101]
status: draft
metadata_version: 1
provenance: course_bedomning_v3
framework: [biggs, black_wiliam, karpicke_roediger, bjork]
based_on:
  - "[[Planning/KURS101_2026_design]]"
  - "[[_config/learning_objectives.yaml]]"
assessment_types:
  - type: formative_retrieval
    cadence: "biweekly"
    duration: 5
    target_ilos: [...]
    owner: assessment_suite
  - type: short_writing
    cadence: "module_end"
    target_ilos: [...]
    owner: teacher
  - type: project
    cadence: "term"
    target_ilos: [...]
    owner: teacher
  - type: final_exam
    cadence: "course_end"
    target_ilos: "all"
    owner: questionforge_inspera
spacing_schema:
  baseline: "biweekly"
  adaptive: false
  exceptions: []
verb_alignment:
  checked: true
  notes: "ILO 'analysera' AT 'beskriva' är medvetet skiftat — beskriva i mid-term, analysera i slutbedömning"
assessment_handoff:
  questionforge:
    target_ilos: [...]
    item_count_per_ilo: 3-5
    ready_by: 2026-08-01
    item_difficulty_range: [understand, analyze]
  assessment_suite:
    spacing_cadence: "biweekly"
    test_duration: 5
    ilos_per_test: 5-7
    teacher_insight_cadence: "after each test"
    distractor_analysis: true
gdpr:
  data_in_kursmapp: "aggregated only"
  raw_student_data_in: "assessment_suite_only"
  teacher_insight_anonymization: "class-level"
---
```

Markdown body — strukturerad enligt bedömningsfilosofi, typ-genomgång, alignment-noter, cross-MCP-instruktioner.

### Tolkning (Process C output)

```yaml
---
type: assessment_interpretation
created: 2026-11-15T16:00:00Z
date: 2026-11-15
course_instance: KURS101_2026
tags: [assessment_interpretation, kurs101, calvin-cykel]
status: draft
metadata_version: 1
provenance: course_bedomning_v3
based_on:
  - "[[Data/Teacher_Insights/2026-11-15_test5_insight]]"
test_id: "test_5"
test_period: "module_4"
key_findings:
  - finding: "Calvin-cykel hämtningsgrad 48%"
    interpretation: "Tredje tester i rad med svagt utfall. Innehållet eller presentationen — kandidat för mid-course-åtgärd."
    action: "Lägga till retrieval-test riktat på Calvin-cykel-begrepp i v.10"
  - finding: "Thylakoid vs stroma blandas"
    interpretation: "Otydlighet i mitt diagram, troligen. Inte missuppfattning."
    action: "Pre-lesson Fas 0.5 — anticipated_difficulties för nästa fotosyntes-lektion"
  - finding: "Solpanel-analogi 89%"
    interpretation: "Landar starkt. Bekräftar pre-lesson-strategin."
    action: "Behåll, eventuellt utvidga som ingång i andra lektioner"
mid_course_changes_triggered:
  - "Assessment_suite: schemalägg extra retrieval-test v.10"
  - "QuestionForge: addera 2 items för thylakoid-vs-stroma"
notes_for_revision:
  - "Calvin-cykel-svårighet är systemiskt — design-revision behövs nästa upplaga"
---
```

---

## Spänningar att hålla i bedömning

### Testing effect vs. formativ bedömning

Båda är evidence-based, men de drar olika riktningar.

Testing effect: kvantifierbar, repeterbar, lättillgänglig (Assessment_suite).
Formativ bedömning: dialogisk, kvalitativ, relationell (lärar-driven).

**Hur hanteras spänningen?** Princip: retrieval-tester är *komplement*, inte ersättning. Methodology ska *aldrig* göra retrieval-tester till hela bedömningen. Triangulering är gold standard — flera typer tillsammans.

Pre-lesson Fas 2G:s pushback hjälper också: när teacher_insights surfar, methodology säger inte *"fler tester"* utan *"samtal om dessa begrepp"*.

### Alignment vs. desirable difficulties

Biggs vill alignment — direkt match ILO/TLA/AT. Bjork visar att smidighet ger sämre djuplärande.

**Hur hanteras spänningen?** Princip: alignment ligger på *ILO-nivå*. Aktiviteter får vara mer omvägsfulla. Bedömningar ska *testa* ILO-nivå men kan ha *desirable difficulty* i format (t.ex. utdragna tester, items som kräver återhämtning över flera distraktorer).

### Det mätbara vs. det meningsfulla (Selwyn-kritik)

Standardiserade tester mäter det som låter sig mätas. Det meningsfulla — kritiskt tänkande, kreativitet, omdöme — låter sig sällan kvantifieras.

**Hur hanteras spänningen?**

- *Inte göra retrieval-tester till primärt mått.* De är *en av flera*.
- *Större autentiska bedömningar finns alltid.* Projekt, essäer, dialoger.
- *SOLO-taxonomi för kvalitativ progression.* Inte bara verb-listor.
- *Kvalitativa marginaler.* Tolkningsfasen (Process C) är där kvantitativ data möter kvalitativ läsning. Inte bara *"48%"* utan *"vad betyder det?"*

### Standardiserad bedömning vs. autentisk bedömning

Inspera-prov vs. portfölj. Den klassiska spänningen i högskolepedagogik.

**Hur hanteras spänningen?** Båda finns. Slutbedömning kan vara Inspera (QuestionForge → Inspera-flödet) men bygger på *alignment* med ILO. Större ICA-uppgifter (autentisk bedömning) bär djupare lärande. Designval per kurs.

### Teacher-facing analytics vs. administrationsdrift

Teacher_insights är data som administrationen *kunde* få tillgång till. Hela arkitekturen försvarar mot det — separation by workspace.

**Hur hanteras spänningen?** GDPR-strikt. Methodology påminner när insights bär elev-identifierbar data — content-scanner skall ha flaggat redan på Assessment_suite-sidan, men kontroll är extra säkerhet. Insights stannar i kursmappen, delas inte automatiskt uppåt.

---

## GDPR — bedömningens kritiska zon

Bedömning är där GDPR-aspekten är skarpast i hela kursen.

| Datatyp | Hantering |
|---|---|
| Studentprestationsdata, individuella elevsvar | **Assessment_suite workspace** — stannar där |
| Test-items i bank | **QuestionForge** — kursnivå, ej elevdata |
| Teacher_insights (aggregerad data) | **Kursmappen** — anonymiserad, klassnivå, ej individnivå |
| Distraktoranalys (vanliga missuppfattningar) | Aggregerad — *"ungefär hälften av eleverna blandar X och Y"* — OK |
| Bedömningsstrategi-dokument | Kursmappen — designval, ej elevdata |
| Citat från elever i tolkning-rapport | Aggregerad nivå (*"någon elev sa…"*), aldrig attribuerad |

**Princip:** *separation by workspace*. Studentrådata lever aldrig i kursmappen. Det som flödar in är *aggregerade pedagogiska insikter*.

**Content-scanner körs på alla teacher_insight-filer innan de hamnar i Teaching Suite** — detta är en av de viktigaste cross-MCP-konventionerna. Om något elevidentifierbart syns: flagga och stoppa, det är ett brott mot workspace-separationen.

---

## Tools som används

| Tool | Roll i bedömning |
|---|---|
| `load_methodology` | Laddar detta dokument |
| `find_context` | Söker teacher_insights, tidigare assessment_strategy, progress-rapporter |
| `file_read` | Läser ILO-register, kursdesign |
| `intelligent_save` | Sparar `assessment_strategy` och `assessment_interpretation` |
| `log_process_event` | Loggar `assessment_strategy_designed`, `assessment_interpreted`, ev. `mid_course_assessment_change` |

**Inga nya tools krävs i Teaching Suite.** Cross-MCP är där arbetet bor:

- **QuestionForge** — egen verktygsuppsättning för item-konstruktion (ej beskrivet här)
- **Assessment_suite** — egen verktygsuppsättning för testning, bedömning, aggregering (ej beskrivet här)

---

## Integration med andra processer

### Bedömning ← Kursdesign

Kursdesign-fasens bedömningsstruktur (Fas 3) initierar bedömnings-arbetet. Detta dokument fördjupar.

### Bedömning ← Genomförande

Genomförande-fasens drift-flaggor om bedömning aktiverar Process B (mid-course-justering).

### Bedömning ↔ Pre-lesson

Tvåvägsflöde:

- *Pre-lesson Fas 2G* läser teacher_insights — input från bedömnings-processen
- *Bedömnings-tolkning* påverkar pre-lesson direkt — *"adressera Calvin-cykel-svårighet i nästa lektion"*

### Bedömning → Utvärdering

Bedömningsdata över hela kursen är input till slutlig utvärdering. Hämtningsgrad, alignment-utfall, autentiska bedömningar — alla bidrar.

### Bedömning → Revision

Mönster i bedömningsdata blir kandidater för design-revision. *"Calvin-cykel 48% i tre upplagor i rad — design-fel, inte studentfel"*.

### Cross-MCP — QuestionForge

QuestionForge skapar items mot ILO-koder. Bedömningsstrategin definierar hur många items per ILO, svårighetsspridning, vilken cadens. Cross-MCP-handoff sker via:

- ILO-register (single source of truth)
- Bedömningsstrategi-fil med `questionforge`-sektion
- Manuell handoff via note vid större ändringar

### Cross-MCP — Assessment_suite

Assessment_suite kör testerna. Bedömningsstrategin definierar policy (spacing, target ILO). Cross-MCP-handoff sker via:

- Bedömningsstrategi-fil med `assessment_suite`-sektion
- Teacher_insight-export från Assessment_suite till `Data/Teacher_Insights/`
- Manuell handoff vid mid-course-justering

---

## Brygga framåt — bedömning genererar data som triggar `student_data_to_teacher_bridge`

Bedömningsdesign är *startpunkten* för en av Teaching Suite:s viktigaste cross-cycle-bryggor. Varje bedömning som specifieras här blir framtida data som triggar reflektion via `student_data_to_teacher_bridge`. Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): policyn (B) + handlingen (C) här som prosa; detektionen (A) i kod (delvis i Assessment_suite, delvis i Teaching Suite).

### Cross-MCP-arkitektonisk notis

Detta är den enda av v3-bryggorna som *spänner över MCP-server-gränsen*. Bedömningen körs i Assessment_suite; bryggans aktivering sker i Teaching Suite när data landar. Det betyder att:

- **Detektionen (A)** är delad: Assessment_suite skapar `teacher_insight`-filer i `Data/Teacher_Insights/`; Teaching Suite detekterar dem mot lektions/kurs-context
- **Policyn (B)** lever här (Teaching Suite) och i `student_data_to_teacher.md` — Teaching Suite avgör *när* bryggan ska föreslås
- **Handlingen (C)** ägs av Teaching Suite — Cowork formulerar inbjudan till lärartolkning

### `student_data_to_teacher_bridge` — när nya assessment-resultat landar

**Villkor (B):** Cowork ska föreslå bryggan när minst ett av följande gäller, i samband med att en bedömning slutförts:

- En ny `teacher_insight`-fil har skrivits till `Data/Teacher_Insights/` av Assessment_suite för en bedömning specificerad i denna kurs
- Den nya insikten visar **utfallsmönster värda diskussion** (ILO-utfall under förväntad nivå, distraktoranalys-mönster, eller spridningsmönster Cowork detekterar)
- Sedan föregående trigger har det passerat tillräckligt med tid för att lärartolkning ska vara värdefull (≥3 dagar — inte sammanslå alltför färska resultat)

**Handling (C):** Cowork inviterar till tolkning, inte slutsats:

> *"Assessment_suite har levererat insikter från [bedömningens namn], avslutad [datum]. Resultaten visar [konkret beskrivning utan värdering — t.ex. 'Q3 om Calvin-cykeln: 42 % rätt, distraktor B (ljus-reaktion) valdes av 39 %']. Hur ser du på detta? Ska vi reflektera över det tillsammans, eller vänta in flera bedömningar för en bredare bild?"*

Vid lärarens **ja:** invokera `load_methodology('student_data_to_teacher_bridge')`. Vid **vänta:** notera i `Reflections/Bryggor/<datum>-data_deferred.md` med `triggered_action: deferred`. Datan ligger kvar i `Data/Teacher_Insights/` och bryggan kan triggas manuellt senare.

**Detektion (A):**

```typescript
find_context({
  content_types: ['teacher_insight'],
  course: "[course]",
  since: "[last_bridge_check_date]"
})
```

Filsökning, mtime-jämförelse, course-matchning är ren mekanik. *Vad insikten betyder pedagogiskt* avgör läraren — Cowork ska inte tolka.

**Princip från bridge-doc:en — Selwyn-medvetenhet:** Cowork **interpreterar inte**. Aldrig *"42 % rätt — det är dåligt"*. Bara *"42 % rätt på Q3. Hur ser du på det?"*. Det är just denna princip som skiljer bryggan från institutionell learning analytics. Bedömningens design ska aldrig dikteras av vad som *känns* effektivt att mäta — den dikteras av vad som är pedagogiskt meningsfullt att veta. Bryggan håller distinktionen.

Se `methodology/bridges/student_data_to_teacher.md` för bryggans designprincip (Black & Wiliam, Hattie, Selwyn-grunder) och GDPR-resonemang.

---

## Edge cases

### Inget Assessment_suite konfigurerat

Lärare har inte satt upp Assessment_suite, eller använder annat verktyg.

**Methodology fallback:**

- Bedömningsstrategin kan ändå designas
- Retrieval-tester kan köras manuellt (papper, exit ticket, kahoot) med samma princip
- Teacher_insights produceras manuellt — läraren noterar mönster i `Analysis/`-mappen
- ILO-alignment-check fungerar utan cross-MCP

### Inga teacher_insights än

Kursen har inte hunnit producera retrieval-test-data ännu.

**Methodology fallback:**

- Process A och B fungerar normalt (designar och justerar policy)
- Process C aktiveras inte
- Pre-lesson Fas 2G: tom — inga insights att läsa

### Drift mellan ILO-register och QuestionForge-items

Kurs reviderar ILO mid-course. QuestionForge har items mot gamla koder.

**Methodology fallback:**

- Methodology flaggar konflikt
- Föreslår: deprecation-period
- Cross-MCP-handoff: notifiera QuestionForge-arbete via note

### Bedömningsstrategin behöver radikal ompröving mid-course

Sällsynt men händer. Hela bedömningsfilosofin känns fel.

**Methodology fallback:**

- Acceptera utan dom
- Kör Process A från början med revision-flagga
- Notera till revisionsfasen att större omprövning behövs nästa upplaga
- Mid-course: minsta möjliga ändring för kontinuitet

### Två elever vägrar retrieval-tester

GDPR/etisk situation. Studenterna vill inte delta i löpande tester.

**Methodology fallback:**

- *Detta hör inte till methodology* — det är skoladministrativ fråga
- Methodology noterar: *"Bedömningsdesignen förutsätter att tester körs. Om elever inte deltar, justera tolkningen — datan är inte representativ för hela klassen."*

### Student-anonymisering bryts oavsiktligt

Ett teacher_insight innehåller elevidentifierbar information.

**Methodology fallback:**

- *Detta är allvarligt* — det är ett brott mot cross-MCP-separationen
- Content-scanner ska ha flaggat tidigare. Om inte: stoppa, radera filen, eskalera
- Revidera Assessment_suite:s anonymiseringsprocess
- Ny insight-fil körs igen efter översyn

---

## Kvalitetskriterier

### En bra bedömningsstrategi har:

**Triangulering:**

- Flera bedömningstyper, inte bara retrieval-tester
- Autentiska bedömningar inkluderade (projekt, essäer, dialoger)
- Formativ avläsning + summativ bedömning balanserade

**Alignment:**

- ILO/AT-verb verb-aligned (eller medvetet skiftat med motivering)
- Klafki-test passerat: bedömningarna fångar det värda att lära

**Spacing-design:**

- Retrieval-tester på spacing-schemat
- Cadens motiverad (var 14:e dag default, anpassningar dokumenterade)

**Cross-MCP-koordinerat:**

- Handoffs till QuestionForge och Assessment_suite tydligt definierade
- ILO-register som single source of truth
- GDPR-gränsen explicit

**Hypotes-medveten:**

- Strategin är *pröv-bar* — designed för revision
- Inbyggda check-points

### En dålig bedömningsstrategi har:

- Bara retrieval-tester (för smal triangulering)
- ILO/AT-misalignment utan motivering
- Ingen spacing-design eller helt komprimerade tester
- Cross-MCP-handoffs vaga eller saknade
- Studentdata blandas med kursdata (GDPR-brott)
- Alignment med Klafki-vag — testar det lätt mätbara, missar det meningsfulla

---

## Output-exempel (kort, bedömningsstrategi)

```yaml
---
type: assessment_strategy
created: 2026-04-26T20:00:00Z
course_instance: KURS101_2026
tags: [bedomning, kurs101]
status: draft
metadata_version: 1
provenance: course_bedomning_v3
framework: [biggs, black_wiliam, karpicke_roediger, bjork]
based_on:
  - "[[Planning/KURS101_2026_design]]"
  - "[[_config/learning_objectives.yaml]]"
assessment_types:
  - type: formative_retrieval
    cadence: "biweekly"
    duration: 5
    target_ilos:
      - KURS101.01.celler.struktur
      - KURS101.04.fotosyntes.ljusreaktion
      # ...
    owner: assessment_suite
  - type: short_writing
    cadence: "module_end"
    target_ilos: [...]
    owner: teacher
  - type: project
    cadence: "term"
    target_ilos: [...]
    owner: teacher
spacing_schema:
  baseline: "biweekly"
  adaptive: false
verb_alignment:
  checked: true
  notes: "ILO 'analysera' AT 'beskriva' i mid-term medvetet — fördjupas i sluttest"
assessment_handoff:
  questionforge:
    target_ilos: [12 koder]
    item_count_per_ilo: 3-5
    ready_by: 2026-08-01
  assessment_suite:
    spacing_cadence: "biweekly"
    test_duration: 5
    ilos_per_test: 5-7
    teacher_insight_cadence: "after each test"
gdpr:
  data_in_kursmapp: "aggregated only"
  raw_student_data_in: "assessment_suite_only"
---

# Bedömningsstrategi — KURS101_2026

## Filosofi

Triangulering över fyra bedömningstyper. Retrieval-tester (Karpicke & Roediger)
för begreppsförståelse. Skrivuppgifter för förståelse och perspektiv. Projekt för
analys och kreativitet. Slutbedömning för helheten.

## Per-ILO-mappning

[Tabell ILO → bedömningstyp]

## Spacing-schema

Var 14:e dag retrieval-test (Cepeda et al. 2006). Adaptivt schema kan utvärderas
nästa upplaga.

## Verb-alignment

[Genomgång ILO/AT med noter om medvetna avvikelser]

## Cross-MCP-handoff

QuestionForge: 12 ILO, 3-5 items per ILO, ready 2026-08-01.
Assessment_suite: var 14:e dag, 5 min, 5-7 ILO per test.

## GDPR

Studentdata stannar i Assessment_suite. Endast aggregerade teacher_insights
flödar tillbaka till kursmappen.
```

---

## Bibliotek — prompts & frågor

### Trigger

- *"Designa bedömningsstrategi för [kurs]"*
- *"Verb-alignment-check ILO/AT"*
- *"Visa nya teacher_insights"*
- *"Mid-course-justering bedömning"*

### Bedömningstyp-design (Process A)

- *"För denna ILO — vad ska eleven visa? Faktarekapitulation, förståelse, tillämpning, analys, kreativitet?"*
- *"Hur ska den visa det — retrieval-test, skrivuppgift, projekt, dialog?"*
- *"När? — Löpande, modulslut, eller bara slutbedömning?"*
- *"Är retrieval-test rätt typ för denna ILO, eller behöver det fångas annorlunda?"*

### Verb-alignment-check

- *"ILO säger 'analysera'. AT säger 'beskriva'. Medvetet eller glapp?"*
- *"Klafki-test för denna AT: testar den det värda att lära, eller bara det lätta att mäta?"*
- *"Bjork-spänning: kan vi göra denna AT lite svårare, så långtidsretentionen blir bättre?"*

### Spacing-schema (Process A)

- *"Var 14:e dag är default. Annan cadens motiverad?"*
- *"Adaptivt schema baserat på elevernas hämtningsgrad — vill vi prova?"*

### Cross-MCP-handoffs

- *"Handoff till QuestionForge: vilka ILO, hur många items per ILO, deadline?"*
- *"Handoff till Assessment_suite: spacing, duration, ilos per test, teacher_insight-cadens?"*
- *"GDPR: bekräftar du anonymiseringsnivån för insights?"*

### Mid-course-justering (Process B)

- *"Quiz X sköts upp. Vill vi: justera spacing, hoppa över, eller komprimera?"*
- *"Begrepp Y landar inte. Lägg till retrieval-test, eller är det innehåll/presentation som behöver ändras?"*
- *"Test-resultat extremt (95% eller 30%). Är test fel svårighetsgrad, eller är det lärandet det signalerar?"*

### Tolkning av teacher_insights (Process C)

- *"Calvin-cykel 48% — innehållet, presentationen, eller är det för tidigt att säga?"*
- *"Distraktor-mönster: är det missuppfattning eller otydlighet i mitt sätt att förklara?"*
- *"Mönster över upplagor: systemiskt eller bara denna grupp?"*

### Handlingsval (Process C)

- *"Vad gör du med detta — pre-lesson-anpassning, mid-course-ändring, notera till revision?"*
- *"Påverkar tolkningen kursdesignen, eller bara nästa lektion?"*

### Avslut

- *"Spara strategin/tolkningen. Ska jag flagga något till QuestionForge eller Assessment_suite?"*
- *"Loggar bedömnings-arbetet. Methodology påminner om uppdateringar nästa cykel-pass."*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — arkitektur, kurscykeln, cross-MCP-gränsdragning
- **`design.md`** — bedömningsstrategi-skiss första gången
- **`conduct.md`** — drift-flaggor om bedömning triggar Process B
- **`evaluation.md`** — bedömningsdata över hela kursen
- **`pre_lesson.md`** — Fas 2G läser teacher_insights

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Black & Wiliam (formativ bedömning), Karpicke & Roediger (testing effect), Bjork (desirable difficulties), Cepeda et al. (spacing effect), Biggs (constructive alignment), Biggs & Collis (SOLO-taxonomi), Brown/Roediger/McDaniel (Make It Stick), Selwyn-kritik som motvikt.

**Tre processer (inte en linjär):**

- Process A: Designa bedömningsstrategi (vid kursdesign-fas)
- Process B: Mid-course-justering (vid drift)
- Process C: Tolka teacher_insights (löpande)

**Spänningar (fem):**

- Testing effect vs formativ bedömning
- Alignment vs desirable difficulties
- Det mätbara vs det meningsfulla (Selwyn)
- Standardiserad vs autentisk bedömning
- Teacher-facing vs administrationsdrift

**Cross-MCP — den största aspekten:**

- QuestionForge skapar items mot ILO
- Assessment_suite kör tester, exporterar teacher_insights
- Teaching Suite definierar policy, mottar insights, integrerar i pre-lesson
- Cross-MCP-RFC är största kvarvarande arbete


