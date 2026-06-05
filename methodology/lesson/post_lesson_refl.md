---
type: exploration
status: draft
created: 2026-04-27T19:39:47
origin: desktop
project: Teaching Suite
---

# Methodology — Lektionscykeln: Post-lesson REFL

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **post-lesson REFL-fasen i lektionscykeln**. REFL är *meningsskapande, bakåtvänt arbete* — där läraren tolkar vad som hände och bär sina lärdomar in i nästa lektion.

```
                            ┌─→ POST-LESSON_AUTO ─┐
PRE-LESSON  →  LESSON  ─────┤                      ├──→  BRYGGA
                            └─→ POST-LESSON_REFL ─┘  ← detta dokument
   ↑                                   │
   │                                   │ carry-forward
   └──────────────────────────────────┘
```

**Lärarens fråga (här):** *Vad fungerade? Vad fungerade inte? Varför? Vad bär jag med mig?*

**Tempo:** Tre cadenser, olika djup:

| Cadens | Modell | Tid | Output |
|---|---|---|---|
| Direkt efter lektion | Rolfe (What? So what? Now what?) | 3–5 min | Kort, talinspelad |
| Vecka | Gibbs (sex steg) | 15–20 min | Djupare, valfri händelse |
| Termin | Brookfield (fyra lenser) | 45–60 min | Hör till professionscykeln |

---

## Grundprincip — REFL är mening, inte fakta

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I post-lesson är ställning/mening-uppdelningen genomgående. AUTO är systemets observationer — fakta utan värdering. REFL är lärarens röst — tolkning, meningsskapande, val. Detta dokument styr REFL.

| AUTO (`post_lesson_auto.md`) | REFL (detta dokument) |
|---|---|
| Systemets observationer | Lärarens röst |
| Fakta utan värdering | Tolkning, meningsskapande |
| Strukturerad mall | Gibbs / Rolfe / Brookfield-baserad |
| Automatisk när material finns | Initieras av läraren |
| Output: A1 + A2 + Auto-log | Output: reflektion med carry-forward |
| *"Aktivitet 3 markerades inte som genomförd"* | *"Jag hoppade över aktivitet 3 för att..."* |

**REFL bygger på AUTO.** AUTO är *underlaget* (fakta, plan-vs-utfall, concepts_missing, manual review-flaggor). REFL gör det *meningsbärande arbetet* — varför? vad lärde jag mig? vad gör jag annorlunda?

**Princip:** REFL ska *aldrig* automatiseras. Methodology kan ge struktur, men tolkningen kommer alltid från läraren. När AI börjar tolka i REFL har vi gjort fel.

---

## Teoretisk grund

### Schön — reflection-on-action (1983, 1987)

Schöns *swampy lowlands* är REFL:s hemland. Lärararbetet rör sig i otydliga, värdeladdade, komplexa situationer där reflektion-efter är där professionell kunskap utvecklas. AUTO ger fakta; REFL gör arbetet i swamp.

### Boud, Keogh & Walker — Reflection: Turning Experience into Learning (1985)

Tre moment som ofta missas:

1. **Returning to experience** — gå tillbaka till händelsen, *inte* till tolkningen
2. **Attending to feelings** — uppmärksamma känslor (både störande och stödjande)
3. **Re-evaluating experience** — tolka om i ljuset av nytt perspektiv

Den affektiva dimensionen är central. Känslor är inte distraktion — de är data. Frustration kan signalera att något inte stämmer i praxis. Glädje kan signalera att något träffat rätt. REFL ska *aktivt* fråga efter känslorna.

### Argyris & Schön — espoused theory vs. theory-in-use (1974)

REFL är där diskrepansen mellan *vad jag säger jag tror* (espoused, bor i manifestet) och *vad jag faktiskt gjorde* (in-use, surfat i AUTO) blir synlig. När de divergerar är det data — för revision av praxis eller av manifestet.

Methodology ska *peka* på diskrepansen utan att tolka den. Lärarens jobb: bestämma vad som ska revideras (sin praxis eller sitt manifest).

### Larrivee — fyra reflektionsnivåer (2000)

Larrivee skiljer:

1. **Pre-reflektiv** — rutinmässig, oreflekterad
2. **Ytlig** — tekniska problem (*"slidesen funkade inte"*)
3. **Pedagogisk** — didaktik och kunskap (*"min förklaring av X var otydlig"*)
4. **Kritisk** — etiska och politiska implikationer (*"vem har inte fått komma till tals?"*)

Methodology ska medvetet *pusha mot djupare nivåer*. *"Vad fungerade?"* är ytlig. *"För vem fungerade det inte och varför?"* är pedagogisk-kritisk. Promptar i biblioteket nedan är skiktade efter nivå.

### Gibbs — reflektionscykel (1988)

Sex steg, ett uthålligt format för veckovis fördjupning:

1. **Beskrivning** — vad hände?
2. **Känslor** — vad kände jag, vad kände eleverna?
3. **Värdering** — vad var bra, vad var dåligt?
4. **Analys** — vad bidrog?
5. **Slutsats** — vad lärde jag mig?
6. **Handlingsplan** — vad gör jag annorlunda?

