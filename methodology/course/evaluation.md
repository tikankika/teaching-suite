---
type: exploration
status: draft
created: 2026-04-27T20:46:57
origin: desktop
project: Teaching Suite
---

# Methodology — Kurscykeln: Utvärdering

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **utvärderings-fasen i kurscykeln** — retrospektiv granskning av kursen som helhet, innan den går in i revisionsfasen.

```
KURSDESIGN  →  GENOMFÖRANDE  →  BEDÖMNING  →  UTVÄRDERING  →  REVISION
                                                ↑
                                                detta dokument
```

**Lärarens fråga (här):** *Linjerade kursen som helhet? Lärde de sig det jag sa de skulle? Höll min designhypotes? Vad ska revisionen ändra?*

**Tempo:** Diskret moment vid kursslut (eller modulslut för stora moduler). Inte kontinuerligt — utvärdering är bakåtblickande syntes, inte löpande aktivitet.

**Position i cykeln:** Utvärdering är *bryggan* mellan kursens *händelser* (genomförande, bedömning) och *beslut* (revision). Methodology samlar och triangulerar; läraren tolkar och beslutar.

---

## Grundprincip — utvärdering är retrospektiv tolkning

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I utvärderings-fasen är ställning/mening-uppdelningen tydlig:

| AI-arbetet (ställning) | Lärar-arbetet (mening) |
|---|---|
| Aggregera alla genomförande-rapporter, bedömningstolkningar, lektionsdata | Tolka vad helheten betyder |
| Sammanställa studentutvärderings-data (om finns) | Bedöma trovärdighet och vikt av olika datakällor |
| Visualisera alignment-utfall ILO/utfall | Avgöra om misalignment är problem eller upptäckt |
| Föreslå mönster över kursens längd | Bedöma vilka mönster är design-relevanta |

**Sub-princip från arkitekturen: Stenhouse — kursen är hypotes som prövats.** Utvärdering är där hypotesen *läses av*. Inte för att döma kursen — för att lära av den. Designval som höll behåller sig själva (eller dokumenteras explicit). Designval som inte höll blir kandidater för revision.

**Sub-princip: triangulering är gold standard.** En datakälla räcker aldrig. Lärar-data (genomförande-rapporter, REFL) + bedömningsdata (teacher_insights) + studentutvärderingar — tillsammans starkare än någon ensam.

---

## Teoretisk grund

### Biggs — alignment-fråga retrospektivt (1996)

Constructive alignment ställs *i förväg* (kursdesign). Här ställs den *i efterhand*:

> *"Linjerade kursen som helhet? Bar TLA samma verb som ILO i praktiken? Bar AT samma som ILO?"*

Skillnaden är att design-alignment är *avsikt*, retrospektiv alignment är *utfall*. Båda är meningsfulla men olika data.

### Stenhouse — curriculum as inquiry (1975)

*Designen är hypotes som prövas i praktik.* Utvärderings-fasen är där hypotesen *läses av*.

Stenhouses centrala fråga: *"Vad lärde vi om kursen genom att köra den?"* — inte *"hur väl utförde vi planen?"*. Skiftet är viktigt: hypotesen-utvärdering förutsätter att vi *förväntar oss* att lära något, inte bara genomföra.

### Schön — reflection-on-action på kursnivå (1983)

Den största kursnivå-reflektionen. Genomförande-fasens mid-course-reflektioner är delar; utvärdering är helheten.

### Black & Wiliam — formativt även för läraren (1998)

Utvärdering är bedömning av kursen — för läraren själv, för revisionsfasen, för nästa upplaga. Black & Wiliams princip om *bedömning som verktyg för lärande* applicerar även här: utvärdering är till för att läraren ska *lära av kursen*, inte för att rapportera till någon annan.

### Selwyn — vad mäts vs vad räknas (2019)

I utvärderings-fasen biter Selwyn-kritiken hårdast. Det finns frestelse att läsa kursen genom det mätbara — testresultat, gradering, studentbetyg. Det meningsfulla — om kursen *bildar* eleverna, om de utvecklar omdöme, om något oväntat hände — låter sig sällan kvantifieras.

Implikation: utvärdering måste ge plats för *kvalitativt material* (REFL-citat, brygga-mönster, fri-text-feedback) lika mycket som kvantitativt (alignment, hämtningsgrad, studentbetygsfördelning).

### Carlgren — kunskapsbas-traditionen (1999)

Carlgrens svenska tradition: lärararbetet bygger upp en *professionell kunskapsbas* över tid. Utvärdering är där kursens bidrag till den kunskapsbasen formuleras. Det är inte bara feedback om denna kurs — det är kunskap om biologi 2 som ämne, om denna åldersgrupp, om denna lärare.

