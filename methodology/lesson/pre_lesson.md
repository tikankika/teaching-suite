---
type: exploration
status: draft
created: 2026-04-27T16:09:04
origin: desktop
project: Teaching Suite
---

# Methodology — Lektionscykeln: Pre-lesson

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **pre-lesson-fasen i lektionscykeln**. Pre-lesson är *intentionellt, framåtvänt arbete* — där läraren förbereder mötet mellan innehåll och elever.

```
                            ┌─→ POST-LESSON_AUTO ─┐
PRE-LESSON  →  LESSON  ─────┤                      ├──→  BRYGGA
   ↑                        └─→ POST-LESSON_REFL ─┘        │
   │                                                       │
   └───────────────── kunskap förs vidare ────────────────┘
```

**Lärarens fråga:** *Vad ska jag göra med dessa elever idag, och varför?*

**Tempo:** timmar–dagar. Bäst 2–7 dagar före lektionen, godtagbart dag före, sämre samma dag.

---

## Grundprincip

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I pre-lesson:

- AI samlar in data, strukturerar mall, påminner om mönster, korsrefererar
- Människan tolkar innehållet, väljer riktning, bestämmer prioriteringar

Klafki tvingar fram *vad-* och *varför-frågan* före *hur-frågan*. Wiggins & McTighe ger den operativa strukturen — backward design från avsedd förståelse till evidens till aktivitet. Conway lägger anticipatory reflection som explicit moment innan datasökning. Black & Wiliam ger formativ avläsning som inplaneringsuppgift, inte efterhandsobservation.

Detta methodology följer den prioriteringsordningen. Den operativa rikedomen (sökning, syntes, output) är ställning. Den teoretiska grunden (Klafki + UbD) bär meningen.

**Sub-princip: Aldrig från scratch.** Pre-lesson är aldrig att börja om från noll. Det är att bygga vidare på vad som finns — tidigare lektioner, reflektioner, idéer, kursrevision, teacher_insights, manifest.

---

## Teoretisk grund

### Klafki — didaktisk analys (1958/1995)

Klafkis fem frågor är pre-lessons strukturella utgångspunkt:

1. **Exemplarische Bedeutung** — vad står detta innehåll för? Vad allmänt kan läras genom just detta?
2. **Gegenwartsbedeutung** — vad betyder innehållet för eleverna *nu*?
3. **Zukunftsbedeutung** — vad kommer det att betyda för dem?
4. **Sachstruktur** — hur är innehållet uppbyggt internt?
5. **Zugänglichkeit** — hur kan det göras tillgängligt för dessa elever?

Klafki tvingar fram att *vad* och *varför* måste besvaras innan *hur*. Det är där hans tradition skiljer sig från amerikansk *instructional design*: bildningens vad är aldrig tekniskt avgjort.

### Wiggins & McTighe — Understanding by Design (2005)

Backward design — tre steg, baklänges:

1. **Avsedd förståelse** — vad ska eleverna kunna efter lektionen? (Här möter vi Klafkis Sachstruktur)
2. **Evidens för lärande** — hur ska jag veta att de kan det?
3. **Lärupplevelsen** — vilka aktiviteter får dem dit?

Six facets of understanding ger djupare textur än verb-listor:

- *Explanation* — kan förklara fenomenet
- *Interpretation* — kan tolka, hitta mening
- *Application* — kan tillämpa i ny kontext
- *Perspective* — kan se från olika synvinklar
- *Empathy* — kan känna in andras position
- *Self-knowledge* — kan se sin egen förståelse

### Conway — anticipatory reflection (2001)

Anticipatory reflection är ett underanvänt pre-lesson-moment: att i förväg tänka igenom vad som kan gå fel, vilka frågor som kan komma, var missuppfattningar är troliga. Lärare gör detta tyst i huvudet; methodology gör det explicit.

### Black & Wiliam — formativ avläsning (1998)

Formativ avläsning ska planeras *innan* lektionen, inte improviseras under. Konkret: hur ska jag märka under lektionen att eleverna lär sig det jag tänkt? Vilka frågor kan jag ställa? Vilka tecken ska jag titta efter?

---

## Trigger

Pre-lesson startas av lärarfrasen i Claude Desktop:

- *"Planera nästa lektion om [topic]"*
- *"Jag ska undervisa [topic] [datum]"*
- *"Hjälp mig förbereda [topic]-lektion"*
- *"Förbered [topic] för [grupp]"*

**Förutsättningar (minimum):**

- Topic är känt
- Kurs är identifierad (eller kan härledas)

**Optionellt:** datum, längd, redan kända lärandemål.

---

## Process

### Fas 0 — Input & framing

Samla minimala parametrar:

```
📋 Pre-lesson-planering startad

Kurs: [identifierad eller fråga]
Topic: [från användaren]
Datum: [angivet eller "snart"]
Längd: [60 min default, men verifiera]
```

Bekräfta innan vi går vidare. Om något saknas, fråga *en* fråga i taget — inte ett formulär.

### Fas 0.5 — Lärarens egna ord innan systemsökning

Innan methodology söker historik, ställs två frågor till läraren. Detta är data lika mycket som tidigare reflektioner — och det är data som annars inte fångas.

**1. Om gruppen just nu:**

> *"Vad vet du om gruppen — förförståelse, förra lektionens efterdyningar, känslor du noterat?"*

**2. Anticipatory reflection (Conway):**

> *"Vad förväntar du dig blir svårt här? Vilka frågor tror du kan komma? Var brukar det fastna?"*

Anteckna lärarens svar som **prosa** i body-sektionen *Group context & anticipated difficulties* (sektion 4 i markdown-bodyn). Inte som YAML-fält — det blev dubbel bokföring i v3.0-utfallet (lärarens prosa stod redan i body, samma innehåll igen som strukturerade YAML-listor).

Princip (Conway): det läraren vet om gruppen och gissar i förväg är ofta värdefullare än vad som påminns från historik, för det rör just *denna* situations specifika känsla. Och: när läraren formulerar det själv, blir det också material för efterföljande post-lesson-reflektion (matchade förväntningarna det som hände?).

### Fas 1 — Klafkis didaktiska analys

Innan struktur — innan Bloom-verb, innan ILO-formuleringar — gå igenom Klafkis fem frågor.

Detta sker som dialog, inte formulär. Methodology föreslår en fråga åt gången, väntar på svar, och bygger upp förståelsen tillsammans med läraren.

**Exemplarische Bedeutung:**

> *"Om du bara har 60 minuter att möta dessa elever med detta innehåll — vad är det allmänt värda i ämnet som just denna del kan öppna? Vad står [topic] för?"*

Exempel: *Fotosyntes som exempel på energiomvandling i naturen — eleven möter principen energi konserveras men förändrar form. Det öppnar termodynamik, ekologi, evolution.*

**Gegenwartsbedeutung:**

