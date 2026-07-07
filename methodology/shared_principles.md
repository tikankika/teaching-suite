# Shared Principles

**Version:** 0.5  
**Status:** Foundation document — lesson cycle (mognar; teori under fortsatt revision)  
**Created:** 2026-01-28  
**Updated:** 2026-06-03  
**Author:** Niklas Karlsson + Claude Desktop  
**Read By:** All lesson-cycle processes — `pre_lesson`, `post_lesson_auto`, `post_lesson_refl`

---

## LÄSANVISNING

**Detta dokument beskriver de grundläggande principerna för hela lesson-cykeln.**

Dessa principer gäller för alla processer i cykeln:
- `pre_lesson` (planering FÖRE lektion)
- `post_lesson_auto` (automatisk pipeline efter varje lektion — A1 Content, A2 Recap, Auto-log)
- `post_lesson_refl` (Gibbs-reflektion, manuell, triggas separat)

För process-specifik vägledning, läs:
- `lesson/pre_lesson.md` (bara för planering)
- `lesson/post_lesson_auto.md` (automatiska post-lesson-outputs)
- `lesson/post_lesson_refl.md` (Gibbs, reflektion som konsumerar auto-log + A1)

---

## FILOSOFI: Lektionscykeln

### Grundkonceptet

```
┌─────────────────────────────────────────────────────────┐
│                   LEKTIONSCYKELN                        │
│                                                         │
│  1. PLAN                                                │
│     ├─ Baserat på tidigare reflektioner                │
│     ├─ Informerat av studentfeedback                    │
│     └─ Aldrig från scratch                              │
│                                                         │
│  2. TEACH                                               │
│     └─ Lektionen sker (dokumenteras via transkription) │
│                                                         │
│  3. REFLECT                                             │
│     ├─ Vad planerades vs vad hände?                     │
│     ├─ Vad fungerade? Vad missades?                     │
│     └─ Lärdomar för nästa gång                          │
│                                                         │
│  4. REPEAT                                              │
│     └─ Nästa plan använder denna reflektion ──┐         │
│                                                ↓        │
└────────────────────────────────────────────────┘        │
         ↑                                                 │
         └─────────────────────────────────────────────────┘
```

**Nyckelinsikt:** Det är en CYKEL, inte en linjär process.
- Varje plan bygger på tidigare reflektioner
- Varje reflektion informerar nästa plan
- Kontinuerlig förbättring över tid

---

## KÄRNPRINCIPER

### P1: Aldrig Börja Från Scratch

> "Varje lektion bygger på vad vi lärt oss tidigare"

**Betyder:**
- ALLTID söka efter tidigare lektioner om samma ämne
- ALLTID läsa reflektioner från tidigare försök
- ALLTID koppla till övergripande kursplanering
- ALLTID bygga vidare på fungerande metoder

**Betyder INTE:**
- Kopiera gamla lektionsplaner rakt av
- Ignorera nya insikter från forskning
- Hindra experimentation och nytänkande

**I praktiken:**
```
Dålig planering:
  "Idag ska jag undervisa fotosyntes"
  → Öppnar tomt dokument
  → Skriver från minnet
  → Missar vad som fungerade förra gången

Bra planering:
  "Idag ska jag planera fotosyntes"
  → Söker: tidigare lektioner om fotosyntes
  → Läser: reflektion från 2025-09-15
  → Ser: "Ljusreaktionen var svår, behöver mer tid och analogi"
  → Planerar: 20 min för ljusreaktion, solpanel-analogi
```

---

### P2: Evidensbaserad, Inte Antagande-Baserad

> "Basera beslut på vad data visar, inte vad vi antar"

**Evidens kommer från:**
- **Studentfeedback:** Utvärderingar, kommentarer, frågor
- **Transkriptioner:** Vad tog längre tid? Vad väckte diskussion?
- **Bedömningar:** Vilka frågor var svåra? Var går gränsen?
- **Reflektioner:** Vad noterade jag själv direkt efter lektionen?
- **Teoretiskt ramverk:** Vad säger forskningen?