---

## Trigger

Utvärderings-fasen aktiveras vid:

### 1. Kursslut

Mest naturlig trigger. Sista lektionen är klar, slutbedömningar är inne. Lärare har en stund innan nästa termin.

Trigger-fraser:

- *"Utvärdera [kurs]"*
- *"Sammanställ [kurs] [år]"*
- *"Slutrapport för [kurs]"*

### 2. Modulslut (för stora kurser)

Långa kurser kan utvärderas modul för modul. Inte ersättning för kursslut-utvärderingen, utan komplement.

Trigger:

- *"Utvärdera modul X i [kurs]"*

### 3. Vid revisionsfas-start

När läraren börjar revidera inför nästa upplaga (`revision.md`) och inte har utvärdering klar — methodology säger:

> *"Innan vi reviderar — har vi utvärderat? Det blir grunden för revisionsbesluten."*

**Förutsättningar (minimum):**

- Kursdesign-dokument finns
- Genomförande-rapporter finns (åtminstone en)
- Slutbedömningsdata finns (eller är mer eller mindre klar)

**Önskvärt:**

- Studentutvärderingar (om finns)
- Bedömningsdata över hela kursen (teacher_insights aggregerade)
- Alla post-lesson-reflektioner
- Mid-course-rapporter

---

## Process

### Fas 0 — Trigger + scope

Methodology frågar:

> *"Utvärderar vi hela kursen, eller en specifik modul?"*

> *"Har studentutvärderingar inkommit? Vill vi inkludera dem?"*

Bestäm scope och datakällor.

### Fas 1 — Aggregera all data

Läs hela kursens material:

```typescript
aggregate_logs({
  course: "[course]",
  period: "<full_course>",
  group_by: "module"
})

find_context({
  content_types: [
    'course_design',
    'course_progress_report',
    'assessment_strategy',
    'assessment_interpretation',
    'teacher_insight',
    'reflection',
    'post_lesson_auto',
    'student_evaluation'   // om finns
  ],
  course: "[course]"
})
```

Methodology presenterar översikt:

```
📊 Underlag för utvärdering — KURS101_2026:

Kursdesign:
  • [[Planning/KURS101_2026_design]] (2026-04-26)
  • [[Planning/KURS101_2026_assessment]] (2026-04-26)
  • [[_config/learning_objectives.yaml]] (12 ILO)

Genomförande:
  • 18 lektioner körda (av 20 planerade)
  • 2 mid-course progress-rapporter
  • 12 av 12 ILO med data

Reflektioner:
  • 14 post-lesson-reflektioner (8 Gibbs, 6 Rolfe)
  • 3 brygga-intentions

Bedömning:
  • 8 retrieval-tester körda (Assessment_suite)
  • 3 modulslutsbedömningar
  • Slutbedömning: Inspera-prov, helklass
  • 6 teacher_insights aggregerade

Studentutvärderingar:
  • [27 svar inkomna 2026-12-15]

Vill vi börja någonstans, eller kör jag aggregeringstabeller först?
```

### Fas 2 — Alignment-fråga retrospektivt

Den klassiska Biggs-frågan, men retrospektivt:

**ILO-täckning:**

```
ILO-täckning över kursen:

  ✅ Fullt genomförd (10 av 12):
      KURS101.01.celler.struktur — alla aktiviteter, all bedömning, hög hämtning
      KURS101.04.fotosyntes.ljusreaktion — full täckning
      ...

  ⚠️ Partiellt genomförd (1 av 12):
      KURS101.04.fotosyntes.morkerreaktion — täckt i lektioner men låg hämtningsgrad

  ❌ Ej genomförd (1 av 12):
      KURS101.04.fotosyntes.c4 — skippad mid-course (medvetet)
```

**Verb-alignment-utfall:**

```
ILO-AT-alignment retrospektivt:

  Stark alignment (5 ILO): TLA bar samma verb som ILO i lektioner och 
                             bedömning matchade.

  Glapp (2 ILO):
    - KURS101.04.fotosyntes.morkerreaktion: ILO 'förklara', 
      bedömning testade mest 'beskriva'.
    - KURS101.06.ekologi.kretslopp: ILO 'analysera', 
      slutprov hade mest faktarekapitulation.

  Skiftat (medvetet, 3 ILO): mid-term hade lägre verb än sluttest.
```

**Methodology lägger fram, läraren tolkar:**