> *"Vad betyder detta för eleverna nu — i deras nuvarande förståelse, deras nuvarande liv? Vad gör det meningsfullt idag?"*

Exempel: *Klimatfrågan, energiomställningen, varför växter behövs för luften vi andas.*

**Zukunftsbedeutung:**

> *"Vad kommer detta att betyda för dem — i fortsatta studier, i livet, som medborgare?"*

Exempel: *Att kunna tänka systemiskt om energi och kretslopp, att förstå biologisk grund för klimatpolitik.*

**Sachstruktur:**

> *"Hur är innehållet uppbyggt internt? Vad är centrum, vad är periferi? Vad förutsätter vad?"*

Exempel: *Kärnan: ljus + vatten + CO2 → glukos + syre. Ljusreaktion (omvandling) före mörkerreaktion (fixering). Förutsätter: ATP-begrepp, klorofyllens roll.*

**Zugänglichkeit:**

> *"Hur kan detta göras tillgängligt för just dessa elever? Vad fungerar som ingång?"*

Exempel: *Solpanel-analogi har fungerat förr. Whiteboard-diagram bättre än text-tunga slides. Diskussion kring energi i vardagen.*

Output från Fas 1: en kort **didaktisk skiss** — fyra–sex meningar som besvarar de fem frågorna. Detta är bilden vi sedan testar mot historik och konkretiserar.

### Fas 2 — Context gathering (Aldrig från scratch)

Pre-lesson är inte att börja om från noll. Det är att bygga vidare på vad som finns.

Methodology anropar tools för att hämta data — och lägger fram dem för läraren att bedöma. **Inte allt används.** Det som inte är relevant för just denna lektion sorteras bort av läraren.

#### 2A — Post-lesson-output från senaste lektionen

Två datakällor från senaste lektionen utgör tillsammans grundbryggan in i nästa pre-lesson. **AUTO är systemets observationer; REFL är lärarens röst.** Båda matar — men de är inte samma sak.

**Post-lesson AUTO (`post_lesson_auto.md`-output):**

AUTO-fasen producerar fyra typer av spår som pre-lesson läser:

- *Strukturerad mall* — template för planning, alignment med post-lesson-protokollet
- *Taggade begrepp från lektionsplanen* — vad togs faktiskt upp
- *Jämförelse plan vs utfall* — vilka block höll sin tid, vilka inte
- *concepts_missing-flaggor* — begrepp som inte landade som väntat
- *Påminnelser från tidigare mönster* — om mönsterdetektion identifierat något återkommande

```typescript
find_context({
  content_types: ['post_lesson_auto'],
  course: "[course]",
  recent: true   // senaste lektionen specifikt
})
```

**Post-lesson REFL — Carry-forward:**

Vid sessionsstart har `context_load` läst process-loggen, hittat senaste `carry_forward_in`-pekaren, och extraherat `## Carry-forward`-sektionen ur reflektionen.

```
🔄 Carry-forward från senaste reflektionen:

Reflektion: Reflections/lektion_14_immunförsvaret.md

"1. Korta föreläsningen till 10 min — diskussionstiden krympte märkbart.
 2. Lägg till rita-och-förklara för dendritens funktion.
 3. Förbered 5 fokuserande frågor (bara ett fåtal var fokuserande idag)."

Vill du utgå från detta?
```

**Princip:** Carry-forward visar lärarens *exakta* ord — ingen automatisk extraktion eller tolkning. AUTO ger systemets observationer värderingsfritt. Tillsammans ger de en fullständig bild av föregående lektion: vad systemet såg + vad läraren tolkade.

Om både AUTO och carry-forward saknas (första cykel-lektion): gå vidare till 2B utan att flagga som problem.

#### 2B — Tidigare lektioner samma topic

```typescript
file_search({
  pattern: "topic: [topic]",
  type: "lesson_plan",
  course: "[course]_*"  // alla år
})
```

Extrahera: lektionsstruktur, lärandemål, material, *based_on*. Visa lärare som lista, fråga om någon ska användas som utgångspunkt.

#### 2C — Reflektioner samma topic

```typescript
find_context({
  content_types: ['reflection'],
  topic: "[topic]",
  course: "[course]_*"
})
```

Extrahera ur YAML och prosa: 

- *Carry-forward* (om ej redan ovan)
- *Insights — vad fungerade / vad inte fungerade*
- *Planned vs actual* (timing-insikter)
- *Manuell granskning*

#### 2D — Kursens ILO för veckan

Läs från `_config/learning_objectives.yaml` (Learning Objectives Register). Detta är den *enda* källan för ILO — delas mellan Teaching Suite och QuestionForge.

```yaml
# _config/learning_objectives.yaml
- code: KURS101.04.fotosyntes.ljusreaktion
  text: "Förklara ATP-bildning i thylakoiden"
  bloom_level: understand   # eller UbD-facet
  cycle: 4
```

**Läraren testar varje ILO mot Klafki-fråga:** *Fångar denna det som är värt att lära, eller bara det som är lätt att mäta?* Det är en spänning vi håller (se nedan).

#### 2E — Tidigare upplagors revision

```typescript
find_context({
  content_types: ['course_revision'],
  course: "[course]_*"  // tidigare år
})
```

Extrahera *vad lärdes om denna lektion förra gången*, *drift-mönster*, *återkommande svåra begrepp*. Detta är kursrevisionens output som matar nästa upplaga (Stenhouse).

#### 2F — Idéer (capture_idea)

```typescript
file_search({
  pattern: "[topic]",
  type: "idea",
  tags: ["nu", "snart"]
})
```

Visa läraren idéer hen själv har fångat tidigare med just detta topic. Status: använd, otestad, otestad (snart).

#### 2G — Teacher_insights från Assessment_suite (`student_data_to_teacher_bridge`)

Cross-MCP-flöde. Assessment_suite exporterar aggregerade pedagogiska insikter till `Data/Teacher_Insights/` i kursmappen. Pre-lesson läser dessa via [bryggan](../bridges/student_data_to_teacher.md). Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): policyn (B) + handlingen (C) här som prosa; detektionen (A) i kod.

**Villkor (B):** Cowork ska invokera bryggan när:

- `Data/Teacher_Insights/` innehåller en eller flera filer som *kopplar till denna lektions topic eller ILO* (matchning på `topic`-fält i teacher_insight YAML eller på `supports`-koderna)
- ELLER: läraren explicit frågar *"vad säger datan?"* eller liknande

**Handling (C):** Cowork **presenterar mönstret utan tolkning** (Selwyn-medvetenhet — se bryggans designprincip):

> *"Jag hittade [N] teacher_insights som rör [topic]. Senaste är från [datum] och säger [konkret beskrivet utan värdering, t.ex. 'mörkerreaktion: 42 % rätt på Q4 i ett tidigare test']. Hur ser du på det inför planeringen av denna lektion?"*

