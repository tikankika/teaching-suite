# Capture Session - Metodologi

## Syfte

`capture_session` är ett verktyg för att fånga och strukturera innehåll från samtal/sessioner med AI. Det hjälper lärare att:

- Spara idéer, beslut och reflektioner från arbetssessioner
- Skapa sökbart, strukturerat material i Obsidian
- Koppla ihop tankar med projekt och kurser

## Hur det fungerar

### Input

Verktyget tar emot:

1. **content** (obligatoriskt): Texten att analysera
2. **source** (valfritt): Varifrån innehållet kommer (default: "claude-desktop")
3. **project** (valfritt): Projekt-länk, t.ex. `[[Teaching Suite]]`
4. **course** (valfritt): Kurs-länk, t.ex. `[[KURS101_2026]]`

### Kategorisering

Innehållet analyseras och delas upp i kategorier:

| Kategori | Nyckelord | Emoji | Prioritet |
|----------|-----------|-------|-----------|
| Idé | Idé, Idea, Kanske, Maybe | 💡 | medium |
| Beslut | Beslut, Decision, Bestämt | ✅ | high |
| Reflektion | Reflektion, Reflection, Tanke | 🤔 | medium |
| Fråga | Fråga, Question | ❓ | medium |
| Observation | Observation, Notering, Note | 👁️ | low |
| Åtgärd | Åtgärd, Action, TODO, Gör | 🎯 | high |

### Output

En markdown-fil skapas i `Captured/`-mappen med:

- YAML frontmatter (Dataview-kompatibel)
- Strukturerade sektioner för varje del
- Inline fields för filtrering

## Användningsexempel

### Exempel 1: Enkel session

**Input:**
```
Vi diskuterade T-HCK som teoretisk grund för Teaching Suite.
Beslut: T-HCK ska vara central teori.
Idé: Kanske kan vi använda det för assessment också?
```

**Resultat:**
- Fil: `Captured/captured_2026-01-08_claude-desktop_decision-idea.md`
- 2 delar: 1 beslut, 1 idé

### Exempel 2: Med projekt-koppling

**Input:**
```json
{
  "content": "Beslut: Implementera capture-layer först.\nÅtgärd: Skapa grundläggande MCP-struktur.",
  "project": "[[Teaching Suite]]",
  "course": "[[KURS101_2026]]"
}
```

**Resultat:**
- Frontmatter innehåller projekt- och kurskopplingar
- Dataview-queries kan hitta relaterade filer

## Tips för bästa resultat

### Strukturera input tydligt

Använd nyckelord i början av varje del:

```
Beslut: Vi använder Node.js för MCP-servern.
Idé: Vi kan lägga till voice-to-text senare.
Fråga: Hur hanterar vi synkning med Nextcloud?
```

### Koppla till kontext

Lägg alltid till projekt och/eller kurs om det är relevant:

```json
{
  "content": "...",
  "project": "[[Teaching Suite]]"
}
```

### Granska captured files

Filer sparas med `status: raw` och `reviewed: false`. Gå igenom dem regelbundet och:

1. Korrigera eventuella felkategoriseringar
2. Lägg till `[[wikilinks]]` till relaterat material
3. Uppdatera `reviewed: true` när du är klar

## Dataview-queries

### Hitta alla obehandlade captures

```dataview
TABLE date, item-count, project
FROM "Captured"
WHERE type = "captured-session" AND reviewed = false
SORT date DESC
```

### Hitta alla beslut

```dataview
LIST
FROM "Captured"
FLATTEN file.lists AS item
WHERE contains(item.text, "[type:: decision]")
```

### Hitta captures för ett projekt

```dataview
TABLE date, item-count
FROM "Captured"
WHERE project = "[[Teaching Suite]]"
SORT date DESC
```

## Filformat

### YAML Frontmatter

```yaml
---
type: captured-session
source: claude-desktop
date: 2026-01-08
project: "[[Teaching Suite]]"
course: "[[KURS101_2026]]"
status: raw
reviewed: false
item-count: 3
tags:
  - capture
  - auto-generated
---
```

### Del-struktur

```markdown
## 💡 Idé: Titel på idén
[type:: idea] [priority:: medium] [status:: raw] [captured:: 2026-01-08T10:15]

Innehållet i idén kommer här...

Kopplingar:: [[relaterad-fil]], [[annan-fil]]

---
```

## Tekniska detaljer

- **Filnamn:** `captured_YYYY-MM-DD_<source>_<description>.md`
- **Plats:** `/path/to/courses/Biologi/Captured/`
- **Encoding:** UTF-8 (utan BOM)
- **Wikilinks i YAML:** Måste quotas (`"[[link]]"`)