Gibbs är cyklisk men sluten — du går igenom alla sex stegen varje gång. Det är bra för en utvald händelse i veckan, mindre lämpligt för varje lektion.

### Rolfe, Freshwater & Jasper — What? So what? Now what? (2001)

Minimalistisk struktur som passar två minuter på cykelvägen hem:

- **What?** — beskriv händelsen kort
- **So what?** — vad betyder det? vad lärde jag?
- **Now what?** — vad gör jag annorlunda?

Tre frågor, tre minuter. Den dagliga kortformen.

### Brookfield — fyra lenser (1995/2017)

Hör hemma i professionscykelns terminsreflektion, inte här. Refereras i `term_reflection.md`. Listas här för fullständighet.

### Ericsson & Simon — verbalprotokoll (1980/1993)

Forskningens implikation för REFL: *omedelbar* reflektion fångar något kvalitativt annat än fördröjd. Tal nära händelsen är rikare på halvtänkta tankar, tvekan, autenticitet. Skriven reflektion några dagar senare blir lätt sanerad.

Designkonsekvens: **REFL ska vara röstbaserad i första hand.** Inspelning → KB-Whisper → transkription → struktur. Texten kommer efter.

### Moore (2004), Akbari (2007) — kritisk linje

Obearbetad reflektion kan bli självbespeglande, sentimental, eller moraliserande — där läraren klagar på elever och system snarare än ser sin egen del.

Designkonsekvens för methodology:

- **Pusha mot konkretion** — *"vad sa eleven?"* snarare än *"de var ointresserade"*
- **Pusha mot egen agency** — *"vad gjorde jag som bidrog?"*
- **Variera prompter** — så reflektionen inte stelnar i mall

---

## Trigger

REFL startas av läraren — aldrig automatiskt. Trigger-fraser i Claude Desktop:

- *"Reflektera över [datum/topic]-lektionen"*
- *"Skriva post-lesson reflektion"*
- *"Vad lärde jag av [lektion]?"*
- *"Gibbs över [händelse i lektionen]"*

Eller direkt via voice memo: läraren spelar in 2 min på cykelvägen hem och laddar upp filen → methodology känner igen mönstret som REFL-trigger.

**Förutsättningar (minimum):**

- Lektionen ägt rum
- Läraren har minst 3 minuter

**Önskvärt:**

- AUTO har körts (auto-log finns som underlag)
- Pre-lesson-plan finns
- Audio-inspelning av reflektionen (KB-Whisper transkriberar)

---

## Process

### Fas 0 — Trigger + cadence-val

Methodology frågar — om inte uttalat:

> *"Vilken cadens? — Rolfe (3–5 min, snabb) / Gibbs (15–20 min, fördjupat) / Brookfield (45–60 min, terminsdjup)"*

Default: Rolfe vid daglig användning. Gibbs när läraren själv begär eller när AUTO-flagga *"detta var en stor händelse"* finns. Brookfield delegeras till `term_reflection.md`.

### Fas 1 — Underlag-loading

Innan reflektionen börjar: läs in vad som finns. Detta är ställning AUTO byggt.

```typescript
find_context({
  content_types: ['post_lesson_auto'],
  course: "[course]",
  recent: true   // senaste lektionens auto-log
})
```

Methodology presenterar för läraren — kort:

```
📋 Underlag för reflektion (lektion 2026-09-22, fotosyntes):

Auto-log §2 plan-vs-utfall:
  • Mörkerreaktion: planerat 15 min / faktiskt 8 min (-47%)
  • Diskussion: planerat 10 min / faktiskt 16 min (+60%)
  • C4-växter: ej genomfört

Auto-log §4 concepts_missing:
  • Calvin-cykel — endast 8 min, ingen utvecklad förklaring
  • C4-växter — ej taget upp

Auto-log §6 spontana fynd:
  • CO2-utsläpp och klimatförändring (15 min, ej planerat)

Auto-log §8 manual review:
  • [3 punkter att granska]

Vill du börja med Rolfe eller Gibbs? Eller strukturerar vi runt en av punkterna ovan?
```

**Princip:** AUTO är underlag, inte startpunkt. Läraren kan välja att reflektera över något helt annat än vad AUTO surfade. Methodology följer lärarens riktning.

### Fas 2 — Voice memo capture (om aktivt)

Om läraren spelar in:

1. KB-Whisper transkriberar audio → text
2. Methodology lägger inspelningen till sidan, behandlar transkriptet som lärarens egna ord
3. Strukturen kommer i Fas 3 — *inte* under inspelningen

**Princip (Ericsson & Simon):** ingen avbryter. Inspelningen är ren. Tvekan, halvtänkta tankar, känslospår får finnas. AI:n strukturerar *efter*, inte *under*.

**Spara originalljudet, inte bara transkriptet.** Transkription kan låsa ner det som var levande.

### Fas 3 — Reflektion enligt cadens

Tre olika strukturer beroende på cadens. Methodology följer en — inte alla.

#### 3-Rolfe (3–5 min, daglig)

Tre frågor, en åt gången:

**What?**

> *"Vad hände? Beskriv i 30 sekunder — vad är det enskilt mest framträdande?"*

