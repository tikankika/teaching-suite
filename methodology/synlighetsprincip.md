# Methodology — Synlighetsprincipen

*Methodology v3.0.1, 2026-05-03. Spec-dokument för automation-styrning. Komplement till `pedagogisk_arkitektur.md` och `tensions.md`.*

---

## Vad detta dokument är

Synlighetsprincipen är **den enda regel som styr var Cowork:s automatiska initiativ får specificeras**. Den löser den konkreta paradoxen mellan automation och lärar-kontroll genom en arkitektonisk gränsdragning.

Detta är inte en pedagogisk princip — det är en *teknisk-arkitektonisk* designregel. Den styr inte *vad* AI ska göra, utan *var* reglerna för vad AI gör måste bo.

**Användning av Cowork:** läs vid varje designval som rör AI-initiativ. Om designvalet handlar om "när ska AI göra X automatiskt", *måste* svaret kunna spåras till en metodfil läraren kan läsa, ifrågasätta och redigera. Annars bryter beslutet principen.

**Användning av Code:** läs vid varje PR-review som rör SYSTEM_INSTRUCTIONS, MCP-server-side trigger logic, eller automation-routing. Compliance-test nedan.

---

## Paradoxen

Lärar-MCP:n vill samtidigt två saker:

1. **Automatisera arbetsflöden** så läraren slipper hålla allt i huvudet — när är det dags att brygga lektion till kurs, när ska reflektion föreslås, när ska Klafki-test invokas
2. **Bevara lärarens agency** — läraren ska kunna stoppa, modifiera, ifrågasätta varje automatiskt steg, och *förstå varför* AI gjorde som det gjorde

Den naiva läsningen ser dessa som motsägande. Mer automation = mindre kontroll. Mer kontroll = mindre automation. Det är fel.

Den verkliga frågan är inte *hur mycket* automation, utan *var* automationens regler står skrivna.

---

## Principen

> **Policyn synlig, implementeringen fri.** Allt Cowork *gör på lärarens vägnar* — vilket initiativ som tas, under vilket villkor det tas, med vilket budskap till läraren — måste specificeras som prosa i en metodfil läraren kan läsa, ifrågasätta och redigera. *Hur* Cowork mekaniskt detekterar att villkoret är uppfyllt får vara kod. Methodology är den enda legitima styrmekanismen för **policyn**; kod är fri zon för **implementeringen**.

Tumregel: om läraren frågar *"varför gjorde du det?"* måste svaret kunna pekas ut i en metodfil. Frågan *"hur visste du att villkoret var uppfyllt?"* får besvaras med *"en räknefunktion läste process-loggen"* — det är OK.

Tre konsekvenser följer.

**Automatisering blir möjlig.** Cowork får ta initiativ — invokera enums, föreslå bryggor, syntetisera, sammanfatta — utan att läraren först har bett om det.

**Bromsen är inbyggd.** Varje automatiskt initiativ passerar genom ett *förslag* till läraren. *"Jag ser att du har tre post-lesson-loggar i Tema 5 sista veckan. Ska jag bygga bron till kursnivån nu?"* Läraren säger ja, nej, eller "inte än". Förslaget är reversibelt; ingen åtgärd tas innan läraren sagt ja.

**Synligheten är garanterad.** Villkoret för att förslaget kommer — *när* Cowork räknar att det är dags att fråga — står som prosa i metodfilen. Inte i SYSTEM_INSTRUCTIONS. Inte i koden. Läraren kan öppna metodfilen och läsa: *"Efter [X villkor] föreslå att invokera lesson_to_course_bridge"*. Om villkoret är fel: läraren *redigerar metodfilen*. Cowork följer redigeringen vid nästa session.

---

## Tre saker att skilja på — policy, handling, detektion

Principen krattar inte ihop alla AI-relaterade beslut. Tre olika kategorier hanteras *olika*:

**(A) Detektionen** — *att något har hänt*. Att räkna filer, söka tidsstämplar, jämföra teman, läsa process-loggen, parsa YAML. Mekanisk informationsinhämtning. **Får vara kod.** Läraren bryr sig inte om *hur* räkningen sker — bara att rätt data nås.

