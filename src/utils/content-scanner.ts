/**
 * Content Scanner — mechanical safety checks on saved content.
 *
 * Detects patterns that may indicate student-sensitive or exam-related data.
 * Warns but NEVER blocks saving — the teacher decides.
 *
 * Adapted from Carpenter MCP for teaching domain (GDPR/student privacy + exam security).
 */

export interface ContentWarning {
  code: string;
  severity: 'high' | 'medium' | 'info';
  message: string;
  matches: string[];
}

const INTERNAL_DATA_PATTERNS: Array<{ pattern: RegExp; label: string; severity: 'high' | 'medium' }> = [
  // Student privacy / GDPR (high severity)
  { pattern: /personnummer/i, label: 'personnummer', severity: 'high' },
  { pattern: /orosanmälan/i, label: 'orosanmälan', severity: 'high' },
  // Student privacy / GDPR (medium severity)
  { pattern: /folkbokföring/i, label: 'folkbokföring', severity: 'medium' },
  { pattern: /elevhälsa/i, label: 'elevhälsa', severity: 'medium' },
  { pattern: /funktionsnedsättning/i, label: 'funktionsnedsättning', severity: 'medium' },
  { pattern: /anpassning/i, label: 'anpassning (ev. särskilt stöd)', severity: 'medium' },
  { pattern: /åtgärdsprogram/i, label: 'åtgärdsprogram', severity: 'medium' },
  { pattern: /diagnos/i, label: 'diagnos', severity: 'medium' },
  // Exam/grade security (medium severity)
  { pattern: /provfråg/i, label: 'provfrågor', severity: 'medium' },
  { pattern: /facit/i, label: 'facit', severity: 'medium' },
  { pattern: /bedömningsmatris/i, label: 'bedömningsmatris', severity: 'medium' },
  { pattern: /betygsunderlag/i, label: 'betygsunderlag', severity: 'medium' },
];

/** Warning metadata keyed by severity. */
const WARNING_META: Record<'high' | 'medium', { code: string; template: string }> = {
  high: {
    code: 'SENSITIVE_STUDENT_DATA',
    template:
      'Content contains words that may indicate highly sensitive student data (MATCHES). Verify this should be saved in a document that could be shared.',
  },
  medium: {
    code: 'POSSIBLE_SENSITIVE_DATA',
    template:
      'Content contains words that may indicate student-sensitive or exam-related data (MATCHES). Verify this should be saved in a document that could be shared.',
  },
};

/**
 * Scan content for patterns that may indicate student-sensitive or exam-related data.
 * Returns warnings array (empty if nothing found).
 *
 * Uses a single pass: matches are collected into a map keyed by severity, and
 * warnings are built directly from the populated buckets.
 */
export function scanForInternalData(content: string): ContentWarning[] {
  const buckets: Record<'high' | 'medium', string[]> = { high: [], medium: [] };

  for (const { pattern, label, severity } of INTERNAL_DATA_PATTERNS) {
    if (pattern.test(content)) {
      buckets[severity].push(label);
    }
  }

  const warnings: ContentWarning[] = [];
  for (const severity of ['high', 'medium'] as const) {
    const matches = buckets[severity];
    if (matches.length > 0) {
      const meta = WARNING_META[severity];
      warnings.push({
        code: meta.code,
        severity,
        message: meta.template.replace('MATCHES', matches.join(', ')),
        matches,
      });
    }
  }

  return warnings;
}
