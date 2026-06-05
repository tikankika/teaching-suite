# Teaching Suite — Pedagogisk arkitektur

*Arbetsdokument från designsamtal, april 2026*

---

## Grundprincip

Hela systemet vilar på en princip om vad som ska vara mänskligt och vad som ska vara maskinellt:

> **AI:n hanterar ställningen och syntesen. Människan håller omdömet och meningen.**

Detta inverterar den vanliga AI-logiken. Normalt gör AI:n arbetet och människan granskar. Här gör människan meningsskapandet, och AI:n bygger ställningen runt det. Det är vad som skiljer denna ansats från en vanlig "AI-för-lärare"-produkt — den designar för *teacher agency* (Priestley, Biesta & Robinson, 2015), inte för effektivitet.

Praktiskt verktyg för att avgöra "vad ska automatiseras?":

- **Automatisera:** prompting, fångst, strukturering, mönsterdetektion över tid, korsreferens till litteratur, dokumentgenerering från råmaterial
- **Automatisera inte:** själva tolkningen, den pedagogiska bedömningen, relationen, det förkroppsligade vetandet

Om det är *ställning*: ja. Om det är *mening*: nej.

Principen rimmar med Biestas (2017) kritik av *learnification* — den moderna tendensen att tala om "lärande" som om det vore frikopplat från innehåll, undervisning och lärare. När AI flyttas till ställningen, inte till meningen, hålls undervisningen på sin plats som en mänsklig, etisk-praktisk verksamhet (Klafki, 1995/1958).

---

## De tre nästade cyklerna

Lärararbetet rör sig i tre cykler som löper parallellt men i olika tempon, nästade i varandra. Lektionscyklerna lever inuti kurscyklerna, som lever inuti professionscykeln. Datapunkter på en nivå blir material på nästa.

```
              PROFESSIONSCYKEL  (termin–år)
              ┌─────────────────────────────┐
              │                             │
              │   KURSCYKEL  (vecka–månad)  │
              │   ┌────────────────────┐    │
              │   │                    │    │
              │   │  LEKTIONSCYKEL     │    │
              │   │  (timmar–dagar)    │    │
              │   │                    │    │
              │   └────────────────────┘    │
              │                             │
              └─────────────────────────────┘
```

Varje cykel har egna ramverk, egna reflektionsmodeller, och egna frågor. De ska inte konkurrera — de talar i sina respektive tempon.

---

### Lektionscykeln (dagligt tempo)

```
                            ┌─→ POST-LESSON_AUTO ─┐
PRE-LESSON  →  LESSON  ─────┤                      ├──→  BRYGGA
                            └─→ POST-LESSON_REFL ─┘        │
   ↑                                                       │
   └───────────────── kunskap förs vidare ────────────────┘
```

**Domän:** den enskilda lärsituationen
**Tempo:** timmar–dagar
**Lärarens fråga:** "Vad gjorde jag med *dessa* elever idag?"

#### Pre-lesson — intentionellt, framåtvänt arbete

Pre-lesson är *didaktisk design* i strikt mening — att göra explicit vad man ska göra, varför, med vilka, och hur. Klafkis didaktiska analys (1958, vidareutvecklad i den kritisch-konstruktive Didaktik, Klafki 1985/1995) ger den klassiska strukturen i fem frågor:

1. **Exemplarische Bedeutung** — vad står detta innehåll för? Vad allmänt kan läras genom just detta?
2. **Gegenwartsbedeutung** — vad betyder innehållet för eleverna *nu*?
3. **Zukunftsbedeutung** — vad kommer det att betyda för dem?
4. **Sachstruktur** — hur är innehållet uppbyggt internt?
5. **Zugänglichkeit** — hur kan det göras tillgängligt för dessa elever?

Klafki tvingar fram *vad-* och *varför-frågan* före *hur-frågan*. Det är där hans tradition skiljer sig skarpt från amerikansk *instructional design*: bildningens vad är aldrig tekniskt avgjort.

Wiggins & McTighe (2005) lägger till den operativa *backward design*: börja med avsedd förståelse, definiera evidens för lärande, designa lärupplevelsen sist. Deras *six facets of understanding* — explanation, interpretation, application, perspective, empathy, self-knowledge — ger finare textur till vad "kunna" kan betyda än enbart verb-listor i läroplaner.

Ett underanvänt pre-lesson-moment är *anticipatory reflection* (Conway, 2001) — att i förväg tänka igenom vad som kan gå fel, vilka frågor som kan komma, var missuppfattningar är troliga. Lärare gör detta tyst i huvudet; MCP:n kan göra det explicit.

Praktiska frågor i pre-lesson:

- Vad ska eleverna kunna efter lektionen? Vad är det exemplariskt värda i innehållet?
- Vad vet jag om gruppen just nu — förförståelse, förra lektionens efterdyningar?
- Vilket innehåll, vilka aktiviteter, vilken progression?
- Vilka är de svåra ställena? Var brukar det fastna? *(anticipatory reflection)*
- Hur märker jag att de lär sig under lektionen? *(formativ avläsning, Black & Wiliam 1998)*
- Vad är min plan B om det inte funkar?

Data som matar pre-lesson:

| Källa | Vad det bidrar med |
|---|---|
| Post-lesson auto | Strukturerad mall, taggade begrepp från lektionsplanen, jämförelse plan vs utfall, påminnelser från tidigare mönster |
| Post-lesson reflection | Lärarens egna reflektioner — vad hände, vad överraskade, vad landade inte, identifierade justeringar, kvarvarande frågor, planerade ändringar |
| Senaste retrieval-tester (Assessment_suite) | Begrepp med låg hämtningsgrad, vanliga missuppfattningar från distraktoranalys, mönster i öppna svar |
| Senaste prov eller större bedömning | ILO:er med svagt utfall, gemensamma misstag, områden som behöver återbesökas eller omformas |
| Kursens ILO för veckan | Vad eleverna ska kunna |
| Tidigare upplagors revision-anteckningar | Vad lärdes om denna lektion förra året |
| Manifestet | Pedagogiska ställningstaganden som ska gestaltas |

Det är ihopsamlingen som är MCP:ns främsta bidrag på pre-lesson-nivå — ingen människa håller allt detta i huvudet inför varje lektion.

> **GDPR-notering.** Information om enskilda elever — frånvaro, beteenden, incidenter, gruppdynamik — är personuppgifter och kan inte processas av extern AI. Lokalt körda modeller kan i framtiden göra tillgängligt vad som idag måste hållas utanför systemet. Tills dess hanteras sådan information i lärarens egna anteckningar utanför MCP:n.