**(B) Villkoret (policyn)** — *regeln om när det är dags att agera*. "Efter tre eller fler post_lesson_auto-körningar i samma tema, föreslå brygga." Det är pedagogisk policy. **Måste i methodology.** Läraren ska kunna läsa, ifrågasätta, redigera *tröskeln*.

**(C) Handlingen** — *vad AI ska göra när villkoret slår*. "Säg till läraren: 'Ska jag bygga bron till kursnivån nu?' och invokera lesson_to_course_bridge vid ja." **Måste i methodology.** Läraren ska veta exakt vad AI:n gör och säger.

Det avgörande felet i en system-centrerad design är att blanda (B) och (C) in i (A) — "smart automation" där tröskeln, beslutet och meddelandet ligger gömt i kod eller SYSTEM_INSTRUCTIONS. Den raffinerade principen tillåter (A) att vara fri men låser (B) och (C) i methodology.

**Konkret exempel — bridge-trigger korrekt designad:**

I `methodology/lesson/post_lesson_auto.md`, sektion *"Brygga framåt"* (B + C som prosa):

> Efter att tre eller fler post_lesson_auto-körningar landats i samma tema under en kort tidsperiod (vecka–två), föreslå för läraren:
>
> *"Du har nu tre post-lesson-loggar i [tema]. Ska jag bygga bron till kursnivån — `lesson_to_course_bridge` — så vi kan se mönstret tillsammans?"*
>
> Tröskeln (tre, vecka–två) är *suggestiv*, inte hård. Redigera detta stycke om mönstret är fel.

I koden (A) — en hjälpfunktion som mekaniskt räknar:

```typescript
// Pure plumbing — counts post_lesson_auto runs by theme over a time window.
// The decision to act on counts lives in methodology.
function countRecentPostLessonsByTheme(workspace, daysWindow): Record<theme, number>
```

Funktionen *värderar inte* om tre är många nog — den bara räknar. Methodology säger "om tre eller fler — föreslå". Kod säger "här är räkningen". Gränsen är skarp och respektabel.

---

## Defensiva lässtrukturer i SYSTEM_INSTRUCTIONS

SYSTEM_INSTRUCTIONS är inte helt förbjudet. Det är *en del* av dess användning som är förbjudet.

**OK i SYSTEM_INSTRUCTIONS — *läs-instruktioner*:**

Instruktioner om *vart* methodology ska läsas, *när* den ska konsulteras, *hur* den ska tolkas. Exempel:

- *"När du laddar en cykel-methodology, leta alltid efter en *Brygga framåt*-sektion och utvärdera dess villkor."*
- *"Före du sparar en lektionsplan, läs Pre-save valideringschecklistan i pre_lesson.md."*
- *"När läraren ber om en reflektion, ladda post_lesson_refl.md innan du börjar."*

Detta är meta-mönster. Det säger inget om *vad* AI ska göra — bara *vart* den hittar instruktionerna. Synlighet bevarad eftersom faktiska beslutet alltid ligger i metodfilen.

**Inte OK i SYSTEM_INSTRUCTIONS — *do-what*-instruktioner:**

Instruktioner som hardcodar policy eller handling. Exempel:

- *"Efter tre post_lesson-körningar i samma tema, föreslå brygga"* — det är policy (B). Måste i methodology.
- *"Säg alltid 'Klafki säger att...' när du presenterar exemplaritet"* — det är handlingsformulering (C). Måste i methodology.
- *"Tystna under själva lektionen"* — fel plats; det står redan korrekt i pre_lesson.md rad 506–510.

Tumregel: SYSTEM_INSTRUCTIONS får säga *"läs methodology"*. Den får inte säga *"agera så här"* om sak som rör pedagogiskt beslut.

---

## Hur garanterar vi att inget missas

Synlighet riskerar coverage-problem: om triggers står i methodology och Cowork ska läsa methodology, vad händer om läsmönstret slarvas? Tre samverkande mekanismer.

**(1) Strukturkonvention.** Varje cykel-doc har en *"Brygga framåt"*-sektion på en förutsägbar plats. Cowork lär sig mönstret: *när jag läst en cykel-doc, kolla alltid Brygga framåt-sektionen*.

Specifikt: *Brygga framåt*-sektionen placeras mellan *"Integration med andra processer"* och *"Edge cases"* i cykel-doc:erna. Bidirektionella sektioner (cykel-doc:er som både tar emot och emitterar) använder rubriken *"Bryggor — vad X tar emot och vad X skickar vidare"* på samma plats. Konventionen är konsekvent över de 9 cykel-doc:erna och bör hållas vid framtida tillägg.