> *"Mörkerreaktion-glapp — ILO säger förklara, bedömning testade beskriva. Är det varför hämtningsgraden var låg (lärandemålet aldrig faktiskt testat), eller är det innehåll som inte landade?"*

### Fas 3 — Studentutvärderings-läsning (om finns)

Viktigt att hantera med omsorg. Studentfeedback är värdefull men kan vara kraftfull.

**Läs först kvalitativt, sen kvantitativt.** Methodology presenterar:

- Fri-text-feedback först (vad eleverna *säger*)
- Numeriska skattningar därefter (hur de *graderar*)

**Princip från Brookfield:** *elevernas ögon* är en av reflektionens fyra lenser. Denna fas är där den lensen aktiveras på kursnivå.

**Affektiv check-in:**

> *"Innan vi går djupare — hur känns det att läsa detta? Studentfeedback kan väcka mycket. Vill vi pausa, eller fortsätter vi?"*

**Tolkningsstöd, Larrivee-pushande:**

> *"Tre elever skriver att 'Calvin-cykel var förvirrande'. Det resonerar med hämtningsgrad 45%. Är det design-fel, undervisnings-fel, eller är det ett ämne som faktiskt är förvirrande och eleverna identifierar det rätt?"*

**Selwyn-vakthet:**

- Numeriska skattningar är *en* signal, inte sanning
- Konsensus i fri-text > genomsnitt i Likert-skala
- Outlier-feedback (en student som ogillar starkt eller älskar) säger ofta mer än genomsnittet

### Fas 4 — Triangulering

Tre eller fyra datakällor — vilka stämmer överens, vilka säger emot varandra?

**Triangulerings-tabell:**

```
Område: Mörkerreaktion / Calvin-cykel

  Lärar-data (REFL):       "Landar inte trots flera försök" (3 reflektioner)
  Bedömningsdata:          Hämtningsgrad 48% (under genomsnitt)
  Studentutvärdering:      "Förvirrande" (några svar)
  Genomförande-rapport:    Drift "concepts_missing" flaggat 2 gånger
  
  → Konsensus: detta är ett område som behöver design-revision
```

```
Område: Klimat-koppling till fotosyntes

  Lärar-data (REFL):       "Spontant fynd, fungerade bra" (lektion 14)
  Bedömningsdata:          Inte testad direkt
  Studentutvärdering:      "Bästa lektionen var när vi pratade klimat" (5 svar)
  Genomförande-rapport:    Off-topic-flagga, men teaching-positivt
  
  → Konsensus: designa in klimatkopplingen i nästa upplaga
```

**Princip:** triangulering är inte aritmetik. Tre källor som alla säger samma sak är starkare evidens, men en stark röst (en student som artikulerar något distinkt, en lärar-reflektion med skarp insikt) kan väga tyngre än fem måttliga signaler.

### Fas 5 — Hypotes-utvärdering (Stenhouse)

Återgå till kursdesign-dokumentets *exemplariskt*-fält och Klafki-skiss. Höll designens hypotes?

> *"Du designade KURS101_2026 med exemplaritet 'Biologi 2 som mötet mellan cellnivåns mekanismer och ekologins systemtänkande'. Höll det? Mötte eleverna båda — och kunde de se kopplingen?"*

> *"Du satsade på 'tematiska ingångar via samhällsfrågor'. Stötte du på tillräckligt många samhällsfrågor? Var det rätt strategi för denna grupp?"*

**Princip från Stenhouse:** designens *hypoteser* är värdefulla även när de inte håller. *"Vi trodde X skulle fungera, det gjorde inte" är minst lika lärorikt som *"vi trodde X skulle fungera, det gjorde det"*.

### Fas 6 — Synthesis för revision

Konsolidera till en *revisions-agenda* — vad ska revisionsfasen ta tag i?

Methodology hjälper läraren strukturera:

```
Revisions-kandidater:

🔴 Hög prioritet (data säger systemiskt):
  • Mörkerreaktion / Calvin-cykel — design-fel, har varit svagt över upplagor
  • Modul 3 underestimering (+30% timing) — strukturellt
  • C4-växter — ta bort eller flytta till ekologi-modulen

🟡 Medel prioritet (intressanta fynd, ej säker bild):
  • Klimat-koppling som ingång — väg in i fler moduler?
  • Solpanel-analogin starkt → utöka till andra energibegrepp?

🟢 Låg prioritet (notera för senare):
  • Slutprov-strukturen — eleverna nämnde stress, undersök format
  • Retrieval-test-cadens — adaptivt schema kan utvärderas
```

### Fas 7 — Save utvärderings-rapport

