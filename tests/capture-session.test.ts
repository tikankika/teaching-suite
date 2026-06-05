import { describe, it, expect } from 'vitest';
import { parseContent } from '../src/tools/composite/capture-session.js';

describe('parseContent', () => {
  it('should parse a decision', () => {
    const content = 'Beslut: T-HCK ska vara central teori.';
    const items = parseContent(content);

    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('decision');
    expect(items[0].content).toBe('T-HCK ska vara central teori.');
    expect(items[0].priority).toBe('high');
  });

  it('should parse an idea', () => {
    const content = 'Idé: Kanske kan vi använda det för assessment också?';
    const items = parseContent(content);

    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('idea');
    expect(items[0].content).toBe('Kanske kan vi använda det för assessment också?');
    expect(items[0].priority).toBe('medium');
  });

  it('should parse multiple items from test scenario', () => {
    const content = `Vi diskuterade T-HCK som teoretisk grund för Teaching Suite.
Beslut: T-HCK ska vara central teori.
Idé: Kanske kan vi använda det för assessment också?`;

    const items = parseContent(content);

    expect(items).toHaveLength(2);
    expect(items.find((i) => i.type === 'decision')).toBeDefined();
    expect(items.find((i) => i.type === 'idea')).toBeDefined();
  });

  it('should parse English keywords', () => {
    const content = 'Decision: Use TypeScript for implementation.';
    const items = parseContent(content);

    expect(items).toHaveLength(1);
    expect(items[0].type).toBe('decision');
  });

  it('should parse all item types', () => {
    const content = `Beslut: Gör X
Idé: Testa Y
Reflektion: Det fungerade bra
Fråga: Hur löser vi Z?
Observation: Eleverna var engagerade
Åtgärd: Fixa buggen`;

    const items = parseContent(content);

    expect(items).toHaveLength(6);
    expect(items.map((i) => i.type).sort()).toEqual([
      'action',
      'decision',
      'idea',
      'observation',
      'question',
      'reflection',
    ]);
  });

  it('should extract title from content', () => {
    const content = 'Beslut: Implementera capture-layer först. Detta är viktigt för MVP.';
    const items = parseContent(content);

    expect(items[0].title).toBe('Implementera capture-layer först');
  });

  it('should truncate long titles', () => {
    const longContent =
      'Beslut: Detta är en väldigt lång mening som innehåller många ord och borde trunkeras för att passa som titel.';
    const items = parseContent(longContent);

    expect(items[0].title.length).toBeLessThanOrEqual(60);
    expect(items[0].title).toContain('...');
  });
});
