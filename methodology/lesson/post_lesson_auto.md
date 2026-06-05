---
type: exploration
status: draft
created: 2026-04-27T19:32:25
origin: desktop
project: Teaching Suite
---

# Methodology — Lektionscykeln: Post-lesson AUTO

*Methodology v3.0, 2026-04-26. Komplement till `pedagogisk_arkitektur.md`.*

---

## Var detta hör hemma

Detta dokument styr **post-lesson AUTO-fasen i lektionscykeln**. AUTO är systemets *faktiska observationer* efter en lektion — strukturerad mall som *Reflection-on-action* (Schön) bygger meningen från. AUTO är inte reflektion. AUTO är *underlaget* för reflektion.

```
                            ┌─→ POST-LESSON_AUTO ─┐    ← detta dokument
PRE-LESSON  →  LESSON  ─────┤                      ├──→  BRYGGA
                            └─→ POST-LESSON_REFL ─┘        │
   ↑                                                       │
   └───────────────── kunskap förs vidare ────────────────┘
```

**Lärarens fråga (här):** *Vad hände faktiskt? Vad togs upp? Vad höll planen, vad höll inte?*

**Tempo:** minuter–timmar efter lektionen. AUTO körs så snart material finns (transkript transkriberat, lärarnotering tillagd).

---

## Grundprincip — AUTO är fakta, inte mening

Hela MCP:n vilar på principen:

> **AI hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

I post-lesson är ställning/mening-uppdelningen genomgående:

| AUTO (detta dokument) | REFL (separat doc — `post_lesson_refl.md`) |
|---|---|
| Systemets observationer | Lärarens röst |
| Fakta utan värdering | Tolkning, meningsskapande |
| Strukturerad mall | Gibbs-baserad reflektion |
| Automatisk när material finns | Initieras av läraren |
| Output: A1 Content + A2 Recap + B Auto-log | Output: reflektion med carry-forward |
| *Plan vs utfall* — vad hände | *Varför fungerade / inte* — varför |
| Aldrig Gibbs, aldrig "därför att…" | Här bor Gibbs, känslorna, espoused-vs-in-use |

**Princip:** AUTO presenterar *"X hände"*. REFL säger *"därför att…"*. Det är arkitektoniskt fel om AUTO börjar tolka — då glider systemet in i lärarens domän.

Risken: en jämförelse plan-vs-utfall som flaggar *"du genomförde inte aktivitet 3"* kan kännas som anklagelse istället för observation. Designprincipen håller AUTO på fakta-sidan: *"Aktivitet 3 markerades inte som genomförd"* — neutralt, värderingsfritt.

---

## Teoretisk grund

### Schön — reflection-on-action (1983, 1987)

Reflection-on-action är den distanserade tolkningen efteråt — där lärararbetet möter sina *swampy lowlands*. Men reflektion kräver underlag. AUTO bygger underlaget. AUTO är ställningen som låter REFL göra sitt arbete senare.

### Argyris & Schön — espoused vs theory-in-use (1974)

AUTO surfar *theory-in-use* — vad som faktiskt gjordes — utan att jämföra mot *espoused theory* (vad läraren sa hen skulle göra). Den jämförelsen sker i REFL och i manifestrevisionen.

AUTO:s roll: gör in-use synlig. Manifestets roll: gör espoused synlig. Diskrepansen är data, men diskrepans-tolkningen hör inte till AUTO.

### Black & Wiliam — formativ avläsning (1998)

Lärarens inplanerade formativa avläsningspunkter (`formative_checks` i pre-lesson-planens YAML) checkas av AUTO mot vad som faktiskt skedde i lektionen. Resultatet blir en faktisk lista: *vilka avläsningspunkter aktiverades, vilka missades*. Ingen tolkning av varför.

### Verbalprotokoll-forskning (Ericsson & Simon, 1980/1993)

För AUTO är forskningens implikation: transkript av lektion är ett verbalprotokoll i Ericsson & Simons mening — det fångar något kvalitativt. AUTO bevarar det utan att tolka. Om transkript saknas, så saknas data — AUTO ska *inte* fylla i utan ärligt rapportera *transcript_missing*.

### Moore / Akbari — kritisk linje (2004, 2007)

AUTO:s bidrag till den kritiska linjen i reflektionsforskningen: genom att hålla sig på fakta-sidan avskärmar AUTO sig från riskerna med ren tolkning (självbespeglande, sentimental, moraliserande). AUTO är ren beskrivning. Det skyddar REFL från att börja från ett tolkat utgångsläge.

