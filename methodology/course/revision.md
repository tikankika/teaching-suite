---
type: exploration
status: draft
created: 2026-04-27T20:51:37
origin: desktop
project: Teaching Suite
---

# Methodology — Kurscykeln: Revision

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **revisions-fasen i kurscykeln** — där lärdomar från en kursupplaga konverteras till designändringar inför nästa upplaga.

```
KURSDESIGN  →  GENOMFÖRANDE  →  BEDÖMNING  →  UTVÄRDERING  →  REVISION
                                                                ↑
                                                                detta dokument
                                                                │
                                                                ▼
                                                         (nästa upplaga)
                                                         KURSDESIGN för år N+1
```

**Lärarens fråga (här):** *Vad lärde jag om denna kurs som gör att nästa upplaga ska se annorlunda ut? Vad ändras i designen, ILO-registret, bedömningsstrategin?*

**Tempo:** Diskret moment efter terminsslut, ofta perioden mellan terminer. 1–3 sessioner totalt, beroende på revisionens omfattning.

**Position i ekosystemet:** Revisionsfasen är där kurscykeln *sluts* — där lärdomar inte bara reflekteras utan *infogas i nästa upplagas design*. Utan revision blir lärdomarna privata; med revision blir de framtida pedagogisk struktur.

---

## Grundprincip — revision är design-arbete, inte rapportering

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I revisionsfasen är meningsbärande arbete *att avgöra vad som ändras*. Methodology bidrar med:

- *Strukturerad ingång* — utvärderingens revisions-agenda (hög/medel/låg-prioritet)
- *Konsekvens-förståelse* — om ILO ändras, vad händer med items, bedömningar, modulstruktur?
- *Cross-MCP-koordinering* — uppdateringar till QuestionForge och Assessment_suite
- *Versionering* — kursdesign versioneras, ILO-koder dokumenteras med deprecation-mönster

Methodology bidrar *inte*:

- Vilka ändringar som ska göras — det avgörs av läraren utifrån utvärderings-rapporten
- Hur långt revisionen ska gå — minor tweak eller stor omdesign är lärarens beslut
- Pedagogisk vision-skifte — om revisionsfasen leder till manifest-revision, det hör till professionscykeln

**Sub-princip från arkitekturen: Stenhouse — curriculum as inquiry.** Revisionsfasen är där hypotes-prövningens *resultat* används. Designen *lärs av* — den är inte fastställd a priori utan utvecklas över upplagor.

**Sub-princip: aldrig från scratch.** Revisionen ärver kursens lärdomar. Inget designval omprövas onödigt; bara det som utvärderingen pekade på.

---

## Teoretisk grund

### Stenhouse — curriculum as inquiry (1975)

Hjärtat i revisionsfasen. *"It is not enough that teachers' work should be studied; they need to study it themselves."* Stenhouses centrala bidrag är att curriculum är något *som lärs av*, inte något *som utförs*.

Implikation: revisionen förväntas hitta felaktigheter i tidigare design. Det är inte misslyckande — det är curriculum-utveckling fungerande som det ska.

### Laurillard — iterativ design (2012)

Laurillard utvidgar designtänkandet med *kontinuerlig iteration*. Revisionsfasen är där iterationen blir *explicit och versionerad*. Genomförande-fasens mid-course-justeringar är mindre iterationer; revisionen är större.

### Carlgren — kunskapsbas (1999)

Revisionen är där lärarens *professionella kunskapsbas* uppdateras. Inte bara "denna kurs" utan kunskap om *biologi 2 som ämne, denna åldersgrupp, denna lärarens praxis*. Den kunskapen ackumuleras över år.

### Wiggins & McTighe — UbD (2005)

Backward design appliceras retrospektivt. Vid revision: *vad ska eleverna kunna* (har detta ändrats?), *hur ska det visas* (bedömningsstrategin), *vilka aktiviteter* (modulstrukturen). UbD-stegen skanar igen, men nu informerade av faktisk data.

### Biggs — alignment over time (1996)

Constructive alignment är inte ett engångsbeslut. Över upplagor ska ILO-AT-TLA-alignmenten *justeras* baserat på utfall. Glapp upptäckta i utvärderingen blir revisions-mål.

### Argyris & Schön — espoused vs theory-in-use (1974)