**So what?**

> *"Vad betyder det? Vad lärde du dig? Eller — vad förvånade dig?"*

**Now what?**

> *"Vad gör du annorlunda nästa gång? En konkret sak."*

Klart. Output: en kort prosa-reflektion (50–200 ord) + en *now what*-sats som blir carry-forward.

#### 3-Gibbs (15–20 min, vecka)

Sex steg, en åt gången. Methodology väntar på lärarens svar innan nästa.

**1. Beskrivning:**

> *"Beskriv händelsen — eller hela lektionen om så är fallet. Bara fakta. Inga tolkningar än."*

**2. Känslor (Boud-explicit):**

> *"Vad kände du under det här? Och vad tror du eleverna kände?"*

> *"Var det något oväntat — i dig eller i rummet?"*

**3. Värdering:**

> *"Vad var bra — för dig och för eleverna?"*

> *"Vad var dåligt — eller åtminstone svårt?"*

**4. Analys (Larrivee-pushande):**

> *"Vad bidrog till det som fungerade? Vad bidrog till det som inte fungerade?"*

> *"Var dina antaganden om gruppen rätt? (Här kan AUTO §1 hjälpa — group_context du skrev pre-lesson)"*

> *"Är detta något som återkommer, eller var det specifikt för just denna gång?"*

**5. Slutsats:**

> *"Vad lärde du av detta — om innehållet, om eleverna, om dig själv?"*

> *"Är det något i ditt eget pedagogiska tänkande som rört på sig?"*

**6. Handlingsplan (carry-forward):**

> *"Vad gör du annorlunda nästa gång? Var konkret. 1–3 punkter."*

> *"Vilken är den viktigaste — den du faktiskt kommer ihåg när du planerar nästa lektion?"*

#### 3-Brookfield (delegeras till termin)

Brookfield-cadens hör till professionscykeln. Pre-lesson eller post-lesson REFL ska inte trigga den. Hänvisning: *"För terminsdjup, se `term_reflection.md`."*

### Fas 4 — Carry-forward (kärnoutput)

Hela REFL-arbetet konvergerar mot **carry-forward**. Det är kärnan i carry-forward-konventionen.

Methodology genererar inte carry-forward — *läraren skriver*. Methodology påminner om kraven:

- 1–3 konkreta punkter
- Lärarens egna ord (inte parafraserat av AI)
- Handlings-orienterat (*"vad gör jag"*) inte beskrivande (*"vad jag märkte"*)
- Specifikt nog att vara användbart i nästa pre-lesson

Output sparas både:

1. **I reflektionsfilen** under `## Carry-forward`-sektionen
2. **I YAML-frontmatter** som `carry_forward_out`-pekare så `context_load` hittar det

> **Princip:** carry-forward visas *exakt* i nästa pre-lesson — ingen automatisk extraktion eller tolkning. Det blir *exakt det* läraren skrev.

### Fas 5 — Espoused-vs-in-use-flaggning (när manifest finns)

*Placeholder.* När manifest v1 är skrivet:

Methodology jämför reflektionens slutsats (*"jag lärde mig X"*) eller handlingsplan (*"jag ska Y"*) mot manifestets ställningstaganden. Om diskrepans:

> *"I ditt manifest står du för 'subjectification framför ren qualification'. Men i denna lektion fokuserade du mest på faktakontroll — och du säger nu att du vill 'göra det mer kvantitativt mätbart' nästa gång. Är det medvetet en skiftande riktning, eller en pragmatisk avvikelse?"*

Detta är *inte* dom — det är en spegling. Läraren bestämmer:

- *"Det är pragmatik denna gång — manifestet står"* → flagga sparas, ingen åtgärd
- *"Detta speglar att jag har skiftat — manifestet behöver revideras"* → flagga går in i professionscykelns terminsreflektion som diskussionsfråga

Output: `espoused_vs_in_use_flags`-fält i YAML.

**Inte aktivt än.** Aktiveras när manifest v1 finns.

### Fas 6 — Save

```typescript
intelligent_save({
  content: <YAML + Markdown>,
  content_type: "reflection",
  suggested_path: "Reflections/<datum>_<topic>_<cadens>.md"
})
```

`intelligent_save` validerar YAML, skapar wikilinks (till AUTO-log, lektionsplan, ev. tidigare reflektioner som refereras).

### Fas 7 — Log

```typescript
log_process_event({
  type: "reflected",
  files: ["Reflections/..."],
  depth: "rolfe" | "gibbs" | "brookfield",
  trigger: "post_lesson_reflection"
})
```

Detta loggar i `_system/logs/process_log.yaml`. `context_load` läser sedan detta logg-event och hittar `carry_forward_out`-pekaren — så nästa pre-lesson kan visa carry-forward.

---

## Output-struktur

### YAML frontmatter

**Kärnfält:**

```yaml
type: reflection
created: 2026-09-22T15:30:00Z
date: 2026-09-22
course_instance: KURS101_2026
tags: [reflektion, fotosyntes, kurs101, gibbs]
status: draft
metadata_version: 1
```

**Kontextfält:**

