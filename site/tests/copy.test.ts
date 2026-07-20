import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const sourceRoots = ["../app", "../components", "../lib"];

function readSources(relativeRoot: string): string {
  const root = fileURLToPath(new URL(relativeRoot, import.meta.url));

  return readdirSync(root, { withFileTypes: true })
    .map((entry) => {
      const relativePath = `${relativeRoot}/${entry.name}`;
      if (entry.isDirectory()) return readSources(relativePath);
      if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) return "";
      return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    })
    .join("\n");
}

test("decorative product narration stays out of the interface", () => {
  const source = sourceRoots.map(readSources).join("\n").toLowerCase();
  const removedPhrases = [
    "portable workflow library",
    "interactive installer",
    "choose a workflow; the cli asks for runtime and scope",
    "one portable package · three native runtimes",
    "one package, different runtimes",
    "built to the open agent skills specification · repository checks passing",
    "complete repository",
    "catalog metadata is separate from portable skill frontmatter",
    "choose your runtime",
    "claude app · chat-capable",
    "upload supported",
  ];

  for (const phrase of removedPhrases) {
    assert.equal(source.includes(phrase), false, `Found decorative interface copy: ${phrase}`);
  }
});