---

## Trigger

Post-lesson AUTO startas av en av två triggers:

### Automatisk trigger

När transkript blir tillgängligt (KB-Whisper avslutar transkribering) körs AUTO automatiskt om det finns en motsvarande pre-lesson-plan i kursmappen.

```
🎙 Transkript tillgängligt: lektion_15_fotosyntes_2026-09-22.json
   → AUTO startar automatiskt
```

### Lärarinitierad trigger

```
- "Kör post-lesson AUTO för lektion [datum/topic]"
- "Generera auto-log för fotosyntes-lektionen"
- "Sammanställ vad som hände i [lektion]"
```

Eller indirekt via Cowork: läraren laddar upp transkript + plan, methodology känner igen post-lesson-mönstret.

**Förutsättningar (minimum):**

- Lektionsdatum / topic kan identifieras
- Antingen transkript ELLER lektionsplan finns

(Bägge saknas → AUTO kan inte köra meningsfullt → flagga och stoppa.)

---

## Process

### Fas 0 — Input-check och scenarie-bestämning

Detta är AUTO:s första kritiska beslut. Beroende på vilka inputs som finns triggas olika output.

**Fyra scenarier (trigger-matris):**

| Scenarie | Transkript | Plan-YAML | Plan-text (inget YAML) | A1 Content | A2 Recap | B Auto-log |
|---|---|---|---|---|---|---|
| **S1: Båda finns** | ✅ | ✅ | — | ✅ | ✅ | ✅ |
| **S2: Bara transkript** | ✅ | ❌ | ❌ eller ✅ | ❌ (kräver plan-struktur) | ⚠️ partiell | ✅ |
| **S3: Bara plan** | ❌ | ✅ | — | ❌ (hård regel: A1 kräver transkript) | ✅ | ⚠️ tunn |
| **S4: Varken** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ stoppa |

**Hård regel:** A1 Content kräver *alltid* transkript. Aldrig genereras utan. Detta är arkitektoniskt: A1 är *vad eleven mött* — utan transkript är det fiktion.

### Fas 1 — Källtagging (`plan_yaml` / `transcript_only` / `both` / `plan_text` / `transcript_missing`)

För varje fynd (begrepp, aktivitet, övergång) i AUTO-output tagger vi källan.

| Tag | Betyder |
|---|---|
| `plan_yaml` | Strukturerad data från lektionsplanens YAML (hög tillit) |
| `plan_text` | Extraherat från lektionsplanens prosa (mellantillit) |
| `transcript_only` | Endast i transkript, inte i plan (kan vara spontant fynd) |
| `both` | I både plan och transkript — bekräftat som genomfört |
| `transcript_missing` | Saknas data för validering — flagga som behöver granskning |

**Designkonsekvens:** läraren ser källan för varje observation och kan bedöma tilliten själv. *Spontana fynd* (`transcript_only`) flaggas särskilt eftersom de är intressanta — vad togs upp som inte var planerat?

### Fas 2 — Kandidatfilter (Phase 1.5)

Innan A1 och A2 genereras gör AUTO ett *kandidatfilter*: 

- Loose regex som identifierar *potentiella* nyckelbegrepp i transkriptet
- LLM-klassificering som väljer ut relevanta begrepp baserat på lektionsplanens topics
- Off-topic exkluderas (notering om vad som var off-topic går till Auto-log §6, inte A1/A2)

**Princip:** Phase 1.5 har låg tillit — den är ett filter, inte en sanning. Källtagging gäller (kandidatfynd får `transcript_only`-tag).

### Fas 3 — A1 Content (`content` content_type)

A1 är *vad eleverna har mött* under lektionen — strukturerat material som kan delas med eleverna i efterhand som *Student_Materials/<lesson>/content_*.md*.

**Förutsätter:** Transkript MÅSTE finnas. Om inte → A1 hoppas över, flagga i Auto-log.

**Innehåll:**

- Begrepp som introducerades (med definition från transkript)
- Förklaringar och analogier som användes
- Frågor som ställdes (med svar om svar finns)
- Diagram/material som refererades

**Källtagging för varje fynd.**

**Off-topic exkluderas.** Material som inte rör topic flyttas inte hit — det noteras i Auto-log §6.

**Output:** Strukturerad markdown, sparas via `intelligent_save` med `content_type: content`, routning `Student_Materials/<lesson>/`.