```yaml
based_on:
  - "[[Analysis/2026-09-22-fotosyntes-autolog]]"   # AUTO som underlag
  - "[[Lesson_Plans/2026-09-22-fotosyntes]]"       # vad jag planerade
supports: [...]                                     # samma ILO-koder
provenance: post_lesson_reflection_v3
framework: [schön, gibbs]
```

**REFL-specifika fält:**

```yaml
depth: gibbs                  # rolfe / gibbs / brookfield
duration_actual: 18           # min faktiskt spenderat
mood: blandat                 # affektiv etikett, fri text
audio_path: "Audio/2026-09-22-fotosyntes-refl.m4a"   # om inspelning finns
transcript_path: "Data/Transcripts/2026-09-22-fotosyntes-refl.txt"
carry_forward_out: |          # YAML literal block — exakt lärarens ord
  1. Korta inledningen till 8 min — fick mer tid till diskussion förra gången.
  2. Calvin-cykel: visa cirkulärdiagram TIDIGT, inte sist.
  3. C4-växter: släpp för denna kurs, ta in i ekologi-modulen istället.
insights:
  worked:
    - "Solpanel-analogi väckte spontan klimat-diskussion"
    - "Eleverna ställde fler frågor än vanligt"
  didnt_work:
    - "Mörkerreaktion blev rushat — Calvin-cykel ej landad"
    - "C4 ej genomfört — för stor scope"
  surprised:
    - "Klimat-kopplingen kom från eleverna, inte från mig"
ci_addressed:                  # vilka critical incidents från AUTO §8 hanterade jag?
  - "C4-växter ej genomfört"
  - "Mörkerreaktion 8 min av 15"
recommendation: |              # det viktigaste meningsbärande fyndet
  Eleverna har egna kopplingar till klimatfrågan — bygg på dem som ingång,
  inte som påklistrad "Gegenwartsbedeutung" från min sida.
espoused_vs_in_use_flags: []   # tom tills manifest finns
```

### Markdown body

Tio strukturella sektioner:

1. **Översikt** — vilken cadens, hur lång tid, vad var fokus
2. **Vad hände** — Gibbs steg 1 / Rolfe What
3. **Känslor** — Gibbs steg 2 / Boud affektiva dimension
4. **Värdering** — Gibbs steg 3
5. **Analys** — Gibbs steg 4 / Rolfe So what
6. **Slutsats** — Gibbs steg 5 (vad lärde jag mig)
7. **Carry-forward** — Gibbs steg 6 / Rolfe Now what (kärna)
8. **Espoused-vs-in-use** *(när manifest finns)*
9. **Kopplingar** — wikilinks till AUTO, plan, ev. tidigare reflektioner
10. **Audio + transkript** — referenser till originalljud

> **OBS:** För Rolfe-cadens kondenseras 2–6 till tre korta avsnitt (What/So what/Now what). Carry-forward står ändå alltid som egen sektion.

---

## Spänningar att hålla i REFL

### Gibbs som mall vs autentisk reflektion

Gibbs är effektiv struktur, men risken är att den blir *checkbox-reflektion* — sex rutor att fylla i utan att möta innehållet. Methodology behöver vakna — när läraren börjar svara *"steg 3 är att…"* istället för att reflektera, är något fel.

**Hur hanteras spänningen?** Methodology väntar mellan stegen, ställer en fråga åt gången, och accepterar tystnad. Cadensen ska upplevas som dialog, inte protokoll. Om läraren stannar i ett steg länge — det är OK; bara följa med.

### Skriven vs talad reflektion

Talspråket har idiosynkrasier som skvallrar — vad du återkommer till, vilka ord du laddar, var du tvekar. Skriven reflektion några dagar senare blir lätt sanerad.

**Hur hanteras spänningen?** Voice-first — KB-Whisper är pipelinen, audio sparas alltid. Texten är derivat. Vid skriven reflektion (om läraren föredrar det): methodology påminner om att tvekan och halvtänkta tankar är värdefulla, inte fel.

### Self-bespeglande risk (Moore/Akbari)

Reflektionen kan bli klagomål på elever, system, omständigheter — där läraren själv aldrig är medskaparen.

**Hur hanteras spänningen?** Methodology pushar mot agency:

- *"Vad gjorde du som bidrog till det som fungerade?"*
- *"Vad gjorde du som bidrog till det som inte fungerade?"*
- *"Hur ser detta ut från elevernas synvinkel?"*

Pushen är medveten — methodology är inte ekokammare. Men inte heller dom. Konkreta lärar-frågor som öppnar perspektivskifte.

### Privata reflektioner vs professionsutveckling

REFL innehåller ofta känsligt material — frustrationer, osäkerheter, kritik mot kollegor eller skolledning. Det måste få vara privat.

**Hur hanteras spänningen?** *Reflektionerna är teacher-facing only.* De delas inte automatiskt med någon. Aggregering till kursrevision (kurs → profession-bryggan) sker på *carry-forward + recommendation*-nivå, inte på affektiva noteringar.

GDPR-aspekten är central — se nedan.

---

## GDPR

