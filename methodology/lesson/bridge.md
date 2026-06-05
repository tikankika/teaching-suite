---
type: exploration
status: draft
created: 2026-04-27T19:44:37
origin: desktop
project: Teaching Suite
---

# Methodology — Lektionscykeln: Bryggan

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **bryggan i lektionscykeln** — det moment mellan reflektion och nästa planering där läraren *aktivt konverterar awareness till handling*.

```
                            ┌─→ POST-LESSON_AUTO ─┐
PRE-LESSON  →  LESSON  ─────┤                      ├──→  BRYGGA  ← detta dokument
   ↑                        └─→ POST-LESSON_REFL ─┘     │
   │                                                    │
   └────── carry-forward + bridge intention ───────────┘
```

**Lärarens fråga (här):** *Utifrån min reflektion förra gången — vad bär jag med mig in i nästa lektion? Vad ska jag faktiskt pröva annorlunda?*

**Tempo:** Minuter. Ett enskilt moment, 5–10 min. Ofta direkt innan nästa pre-lesson startar, eller som planerat fönster mellan reflektion och planering.

---

## Grundprincip — bryggan är konvertering, inte reflektion

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I bryggan är det meningsbärande arbetet *konverteringen* — att gå från *"jag insåg X"* (awareness, reflektion) till *"jag väljer att göra Y"* (alternative, handling). Det är där den verkliga didaktiska utvecklingen sker — eller inte sker.

**Princip:** Bryggan är *inte* en ny reflektion. Inte heller är den en ny lektionsplanering. Det är ett distinkt mellanmoment med smal scope: *aktivera carry-forward som handlingsavsikt*.

| Carry-forward (REFL) | Bryggan (detta dokument) | Pre-lesson Fas 2A |
|---|---|---|
| Lärarens egna ord från reflektionen | Aktiveringen — vad jag faktiskt vill pröva | Systemet visar carry-forward som data |
| Skrivs efter lektionen | Sker innan nästa planering | Sker under nästa planering |
| *"Jag ska korta inledningen"* | *"Inför nästa lektion: jag startar med en fråga, inte med översikt"* | *"Här är vad du skrev — vill du utgå från detta?"* |
| Statisk, sparad | Aktiverande, beslutande | Mottagande, kontextualiserande |

**Bryggan står mellan dem.** Utan brygga: carry-forward läses, registreras, och planering fortsätter mer eller mindre som vanligt. Med brygga: lärarens awareness blir explicit handlingsavsikt innan planeringens detaljarbete tar över.

---

## Teoretisk grund

### Korthagen — ALACT (2001, 2004)

Korthagens fem-stegs-cykel för reflekterande lärararbete:

```
Action  →  Looking back  →  Awareness of essential aspects  →  Creating alternative methods  →  Trial
                                          ↑
                                          här bor bryggan
```

**Övergången från Awareness (steg 3) till Creating alternative methods (steg 4) är ofta tyst i lärararbetet** — och det är där den verkliga didaktiska utvecklingen sker, enligt Korthagen.

Utan medveten övergång stannar reflektionen i Awareness. Insikten finns men omsätts inte i förändrad praxis. Methodology-doc:n är till för att göra övergången synlig och stödd.

### Perkins & Salomon — bridging strategies (1992)

Transfer-forskningen pekar på att kunskap från en kontext sällan automatiskt överförs till en annan. *Bridging strategies* är explicita kopplingar mellan kontexter — utan dem förblir kontexterna osammanhängande.

I lektionscykelns sammanhang: insikten från lektion 14 överförs inte automatiskt till planeringen av lektion 15. Det krävs en aktiv brygga.

### Schön — reflection-on-action (1983, 1987)

Bryggan står på Schöns reflektion-efter-handling. Reflection-on-action gör Awareness möjlig. Men Schön slutar där — hans modell beskriver inte själva övergången till nästa handling. Det är där Korthagen kompletterar.

---

## Trigger

Bryggan startas av tre möjliga triggers:

### 1. Automatisk vid pre-lesson-start

När läraren initierar pre-lesson (*"planera nästa lektion"*), checkar methodology om carry-forward finns från senaste reflektion. Om ja, *erbjuds* bryggan innan pre-lesson Fas 0:

> *"Jag ser att det finns carry-forward från senaste reflektionen. Vill vi sätta oss en stund med den först — innan vi börjar planera?"*