### Fas 4 — A2 Recap (`recap` content_type)

A2 är *en kort sammanfattning av lektionen för eleverna* — vad de bör minnas, vilka uppgifter de fick, vilka frågor som dök upp.

**Källa = lektionsplanens YAML (`uppgifter`-fält).** Inte transkript-extraktion. Detta är medvetet: lektionsplanens uppgifter är auktoritativa. Transkriptet kan komplettera men inte ersätta.

**Villkorlig generering:**

| Plan-YAML har `uppgifter` | A2 genereras? |
|---|---|
| Ja, fullständig | Ja, full A2 |
| Ja, ofullständig | Ja, partiell A2 + flagga `manual_review_required` |
| Nej, men plan-text finns | Partiell A2 baserad på plan-text + flagga |
| Nej, varken YAML eller text | Hoppas över, flagga i Auto-log |

**Innehåll:**

- Veckans tema
- Centrala begrepp (3–5 stycken)
- Uppgifter att göra (om plan har)
- Frågor som dök upp under lektionen (källa: transkript, taggat `transcript_only`)
- Material/lektion-referenser (`related_content`-fält)

**Output:** Sparas via `intelligent_save` med `content_type: recap`, routning `Student_Materials/<lesson>/`.

### Fas 5 — B Auto-log (`auto_log` content_type)

B är *systemets observation* — den som matar nästa pre-lesson (Fas 2A) och kursrevision. Auto-log är AUTO:s mest robusta output: den genereras *alltid*, även om transkript och plan saknas.

**Innehåll-schema:**

```markdown
# Auto-log — [course] — [date] — [topic]

## §1 Lektionsdata

- Datum, tid, kurs, topic
- Pre-lesson-plan: [wikilink]
- Transkript: [filsökväg eller transcript_missing]
- Diarisering: [success / failed / partial]
- Längd: planerat X min, faktiskt Y min

## §2 Plan vs utfall

| Block | Planerat | Faktiskt | Avvikelse | Källa |
|---|---|---|---|---|
| Introduktion | 10 min | 12 min | +20% | both |
| Ljusreaktion | 25 min | 31 min | +24% | both |
| ... | ... | ... | ... | ... |

## §3 Genomförda begrepp

- [Begrepp 1] — `both`
- [Begrepp 2] — `plan_yaml` (planerat, ej i transkript → kanske övergick snabbt)
- [Begrepp 3] — `transcript_only` (spontant fynd)

## §4 concepts_missing

- [Begrepp X] — planerat men inte i transkript → eventuellt utelämnat
- [Begrepp Y] — planerat och i transkript men kort tid → kanske rushat

## §5 Formativa avläsningspunkter

| Avläsning | Aktiverades? | Källa |
|---|---|---|
| "Var kommer ATP ifrån?" | ✅ ja, vid 18:30 | transcript_only |
| Exit ticket | ❌ ej i transkript | — |

## §6 Off-topic / spontana avvikelser

- [Notering om vad som var off-topic — för information, inte tolkning]

## §7 Tekniska flaggor

- transcript_missing: [ja/nej]
- diarisation_status: [success/failed/partial]
- plan_yaml_missing: [ja/nej]
- plan_text_only: [ja/nej]

## §8 Manual review required

[Konsoliderad sektion med allt som behöver lärarens manuella granskning]
```

**Tunn variant** (om transkript saknas):
- §1 ✅ med flaggor
- §2 ❌ (kan inte beräkna utfall)
- §3 ✅ men endast `plan_yaml`-källa
- §4 ❌
- §5 ❌
- §6 ❌
- §7 ✅
- §8 *"Transkript saknas — fullständig auto-log kräver lärar-notering: vad togs upp, vad inte? Lägg till manuellt och kör om."*

**Output:** Sparas via `intelligent_save` med `content_type: auto_log`, routning `Analysis/`.

### Fas 6 — Manual review-flagging

I Auto-log §8 konsoliderar AUTO allt som kräver lärarens granskning innan REFL körs:

- `concepts_missing` med `transcript_only`-fynd som verkar spontana
- Plan-vs-utfall-avvikelser >25%
- `transcript_only` aktiviteter som inte var i plan
- Tekniska flaggor (transcript_missing, plan_yaml_missing, transcript_order_mismatch)
- Off-topic-noteringar
- Diariserings-fail (om det finns)