Vid lärarens reflektion: integrera tolkningen i pre-lesson-arbetet (kan påverka Klafkis Sachstruktur, Zugänglichkeit, eller block-design). Spara data_source-länken i lektionsplanens YAML.

**Detektion (A):**

```typescript
find_context({
  content_types: ['teacher_insight'],
  topic: "[topic]",
  course: "[course]"
})
```

Räkning, filtrering, matchning är ren mekanik. Vad insikten *betyder* avgör läraren.

**Vad bryggan returnerar (extrahera ur teacher_insight):**

- Begrepp med låg hämtningsgrad (retrieval-tester)
- Vanliga missuppfattningar (distraktoranalys)
- ILO:n med svagt utfall i prov

**GDPR-grans:** dessa insikter är *aggregerade och avidentifierade*. Inga enskilda elever. Om något elevidentifierbart syns — flagga och stoppa, det är ett brott mot workspace-separationen.

**Princip från bridge-doc:en:** Cowork **interpreterar inte data**. Aldrig *"42 % rätt — det är ett dåligt resultat"*. Bara *"42 % rätt på Q4. Hur ser du på det?"*. Tolkning är lärarens domän.

Se `methodology/bridges/student_data_to_teacher.md` för bryggans interna mekanism och Black & Wiliam / Hattie / Selwyn-grunder.

#### 2H — Manifestet (`profession_to_lesson_bridge`)

[Bryggan](../bridges/profession_to_lesson.md) som *förbinder* lärarens manifest med enskild lektionsplan. Aktiveras vid varje pre_lesson Fas 1 (Klafki) — inte konditionellt, utan rutinmässigt. Dokumentation per Synlighetsprincipen.

**Villkor (B):** Cowork ska invokera bryggan när:

- Pre-lesson har nått slutet av Fas 1 (Klafkis fem frågor besvarade)
- *och* `<workspace_root>/Profession/Manifest/` innehåller minst en manifest-fil

Bryggan triggas alltså **vid varje pre_lesson** där manifest finns. Om manifest saknas — se *Specialfall* nedan.

**Handling (C):** Cowork ställer **manifest-test-frågan** som en sjätte didaktisk fråga utöver Klafkis fem:

> *"Du planerar [topic]. I ditt manifest står du för [konkret aspekt — citat eller kort summering]. Hur gestaltas det i denna lektion? Eller är detta en manifest-neutral lektion (t.ex. ren färdighetsträning)?"*

Lärarens svar är fritt. Tre legitima utfall:

- **Lektionsdesign justeras** för att tydligare gestalta manifestet — modifikation sker i Fas 3 (backward design)
- **Lektionen accepteras som är** — manifest-relevant men redan adresserat
- **Lektionen klassas som manifest-neutral** — manifestet vilar för denna lektion

Alla tre är OK. **Bryggan är *frågan*, inte *kravet*.** Cowork ska inte värdera lärarens svar — den ska bara säkerställa medveten avsikt.

**Detektion (A):**

```typescript
file_search({
  pattern: "*.md",
  path: "<workspace_root>/Profession/Manifest/"
})
// Senaste mtime → läs in som manifest-kontext
```

Att hitta filen är mekanik. Att välja vilken aspekt som är *relevant för denna lektion* är pre-lesson-LLM-bedömning baserat på Klafki Fas 1-output.

**Vad sparas i lektionsplanens YAML** (per bridge-doc:ens output-spec):

```yaml
manifest_test:
  manifest_version: "v2_2026-09-01"
  relevant_aspect: "Studentcentrerad dialog som primär lärform"
  question_asked: "Hur gestaltar fotosyntes-lektionen detta?"
  teacher_response: |
    Bygger in 15 min strukturerad pardiskussion efter solpanel-analogin.
  modification_made: true
```

**Specialfall — manifest saknas:** Om `Profession/Manifest/` är tom: Cowork föreslår manifest-skrivning som separat process (`load_methodology('manifest')`) men *blockerar inte* pre_lesson — pre-lesson fortsätter utan manifest-test, med flaggan `manifest_test.status: no_manifest_available` i YAML. Förslaget om att skriva manifest föreslås en gång per session, inte vid varje pre_lesson.

Se `methodology/bridges/profession_to_lesson.md` för bryggans designprincip (Klafki + Biesta-grund) och edge cases.

#### 2I — Syntes (timing + innehåll + utkast till struktur)

När Fas 2A–2H är gjorda, syntetisera datan innan vi går till backward design. Syftet är att presentera mönster, inte enskildheter.

**Timing-insikter:**

För varje block-typ från historik, summera planerat vs faktiskt:

```
📊 Timing-insikter från tidigare:

Introduktion: planerat medel 12 min / faktiskt 9 min (-25%)
  → 10 min räcker

Ljusreaktion: planerat 20 min / faktiskt 30 min (+50%)
  → Planera 30 min, diskussion tar tid

Mörkerreaktion: planerat 20 min / faktiskt 16 min (-20%)
  → 15-20 min om fokuserad

Diskussion: planerat 10 min / faktiskt 18 min (+80%)
  → Alltid 15-20 min för Q&A
```

**Innehållsinsikter:**

Sortera reflektionsfynd i tre listor:

```
✅ Vad har fungerat historiskt:
- Solpanel-analogin för ljusreaktion (tidigare omgångar)
- Whiteboard-diagram för överblick
- Diskussion kring energi i vardagen

⚠️ Vad har inte fungerat:
- Text-tunga slides (en tidigare omgång)
- För lite tid för Q&A (tidigare omgångar)
- Mörkerreaktion för snabbt genomgången

🎯 Återkommande rekommendationer:
- 30 min för ljusreaktion (inkl. diskussion)
- 15-20 min för mörkerreaktion (fokuserad)
- 15-20 min för Q&A (inte mindre!)
- Använd analogi för ingång
```

**Utkast till lektionsstruktur:**

Med Klafki-skissen + timing-insikterna + innehållsinsikterna, föreslå ett utkast — inte slutligt, en utgångspunkt för dialogen i Fas 3:

> *"Förslag på lektionsstruktur (60 min, baserat på Klafki-skissen och historiken):*
>
> *Block 1: Introduktion & aktivering (10 min)*
> *Block 2: Ljusreaktion (25 min) — solpanel-analogi*
> *Block 3: Mörkerreaktion (15 min) — extra långsamt här*
> *Block 4: Diskussion & frågor (10 min) — förvänta 15+*
>
> *Vill du justera, eller utgår vi från detta?"*

---

### Fas 3 — Backward design (UbD)

Med Klafki-skissen, kontextdatan och syntes-utkastet på plats: nu bygger vi lektionsstrukturen baklänges.

#### Steg 1 — Avsedd förståelse

Konkretisera Klafkis Sachstruktur till lärandemål. För varje ILO som ska gälla denna lektion, gör två val:

**Taxonomi:** Bloom-verb eller UbD-facet? Båda är legitima. Bloom passar när det är färdighet (kan namnge, kan beräkna, kan applicera). UbD-facet passar när det är förståelse (kan förklara, kan se från ett annat perspektiv, kan känna in en annan position).

**Klafki-test:** *Fångar denna formulering det exemplariskt värda, eller bara det lätt mätbara?* Om det senare — omformulera eller tillåt "vagare" formulering som bär mening.

#### Steg 2 — Evidens för lärande (formativ avläsning, Black & Wiliam)

Hur ska du veta under lektionen att de lär sig det? Inplanerade observationspunkter:

- Frågor du planerar ställa (3–5 stycken, fokuserade)
- Aktiviteter där du kan höra/se förståelse
- Exit ticket eller motsvarande
- Korta retrieval-tester (5 min) — om aktuellt för cadensen

Detta är inte bedömning utan *formativ avläsning*. Skillnaden är viktig: avläsning är att märka under, så jag kan justera; bedömning är att utvärdera efter.

#### Steg 3 — Lärupplevelsen

Nu bygger vi blocken. Varje block ska:

- Tjäna en del av Sachstruktur
- Möta Zugänglichkeit (rätt ingång för dessa elever)
- Innehålla minst en formativ avläsningspunkt

Default-strukturer som utgångspunkt (anpassa alltid):

| Längd | Block | Default |
|---|---|---|
| ≤30 min | 3 | Intro (5) → Huvudinnehåll (20) → Sammanfattning (5) |
| ≤45 min | 4 | Intro (5) → Innehåll (25) → Övning (10) → Sammanfattning (5) |
| ≤60 min | 5 | Intro (10) → Del 1 (15) → Del 2 (15) → Diskussion (10) → Sammanfattning (10) |
| 90+ min | 7 | Intro (10) → Del 1 (20) → Del 2 (20) → Paus (10) → Del 3 (15) → Diskussion (10) → Sammanfattning (5) |

**Timing-justering från reflektionsdata:** om föregående `actual_min > planned_min` med 5+ min för ett block, flagga det i nya planen (*OBS: tog 30 min förra gången, planerat 20*) och justera planerad tid eller lägg in explicit buffer.

#### Iterativ förfining genom dialog

Backward design är inte linjär ifyllning. Methodology för dialog där läraren testar och justerar.

**Förfiningsfrågor på innehåll:**

- *"Vill du lägga till något som inte finns i strukturen?"*
- *"Finns det något du vill ta bort eller förkorta?"*
- *"Ska vi fokusera extra på något baserat på teacher_insights?"*

**Förfiningsfrågor på timing:**

- *"Känner du att 60 min räcker, eller behöver du 90 min?"*
- *"Vill du ha mer tid för diskussion?"*
- *"Ska vi skippa något för att få mer tid på annat?"*

**Förfiningsfrågor på lärandemål:**

- *"Vilka är de viktigaste lärandemålen för denna lektion?"*
- *"Vad MÅSTE eleverna kunna efter lektionen?"*
- *"Vad är 'nice to have' vs 'must have'?"*

**Förfiningsfrågor på material:**

- *"Vill du använda video, eller bara whiteboard?"*
- *"Behöver du förbereda slides?"*
- *"Finns det laboration eller bara teori?"*

**Konstruktiv pushback — princip:**

Methodology ska tillåta att Claude *invänder* när lärarens val går emot historik eller pedagogisk princip. Inte vetorätt — utan en notering så läraren kan välja medvetet.

Exempel:

> *Läraren: "Korta mörkerreaktion till 10 min."*
>
> *Methodology: ⚠️ Reflektionen från 2025-09-15 noterade att mörkerreaktion var för rushat på 15 min. 10 min kan vara för lite. Vill du:*
> *— Utöka lektionen till 75 min istället?*
> *— Göra C4-växter mycket kort (5 min)?*
> *— Ändå köra på 10 min (medvetet val)?*

Detta är *AI håller ställningen* — påminner om vad historik säger. Det är *läraren håller meningen* — bestämmer ändå.

---

### Fas 4 — Plan B / kontingens

> *"Vad gör du om det inte funkar? Var är riskpunkterna?"*

Konkret tabell — tre till fem rader:

| Utmaning | Lösning |
|---|---|
| Block X tar dubbelt så lång tid | Korta Y, fortsätt nästa lektion |
| Eleverna förvirrade vid Z | Förenkla, fördjupning nästa gång |
| Diskussion exploderar | OK, sätt gräns vid X min |

Detta är inte pessimism — det är ärligt erkännande att lektioner är *swampy lowlands* (Schön). Att ha plan B framme minskar improvisationsbördan.

---

### Fas 5 — Materials & förberedelse

Tre listor:

**Innan lektion:**

- [ ] Diagram/slides/material att förbereda
- [ ] Teknisk uppställning
- [ ] Bilder, exempel, källor

**Under lektion:**

- [ ] Whiteboard-pennor, projektor, timer
- [ ] Inspelning på (om transkription önskas — KB-Whisper)
- [ ] Obsidian öppen för spontana `capture_idea`-anrop
- [ ] Pre-lesson-plan tillgänglig som lathund

**Förkunskaper att kolla:**

- [ ] Vad förutsätter denna lektion att de redan kan?
- [ ] Hur säkerställer jag det första 5 min?

> **Lesson-momentet — MCP tystnar.** Under själva lektionen är MCP:n inte aktiv. Det enda systemet erbjuder är: pre-lesson-anteckningar som lathund, `capture_idea` för spontana fynd, och inspelningsstart för senare transkribering. Ingen prompt avbryter, ingen analys sker i realtid. *Reflection-in-action* (Schön) hör läraren själv.

---

### Fas 6 — Strukturerad output

Format: YAML frontmatter + Markdown lektionsplan.

#### YAML-fält

**Princip — prosa först, YAML bara för det som någon faktiskt läser maskinellt.**

YAML-rubriken är inte en parallell maskin-läsbar kopia av lektionsplanen. Den ska bara innehålla fält som har en *reell läsare utöver lärarens egna ögon*: MCP-sök, andra MCP-servrar (QuestionForge, Assessment_suite), eller framtida cross-lesson-spår. Allt didaktiskt tänkande — Klafki-skissen, group context, anticipated difficulties, plan B — hör hemma i prosa-bodyn där läraren faktiskt läser det söndag kväll och måndag morgon.

**Kärnfält:**

```yaml
type: lesson_plan
created: 2026-04-26T14:30:00Z   # explicit — filsystemets mtime ändras vid varje redigering
date: 2026-09-22
tags: [lektionsplan, fotosyntes, kurs101]
status: draft
metadata_version: 1
```

`course_instance` har tagits bort som fält — det härleds från sökvägen (`/Nextcloud/Courses/<course>/...`). Kärnfält som `day`, `week`, `time`, `room`, `duration`, `type_of_lesson` har också tagits bort: de är antingen härledbara från `date` + body, redan synliga i markdown-H2-raden, eller vaga taxonomier som ingen söker på.