**(2) Defensiv läs-instruktion i SYSTEM_INSTRUCTIONS.** *"När du laddar en cykel-methodology, sök alltid efter Brygga framåt-sektion och utvärdera dess villkor mot nuvarande tillstånd."* Detta är meta-läs-mönster — inte do-what-logik. Synlighet bevarad eftersom triggern fortfarande bor i methodology.

**(3) Verifieringstool — `list_active_triggers(workspace)`.** Kallbart närsomhelst (av lärare eller Cowork). Funktionen:

- Läser alla *"Brygga framåt"*-sektioner i workspace methodology
- Utvärderar varje villkor mot nuvarande tillstånd (process_log, find_context-output)
- Returnerar prosatext + tillståndsdata: *"post_lesson_auto.md säger 'efter 3 körningar samma tema, föreslå' — nuläge: 4 körningar i Tema 5 — TRIGGER AKTIV"*

Verktyget är ett kraftfullt skydd mot drift: läraren kan när som helst granska *"vad gör Cowork bakom min rygg?"* — och svaret är alltid *"ingenting som inte står i methodology"*. Det är inverterad övervakning. Verktygets *output* är synligt; dess *evaluering* är mekanisk. Compliance-test passerat.

---

## Methodology som single source of truth

Den traditionella läsningen av methodology är: *dokumentation av vad systemet gör*. Den är fel.

Den korrekta läsningen är: methodology är **specifikation av vad systemet ska göra**. Cowork läser metodfilerna och *beter sig* som de säger. Om metodfilen säger "föreslå X efter villkor Y", händer det. Om den säger "tystna här", tystnar AI:n. Det finns inget annat sätt att styra AI:ns initiativ.

Detta är *ren AI-mediering*. Methodology är **den enda mekanismen** för teacher → AI-styrning. Inte den primära. Den enda.

Operativt:

- Cowork:s SYSTEM_INSTRUCTIONS säger *hur* methodology ska läsas och följas — inte *vad* AI:n ska göra
- Kod-logik gör *plumbing* — filhantering, parsing, validering — inte beslutslogik
- Methodology specificerar varje pedagogiskt initiativ Cowork får ta

Resultatet: läraren kan, genom att redigera methodology, **omprogrammera** Cowork:s beteende utan att röra någon kod, utan att förstå MCP-protokoll, utan att be om en ny release.

---

## Vad principen *inte* säger

Principen handlar om *initiativ*. Inte om *kod-funktionalitet* i största allmänhet.

**OK i kod, inte i methodology:**

- Filhantering, sökning, parsing, validering, schema-checks
- Fil-routing (vilken fil som laddas för vilken enum)
- Säkerhet (workspace-validering, GDPR-skanning, path traversal-skydd)
- Plumbing-prestanda (caching, fallback-paths)
- **Detektions-mekanik** — funktioner som räknar filer, läser process-logg, parsar timestamps, jämför teman, evaluerar villkor mot data. Ren *informationshämtning* utan policy-värdering.

Detta är *infrastruktur*. Det handlar inte om vad AI gör med innehållet eller om hur det beslutar att göra det. Synlighetsprincipen rör inte detta.

**Inte OK i kod, måste i methodology:**

- "När ska Cowork föreslå X?" (villkor / policy)
- "Vilka frågor ska Cowork ställa?" (handling)
- "I vilken ordning ska Cowork samla data?" (process-flöde)
- "När ska Cowork tystna och bara observera?" (regel-undantag)
- "När ska Cowork pusha tillbaka mot ett lärarval?" (intervention)
- "När ska Cowork invokera en bridge eller tension?" (cross-cycle-trigger)

Detta är *policy* och *handling* — kategori (B) och (C) ovan. Allt sådant ska vara prosa i metodfiler. Mekaniken (A) som *räknar* eller *läser* för att utvärdera villkoret får vara kod; *beslutet* baserat på räkningen får inte.

---

## Compliance-test

Ett konkret test för designval. Använd vid PR-review, design-diskussion, code-review.

**Två frågor — i ordning:**

