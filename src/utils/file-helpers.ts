/**
 * Shared file operation helpers.
 */

import * as fs from 'fs/promises';

/**
 * Read a file, returning null if it does not exist or cannot be read.
 */
export async function readFileOrNull(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Check whether a file exists at the given path.
 */
export async function fileExists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a directory (and parents) if it does not already exist.
 */
export async function ensureDirectory(dirpath: string): Promise<void> {
  await fs.mkdir(dirpath, { recursive: true });
}