**Kontextfält:**

```yaml
based_on:
  - "[[Reflections/lektion_14_immunförsvaret]]"   # carry-forward
  - "[[Lesson_Plans/2025-09-15-fotosyntes]]"      # tidigare upplaga
  - "[[Ideas/c4-vaxter-lokala-exempel]]"          # idé som används
supports:
  - KURS101.04.fotosyntes.ljusreaktion
  - KURS101.04.fotosyntes.morkerreaktion
learning_objectives: [...]
provenance: pre_lesson_planning_v3
```

`framework: [klafki, ubd]` har tagits bort — fältet skulle möjliggöra filtrering "lektioner med Klafki-grund", men ingen söker så. Klafki och UbD är teorin *bakom* methodology, inte data *om* en enskild lektionsplan.

**Pre-lesson-specifika fält (operativa, läses faktiskt):**

```yaml
formative_checks:             # 3–5 saker du letar efter under lektionen
  - "Fråga efter ljusreaktion: 'var kommer ATP ifrån?'"
  - "Exit ticket: rita ATP-bildning"
plan_b:                       # kontingens — operativ info i klassrummet
  - utmaning: "ljusreaktion >30 min"
    åtgärd: "korta C4 till 5 min"
goals_supported:              # från track_goal-integration, för cross-lesson-spår
  - srl_metakognition
blocks: [...]                 # block-nivå-data: namn, duration, activity, formative
materials: [...]
```

**Borttagna i 2026-05-03-rensningen** (motiv per fält i versionsanmärkningen nedan):

- `duration` på lektionsnivå — härledbart från block-summan
- `group_context` — hör hemma i body-prosa (sektion 4)
- `didactic_skiss` med fem underfält (exemplariskt, gegenwart, zukunft, sachstruktur, zugänglighet) — Klafki-skissen står som prosa i body-sektion 1, ingen läser samma innehåll igen som strukturerad YAML
- `anticipated_difficulties` — hör hemma i body-prosa (sektion 4)

Varje borttaget fält var ett fall av *dubbel bokföring* — text som redan stod i body skrevs en gång till som YAML-data, utan att någon faktiskt läste den senare formen.

#### Tag-generering — regler

För konsistent sökbarhet:

1. Första tag: alltid `lektionsplan`
2. Topic tag: gemener, å/ä→a, ö→o, mellanslag→bindestreck (`fotosyntes`, `c4-vaxter`)
3. Course tag: extrahera kurskod, gemener (`kurs101`)
4. Nyckelbegrepp som extra tags (max 3–4)
5. Deduplicera

Exempel: `tags: [lektionsplan, fotosyntes, kurs101, ljusreaktion, morkerreaktion]`

#### Markdown body — strukturella sektioner

Efter YAML följer body i denna ordning:

1. **Lektionens didaktiska kärna** — Klafki-skissen som prosa (Exemplarische, Gegenwart, Zukunft, Sachstruktur, Zugänglichkeit som flytande text — inte fem rubriker)
2. **Lärandemål** — listade, med Klafki-test som korta kommentarer
3. **Bakgrund / vad detta bygger på** — kort om reflektioner och idéer som matar planen
4. **Group context & anticipated difficulties** — vad jag vet om gruppen + vad jag tror blir svårt (Fas 0.5)
5. **Lektionsstruktur** — översiktstabell med block, längd, aktivitet
6. **Detaljerad planering** — block för block med syfte, aktivitet, formativ avläsning, notes
7. **Plan B** — kontingens-tabell
8. **Material och förberedelse** — tre listor (innan, under, förkunskaper)
9. **Reflektion-frågor att bära med** — för post-lesson
10. **Kopplingar** — tidigare och kommande lektioner, kursplanens mål

---

### Fas 7 — Save

```typescript
intelligent_save({
  content: <YAML + Markdown>,
  content_type: "lesson_plan",
  suggested_path: "Lesson_Plans/[YYYY-MM-DD]-[topic-slug].md"
})
```

`intelligent_save` validerar YAML, skapar wikilinks, och bekräftar med användaren innan filen skrivs.

Efter save: `log_process_event({type: "lesson_planned", files: [<path>], depth: "draft"})` — så loggas planeringen i process-loggen för cross-cykel-spårning.

---

## Pre-save valideringschecklista

Innan `intelligent_save` anropas, kontrollera att planen uppfyller dessa minimumkrav.

**Innehåll (i prosa-bodyn):**

- [ ] Klafki-skiss explicit som prosa i body-sektion 1 (även om kort)
- [ ] Lärandemål specificerade (2–4 stycken) i body-sektion 2
- [ ] Group context och anticipated difficulties från Fas 0.5 — som prosa i body-sektion 4
- [ ] Block definierade med längd
- [ ] Total längd matchar tillgänglig tid (± 10%)
- [ ] Material listat
- [ ] Förberedelse-checklista inkluderad
- [ ] Plan B med minst 2 utmaningar (i body-sektion 7)

**Metadata:**

- [ ] YAML frontmatter komplett
- [ ] `type: lesson_plan` satt
- [ ] `created`, `date`, `metadata_version` specificerade (kursinstansen härleds från sökvägen)
- [ ] `tags` följer regler (lektionsplan + topic + course + nyckelbegrepp)
- [ ] `based_on` wikilinks om bygger på tidigare arbete
- [ ] `supports` refererar ILO-koder från Learning Objectives Register

**Evidens:**

- [ ] Om tidigare lektioner finns: refererad i `based_on`
- [ ] Om reflektioner finns: rekommendationer integrerade
- [ ] Om student-gap finns (teacher_insights): adresserade i plan
- [ ] Timing baserad på `planned_vs_actual` när data finns

**Kvalitet:**

- [ ] Klafki-frågorna besvarade i didaktisk skiss
- [ ] Lärandemål Klafki-testade (fångar det värda att lära?)
- [ ] Struktur flödar logiskt (intro → main → konsolidering)
- [ ] Kontingens för överrun
- [ ] Reflektion-frågor förberedda (för post-lesson)
- [ ] 3–5 formativa avläsningspunkter inplanerade

---

## Spänningar att hålla i pre-lesson

Fyra spänningar bör pre-lesson-prompten förhålla sig till. De är inte *problem som ska lösas* — de är *frågor som ska bäras vakna* genom planeringen.

### Klafki vs. specificerbart lärande

ILO finns kvar som operativ struktur. Men varje ILO testas mot frågan: *fångar denna det som är värt att lära, eller bara det som är lätt att mäta?* Den frågan är Klafkis bidrag.

Om svaret är "lätt att mäta" — överväg att låta ILO vara vagare, eller komplettera med kvalitativ avsikt utanför ILO-formatet.

### Alignment vs. desirable difficulties