Läraren kan välja:

- *Ja, kör bryggan* → 5–10 min, sedan pre-lesson
- *Nej, jag har redan tänkt igenom det* → carry-forward visas i pre-lesson Fas 2A som vanligt
- *Nej, släpp den för nu* → carry-forward stannar i reflektionsfilen, inget aktiveras

### 2. Lärarinitierad

```
- "Brygga från senaste reflektionen"
- "Vad bär jag med mig in i nästa?"
- "Aktivera carry-forward inför planeringen"
- "ALACT-brygga"
```

### 3. Schemalagd som rutin

Vissa lärare vill ha bryggan som fast moment — t.ex. söndag kväll inför nya veckan. Methodology kan tagga som vana:

> *"Tisdag kväll — vill du köra bryggan inför onsdags-lektionen?"*

(Konfigurering ligger utanför methodology-scope — antingen via lärarens egna anteckningar eller framtida scheduling-tool.)

**Förutsättningar (minimum):**

- Carry-forward finns från senaste reflektion
- Läraren har 5–10 min

**Om carry-forward saknas:** ingen brygga är möjlig. Methodology säger:

> *"Senaste reflektion har ingen carry-forward. Bryggan har inget att aktivera. Du kan: gå direkt till pre-lesson, eller skriva en kort reflektion först."*

---

## Process

Bryggan är smal — fyra faser, totalt 5–10 min.

### Fas 0 — Trigger + carry-forward-loading

Methodology hämtar carry-forward från senaste reflektion:

```typescript
find_context({
  content_types: ['reflection'],
  recent: true,
  course: "[course]"
})
```

Och presenterar för läraren — exakt så som det skrevs:

```
🔄 Carry-forward från senaste reflektionen (lektion 14, fotosyntes, 2026-09-22):

"1. Korta inledningen till 8 min — fick mer tid till diskussion.
 2. Calvin-cykel: visa cirkulärdiagram tidigare, inte sist.
 3. C4-växter: släpp för denna kurs, ta in i ekologi-modulen istället."

Vill vi gå igenom var och en?
```

**Princip:** ord-för-ord. Ingen parafras, ingen tolkning. Bryggan respekterar lärarens egna formulering.

### Fas 1 — Konvertering: från Awareness till Alternative

Detta är bryggans kärna. Methodology går igenom carry-forward-punkterna en åt gången, med en strukturerad konverteringsprompt.

För varje punkt:

> *"Punkt [N]: '[ordagrant lärarens text]'."*
>
> *"När du tänker på nästa lektion — hur ser det här konkret ut? Vad gör du *istället för* det du gjorde förra gången?"*

Exempel:

> *Carry-forward: "Korta inledningen till 8 min."*
>
> *Methodology: "När du tänker på nästa lektion — hur ser det här konkret ut? Vad startar du med istället för översikten du körde förra gången?"*
>
> *Lärare: "Jag tänker börja med en fråga — 'vad såg ni i nyheterna i veckan om klimat?' — och låta dem prata 5 min. Sen koppla till fotosyntes."*
>
> *Methodology: "Bra — det blir en ingång via Gegenwart, inte via lärobokens struktur. Skriver jag det som bridge intention?"*

Methodology följer tre principer i konverteringen:

**Princip 1: Konkretisera.** Awareness är ofta abstrakt (*"korta inledningen"*). Alternative måste vara konkret (*"börja med fråga om klimat-nyheter, 5 min"*). Frågan är alltid: *"hur ser det här konkret ut?"*

**Princip 2: Konkretisera utan att låsa.** Bryggan är intention, inte plan. Detaljer kommer i pre-lesson. *"Vad startar du med?"* räcker — inte *"hur lång tid, vilka frågor exakt, vilka övergångar?"*. Bryggan ger riktning; pre-lesson ger struktur.

**Princip 3: Pusha mot agency.** *"Vad gör DU annorlunda?"* — inte *"vad ska eleverna göra annorlunda"*. Konverteringen är lärarens, inte elevernas.

Output per punkt: en *bridge intention* — kort konkret formulering som blir input till pre-lesson.

### Fas 2 — Klafki-test (kort)

När alla punkter är konverterade, ett kort filter innan save:

> *"Innan vi sparar — när du läser dina bridge intentions tillsammans: stämmer de med vad du faktiskt vill att eleverna ska möta i innehållet? Eller har vi flyttat oss bort från det centrala?"*

Detta är inte fullständig Klafki-analys (det görs i pre-lesson Fas 1). Det är bara en sista vakthet: *driver bryggan oss åt rätt håll, eller åt vad som är lätt att fixa?*

Om läraren känner att bryggan har drivit fel: gå tillbaka till Fas 1 och justera.

### Fas 3 — Save bridge intention

```typescript
intelligent_save({
  content: <YAML + markdown>,
  content_type: "brygga_intention",
  suggested_path: "Reflections/Bryggor/<datum>-brygga-<topic>.md"
})
```

YAML-frontmatter — kort, fokuserad:

```yaml
---
type: brygga_intention
created: 2026-09-23T18:00:00Z
date: 2026-09-23
course_instance: KURS101_2026
tags: [brygga, fotosyntes, kurs101]
status: draft
metadata_version: 1
provenance: brygga_v3
framework: [korthagen]
based_on:
  - "[[Reflections/2026-09-22_fotosyntes_gibbs]]"   # carry-forward-källan
intended_for:
  - "[[Lesson_Plans/2026-09-29-fotosyntes]]"        # nästa lektion (om datum finns)
bridge_intentions:
  - carry_forward: "Korta inledningen till 8 min — fick mer tid till diskussion."
    intention: "Börja med fråga om klimat-nyheter (5 min), koppla till fotosyntes."
  - carry_forward: "Calvin-cykel: visa cirkulärdiagram tidigare, inte sist."
    intention: "Cirkulärdiagram introduceras direkt vid block 3-start, inte i sammanfattning."
  - carry_forward: "C4-växter: släpp för denna kurs."
    intention: "Skippa helt — flytta till ekologi-modulen i v.45."
duration_actual: 7
---
```

Body — kort prosa:

```markdown
## Bryggan inför fotosyntes-lektion 2026-09-29

Tre punkter från carry-forward som aktiveras inför nästa lektion:

### 1. Inledning som ingång, inte översikt

Förra gången: kort översikt → ljusreaktion direkt. Tog 12 min, klippte i diskussionen senare.

Denna gång: börja med fråga *"vad såg ni i nyheterna i veckan om klimat?"* (5 min). Låt eleverna prata. Koppla till fotosyntes som biologisk grund för det de redan diskuterat.

### 2. Cirkulärdiagram tidigt

[...]

### 3. C4-växter ut

[...]
```

### Fas 4 — Log + handoff till pre-lesson

```typescript
log_process_event({
  type: "bridge_completed",
  files: ["Reflections/Bryggor/..."],
  trigger: "brygga"
})
```

Direkt efter save: pre-lesson startar (om bryggan triggades automatiskt vid pre-lesson-start) eller methodology säger:

> *"Klart. Bridge intention sparad. Vill du börja planera nu, eller ska vi avsluta här?"*

I pre-lesson Fas 2A läses sedan både carry-forward (raw, från reflektionen) *och* bridge intentions (konverterat, från bryggan). Pre-lesson har då två lager: *vad jag insåg* och *vad jag tänker göra åt det*.

---

## Skillnad från andra moment

Bryggan är arkitektoniskt ett distinkt moment. Det är värt att vara tydlig om vad det är *inte*.

| Moment | Vad det är | Vad det inte är |
|---|---|---|
| **Carry-forward** (REFL) | Lärarens egna ord från reflektion | Inte aktivering, inte planering — bara skrift |
| **Bryggan** (detta dokument) | Konvertering från awareness till intention | Inte ny reflektion (varför), inte detaljplanering (hur) |
| **Pre-lesson Fas 2A** | Visa carry-forward + bridge intentions som data | Inte aktiv konvertering — det är gjort |
| **Pre-lesson Fas 1** (Klafki) | Didaktisk analys av innehåll | Inte handlingsavsikt — det är ramen för hur intentionen genomförs |
| **Pre-lesson Fas 3** (UbD) | Strukturera lektion baklänges | Detaljerad block-uppbyggnad, inte bara intention |

Bryggans särprägel: det är *minsta meningsfulla enheten av handling-orientering* — kortare än reflektion, mindre detaljerat än planering.

---