**Detta är *en plats* att skanna.** Läraren ser §8 och vet exakt vad hen behöver bekräfta innan REFL.

### Fas 7 — Save + log

Tre filer skapas via `intelligent_save`:

```typescript
// A1 — om transkript finns
intelligent_save({
  content: <A1 markdown>,
  content_type: "content",
  suggested_path: "Student_Materials/lektion_<datum>_content_<topic>.md"
})

// A2 — om plan finns (full eller partiell)
intelligent_save({
  content: <A2 markdown>,
  content_type: "recap",
  suggested_path: "Student_Materials/lektion_<datum>_recap_<topic>.md"
})

// B — alltid
intelligent_save({
  content: <Auto-log markdown>,
  content_type: "auto_log",
  suggested_path: "Analysis/<datum>-<topic>-autolog.md"
})
```

Varje save valideras mot metadata-schemat. Saknad transkript triggar `MISSING_TRANSCRIPTS`-validering på A1, saknad plan triggar `MISSING_LESSON_PLAN` på A2.

Efter save: `log_process_event` för varje fil:

```typescript
log_process_event({
  type: "material_produced",
  files: ["Student_Materials/...", "Analysis/..."],
  depth: "auto",
  trigger: "post_lesson_auto"
})

log_process_event({
  type: "taught",
  files: ["Lesson_Plans/..."],
  depth: "completed",
  trigger: "post_lesson_auto"
})
```

Detta loggar in i `_system/logs/process_log.yaml` för att kursrevisionens aggregering ska kunna hitta lektionsdata senare.

---

## Output-matris (sammanfattning)

| Fas | Output | content_type | Villkor | Routning |
|---|---|---|---|---|
| 3 | A1 Content | `content` | Transkript finns | `Student_Materials/<lesson>/` |
| 4 | A2 Recap | `recap` | Plan-YAML eller plan-text finns | `Student_Materials/<lesson>/` |
| 5 | B Auto-log | `auto_log` | Alltid (tunn om data saknas) | `Analysis/` |
| 7 | Process-events | — | Efter save | `_system/logs/process_log.yaml` |

---

## Spänningar att hålla i AUTO

### AUTO är ställning, REFL är mening — men gränsen är skör

AUTO ska aldrig tolka. Men AUTO väljer också vad som *visas* (Phase 1.5-filter, off-topic-bedömning). Den valhandlingen är nästan tolkning.

**Hur hanteras spänningen?** Källtagging på allt. Lärar-korrigerbarhet via §8 manual review. AUTO kan ha fel — men då ska det vara synligt och korrigerbart. *Aldrig låsa in en bedömning utan flagga.*

### Plan vs utfall som anklagelse vs. observation

Den största designrisken: jämförelse plan-vs-utfall kan kännas som granskning av läraren. *"Du genomförde inte aktivitet 3"*.

**Hur hanteras spänningen?** Språk: *"Aktivitet 3 markerades inte som genomförd"* (passiv, neutral). Visualisering: tabell med avvikelser, inte värdeladdade emojis. Princip: AUTO är *intern logg* för läraren själv, inte rapport till någon annan.

### Learning analytics vs. lärarens omdöme

AUTO ÄR learning analytics — på det mest direkta sättet i hela MCP:n. Detta är *the* spänningen.

**Hur hanteras spänningen?**

- *Teacher-facing only.* AUTO-output går aldrig vidare till administration eller andra lärare. Privat per lärare.
- *Lärarens omdöme har slutord.* §8 manual review är där läraren *korrigerar* AUTO innan REFL och innan kursrevision aggregerar.
- *AUTO surfar, läraren tolkar.* AUTO säger aldrig *"detta var bra"* eller *"detta var dåligt"*. Bara *"detta hände"*.
- *Källtagging.* Allt har spårbar härkomst — ingen black-box.

### Transkriberings-feltolkning

KB-Whisper transkriberar talspråk. Felaktigheter förekommer. AUTO kan citera felaktigt transkript som om det vore sant.

**Hur hanteras spänningen?** Princip: ordagranna citat undviks i Auto-log §3–5. Sammanfattningar med källtag är att föredra. Originalljud sparas alltid (från KB-Whisper-pipelinen) — om läraren tvekar kan hen lyssna.

---

## GDPR

