/**
 * Tests for content-scanner utility — GDPR pattern detection.
 */

import { describe, it, expect } from 'vitest';
import { scanForInternalData } from '../../src/utils/content-scanner.js';

describe('scanForInternalData', () => {
  describe('clean content', () => {
    it('should return empty array for normal pedagogical content', () => {
      const content =
        'Idag planerar vi en lektion om fotosyntes. Eleverna ska arbeta i grupper.';
      const warnings = scanForInternalData(content);
      expect(warnings).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      expect(scanForInternalData('')).toEqual([]);
    });

    it('should return empty array for English content without sensitive terms', () => {
      const content = 'Lesson plan for biology. Students will study cell division.';
      expect(scanForInternalData(content)).toEqual([]);
    });
  });

  describe('high severity — GDPR sensitive data', () => {
    it('should detect "personnummer" keyword', () => {
      const content = 'Elevens personnummer: 200801011234';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('high');
      expect(warnings[0].code).toBe('SENSITIVE_STUDENT_DATA');
      expect(warnings[0].matches).toContain('personnummer');
    });

    it('should detect "orosanmälan" keyword', () => {
      const content = 'Vi har gjort en orosanmälan till socialtjänsten.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('high');
      expect(warnings[0].code).toBe('SENSITIVE_STUDENT_DATA');
      expect(warnings[0].matches).toContain('orosanmälan');
    });

    it('should group multiple high-severity matches into one warning', () => {
      const content =
        'Elevens personnummer finns i akten. En orosanmälan skickades igår.';
      const warnings = scanForInternalData(content);

      const highWarnings = warnings.filter((w) => w.severity === 'high');
      expect(highWarnings).toHaveLength(1);
      expect(highWarnings[0].matches).toContain('personnummer');
      expect(highWarnings[0].matches).toContain('orosanmälan');
    });
  });

  describe('medium severity — student privacy and exam security', () => {
    it('should detect "elevhälsa"', () => {
      const content = 'Vi kontaktade elevhälsan om ärendet.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('medium');
      expect(warnings[0].code).toBe('POSSIBLE_SENSITIVE_DATA');
      expect(warnings[0].matches).toContain('elevhälsa');
    });

    it('should detect "anpassning"', () => {
      const content = 'Eleven har en anpassning i matematik.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].matches).toContain('anpassning (ev. särskilt stöd)');
    });

    it('should detect "åtgärdsprogram"', () => {
      const content = 'Vi upprättade ett åtgärdsprogram för eleven.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('åtgärdsprogram'))).toBe(true);
    });

    it('should detect "funktionsnedsättning"', () => {
      const content = 'Eleven har en funktionsnedsättning som påverkar skolarbetet.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('funktionsnedsättning'))).toBe(
        true,
      );
    });

    it('should detect "diagnos"', () => {
      const content = 'Elevens diagnos är känd av elevhälsan.';
      const warnings = scanForInternalData(content);

      const medium = warnings.find((w) => w.severity === 'medium');
      expect(medium).toBeDefined();
      expect(medium!.matches).toContain('diagnos');
    });

    it('should detect "folkbokföring"', () => {
      const content = 'Kontroll av folkbokföring behövs.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('folkbokföring'))).toBe(true);
    });

    it('should detect exam-security terms: "provfrågor"', () => {
      const content = 'Här är provfrågorna till fredagens prov.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('provfrågor'))).toBe(true);
    });

    it('should detect exam-security terms: "facit"', () => {
      const content = 'Facit till provet finns i mappen.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('facit'))).toBe(true);
    });

    it('should detect "bedömningsmatris"', () => {
      const content = 'Bedömningsmatrisen ska användas vid rättning.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('bedömningsmatris'))).toBe(true);
    });

    it('should detect "betygsunderlag"', () => {
      const content = 'Betygsunderlaget sammanställs i juni.';
      const warnings = scanForInternalData(content);

      expect(warnings.some((w) => w.matches.includes('betygsunderlag'))).toBe(true);
    });
  });

  describe('case sensitivity', () => {
    it('should detect "Personnummer" with capital letter', () => {
      const content = 'Personnummer ska inte sparas här.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].matches).toContain('personnummer');
    });

    it('should detect "OROSANMÄLAN" in uppercase', () => {
      const content = 'OROSANMÄLAN SKICKAD.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('high');
    });

    it('should detect "Elevhälsa" with capital E', () => {
      const content = 'Elevhälsa är viktigt.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(1);
      expect(warnings[0].severity).toBe('medium');
    });
  });

  describe('multiple matches across severities', () => {
    it('should return separate warnings for high and medium severity', () => {
      const content =
        'Elevens personnummer och diagnos diskuterades av elevhälsan.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(2);

      const highWarning = warnings.find((w) => w.severity === 'high');
      const mediumWarning = warnings.find((w) => w.severity === 'medium');

      expect(highWarning).toBeDefined();
      expect(highWarning!.matches).toContain('personnummer');

      expect(mediumWarning).toBeDefined();
      expect(mediumWarning!.matches).toContain('diagnos');
      expect(mediumWarning!.matches).toContain('elevhälsa');
    });

    it('should list high warnings before medium', () => {
      const content = 'Orosanmälan angående diagnos.';
      const warnings = scanForInternalData(content);

      expect(warnings).toHaveLength(2);
      expect(warnings[0].severity).toBe('high');
      expect(warnings[1].severity).toBe('medium');
    });
  });

  describe('warning message formatting', () => {
    it('should include matched labels in the message', () => {
      const content = 'Elevens personnummer skickades.';
      const warnings = scanForInternalData(content);

      expect(warnings[0].message).toContain('personnummer');
      expect(warnings[0].message).toContain('highly sensitive student data');
    });

    it('should join multiple matches with commas', () => {
      const content = 'Facit och provfrågor ska inte delas.';
      const warnings = scanForInternalData(content);

      const medium = warnings.find((w) => w.severity === 'medium');
      expect(medium!.message).toContain('provfrågor, facit');
    });
  });
});