## Spänningar att hålla i bryggan

### Konkretisera utan att låsa

Risken: bryggan blir mini-pre-lesson. Läraren börjar tänka på block, längd, exakt formulering. Då har bryggan blivit planering.

**Hur hanteras spänningen?** Methodology stoppar konkretisering vid *"vad startar du med?"*-nivå. Detaljerna vänta. Om läraren själv driver djupare: methodology kan markera *"detta är pre-lesson-mark — vill du gå vidare till planeringen istället?"*

### Awareness vs Action gap (Korthagen)

Risken: bryggan blir cirkulär — läraren reflekterar igen istället för att besluta.

**Hur hanteras spänningen?** Methodology pushar mot framtid: *"vad gör du istället?"*, inte *"varför hände det förra gången?"* Om läraren börjar reflektera över *varför*, methodology säger: *"det är reflektionen — den finns redan sparad. Frågan här är vad du vill pröva."*

### Carry-forward som inte längre känns relevant

Risken: läraren skrev carry-forward i affekt och vill nu inte aktivera den. Men methodology pushar och bryggan blir påklistrad.

**Hur hanteras spänningen?** Methodology accepterar *"den är inte längre aktuell"*. Då sparas en *bridge intention* med flagga *"carry_forward_dismissed"* och kort motivering. Detta är data — visar mönster (vissa carry-forwards håller inte, andra håller över tid).

### För många carry-forwards i historiken

Om läraren har skrivit reflektioner men inte kört brygga på flera lektioner finns flera carry-forwards i kö.

**Hur hanteras spänningen?** Methodology presenterar dem i kronologisk ordning, läraren väljer vilka som ska aktiveras. Inaktuella sparas med dismissal-flagga. Inte alla *måste* bli bridge intentions.

---

## GDPR

Bryggan innehåller lärarens handlingsavsikter, inte studentdata. Låg GDPR-risk.

| Datatyp | Hantering |
|---|---|
| Bridge intentions (lärarens egna ord) | Privat per lärare, kursmappen — OK |
| Citat av elever (om de förekommer i carry-forward) | Aggregerad nivå (*"någon elev frågade…"*), aldrig attribuerad |
| Affektivt material | Bryggan är handlings-orienterad — affekt finns i reflektionen, inte här |

Innehållet ärver REFL:s GDPR-ramning — om reflektionen är ren från elev-identifikation är även bryggan det.

---

## Tools som används

| Tool | Roll i bryggan |
|---|---|
| `load_methodology` | Laddar detta dokument vid trigger |
| `find_context` | Hämtar senaste reflektion (eller flera om flera carry-forwards finns i kö) |
| `file_read` | Läser reflektionsfilen för carry-forward |
| `intelligent_save` | Sparar bridge intention med ny `content_type: brygga_intention` |
| `log_process_event` | Loggar `bridge_completed`-event |

**Inga nya tools krävs.** All operation kan göras med befintliga.

---

## Integration med andra processer

### Bryggan ← REFL

REFL skriver carry-forward. Bryggan läser den och konverterar. Ingen modifiering av reflektionsfilen — bryggan skapar separat artefakt.

### Bryggan → Pre-lesson

Bridge intentions blir input till pre-lesson Fas 2A — bredvid carry-forward (raw) som *konverterat handlingsmaterial*. Pre-lesson kan visa dem strukturerat:

```
🔄 Från senaste reflektionen + bryggan:

Carry-forward (vad jag insåg):
  • Korta inledningen
  • Cirkulärdiagram tidigare
  • C4 ut

Bridge intentions (vad jag vill pröva):
  • Börja med klimat-nyheter-fråga (5 min)
  • Cirkulärdiagram vid block 3-start
  • C4 helt skippat

Vill du utgå från intentionerna i planeringen?
```

### Bryggan → Kursrevision (på sikt)

Mönster över tid i bridge intentions vs carry-forwards är intressant data för kursrevision: *vilka insikter aktiveras, vilka aktiveras inte?* Det är *meta-reflektion* om hur lärarens utveckling går.

Inte aktivt än — kräver att flera bryggor är skapade och att kursrevision läser även `brygga_intention`-filer.

### Bryggan → Manifest (på sikt)

Återkommande dismissal-mönster i bryggan (*"den här typen av insikt aktiveras aldrig"*) kan vara värdefullt för manifestrevisionen. Visar var lärarens stated intentions divergerar från actual practice.

