#!/usr/bin/env node

// Copies the skills listed in plugin-skills.json from the repository root into
// each plugin's skills/ folder. Root skill folders stay the source of truth;
// each plugin's .claude-plugin/plugin.json is maintained by hand.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, "plugin-skills.json"), "utf8"));

// The directory validator rejects files it cannot read as source.
const BLOCKED = /\.(png|jpe?g|gif|webp|avif|ico|svg|woff2?|ttf|otf|eot|zip|tar|gz|tgz|mcpb|dxt|wasm|exe|bin|so|dylib|jar|pyc|mp4|mov|pdf)$/i;

function copySkill(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copySkill(from, to);
    } else if (entry.isFile()) {
      if (BLOCKED.test(entry.name)) throw new Error(`${path.relative(repoRoot, from)}: not allowed in a plugin`);
      fs.copyFileSync(from, to);
    } else {
      throw new Error(`${path.relative(repoRoot, from)}: only regular files and folders can be copied`);
    }
  }
}

try {
  for (const [pluginDir, skills] of Object.entries(config)) {
    if (!fs.existsSync(path.join(repoRoot, pluginDir, ".claude-plugin", "plugin.json"))) {
      throw new Error(`${pluginDir}/.claude-plugin/plugin.json is missing`);
    }
    for (const skill of skills) {
      if (!fs.existsSync(path.join(repoRoot, skill, "SKILL.md"))) throw new Error(`${skill}/SKILL.md is missing`);
    }

    // Recreate the folder so removed skills and removed files cannot linger.
    const skillsDir = path.join(repoRoot, pluginDir, "skills");
    fs.rmSync(skillsDir, { recursive: true, force: true });
    for (const skill of skills) copySkill(path.join(repoRoot, skill), path.join(skillsDir, skill));
    console.log(`${pluginDir}: copied ${skills.length} skills`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