Aktiviteten i blocken ska tjäna ILO, men inte vara ett enkelt verb-match. Aktiviteter får — bör — vara lite mer omvägsfulla än ILO-verbet antyder. Bjork: det som *känns* alignerat ger ofta sämst djuplärande.

### Process vs. innehåll

Conoles 7Cs på kursnivå är processteg. På lektionsnivå har vi liknande risk: *att gå igenom faserna* utan att fråga *vad just detta innehåll bär*. Klafki-testet i Fas 1 är skyddet.

### Learning analytics vs. lärarens omdöme

Pre-lessons mest aktiva spänning. Siemens & Long: data ger insikter, mönster, evidens. Selwyn: learning analytics förskjuter omdömet från läraren till systemet, och fångar bara det mätbara.

I pre-lesson blir spänningen konkret. AUTO presenterar mönsterpåminnelser. Teacher_insights surfar elevdata-mönster. ILO-registret strukturerar lärandemål. Allt detta är *learning analytics* i en mening — och allt har en risk att förskjuta omdömet.

**Hur hanteras spänningen i pre-lesson?**

- *Data presenteras, ej automatiseras.* AUTO och teacher_insights *visar* mönster — läraren tolkar, väljer, prioriterar.
- *Klafki-test före varje ILO.* "Fångar denna det värda att lära, eller bara det lätt mätbara?" är frågan som motvikt.
- *Konstruktiv pushback åt båda håll.* Methodology kan invända ("teacher_insights säger X — adressera vi det?") men accepterar lärarens "nej, jag prioriterar Y" utan vidare diskussion.
- *Teacher-facing, ej administrator-facing.* AUTO och insights tjänar lärarens egen reflektion, inte yttre granskning. Det är en arkitektonisk gränsdragning, inte en stilfråga.

Skillnaden mot Selwyns kritik är inte *metod* utan *politik*. Institutionell LA flyttar omdömet från läraren till systemet. Teaching Suite flyttar det inte alls — datan tjänar lärarens egen reflektion. Spänningen hålls inte genom att förneka att vi använder analytics, utan genom att kontinuerligt fråga: *gör detta lärarens omdöme skarpare eller överflödigt?*

---

## GDPR

| Datatyp | Var hanteras |
|---|---|
| Lärarens egna anteckningar och planer | Kursmappen (Teaching Suite) — OK |
| Aggregerade `teacher_insights` från Assessment_suite | Kursmappen (Teaching Suite) — OK |
| Studentprestationsdata, individuella elevsvar | Assessment_suite workspace — **får ej röras av Teaching Suite** |
| Frånvaro, gruppdynamik, individuella elevobservationer | Lärarens egna anteckningar utanför MCP, tills lokala modeller finns |
| Citat från elever i reflektioner | Aggregerad nivå, inte individuell — content-scanner flaggar mönster |

**Princip:** *separation by workspace*. Teaching Suite arbetar mot `/Nextcloud/Courses/`, Assessment_suite mot `/Nextcloud/Assessment/`. Endast aggregerade insikter flödar.

---

## Tools som används

| Tool | Roll i pre-lesson |
|---|---|
| `load_methodology` | Laddar detta dokument vid trigger |
| `find_context` | Söker post-lesson AUTO, reflektioner, lektioner, idéer, teacher_insights, course revision per topic + course |
| `file_search` | Bredare sökning över workspace |
| `file_read` | Läser hittade filer (planer, reflektioner, kursplan) |
| `parse_lesson_plan_yaml` | Läser frontmatter ur befintliga planer |
| `intelligent_save` | Sparar slutlig plan med YAML-validering |
| `log_process_event` | Loggar `lesson_planned`-event efter save |
| `capture_idea` | Spontana idéer under lektion (lesson-momentet) |

**Inte aktivt än, men förväntat på sikt:**

- Manifest-curator (för Fas 2H — Profession → Lektion-bryggan)
- Cross-MCP query mot Assessment_suite om `find_context` inte räcker

---

## Integration med andra processer

### Post-lesson reflektion → nästa pre-lesson

Lektionscykelns kärna. Pre-lessonens lektionsplan blir referenspunkt för post-lesson AUTO (jämförelse plan vs utfall) och för REFL (lärarens reflektion). AUTO-output och carry-forward från REFL blir Fas 2A i nästa pre-lesson.

### Capture idea → pre-lesson

Idéer fångade utanför pre-lesson-fasen (exempelvis under en lektion eller i en bok) hittas via Fas 2F. När en idé används: uppdatera dess status (`status: implemented`, `implemented_in: <plan-path>`).

### Kursrevision → pre-lesson

Föregående upplagas revision (`course_revision`-dokument) hittas via Fas 2E. Drift-mönster, återkommande svåra begrepp, och alignment-rapport från AUTO matar nuvarande planering.

### Track_goal — pågående pedagogiska mål

Om läraren har explicita mål — exempelvis *"Fokusera på SRL i vår"* eller *"Pröva mer dialog-format denna termin"* — drar pre-lesson dessa.

**Under planeringen:**

> *"Du har målet om SRL-fokus i vår. Ska vi lägga till metakognitiva frågor i diskussionen — t.ex. 'Hur lärde ni er detta bäst?'"*

**I lektionsplanens YAML:**

```yaml
goals_supported:
  - srl_metakognition
  - dialog_format
goal_realization:
  - "Metakognitiva frågor i diskussion (Block 4)"
  - "Studenter reflekterar över sin egen förståelse"
```

Mål är inte ILO. ILO är *vad eleven ska kunna*; mål är *hur jag som lärare utvecklas över tid*. De kan rimma men inte alltid.

### Manifest → pre-lesson (vision)

När manifest v1 finns: Fas 2H aktiveras. Manifestet ska påverka *vilket* innehåll som lyfts (Klafki Exemplarische), inte *hur* det undervisas (det är operativt).

---

## Edge cases

### Första gången topic undervisas

Inga reflektioner, inga tidigare planer. Methodology fallback:

- Hoppa över 2A, 2B, 2C, 2E
- Bygg på 2D (kursplan/ILO), 2F (idéer), 2G (teacher_insights om något finns)
- Klafki-skissen blir *primär* — den ersätter saknad historik

Methodology säger:

> *"Jag hittade inga tidigare lektioner om [topic] i [course]. Då bygger vi från: kursplanens lärandemål, Klafki-skissen, och pedagogiska principer. Vill du att jag söker i andra kurser för idéer?"*

### Motstridiga rekommendationer

Två tidigare reflektioner ger olika råd. Fråga läraren:

> *"Reflektionen från år X säger A, från år Y säger B. Möjliga förklaringar: olika klasser, olika fokus. Vad prioriterar du för denna grupp?"*

Princip: presentera konflikten, låt läraren välja.

### Överpackad plan

Total tid > tillgänglig tid. Methodology flaggar:

> *"Planerat innehåll: X min. Tillgänglig: Y min. Överskrider med Z min. Alternativ:*
> *A) Utöka till två lektioner*
> *B) Prioritera: vad är MUST vs NICE to have?*
> *C) Förkorta block (riskerar rusha)"*

Hjälp läraren prioritera via Klafki-Sachstruktur (vad är centrum?) — inte via Bloom (vad är "lägre" nivå?).

### Saknad kursplan / ILO-register

Om `_config/learning_objectives.yaml` saknas eller är ofullständigt:

- Fråga läraren ange ILO manuellt för denna lektion
- Notera i YAML: `learning_objectives_source: "manual"`
- Föreslå att uppdatera ILO-registret som separat steg

### Carry-forward saknas

Antingen första cykel-lektion, eller läraren skrev ingen carry-forward i förra reflektionen. Methodology går till 2B utan att flagga som problem — detta är normalt.

---

## Kvalitetskriterier

### En bra pre-lesson plan har:

**Didaktisk grund:**

- Klafki-skiss explicit (inte bara implicit "förstå fotosyntes")
- Exemplaritet identifierad — vad detta innehåll *står för*
- Zugänglichkeit medveten — vald ingång för just dessa elever

**Lärandemål:**

- Specifika och formulerade (inte "förstå X")
- Bloom-verb eller UbD-facet, inte vag verb-soppa
- Klafki-testade — det värda att lära, inte bara det lätt mätbara
- Refererar ILO i `_config/learning_objectives.yaml` (om finns)

**Evidensbaserad struktur:**

- Bygger på reflektioner, idéer, kursrevision, teacher_insights — *aldrig från scratch*
- Timing baserad på `planned_vs_actual` från historik
- Anticipated difficulties från Fas 0.5

**Realistisk timing:**

- Buffer (10–15%) för diskussion och frågor
- Rädsla för överrun, inte underrun
- Plan B framme

**Strukturerad output:**

- YAML frontmatter komplett
- Wikilinks till källor (`based_on`)
- ILO-koppling (`supports`)
- Markdown-body läsbar utan YAML

**Formativ avläsning planerad:**

- 3–5 inplanerade frågor
- Exit ticket eller motsvarande
- Lärarens egen plan: *hur märker jag att de lär sig?*

### En dålig pre-lesson plan har:

**Vag didaktisk grund:**

- Ingen Klafki-skiss — bara *"vi ska gå igenom fotosyntes"*
- Ingen exemplaritet identifierad — vad detta innehåll *står för* är otydligt
- Zugänglichkeit oöverlagd — ingen vald ingång för dessa elever

**Vaga lärandemål:**

- *"Studenterna ska förstå fotosyntes"* (ingen mätbarhet)
- Ingen Klafki-test — fångar bara det lätt mätbara
- Inte refererad till `_config/learning_objectives.yaml`

**Ingen evidensgrund:**

- Ej baserad på reflektioner — *startar från scratch*
- Ignorerar tidigare lärdomar
- Ingen carry-forward

**Orealistisk timing:**

- Ingen buffer för diskussion
- Ignorerar historiska överrun
- Överpackat innehåll

**Inga kopplingar:**

- Inga wikilinks
- Ingen referens till kursplan eller ILO
- Isolerad från andra lektioner

**Ingen förberedelseplan:**

- Material ej listat
- Antar att allt är redo
- Ingen kontingens (plan B)

---

## Output-exempel (kort)

```yaml
---
type: lesson_plan
created: 2026-04-26T14:30:00Z
date: 2026-09-22
tags: [lektionsplan, fotosyntes, kurs101]
status: draft
metadata_version: 1
based_on:
  - "[[Reflections/lektion_14_immunförsvaret]]"
  - "[[Lesson_Plans/2025-09-15-fotosyntes]]"
supports:
  - KURS101.04.fotosyntes.ljusreaktion
  - KURS101.04.fotosyntes.morkerreaktion
provenance: pre_lesson_planning_v3
formative_checks:
  - "Efter ljusreaktion: 'var kommer ATP ifrån?'"
  - "Exit ticket: rita ATP-bildning i 3 steg"
plan_b:
  - utmaning: "ljusreaktion-blocket >30 min"
    åtgärd: "korta C4 till 5 min, fortsätt diskutera"
goals_supported:
  - srl_metakognition
blocks:
  - name: "Introduktion"
    duration: 10
    activity: "Aktivera förkunskaper på whiteboard"
    formative: "Vilka begrepp dyker upp spontant?"
  - name: "Ljusreaktion"
    duration: 25
    activity: "Solpanel-analogi + thylakoiden i detalj"
    formative: "Fråga: var kommer ATP ifrån?"
  # ...
materials:
  - "Whiteboard, 3 färger"
  - "C3/C4 bildexempel"
---

## Biologi — 10:00–11:00 — sal B2

> Tid och rum står i H2-raden, inte som YAML-fält. Kursinstans härleds från sökvägen.

## Lektionens didaktiska kärna (Klafki)

Fotosyntes som exempel på energiomvandling. Eleven möter principen att energi konserveras men förändrar form — vilket öppnar termodynamik, ekologi, och evolution. Klimatfrågan ger *Gegenwartsbedeutung*; systemtänkandet ger *Zukunftsbedeutung*. Kärnstrukturen är ljus → ATP → glukos. Solpanel-analogin är vald ingång baserat på vad som fungerat förr.

## Lärandemål

[...]

## Group context & anticipated difficulties

**Vad jag vet om gruppen just nu:** ett par elever frånvarande senaste lektionen, klimatfrågan väckt intresse efter förra veckans diskussion.

**Vad jag förväntar mig blir svårt:** mörkerreaktion brukar förvirra (Quiz 2 förra året: 58 %); C4 är nytt och osäker reaktion.

[...]
```

---

## Bibliotek — prompts & frågor

Återkommande dialog-frågor i pre-lesson, kategoriserade. Methodology kan välja från detta bibliotek baserat på fas och kontext.

### Inledande frågor

- *"Vad är det viktigaste eleverna ska kunna efter denna lektion?"*
- *"Vill du bygga på tidigare struktur eller pröva något nytt?"*
- *"Finns det något specifikt du vill testa denna gång?"*

### Frågor om gruppen (Fas 0.5)

- *"Vad vet du om gruppen just nu — förförståelse, förra lektionens efterdyningar, känslor du noterat?"*
- *"Är det något särskilt med gruppen som jag bör veta — lugnt, oroligt, splittrat?"*
- *"Finns det en specifik elev eller grupp som behöver extra hänsyn?"*

### Anticipatory reflection-frågor (Fas 0.5)

- *"Innan vi söker — vad förväntar du dig blir svårt här?"*
- *"Vilka frågor tror du kan komma?"*
- *"Var brukar det fastna med detta innehåll?"*
- *"Finns det vanliga missuppfattningar du vill möta?"*

### Klafki-frågor (Fas 1)