Revisionsfasen är där *theory-in-use* (vad kursen faktiskt blev) jämförs mot *espoused theory* (vad kursdesignen sa). Diskrepans är data — antingen ska designen revideras till in-use-verkligheten, eller ska praxis revideras till espoused-avsikten.

---

## Trigger

Revisions-fasen aktiveras vid:

### 1. Efter utvärderingsfasen

Naturlig fortsättning. Utvärderings-rapporten har en *revisions-agenda* — revisionsfasen tar den agendan och konverterar till konkreta designändringar.

Trigger:

- *"Revidera [kurs] inför nästa upplaga"*
- *"Implementera revisions-agendan från [kurs]"*
- *"Designändringar för [kurs]_[nästa_år]"*

### 2. Vid nästa kursdesign-fas-start

Methodology för nästa upplagas kursdesign frågar: *"Har vi reviderat förra upplagan? Annars kan vi missa lärdomar."* Om revision inte är gjord, blir den första moment.

### 3. Mellan upplagor när tid finns

Lärare har en period mellan terminer. Använder den till revision innan nästa termin börjar.

**Förutsättningar (minimum):**

- Utvärderings-rapport finns med revisions-agenda
- Kursdesign-dokument från senaste upplaga finns
- ILO-register från senaste upplaga finns

**Önskvärt:**

- Tid att revidera (inte i sista minuten)
- Tillgång till tidigare upplagas alla artefakter (ej arkiverade)
- Kollegial dialog (om kursen delas)

---

## Process

### Fas 0 — Trigger + scope-bestämning

Methodology frågar:

> *"Hur stor revision tänker du dig? Mindre justering, modulär omdesign, eller större omprövning?"*

Tre nivåer:

| Nivå | Karaktär | Tid |
|---|---|---|
| **Tweak** | Mindre justeringar — timing, ett eller två ILO, små bedömningsändringar | 1 session |
| **Modulär omdesign** | En modul revideras grundligt; resten i stort sett intakt | 2–3 sessioner |
| **Större omprövning** | Vision, ILO-set, eller bedömningsstrategin omprövas | 3+ sessioner, kan leda till manifest-revision |

Methodology stöder alla tre. Lärarens beslut.

### Fas 1 — Läs utvärderings-rapport

```typescript
find_context({
  content_types: ['course_evaluation_report'],
  course: "[course]",
  recent: true
})
```

Methodology presenterar revisions-agendan från utvärderingen:

```
📋 Revisions-agenda från utvärderingen (KURS101_2026):

🔴 Hög prioritet (3 punkter):
  • Mörkerreaktion / Calvin-cykel — design-fel
  • Modul 3 underestimering (+30% timing)
  • C4-växter — ta bort eller flytta

🟡 Medel prioritet (2 punkter):
  • Klimat-koppling som ingång
  • Solpanel-analogin utvidga

🟢 Låg prioritet (2 punkter):
  • Slutprov-format
  • Adaptivt retrieval-schema

Vill vi börja med hög prioritet, eller annan ordning?
```

### Fas 2 — Punkt-för-punkt revision

Gå igenom revisions-agendan punkt för punkt. För varje punkt: *konsekvens-genomgång + designändring + cross-MCP-uppdateringar*.

#### Punkt-arbete (mall)

För varje revisions-punkt:

**1. Konkretisering — vad är ändringen?**

> *"'Mörkerreaktion / Calvin-cykel — design-fel'. Vad konkret ändrar vi? Mer tid (modulstruktur)? Annan ingång (didaktiskt)? Förförståelse-byggande tidigare i kursen (ILO-omordning)?"*

**2. Konsekvens-genomgång**

För varje föreslagen ändring, methodology spårar *vad mer som påverkas*:

```
Ändring: "Lägg till en lektion om kemisk grund (ATP, redox) före Calvin-cykel"

Konsekvenser:
  • Modulstruktur: modul 4 utökas från 4 till 5 lektioner
  • ILO-register: ny ILO KURS101.04.fotosyntes.kemisk_grund
  • Bedömning: ny ILO behöver items (QuestionForge), retrieval-test-tabell uppdateras
  • Övriga moduler: ingen direkt påverkan, men +1 lektion totalt — ev. trimning någonstans
  • Föregående år: ingen retroaktiv påverkan, gäller från nästa upplaga

OK med dessa konsekvenser?
```