#### Lesson — handlingens tid

Själva lektionen är där *reflection-in-action* sker (Schön, 1983) — den korta, intuitiva justeringen i stunden, den professionella improvisation som baseras på erfarenhet. Berliners (1988) och Dreyfus & Dreyfus (1980) modeller av expertisutveckling pekar på att det är just denna förmåga — mönsterbaserat omdöme i nuet — som skiljer experten från novisen.

Detta moment är *inte* MCP:ns plats. Verktyget tystnar här. Det enda systemet kan göra är att lyfta fram anteckningar förberedda i pre-lesson som lärarens egen lathund.

#### Post-lesson — meningsskapande, bakåtvänt arbete

Reflection-on-action (Schön, 1983, 1987) är den distanserade tolkningen efteråt — till skillnad från *reflection-in-action* som sker i stunden. Schön argumenterade att lärararbetet rör sig i *"swampy lowlands"* där problem är otydliga, värdeladdade och komplexa, och där professionell kunskap utvecklas just genom denna efterhandstolkning.

Boud, Keogh & Walker (1985) i klassiska *Reflection: Turning Experience into Learning* lägger till tre moment som ofta missas: *returning to experience* (gå tillbaka till händelsen), *attending to feelings* (uppmärksamma känslor — både störande och stödjande), och *re-evaluating experience* (tolka om i ljuset av nytt perspektiv). Detta inför en affektiv dimension som ofta saknas i mer rationella reflektionsmodeller. Känslor är inte distraktion utan data — frustration kan signalera att något inte stämmer i praxis, glädje att något träffat rätt.

Argyris & Schöns (1974) distinktion mellan *espoused theory* och *theory-in-use* gör post-lesson särskilt rik: vi ser ofta i efterhand vad vi *faktiskt* gjorde, inte bara vad vi sa att vi skulle göra. Diskrepansen är data — för revision av praxis eller av manifestet.

Larrivee (2000) skiljer fyra nivåer av reflektion: *pre-reflektiv* (rutinmässig), *ytlig* (tekniska problem), *pedagogisk* (didaktik och kunskap), *kritisk* (etiska och politiska implikationer). MCP-prompten kan medvetet pusha mot djupare nivåer — *"vad fungerade?"* är ytlig, *"för vem fungerade det inte och varför?"* är pedagogisk-kritisk.

Olika cadenser kallar olika modeller:

- **Direkt efter lektionen, när minnet är varmt:** Rolfe, Freshwater & Jasper (2001) — *What? So what? Now what?* — minimalistisk struktur som passar två minuter på cykelvägen hem.
- **En gång i veckan, fördjupat på en utvald händelse:** Gibbs (1988) — beskrivning, känslor, värdering, analys, slutsats, handlingsplan. Sex steg, ett uthålligt format.

Verbalprotokoll-forskningen (Ericsson & Simon, 1980/1993) visar att *omedelbar* reflektion fångar något kvalitativt annat än fördröjd. Tal nära händelsen är rikare på halvtänkta tankar, tvekan, autenticitet. Skriven reflektion några dagar senare blir lätt sanerad.

Reflektionsforskningen har också en kritisk linje (Moore, 2004; Akbari, 2007): obearbetad reflektion kan bli självbespeglande, sentimental, eller moraliserande — där läraren klagar på elever och system snarare än ser sin egen del. Designkonsekvens för MCP:n: pusha mot konkretion (*"vad sa eleven?"* snarare än *"de var ointresserade"*), mot egen agency (*"vad gjorde jag som bidrog?"*), variera prompter så reflektionen inte stelnar i mall.

Auto och reflection arbetar parallellt. *Auto* är systemets ställning — strukturerad mall, taggade begrepp från pre-lesson-planen, jämförelse plan vs utfall, påminnelser från tidigare mönster. *Reflection* är lärarens röst, bokstavligt — inspelad muntligt, transkriberad. Princip: AUTO presenterar fakta utan värdering (*"X hände"*); REFL bär tolkningen (*"därför att…"*). Risken är att AUTO blir dömande snarare än stödjande — en jämförelse plan-vs-utfall som flaggar *"du genomförde inte aktivitet 3"* kan kännas som anklagelse istället för observation. Designprincipen håller AUTO på fakta-sidan.

Praktiska frågor i post-lesson (kort cadens, Rolfe-baserat):

- Vad hände faktiskt — inte vad jag planerade?
- Vad lärde de sig? Hur vet jag det?
- Vad fungerade? Vad fungerade inte? Varför?
- Vad överraskade mig?
- Vad gör jag annorlunda nästa gång — för den här gruppen, för det här innehållet, generellt?

Vid djupare cadens (vecka, Gibbs-baserat) tillkommer affektiva och analytiska frågor: vad kände jag och eleverna? Vilka faktorer spelade roll? Vad lärde *jag* mig av detta? Vid kritisk cadens (termin, Brookfield/Larrivee-baserat): vad antar jag om eleverna som är värt att granska? Vad ser de som jag inte ser? Vilka maktförhållanden är i spel?

Data som matar post-lesson:

| Källa | Vad det bidrar med |
|---|---|
| Pre-lesson-plan | Vad jag tänkte göra — referenspunkt för "vad hände faktiskt?" |
| Klafkis fem frågor från pre-lesson | Gestaltades exemplariteten? Nådde jag Gegenwartsbedeutung? |
| Tidigare post-lesson-reflektioner | Mönster: är detta något som återkommer? |
| Manifestet | Stämmer det jag gjorde med det jag säger jag tror? *(espoused vs. in-use)* |
| Eventuell elevdata från lektionen | Exit tickets, formativa svar — om sådant fångats |

Output från post-lesson:

| Output | För vem / vad |
|---|---|
| Post-lesson reflection (REFL) | Lärarens egen logg, indata till bryggan |
| Post-lesson auto (AUTO) | Strukturerad sammanfattning för kursnivå-aggregering |
| Identifierade justeringar | Konkreta ändringar inför nästa lektion (in i bryggan) |
| Begrepp som inte landade | Kandidater för retrieval-test eller återbesök |
| Affektiva noteringar | Spår för långsiktig professionsreflektion (terminsmönster) |
| Espoused-vs.-in-use-flaggor | Material för manifestrevisionen

#### Bryggan — det underanvända steget

Bryggan är det moment där reflektion blir kraft. Korthagens ALACT-modell (2001, 2004) gör detta explicit: **Action → Looking back → Awareness of essential aspects → Creating alternative methods → Trial**. Övergången från Awareness till Creating alternatives är ofta tyst i lärararbetet — och det är där den verkliga didaktiska utvecklingen sker.

