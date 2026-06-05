/**
 * Shared text extraction and formatting helpers.
 */

/**
 * Extract a title from content: first `#` heading or first line, truncated.
 *
 * @param content   Raw text (markdown or plain)
 * @param maxLength Maximum title length (default 60)
 * @param ellipsis  Whether to append `...` when truncating (default false)
 */
export function extractTitle(
  content: string,
  maxLength = 60,
  ellipsis = false,
): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    const heading = headingMatch[1].trim();
    if (heading.length <= maxLength) return heading;
    return ellipsis
      ? heading.substring(0, maxLength - 3) + '...'
      : heading.substring(0, maxLength);
  }

  const firstLine = content.split('\n')[0].trim();
  if (firstLine.length <= maxLength) return firstLine;
  return ellipsis
    ? firstLine.substring(0, maxLength - 3) + '...'
    : firstLine.substring(0, maxLength);
}
