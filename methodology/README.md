---
type: exploration
status: draft
created: 2026-04-27T22:41:14
origin: desktop
project: Teaching Suite
---

# Användarguide — Teaching Suite methodology

*v3.0, 2026-04-27. Top-level operativ guide. Komplement till `pedagogisk_arkitektur.md` och de 12 cykel-specifika methodology-docen.*

---

## Vad detta dokument är

Detta är en **operativ guide** — för dig som ska *använda* Teaching Suite:s methodology i dagligt lärararbete. Det är inte arkitektur (det finns i `pedagogisk_arkitektur.md`) och inte cykel-specifik methodology (det finns i `lesson/`, `course/`, `profession/`-foldrarna).

Det här svarar på frågor som:

- *Vad är de bärande principerna jag ska komma ihåg?*
- *Vad är vanliga fallgropar och hur undviker jag dem?*
- *Hur vet jag om systemet fungerar för mig?*
- *Var skaver det? Vilka är begränsningarna?*

Läs detta först om du är ny. Återvänd när det skaver.

---

## Fem bärande principer

### P1: Aldrig från scratch

> *"Varje lektion bygger på vad vi lärt oss tidigare."*

**Betyder:**

- Söka tidigare lektioner om samma ämne
- Läsa reflektioner från tidigare försök
- Koppla till övergripande kursplanering
- Bygga vidare på fungerande metoder

**Betyder INTE:**

- Kopiera gamla lektionsplaner rakt av
- Ignorera nya insikter från forskning
- Hindra experimentation och nytänkande

**I praktiken:**

| Dåligt | Bra |
|---|---|
| *"Idag ska jag undervisa fotosyntes"* → öppnar tomt dokument | *"Idag ska jag planera fotosyntes"* → söker tidigare lektioner, läser reflektion från 2025-09-15, ser *"Ljusreaktionen var svår"*, planerar 30 min för ljusreaktion + solpanel-analogi |

I MCP-arkitektur: pre-lesson Fas 2 (Context gathering) gör detta arbete åt dig. Åtta substeg söker AUTO, REFL, lektioner, ILO, kursrevision, idéer, teacher_insights, manifest.

### P2: Evidensbaserad, inte antagande-baserad

> *"Basera beslut på vad data visar, inte vad vi antar."*

**Evidens kommer från:**

- Studentfeedback (utvärderingar, kommentarer, frågor)
- Transkriptioner (vad tog längre tid? vad väckte diskussion?)
- Bedömningar (vilka frågor var svåra? var går gränsen?)
- Reflektioner (vad noterade jag direkt efter?)
- Teoretiskt ramverk (vad säger forskningen?)

**Evidens kommer INTE från:**

- Magkänsla utan grund
- *"Jag tror att..."* utan stöd
- Generella antaganden om *"alla studenter"*
- Vad som *"borde"* fungera teoretiskt

**I praktiken:**

| Antagande-baserat | Evidens-baserat |
|---|---|
| *"Studenterna verkar ointresserade av cellbiologi"* (känsla) → Hoppa över detaljer | *"Studenterna hade svårt med cellbiologi-frågan på duggan (40% rätt)"* → Mer tid på cellbiologi, nya förklaringar |

### P3: Student-centered, inte teacher-centered

> *"Utgå från studenternas behov, inte vad som är bekvämt för läraren."*

**Betyder:**

- Vad behöver *studenterna* lära sig? (inte: vad vill jag hinna med?)
- Vilka svårigheter *har* studenterna? (inte: vad antar jag är svårt?)
- Hur lär *studenterna* bäst? (inte: hur lärde jag mig själv?)

**I praktiken:**

| Teacher-centered | Student-centered |
|---|---|
| *"Jag ska hinna gå igenom kapitel 3-5 idag"* → fokus på att täcka stoff | *"Studenterna hade svårt med protein-syntes (dugga). Vad behöver de?"* → fokus på faktiskt lärande |

### P4: Iterativ förbättring, inte perfektion

> *"Varje lektion är bättre än förra, inte perfekt."*