- *"Vad står [topic] för i ämnet? Vad allmänt kan läras genom just detta?"* (Exemplarische)
- *"Vad betyder detta för eleverna nu — i deras nuvarande förståelse, deras liv?"* (Gegenwart)
- *"Vad kommer detta att betyda för dem på sikt?"* (Zukunft)
- *"Vad är centrum i innehållet? Vad förutsätter vad?"* (Sachstruktur)
- *"Hur kan detta göras tillgängligt för just dessa elever?"* (Zugänglichkeit)

### Kontextvalidering

- *"Jag hittade [N] tidigare lektioner om [topic]. Vill du se vad som fungerade?"*
- *"Reflektionen från [datum] rekommenderade [X]. Ska vi använda det?"*
- *"Kursplanen säger [X]. Stämmer det med din plan?"*
- *"Teacher_insights visar att [Y] varit svårt. Adressera vi det?"*

### Förfiningsfrågor

- *"Känns 60 min realistiskt eller behöver du mer tid?"*
- *"Vad är absolut must-have vs nice-to-have?"*
- *"Om vi bara har tid för EN sak, vad är viktigast?"*
- *"Vill du justera strukturen?"*

### Kritiska frågor / pushback

- *"Detta block har historiskt tagit X min. Har du en plan för att korta ner?"*
- *"Eleverna har svårt med [Y] enligt teacher_insights. Hur adresserar vi det?"*
- *"Förra gången rusade du genom [Z]. Vad gör vi annorlunda nu?"*
- *"ILO säger 'analysera' men aktiviteten testar mest minne. Är det medvetet?"*
- *"Klafki-Exemplaritet — fångar dina lärandemål det värda att lära, eller bara det mätbara?"*

### Avslutande frågor

- *"Vad behöver du förbereda innan lektionen?"*
- *"Vad vill du observera under lektionen?"*
- *"Vilka 3–5 formativa avläsningspunkter har vi planerat?"*
- *"Känner du dig redo, eller behöver vi justera något?"*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — överliggande arkitektur, tre cykler, spänningar
- **`post_lesson_auto.md`** — AUTO-fasen som matar nästa pre-lesson (Fas 2A)
- **`post_lesson_refl.md`** — REFL-fasen, varifrån carry-forward kommer (Fas 2A)
- **`bridge.md`** — Korthagens ALACT, *vad bär du med dig in?*
- **`_config/learning_objectives.yaml`** — Learning Objectives Register, single source of truth för ILO

---

## Versionsanmärkning

**v3.0.1** — 2026-05-03 — YAML-rensning.

Sjutton fält togs bort från lektionsplanens YAML-rubrik efter att en konkret jämförelse mellan två v3.0-utfall (lektionsplan_v18_tors 2026-04-30 och lektionsplan_v19_mon 2026-05-04) visade ~44 % dödvikt — fält utan reell läsare, eller fält som var dubbel bokföring av prosa som redan stod i body.

**Borttagna fält och motiv:**

- `day`, `week`, `duration`: härledbara från `date` respektive block-summan
- `time`, `room`: står redan synligt i markdown-H2-raden
- `course_instance`: härleds från sökvägen (`/Nextcloud/Courses/<course>/...`)
- `type_of_lesson`: vag taxonomi som ingen söker på
- `framework`: skulle möjliggöra filter "lektioner med Klafki-grund" — ingen söker så
- `didactic_skiss` med fem underfält (`exemplariskt`, `gegenwart`, `zukunft`, `sachstruktur`, `zugänglighet`): står ordagrant som prosa i body-sektion 1 ("Lektionens didaktiska kärna")
- `group_context`: står som prosa i body-sektion 4
- `anticipated_difficulties`: står som prosa i body-sektion 4
- `plats_for_falt.matchar_idag`: är en motivering, inte data — hör hemma i prosa
- `revisionsnotering`: en mening om hur filen kom till — hör hemma i body, inte YAML

**Princip som fastställdes:** YAML är inte en parallell maskin-läsbar kopia av lektionsplanen. Den ska bara innehålla fält som har en *reell läsare utöver lärarens egna ögon* — MCP-sök, andra MCP-servrar, eller framtida cross-lesson-spår. Allt didaktiskt tänkande hör hemma i prosa-bodyn där läraren faktiskt läser det söndag kväll och måndag morgon.

Detta är konkret operationalisering av feedback "teacher-centered not system-centered". Drift-fält som dök upp i 2026-05-04-planen (`plats_for_falt`, `uppgifter`, `material_falt`, `material_sal`) har inte rörts i denna rensning — de hanteras separat när användaren beslutar om dem.

---

**v3.0** — 2026-04-26.

**Teoretisk grund (ny):** Klafki + Wiggins & McTighe (UbD) + Conway + Black & Wiliam.

**Process-utvidgningar (nya):**

- Fas 0.5 — två frågor till läraren innan systemsökning: *vad vet du om gruppen* + anticipatory reflection (Conway 2001)
- Fas 1 — Klafkis didaktiska analys som strukturell utgångspunkt
- Fas 2A — explicit splittring i Post-lesson AUTO (systemets observationer) och REFL carry-forward (lärarens röst)
- Fas 2H — manifestreferens (placeholder, aktiveras när manifest v1 finns)
- Fas 2I — explicit syntes-steg innan backward design

**Spänningar (fyra):**

- Klafki vs. specificerbart lärande
- Alignment vs. desirable difficulties
- Process vs. innehåll
- Learning analytics vs. lärarens omdöme — pre-lessons mest aktiva spänning. Inte en *metod*-spänning utan en *politisk*. AUTO och teacher_insights *är* learning analytics — men teacher-facing, inte administrator-facing.

**Operativ rikedom (bevarad från v2.0):**

- Fas 2A–2H context gathering (Post-lesson AUTO + REFL, lektioner, reflektioner, ILO, kursrevision, idéer, teacher_insights)
- Iterativ förfining genom dialog med konstruktiv pushback
- Tag-genereringsregler
- 10-sektioners markdown body-struktur
- Pre-save valideringschecklista
- Bibliotek av prompts & frågor
- Edge cases (första gång, motstridiga, överpackad, saknad kursplan, saknad carry-forward)
- En bra / en dålig pre-lesson plan
- Track_goal-integration
- Lesson-momentet integrerat i Fas 5 ("MCP tystnar")

**Borttaget från v2.0 (medvetet):**

- Vygotsky-konstruktivism som primär grund — Klafki tar dess plats
- Hattie effect sizes — passar inte arkitekturens grundprincip; evidensargumentet ersätts av historikbaserad reflektion
- Ericsson deliberate practice — inte direkt pedagogiskt-didaktisk, hör hemma i professionscykeln om alls
- Zimmerman SRL — kvar som potentiellt mål via track_goal, inte som metaramverk
- SMART-acronymen — ersätts av Klafki-test + UbD facets + Bloom-verb (val per fall)

