#!/usr/bin/env node

import fs from "node:fs";
import {
  README_PATH,
  getSkillDirectories,
  loadParsedSkills,
  readCatalog,
  replaceReadmeCatalog,
} from "./repository.mjs";

const mode = process.argv[2] ?? "--check";
if (mode !== "--check" && mode !== "--write") {
  console.error("Usage: node scripts/sync-readme-catalog.mjs [--check|--write]");
  process.exit(2);
}

try {
  const catalog = readCatalog();
  const parsedSkills = loadParsedSkills(getSkillDirectories());
  const current = fs.readFileSync(README_PATH, "utf8");
  const expected = replaceReadmeCatalog(current, catalog, parsedSkills);

  if (current === expected) {
    console.log("README catalog is synchronized.");
  } else if (mode === "--write") {
    fs.writeFileSync(README_PATH, expected);
    console.log("Updated the generated README catalog.");
  } else {
    console.error(
      "README catalog is stale. Run `npm run catalog:sync` and commit README.md.",
    );
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