**Fråga 1 — Policy-frågan:** *"Varför gjorde Cowork det här?"*

Test: Kan svaret spåras till en specifik mening eller paragraf i en metodfil läraren har tillgång till?

- **Ja → principen följs.** Designvalet är OK.
- **Nej → principen bryts.** Antingen flytta policyn till en metodfil, eller ompröva designvalet.

**Fråga 2 — Detektion-frågan:** *"Hur visste Cowork att villkoret var uppfyllt?"*

Test: Är detektionen ren mekanik (räkning, fil-IO, parsing) som *informerar* policyn utan att *värdera* den?

- **Ja → kod är OK.** Funktionen bara hämtar fakta. Policyn (vad som ska göras med fakta) bor i methodology.
- **Nej → principen bryts.** Om detektionen *innehåller* tröskeln eller *avgör* handlingen själv, har policy och detektion blandats. Separera.

**Specialfall — pseudo-detektion:** En "detektions-funktion" som internt har inbyggd tröskel — `function shouldSuggestBridge(): boolean` — är inte ren detektion. Den är policy förklädd. Bryt isär: en `count` som returnerar antal, plus en metodfil-rad som säger "om antal ≥ 3 — föreslå".

**Specialfall — "implicit i metodfilen":** Räknas inte. Om triggern inte är *uttryckligen* skriven är den inte synlig för läraren.

**Specialfall — "policy i SYSTEM_INSTRUCTIONS":** Räknas inte. SYSTEM_INSTRUCTIONS är osynlig för läraren — det är systemprompt, inte dokumentation. *Läs-instruktioner* (vart methodology ska konsulteras) är OK där; *do-what-instruktioner* (vad som ska göras) är inte. Se sektionen *Defensiva lässtrukturer* ovan.

---

## Exempel — vad principen tillåter

### Trigger-fraser i pre_lesson.md (rad 95–100)

```markdown
Pre-lesson startas av lärarfrasen i Claude Desktop:

- *"Planera nästa lektion om [topic]"*
- *"Jag ska undervisa [topic] [datum]"*
- *"Hjälp mig förbereda [topic]-lektion"*
- *"Förbered [topic] för [grupp]"*
```

Detta är synligt. Läraren kan läsa metodfilen och förstå exakt vilka fraser som triggar pre-lesson-arbetsflödet. Vill läraren lägga till en fras — redigera filen.

### Konstruktiv pushback i pre_lesson.md (rad 459–469)

```markdown
**Konstruktiv pushback — princip:**

Methodology ska tillåta att Claude *invänder* när lärarens val går emot
historik eller pedagogisk princip. Inte vetorätt — utan en notering så
läraren kan välja medvetet.
```

Detta är synligt. Läraren vet att AI:n har rätt att invända, hur invändningen ska formuleras, och att läraren själv har sista ordet.

### Tystnad under själva lektionen i pre_lesson.md (rad 506–510)

```markdown
> **Lesson-momentet — MCP tystnar.** Under själva lektionen är MCP:n inte aktiv...
```

Detta är synligt. Läraren vet att AI:n medvetet är tyst i ett specifikt skede, och varför.

---

## Exempel — vad principen förbjuder

### Hypotetiskt: trigger för bridge i SYSTEM_INSTRUCTIONS

```typescript
// In src/index.ts
const SYSTEM_INSTRUCTIONS = `
...
When the user has completed three or more post_lesson_auto runs in the
same theme, suggest invoking lesson_to_course_bridge by saying:
"Ska jag bygga bron till kursnivån nu?"
...
`;
```

Detta bryter principen. Triggern (*tre eller fler post_lesson_auto-körningar i samma tema*) är inte synlig i någon metodfil — den bor i en kod-konstant som läraren aldrig ser. Felet är inte *automation*, det är *placering*.

### Korrekt motsvarighet — methodology + kod separerade

**(B + C) i methodology** — `methodology/lesson/post_lesson_auto.md`, ny sektion:

```markdown
## Brygga framåt — när lektion möter kursnivå

Efter att tre eller fler post_lesson_auto-körningar landats i samma tema
under en kort tidsperiod (vecka–två), föreslå för läraren:

> *"Du har nu tre post-lesson-loggar i [tema]. Ska jag bygga bron till
> kursnivån — `lesson_to_course_bridge` — så vi kan se mönstret tillsammans?"*

Läraren svarar ja, nej, eller "inte än". Vid ja: invokera
`load_methodology('lesson_to_course_bridge')` och starta brygga-arbetet.

Tröskeln (tre körningar, vecka–två) är *suggestiv*, inte hård. Om läraren
återkommande vill ha bryggan tidigare eller senare — redigera detta stycke.
```