| Datatyp | Hantering |
|---|---|
| Lärarens reflektioner | Kursmappen (Teaching Suite), privat per lärare — OK |
| Audio-inspelning av lärarröst | Kursmappen, privat — OK |
| Audio som råkar fånga elevröster | Bör undvikas (spela in efter eleverna gått); om förekommer, raderas eller anonymiseras vid transkribering |
| Citat av elever i reflektioner | Aggregerad nivå (*"någon elev frågade…"*), aldrig attribuerad |
| Affektivt material (frustrationer, kritik) | Privat per lärare. Aggregering uppåt (kursrevision, manifest) sker bara på handlingsorienterad nivå (*"vad jag gör annorlunda"*), aldrig på affektiv (*"jag var frustrerad på X"*). |
| Kollegial kritik i reflektion | Privat. Vid aggregering: stryks innan delning. |

**Princip:** REFL är lärarens privata reflektionsutrymme. Det som flödar uppåt (carry-forward → pre-lesson; recommendation → kurs → profession) är *handlings-* och *insiktsorienterat*, inte affektivt eller relationellt.

Content-scanner kör på alla outputs. Flaggar oavsiktlig identifiering av elever eller kollegor.

---

## Tools som används

| Tool | Roll i REFL |
|---|---|
| `load_methodology` | Laddar detta dokument vid trigger |
| `find_context` | Läser senaste auto-log som underlag (Fas 1) |
| `file_read` | Läser auto-log, plan, ev. tidigare reflektion |
| `parse_lesson_transcript` | Vid längre voice-memo, parsar reflektionens transkript. Iterativ via `mode: 'summary'` → `mode: 'segments'` (se `post_lesson_auto.md`) |
| `intelligent_save` | Sparar reflektion med `content_type: reflection` |
| `log_process_event` | Loggar `reflected`-event med depth-tag |

**Externa pipeline-komponenter (inte MCP-tools):**

- KB-Whisper för audio-till-text
- Eventuellt diarisering om audio fångar fler talare

**Inget nytt tool krävs.** REFL är pure dialogisk methodology + befintliga tools.

---

## Integration med andra processer

### REFL → Pre-lesson (nästa)

Lektionscykelns kärna. `carry_forward_out` från REFL skrivs till YAML-frontmatter. `context_load` plockar upp den vid nästa session-start och visar för läraren i pre-lesson Fas 2A. **Detta är carry-forward i praktiken.**

### REFL → Brygga

REFL skapar carry-forward. Bryggan (`bridge.md`) är där läraren *aktivt konverterar awareness till handling* — använder carry-forward som ingång till nästa pre-lesson. Bryggan är distinkt från carry-forward självt: carry-forward är *vad jag vill bära*; bryggan är *momentet där jag tar med mig det*.

### REFL → Kursrevision

`recommendation`- och `insights`-fälten aggregeras vid kurscykelns revision. Drift-mönster och återkommande lärdomar matar nästa upplaga.

### REFL → Manifest (vision)

Espoused-vs-in-use-flaggor (Fas 5) blir input till manifestrevisionen i professionscykeln. Återkommande diskrepans ⟶ manifestet behöver revideras eller praxis omprövas.

### REFL → AUTO (cirkulärt)

Om manuell granskning i AUTO §8 påverkar reflektionen — t.ex. läraren bekräftar att *"detta var inte off-topic, det var del av min undervisning"* — uppdateras AUTO i efterhand. REFL kan trigga en AUTO-omkörning.

---

## Brygga framåt — när REFL triggar cross-cycle-bryggor

REFL är där läraren *artikulerar* mönster med egna ord. Carry-forward-sektionen är den mest direkta källan till bryggetriggers — men kraften kommer från lärarens egen formulering, inte AI-detektion. Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): policyn (B) + handlingen (C) här som prosa; detektionen (A) i kod.

> **Läs-mönster:** Efter att en post_lesson_refl-körning slutförts, läs lärarens carry-forward och utvärdera bryggetrigger nedan. Om läraren explicit uttrycker mönster som passar villkoret — föreslå med exakt formulering nedan.

### `lesson_to_course_bridge` — när lärarens reflektion artikulerar mönster

**Villkor (B):** Cowork ska föreslå bryggan när minst ett av följande gäller i lärarens carry-forward eller §Vad hände-sektion:

- Läraren uttrycker explicit mönster: *"Jag hinner aldrig X"*, *"Samma sak händer varje gång"*, *"Tredje lektionen i rad..."*, *"Jag märker ett mönster där..."*
- Läraren refererar till tidigare lektion (*"liksom förra veckan"*, *"som i Tema 5-lektionen"*) och uttrycker missnöje eller observation
- Reflektionen pekar på systematisk drift snarare än engångshändelse

**Inte trigger:** enskild lektion som gick dåligt utan referens till mönster. Det stannar i lesson cycle.

**Handling (C):** Cowork bekräftar mönstret läraren själv namngav och föreslår:

> *"Du skrev att [citat från carry-forward]. Det låter som ett mönster över flera lektioner snarare än bara idag. Ska jag bygga bron till kursnivån — `lesson_to_course_bridge` — så vi kan se mönstret tillsammans och kanske utlösa en kursrevision?"*