Inte aktivt än — kräver manifest v1 + ackumulerad data.

---

## Edge cases

### Carry-forward saknas

Tidigare förklarat — bryggan har inget att aktivera. Methodology säger explicit och erbjuder alternativ.

### Carry-forward känns inaktuell

Läraren säger *"det här gäller inte längre"*. Methodology accepterar:

> *"OK, vi noterar punkten som inaktuell. Är det något specifikt du vill skriva om varför? (Inte krav — kan vara bara 'situationen ändrades'.)"*

Output: bridge intention med `dismissal: true` och `dismissal_reason` om angiven.

### Carry-forward leder till ny reflektion istället för intention

Läraren börjar reflektera över varför carry-forward inte gick som tänkt — det blir mini-reflektion.

**Methodology fallback:**

> *"Detta låter som en ny reflektion — vill du köra REFL i stället för brygga? Vi kan komma tillbaka till bryggan efteråt."*

Det är OK att avbryta bryggan för REFL. Men methodology påpekar att de är två olika moment.

### Två carry-forwards som motsäger varandra

Lektion 14: *"Korta inledningen"*. Lektion 15: *"Längre inledning behövs"*.

**Methodology fallback:**

> *"Carry-forward från lektion 14 säger 'korta inledning'. Från lektion 15: 'längre inledning'. Vad gäller för nästa lektion? (Eller: är de olika typer av lektioner med olika behov?)"*

Lärarens val. Båda kan dismissaras, en kan väljas, eller en hybrid kan formuleras.

### För kort tid

Lärare har 2 min, inte 5–10. Vill ändå göra något.

**Methodology fallback:** Förkortad brygga — visa carry-forward, fråga *en* aktiverande fråga: *"Vad är det viktigaste att pröva nästa gång?"* Spara enbart den enskilda intention. Bättre än ingen brygga alls.

### Lektion uteblir

Bryggan är gjord men lektionen ställs in. Bridge intention förlorar relevans.

**Methodology fallback:** vid nästa pre-lesson, methodology frågar om bridge intention fortfarande gäller eller ska bäras vidare till lektionen efter.

---

## Kvalitetskriterier

### En bra bridge intention har:

- Ord-för-ord-citat av carry-forward som källa
- Konkret formulering av *vad jag gör istället*
- Aktivt verb (*"börjar med"*, *"introducerar"*, *"skippar"*) — inte beskrivande
- Lagom konkretion: tillräckligt för att bli handling, inte så detaljerad att den ersätter pre-lesson
- Wikilink till källreflektionen

### En dålig bridge intention har:

- Parafras av carry-forward (*"jag ska vara kortare"* utan citat)
- Vag formulering (*"förbättra inledningen"* — vad konkret?)
- Beskrivande, inte handlings-ord (*"jag tänkte att…"* — gör eller gör inte?)
- För detaljerad — har glidit in i pre-lesson-territorium
- Saknad koppling till källa

---

## Output-exempel (kort)

```yaml
---
type: brygga_intention
created: 2026-09-23T18:00:00Z
date: 2026-09-23
course_instance: KURS101_2026
tags: [brygga, fotosyntes, kurs101]
status: draft
metadata_version: 1
provenance: brygga_v3
framework: [korthagen]
based_on:
  - "[[Reflections/2026-09-22_fotosyntes_gibbs]]"
intended_for:
  - "[[Lesson_Plans/2026-09-29-fotosyntes]]"
bridge_intentions:
  - carry_forward: "Korta inledningen till 8 min — fick mer tid till diskussion."
    intention: "Börja med fråga om klimat-nyheter (5 min), koppla till fotosyntes."
  - carry_forward: "Calvin-cykel: visa cirkulärdiagram tidigare, inte sist."
    intention: "Cirkulärdiagram introduceras direkt vid block 3-start."
  - carry_forward: "C4-växter: släpp för denna kurs."
    intention: "Skippa helt — flytta till ekologi-modulen i v.45."
    dismissal: false
duration_actual: 7
---

## Bryggan inför fotosyntes-lektion 2026-09-29

Tre punkter från carry-forward som aktiveras inför nästa lektion.

### 1. Inledning som ingång, inte översikt

Förra gången: kort översikt → ljusreaktion direkt. Tog 12 min.

**Denna gång:** börja med fråga *"vad såg ni i nyheterna i veckan om klimat?"* (5 min). Låt eleverna prata. Koppla sedan till fotosyntes som biologisk grund.

### 2. Cirkulärdiagram tidigt

Förra gången: ritades på whiteboard i sammanfattningen — för sent.

**Denna gång:** introducera cirkulärdiagrammet i början av Calvin-cykel-blocket, sedan utveckla med pilar/färger under blocket.

### 3. C4-växter ut

Förra gången: planerat 5 min, hann ej.

**Denna gång:** skippa helt. Innehållet flyttas till ekologi-modulen senare i terminen där det passar bättre med kontexten.
```

