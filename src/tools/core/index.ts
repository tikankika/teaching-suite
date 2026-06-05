/**
 * Core Tools - Layer 1
 *
 * Minimal, generic, workspace-aware tools.
 * These are the building blocks for all pipelines in teaching-suite.
 *
 * Tools:
 * - file_read: Read file content
 * - file_write: Create/write files
 * - file_edit: Edit existing files
 * - file_search: Search across files
 */

// Workspace validation
export {
  validateWorkspace,
  validatePath,
  validatePathInWorkspace,
  setServerWorkspace,
  getServerWorkspace,
  MAX_FILE_SIZE,
} from './workspace.js';

// Core tools
export { fileRead, FileReadInputSchema, type FileReadInput, type FileReadOutput } from './file-read.js';
export { fileWrite, FileWriteInputSchema, type FileWriteInput, type FileWriteOutput } from './file-write.js';
export { fileEdit, FileEditInputSchema, type FileEditInput, type FileEditOutput, type EditOperation } from './file-edit.js';
export { fileSearch, FileSearchInputSchema, type FileSearchInput, type FileSearchOutput, type SearchMatch } from './file-search.js';
