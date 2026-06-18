/**
 * Workspace validation utilities for core tools.
 * Provides security against path traversal attacks.
 *
 * Server-level workspace: set via --workspace CLI flag.
 * If no workspace is configured (neither tool-level nor server-level),
 * ALL file operations are rejected.
 */

import * as path from 'path';
import * as fs from 'fs/promises';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Maximum file size for read operations (10 MB). */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ============================================================================
// SERVER-LEVEL WORKSPACE
// ============================================================================

let _serverWorkspace: string | undefined;
// Cached realpath of _serverWorkspace. Server workspace is set once at startup
// and read on every file op — caching avoids a syscall per call.
let _serverWorkspaceReal: string | undefined;

/**
 * Set the server-level workspace (called once at startup from --workspace flag).
 */
export function setServerWorkspace(ws: string): void {
  _serverWorkspace = path.resolve(ws);
  _serverWorkspaceReal = undefined; // invalidate cache; lazy-resolve on next use
}

/**
 * Get the server-level workspace (for diagnostics/logging).
 */
export function getServerWorkspace(): string | undefined {
  return _serverWorkspace;
}

/**
 * Lazy-resolve the server workspace through symlinks, caching the result.
 */
async function getServerWorkspaceReal(): Promise<string | undefined> {
  if (!_serverWorkspace) return undefined;
  if (!_serverWorkspaceReal) {
    _serverWorkspaceReal = await resolveRealPath(_serverWorkspace);
  }
  return _serverWorkspaceReal;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Resolve a path through symlinks using fs.realpath().
 * For paths that do not yet exist (e.g. file_write targets),
 * resolves the parent directory and appends the filename.
 */
async function resolveRealPath(filePath: string): Promise<string> {
  try {
    return await fs.realpath(filePath);
  } catch {
    // Path does not exist — walk up the directory tree to find the
    // nearest existing ancestor, resolve it, then re-append the tail.
    const resolved = path.resolve(filePath);
    let current = resolved;
    const tail: string[] = [];

    while (current !== path.dirname(current)) {
      tail.unshift(path.basename(current));
      current = path.dirname(current);
      try {
        const realAncestor = await fs.realpath(current);
        return path.join(realAncestor, ...tail);
      } catch {
        // ancestor doesn't exist either — keep walking up
      }
    }

    // Nothing resolved — fall back to path.resolve()
    return resolved;
  }
}

/**
 * Containment check with prefix-attack guard.
 * Both inputs must already be resolved through fs.realpath() — this is a
 * pure string comparison, not a filesystem operation.
 *
 * Adds a trailing path separator so a workspace path does not match a sibling
 * whose name merely starts with it (e.g. ".../proj" vs ".../project") — a
 * sibling-directory prefix attack.
 */
function isContainedIn(child: string, parent: string): boolean {
  if (child === parent) return true;
  const parentWithSep = parent.endsWith(path.sep) ? parent : parent + path.sep;
  return child.startsWith(parentWithSep);
}

/**
 * Validate that a resolved path is within the workspace.
 * Prevents path traversal attacks (e.g., "../../etc/passwd")
 * and symlink escape attacks.
 *
 * Uses fs.realpath() to resolve symlinks before comparison.
 *
 * Workspace resolution — narrowing-only:
 *   - When the server-level workspace (--workspace flag) is set, it is the
 *     authoritative outer boundary. The caller-supplied workspace argument
 *     may only NARROW the boundary; it must resolve inside the server
 *     workspace. A caller workspace outside the server workspace is rejected.
 *   - When the server-level workspace is unset (legacy mode), the caller
 *     workspace is used as the boundary.
 *   - When neither is set, all file operations are rejected.
 */
export async function validateWorkspace(
  filePath: string,
  workspace?: string
): Promise<{ valid: boolean; error?: string; resolvedPath: string }> {
  // Resolve all three paths in parallel. Server workspace realpath is
  // cached; caller resolution is skipped if not provided.
  const [resolvedPath, callerResolved, serverResolved] = await Promise.all([
    resolveRealPath(filePath),
    workspace ? resolveRealPath(workspace) : Promise.resolve(undefined),
    getServerWorkspaceReal(),
  ]);

  // Determine the effective trust boundary (narrowing-only).
  let effectiveResolved: string;
  if (serverResolved && callerResolved) {
    if (!isContainedIn(callerResolved, serverResolved)) {
      return {
        valid: false,
        error:
          'Caller-supplied workspace is outside the server workspace (--workspace lock). The workspace argument may only narrow the server lock, not broaden it.',
        resolvedPath,
      };
    }
    effectiveResolved = callerResolved;
  } else if (serverResolved) {
    effectiveResolved = serverResolved;
  } else if (callerResolved) {
    effectiveResolved = callerResolved;
  } else {
    return {
      valid: false,
      error: 'No workspace configured. Start server with --workspace flag.',
      resolvedPath,
    };
  }

  if (!isContainedIn(resolvedPath, effectiveResolved)) {
    return {
      valid: false,
      error: 'Path is outside the allowed workspace',
      resolvedPath,
    };
  }

  return { valid: true, resolvedPath };
}

/**
 * Validate that a path is not empty and contains no null bytes.
 */
export function validatePath(filePath: string): { valid: boolean; error?: string } {
  if (!filePath || filePath.trim() === '') {
    return { valid: false, error: 'Path cannot be empty' };
  }

  if (filePath.includes('\0')) {
    return { valid: false, error: 'Path contains invalid characters (null bytes)' };
  }

  return { valid: true };
}

/**
 * Combined validation: path format + workspace containment.
 */
export async function validatePathInWorkspace(
  filePath: string,
  workspace?: string
): Promise<{ valid: boolean; error?: string; resolvedPath?: string }> {
  // First validate path format
  const pathValidation = validatePath(filePath);
  if (!pathValidation.valid) {
    return pathValidation;
  }

  // Then validate workspace containment (resolves symlinks)
  const workspaceValidation = await validateWorkspace(filePath, workspace);
  if (!workspaceValidation.valid) {
    return { valid: false, error: workspaceValidation.error };
  }

  return { valid: true, resolvedPath: workspaceValidation.resolvedPath };
}
