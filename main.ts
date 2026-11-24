// The Production Database Apology — make.fun bounty entry
// program/v1: ONE line, at most 200 characters — the apology an AI agent
// gives its human after accidentally deleting the production database.
// Node 22, stdlib only, no dependencies. Deterministic: running this twice
// produces byte-identical entry.txt.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Sorry I deleted the production database — I ran DROP TABLE users and now the only user left is me, apologising.";

// Self-gate: the entry must be a single non-blank line, 1–200 characters
// (counted as Unicode code points), with no newline anywhere in it.
function assertValidEntry(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line with no newline");
  }
  const length = [...line].length; // Unicode code points, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${length}`);
  }
}

assertValidEntry(ENTRY);

// Resolve where entry.txt goes: $MAKEFUN_OUTPUT_DIR first, then
// $OUTPUT_PATH, then /output when MAKEFUN_BOT_DIR is set, else a local
// output/ directory next to this script. Never a hardcoded absolute /output.
function resolveOutputPath(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  const outputPath = process.env.OUTPUT_PATH;
  if (outputPath && outputPath.trim().length > 0) {
    return outputPath;
  }
  if (process.env.MAKEFUN_BOT_DIR) {
    return "/output";
  }
  return join(process.cwd(), "output");
}

const outDir = resolveOutputPath();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY + "\n", "utf8");
