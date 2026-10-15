#!/usr/bin/env node

// Copies the skills listed in plugin-skills.json from the repository root into
// each plugin's skills/ folder. Root skill folders stay the source of truth;
// each plugin's .claude-plugin/ folder (manifest, icon) is maintained by hand
// and never touched here.
//
// --check compares instead of copying and fails if any copy has drifted.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mode = process.argv[2] ?? "--write";
if (mode !== "--check" && mode !== "--write") {
  console.error("Usage: node scripts/build-plugin.mjs [--write|--check]");
  process.exit(2);
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, "plugin-skills.json"), "utf8"));

// The directory validator rejects files it cannot read as source.
const BLOCKED = /\.(png|jpe?g|gif|webp|avif|ico|svg|woff2?|ttf|otf|eot|zip|tar|gz|tgz|mcpb|dxt|wasm|exe|bin|so|dylib|jar|pyc|mp4|mov|pdf)$/i;

// Relative paths of every regular file under dir, skipping dotfiles.
function listFiles(dir, prefix = "") {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(path.join(dir, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`${path.join(dir, entry.name)}: only regular files and folders can be copied`);
  }
  return files;
}

// Map of plugin-relative path to root source path for one plugin.
function expectedFiles(skills) {
  const expected = new Map();
  for (const skill of skills) {
    if (!fs.existsSync(path.join(repoRoot, skill, "SKILL.md"))) throw new Error(`${skill}/SKILL.md is missing`);
    for (const file of listFiles(path.join(repoRoot, skill))) {
      if (BLOCKED.test(file)) throw new Error(`${skill}/${file}: not allowed in a plugin`);
      expected.set(path.join(skill, file), path.join(repoRoot, skill, file));
    }
  }
  return expected;
}

try {
  let drift = 0;
  for (const [pluginDir, skills] of Object.entries(config)) {
    if (!fs.existsSync(path.join(repoRoot, pluginDir, ".claude-plugin", "plugin.json"))) {
      throw new Error(`${pluginDir}/.claude-plugin/plugin.json is missing`);
    }
    const skillsDir = path.join(repoRoot, pluginDir, "skills");
    const expected = expectedFiles(skills);

    if (mode === "--write") {
      // Recreate the folder so removed skills and removed files cannot linger.
      fs.rmSync(skillsDir, { recursive: true, force: true });
      for (const [relative, source] of expected) {
        fs.mkdirSync(path.dirname(path.join(skillsDir, relative)), { recursive: true });
        fs.copyFileSync(source, path.join(skillsDir, relative));
      }
      console.log(`${pluginDir}: copied ${skills.length} skills`);
      continue;
    }

    const actual = new Set(listFiles(skillsDir));
    for (const [relative, source] of expected) {
      if (!actual.has(relative)) {
        console.error(`${pluginDir}/skills/${relative}: missing`);
        drift++;
      } else if (!fs.readFileSync(source).equals(fs.readFileSync(path.join(skillsDir, relative)))) {
        console.error(`${pluginDir}/skills/${relative}: differs from ${path.relative(repoRoot, source)}`);
        drift++;
      }
    }
    for (const relative of actual) {
      if (!expected.has(relative)) {
        console.error(`${pluginDir}/skills/${relative}: not in plugin-skills.json or the root skill`);
        drift++;
      }
    }
  }

  if (mode === "--check") {
    if (drift) {
      console.error(`${drift} plugin file(s) out of sync. Run \`npm run plugin:build\` and commit.`);
      process.exitCode = 1;
    } else {
      console.log("Plugin copies match their root skills.");
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
