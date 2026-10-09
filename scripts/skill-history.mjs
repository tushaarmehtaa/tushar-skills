#!/usr/bin/env node

// Writes site/lib/skill-history.json: when each skill package was added and
// last changed, from git history. Run it locally (full history required); the
// site reads the committed file because CI and Vercel clone shallow.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, getSkillDirectories } from "./repository.mjs";

export const SKILL_HISTORY_PATH = path.join(REPO_ROOT, "site", "lib", "skill-history.json");

const git = (...args) =>
  execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trim();

if (git("rev-parse", "--is-shallow-repository") === "true") {
  console.error("skill-history: shallow clone, dates would be wrong. Run with full history.");
  process.exit(1);
}

const history = {};
for (const slug of getSkillDirectories()) {
  const changes = git("log", "--format=%cs", "--", `${slug}/`).split("\n").filter(Boolean);
  const added = git("log", "--follow", "--diff-filter=A", "--format=%cs", "--", `${slug}/SKILL.md`)
    .split("\n")
    .filter(Boolean)
    .at(-1);
  history[slug] = {
    added: added ?? changes.at(-1) ?? null,
    updated: changes[0] ?? null,
    changes: changes.length,
  };
}

fs.writeFileSync(SKILL_HISTORY_PATH, `${JSON.stringify(history, null, 2)}\n`);
console.log(`skill-history: wrote ${Object.keys(history).length} skills`);