**Betyder:**

- Små förbättringar varje gång
- Lära av misstag istället för att dölja dem
- Dokumentera vad som *inte* funkade (lika viktigt som vad som funkade)
- Acceptera att första försöket kan vara rörigt

**Betyder INTE:**

- Ge upp vid första motgången
- *"Det var bra nog"* utan reflektion
- Upprepa samma misstag varje år

**I praktiken:**

| Perfektionism | Iterativ förbättring |
|---|---|
| Lektion funkade inte perfekt → *"Jag är dålig på detta"* → undviker ämnet | Lektion funkade inte perfekt → *"Vad exakt gick fel? Vad kan jag ändra?"* → nästa gång: justerar det specifika, dokumenterar förbättringen |

### P5: Transparent dokumentation

> *"Skriv så att framtida-jag (eller en kollega) förstår *varför*."*

**Dokumentera:**

- **Beslut:** Varför valde jag denna struktur?
- **Antaganden:** Vad förutsätter jag att studenterna kan?
- **Risker:** Vad kan gå fel? Hur förebygger jag det?
- **Alternativ:** Vad övervägde jag men valde bort?

**I praktiken:**

| Dålig dokumentation | Bra dokumentation |
|---|---|
| *"Lektionsplan: Fotosyntes — Intro 5, Ljusreaktion 15, Mörkerreaktion 15, Sammanfattning 5"* (utan motivering) | *"Baserat på reflektion 2025-09-15 (ljusreaktion svår). Idé: solpanel-analogi från 2025-10-02. Struktur: Intro 5 / Ljusreaktion 30 ← extra tid pga tidigare svårigheter / Mörkerreaktion 15 / Sammanfattning 5"* |

I MCP-arkitektur: alla outputs har YAML frontmatter med `based_on`, `provenance`, `framework` etc. Dokumentationen är *strukturerad first-class data*, inte fri prosa.

---

## Fyra vanliga fallgropar

### Fallgrop 1: *"Jag har inget att reflektera över"*

**Symptom:** Tomt dokument efter lektionen. *"Allt gick bra."*

**Lösning:**

- Jämför plan med transkription — finns tidsskillnader?
- Vilken fråga fick flest följdfrågor? (viktigt topic!)
- Vad hoppade du över pga tid? (justera nästa gång)
- Använd Rolfe-cadens (3–5 min, *What? So what? Now what?*) — kort räcker

### Fallgrop 2: *"Planering tar för lång tid"*

**Symptom:** 2 timmar per lektionsplan.

**Lösning:**

- Använd template baserad på tidigare fungerande lektioner
- Fokusera på *vad som är nytt eller annorlunda*
- Återanvänd material intelligent
- Pre-lesson Fas 2A drar carry-forward + AUTO-data — börja från det, inte från noll

### Fallgrop 3: *"Jag hittar inte tidigare lektioner"*

**Symptom:** Söker men hittar inget.

**Lösning:**

- Använd `find_context` med topic + course (inte fri-text-sök)
- Kolla tags (`#fotosyntes #KURS101`)
- Verifiera att tidigare reflektioner har YAML-frontmatter med rätt fält
- Om filer saknar metadata: skapa retroaktivt med `intelligent_save`

### Fallgrop 4: *"För mycket dokumentation"*

**Symptom:** Överväldigad av filer och mappar.

**Lösning:**

- Börja minimalt: bara lektionsplan + post-lesson REFL
- Lägg till fler aktiviteter (terminsreflektion, manifest, etc.) när du ser värdet
- Använd wikilinks istället för att duplicera info
- Methodology får inte vara byråkrati — om den blir det, förenkla

---

## Framgångskriterier

Du vet att systemet fungerar när:

- **Planering går snabbare** — du hittar vad du behöver direkt
- **Mindre repetition av misstag** — du kommer ihåg vad som inte funkade
- **Tydligare progression** — du ser förbättring över tid
- **Mer fokuserad undervisning** — du vet vad studenterna behöver
- **Mindre stress** — du litar på att systemet kommer ihåg åt dig
- **Manifestet utvecklas** — dina pedagogiska ställningstaganden artikuleras och prövas