| Datatyp | Hantering |
|---|---|
| Lektionstranskript | Bearbetas av AUTO i kursmappen — innehåller *lärarröst* + ev. *elevröst*. **GDPR-känsligt.** |
| Elevcitat i transkript | Aggregerad nivå, inte attribuerad. Ingen elev får identifieras i AUTO-output. |
| Lärarcitat | OK, det är lärarens egen data. |
| Auto-log innehåll | Privat per lärare, sparas i kursmappen — ej delning. |
| Diariserings-output | Talare anonymiseras (`speaker_1`, `speaker_2` etc.) — namn aldrig sparas. |

**Princip:** AUTO bearbetar transkript men ska *inte* attribuera citat till individuella elever. Aggregering sker på nivån "någon elev frågade", inte "Elev X frågade". Content-scanner körs på AUTO-output innan save för att flagga oavsiktlig identifiering.

---

## Tools som används

| Tool | Roll i AUTO |
|---|---|
| `parse_lesson_transcript` | Pyannote-parsing, garanterar full coverage. Iterativ via `mode: 'summary'` → `mode: 'segments'` |
| `parse_lesson_plan_yaml` | Extraherar `uppgifter`, `presentationer`, `learning_objectives` |
| `find_context` | Hittar lektionsplan och relaterade idéer/reflektioner |
| `file_read` | Läser transkript och plan |
| `intelligent_save` | Sparar A1, A2, B med rätt content_type och validering |
| `log_process_event` | Loggar `taught` och `material_produced` events |
| `load_methodology` | Laddar detta dokument vid trigger |

**Inga nya tools krävs för AUTO v3.0.**

---

## Integration med andra processer

### AUTO → Pre-lesson (nästa)

Auto-log är pre-lessons Fas 2A datakälla — explicit, inte implicit. `find_context` med `content_types: ['post_lesson_auto']` returnerar senaste auto-log och pre-lesson läser:

- §3 genomförda begrepp → matar pre-lesson-utkast
- §4 concepts_missing → kandidater för återbesök
- §2 plan-vs-utfall → kalibrerar timing
- §8 manual review → granskning innan ny planering

### AUTO → REFL (samma lektion)

Auto-log är REFL:s underlag. När läraren initierar REFL läser methodology in:

- §1 lektionsdata som kontext
- §2 plan-vs-utfall som *vad-hände*-grund
- §4 concepts_missing som triggers för Gibbs-frågor
- §8 manual review som *vad behöver läraren bestämma sig om*

**REFL är inte automatisk.** Läraren initierar Gibbs-arbetet. AUTO bara *bygger underlaget*.

### AUTO → Kursrevision

`log_process_event` med `taught` och `material_produced` skriver till `_system/logs/process_log.yaml`. Kursrevision (kurscykelns revision-fas) aggregerar från denna logg.

### AUTO → Course-design (nästa upplaga)

Återkommande mönster i Auto-log §4 (concepts_missing) över flera lektioner blir *drift-detektion* i kursrevision och kandidater för omdesign nästa upplaga.

---

## Brygga framåt — när AUTO triggar cross-cycle-bryggor

AUTO är en av de viktigaste *emitterande* punkterna för bryggor mellan lektionscykeln och övriga cykler. Två bryggor kan triggas direkt från AUTO-output. Dokumentation per [Synlighetsprincipen](../synlighetsprincip.md): **policyn (B) + handlingen (C) bor här som prosa; detektionen (A) är ren kod-mekanik.**

> **Läs-mönster:** Efter att en post_lesson_auto-körning slutförts, utvärdera båda triggrarna nedan mot nuvarande tillstånd. Om någon trigger slår — föreslå för läraren med exakt formulering nedan. Om ingen — fortsätt utan att flagga.

### `lesson_to_course_bridge` — när lektion-mönster blir kursnivå-data

**Villkor (B):** Cowork ska föreslå bryggan när minst ett av följande gäller, sett över **2–3 veckor bakåt** i samma kurs:

- Tre eller fler `post_lesson_auto`-körningar har landats i samma tema/topic
- §4 (concepts_missing) visar samma begrepp över ≥3 lektioner i rad
- §2 (plan vs utfall) visar systematisk drift på samma block-typ (>20 % off i ≥3 körningar)
- Läraren själv uttrycker mönster: *"Jag hinner aldrig X"*, *"Samma sak händer varje gång"*, *"Tredje lektionen i rad..."*

**Handling (C):** föreslå för läraren med exakt formulering:

