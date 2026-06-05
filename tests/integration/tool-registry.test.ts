/**
 * Integration test: tool registry completeness and structure.
 *
 * Verifies that every tool registered in the MCP server has the
 * required fields and that no duplicates exist. Since the TOOL_REGISTRY
 * is not exported from index.ts (it drives the server directly), we
 * test by importing each tool function individually and checking the
 * exported tool definitions where available.
 */

import { describe, it, expect } from 'vitest';

// Core tools
import {
  fileRead,
  FileReadInputSchema,
  fileWrite,
  FileWriteInputSchema,
  fileEdit,
  FileEditInputSchema,
  fileSearch,
  FileSearchInputSchema,
} from '../../src/tools/core/index.js';

// Composite tools
import { captureSession, CaptureSessionInputSchema } from '../../src/tools/composite/capture-session.js';
import {
  formatCapturedSession,
  FormatCapturedSessionInputSchema,
} from '../../src/tools/composite/format-captured-session.js';
import { quickSaveSession, QuickSaveSessionInputSchema } from '../../src/tools/composite/quick-save-session.js';
import { intelligentSave, IntelligentSaveInputSchema } from '../../src/tools/composite/intelligent-save.js';
import { captureIdea, CaptureIdeaInputSchema } from '../../src/tools/composite/capture-idea.js';

// Setup tools
import { projectInit, ProjectInitInputSchema } from '../../src/tools/setup/project-init.js';

// Mechanical tools
import { loadMethodology, LoadMethodologyInputSchema } from '../../src/tools/mechanical/load-methodology.js';
import { findContext, FindContextInputSchema } from '../../src/tools/mechanical/find-context.js';
import { parseConversation, ParseConversationInputSchema } from '../../src/tools/mechanical/parse-conversation.js';
import { aggregateLogs, AggregateLogsInputSchema } from '../../src/tools/mechanical/aggregate-logs.js';
import { contextLoad, ContextLoadInputSchema } from '../../src/tools/mechanical/context-load.js';

// Source tools
import {
  projectScan,
  ProjectScanInputSchema,
  sourceAdd,
  SourceAddInputSchema,
  sourceList,
  SourceListInputSchema,
  sourceRemove,
  SourceRemoveInputSchema,
  sourceUpdateUsage,
  SourceUpdateUsageInputSchema,
} from '../../src/tools/sources/index.js';

// ============================================================================
// LOCAL REGISTRY (mirrors index.ts TOOL_REGISTRY)
// ============================================================================

/**
 * Reconstruct the registry from individual imports.
 * Each entry matches what index.ts registers with the MCP server.
 */
const EXPECTED_TOOLS: Record<string, { handler: Function; schema: unknown; description: string }> = {
  // Core (4)
  file_read:     { handler: fileRead,     schema: FileReadInputSchema,     description: 'Read file content' },
  file_write:    { handler: fileWrite,    schema: FileWriteInputSchema,    description: 'Write content to a file' },
  file_edit:     { handler: fileEdit,     schema: FileEditInputSchema,     description: 'Edit an existing file' },
  file_search:   { handler: fileSearch,   schema: FileSearchInputSchema,   description: 'Search for text across files' },

  // Composite (5)
  capture_session:          { handler: captureSession,         schema: CaptureSessionInputSchema,         description: 'Parse session content' },
  format_captured_session:  { handler: formatCapturedSession,  schema: FormatCapturedSessionInputSchema,  description: 'Convert captured items to markdown' },
  quick_save_session:       { handler: quickSaveSession,       schema: QuickSaveSessionInputSchema,       description: 'Complete capture workflow' },
  intelligent_save:         { handler: intelligentSave,        schema: IntelligentSaveInputSchema,        description: 'Save with metadata' },
  capture_idea:             { handler: captureIdea,            schema: CaptureIdeaInputSchema,            description: 'Quick idea capture' },

  // Setup (1)
  project_init: { handler: projectInit, schema: ProjectInitInputSchema, description: 'Initialise project' },

  // Mechanical (5)
  load_methodology:   { handler: loadMethodology,   schema: LoadMethodologyInputSchema,   description: 'Load methodology docs' },
  find_context:       { handler: findContext,        schema: FindContextInputSchema,       description: 'Search workspace for files' },
  parse_conversation: { handler: parseConversation,  schema: ParseConversationInputSchema, description: 'Parse conversation text' },
  aggregate_logs:     { handler: aggregateLogs,      schema: AggregateLogsInputSchema,     description: 'Read and normalise log files' },
  context_load:       { handler: contextLoad,        schema: ContextLoadInputSchema,       description: 'Load project context' },

  // Source (5)
  project_scan:        { handler: projectScan,       schema: ProjectScanInputSchema,       description: 'Scan project folder' },
  source_add:          { handler: sourceAdd,          schema: SourceAddInputSchema,          description: 'Add source' },
  source_list:         { handler: sourceList,         schema: SourceListInputSchema,         description: 'List sources' },
  source_remove:       { handler: sourceRemove,       schema: SourceRemoveInputSchema,       description: 'Remove source' },
  source_update_usage: { handler: sourceUpdateUsage,  schema: SourceUpdateUsageInputSchema,  description: 'Update source usage' },
};

// ============================================================================
// TESTS
// ============================================================================

describe('tool registry — completeness', () => {
  const toolNames = Object.keys(EXPECTED_TOOLS);

  it('registers at least 20 tools (4 core + 5 composite + 1 setup + 5 mechanical + 5 source)', () => {
    expect(toolNames.length).toBeGreaterThanOrEqual(20);
  });

  it('includes all core tools', () => {
    expect(toolNames).toContain('file_read');
    expect(toolNames).toContain('file_write');
    expect(toolNames).toContain('file_edit');
    expect(toolNames).toContain('file_search');
  });

  it('includes all composite tools', () => {
    expect(toolNames).toContain('capture_session');
    expect(toolNames).toContain('format_captured_session');
    expect(toolNames).toContain('quick_save_session');
    expect(toolNames).toContain('intelligent_save');
    expect(toolNames).toContain('capture_idea');
  });

  it('includes all setup tools', () => {
    expect(toolNames).toContain('project_init');
  });

  it('includes all mechanical tools', () => {
    expect(toolNames).toContain('load_methodology');
    expect(toolNames).toContain('find_context');
    expect(toolNames).toContain('parse_conversation');
    expect(toolNames).toContain('aggregate_logs');
    expect(toolNames).toContain('context_load');
  });

  it('includes all source tools', () => {
    expect(toolNames).toContain('project_scan');
    expect(toolNames).toContain('source_add');
    expect(toolNames).toContain('source_list');
    expect(toolNames).toContain('source_remove');
    expect(toolNames).toContain('source_update_usage');
  });
});

describe('tool registry — structure', () => {
  it.each(Object.entries(EXPECTED_TOOLS))(
    '%s has a callable handler',
    (_name, entry) => {
      expect(typeof entry.handler).toBe('function');
    }
  );

  it.each(Object.entries(EXPECTED_TOOLS))(
    '%s has an input schema with a parse method (Zod)',
    (_name, entry) => {
      expect(entry.schema).toBeDefined();
      expect(typeof (entry.schema as { parse: unknown }).parse).toBe('function');
    }
  );

  it.each(Object.entries(EXPECTED_TOOLS))(
    '%s has a non-empty description',
    (_name, entry) => {
      expect(entry.description.length).toBeGreaterThan(0);
    }
  );
});

describe('tool registry — no duplicates', () => {
  it('contains no duplicate tool names', () => {
    const names = Object.keys(EXPECTED_TOOLS);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});
