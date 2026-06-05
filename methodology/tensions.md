# Methodology — Spänningar att hålla

*Methodology v3.0, 2026-04-29 (DRAFT). Spec-dokument — väntar på integration via load_methodology-enum.*

---

## Vad detta dokument är

V3.0:s metodologi vilar på fem teoretiska axlar som inte alltid är överens. Detta dokument **namnger spänningarna utan att lösa dem**.

Vissa spänningar är **produktiva** och ska hållas öppna. Andra är **riskpunkter** där design-beslut måste tas medvetet. Detta dokument läses som referens — inte en gång, utan **varje gång en design-cykel börjar driva åt det enkla, mätbara eller processuella**. Då har troligen en spänning tystnat.

**Användning av Cowork:** läs när läraren designar, planerar, eller granskar — inte automatiskt, men när relevant. Namnge spänningen om designvalet rör vid den.

---

## Spänning 1 — Bildung vs. specificerbart lärande

**Sidor:** Klafki, Stenhouse, Biesta vs. Wiggins & McTighe, Biggs

Kan det viktigaste lärandet specificeras i förväg, eller är det just det oförutsägbara mötet mellan elev och innehåll som bär bildning?

| Position | Argument |
|---|---|
| Klafki | Bildung kan inte reduceras till mätbara outcomes |
| Wiggins & McTighe / Biggs | Utan tydliga mål driftar kurser; alignment är förutsättning för rättvis bedömning |
| Stenhouse | Kursen är hypotes, inte plan |
| Biesta | *Subjectification* är per definition oförutsägbart |

**Hur hantera:** Behåll spänningen. ILO finns kvar som operativ struktur, men varje ILO testas mot frågan: *"Fångar denna det som är värt att lära, eller bara det som är lätt att mäta?"* Den frågan är Klafkis bidrag.

**Risk-signal:** Om alla ILO är level-2 verb (förstår, beskriver) — har Klafki tystnat.

---

## Spänning 2 — Alignment vs. desirable difficulties

**Sidor:** Biggs vs. Bjork

Biggs vill att aktiviteterna är direkt riktade mot ILO. Bjork visar att det som *känns* alignerat ofta ger sämst djuplärande — viss obekvämhet, omväg och friktion ger bättre långtidsretention.

**Hur hantera:** Designprincip — **alignment ligger på *ILO-nivå*, inte på *aktivitetsnivå*.** Aktiviteten får (bör) vara svårare och mer omvägsfull än verbet i ILO antyder.

**Risk-signal:** AUTO som mekaniskt verbalignerar TLA mot ILO ska inte tolkas som *"perfekt match är bäst"* utan som *"möjlig match — är aktiviteten ändå rätt slags svårighet?"*

---

## Spänning 3 — Testing effect vs. formativ bedömning

**Sidor:** Karpicke/Roediger (retrieval testing) vs. Black & Wiliam (dialogisk formativ)

Inte direkt motsägelse, men risk: retrieval-testandet är *kognitivt effektivt, mätbart, lätt att skala*. Formativ bedömning är *dialogisk, kvalitativ, relationell*. Den första kan tränga ut den andra om infrastrukturen gör det enkelt.

**Hur hantera:** Princip — **retrieval-tester är komplement, inte ersättning** för formativ dialog.

AUTO:s rapporter ska inte locka till *"fler tester"* utan till *"samtal om dessa begrepp"*. Pilotcykelns mätpunkt — *påverkar Teacher Insight-rapporten faktiskt pre-lesson-designen?* — är skydd mot ren testdrift.

**Risk-signal:** Bedömningssidan dominerar reflektionssidan över tid.

---

## Spänning 4 — Learning analytics vs. lärarens omdöme

**Sidor:** Siemens & Long vs. Selwyn

**MCP-projektets centrala spänning.** Data ger insikter, mönster, evidens. Selwyn varnar: learning analytics förskjuter omdömet från läraren till systemet, och fångar bara det mätbara.

**Hur hantera:** Grundprincipen — **AI håller ställning, människan håller mening** — är formuleringen av denna spänning som designval.

Men spänningen försvinner inte genom en princip; den måste hanteras i **varje konkret implementation**. Varje gång AUTO genererar något ska frågan ställas: *"Gör detta lärarens omdöme skarpare eller överflödigt?"*

**Risk-signal:** Lärare börjar fråga *"vad säger systemet?"* istället för *"vad ser jag?"*.

---

## Spänning 5 — Process vs. innehåll: Conole utan Klafki

**Sidor:** Conole (7Cs designprocess) vs. Klafki (didaktisk innehållsfråga)

Conole 7Cs är en *moraliskt tom* designprocess. *Conceptualize, Capture, Create...* — alla verb är neutrala. Klafki skulle fråga: i *Conceptualize* — har du frågat *varför just detta innehåll*?

**Hur hantera:** Princip — **Conole-faserna är *processteg*, men varje steg passerar ett *innehållsfilter* som är klafkianskt.**

*Capture* med Klafki: vilket material bär *exemplaritet*, inte bara *tillgänglighet*?

**Risk-signal:** Designprocesser blir effektiva utan att fråga *"varför detta?"*

---

## Sammanfattning — när läsa detta dokument

| Trigger | Vilken spänning är aktiv? |
|---|---|
| Skriver ILO eller utvärderar dem | Spänning 1 + 5 |
| Designar aktiviteter eller pratar om alignment | Spänning 2 |
| Lägger till retrieval-tester eller diskuterar bedömning | Spänning 3 |
| AI/AUTO genererar rapporter eller insikter | Spänning 4 |
| Använder Conole-design-process | Spänning 5 |

**Cowork-instruktion:** När en av dessa triggar är aktiv — namnge spänningen för läraren. Inte som hinder, utan som *medveten ramning* av det val som ska göras.

---

**Status:** DRAFT — väntar på enum-registrering i load_methodology samt referens i SYSTEM_INSTRUCTIONS.

**Källa:** `pedagogisk_arkitektur.md` § "Spänningar att hålla"

**Version:** 0.1 (2026-04-29)