**3. Designändring formulerad**

Konkret formulering som blir input till nästa kursdesign:

```yaml
revision_change:
  scope: "modul 4"
  type: "add_lesson_and_ilo"
  description: |
    Lägga till lektion om kemisk grund (ATP, redox) före Calvin-cykel-lektion.
    Adresserar systemiskt problem med Calvin-cykel-förståelse.
  affected_artifacts:
    - "Planning/<course>_modules.md"
    - "_config/learning_objectives.yaml"
    - "Planning/<course>_assessment.md"
  cross_mcp_impact:
    questionforge: "items för ny ILO KURS101.04.fotosyntes.kemisk_grund"
    assessment_suite: "lägga in nya begrepp i retrieval-test-rotation"
```

**4. Cross-MCP-handoff-noteringar**

Methodology sparar handoff-instruktioner:

```
Cross-MCP-uppdateringar för denna revision:

→ QuestionForge:
   - Skapa items för ny ILO KURS101.04.fotosyntes.kemisk_grund (3-5 items)
   - Pensiomera items för borttagna ILO KURS101.04.fotosyntes.c4 
     (deprecated, behåll under v0.5-stil deprecation-period)

→ Assessment_suite:
   - Lägga till kemisk_grund i retrieval-test-rotation
   - Ta bort c4 från rotation
   - Justera spacing om nödvändigt
```

### Fas 3 — ILO-register-revision

Detta är hjärtat i kursrevisionen. ILO-registret är *single source of truth* — ändringar här kaskaderar genom hela systemet.

**Ändringstyper för ILO:**

| Typ | Mekanism |
|---|---|
| **Lägga till** | Ny rad i `_config/learning_objectives.yaml` |
| **Modifiera text** | Uppdatera samma rad (om semantik samma); annars ny kod |
| **Modifiera verb** (Bloom/UbD) | Uppdatera fält; QuestionForge bör notera (item-svårighet kan ändras) |
| **Pensionera** | `superseded: true`, `superseded_by` om relevant |
| **Borttagning** | Markera `removed_in: <version>`, men behåll i registret av historiska skäl |

**Princip: stabila ILO-koder.** `KURS101.04.fotosyntes.ljusreaktion` ska vara samma kod i 2025, 2026, 2027 — så data kan jämföras över upplagor. Endast vid större semantisk-ändring används ny kod.

**Versionering:**

```yaml
# _config/learning_objectives.yaml — efter revision
course_instance: KURS101_2027   # Notera: ny upplaga
metadata_version: 1
last_updated: 2027-01-15
revision_history:
  - from: KURS101_2026
    date: 2027-01-15
    changes:
      - added: KURS101.04.fotosyntes.kemisk_grund
      - deprecated: KURS101.04.fotosyntes.c4 (moved to ekologi-modulen)
      - modified: KURS101.06.ekologi.kretslopp (analyze → evaluate)
ilos:
  - code: KURS101.01.celler.struktur
    text: "Förklara cellens uppbyggnad och organellfunktioner"
    bloom_level: understand
    ubd_facet: explanation
    module: 1
    history:
      - 2025: introduced
      - 2026: unchanged
      - 2027: unchanged
  
  - code: KURS101.04.fotosyntes.kemisk_grund   # NY i 2027
    text: "Beskriva ATP-bildning och redox-reaktioner som grund för fotosyntes"
    bloom_level: understand
    ubd_facet: explanation
    module: 4
    history:
      - 2027: introduced
    rationale: "Adresserar Calvin-cykel-svårighet identifierad i 2026-utvärdering"
  
  - code: KURS101.04.fotosyntes.c4   # DEPRECATED 2027
    text: "Jämföra C3 och C4-växter"
    bloom_level: understand
    ubd_facet: comparison
    module: 4
    superseded_by: null
    deprecation_status: "deprecated"
    deprecation_reason: "Moved to ekologi-modulen, not part of biologi 2 anymore"
    deprecated_in: 2027
```

### Fas 4 — Modulstruktur-revision

Modulstrukturen uppdateras parallellt med ILO-registret.