**(A) i kod** — ren räknefunktion utan inbyggd tröskel:

```typescript
// Pure plumbing — counts post_lesson_auto runs by theme over a time window.
// Returns counts; the policy (what counts as "many") lives in methodology.
function countRecentPostLessonsByTheme(
  workspace: string,
  daysWindow: number
): Record<string, number>
```

**(Defensiv läs-instruktion) i SYSTEM_INSTRUCTIONS** — meta-mönster, inte do-what:

```typescript
const SYSTEM_INSTRUCTIONS = `
...
When you complete a post_lesson_auto run, before returning to the teacher,
load the cycle methodology and check if it has a "Brygga framåt" section.
If it does, evaluate its trigger condition against current state (using
appropriate plumbing tools) and follow the methodology's instruction.
...
`;
```

Samma automation. Samma trigger. Men **synlig**. Läraren kan läsa policyn (B + C), ifrågasätta tröskeln, redigera meddelandet. Detektionen (A) är mekanisk och osynlig — vilket är OK eftersom den inte innehåller policyval.

---

## Relation till andra principer

### Till "AI hanterar ställningen, människan håller meningen" (`pedagogisk_arkitektur.md`)

Synlighetsprincipen är *operationaliseringen* av denna grundprincip på systemnivå. Grundprincipen säger *vad* labour-divisionen är (struktur vs. mening). Synlighetsprincipen säger *var* labour-divisionen specificeras (i methodology, läsbart för läraren).

### Till `tensions.md` spänning 4 (Learning analytics vs. lärarens omdöme)

Synlighetsprincipen är ett konkret *skydd* mot Selwyns kritik (institutionell LA flyttar omdömet till systemet). När alla AI-initiativ är synligt specificerade i methodology, äger läraren omdömet — formellt, inte bara i intentionen. Datan tjänar reflektionen, men *när och hur* datan presenteras står läraren själv för (genom att redigera methodology).

### Till feedback-regeln "teacher-centered not system-centered"

Synlighetsprincipen är feedback-regelns operationalisering på arkitektonisk nivå. Det räcker inte att intendera teacher-centered design — utan en arkitektonisk gränsdragning kommer system-centrerade lösningar att smyga sig in genom SYSTEM_INSTRUCTIONS, "smart" automation och osynlig business logic. Synlighetsprincipen drar gränsen explicit.

---

## Riskbild — när principen blir svår att hålla

### Frestelse 1 — "Det vore lättare att bara lägga det i SYSTEM_INSTRUCTIONS"

Ja, det vore. SYSTEM_INSTRUCTIONS är centralt skickad, varje session ser det utan att läraren behöver göra något, det är *en* sak att uppdatera. Methodology är distribuerad, läraren måste läsa den, den måste vara konsekvent över flera filer.

Det är just det som är poängen. Synlighetsprincipen *kostar* — det är dyrare att hålla logiken i methodology. Men kostnaden är priset för lärar-agency. När det blir billigare att gå runt principen, drar man åt fel håll.

**Risk-signal:** PR-beskrivning innehåller fraser som "to keep the methodology cleaner, we put this in system_instructions". Stoppa PR:n. Fråga: vilken metodfil ska denna logik bo i?

### Frestelse 2 — "Det är ju bara en liten teknisk detalj"

Synlighetsprincipen handlar inte om size, utan om kategori. En "liten teknisk trigger" som styr när AI:n säger något till läraren är *exakt* den typ av sak principen reglerar. Storleken på koden är irrelevant — placeringen är allt.

**Risk-signal:** små PR:er som lägger till `if user_intent === X then suggest Y`-logik utanför methodology. Behov av compliance-check.

### Frestelse 3 — "Methodology beskriver ju redan detta implicit"

Implicit räknas inte. Om triggern inte är *uttryckligen skriven* i metodfilen är den inte synlig för läraren. Cowork:s tolkning är inte källa — methodology-prosan är källa.