Utan bryggan blir reflektion en sluten privat övning. Med den blir den motor. MCP-prompten är enkel men avgörande:

> *"Inför nästa lektion — utifrån din reflektion förra gången, vad bär du med dig in?"*

Detta är också den punkt där lektionscykeln kopplar in i kurscykeln: bryggornas mönster över tid blir ingång till kursrevision.

---

### Kurscykeln (vecka–månad)

```
KURSDESIGN  →  GENOMFÖRANDE  →  BEDÖMNING  →  UTVÄRDERING  →  REVISION
                  (många lektionscykler nästade här inne)
```

**Domän:** en hel kurs eller modul (KURS201, KURS601)
**Tempo:** veckor–terminer
**Lärarens fråga:** "Linjerar kursen som helhet? Lärde de sig det jag sa de skulle?"

#### Kursdesign — alignment och avsikt

Här bor Biggs *constructive alignment* (1996; Biggs & Tang, 2011) som bärande princip. Tre val ska linjera mot samma kompetenser, formulerade med samma verb:

1. **Intended Learning Outcomes (ILO)** — vad ska studenten kunna efter kursen
2. **Teaching/Learning Activities (TLA)** — vad gör studenten under kursen
3. **Assessment Tasks (AT)** — hur visar studenten att hen kan

Hans poäng är att *alla tre* måste rikta sig mot samma kompetenser. Om ILO säger "analysera" men bedömningen testar minne, lär sig studenterna det som premieras (memorering), inte det som påstås vara målet. Constructive alignment är där konstruktivismens lärandeantagande möter systemtänkande.

På kursnivå sker även *backward design* (Wiggins & McTighe, 2005) i större format — börja med vad de ska kunna efter kursen, sedan hur du ska veta att de kan det, sist hur du undervisar. Och Conoles (2013) *7Cs of Learning Design* ger en iterativ designprocess som ramverk för själva designarbetet:

- **Conceptualize** — vision, sammanhang, lärandebehov
- **Capture** — vad finns redan av material, OER, erfarenhet
- **Create** — själva produktionen
- **Communicate** — hur kursen presenteras för studenterna
- **Collaborate** — hur de arbetar tillsammans
- **Consider** — utvärdering, formativ feedback
- **Consolidate** — reflektion, lärdomar för nästa upplaga

Conole arbetar i en brittisk tradition (parallellt med Beetham & Sharpe, Laurillard) som tar avstånd från amerikansk *instructional design*: mer aktivitetscentrerad, mer öppen, mer kritisk till "design som teknik" (Conole, 2013).

#### Genomförande — kursen som levande

Genomförandet är inte enbart "att utföra planen". Det är där kursen möter verkligheten — elever, tid, oväntat. Laurillards (2012) *Teaching as a Design Science* argumenterar för att undervisning är iterativ design som ständigt justeras: läraren är inte plan-utförare utan designer i realtid.

Här aggregeras data från lektionscyklerna: post-lesson-reflektioner, formativa tester, exit tickets, frågor i kurschatten. Det är där MCP:n bär sin kanske viktigaste uppgift på kursnivå — att hålla samman det som annars blir individuella lektionsanteckningar i en mapp.

#### Bedömning — evidens för lärande

Bedömning är inte enbart mätning utan tolkning av elevers möte med innehållet. Black & Wiliam (1998), i klassiska *Inside the Black Box*, visade att formativ bedömning är en av de mest kraftfulla pedagogiska interventionerna som finns — när den används som verktyg för lärande snarare än kontroll.

Karpicke & Roediger (2008) etablerade *testing effect* som lärandeintervention i sig: att hämta fram ur minnet stärker minnet mer än att läsa om. Bjorks (1994) *desirable difficulties* lägger till att viss svårighet i hämtningen är produktiv. Detta gör korta retrieval-tester till både bedömning *och* undervisning samtidigt — bidirektionell loop.

Biggs & Collis (1982) *SOLO-taxonomi* — prestructural, unistructural, multistructural, relational, extended abstract — ger en kvalitativ progressionsmodell som komplement till verb-taxonomier (Bloom, Anderson & Krathwohl). SOLO är särskilt användbar när bedömningen ska fånga *kvalitet av förståelse* över tid.

#### Utvärdering — diagnos

Här ställs alignment-frågan retrospektivt: linjerade kursen som helhet? Var driftade den iväg? Stämmer studentens upplevda lärande med ILO:n? Studentutvärderingar är en datakälla, men inte den enda — bedömningsdata, frågor i kurschatten, lärarens egna observationer hör hemma här. Learning analytics-traditionen (Siemens & Long, 2011) ger metoder för att aggregera, men ramverket har kritiserats för att ofta missa det kvalitativa (Selwyn, 2019).

#### Revision — kursen som artefakt

Stenhouses (1975) klassiska *curriculum as inquiry* ser kursen som hypotes som prövas i praktik: *"It is not enough that teachers' work should be studied; they need to study it themselves."* Revisionen formaliserar detta: vad lärde *jag* om kursen detta år, vad ändras nästa? Här blir kursen ett designat objekt som utvecklas över upplagor — och MCP:n kan hålla minne över upplagor som lärarens minne inte mäktar med.

Praktiska MCP-funktioner i kurscykeln:

- Verbalignment-kontroll mellan ILO, TLA, AT (mekanisk textanalys; här bor QuestionForge och Assessment_suite naturligt)
- Aggregering av lektionsreflektioner till kursnivå
- Kursens versionsspår över upplagor
- Detektion av "drift" — när genomförandet börjar avvika från ursprungsdesign

#### Data som matar kurscykeln

Olika faser drar på olika data. Tabellen visar primära ingångar per fas:

| Fas | Datakällor |
|---|---|
| Kursdesign | Förra upplagans revisionsanteckningar, kursplan/läroplan, manifestet, kollegial dialog (när tillgängligt) |
| Genomförande | Aggregerade post-lesson-reflektioner och AUTO-rapporter, retrieval-test-data från Assessment_suite, bryggornas mönster |
| Bedömning | ILO:n, prestationsdata, SOLO-positionering, distraktoranalys |
| Utvärdering | Studentutvärderingar, alignment-rapport från AUTO, drift-detektion, all ovanstående aggregerad |
| Revision | Hela cykelns insikter, manifestets ev. ändringar under perioden, ny forskning eller läsning som dykt upp |

Output från kurscykeln:

| Output | För vem / vad |
|---|---|
| Kursrevisionsanteckningar | Indata till nästa upplaga (kursdesign år+1) |
| Alignment-rapport | Egen reflektion, ev. skolnivå-redovisning |
| Aggregerade lärdomar | Indata till manifestrevisionen *(kurs → profession-bryggan)* |
| Drift-mönster | Vad i kurser som tenderar att avvika från design |
| Återkommande svåra begrepp | Material för nästa upplagas kursdesign och för QuestionForge-banken |

> **GDPR-notering.** Studentprestationsdata och studentutvärderingar är personuppgifter (även när delvis aggregerade kan enskilda elever vara identifierbara i små grupper). Aggregeringen ska ske på en nivå där individer inte kan urskiljas, och rådata stannar i organisationens system. Lokala modeller är även här en framtidsväg.

---

### Professionscykeln (termin–år)

```
VEM ÄR JAG  →  VAD LÄR JAG  →  VART GÅR JAG  →  IDENTITET FÖRÄNDRAS
                  (många kurscykler nästade här inne)
```

**Domän:** dig som lärare, som professionell, över tid
**Tempo:** terminer–år
**Lärarens fråga:** "Vem håller jag på att bli som lärare? Står jag där jag säger att jag står?"

Manifestet är professionscykelns axel — det är där cykelns rörelse artikuleras och blir greppbar. De fyra faserna nedan är alla i dialog med manifestet: *Vem är jag?* är dess självbiografiska underlag, *Vad lär jag?* är dess prövning genom läsning och dialog, *Vart går jag?* är dess politiska kärna, *Identitet förändras* är dess revision. För manifestets struktur och curator-funktion, se separat avsnitt *Pedagogiskt manifest som axel* nedan.

#### Vem är jag? — teacher identity

Beauchamp & Thomas (2009) sammanfattar forskningen om lärares identitet: den är formad av personliga, sociala och kontextuella faktorer; den förändras över tid; den är inte enhetlig utan flera identiteter samverkar. Brookfields (1995/2017) första lins — *den självbiografiska* — frågar: vilka erfarenheter har format mig som lärare? Vad bär jag med mig från min egen skolgång, mina egna lärare, mina egna sårbarheter?

Detta är inte introspektion för introspektionens skull. Brookfield argumenterar att obearbetade antaganden från egen erfarenhet styr undervisning på sätt vi inte ser — om vi inte ser dem. Connelly & Clandinin (1990) etablerade *narrativ inquiry* som metod: lärarliv förstås genom de berättelser läraren berättar om sig själv.

Manifestets första lager är ofta en självbiografisk artikulation — inte memoarer, men de bärande pedagogiska övertygelser som har formats av konkreta erfarenheter. Att skriva ned det är att avslöja antaganden för sig själv.

#### Vad lär jag? — kontinuerlig professionell utveckling

Day & Sachs (2004) ramar lärararbetet som *career-long professional learning*. Det är inte ett slutförande av lärarutbildningen utan en livslång utveckling. Berliners (1988) och Dreyfus & Dreyfus (1980) modeller skiljer mellan novis, avancerad nybörjare, kompetent, kunnig och expert — där expertisen kännetecknas av intuitiv, mönsterbaserad omdömesförmåga snarare än regelapplikation.

Hammerness et al. (2005) pekar på tre vägar för lärares lärande: *arbetsplatslärande*, *formell utveckling*, och *reflektivt-undersökande arbete*. Den sista är där MCP:n direkt bidrar.

Brookfields övriga tre lenser kompletterar den självbiografiska:

- **Elevernas ögon** — vad ser de som jag inte ser?
- **Kollegors lins** — vad reagerar de på i mitt arbete?
- **Teoretisk lins** — vad säger forskningen om detta?

De fyra lenserna tillsammans tvingar fram perspektivskifte och avslöjar dolda antaganden — Brookfields kritiska reflektion i strikt mening.

Det reflektivt-undersökande lärandet är också där manifestet både prövas och näras. Ny läsning som skiftar förståelsen kan tvinga omformulering — eller så märker man att manifestet redan sa det, men man hade inte sett det själv.

#### Vart går jag? — riktning och kallelse

Här finns plats för Klafkis Bildung-begrepp i sin politiska form: undervisning står för något. Att vara lärare är att ta ställning. Klafki (1985/1995) formulerar Bildung som formering av människan i hennes förmåga att möta världens uppgifter med *självbestämmande*, *medbestämmande* och *solidaritet* — Bildung är politisk.

Biestas (2014, 2017, 2022) tre domäner ger en karta för var läraren placerar sin tyngd:

- **Qualification** — kunskaper och färdigheter
- **Socialization** — inträde i traditioner, gemenskaper
- **Subjectification** — att eleven blir ett eget pedagogiskt subjekt

*Subjectification* är Biestas viktigaste bidrag, och hans riktning mot "the world-centred school" (Biesta, 2022) är en kraftfull motvikt till ren "learner-centred" pedagogik.

Korthagens (2004) *lökmodell* — *the onion model* — skiktar lärarens identitet: omgivning, beteende, kompetens, övertygelser, identitet, mission. De inre skikten (övertygelser, identitet, mission) är där manifestet bor. Reflektion som bara berör de yttre skikten ändrar tekniken; reflektion som når de inre kan förändra läraren.

Manifestets politiska kärna lever här — det är där läraren tar ställning för Bildung-trefalden, för subjectification framför ren qualification, eller för andra ställningstaganden. Det är också där manifestet riskerar att bli abstrakt om det inte ständigt prövas mot praxis.

#### Identitet förändras — manifestrevisionen

När Brookfields fyra lenser, Korthagens lök-skikt och Biestas domäner mötts i en lärares praktik över år sker förändring. Manifestet är där den förändringen artikuleras.

Manifestet är *levande*: versioneras, dateras, utvecklas. Skillnaden mellan v1 och v2 är en datapunkt. *Vad förändrades, varför, vid vilken tidpunkt, efter vilken läsning eller erfarenhet?* MCP-curatorrollen är att hålla denna spårning utan att ta över själva omformuleringen — som med all reflektion lever meningen hos läraren.

Praktiska MCP-funktioner i professionscykeln:

- Manifest som versionerat dokument, med spår av vad som ändrats när och varför
- Periodisk påminnelse om manifestrevision (terminsslut)
- Mönsterdetektion: vad återkommer i reflektioner som *inte* är artikulerat i manifestet?
- Brookfield-cykler: en gång per termin, gå igenom de fyra lenserna explicit
- Kopplingar till läsning (didaktisk forskning, GenAI-debatten, fackliga och kollegiala texter)

#### Praktiska frågor i terminsreflektionen

Vid terminsslut, ungefär 45–60 min, organiserade kring Brookfields fyra lenser och en avslutande manifestcheck:

**Den självbiografiska linsen:**

- Vad har den här terminen visat mig om mig själv som lärare?
- Var har jag känt mig hemma? Var har jag känt mig fel?
- Vilka av mina antaganden har jag mött och inte gillat?

**Elevernas lins:**

- Vad har eleverna visat mig som jag inte sett?
- Var har deras reaktioner förvånat mig?
- Vilken elev har lärt mig något jag bär med mig?

**Kollegors lins:**

- Vad har kollegor reagerat på i mitt arbete?
- Var har deras invändningar gjort mig osäker?
- Var har samtal förändrat min syn?

**Teoretisk lins:**

- Vilken läsning har skiftat min förståelse?
- Vilka begrepp har jag tagit till?
- Vad har jag stött bort utan att förstå varför?

**Manifestcheck:**

- Vad i manifestet stämmer fortfarande?
- Vad behöver omformuleras?
- Vad har jag lärt mig som inte ännu finns i manifestet?
- Var står min praxis i synlig konflikt med manifestet?

#### Data som matar professionscykeln

| Källa | Vad det bidrar med |
|---|---|
| Aggregerade kurscykel-lärdomar | Mönster över kurser och år *(kurs → profession-bryggan)* |
| Aggregerade post-lesson-reflektioner | Återkommande teman och affektiva spår över tid |
| Espoused-vs.-in-use-flaggor från post-lesson | Var praxis avviker från det jag säger jag tror |
| Aktuell läsning | Didaktisk forskning, GenAI-debatten, fackliga och kollegiala texter |
| Kollegial dialog (när tillgänglig) | Vad andras blickar visat mig |
| Tidigare manifestversioner | Spåren av egen utveckling över tid |

Output från professionscykeln:

| Output | För vem / vad |
|---|---|
| Reviderat manifest (ny version) | Mig själv, MCP:ns curator-funktion, kommande pre-lesson-prompts |
| Pedagogiska ställningstaganden | Indata till pre-lesson-prompts *(profession → lektion-bryggan)* |
| Långsiktiga professionsmönster | Material för avhandlingen / DBR-spåret |
| Beslut om vidareutveckling | Kurser, fortbildning, läsning |
| Eventuella publikationer eller kollegiala bidrag | Skola, organisation, fältet |

> **GDPR-notering.** Aktuell läsning, kollegial dialog och egna manifestversioner är låga GDPR-risker. Studentutvärderingsmönster och elev-citat som dyker upp i reflektioner kan vara — håll på aggregerad nivå, inte individuell.

---

## Pedagogiskt manifest som axel

Professionscykeln behöver en explicit axel — annars blir den vag känsla av att "växa". Att förankra den i ett *manifest* — en text om pedagogiska teorier, värden och övertygelser — gör den greppbar och teoretiskt ärlig. Ordet *manifest* säger något starkare än "credo" eller "teaching philosophy" — det är politiskt, offentligt, förpliktigande.

### Vad ett manifest kan innehålla

- **Lärandesyn** — vad är lärande (konstruktivism, sociokulturellt, något annat)
- **Kunskapssyn** — vad är kunskap, vad är värt att kunna
- **Ämnessyn** — vad är biologi, vad är AI som ämnen, vad bär de
- **Elevsyn** — hur ser du på den lärande människan
- **Lärarrollen** — auktoritet, möjliggörare, medlärande
- **Bildningssyn** — vad är skolans uppgift, för vad
- **Etiska förpliktelser** — vad är du skyldig dina elever
- **Förhållningssätt till teknologi och AI**

### Manifestet som arkitektonisk axel

Manifestet fungerar som ankarpunkt för hela systemet. All reflektion kan testas mot manifestet: *stämmer det jag gör med det jag säger jag tror?* När praxis och manifest divergerar är det en signal — antingen ska praxis ändras, eller manifestet revideras (för att läsning eller erfarenhet skiftat det). Argyris & Schöns (1974) klassiska distinktion mellan *espoused theory* (det vi säger oss tro) och *theory-in-use* (det vi faktiskt praktiserar) är direkt relevant: manifestet gör espoused theory explicit, och MCP:ns mönsterdetektion hjälper läraren se theory-in-use.

MCP:ns roll: **manifest-curator**. Inte författare, inte domare. Den noterar när reflektioner pekar mot manifestet, när de gnisslar mot det, när nya tankar dyker upp som kanske borde lägga till en sats. Påminner periodiskt: *"Det är dags att se om manifestet fortfarande stämmer."*

**Princip:** första versionen får vara tunn. Sju–tio satser, en sida. Bättre med något ärligt halvfärdigt än att vänta tills det är "klart" — det blir aldrig klart.

---

## Datalagret — tvärgående

Datalagret matar alla tre cyklerna. Det är inte ett delsteg utan ett tvärgående lager.

| Källa | Innehåll |
|---|---|
| Lärardata | Röstreflektion post-lesson, planering pre-lesson, observationer |
| Elevdata | Exit tickets, formativa svar, frågor de ställer, retrieval-tester, kursutvärderingar |
| Möten | Missuppfattningar, diskussioner, var det fastnar |

Det är *här* MCP:n blir mer än vad en människa mäktar med. En människa kan reflektera; en MCP kan hålla samman reflektioner med systematiska elevdata över tid. Detta rimmar med learning analytics-traditionen (Siemens & Long, 2011; Lockyer et al., 2013) men med en avgörande skillnad: dataflödet är inriktat på att *stärka lärarens reflektion*, inte ersätta den. Det är *teacher-facing analytics*, inte beslutsstödssystem.

Data fångas i tre tempon:

- **Lektion:** exit tickets, formativa svar, retrieval-tester (5 frågor, 5 minuter)
- **Vecka:** röstreflektion post-lesson, eventuell aggregering
- **Termin:** mönsterrapporter över hela perioden, kursutvärdering

---

## Ramverkskartan

Olika ramverk arbetar i olika tempon. På operativ nivå kompletterar de varandra. På djupare nivå är några av dem oense om vad lärande är — det utvecklas i avsnittet *Spänningar att hålla* nedan.