```typescript
// Läsa befintlig modulstruktur
file_read({path: "Planning/<course>_<previous_year>_modules.md"})

// Skapa reviderad version
intelligent_save({
  content: <updated module structure>,
  content_type: "module_structure",
  suggested_path: "Planning/<course>_<next_year>_modules.md"
})
```

Methodology stöder konsekvensanalys: om modul 4 utökas med 1 lektion, vad påverkas av tidsbudgeten?

### Fas 5 — Bedömningsstrategi-revision

Om revisionen påverkar bedömning:

```typescript
file_read({path: "Planning/<course>_<previous>_assessment.md"})

intelligent_save({
  content: <updated assessment strategy>,
  content_type: "assessment_strategy",
  suggested_path: "Planning/<course>_<next>_assessment.md"
})
```

Punkter att överväga:

- Nya ILO behöver bedömningsdesign
- Pensionerade ILO tas ur bedömningsrotation
- Modifierade verb påverkar item-svårighet (QuestionForge)
- Slutprov-format-justering om utvärderingen pekade på det

### Fas 6 — Bekräftelse: vad blir revision-deltat?

Methodology summerar alla föreslagna ändringar för läraren:

```
🔄 Sammanfattning av revisionen — KURS101 2026 → 2027:

ILO:
  + 1 ny: kemisk_grund
  - 1 deprecated: c4
  ~ 1 modifierad: kretslopp (verb-uppdatering)

Modulstruktur:
  • Modul 4 utökas från 4 till 5 lektioner
  • Modul 6 tar bort c4-block
  • Total kursomfattning oförändrad (1 lektion mer i modul 4 kompenseras genom...)

Bedömning:
  • Retrieval-test-rotation: +kemisk_grund, -c4
  • Slutprov: format oförändrat (revisions-agenda 'låg prio')

Cross-MCP:
  • QuestionForge: 1 ny ILO, 1 deprecation
  • Assessment_suite: rotation-justering

Stort kvarvarande som inte revideras (medvetet):
  • Klimat-koppling som ingång (medel-prio agenda — revideras nästa gång)

Bekräfta revisionen?
```

### Fas 7 — Save reviderade artefakter

Tre filer skapas (reviderade versioner):

```typescript
// 1. Reviderad kursdesign
intelligent_save({
  content: <updated course design>,
  content_type: "course_design",
  suggested_path: "Planning/<course>_<next_year>_design.md"
})

// 2. Reviderad ILO-register
file_write({
  path: "_config/learning_objectives.yaml",
  content: <updated ILO register>
})

// 3. Revisions-rapport (sammanfattning av deltat)
intelligent_save({
  content: <revision report>,
  content_type: "course_revision_report",
  suggested_path: "Planning/<course>_<previous_year>_revision_to_<next_year>.md"
})
```

### Fas 8 — Log + cross-MCP-handoff

```typescript
log_process_event({
  type: "course_revised",
  files: ["Planning/...", "_config/..."],
  trigger: "course_revision",
  changes_summary: {...}
})
```

Methodology säger till läraren:

> *"Revisionen sparad. Tre nästa-steg:*
>
> *1. När du börjar designa nästa upplaga (`design.md`), startar processen med revisions-rapporten som ingång.*
> *2. Cross-MCP-handoffs: QuestionForge ska notifieras om ILO-ändringar, Assessment_suite om rotation-justering.*
> *3. Revisions-rapporten är *delningsbar* — kollegor och skolledning kan se den om relevant. Det privata stannar i utvärderings-rapporten."*

---

## Output-struktur

### Revisions-rapport

YAML frontmatter:

```yaml
---
type: course_revision_report
created: 2027-01-15T18:00:00Z
date: 2027-01-15
course_instance_from: KURS101_2026
course_instance_to: KURS101_2027
tags: [revision, kurs101, kursrevision]
status: draft
metadata_version: 1
provenance: course_revision_v3
framework: [stenhouse, laurillard, biggs, carlgren]
based_on:
  - "[[Analysis/KURS101_2026_evaluation]]"
revision_scope: "modular"   # tweak | modular | major
ilo_changes:
  added:
    - KURS101.04.fotosyntes.kemisk_grund
  deprecated:
    - KURS101.04.fotosyntes.c4
  modified:
    - KURS101.06.ekologi.kretslopp
module_changes:
  modul_4: "+1 lektion (kemisk grund)"
  modul_6: "tar bort c4-block"
assessment_changes:
  retrieval_rotation: "+kemisk_grund, -c4"
  final_exam_format: "oförändrad"
cross_mcp_handoffs:
  questionforge:
    - "Skapa items för kemisk_grund (3-5)"
    - "Deprecate c4-items (warning, removal v0.5-stil)"
  assessment_suite:
    - "Uppdatera retrieval-test-rotation"
unchanged_in_revision:
  - "Klimat-koppling som ingång (medel-prio, nästa gång)"
  - "Slutprov-format (låg-prio)"
revision_rationale: |
  Adresserar tre högprioriterade punkter från utvärderingen:
  Calvin-cykel design-fel, modul 3 timing, c4-omplacering. Övriga
  agenda-punkter sparas till nästa revision.
---
```

### Markdown body — strukturella sektioner

1. **Översikt** — vad reviderades, vad inte, varför
2. **ILO-ändringar** — tabell + rationale per ändring
3. **Modulstruktur-ändringar** — tabell + konsekvensanalys
4. **Bedömnings-ändringar** — uppdateringar i strategin
5. **Cross-MCP-handoffs** — exakt vad QuestionForge och Assessment_suite ska göra
6. **Vad inte reviderats** — och varför
7. **Carlgren-kunskapsbas-notering** — vad ändringen lär läraren generellt

---

## Spänningar att hålla i revisionen

### Stenhouse hypotes-prövning vs operationell stabilitet

Stenhouse vill att designen ska kunna omprövas radikalt. Operationen (kursen körs igen) vill stabilitet — för eleverna, för kollegor, för administrationen.

**Hur hanteras spänningen?** Princip: *minimal change for maximal learning*. Revidera bara där utvärderingen pekade. Stora omprövningar paketeras som *större omprövning* (Fas 0 nivå 3) — sällsynt, medvetet, dokumenterat.

### Revidera designen vs revidera praxis (Argyris & Schön)

Diskrepans mellan espoused theory (designen) och theory-in-use (vad kursen blev) kan lösas i två riktningar: revidera designen att matcha praxis, eller revidera praxis att matcha designen.

**Hur hanteras spänningen?** Methodology *frågar*, inte *bestämmer*:

> *"Calvin-cykel landade inte. Är problemet att designen var för ambitiös (sänk verbet i ILO?) eller att praxis var underdimensionerad (lägg in mer förförståelse?)? Båda är giltiga revisioner."*

### Stora ändringar mid-revision vs hålla agenda

Revisions-agenda säger A, B, C. Men under arbetet upptäcker läraren D — kanske mer kritiskt.

**Hur hanteras spänningen?** Methodology accepterar:

> *"Du upptäcker D under arbetet. Vill vi addera det till agendan, eller spara till nästa revision? Notera resonemanget."*

### Revisionsfas vs manifest-revision (cross-cykel)

Större upptäckter i revisionsfasen kan vara *manifest-frågor*, inte *kursfrågor*. T.ex. *"Hela mitt designval gick åt fel pedagogiskt håll"*.

**Hur hanteras spänningen?** Methodology flaggar:

> *"Detta känns större än kursrevision. Det rör pedagogiska ställningstaganden — kanske manifestet behöver revideras? Notera, går vidare i terminsreflektionen."*

### Cross-MCP-koordinering vs autonomi

Att revidera ILO påverkar QuestionForge och Assessment_suite. Men de andra systemen ska inte styra Teaching Suite:s revisionsbeslut.

**Hur hanteras spänningen?** Cross-MCP-uppdateringar är *konsekvenser* av revisionsbeslut, inte *input* till dem. Methodology dokumenterar konsekvenserna; de andra systemen agerar på dem.

---

## GDPR

| Datatyp | Hantering |
|---|---|
| Revisions-rapport | Kursmappen — designdata, OK |
| ILO-register-historik | Single source of truth, kursmappen — OK |
| Studentdata refererad i revision | Aggregerad nivå (*"hämtningsgrad 48% i 2026"*), aldrig individuell |
| Citat från utvärderingen som motiverar revision | Anonymiserade — *"flera elever skrev…"* |