## Röda flaggor

Systemet **inte** fungerar om:

- **Planering tar längre tid** än innan — systemet är för komplext
- **Du skippar reflektion** — processen känns onödig
- **Du hittar aldrig tidigare material** — sök/struktur funkar inte
- **Dokumenten är för långa** — ingen läser dem
- **Du ignorerar systemet** — det ger inget värde
- **Manifestet är aldrig öppnat** — det blir tom artefakt istället för axel

**Om röd flagga:** förenkla, justera, fråga varför. Methodology är till för att tjäna ditt arbete, inte tvärtom.

---

## Begränsningar med Teaching Cycle

Methodology är inte perfekt. Sex begränsningar att bära vakna:

### 1. Tidskostnad

**Risk:** Reflektion tar tid, lärare har begränsat med tid.

**Balans:** *Inte* 2h per lektion. *Utan* 3–5 min Rolfe efter daglig lektion + 15–20 min Gibbs en gång i veckan + 45–60 min terminsreflektion. Methodology:s strukturer ska göra det *snabbare*, inte långsammare.

### 2. Kräver disciplin

**Risk:** Lätt att hoppa över reflektion när stressad. Carry-forward som inte aktiveras blir död data.

**Stöd:** System ska göra det:
- Lätt (`intelligent_save` strukturerar åt dig)
- Värdefullt (nästa pre-lesson läser carry-forward direkt)
- Påminnande (Cowork-sessioner kan trigga reflektion)

### 3. Risk för över-standardisering

**Risk:** Methodology skapar templates som hämmar kreativitet. Gibbs-cykeln blir checkbox-övning.

**Motvikt:**
- YAML = struktur (konsistent)
- Body = frihet (kreativitet)
- Guided questions ≠ forced answers
- Du har alltid sista ordet — methodology guidar, dikterar inte

### 4. Evidens ≠ sanning

**Risk:** Att tolka kvantitativ data (hämtningsgrad, tidsdeviation) som *sanning* om vad som hände.

**Princip:** Använd evidens som *startpunkt för experiment*, inte *absolut sanning*. Effect sizes och hämtningsgrader är medelvärden — vad som fungerar i din klass kan skilja sig. Behåll professionellt omdöme.

### 5. Korrelation ≠ kausalitet

**Risk:** *"Hämtningsgraden förbättrades efter ändring X"* → man tror X orsakade förbättringen.

**Princip:** Methodology rapporterar samband (X korrelerar med Y), men *du* avgör om det är kausalt. Många variabler ändras mellan cykler — olika studenter, olika dagar, eget lärande. Inga slutsatser från enstaka cykler.

### 6. Self-bespeglande risk

**Risk:** Reflektion blir klagomål på elever, system, omständigheter — där läraren själv aldrig är medskaparen.

**Motvikt** (Moore 2004, Akbari 2007):
- Pusha mot konkretion (*"vad sa eleven?"* snarare än *"de var ointresserade"*)
- Pusha mot egen agency (*"vad gjorde jag som bidrog?"*)
- Variera prompter — methodology stelnar inte i mall
- Brookfields fyra lenser tvingar perspektivskifte

---

## Anti-mönster — undvik dessa

Från metadata-konventionen och post_lesson-arbete:

### Ändringar utan motivering

```yaml
# ❌ DÅLIGT
changes_from_previous:
  - what: "Ändra föreläsningen"
    # Saknar: why, data_source

# ✅ BRA
changes_from_previous:
  - what: "Föreläsning 15 → 10 min"
    why: "70% missade dendritens funktion trots 22 min"
    data_source: "Teacher_Insights.md Q2"
```

### Övermodiga påståenden

```yaml
# ❌ DÅLIGT
insights:
  problematic:
    - insight: "Eleverna förstod inte"
      confidence: HIGH  # baserat på vad?

# ✅ BRA
insights:
  problematic:
    - insight: "70% missade dendritens funktion"
      source: "Teacher_Insights.md Q2"
      confidence: HIGH  # kvantitativ assessment-data
```