**Evidens kommer INTE från:**
- Magkänsla utan grund
- "Jag tror att..."
- Generella antaganden om "alla studenter"
- Vad som "borde" fungera teoretiskt

**I praktiken:**
```
Antagande-baserat:
  "Studenterna verkar ointresserade av cellbiologi"
  → Baserat på: känsla, några som tittade på telefonen
  → Åtgärd: Hoppa över detaljer, gå snabbt igenom

Evidensbaserat:
  "Studenterna hade svårt med cellbiologi-frågan på duggan (40 % rätt)"
  → Baserat på: faktiskt resultat
  → Åtgärd: Mer tid på cellbiologi, nya förklaringar, mer övning
```

---

### P3: Student-Centered, Inte Teacher-Centered

> "Utgå från studenternas behov, inte vad som är bekvämt för läraren"

**Betyder:**
- Vad behöver STUDENTERNA lära sig? (inte: vad vill jag hinna med?)
- Vilka svårigheter HAR studenterna? (inte: vad antar jag är svårt?)
- Hur lär STUDENTERNA bäst? (inte: hur lärde jag mig själv?)

**I praktiken:**
```
Teacher-centered:
  "Jag ska hinna gå igenom kapitel 3-5 idag"
  → Fokus: täcka stoff
  → Risk: Studenterna hänger inte med

Student-centered:
  "Studenterna hade svårt med protein-syntes (dugga), vad behöver de?"
  → Fokus: faktiskt lärande
  → Åtgärd: Långsammare tempo, mer övning på protein-syntes
```

---

### P4: Iterativ Förbättring, Inte Perfektion

> "Varje lektion är bättre än förra, inte perfekt"

**Betyder:**
- Små förbättringar varje gång
- Lära av misstag istället för att dölja dem
- Dokumentera vad som INTE funkade (lika viktigt som vad som funkade)
- Acceptera att första försöket kan vara rörigt

**Betyder INTE:**
- Ge upp vid första motgången
- "Det var bra nog" utan reflektion
- Upprepa samma misstag varje år

**I praktiken:**
```
Perfektionism:
  Lektion funkade inte perfekt
  → "Jag är dålig på att lära ut detta"
  → Undviker ämnet framöver

Iterativ förbättring:
  Lektion funkade inte perfekt
  → "Vad exakt gick fel? Vad kan jag ändra?"
  → Nästa gång: justerar det specifika
  → Dokumenterar förbättringen
```

---

### P5: Transparent Dokumentation

> "Skriv så att framtida-jag (eller en kollega) förstår VARFÖR"

**Dokumentera:**
- **Beslut:** Varför valde jag denna struktur?
- **Antaganden:** Vad förutsätter jag att studenterna kan?
- **Risker:** Vad kan gå fel? Hur förebygger jag det?
- **Alternativ:** Vad övervägde jag men valde bort?

**I praktiken:**
```
Dålig dokumentation:
  # Lektionsplan: Fotosyntes
  - Intro (5 min)
  - Ljusreaktion (15 min)
  - Mörkerreaktion (15 min)
  - Sammanfattning (5 min)
  
  → Framtida-jag vet inte VARFÖR 15 min för ljusreaktion

Bra dokumentation:
  # Lektionsplan: Fotosyntes
  
  ## Baserat på:
  - Reflektion 2025-09-15: Ljusreaktionen var svår för studenter
  - Idé: Solpanel-analogi (2025-10-02)
  
  ## Struktur:
  - Intro (5 min)
  - Ljusreaktion (15 min) ← EXTRA TID pga tidigare svårigheter
  - Mörkerreaktion (15 min)
  - Sammanfattning (5 min)
  
  → Framtida-jag förstår VARFÖR
```

---

## RELATION MELLAN PLAN OCH REFLEKTION

### Plan → Teach → Reflect → Plan

**Planering använder:**
```yaml
Inputs till planering:
  - Tidigare reflektioner (vad fungerade/inte?)
  - Kursplanering (övergripande mål)
  - Curriculum (vad ska täckas?)
  - Idéer (sparade förslag)
  - Studentfeedback (vad behöver de?)
```