**Princip:** revisions-rapporten är *delningsbar*. Skoladministrationen kan se den om relevant. Kollegor som tar över kursen ska kunna förstå revisionen.

---

## Tools som används

| Tool | Roll i revisionen |
|---|---|
| `load_methodology` | Laddar detta dokument |
| `find_context` | Hämtar utvärderings-rapport, kursdesign, ILO-register |
| `file_read` | Läser föregående versioner |
| `file_write` | Skriver uppdaterad ILO-register (strict YAML) |
| `intelligent_save` | Sparar reviderad kursdesign, modulstruktur, assessment_strategy, revisions-rapport |
| `log_process_event` | Loggar `course_revised` med changes_summary |

**Inga nya tools krävs.**

---

## Integration med andra processer

### Revision ← Utvärdering

Direkt input. Revisions-agendan är revisionsfasens startpunkt.

### Revision → Kursdesign (nästa upplaga)

Revisions-rapporten blir input till nästa upplagas kursdesign-fas (`design.md` Fas 0). *"Bygger vi från denna revision?"* — ja.

### Revision → Manifest (när relevant)

Större upptäckter i revisionen kan trigga manifest-revision i professionscykeln. Methodology flaggar; lärare hanterar i terminsreflektionen.

### Cross-MCP — QuestionForge

ILO-ändringar kaskaderar till items. QuestionForge måste:

- Skapa items för nya ILO
- Markera items mot pensionerade ILO som deprecated
- Modifiera items om verb ändrats

Methodology genererar handoff-noteringar; QuestionForge-arbete är separat.

### Cross-MCP — Assessment_suite

Bedömningsstruktur-ändringar kaskaderar till test-rotation. Assessment_suite måste:

- Lägga till nya begrepp i rotation
- Ta bort pensionerade
- Justera spacing om volymen ändras

---

## Bryggor — vad revisionen tar emot och vad den skickar vidare

Revisionen är **central korsningspunkt** mellan tre cykler. Den *tar emot* från lesson_to_course (operativa mönster från lektionsserien) och *kan emittera* course_to_profession (när revisionen avslöjar professionnivå-mönster). Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): policyn (B) + handlingen (C) här som prosa; detektionen (A) i kod.

### Brygga bakåt — `lesson_to_course_bridge` (revision tar emot)

**Villkor (B):** Revisionen ska *aktivt läsa in* lesson_to_course-bridge-output när:

- Kursen avslutas och utvärderingen är klar (standardflöde)
- ELLER: mid-course-bryggan har triggats under conduct (se `course/conduct.md`) — då finns redan partiell data
- ELLER: lesson_to_course-bryggan har sparats i `Reflections/Bryggor/`-mappen som `triggered_action: deferred_to_revision`

**Handling (C):** Cowork läser in alla bridge-outputs sedan föregående revision och presenterar för läraren:

> *"För denna revision finns [N] lesson_to_course-bryggor sparade sedan [datum]. Dessa pekar på [konkreta mönster utan värdering]. Hur viktar du dessa mot utvärderingens insikter — ska bridge-mönstren ges särskild vikt, eller hanteras parallellt med övrig revisions-data?"*

**Detektion (A):**

```typescript
find_context({
  content_types: ['lesson_to_course_bridge'],
  course: "[course]",
  since: "[last_revision_date]"
})
```

Sökning, sortering, datum-jämförelse är ren mekanik. Vad mönstren *betyder* för revisionen avgör läraren.

**Princip:** Bridge-output är *en* källa bland flera (utvärdering, conduct-monitoring, AUTO-aggregering). Den ersätter inte de andra. Revisionen håller helhetsblicken.

### Brygga framåt — `course_to_profession_bridge` (revisionen kan emittera)

**Villkor (B):** Revisionen ska föreslå course_to_profession-bryggan när minst ett gäller:

- Revisions-insikter pekar på ett mönster *bortom denna kurs* (typiskt formulering: *"detta är inte bara denna kurs"*, *"jag gör samma sak i mina andra kurser"*)
- ≥2 ILO-revisioner i denna kurs avslöjar gap mellan lärarens espoused position och vad kursen faktiskt prövade (Argyris & Schön espoused-vs-in-use)
- Carlgren-kunskapsbas-noteringar pekar på generalisering över ämnesgränser