> *"Du har nu [N] post-lesson-loggar i [tema] över [tidsperiod] och jag ser [mönstret konkret beskrivet utan värdering]. Ska jag bygga bron till kursnivån — `lesson_to_course_bridge` — så vi kan se mönstret tillsammans och eventuellt utlösa en kursrevision?"*

Vid lärarens **ja:** invokera `load_methodology('lesson_to_course_bridge')` och fortsätt enligt bryggans interna mekanism (se `bridges/lesson_to_course.md`).

Vid **nej** eller **inte än:** inga vidare åtgärder. Återrapportera inte automatiskt vid nästa AUTO-körning förrän mönstret förstärkts ytterligare (ny förekomst).

**Detektion (A):** Cowork använder `aggregate_logs(workspace, content_types: ['post_lesson_auto'], window: '21 days')` och `find_context` för att räkna förekomster. Räkningen är ren mekanik — *vad räkningen betyder* står här i metodfilen.

**Tröskelnivåerna (3 körningar, 2–3 veckor, 20 % drift) är *suggestiva*, inte hårda.** Om läraren tycker bryggan föreslås för tidigt eller för sent — redigera detta stycke. Cowork följer det reviderade villkoret vid nästa session. *Ingen* tröskel ska ligga gömd i kod eller i SYSTEM_INSTRUCTIONS.

Se `methodology/bridges/lesson_to_course.md` för bryggans interna mekanism, teoretisk grund (Stenhouse, Laurillard) och output-format.

### `student_data_to_teacher_bridge` — när bedömningsdata landar

**Villkor (B):** Cowork ska föreslå bryggan när minst ett av följande gäller:

- Ett nytt `teacher_insight` har skrivits till `Data/Teacher_Insights/` av Assessment_suite *och* det rör en lektion vars AUTO-output finns
- En exit ticket-batch har sparats i `Data/Student_Reflections/` *efter* att AUTO körts på samma lektion
- Läraren explicit frågar *"vad säger datan om..."*

**Handling (C):** Cowork inviterar till tolkning *utan att tolka själv*. Exakt formulering:

> *"Det finns ny data från [källa] som kopplar till lektionen [datum/topic]. [Mönstret konkret beskrivet utan värdering, t.ex. '70 % missade Q3 om dendritens funktion'.] Hur ser du på detta? Vill du att vi reflekterar över det tillsammans i en post_lesson_refl med data-perspektiv?"*

Vid lärarens **ja:** invokera `load_methodology('student_data_to_teacher_bridge')` och fortsätt enligt bryggans mekanism — vilket *primärt* är att initiera en post_lesson_refl med data_source-länkad annotering.

Vid **nej:** ingen åtgärd. Datan ligger kvar i `Data/`-mappen för manuell granskning när läraren själv väljer.

**Detektion (A):** Cowork läser `Data/Teacher_Insights/` och `Data/Student_Reflections/` (mtime senaste 7 dagar) och matchar mot lektionsdatum.

**Princip från bridge-doc:en — Selwyn-medvetenhet:** Cowork ska *inte* tolka data åt läraren. Aldrig *"70 % missade — det är dåligt"*. Bara *"70 % missade. Hur ser du på det?"*. Tolkning är lärarens domän — det är just det som är poängen med denna brygga.

Se `methodology/bridges/student_data_to_teacher.md` för bryggans designprincip och GDPR-resonemang.

---

## Edge cases

### Transkript saknas helt

Möjliga skäl: inspelning glömdes, KB-Whisper kraschade, fil korrupt.

**Methodology fallback:**

- A1 hoppas över (hård regel)
- A2 partiell baserad på plan-YAML
- B Auto-log tunn variant — §1, §3 (endast plan_yaml-tag), §7, §8
- §8 begär lärarnotering: *"Transkript saknas. Lägg till manuell notering: vad togs upp, vad inte? Kör om AUTO när noteringen finns."*

### Diariseringsfail

Transkript finns men talare kan inte separeras (KB-Whisper rapporterar `diarisation: failed`).

**Methodology fallback:**

- A1, A2, B körs som vanligt — diarisering är inte hårdkrav
- §7 flaggar: *"Talare kunde inte separeras. Citat attribueras inte."*
- §3–5 noterar källa som *transcript_only* utan attribution

### Lektionsplan saknas YAML

Plan-fil finns men ingen YAML-frontmatter (legacy).

**Methodology fallback:**