| Tempo | Skikt | Ramverk | Vad det gör |
|---|---|---|---|
| Lektion | Didaktisk grund | Klafki (1958/1995) | Bildung, exemplaritet, varför |
| Lektion | Operativ struktur | Wiggins & McTighe (2005) | Backward design för enskild lektion |
| Lektion | Reflektion | Schön (1983), Rolfe et al. (2001) | Hur tänka efter — kort cadens |
| Lektion | Brygga | Korthagen (2001) | ALACT-cykel, "creating alternatives" |
| Kurs | Systemstruktur | Biggs (1996), Biggs & Tang (2011) | Linjering ILO ↔ aktiviteter ↔ bedömning |
| Kurs | Designprocess | Conole (2013) | 7Cs of Learning Design |
| Kurs | Lärande genom kursdesign | Laurillard (2012) | Teaching as a design science |
| Kurs | Kursen som forskning | Stenhouse (1975) | Curriculum as inquiry |
| Profession | Reflektion | Brookfield (2017) | Fyra lenser |
| Profession | Identitetsmodell | Korthagen (2004) | Lökmodellen |
| Profession | Filosofisk grund | Klafki, Biesta (2014, 2022) | Bildung, subjectification |
| Profession | Espoused vs. in-use | Argyris & Schön (1974) | Manifest vs. praxis |
| Genomgripande | Forskningsmetod | DBR | Hur studera (parkerad — eget meta-projekt) |

### Reflektionsmodeller efter cadens

| Cadens | Modell | Källa | Tid |
|---|---|---|---|
| Direkt efter lektion | What? So what? Now what? | Rolfe et al. (2001) | 3–5 min |
| Vecka | Sex steg | Gibbs (1988) | 15–20 min |
| Termin | Fyra lenser | Brookfield (2017) | 45–60 min |
| Termin | ALACT-cykel | Korthagen (2001) | 45–60 min |

---

## Spänningar att hålla

Ramverkskartan ovan ser ut som en harmonisk arbetsfördelning mellan tempon. Den är delvis det. Men flera av ramverken är i grunden oense om centrala frågor — vad lärande är, vad utbildning är till för, vad som kan specificeras i förväg. Att låta dem leva i samma system utan att se motsättningarna är att tyst välja den ena rösten.

Detta avsnitt namnger spänningarna utan att lösa dem. Vissa är produktiva och bör hållas öppna; andra är riskpunkter där MCP:ns design måste ta ställning.

### Bildung vs. specificerbart lärande

Klafki, Stenhouse och Biesta står på ena sidan. Wiggins & McTighe, Biggs och traditionen kring ILO och constructive alignment står på den andra. Frågan är fundamental: kan det viktigaste lärandet specificeras i förväg, eller är det just det oförutsägbara mötet mellan elev och innehåll som bär bildning?

- *Klafki:* Bildung kan inte reduceras till mätbara outcomes. Innehållet bär en mening som inte kan packas in i verb-listor.
- *Wiggins & McTighe / Biggs:* utan tydliga mål driftar kurser; alignment är förutsättning för rättvis bedömning.
- *Stenhouse:* kursen är hypotes, inte plan. Det viktigaste lärandet är ofta det som inte kunde förutses.
- *Biesta:* *subjectification* — där eleven framträder som eget subjekt — är per definition oförutsägbart.

**Hur hanteras spänningen?** Behåll den. En kurs designad enbart i Klafki-anda riskerar att bli vag och svår att bedöma rättvist. En kurs designad enbart i alignment-anda riskerar att bli teknisk och tom. ILO finns kvar som operativ struktur, men varje ILO testas mot frågan: *fångar denna det som är värt att lära, eller bara det som är lätt att mäta?* Den frågan är Klafkis bidrag.

### Alignment vs. desirable difficulties

Biggs vill att aktiviteterna är direkt riktade mot ILO. Bjork visar att det som *känns* alignerat ofta ger sämst djuplärande — viss obekvämhet, omväg och friktion ger bättre långtidsretention. Den optimalt alignade aktiviteten kan vara den fattigaste lärupplevelsen.

**Hur hanteras spänningen?** Designprincip: alignment ligger på *ILO-nivå*, inte på *aktivitetsnivå*. Aktiviteten får — bör — vara svårare och mer omvägsfull än verbet i ILO antyder. När AUTO mekaniskt verbalignerar TLA mot ILO ska det inte tolkas som *"perfekt match är bäst"* utan som *"möjlig match — är aktiviteten ändå rätt slags svårighet?"*

### Testing effect vs. formativ bedömning

Inte direkt motsägelse, men en risk. Retrieval-testandet är kognitivt effektivt, mätbart, lätt att skala. Formativ bedömning enligt Black & Wiliam är dialogisk, kvalitativ, relationell. Risken är att MCP:ns infrastruktur för retrieval-tester gör det till standardlösningen och tränger ut det dialogiska.

**Hur hanteras spänningen?** Princip: retrieval-tester är ett *komplement* till formativ dialog, inte en ersättning. AUTO:s rapporter ska inte locka till *"fler tester"* utan till *"samtal om dessa begrepp"*. Pilotcykelns mätpunkt — *påverkar Teacher Insight-rapporten faktiskt pre-lesson-designen?* — är ett skydd mot ren testdrift.

### Learning analytics vs. lärarens omdöme

MCP-projektets centrala spänning. Siemens & Long: data ger insikter, mönster, evidens. Selwyn: learning analytics förskjuter omdömet från läraren till systemet, och fångar bara det mätbara.

**Hur hanteras spänningen?** Grundprincipen — *AI håller ställning, människan håller mening* — är formuleringen av denna spänning som designval. Men spänningen försvinner inte genom en princip; den måste hanteras i varje konkret implementation. Varje gång AUTO genererar något ska frågan ställas: *gör detta lärarens omdöme skarpare eller överflödigt?*

### Process vs. innehåll: Conole utan Klafki

Conole 7Cs är en moraliskt tom designprocess. *Conceptualize, Capture, Create...* — alla verb är neutrala. Klafki skulle fråga: i *Conceptualize* — har du frågat *varför just detta innehåll*? I *Capture* — har du tillåtit dig att *inte* använda material bara för att det finns?

**Hur hanteras spänningen?** Princip: Conole-faserna är *processteg*, men varje steg passerar ett *innehållsfilter* som är klafkianskt. *Capture* med Klafki: vilket material bär exemplaritet, inte bara tillgänglighet?

---

Detta avsnitt bör läsas regelbundet, inte en gång. När en design-cykel börjar driva åt det enkla, det mätbara, det processuella — kommer det troligen vara för att en av spänningarna har tystnat.

---

## Bryggorna mellan cyklerna

Det är inte cyklerna i sig som behöver mer arbete — det är *översättningarna mellan dem*. Här finns det viktigaste utvecklingsarbetet framöver.

| Brygga | Vad ska hända | Status |
|---|---|---|
| Lektion → Lektion | Post-reflektion påverkar nästa pre-lesson | Behöver byggas |
| Lektion → Kurs | Reflektioner aggregeras till kursutvärdering | Saknas |
| Kurs → Profession | Kursmönster matar manifestets utveckling | Saknas |
| Profession → Lektion | Manifest informerar pre-lesson-prompts | Saknas |
| Elevdata → Lärarreflektion | Tester triggar didaktisk reflektion | Under utveckling |