```typescript
intelligent_save({
  content: <YAML + markdown>,
  content_type: "course_evaluation_report",
  suggested_path: "Analysis/<course>_<year>_evaluation.md"
})
```

### Fas 8 — Log + handoff till revision

```typescript
log_process_event({
  type: "course_evaluated",
  files: ["Analysis/..."],
  trigger: "course_evaluation"
})
```

Methodology säger till läraren:

> *"Utvärdering sparad. Revisions-agendan är formulerad. När du är redo — gå till `revision.md` med detta som ingång."*

Cross-MCP-noteringar (om relevanta):

- *"Mörkerreaktion-svårighet är systemiskt. QuestionForge bör notera när items revideras."*
- *"Slutprov-stressen — Assessment_suite kan föreslå alternativa format."*

---

## Output-struktur

### YAML frontmatter

```yaml
---
type: course_evaluation_report
created: 2026-12-20T14:00:00Z
date: 2026-12-20
course_instance: KURS101_2026
tags: [utvardering, kurs101, slutrapport]
status: draft
metadata_version: 1
provenance: course_utvardering_v3
framework: [biggs, stenhouse, brookfield]
based_on:
  - "[[Planning/KURS101_2026_design]]"
  - "[[Planning/KURS101_2026_assessment]]"
  - "[[Analysis/KURS101_2026_progress_mid_term]]"
  - "[[Analysis/KURS101_2026_progress_endmodule]]"
period:
  start: 2026-08-15
  end: 2026-12-15
  scope: "full_course"
ilo_coverage:
  full: 10
  partial: 1
  not_covered: 1
  total: 12
alignment_outcome:
  strong: 5
  glapp: 2
  shifted_intentionally: 3
student_evaluation:
  responses: 27
  total_enrolled: 30
  affective_themes: ["positivt om dialog-format", "förvirring om Calvin-cykel"]
  numerical_summary: "se rapport-body"
hypothesis_evaluation:
  exemplaritet_holds: true
  zugänglighet_holds: "delvis"
  notes: "se rapport-body"
revision_agenda:
  high_priority:
    - "Mörkerreaktion / Calvin-cykel — design-fel"
    - "Modul 3 underestimering (+30% timing)"
    - "C4-växter — ta bort eller flytta"
  medium_priority:
    - "Klimat-koppling som ingång"
    - "Solpanel-analogin utvidga"
  low_priority:
    - "Slutprov-format"
    - "Adaptivt retrieval-schema"
cross_mcp_notes:
  questionforge: ["Items för Calvin-cykel kandidater för revision"]
  assessment_suite: ["Slutprov-format kan utvärderas"]
---
```

### Markdown body — strukturella sektioner

1. **Översikt** — kursperiod, datakällor, scope
2. **ILO-täckning** — tabell + kvalitativ kommentar
3. **Verb-alignment-utfall** — tabell + tolkning
4. **Studentutvärderings-läsning** — kvalitativt först, kvantitativt sedan
5. **Triangulering** — område-för-område med källor
6. **Hypotes-utvärdering** — höll Klafki-visionen?
7. **Revisions-agenda** — prioriterad lista (hög/medel/låg)
8. **Cross-MCP-noteringar** — vad QuestionForge och Assessment_suite bör veta
9. **Lärdomar för läraren** — det som blir kunskapsbas (Carlgren)
10. **Frågor som inte kan besvaras nu** — vad behöver mer data eller tid

---

## Spänningar att hålla i utvärdering

### Studentutvärdering vs lärar-tolkning

Studenter ger feedback från sin position; läraren har annan kunskap. När de divergerar — vem har rätt?

**Hur hanteras spänningen?** Princip: båda är data, ingen är *sanningen*. Läraren tolkar genom alla lenser (Brookfield) — studentens, kollegors (om relevant), teorins, sin egen. Methodology pushar inte mot konsensus utan mot *medveten avvägning*.

Risk: läraren avfärdar studentfeedback som *"de förstår inte"*. Methodology påpekar:

> *"Studenter sa X. Du tycker Y. Båda kan vara rätt — eller en kan ha mer rätt än den andra. Vad är ditt resonemang för avvägningen?"*

### Det mätbara vs det meningsfulla (Selwyn igen)

I utvärdering är det stark frestelse att läsa numerorium. Studentbetyg, hämtningsgrader, alignment-procent.

**Hur hanteras spänningen?** Methodology presenterar *kvalitativt först*, *kvantitativt sen*. Fri-text före Likert. REFL-citat före procentsiffror. Selwyn-vakthet i prompter:

> *"Hämtningsgrad 67% — vad betyder det? Är 67% bra eller dåligt? Innan vi tolkar siffran: vad var målet? Vad är jämförelsebasen?"*