Vid lärarens **ja:** invokera `load_methodology('lesson_to_course_bridge')`. Vid **nej** eller **inte än:** ingen vidare åtgärd. Cowork ska inte tjata.

**Detektion (A):** LLM-läsning av carry-forward-prosan. Mekaniken är ren textanalys; *vad som räknas som mönster-uttryck* är listat ovan i villkoret.

**Skillnad mot AUTO-bryggan:** AUTO triggar baserat på *systemets observationer* (räkning av körningar, drift-procent). REFL triggar baserat på *lärarens egen artikulation*. Båda kan resultera i samma brygga (`lesson_to_course_bridge`) men ingången är olika. Om båda triggar samtidigt — kombinera till en stärkt föreslag (*"både systemet och din egen reflektion pekar på..."*).

Se `methodology/bridges/lesson_to_course.md` för bryggans interna mekanism.

### `course_to_profession_bridge` — sällan, men möjligt

REFL kan, undantagsvis, peka direkt mot manifest-revisions-mönster. Det är *ovanligt* — den naturliga vägen är REFL → kursrevision → terminsreflektion → manifest-revision. Men om läraren i en enskild reflektion explicit refererar till sitt manifest (*"jag säger mig stå för X men gjorde Y idag igen"*) öppnar det en direktbrygga.

**Villkor (B):** Cowork ska föreslå bryggan när:

- Lärarens reflektion innehåller **espoused-vs-in-use-formulering** (Argyris & Schön): *"jag tror på X men gjorde Y"*, *"i mitt manifest står Z men i praktiken..."*
- Och denna typ av formulering har förekommit i ≥3 reflektioner samma termin

**Handling (C):**

> *"Du skrev '[citat]'. Det är tredje gången denna termin du formulerar liknande gap mellan vad du säger dig stå för och vad som faktiskt händer. Ska vi vänta tills terminsreflektionen, eller är detta tillräckligt tydligt för att överväga manifest-revision direkt — `course_to_profession_bridge`?"*

Vid lärarens **ja till direktbrygga:** invokera `course_to_profession_bridge`. Vid **vänta:** notera mönstret för kommande terminsreflektion (sparas i `Reflections/Bryggor/<datum>-deferred_to_term.md`).

**Princip från bridge-doc:en:** *Inte moralisk gotcha.* Espoused-vs-in-use-gap är data, inte felidentifiering. Cowork ska aldrig lyfta detta som *"du följer inte ditt manifest"* — bara som *"detta mönster återkommer, ska vi titta på det?"*.

Se `methodology/bridges/course_to_profession.md` för bryggans designprincip.

---

## Edge cases

### Inget AUTO finns

Antingen lektionen ägde rum utan transkript och utan plan, eller AUTO inte hunnits köra.

**Methodology fallback:**

- Hoppa över Fas 1 (underlag-loading)
- Methodology säger: *"Inget AUTO finns. Vi kör REFL från ditt minne — vad hände?"*
- Cadens fungerar normalt (Rolfe/Gibbs)
- I YAML: `based_on: []` med flagga `auto_log_missing: true`
- `manual_review` kommer inte att ha kommit in från AUTO — flagga i Auto-log ska köras separat när material finns

### Läraren orkar inte (kort tid)

Cadens-anpassning. Om Gibbs känns för mycket vid trigger:

> *"Du verkar vilja göra detta kort. Vill vi köra Rolfe (3–5 min) istället för Gibbs?"*

Eller: spara reflektionen som *partial* med flagga `incomplete: true`, kom tillbaka senare.

### Affektivt material som är känsligt

Läraren reflekterar över något smärtsamt — en svår elev, en konflikt, ett misslyckande.

**Methodology fallback:**

- Inte pusha mot djupare när läraren signalerar gräns
- Inte tolka affektet — bara erkänna det
- Erbjuda *"vill du pausa här och fortsätta senare?"*
- Påminna om att reflektionen är privat
- Inte inkludera namn eller specifika detaljer i carry-forward om det är känsligt

### Inspelningen failade

Audio finns inte, läraren har endast minne kvar.

**Methodology fallback:**

- Skriva direkt — Rolfe-cadens fungerar bra för det
- Notera i YAML: `audio_path: missing`, `recording_failed: true`
- Ingen förlust — bara annan modalitet

### Två lektioner samma dag

Läraren undervisar två grupper i samma topic samma dag, vill reflektera över helheten.

**Methodology fallback:**

- Methodology frågar: *"Reflekterar du över bägge tillsammans, eller separat?"*
- Tillsammans → en reflektion med `based_on`-pekare till båda planer/auto-logs
- Separat → två reflektioner

### Reflektionen leder till ny pre-lesson direkt

Läraren *känner* under reflektionen att något måste ändras inför nästa lektion — och vill planera om direkt.

**Methodology fallback:**

- Slutför REFL först (även om kort)
- Carry-forward sparas
- Sedan bryggans prompt → ny pre-lesson
- Skapar en tät cykel: REFL → brygga → ny plan på minuter

---

## Kvalitetskriterier

### En bra REFL har:

**Konkret:**