- `parse_lesson_plan_yaml` returnerar tomt frontmatter + body
- AUTO behandlar body som `plan_text`-källa (lägre tillit än `plan_yaml`)
- A2 partiell + flagga *plan_yaml_missing*
- §7 flaggar för migrering: *"Lektionsplan saknar YAML — kandidat för migration till v0.3-format"*

### Filnumrering vs kronologisk ordning

Transkript-filer kan numreras olika än de spelades in. AUTO heuristik:

- Använd `created`-timestamp i frontmatter över filnamnsordning
- Om timestamps saknas, fallback till filnamn
- Om diskrepans upptäcks: §7 *transcript_order_mismatch*-flagga

### Off-topic-detektion

Heuristik:

- Begrepp som ej finns i lektionsplan-topics, kursens ILO, eller Klafki-skiss
- Längre exkurser identifieras via topic-modeling i transkript

**Lärar-korrigerbarhet:** §6 listar förslagna off-topics. Läraren kan i §8 markera *"detta var inte off-topic, det var del av min undervisning"*.

### Plan finns men ingen lektion ägde rum

Lektionen ställdes in. `find_context` hittar plan men inget transkript och inget process-log-event.

**Methodology fallback:**

- AUTO frågar läraren: *"Hittade en plan för [datum] men inget transkript. Ägde lektionen rum?"*
- Om nej: log_process_event med `type: cancelled`, ingen A1/A2/B
- Om ja men ingen inspelning: kör tunn variant

---

## Kvalitetskriterier

### En bra Auto-log har:

**Faktagrund:**

- Källtag på allt (`plan_yaml`, `plan_text`, `transcript_only`, `both`, `transcript_missing`)
- Plan-vs-utfall numeriskt redovisat
- Inga tolkningar — bara observationer
- §8 ärlig — listar allt som behöver granskning

**Strukturerat:**

- Alla 8 §-sektioner närvarande (även om vissa är tomma med förklaring)
- YAML frontmatter komplett
- Wikilinks till plan, transkript, ev. tidigare auto-log

**GDPR-renat:**

- Inga elevnamn
- Aggregerade citat ("någon frågade…")
- Content-scanner körd

**Korrigerbart:**

- §8 manual_review listar konkreta åtgärder
- Lärarens ändringar i §8 reflekteras tillbaka i §3–§6

### En dålig Auto-log har:

- Tolkning där det skulle vara observation (*"det här fungerade dåligt"*)
- Saknad källtagging
- Genererad A1 utan transkript (brott mot hård regel)
- Off-topic blandat in i A1/A2 utan markering
- §8 tom när tekniska flaggor finns
- Elevnamn kvar
- Inga wikilinks till källor

---

## Output-exempel (kort, Auto-log §1–§3)

```markdown
---
type: auto_log
created: 2026-09-22T11:42:00Z
date: 2026-09-22
course_instance: KURS101_2026
tags: [auto_log, fotosyntes, kurs101, lektion_15]
status: draft
metadata_version: 1
provenance: post_lesson_auto_v3
based_on:
  - "[[Lesson_Plans/2026-09-22-fotosyntes]]"
  - "[[Data/Transkript/2026-09-22_fotosyntes.json]]"
related_outputs:
  - "[[Student_Materials/lektion_260922_content_fotosyntes]]"
  - "[[Student_Materials/lektion_260922_recap_fotosyntes]]"
ci_points:
  - "Mörkerreaktion: lärare gick igenom på 8 min (planerat 15)"
  - "Spontan diskussion om fotosyntes och CO2-utsläpp (15 min, ej planerat)"
plan_yaml_missing: false
plan_text_only: false
transcript_missing: false
diarisation_status: success
transcript_order_mismatch: false
---

# Auto-log — KURS101 — 2026-09-22 — Fotosyntes

## §1 Lektionsdata

- **Datum/tid:** 2026-09-22, 10:00–11:00
- **Kurs:** KURS101_2026
- **Topic:** Fotosyntes
- **Lektionsplan:** [[Lesson_Plans/2026-09-22-fotosyntes]]
- **Transkript:** [[Data/Transkript/2026-09-22_fotosyntes.json]]
- **Diarisering:** success (3 talare identifierade: lärare + 2 elevgrupper)
- **Längd:** planerat 60 min, faktiskt 67 min

## §2 Plan vs utfall

| Block | Planerat | Faktiskt | Avvikelse | Källa |
|---|---|---|---|---|
| Introduktion | 10 min | 12 min | +20% | both |
| Ljusreaktion | 25 min | 31 min | +24% | both |
| Mörkerreaktion | 15 min | 8 min | -47% | both |
| C4-växter | 5 min | 0 min | -100% | plan_yaml |
| Diskussion | 10 min | 16 min | +60% | both |

> *Mörkerreaktion-blocket genomfördes på 8 min av planerade 15. C4-växter-blocket genomfördes inte. Diskussionen blev längre än planerat.*

## §3 Genomförda begrepp

- ATP-bildning — `both` (planerat + uttryckt 4 ggr i transkript)
- Fotosystem II — `both` (planerat + uttryckt 2 ggr)
- Klorofyll-funktion — `both`
- Calvin-cykel — `plan_yaml` (planerat men endast nämnt 1 gång i transkript, ingen utvecklad förklaring)
- Solpanel-analogi — `both` (analogi från plan, utvecklad i transkript 18:30–20:45)
- CO2-utsläpp och klimatförändring — `transcript_only` (spontan diskussion 35:10–48:05, ej i plan)
- C4-växter — `plan_yaml` (planerat men inte i transkript → utelämnat)

## §4 concepts_missing

- Calvin-cykel: planerad förklaring 15 min, fick endast 8 min — kandidat för återbesök
- C4-växter: planerat helt, inte taget upp — be lärare bekräfta i §8
- Mörkerreaktion-detaljer (RuBisCO, CO2-fixering): nämnda men ej utvecklade i transkript

[... fortsätter med §5–§8 ...]
```