### Aggregering vs nuans

Att aggregera över hela kursen kan dölja moduler där det fungerade utmärkt och där det inte alls fungerade.

**Hur hanteras spänningen?** Trianguleringen sker per *område*, inte per kurs som helhet. Tabellerna i Fas 4 är specifika: *"Mörkerreaktion-området…"*, *"Klimat-kopplings-området…"*. Inte *"kursen som helhet…"*.

### Self-bespeglande risk på kursnivå

Som med REFL: utvärdering kan bli klagomål på elever, system, omständigheter.

**Hur hanteras spänningen?** Methodology pushar mot agency även på kursnivå:

> *"Vad gjorde DU som bidrog till det som fungerade? Vad bidrog du med till det som inte fungerade?"*

> *"'Eleverna var ointresserade i modul 3' — vad i ditt designval kan ha bidragit?"*

### Kursutvärdering som rapportering vs kursutvärdering som lärande

Skoladministrationen kan vilja ha kursutvärdering som *rapport*. Men för läraren själv är den en lärandeprocess.

**Hur hanteras spänningen?** Methodology är teacher-facing — utvärderingen tjänar lärarens egen reflektion och revisionsförberedelse. Om administrationen behöver något, blir det en *separat* version med begränsad scope. Det affektiva, frågorna utan svar, sårbarheten — tas inte ut till administrationen.

---

## GDPR

| Datatyp | Hantering |
|---|---|
| Kursdata, alignment-utfall, ILO-täckning | Kursmappen — designdata, ej elevdata, OK |
| Aggregerad bedömningsdata, teacher_insights | Anonymiserade — OK |
| Studentutvärderingar | Hanteras enligt Assessment_suites GDPR-rutiner — om de inkluderas i Teaching Suite-rapport: *anonymiserade citat och aggregerade siffror endast* |
| Affektivt material från lärar-REFL | Privat per lärare — utvärderings-rapporten ska vara *delningsbar* utan att exponera känsligt material |
| Kollegial kritik (om förekommer) | Strykas innan delning eller sparas privat |

**Princip:** kursutvärderings-rapporten kan delas med kollegor och skolledning. Det betyder att den ska vara *renad* från privata reflektioner och elev-identifierare. Det privata stannar i REFL-filerna; utvärderingen är destillat.

---

## Tools som används

| Tool | Roll i utvärdering |
|---|---|
| `load_methodology` | Laddar detta dokument |
| `aggregate_logs` | Events över hela kursen, group_by module/ILO |
| `find_context` | Hämtar alla relevanta artefakter (design, progress, assessment, reflektion, insights) |
| `file_read` | Läser kursdesign, ILO-register |
| `intelligent_save` | Sparar `course_evaluation_report` |
| `log_process_event` | Loggar `course_evaluated` |

**Inga nya tools krävs** — utvärdering är aggregation + lärar-tolkning. Befintliga tools räcker.

---

## Integration med andra processer

### Utvärdering ← All kursdata

Utvärdering är *aggregation* av allt som producerats under kursen:

- Kursdesign (Fas 1 referenspunkt)
- Genomförande-rapporter (mid-course-data)
- Bedömnings-strategi och -tolkningar
- Lektions-AUTO-loggar
- Lektions-REFL och bryggor
- Studentutvärderings-data (om finns)

### Utvärdering → Revision

Direkt input. Revisions-agendan från Fas 6 är revisionsfasens *startpunkt*.

### Utvärdering → Manifest

Återkommande lärdomar över *flera kurser* (inte bara denna) blir material för terminsreflektionen i professionscykeln. Manifest-revisioner.

### Utvärdering → Carlgren-kunskapsbas

På yrkesnivå bidrar utvärderingen till lärarens *professionella kunskapsbas* — kunskap om biologi 2 som ämne, om denna åldersgrupp, om denna lärare. Den kunskapen sparas inte enbart i Teaching Suite — den lever i läraren själv.

### Cross-MCP — handoffs uppåt

- *QuestionForge:* items för områden med svaga utfall är revisions-kandidater
- *Assessment_suite:* slutbedömningsformat och spacing-cadens kan revideras

---

## Brygga framåt — när utvärderingen triggar course_to_profession

Utvärderingen är där kursen som *helhet* tolkas retrospektivt. Om mönster sträcker sig bortom enskild kurs (gemensamt med tidigare upplagor, parallella kurser samma termin) öppnas bryggan till professionscykeln. Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): policyn (B) + handlingen (C) här som prosa; detektionen (A) i kod.

### `course_to_profession_bridge` — när utvärderings-insikter sträcker sig bortom kursen

