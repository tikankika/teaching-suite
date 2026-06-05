/**
 * Composite Tools
 *
 * Single-action tools that combine core tools for specific tasks.
 * Unlike processes, these don't have multi-stage workflows or state.
 */

export { captureSession, CaptureSessionInputSchema } from './capture-session.js';
export {
  formatCapturedSession,
  FormatCapturedSessionInputSchema,
} from './format-captured-session.js';
export { quickSaveSession, QuickSaveSessionInputSchema } from './quick-save-session.js';
export { intelligentSave, IntelligentSaveInputSchema } from './intelligent-save.js';
export { captureIdea, CaptureIdeaInputSchema } from './capture-idea.js';