Det är där "automatiseringen" har plats. Inte automatisera reflektionen — men automatisera *kopplingarna*, så att det relevanta från en cykel når in i nästa utan att läraren måste hålla allt i huvudet. Detta är besläktat med vad transferforskningen kallar *bridging strategies* (Perkins & Salomon, 1992) — explicita kopplingar mellan kontexter som annars förblir osammanhängande.

Profession → Lektion är särskilt intressant: vid pre-lesson kan MCP:n dra i manifestet och fråga: *"Du planerar en föreläsning om CRISPR. I ditt manifest står att du värdesätter X. Hur gestaltas det i denna lektion?"* Det är där manifestet blir levande snarare än ett dokument i en mapp.

---

## Röstinspelad reflektion

Reflektion sker som muntlig inspelning, ett par minuter, direkt efter lektionen eller på cykelvägen hem.

Tal har andra kognitiva egenskaper än skrift. Snabbare, mindre redigerat, fångar tvekan, överraskning, halvtänkta tankar. Verbalprotokoll-forskningen (Ericsson & Simon, 1980/1993) har systematiskt visat att tal nära händelsen är rikare på autentiska kognitiva spår än efterhandsrekonstruktion i skrift. Det rimmar med Schöns (1983) *reflection-on-action* och Klafkis (1995) betoning på meningsskapande över rapportering. "Två minuter på cykelvägen hem" träffar ett pedagogiskt fönster — den varma reflektionen, innan dagen blir oskarp.

### Designprinciper

- **AI:ns roll är efter, inte under.** Inspelningen är ren. Inga frågor som avbryter. Strukturen kommer i transkriptionen och uppföljningen.
- **KB-Whisper är pipelinen.** Redan på plats.
- **Möjlig flow:** spela in → KB-Whisper → MCP fångar in i Obsidian → MCP genererar 1–2 följdfrågor (Rolfe-stil: *what?* fångat, vill du säga något om *so what?* eller *now what?*) → läraren svarar muntligt eller skriftligt → klart.
- **Mönsterrapporten över tid blir extra kraftfull med tal.** Talspråket har idiosynkrasier som skvallrar — vad du återkommer till, vilka ord du laddar, var du tvekar. Diskursanalytiska metoder (Gee, 2014) kan ge metodologisk grund för sådan analys i ett DBR-spår.

**Risk:** transkription kan låsa ner det som var levande. Spara originalljudet, inte bara texten.

---

## Testbaserat lärande

Bedömning lever i alla cykler — formativ avläsning i lektion, alignment-fråga i kurs, mönster över år i profession. Assessment_suite hör hemma här, integrerat med reflektionsverktyget snarare än parallellt.

### Forskningsgrund

- **Testing effect** (Karpicke & Roediger, 2008; Roediger & Butler, 2011): att hämta fram ur minnet stärker minnet mer än att läsa om. Effekten är robust över ämnen och åldrar.
- **Spacing effect** (Cepeda et al., 2006): korta tester utspridda över tid är dramatiskt mer effektiva än komprimerade.
- **Desirable difficulties** (Bjork, 1994; Bjork & Bjork, 2011): viss svårighet i hämtningen är produktiv. Det som upplevs *enklare* under inlärning ger ofta sämre långtidsretention.
- **Formative assessment** (Black & Wiliam, 1998, 2009): formativ bedömning är en av de mest kraftfulla pedagogiska interventionerna.

Populärsyntes: *Make It Stick* (Brown, Roediger & McDaniel, 2014).

### Designprinciper

- **Lågfrekvent, lågkostnad:** 5–10 min varje eller varannan vecka, inte stora prov
- **Alignade till ILO:** items genereras mot specifika kursmål (QuestionForge gör jobbet)
- **Spacing-schemat:** MCP håller koll på vilka begrepp som behöver återbesökas och när
- **Lärarens insight:** *"Den här veckan har dessa tre begrepp störst gap. Värt att gå tillbaka?"*
- **Elevens insight:** vad de kan, vad de behöver mer av

Bidirektionell loop: testen hjälper *både* eleven *och* genererar rik data till läraren om vad som inte landat. Det är där testbaserat lärande och constructive alignment möts: ILO → AT → TLA blir ett iterativt, datadrivet kretslopp över hela kursen.

---

## Pilotcykel

**Period:** [att definieras]
**Kurser:** KURS601 och KURS201 parallellt

### Protokoll

- 5 frågor, 5 minuter, varje eller varannan vecka
- Genererat av QuestionForge mot 2–3 specifika kursmål per kurs
- Loggas i Assessment_suite
- Output: kort *Teacher Insight*-rapport per vecka

### Mätpunkter

- **Tekniskt:** dataflödet funkar?
- **Eleverna:** accepteras formatet?
- **Lärarens praktik:** påverkar Teacher Insight-rapporten faktiskt pre-lesson-designen?

### Slutreflektion

Datum: [att definieras]. Format: Gibbs-djup på piloten som helhet, inte lektion för lektion.

---

## Öppna trådar

- **DBR som meta-projekt.** Behandlas i separat dokument *DBR — Design-Based Research som meta-projekt*. Centrala referenser: Anderson & Shattuck (2012), McKenney & Reeves (2018), Sandoval (2014), Design-Based Research Collective (2003).
- **Det kollegiala.** Tvärgående lager eller egen cykel? Wenger (1998) *communities of practice* kan vara teoretisk grund. Vänta.
- **Carpenter_MCP.** Samma trestegs-arkitektur eller annorlunda? Tas i nästa omgång.
- **Manifest v1.** När och i vilken form ska första utkastet skrivas?
- **Klafki + UbD som sammanslagen pre-lesson-prompt.** Skiktas det väl eller blir det spretigt? Skiss behövs.
- **Etiska och GDPR-frågor.** Vad får logga, vad ska avidentifieras, vad ska aldrig sparas? Egen runda.

---

## Referenser

**Didaktik och Bildung**

- Klafki, W. (1958/1995). On the problem of teaching and learning contents from the standpoint of critical-constructive Didaktik. I S. Hopmann & K. Riquarts (red.), *Didaktik and/or Curriculum*.
- Klafki, W. (1985). *Neue Studien zur Bildungstheorie und Didaktik*. Beltz.
- Carlgren, I. (1999). Professionalism and teachers as designers. *Journal of Curriculum Studies, 31*(1), 43–56.