**Villkor (B):** Cowork ska föreslå bryggan när minst ett av följande gäller i utvärderings-output:

- Hypotes-utvärderingen avslöjar mönster som läraren själv erkänner *"händer i andra kurser också"*
- §Lärdomar för läraren formulerar sig på pedagogisk-generell nivå (*"jag designar alltid X på sätt Y"*) snarare än kurs-specifikt
- Triangulering visar gap mellan espoused position (kursdesign) och in-use mönster (genomförande) som *inte* förklaras av kursspecifika faktorer
- ≥2 utvärderingar samma termin pekar på liknande lärar-mönster

**Inte trigger:** kurs-specifika insikter som hör hemma i `revision.md`. Skiljelinjen: gäller insikten *denna kurs i detta sammanhang* eller *läraren-som-pedagog-generellt*?

**Handling (C):**

> *"Utvärderingen avslöjar [konkret mönster]. Du formulerade det som [lärarens egen ord]. Det låter mer som ett pedagogiskt-generellt mönster än en kurs-specifik fråga. Ska jag flagga det som kandidat för terminsreflektionen via `course_to_profession_bridge` — eller hör det hemma i revisionen för denna kurs?"*

Två legitima vägar: **flagga för termin** (sparas i `Reflections/Bryggor/<datum>-evaluation_to_term.md` med `triggered_action: deferred_to_term_reflection`) eller **stanna i kursrevision** (insikten flyter med till `revision.md`-arbetet, ingen separat brygga).

**Detektion (A):** LLM-analys av §Hypotes-utvärdering och §Lärdomar för läraren plus matchning mot tidigare utvärderingar (samma kurs över upplagor; parallella kurser samma termin). Mekanik; läraren avgör om mönstret är generellt eller kurs-specifikt.

**Princip från bridge-doc:en — *inte tillräckligt med en kurs*:** course_to_profession-bryggan kräver mönster över ≥2 kurser eller persisterande över ≥2 terminer för hög konfidens. En enskild utvärdering kan **förbereda** bryggan men aktiverar den sällan ensam. Det vanliga är: utvärdering flaggar → revision dokumenterar → terminsreflektion aggregerar → bryggan triggas där.

Se `methodology/bridges/course_to_profession.md` för bryggans interna mekanism och Korthagen/Argyris & Schön-grunder.

---

## Edge cases

### Inga studentutvärderingar

Vanligt i grundskola, mindre i högskola. Inga formella studentutvärderings-svar inkomna.

**Methodology fallback:**

- Hoppa över Fas 3
- Notera saknad: *"Studentutvärderingar saknas — Brookfield-lensen 'elevernas ögon' begränsad"*
- Kompletteras eventuellt av kvalitativ feedback från lektioner (REFL-citat: *"någon elev sa…"*)

### Stora avvikelser från design

Kursen kördes radikalt annorlunda än designen — många mid-course-justeringar.

**Methodology fallback:**

- Utvärdera *vad som faktiskt skedde*, inte mot ursprungsdesignen
- Notera: *"Designen reviderades flera gånger mid-course. Utvärdering mot reviderad design."*
- Skiftet i sig är data — varför behövde designen revideras så ofta?

### Negativ feedback från studenter — affektivt utmanande

Studentutvärderingar är kritiska. Vissa är personliga.

**Methodology fallback:**

- Affektiv check-in (Fas 3)
- Möjlighet att pausa och fortsätta
- Distinktion: *kritik mot designval* (legitim feedback) vs *kritik mot person* (kräver pedagogisk process utanför methodology)
- Methodology är inte terapi — påpeka när det är dags att tala med kollega eller mentor

### Stora datamängder — för mycket att hantera

Långa kurser, många reflektioner, många insights.

**Methodology fallback:**

- Aggregera per modul först, kursnivå sist
- Selektivitet — inte allt behöver behandlas i detalj
- Methodology föreslår fokuspunkter: *"De tre tydligaste mönstren är X, Y, Z. Börjar vi där?"*

### Kursutvärdering ska delas med skolledning — formell rapportering

Skoladministrationen kräver formell rapport.

**Methodology fallback:**

- Generera *delningsbar version* — renad från privata reflektioner och elev-identifierare
- Den fullständiga utvärderingen sparas separat (privat)
- Påpeka skillnaden i syften: läraren-rapport vs administrations-rapport

### Två lärare, samma kurs

Kollegial utvärdering.

**Methodology fallback:**

- Båda lärares data aggregeras
- Diskussion mellan kollegor för tolkning (utanför methodology)
- Utvärderings-rapporten är *gemensam* — båda authors