**Handling (C):**

> *"Revisionen avslöjar [konkret mönster]. Det här ser ut att gälla bortom denna kurs — det rör hur du designar [aspekt] generellt. Ska vi flagga det som kandidat för terminsreflektionen och eventuell manifest-revision via `course_to_profession_bridge`? Eller är det specifikt nog för att stanna i denna kurs?"*

Vid lärarens **flagga:** spara med `triggered_action: deferred_to_term_reflection` i `Reflections/Bryggor/`. Bryggan aktiveras formellt när terminsreflektionen körs (se `profession/term_reflection.md`). Vid **stanna här:** ingen åtgärd, mönstret stannar i kursnivå.

**Detektion (A):** LLM-analys av revisions-prosan plus matchning av ILO-ändringar mot manifest (om manifest finns). Mekanik; tolkning av mönstret är lärarens.

**Princip från bridge-doc:en:** Manifest-revision är kostsam — bryggan ska föreslås bara när mönstret är *robust* (≥2 kurser eller persisterande över terminer). En enskild revision räcker sällan; den **förbereder** terminsreflektionens beslut snarare än utlöser direkt manifest-revision.

Se `methodology/bridges/lesson_to_course.md` och `methodology/bridges/course_to_profession.md` för bryggornas interna mekanism.

---

## Edge cases

### Ingen utvärdering gjord

Lärare börjar revidera utan utvärderings-rapport.

**Methodology fallback:**

- Methodology säger: *"Utvärdering saknas. Revisionen blir baserad på lärar-intuition snarare än evidens. Fortsätta, eller köra utvärderings-fasen först?"*
- Erbjud: snabb utvärdering (förkortad version av utvärderingsfasen)

### Stora omprövningar — hela kursvisionen omprövas

Revision blir större än "modulär".

**Methodology fallback:**

- Stora ändringar bör göras i kursdesign-fasen, inte revision
- Methodology säger: *"Detta är större än modul-revision. Vill vi gå tillbaka till `design.md` och köra som ny design (med revisions-rapporten som ingång)?"*

### Kursen körs inte igen

Revisionen blir hypotetisk — kursen läggs ner.

**Methodology fallback:**

- Revisionsfasen kan ändå göras — som *kunskapsbas-notering* (Carlgren)
- Lärdomar dokumenteras för andra kurser och framtida designval
- ILO-ändringar görs inte (ingen nästa upplaga)

### Annan lärare tar över kursen

Kollegial handoff. Den nya läraren ska kunna förstå revisionen.

**Methodology fallback:**

- Revisions-rapporten är extra tydlig
- Inkludera *kontext* — varför revisionen behövdes, inte bara *vad som ändrades*
- Möjlighet för kollegial diskussion

### Kursplan/läroplan ändras externt

Skolverk eller motsvarande ändrar styrdokument. Påverkar ILO-register oavsett intern revision.

**Methodology fallback:**

- Externa ändringar tas in som *forced revisions*
- Methodology spårar källan: `revision_trigger: "external_curriculum_change"`
- Påverkan dokumenteras separat från intern utvärdering

---

## Kvalitetskriterier

### En bra revision har:

- Tydlig anknytning till utvärderings-rapport (revisions-agenda)
- ILO-ändringar med stabila koder och deprecation-mönster
- Konsekvensanalys för varje ändring
- Cross-MCP-handoffs explicit dokumenterade
- *Vad som inte reviderades* explicit och motiverat
- Kunskapsbas-notering (Carlgren)
- Revisions-rapport som är delningsbar

### En dålig revision har:

- Ingen koppling till utvärdering — *"jag bara ändrar"*
- ILO-koder bryts eller dupliceras
- Ändringar utan konsekvensanalys
- Cross-MCP-glömska — QuestionForge/Assessment_suite får inte veta
- Inga lärdomar formulerade — bara mekaniska ändringar
- Hela kursvisionen revideras utan att gå tillbaka till kursdesign-fasen

---

## Output-exempel (kort)