**Reflektion skapar:**
```yaml
Outputs från reflektion:
  - Vad funkade? (bevara till nästa gång)
  - Vad funkade inte? (ändra till nästa gång)
  - Vad lärde jag mig? (ny insikt)
  - Vad ska jag göra annorlunda? (konkret åtgärd)
```

**Cykeln:**
```
Reflektion från lektion N
  ↓ (input)
Planering för lektion N+1
  ↓ (guidar)
Lektion N+1 (sker)
  ↓ (dokumenteras)
Reflektion från lektion N+1
  ↓ (input)
Planering för lektion N+2
  ...
```

---

## POST-LESSON: Två Processer, Inte En

**Beslutat 2026-04-22.**

Efter varje lektion finns **två separata processer**, inte en:

### `post_lesson_auto` — automatisk pipeline

Triggas automatiskt när transkript + plan finns. Producerar tre outputs:

| Output | Mottagare | Syfte |
|--------|-----------|-------|
| **A1 Content** | Elever + AI-gems + prov + lärare (nästa lektion) | Rik faktabild av vad som togs upp |
| **A2 Recap** | Elever | Kort berättelse + uppgifter från planens YAML |
| **Auto-log B** | Lärare, internt | Plan vs faktisk, datakvalitet, carry-forward-kandidater |

Se `lesson/post_lesson_auto.md` för detaljer.

### `post_lesson_refl` — manuell Gibbs-reflektion

Triggas **manuellt** av läraren när djup meningsskapande behövs — t.ex. vid omdöme-tid, efter överraskande lektion, eller när mönster över flera lektioner ska analyseras. Den är **inte** en del av varje-lektion-flödet.

Gibbs-processen läser auto-log + A1 Content som primära inputs — den **tolkar** den fakta som auto-pipelinen redan extraherat, den extraherar inte själv.

Se `lesson/post_lesson_refl.md`.

### Hårda regler

- **A1 Content kräver transkript.** Genereras aldrig utan. Vid saknat transkript: A2 kan produceras från planens YAML, Auto-log blir tunn (endast om lärar-notering finns).
- **Källa till uppgifter/läxor = planens YAML primärt.** Transkript-extraktion är sekundär källa för spontana uppgifter. Varje uppgift taggas med ursprung (`plan_yaml` / `transcript_only` / `both`).
- **Gibbs är aldrig automatisk.** Läraren väljer att reflektera.
- **Alla auto-outputs får `status: draft`.** Inget delas med elever utan lärargranskning.

### Varför två processer, inte en

Extraktion (auto-pipeline) och tolkning (Gibbs) är kategoriskt olika kognitiva handlingar:

- Auto-pipeline = "vad hände" (data, timing, begrepp, uppgifter — mekaniskt)
- Gibbs = "vad betyder det" (meningsskapande, känslor, pedagogiska beslut — manuellt)

Att bunta ihop dem skulle tvinga läraren genom hela pipelinen varje gång, och skulle blurra att de är olika saker. Separeringen respekterar `Teacher THINKS, MCP STRUCTURES`-principen från `docs/ARCHITECTURE.md`.

---

## MINNESHANTERING: Hur Systemet Stödjer Cykeln

### Problem: Mänskligt minne är begränsat

Som lärare håller du många bollar i luften:
- Flera kurser
- Hundratals studenter
- Årliga repetitioner av samma ämnen
- Nya insikter och forskning

**Vad glöms lätt bort:**
- Detaljer från förra årets lektion
- Specifika svårigheter studenterna hade
- Idéer som dök upp för 3 månader sedan
- Vad du sa "jag ska göra annorlunda nästa gång"

### Lösning: Strukturerad Dokumentation + Sökning

**Systemet hjälper dig komma ihåg genom att:**

1. **Spara strukturerat** (inte bara fritext)
   ```yaml
   # Varje dokument har metadata
   ---
   type: reflection
   lesson: "[[2025-09-15-fotosyntes]]"
   tags: [fotosyntes, svårigheter, ljusreaktion]
   ---
   ```