---

## Kvalitetskriterier

### En bra utvärdering har:

**Triangulering:**

- Minst 3 datakällor (lärar-data, bedömningsdata, studentdata om möjligt)
- Områden tolkade konsekvent över källor

**Alignment-syn:**

- ILO-täckning kvantifierad
- Verbalignment-utfall analyserat
- Glapp och skiften förklarade

**Hypotes-läsning (Stenhouse):**

- Ursprungsdesignens hypoteser explicit nämnda
- Höll de? Föll de? Varför?

**Revisions-agenda:**

- Prioriterad lista (hög/medel/låg)
- Konkret nog att vara handlings-input för revisionsfasen
- Spårbar — varje punkt har källor i triangulerings-tabellerna

**Lärar-agency:**

- Lärarens del synlig (inte bara klagomål)
- Sårbarhet är OK men inte kapitulation
- Larrivee-nivå minst pedagogisk, helst kritisk

**Delningsbar:**

- Renad från privata reflektioner
- Elev-anonymisering kontrollerad
- Skoladministrations-version separat om relevant

### En dålig utvärdering har:

- En datakälla (bara studentutvärdering, eller bara lärar-data)
- Numerorium utan tolkning
- Klagomål på elever/system utan agency
- Ingen revision-agenda — vägen till nästa upplaga är otydlig
- Privata reflektioner blandade in i delningsbart material
- Hypotes-glömska — designen behandlas som *plan att utföra*, inte hypotes

---

## Output-exempel (kort)

```yaml
---
type: course_evaluation_report
created: 2026-12-20T14:00:00Z
date: 2026-12-20
course_instance: KURS101_2026
tags: [utvardering, kurs101, slutrapport]
status: draft
metadata_version: 1
provenance: course_utvardering_v3
framework: [biggs, stenhouse, brookfield]
based_on:
  - "[[Planning/KURS101_2026_design]]"
  - "[[Planning/KURS101_2026_assessment]]"
  - "[[Analysis/KURS101_2026_progress_mid_term]]"
period:
  start: 2026-08-15
  end: 2026-12-15
ilo_coverage:
  full: 10
  partial: 1
  not_covered: 1
  total: 12
alignment_outcome:
  strong: 5
  glapp: 2
  shifted_intentionally: 3
student_evaluation:
  responses: 27
  affective_themes: ["positivt om dialog-format", "förvirring om Calvin-cykel"]
revision_agenda:
  high_priority:
    - "Mörkerreaktion / Calvin-cykel — design-fel"
    - "Modul 3 underestimering"
    - "C4-växter — ta bort eller flytta"
  medium_priority:
    - "Klimat-koppling som ingång"
  low_priority:
    - "Slutprov-format"
---

# Kursutvärdering — KURS101 — 2026

## Översikt

Kursperiod 2026-08-15 till 2026-12-15. 18 av 20 lektioner körda (2 inställda 
pga en konferensdag). Nästan alla elever fullföljde. Studentutvärdering 
inkommen 2026-12-15.

## ILO-täckning

[Tabell]

## Verb-alignment retrospektivt

Stark alignment i 5 av 12 ILO. Glapp i 2 (mörkerreaktion, kretslopp). 
Skiftat medvetet i 3.

[Detaljer]

## Studentutvärderings-läsning

Kvalitativt: positivt om dialog-format ("vi pratade mycket"), klimat-kopplingen 
("bästa lektionen"). Negativt: Calvin-cykel ("förvirrande"), modul 3 ("för 
mycket samtidigt").

Numeriskt: 4.2/5 genomsnitt. Spridning: flertalet högt, ett fåtal lågt.

[Tolkning]

## Triangulering per område

[Tabeller per område]

## Hypotes-utvärdering

Designens *exemplariskt* var "biologi 2 som mötet mellan cellnivåns 
mekanismer och ekologins systemtänkande". Det höll i celler-modul och 
ekologi-modul. I energiomsättning-modul (modul 4) blev cellnivån överbetonad 
— ekologi-kopplingen kom först sent. Klimat-kopplingen som spontant fynd 
fyllde delvis det glappet, men inte planerat.

Designens *zugänglighet* satsade på "tematiska ingångar via samhällsfrågor". 
Detta höll *delvis*. Klimatkopplingen var stark; andra moduler hade tunnare 
samhällsingångar. Revisions-kandidat.

## Revisions-agenda

[Prioriterad lista — kopia av YAML]

## Lärdomar för läraren

[Carlgren-kunskapsbas-noter — vad jag tar med mig som lärare]

## Frågor utan svar

- Är Calvin-cykel-svårigheten ämnesspecifik (eleverna har inte fört in 
  förförståelse) eller är det undervisningsspecifik (mitt sätt att förklara)?
  Behöver mer data — kanske jämföra med kollegors erfarenhet.
- Slutprov-stress — orsakad av format eller av denna grupps karaktär?
```