**Backward design och alignment**

- Wiggins, G. & McTighe, J. (2005). *Understanding by Design* (2nd ed.). ASCD.
- Biggs, J. (1996). Enhancing teaching through constructive alignment. *Higher Education, 32*, 347–364.
- Biggs, J. & Tang, C. (2011). *Teaching for Quality Learning at University* (4th ed.). Open University Press.
- Biggs, J. & Collis, K. (1982). *Evaluating the Quality of Learning: The SOLO Taxonomy*. Academic Press.

**Designvetenskap och kursdesign**

- Conole, G. (2013). *Designing for Learning in an Open World*. Springer.
- Beetham, H. & Sharpe, R. (red.) (2013). *Rethinking Pedagogy for a Digital Age* (2nd ed.). Routledge.
- Laurillard, D. (2012). *Teaching as a Design Science*. Routledge.
- Stenhouse, L. (1975). *An Introduction to Curriculum Research and Development*. Heinemann.

**Reflektion**

- Schön, D. A. (1983). *The Reflective Practitioner: How Professionals Think in Action*. Basic Books.
- Schön, D. A. (1987). *Educating the Reflective Practitioner*. Jossey-Bass.
- Gibbs, G. (1988). *Learning by Doing: A Guide to Teaching and Learning Methods*. Further Education Unit.
- Rolfe, G., Freshwater, D. & Jasper, M. (2001). *Critical Reflection in Nursing and the Helping Professions*. Palgrave.
- Brookfield, S. D. (2017). *Becoming a Critically Reflective Teacher* (2nd ed.). Jossey-Bass.
- Korthagen, F. (2001). *Linking Practice and Theory: The Pedagogy of Realistic Teacher Education*. Routledge.
- Korthagen, F. (2004). In search of the essence of a good teacher. *Teaching and Teacher Education, 20*, 77–97.
- Conway, P. F. (2001). Anticipatory reflection while learning to teach. *Teaching and Teacher Education, 17*(1), 89–106.
- Argyris, C. & Schön, D. A. (1974). *Theory in Practice: Increasing Professional Effectiveness*. Jossey-Bass.
- Boud, D., Keogh, R. & Walker, D. (red.) (1985). *Reflection: Turning Experience into Learning*. Kogan Page.
- Larrivee, B. (2000). Transforming teaching practice: Becoming the critically reflective teacher. *Reflective Practice, 1*(3), 293–307.
- Moore, A. (2004). *The Good Teacher: Dominant Discourses in Teaching and Teacher Education*. RoutledgeFalmer.
- Akbari, R. (2007). Reflections on reflection: A critical appraisal of reflective practices in L2 teacher education. *System, 35*(2), 192–207.

**Lärarens identitet och utveckling**

- Beauchamp, C. & Thomas, L. (2009). Understanding teacher identity. *Cambridge Journal of Education, 39*(2), 175–189.
- Berliner, D. C. (1988). The development of expertise in pedagogy. AACTE Publications.
- Dreyfus, S. E. & Dreyfus, H. L. (1980). *A Five-Stage Model of the Mental Activities Involved in Directed Skill Acquisition*. University of California, Berkeley.
- Day, C. & Sachs, J. (red.) (2004). *International Handbook on the Continuing Professional Development of Teachers*. Open University Press.
- Hammerness, K., Darling-Hammond, L., et al. (2005). How teachers learn and develop. I L. Darling-Hammond & J. Bransford (red.), *Preparing Teachers for a Changing World*.
- Connelly, F. M. & Clandinin, D. J. (1990). Stories of experience and narrative inquiry. *Educational Researcher, 19*(5), 2–14.
- Priestley, M., Biesta, G. & Robinson, S. (2015). *Teacher Agency: An Ecological Approach*. Bloomsbury.

**Pedagogisk filosofi**

- Biesta, G. (2014). *The Beautiful Risk of Education*. Paradigm.
- Biesta, G. (2017). *The Rediscovery of Teaching*. Routledge.
- Biesta, G. (2022). *World-Centred Education*. Routledge.

**Bedömning och lärande**

- Black, P. & Wiliam, D. (1998). Inside the black box: Raising standards through classroom assessment. *Phi Delta Kappan, 80*(2), 139–148.
- Black, P. & Wiliam, D. (2009). Developing the theory of formative assessment. *Educational Assessment, Evaluation and Accountability, 21*(1), 5–31.
- Karpicke, J. D. & Roediger, H. L. (2008). The critical importance of retrieval for learning. *Science, 319*, 966–968.
- Roediger, H. L. & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention. *Trends in Cognitive Sciences, 15*(1), 20–27.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T. & Rohrer, D. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin, 132*(3), 354–380.
- Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings. I J. Metcalfe & A. Shimamura (red.), *Metacognition*.
- Bjork, E. L. & Bjork, R. A. (2011). Making things hard on yourself, but in a good way. I M. A. Gernsbacher et al. (red.), *Psychology and the Real World*.
- Brown, P. C., Roediger, H. L. & McDaniel, M. A. (2014). *Make It Stick: The Science of Successful Learning*. Harvard University Press.

**Verbalprotokoll och diskursanalys**

- Ericsson, K. A. & Simon, H. A. (1980/1993). *Protocol Analysis: Verbal Reports as Data*. MIT Press.
- Gee, J. P. (2014). *An Introduction to Discourse Analysis* (4th ed.). Routledge.

**Learning analytics och transfer**

- Siemens, G. & Long, P. (2011). Penetrating the fog: Analytics in learning and education. *EDUCAUSE Review, 46*(5), 30–40.
- Lockyer, L., Heathcote, E. & Dawson, S. (2013). Informing pedagogical action: Aligning learning analytics with learning design. *American Behavioral Scientist, 57*(10), 1439–1459.
- Selwyn, N. (2019). What's the problem with learning analytics? *Journal of Learning Analytics, 6*(3), 11–19.
- Perkins, D. N. & Salomon, G. (1992). Transfer of learning. *International Encyclopedia of Education* (2nd ed.).

**Communities of practice (för senare)**

- Wenger, E. (1998). *Communities of Practice: Learning, Meaning, and Identity*. Cambridge University Press.

**Designforskning (parkerad — meta-projekt)**

- Anderson, T. & Shattuck, J. (2012). Design-based research: A decade of progress in education research? *Educational Researcher, 41*(1), 16–25.
- McKenney, S. & Reeves, T. C. (2018). *Conducting Educational Design Research* (2nd ed.). Routledge.
- Design-Based Research Collective (2003). Design-based research: An emerging paradigm for educational inquiry. *Educational Researcher, 32*(1), 5–8.