**Risk-signal:** "Cowork förstår av sig själv när det är dags". Kanske Cowork förstår — men läraren förstår inte. Skriv ut det.

---

## När principen *inte* gäller

Synlighetsprincipen rör AI-initiativ i Cowork. Den rör inte:

- **Andra MCP-servrar** (QuestionForge, Assessment_suite). Dessa har egna methodology-domäner och egna styrregler. Synlighetsprincipen är *Teaching Suite-specifik*.
- **Lärarens egna anteckningar utanför MCP**. Methodology styr inte vad läraren själv skriver i Obsidian eller pratar om i en kollegial diskussion.
- **Cowork-funktioner som inte är AI-initiativ** — t.ex. att Cowork öppnar en fil läraren bett om, eller söker efter ord läraren skrev. Det är direkt-respons, inte initiativ. Principen rör fall där AI tar steg utan att läraren bett om dem just nu.

---

## Versionsanmärkning

**v3.0.3** — 2026-05-04. Strukturkonventionen för *Brygga framåt*-sektioner preciserad efter δ-b:s första operativa tillämpning över 9 cykel-doc:er. Sektionen *Hur garanterar vi att inget missas* → *(1) Strukturkonvention* utökas med konkret placering: mellan *"Integration med andra processer"* och *"Edge cases"*; bidirektionella sektioner använder rubriken *"Bryggor — vad X tar emot och vad X skickar vidare"* på samma plats. Tidigare formulering "(sist i body, före versionsanmärkning)" var för grov — den faktiska placeringen Cowork landade i var stabilare och mer logisk. Refineringen kodifierar konventionen så framtida tillägg håller den.

**v3.0.2** — 2026-05-03 (samma dag, raffinerad). En granskning påpekade att den första formuleringen krattade ihop tre olika saker — *detektion*, *villkor*, *handling* — och därmed gjorde principen för grov. En ren räknefunktion eller defensiv läs-instruktion borde inte falla på principen bara för att de bor utanför methodology. Raffineringen separerar (A) detektions-mekanik (kod-fri zon), (B) policyn (måste i methodology), och (C) handlingen (måste i methodology). Compliance-testet utvidgades till två frågor — policy-frågan och detektion-frågan — med specialfall för pseudo-detektion (policy förklädd som detektion). Sektionen *Defensiva lässtrukturer i SYSTEM_INSTRUCTIONS* lades till för att klargöra att läs-instruktioner är OK; bara do-what-instruktioner är inte. Coverage-mekanismer (strukturkonvention, defensiv läsning, verifieringstool) tillagda för att hantera oron *"hur säkerställer vi att inget missas?"*.

**v3.0.1** — 2026-05-03 (initial version). Skriven som följd av att YAML-rensningen i pre_lesson.md (samma datum, samma version) avslöjade ett återkommande mönster: system-centrerade lösningar smög sig in när det "var bekvämare" än att hålla teacher-centered. Synlighetsprincipen formaliserade regeln så avvägningen inte behöver göras på nytt vid varje designval — den är förhandlad en gång, sedan följd.

Principen tillämpas retroaktivt på pre_lesson.md-rensningen: borttagna YAML-fält som `framework`, `didactic_skiss`, `group_context`, `anticipated_difficulties` var system-läsbara strukturer som duplicerade prosan. Synlighetsprincipen säger inte att YAML är förbjudet — den säger att om något är *både* prosa *och* YAML, måste prosan vara den primära. YAML är extraktion för maskin-konsumtion, inte parallell sanning.

Principen tillämpas framåt på PR-δ (bridges enum-registrering):

- **PR-δ-a (kod-plumbing):** enums, filmappningar, en räknefunktion `countRecentPostLessonsByTheme()`. OK.
- **PR-δ-b (methodology):** *"Brygga framåt"*-sektioner i cykel-doc:erna med policy + handling som prosa. OK.
- **PR-δ-c (defensiv lässtruktur i SYSTEM_INSTRUCTIONS):** En instruktion som säger *"läs Brygga framåt-sektionen efter cykel-process"*. OK — meta-läs-mönster, ingen do-what.
- **Inte OK:** SYSTEM_INSTRUCTIONS-text som hardcodar "efter 3 körningar i samma tema, föreslå brygga". Det är policy förklädd. Måste flyttas till methodology.