---

## Bibliotek — prompts & frågor

### Trigger

- *"Utvärdera [kurs] [år]"*
- *"Slutrapport för [kurs]"*
- *"Sammanställ kursen som helhet"*

### Aggregerings-presentation

- *"Underlaget är aggregerat. Vill du börja någonstans, eller tar vi det i ordning?"*
- *"Mest data finns kring [område]. Det blir naturligt fokus."*

### Alignment-fråga retrospektivt

- *"Höll TLA samma verb som ILO i praktiken?"*
- *"AT-glapp — testade bedömningen verkligen ILO-nivå, eller bara det lätta?"*
- *"Skiftade verb medvetet eller var det glapp?"*

### Studentutvärdering — affektiv

- *"Hur känns det att läsa detta? Vi kan pausa."*
- *"Är det något i feedbacken som överraskar? Vad?"*
- *"Är det något som väcker försvarsreaktion? Vad är frågan bakom?"*

### Studentutvärdering — Larrivee-pushande

- *"Tre elever skriver X. Är de fel, eller ser de något du inte sett?"*
- *"Vad gjorde DU som bidrog till denna kritik?"*
- *"Är detta design-fel, undervisnings-fel, eller är det ämnet?"*

### Triangulering

- *"Lärar-data säger X. Bedömningsdata säger Y. Studentutvärdering säger Z. Konsensus eller divergens?"*
- *"Outlier-feedback — en student artikulerar något distinkt. Tyngre eller lättare än konsensus?"*

### Hypotes-läsning (Stenhouse)

- *"Designens exemplaritet — höll den?"*
- *"Zugänglichhet — vilka ingångar fungerade, vilka inte?"*
- *"Vad var hypotesen som föll? Vad lärde det dig?"*

### Revisions-agenda

- *"Vilka är de tre viktigaste sakerna att ändra inför nästa upplaga?"*
- *"Hög/medel/låg prioritet — varför rangordnar du så?"*
- *"Cross-MCP — vad behöver QuestionForge och Assessment_suite veta?"*

### Selwyn-vakthet

- *"Hämtningsgrad 67% — vad betyder det? Mot vad jämförs?"*
- *"Studentbetyg-genomsnitt 4.2 — vad säger det egentligen om lärandet?"*
- *"Det mätbara är mätt. Vad är det meningsfulla som inte mäts?"*

### Avslut

- *"Spara utvärderings-rapport. Revisions-fasen är nästa — när är du redo?"*
- *"Loggar utvärdering. Cross-MCP-noteringar — vill du flagga till QuestionForge eller Assessment_suite?"*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — arkitektur, kurscykeln
- **`design.md`** — designens hypoteser
- **`conduct.md`** — mid-course-data
- **`assessment.md`** — bedömnings-data och teacher_insights
- **`revision.md`** — revisions-agendan från denna fas är input
- **`lesson/*.md`** — råmaterial för aggregering

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Biggs (alignment retrospektivt), Stenhouse (hypotes-läsning), Schön (reflection-on-action på kursnivå), Black & Wiliam (formativ för läraren), Selwyn-kritik som motvikt, Carlgren (kunskapsbas-traditionen), Brookfield (elevernas lens).

**Process — 8 faser:**

- Fas 0: Trigger + scope
- Fas 1: Aggregera all data
- Fas 2: Alignment-fråga retrospektivt
- Fas 3: Studentutvärderings-läsning (om finns)
- Fas 4: Triangulering
- Fas 5: Hypotes-utvärdering (Stenhouse)
- Fas 6: Synthesis till revisions-agenda
- Fas 7: Save utvärderings-rapport
- Fas 8: Log + handoff till revision

**Spänningar (fem):**

- Studentutvärdering vs lärar-tolkning
- Det mätbara vs det meningsfulla (Selwyn)
- Aggregering vs nuans (per område, ej per kurs)
- Self-bespeglande risk
- Lärar-rapport vs administrations-rapport

**Cross-MCP:**

- Student_evaluation-format kan formaliseras som RFC
- Cross-MCP-noteringar till QuestionForge och Assessment_suite del av output


**Föregångare:** Inget direkt föregångare-dokument. Utvärderings-fasen har funnits som administrativ rutin men inte explicit metodologerats för läraren själv. v3.0 formaliserar.