- Specifika händelser, inte abstraktioner
- Lärarens egna ord — inte parafras
- Konkreta carry-forward-punkter (inte *"vara mer närvarande"* utan *"börja varje block med en fråga som väcker engagemang"*)

**Affektivt fångad:**

- Känslor noterade (åtminstone i Gibbs-cadens)
- Inte rensad — tvekan, frustration, glädje får finnas

**Agentic:**

- Lärarens egen del synlig (*"jag bidrog till X"*)
- Inte bara klagomål på system eller elever
- Larrivee-nivå minst pedagogisk

**Carry-forward-orienterad:**

- 1–3 punkter, konkreta
- Handlings-ord (*"jag korta"*, *"jag visar tidigare"*) — inte beskrivande (*"jag märkte att…"*)

**Strukturerat:**

- YAML frontmatter komplett
- Wikilink till AUTO och plan
- Audio + transkript-pekare om inspelning finns

### En dålig REFL har:

**Abstrakt:**

- *"Lektionen gick OK"* — ingen specificitet
- Ingen koppling till AUTO-fakta

**Sanerat:**

- Inga känslor noterade
- Allt är "OK" eller "som väntat"

**Klagomål utan agency:**

- *"Eleverna var ointresserade"* utan *"jag bidrog till X"*
- Allt är yttre — inget rörd hos läraren

**Vag carry-forward:**

- *"Förbättra mörkerreaktionen"* — inte konkret
- Eller helt saknad carry-forward

**Mall-tom:**

- Sex sektioner i Gibbs ifyllda var och en med en mening — utan möte med innehållet
- Känslan av en checkbox-övning

---

## Output-exempel (kort, Gibbs-cadens)

```yaml
---
type: reflection
created: 2026-09-22T15:30:00Z
date: 2026-09-22
course_instance: KURS101_2026
tags: [reflektion, fotosyntes, kurs101, gibbs]
status: draft
metadata_version: 1
provenance: post_lesson_reflection_v3
based_on:
  - "[[Analysis/2026-09-22-fotosyntes-autolog]]"
  - "[[Lesson_Plans/2026-09-22-fotosyntes]]"
supports:
  - KURS101.04.fotosyntes.ljusreaktion
  - KURS101.04.fotosyntes.morkerreaktion
framework: [schön, gibbs]
depth: gibbs
duration_actual: 18
mood: blandat
audio_path: "Audio/2026-09-22-fotosyntes-refl.m4a"
transcript_path: "Data/Transcripts/2026-09-22-fotosyntes-refl.txt"
carry_forward_out: |
  1. Korta inledningen till 8 min — fick mer tid till diskussion.
  2. Calvin-cykel: visa cirkulärdiagram tidigare, inte sist.
  3. C4-växter: släpp för denna kurs, ta in i ekologi-modulen istället.
insights:
  worked:
    - "Solpanel-analogi väckte spontan klimat-diskussion"
    - "Eleverna ställde fler frågor än vanligt"
  didnt_work:
    - "Mörkerreaktion blev rushat — Calvin-cykel ej landad"
    - "C4 ej genomfört — för stor scope"
  surprised:
    - "Klimat-kopplingen kom från eleverna, inte från mig"
ci_addressed:
  - "C4-växter ej genomfört"
  - "Mörkerreaktion 8 min av 15"
recommendation: |
  Eleverna har egna kopplingar till klimatfrågan — bygg på dem som ingång,
  inte som påklistrad "Gegenwartsbedeutung" från min sida.
espoused_vs_in_use_flags: []
---

## Översikt

Gibbs-cadens, 18 min. Fokus på det jag inte hann — Calvin-cykel och C4 — men insikten kom från det jag inte planerade: klimat-diskussionen.

## Vad hände

[Gibbs steg 1 — beskrivning utan tolkning]

Lektionen började bra. Solpanel-analogin landade. Vid 35 minuter började någon i bakre raden fråga om CO2-utsläpp — det blev en 15-minutersdiskussion. När jag kom till mörkerreaktionen hade jag 8 min kvar för det som planerats för 15. C4 hoppades över helt.

## Känslor

[Gibbs steg 2 — affektivt]

Två motstridiga känslor. Glädje över att eleverna engagerade sig spontant — det är sällsynt med just denna grupp. Och frustration: jag *visste* att jag borde stoppa diskussionen tidigare, men jag ville inte bryta engagemanget. Slutet av lektionen kändes hetsigt.

## Värdering

[...]

## Carry-forward

1. Korta inledningen till 8 min — fick mer tid till diskussion.
2. Calvin-cykel: visa cirkulärdiagram tidigare, inte sist.
3. C4-växter: släpp för denna kurs, ta in i ekologi-modulen istället.
```

---

## Bibliotek — prompts & frågor

Återkommande dialog-prompter, kategoriserade per cadens och fas.

### Trigger-bekräftelser

- *"Vill du köra Rolfe (3–5 min) eller Gibbs (15–20 min)?"*
- *"Senaste auto-log har 3 punkter att granska. Reflekterar vi runt en av dem, eller kör vi öppet?"*
- *"Spelar du in eller skriver vi direkt?"*

### Underlag-presentation