### Saknad spårbarhet

```yaml
# ❌ DÅLIGT — förbättrad plan utan koppling till föregående
type: lesson_plan
topic: nervcellens signalöverföring
# Inget cycle_number, ingen based_on, inga changes

# ✅ BRA
type: lesson_plan
topic: nervcellens signalöverföring
based_on:
  - "[[Reflections/2026-10-06-nervcellen-reflection]]"
bridge_intentions:
  - carry_forward: "Korta inledningen till 8 min"
    intention: "Börja med fråga om klimat-nyheter (5 min)"
```

### Språk-blandning i metadata

```yaml
# ❌ DÅLIGT
topic: nerve cell signalling  # Engelska
tags: [lesson, nervcellen]    # Blandad

# ✅ BRA
topic: nervcellens signalöverföring  # Svenska
tags: [lektionsplan, nervcellen, kurs101]  # Type i engelska, topic i svenska
```

---

## Kvalitet över kvantitet

### Bättre att

- Reflektera *kort men konkret* över en lektion
- Planera *fokuserat* för ETT svårt moment
- Dokumentera *en* tydlig lärdom

### Än att

- Skriva långa vaga reflektioner
- Planera allt men inget i detalj
- Dokumentera utan koppling till konkreta händelser

### Exempel

**Vag reflektion:**

> *"Lektionen gick bra. Studenterna verkade intresserade."*

**Konkret reflektion:**

> *"Ljusreaktionen tog 25 min istället för planerade 15 min eftersom studenterna ställde många frågor om ATP-produktion. Bra frågor! Nästa gång: planera 25 min + förbered fler ATP-exempel."*

---

## Tre slags användning

Methodology stöder olika *intensitetsnivåer* — välj efter behov:

### Nivå 1 — Minimal (bare-bones)

- Pre-lesson: bara YAML-frontmatter + en sida text
- Post-lesson REFL: Rolfe (3–5 min)
- Manifest: tunn v1 (sju–tio satser)

Mer än ingenting, mindre än krävande. Bra startpunkt.

### Nivå 2 — Standard (rekommenderat)

- Pre-lesson: full backward design + Klafki-skiss
- Post-lesson AUTO + REFL (Rolfe daglig, Gibbs veckovis)
- Manifest reviderad terminsvis
- Kursrevision per upplaga

Det här är vad de 12 v3.0-docen är designade för.

### Nivå 3 — Forsknings-djup (avhandling, DBR)

- Allt ovan
- Plus djupanalys (07-extraktion: cross-reference + fyrfälts-format)
- Plus longitudinal metrics tracking
- Plus terminsreflektion med alla fyra Brookfield-lenser

Använd när det passar professionsutvecklingen, inte som default.

---

## Användarens roll — du är fortfarande läraren

### Vad Teaching Suite gör

- ✅ Samlar context (hittar relevanta tidigare lektioner, reflektioner, idéer)
- ✅ Ställer frågor (*"Vad fungerade förra gången?"*)
- ✅ Föreslår struktur (baserat på tid och tidigare erfarenheter)
- ✅ Sparar strukturerat (YAML metadata, wikilinks, tags)

### Vad Teaching Suite inte gör

- ❌ Fattar pedagogiska beslut — det gör DU
- ❌ Ersätter din expertis — det är ditt yrke
- ❌ Automatiserar undervisning — det är en *guided* process
- ❌ Skriver ditt manifest — det är din röst

### Exempel: guided dialog

```
MCP: "Jag hittade din reflektion från 2025-09-15 där du skrev:
      'Ljusreaktionen var svår för studenterna. Behöver bättre analogi.'
      
      Vill du fokusera på ljusreaktionen denna gång?"

Du: "Ja, och jag har en idé om solpanel-analogi."

MCP: "Hur mycket tid vill du avsätta för ljusreaktionen?"

Du: "20 minuter, dubbelt mot förra gången."

MCP: "Ska jag inkludera solpanel-analogin i lektionsplanen?"

Du: "Ja, med konkret exempel från hustaket."

MCP: [Skapar utkast baserat på dialog]
     "Här är ett förslag. Vill du justera något?"
```