---

## Bibliotek — prompts & frågor

Bryggan är smal, så biblioteket är kort. Kategoriserade prompter:

### Trigger-prompter

- *"Senaste reflektion har carry-forward. Vill vi göra bryggan innan vi planerar?"*
- *"Brygga från senaste reflektionen?"*
- *"Vad bär du med dig in i nästa lektion?"*

### Konverterings-prompter

- *"När du tänker på nästa lektion — hur ser det här konkret ut?"*
- *"Vad gör du istället för det du gjorde förra gången?"*
- *"Vad startar du med? Vad ändras i flödet?"*
- *"Det här är intentionen — kommer du faktiskt att pröva detta?"*

### Konkretiserings-prompter

- *"Mer specifikt: vilken aktivitet ersätter den gamla?"*
- *"Hur märks det skiftet i de första 5 minuterna av lektionen?"*

### Pushback mot vag formulering

- *"'Jag ska vara mer närvarande' — hur märks det? Vad gör du som signalerar det?"*
- *"'Förbättra X' — vad konkret gör du annorlunda?"*

### Stoppning innan pre-lesson-territorium

- *"Det här är konkret nog — detaljerna kommer i planeringen. Vill vi gå vidare?"*
- *"Detta börjar låta som planering. Bryggan stannar vid intention — vill vi spara och gå till pre-lesson?"*

### Klafki-test (Fas 2)

- *"Stämmer dina intentioner med vad eleverna behöver möta i innehållet?"*
- *"Driver de mot det centrala, eller mot det lätt att fixa?"*

### Avslut

- *"Sparar bridge intention och loggar bryggan som klar. OK?"*
- *"Klart. Vill du fortsätta till pre-lesson nu?"*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — överliggande arkitektur, beskriver bryggan som arkitektoniskt distinkt moment
- **`pre_lesson.md`** — pre-lesson, läser bridge intentions i Fas 2A
- **`post_lesson_refl.md`** — REFL, skapar carry-forward som bryggan aktiverar
- **`post_lesson_auto.md`** — AUTO, ej direkt påverkad av bryggan

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Korthagen ALACT (övergången Awareness → Creating alternatives), Perkins & Salomon (bridging strategies från transfer-forskning), Schön (reflection-on-action som grund).

**Princip:** bryggan är ett *distinkt moment* mellan reflektion och planering — varken det ena eller det andra. Konvertering från awareness till handling, smal scope (5–10 min).

**Process — 4 faser:**

- Fas 0: Trigger + carry-forward-loading
- Fas 1: Konvertering — punkt för punkt, från awareness till intention
- Fas 2: Klafki-test (kort vakthet)
- Fas 3: Save bridge intention
- Fas 4: Log + handoff till pre-lesson

**Spänningar (fyra):**

- Konkretisera utan att låsa (bryggan ≠ planering)
- Awareness vs action gap (bryggan ≠ ny reflektion)
- Carry-forward som inte längre känns relevant (dismissal-mekanism)
- För många carry-forwards i historiken (kronologisk ordning + selektivitet)

**Operativ rikedom:**

- 4 strukturella faser
- YAML-fält: `bridge_intentions` (list med carry_forward + intention + optional dismissal)
- Bibliotek av ~25 prompter
- Edge cases (saknad CF, inaktuell CF, mini-reflektion, motsägelser, kort tid, inställd lektion)
- En bra / en dålig bridge intention

**Föregångare:** Inget föregångare-dokument — bryggan har inte funnits som explicit moment tidigare. Carry-forward har täckt skriv-sidan; bryggan är nytt aktiveringsmoment.