- *"Auto-log §2 visar [X]. §4 flaggar [Y]. §8 har [N] manuella granskningar. Vill du börja någonstans, eller kör jag bara med?"*
- *"Vad är det som sticker ut för dig från lektionen — vad är du själv mest nyfiken på?"*

### Rolfe — What

- *"Vad hände? Beskriv i 30 sekunder — det enskilt mest framträdande."*

### Rolfe — So what

- *"Vad betyder det? Vad lärde du dig?"*
- *"Vad förvånade dig?"*

### Rolfe — Now what

- *"Vad gör du annorlunda nästa gång? En konkret sak."*

### Gibbs — Beskrivning

- *"Beskriv händelsen — bara fakta. Inga tolkningar än."*
- *"Var i lektionen var detta?"*

### Gibbs — Känslor (Boud-explicit)

- *"Vad kände du under det här?"*
- *"Vad tror du eleverna kände?"*
- *"Var det något oväntat — i dig eller i rummet?"*

### Gibbs — Värdering

- *"Vad var bra — för dig och för eleverna?"*
- *"Vad var dåligt — eller åtminstone svårt?"*

### Gibbs — Analys (Larrivee-pushande)

- *"Vad bidrog till det som fungerade?"*
- *"Vad bidrog till det som inte fungerade?"*
- *"Var dina pre-lesson-antaganden om gruppen rätt?"*
- *"Är detta något som återkommer, eller var det specifikt?"*
- *"Hur ser detta ut från elevernas synvinkel?"*

### Gibbs — Slutsats

- *"Vad lärde du av detta — om innehållet, om eleverna, om dig själv?"*
- *"Är det något i ditt eget pedagogiska tänkande som rört på sig?"*

### Gibbs — Handlingsplan

- *"Vad gör du annorlunda nästa gång? Var konkret. 1–3 punkter."*
- *"Vilken är den viktigaste — den du faktiskt kommer ihåg när du planerar nästa?"*

### Pushback mot vag eller mall-tom

- *"Det där lät som [generaliserad fras] — kan du säga något mer specifikt?"*
- *"Du sa 'eleverna var ointresserade' — vad såg du som fick dig att tänka det?"*
- *"Det här är värt att stanna lite vid — vad menar du?"*

### Affektiv check-in

- *"Hur känns det att reflektera nu? Vill du fortsätta eller pausa?"*
- *"Det här är känsligt — vill du ta det skriftligt istället för audio?"*

### Espoused-vs-in-use (när manifest finns)

- *"I ditt manifest står du för X. I denna lektion gjorde du Y. Är det medvetet skiftat eller pragmatik?"*
- *"Vill du flagga detta för terminsreflektionen — kan vara värt att granska om manifestet behöver revideras?"*

### Carry-forward-validering

- *"Är carry-forward-punkten konkret nog? Skulle pre-lesson om en vecka kunna handla på den?"*
- *"Kommer du faktiskt komma ihåg detta? Är det den viktigaste?"*

### Avslutande

- *"Spara nu, eller vill du läsa igenom först?"*
- *"Vill du logga detta som *reflected*, eller är det fortfarande draft?"*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — överliggande arkitektur
- **`pre_lesson.md`** — pre-lesson, läser carry-forward i Fas 2A
- **`post_lesson_auto.md`** — AUTO, levererar underlag till REFL
- **`bridge.md`** — bryggan, aktiverar carry-forward
- **`term_reflection.md`** — Brookfield-cadens hör hemma där

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Schön reflection-on-action, Boud/Keogh/Walker (affektiv dimension), Argyris & Schön (espoused vs in-use), Larrivee (4 nivåer, push mot djupare), Gibbs (sex steg, vecka), Rolfe (What/So what/Now what, daglig), Ericsson & Simon (verbalprotokoll, voice-first), Moore/Akbari (kritisk linje, undvik self-bespeglande).

**Process-utvidgningar (nya):**

- Fas 0 — explicit cadence-val (Rolfe/Gibbs/Brookfield)
- Fas 1 — underlag-loading från AUTO med princip *"underlag, inte startpunkt"*
- Fas 2 — voice-first via KB-Whisper, audio sparas alltid
- Fas 3 — strukturerade prompter per cadens (Rolfe-3, Gibbs-6, Brookfield → profession)
- Fas 4 — carry-forward som kärnoutput
- Fas 5 — espoused-vs-in-use placeholder (aktiveras med manifest)
- Fas 6 — save med depth-tagging
- Fas 7 — log_process_event med depth

**Spänningar (fyra):**

- Gibbs som mall vs autentisk reflektion
- Skriven vs talad reflektion
- Self-bespeglande risk (Moore/Akbari)
- Privata reflektioner vs professionsutveckling

**Operativ rikedom:**

- 10 markdown body-sektioner per reflektion
- YAML-fält för depth, audio_path, mood, insights, ci_addressed, recommendation
- Pre-save valideringschecklista
- Bibliotek av prompter per cadens och fas (~50 prompter)
- Edge cases (saknad AUTO, kort tid, känsligt material, inspelning failade, två lektioner samma dag, REFL → ny pre-lesson direkt)
- En bra / en dålig REFL