**Princip:** dialog, inte diktation. Du styr, MCP guidar.

---

## Var börjar jag?

### Om du är ny till methodology

1. Läs detta dokument — du är här ✓
2. Läs `pedagogisk_arkitektur.md` — för att förstå arkitekturen
3. Börja med *en* doc som passar din nuvarande aktivitet:
   - Ska planera nästa lektion → `lesson/pre_lesson.md`
   - Reflektera över genomförd lektion → `lesson/post_lesson_refl.md`
   - Designa ny kurs → `course/pre_course.md` + `course/design.md`
   - Avsluta termin → `profession/term_reflection.md`
   - Skriva manifest v1 → `profession/manifest.md`

### Om du har varit med v0.x

V3.0 är ny grund — Klafki + UbD + Conway + Black & Wiliam ersätter Vygotsky + Hattie + Ericsson (deliberate practice) + Zimmerman. Operativt liknar mycket men teoretisk grund är annan. (Ericsson & Simons verbalprotokoll, citerad i `lesson/post_lesson_auto.md`, är en annan del av samma författarskap och används fortsatt.)

v3.0:s `lesson/pre_lesson.md` ersätter den tidigare planeringsdoc:en — operativt liknande, men med ny teoretisk grund.

### Om något skaver

- Är det fallgrop 1–4? Se sektionen ovan
- Är det en begränsning som signaleras? Det är OK, methodology är inte perfekt
- Är det en röd flagga? Förenkla, justera, fråga varför

Methodology är till för att tjäna ditt arbete. När det inte gör det — använd inte den biten.

---

## Relaterade dokument

Mognadsnivå anges per dokument: **Stabil** (referensmaterial, satt), **Arbetsutkast** (omfattande och i dagligt bruk, teori under revision), **Tidigt utkast** (spec eller skiss, ännu inte operativ).

- **`pedagogisk_arkitektur.md`** — arkitekturen, tre cykler, fem spänningar · *Arbetsutkast*
- **`lesson/pre_lesson.md`, `post_lesson_auto.md`, `post_lesson_refl.md`, `bridge.md`** — dagligt arbete · *Arbetsutkast*
- **`course/pre_course.md`, `design.md`, `conduct.md`, `assessment.md`, `evaluation.md`, `revision.md`** — kursnivå · *Arbetsutkast*
- **`profession/term_reflection.md`, `manifest.md`** — professionsnivå · *Arbetsutkast*
- **`shared_principles.md`** — gemensamma principer (v0.5) · *Arbetsutkast*
- **`reflection_frameworks/`** — Brookfield, Gibbs, Driscoll, Kolb (reflektionsmodeller) · *Stabil*
- **`system/`** — `capture-session.md`, `pedagogical_analysis/` (Bloom + key-moment-prompts), `output_conventions/` (confidence-labels + source-attribution) · *Stabil*
- **`synlighetsprincip.md`** — synlighetsprincipen för automation · *Stabil*
- **`bridges/`** — datakopplingar mellan cyklerna · *Tidigt utkast (väntar på enum-registrering)*
- **`tensions.md`** — olösta teoretiska spänningar, publicerade tidigt för kritik · *Tidigt utkast*

---

## Versionsanmärkning

**v3.0** — 2026-04-27.

**Grund:** Konsoliderar operativ visdom — principer, fallgropar, framgångskriterier, limitations och anti-patterns — som tidigare låg spridd över flera separata dokument.

**Princip:** detta är *operativ guide*, inte teori eller arkitektur. Läs när det skaver. Återvänd när systemet känns onödigt komplicerat.

**Föregångare:** Inget direkt föregångare-dokument. I v0.x låg motsvarande visdom blandad med filosofi; v3.0 separerar — filosofi i arkitekturdoc, operativ visdom här.