---

## Bibliotek — prompts & frågor

AUTO är till stor del icke-interaktiv (systemet kör), men några dialog-moment förekommer. Här samlas standardprompter.

### Trigger-bekräftelser

- *"Hittade transkript och plan för [datum/topic]. Vill du köra full AUTO?"*
- *"Endast plan finns för [datum]. Kör tunn AUTO (A2 + tunn auto-log)?"*
- *"Endast transkript finns för [datum]. Kan inte generera A1 utan plan-struktur. Vill du köra A2 partiell + Auto-log?"*

### Vid saknat transkript

- *"Transkript saknas för [lektion]. Lägg till en kort lärar-notering: vad togs upp, vad inte? Då kan jag generera tunn auto-log."*

### Vid off-topic-detektion

- *"§6 har 1 spontan avvikelse: [topic]. Var det av-spårning eller del av undervisningen? (Påverkar §3-tagging)"*

### Vid manual review

- *"§8 har [N] punkter att granska. Vill du gå igenom dem nu, eller spara och göra senare?"*

### Vid Save-bekräftelse

- *"Sparar A1 till `Student_Materials/...`, A2 till `Student_Materials/...`, B till `Analysis/...`. OK?"*

---

## Relaterade dokument

- **`pedagogisk_arkitektur.md`** — överliggande arkitektur, tre cykler, spänningar
- **`pre_lesson.md`** — pre-lesson-fasen, läser AUTO i Fas 2A
- **`post_lesson_refl.md`** — REFL-fasen, läser AUTO som underlag
- **`bridge.md`** — bryggan mellan REFL och nästa pre-lesson

---

## Versionsanmärkning

**v3.0** — 2026-04-26.

**Teoretisk grund:** Schön reflection-on-action (faktasidan), Argyris & Schön (in-use surfas, espoused jämförs i REFL), Black & Wiliam (formativa avläsningspunkter checkas), verbalprotokoll-forskning (Ericsson & Simon, transkript som verbalprotokoll), kritiska linjen (Moore, Akbari — AUTO undviker tolkning).

**Process-utvidgningar (nya):**

- Fas 0 — explicit input-check och scenarie-bestämning (4-cells trigger-matris)
- Fas 1 — källtagging-konvention (`plan_yaml` / `plan_text` / `transcript_only` / `both` / `transcript_missing`)
- Fas 2 — Phase 1.5 kandidatfilter
- Fas 3 — A1 Content med hård regel "kräver transkript"
- Fas 4 — A2 Recap villkorlig + plan-YAML primär källa
- Fas 5 — B Auto-log alltid, mer eller mindre tunn
- Fas 6 — §8 manual review konsoliderad
- Fas 7 — Save + log_process_event

**Spänningar (fyra):**

- AUTO ställning vs REFL mening
- Plan-vs-utfall som anklagelse vs observation
- Learning analytics vs lärarens omdöme
- Transkriberings-feltolkning