2. **Länka samman** (wikilinks)
   ```markdown
   Baserat på [[Reflektion 2025-09-15]]
   Använder [[Idé: Solpanel-analogi]]
   ```

3. **Söka intelligent** (topic + course + date)
   - När du planerar fotosyntes 2026
   - Systemet hittar fotosyntes från tidigare kursomgångar...
   - Visar: vad fungerade, vad inte

4. **Sammanfatta** (lesson summaries)
   - Istället för 3 separata filer (plan, transkript, reflektion)
   - EN sammanfattning med essensen

---

## TEORETISK FÖRANKRING

> Se `pedagogisk_arkitektur.md` för djupare teoretisk grund

**Kort sammanfattning av teoretisk bas:**

| Teori | Princip | I lektionscykeln |
|-------|---------|------------------|
| **Constructivism** (Vygotsky) | Lärande byggs på tidigare kunskap | Aldrig från scratch, koppla nytt till gammalt |
| **Reflective Practice** (Schön) | Lära genom reflektion-i-handling | post_lesson_refl process |
| **Self-Regulated Learning** (Zimmerman) | Studenter lär sig att lära sig | Modellera planering och reflektion |
| **Evidence-Based Teaching** (Hattie) | Använd data för beslut | Basera planering på faktisk studentdata |
| **Deliberate Practice** (Ericsson) | Fokuserad övning med feedback | Iterativ förbättring av lektioner |

---

## ANVÄNDARENS ROLL: Du Är Fortfarande Läraren

### Vad Teaching Suite GÖR:

✅ **Samlar context:** Hittar relevanta tidigare lektioner, reflektioner, idéer  
✅ **Ställer frågor:** "Vad fungerade förra gången?" "Vad ska du fokusera på?"  
✅ **Föreslår struktur:** Baserat på tid och tidigare erfarenheter  
✅ **Sparar strukturerat:** YAML metadata, wikilinks, tags  

### Vad Teaching Suite INTE GÖR:

❌ **Fattar pedagogiska beslut** - Det gör DU  
❌ **Ersätter din expertis** - Det är ditt yrke  
❌ **Automatiserar undervisning** - Det är en guided process  

### Exempel: Guided Dialog

```
MCP: "Jag hittade din reflektion från 2025-09-15 där du skrev:
      'Ljusreaktionen var svår för studenterna. Behöver bättre analogi.'
      
      Vill du fokusera på ljusreaktionen denna gång?"

Du: "Ja, och jag har en idé om solpanel-analogi"

MCP: "Hur mycket tid vill du avsätta för ljusreaktionen?"

Du: "20 minuter, dubbelt mot förra gången"

MCP: "Ska jag inkludera solpanel-analogin i lektionsplanen?"

Du: "Ja, med ett konkret vardagsexempel"

MCP: [Skapar utkast baserat på dialog]
     "Här är ett förslag. Vill du justera något?"
```

**Nyckel:** Dialog, inte diktation. Du styr, MCP guidar.

---

## PRAKTISKA RIKTLINJER

### Innan Du Börjar en Process (plan eller reflect)

**Fråga dig själv:**
1. Vad är SYFTET med denna session?
   - Planera specifik lektion?
   - Reflektera över genomförd lektion?

2. Vilken KONTEXT behöver jag?
   - Tidigare lektioner om samma ämne?
   - Studentfeedback?
   - Kursplanens mål?

3. Hur mycket TID har jag?
   - 15 min snabb planering?
   - 45 min djup reflektion?

### Under Processen

**För planering:**
- Läs tidigare reflektioner FÖRST
- Identifiera vad som var svårt
- Planera specifikt för dessa svårigheter
- Länka till källor (wikilinks)

**För reflektion:**
- Jämför plan med verklighet
- Vad hände som var oväntat?
- Vad lärde du dig idag?
- Vad ska ändras nästa gång?

### Efter Processen

**Spara alltid:**
- Med metadata (YAML frontmatter)
- Med wikilinks till källor
- Med tags för sökning
- I rätt mapp (Lesson_Plans / Reflections)

