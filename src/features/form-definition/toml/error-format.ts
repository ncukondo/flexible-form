import { type ZodIssue } from "zod";

/**
 * Resolve a Zod path to a 1-based line number in TOML text.
 */
export function resolveTomlLineNumber(
  tomlText: string,
  zodPath: (string | number)[],
): number | null {
  const lines = tomlText.split("\n");

  // Top-level field (e.g. ["title"])
  if (zodPath.length >= 1 && typeof zodPath[0] === "string" && zodPath[0] !== "items") {
    const fieldName = zodPath[0];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(new RegExp(`^\\s*${escapeRegex(fieldName)}\\s*=`))) {
        return i + 1;
      }
    }
    return null;
  }

  // Item field (e.g. ["items", 0, "choices"])
  if (zodPath[0] === "items" && typeof zodPath[1] === "number") {
    const itemIndex = zodPath[1];
    const fieldName = zodPath.length >= 3 && typeof zodPath[2] === "string" ? zodPath[2] : null;

    // Find the Nth [[items]] header
    let count = -1;
    let blockStart = -1;
    let blockEnd = lines.length;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^\s*\[\[items\]\]/)) {
        count++;
        if (count === itemIndex) {
          blockStart = i;
        } else if (count === itemIndex + 1) {
          blockEnd = i;
          break;
        }
      }
    }

    if (blockStart === -1) return null;

    // If no field name, return the [[items]] header line
    if (!fieldName) return blockStart + 1;

    // Search for the field within this item block
    for (let i = blockStart + 1; i < blockEnd; i++) {
      if (lines[i].match(new RegExp(`^\\s*${escapeRegex(fieldName)}\\s*=`))) {
        return i + 1;
      }
    }

    return null;
  }

  return null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Format a single ZodIssue into a human-readable line with TOML context.
 */
export function formatZodIssue(issue: ZodIssue, tomlText: string): string {
  const path = issue.path;
  const message = issue.message;
  const lineNumber = resolveTomlLineNumber(tomlText, path);
  const lineInfo = lineNumber !== null ? ` (line ${lineNumber})` : "";

  // Item field: e.g. ["items", 1, "choices"]
  if (path[0] === "items" && typeof path[1] === "number" && path.length >= 3) {
    const fieldName = path[2];
    const itemOrd = ordinal(path[1] + 1);
    return `${fieldName} in ${itemOrd} item${lineInfo}: ${message}`;
  }

  // Top-level field: e.g. ["title"]
  if (path.length >= 1 && typeof path[0] === "string") {
    return `${path[0]}${lineInfo}: ${message}`;
  }

  // Fallback
  return `${path.join(".")}${lineInfo}: ${message}`;
}