```yaml
---
type: course_revision_report
created: 2027-01-15T18:00:00Z
course_instance_from: KURS101_2026
course_instance_to: KURS101_2027
tags: [revision, kurs101]
status: draft
metadata_version: 1
provenance: course_revision_v3
framework: [stenhouse, biggs]
based_on:
  - "[[Analysis/KURS101_2026_evaluation]]"
revision_scope: "modular"
ilo_changes:
  added: [KURS101.04.fotosyntes.kemisk_grund]
  deprecated: [KURS101.04.fotosyntes.c4]
  modified: [KURS101.06.ekologi.kretslopp]
module_changes:
  modul_4: "+1 lektion"
assessment_changes:
  retrieval_rotation: "+kemisk_grund, -c4"
cross_mcp_handoffs:
  questionforge: ["Skapa items för kemisk_grund", "Deprecate c4-items"]
  assessment_suite: ["Uppdatera retrieval-rotation"]
unchanged_in_revision:
  - "Klimat-koppling (medel-prio, nästa)"
  - "Slutprov-format (låg)"
revision_rationale: |
  Tre högprioriterade punkter från utvärderingen.
---

# Revisionsrapport — KURS101 2026 → 2027

## Översikt

Modulär revision. Tre högprioriterade ändringar från utvärderingen genomförda;
två medel-prioriterade och två låg-prioriterade sparas till nästa revision.

## ILO-ändringar

[Detaljer per ändring med rationale]

## Modulstruktur-ändringar

[Konsekvensanalys]

## Bedömnings-ändringar

[Uppdateringar]

## Cross-MCP-handoffs

[Exakta instruktioner för QuestionForge och Assessment_suite]

## Vad inte reviderats — och varför

[Motiveringar för medvetna avhållanden]

## Carlgren-kunskapsbas-notering

[Lärdomar utöver denna kurs]
```

---

## Bibliotek — prompts & frågor

### Trigger

- *"Revidera [kurs] inför nästa upplaga"*
- *"Implementera revisions-agendan"*
- *"Designändringar för [kurs]_[år+1]"*

### Scope

- *"Tweak, modulär, eller större omprövning?"*
- *"Hög-prioritet hela vägen, eller stannar vi någonstans?"*

### Punkt-arbete

- *"'X' — vad konkret ändrar vi?"*
- *"Vilka konsekvenser har denna ändring? ILO, modul, bedömning, cross-MCP?"*
- *"Är det här designens fel eller praxisens? (Argyris & Schön)"*

### ILO-revision

- *"Stabil kod eller ny? Är semantiken samma?"*
- *"Deprecate eller modifiera?"*
- *"Verb-ändring — vad blir konsekvensen för items och bedömning?"*

### Cross-MCP

- *"QuestionForge får [X]. Vill du flagga som note nu?"*
- *"Assessment_suite-handoff: spacing-rotation justeras. OK?"*

### Avhållande

- *"[Y] reviderades inte. Varför inte?"*
- *"Spara till nästa revision, eller är det kandidat för manifest-revision?"*

### Avslut

- *"Reviderad kursdesign sparad. ILO-register uppdaterat. Nästa upplagas kursdesign kan börja från denna revision."*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`**
- **`design.md`** — nästa upplagas kursdesign tar revisionen som ingång
- **`evaluation.md`** — direkt input
- **`term_reflection.md`** — om revisionen pekar på manifest-frågor

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Stenhouse (curriculum as inquiry — designen lärs av), Laurillard (iterativ design), Carlgren (kunskapsbas), Wiggins & McTighe (UbD retrospektivt), Biggs (alignment over time), Argyris & Schön (espoused vs in-use).

**Process — 8 faser:**

- Fas 0: Trigger + scope (tweak/modular/major)
- Fas 1: Läs utvärderings-rapport
- Fas 2: Punkt-för-punkt revision
- Fas 3: ILO-register-revision
- Fas 4: Modulstruktur-revision
- Fas 5: Bedömningsstrategi-revision
- Fas 6: Bekräftelse — revisions-deltat
- Fas 7: Save reviderade artefakter
- Fas 8: Log + cross-MCP-handoff

**Spänningar (fem):**

- Stenhouse hypotes-prövning vs operationell stabilitet
- Revidera design vs revidera praxis (Argyris & Schön)
- Stora ändringar mid-revision vs hålla agenda
- Revisionsfas vs manifest-revision (cross-cykel)
- Cross-MCP-koordinering vs autonomi


**Föregångare:** Inget direkt föregångare-dokument.