---

## KVALITET ÖVER KVANTITET

### Bättre att:

✅ Reflektera kort men KONKRET över en lektion  
✅ Planera fokuserat för ETT svårt moment  
✅ Dokumentera EN tydlig lärdom  

### Än att:

❌ Skriva långa vaga reflektioner  
❌ Planera allt men inget i detalj  
❌ Dokumentera utan koppling till konkreta händelser  

### Exempel:

**Vag reflektion:**
> "Lektionen gick bra. Studenterna verkade intresserade."

**Konkret reflektion:**
> "Ljusreaktionen tog 22 min istället för planerade 15 min eftersom studenterna ställde många frågor om ATP-produktion. Bra frågor! Nästa gång: planera 22 min + förbered fler ATP-exempel."

---

## VANLIGA FALLGROPAR (och hur undvika dem)

### Fallgrop 1: "Jag har inget att reflektera över"

**Symptom:** Tomt dokument, "allt gick bra"

**Lösning:**
- Jämför plan med transkription (tidsskillnader?)
- Vilken fråga fick flest följdfrågor? (viktigt topic!)
- Vad hoppade du över pga tid? (justera nästa gång)

### Fallgrop 2: "Planering tar för lång tid"

**Symptom:** 2 timmar per lektionsplan

**Lösning:**
- Använd template baserad på tidigare fungerande lektioner
- Fokusera på VAD SOM ÄR NYTT/ANNORLUNDA
- Återanvänd material intelligent

### Fallgrop 3: "Jag hittar inte tidigare lektioner"

**Symptom:** Söker men hittar inget

**Lösning:**
- Använd MCP:s file_search (topic + course)
- Kolla tags (#fotosyntes #KURS101)
- Skapa lesson summaries för framtida sökning

### Fallgrop 4: "För mycket dokumentation"

**Symptom:** Överväldigad av filer och mappar

**Lösning:**
- Börja minimalt: bara lektionsplan + daglig reflektion
- Lägg till lesson summaries när du ser värdet
- Använd wikilinks istället för att duplicera info

---

## FRAMGÅNGSKRITERIER

### Du vet att systemet fungerar när:

✅ **Planering går snabbare** - Du hittar vad du behöver direkt  
✅ **Mindre repetition av misstag** - Du kommer ihåg vad som inte funkade  
✅ **Tydligare progression** - Du ser förbättring över tid  
✅ **Mer fokuserad undervisning** - Du vet vad studenterna behöver  
✅ **Mindre stress** - Du litar på att systemet kommer ihåg åt dig  

### Röda flaggor att systemet INTE fungerar:

🚩 **Planering tar längre tid** än innan - Systemet är för komplext  
🚩 **Du skippar reflektion** - Processen känns onödig  
🚩 **Du hittar aldrig tidigare material** - Sök/struktur funkar inte  
🚩 **Dokumenten är för långa** - Ingen läser dem  
🚩 **Du ignorerar systemet** - Det ger inget värde  

**Om röd flagga:** Förenkla, justera, fråga varför.

---

## NÄSTA STEG

Efter att ha läst detta dokument:

1. **Läs `pedagogisk_arkitektur.md`**
   - Tre-cykel-arkitekturen (lesson / course / profession)
   - Hur principer förankras i den övergripande modellen

2. **Läs process-specifik metodologi:**
   - För planering: `lesson/pre_lesson.md`
   - För reflektion: `lesson/post_lesson_refl.md`

3. **Börja använda:**
   - Planera en lektion
   - Reflektera över en lektion
   - Se hur cykeln fungerar i praktiken

---

**Detta dokument uppdateras baserat på erfarenhet.**

Förslag på förbättringar? Något oklart? Dokumentera i Issues eller diskutera i reflektion.

---

**Version History:**
- v0.5 (2026-06-03): Pre-public pass — fabricerat genomgående exempel (KURS101), v3-terminologi (lektionscykeln), stale mappnamn, status/version
- v0.1 (2026-01-28): Initial draft, foundation principles
