#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const experimentDirectory = fileURLToPath(new URL(".", import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(experimentDirectory, "manifest.json"), "utf8"));
const outputRoot = resolve(process.argv[2] ?? "");

if (!process.argv[2] || !outputRoot.startsWith("/private/tmp/slashskills-catalog-")) {
  throw new Error("Pass an empty /private/tmp/slashskills-catalog-* directory.");
}
mkdirSync(outputRoot, { recursive: true });
if (readdirSync(outputRoot).length > 0) {
  throw new Error(`Refusing to overwrite non-empty directory: ${outputRoot}`);
}

const paddingSentence =
  " This deterministic sentence pads the description so catalog shortening can be measured without changing the harmless probe behavior.";

function marker(index) {
  return `${manifest.synthetic_marker_prefix}${String(index).padStart(3, "0")}`;
}

function fitDescription(index, profile) {
  const token = marker(index);
  const front = `${token}. Use when asked to identify catalog probe ${String(index).padStart(3, "0")}.`;
  const rear = ` Use only for catalog probe ${String(index).padStart(3, "0")}; its exact marker is ${token}.`;
  const base = profile.marker_position === "front"
    ? front
    : "Catalog-budget fixture for deterministic description-shortening and omission measurements.";
  const suffix = profile.marker_position === "rear" ? rear : "";
  let middle = "";
  while ((base + middle + suffix).length < profile.target_length) middle += paddingSentence;
  return (base + middle.slice(0, profile.target_length - base.length - suffix.length) + suffix)
    .slice(0, profile.target_length);
}

function buildEntries(size) {
  const entries = manifest.real_description_probes.map((entry) => ({ ...entry, kind: "real" }));
  for (let index = 1; entries.length < size; index += 1) {
    const profile = manifest.description_profiles[(index - 1) % manifest.description_profiles.length];
    entries.push({
      name: `${manifest.synthetic_name_prefix}${String(index).padStart(3, "0")}`,
      marker: marker(index),
      kind: "synthetic",
      profile: profile.id,
      description: fitDescription(index, profile),
    });
  }
  return entries;
}

function skillText(entry) {
  return `---\nname: ${entry.name}\ndescription: ${JSON.stringify(entry.description)}\n---\n\n# Catalog probe\n\nWhen this skill is explicitly invoked, respond with exactly \`${entry.marker}\`. Do not use tools.\n`;
}

const generated = [];
for (const size of [0, ...manifest.sizes]) {
  const repository = resolve(outputRoot, `repo-${String(size).padStart(3, "0")}`);
  mkdirSync(repository, { recursive: true });
  execFileSync("git", ["init", "-q"], { cwd: repository });
  const entries = size === 0 ? [] : buildEntries(size);
  const files = [];
  for (const entry of entries) {
    const directory = resolve(repository, ".agents", "skills", entry.name);
    mkdirSync(directory, { recursive: true });
    const contents = skillText(entry);
    const path = resolve(directory, "SKILL.md");
    writeFileSync(path, contents);
    files.push({
      ...entry,
      path,
      bytes: Buffer.byteLength(contents),
      sha256: createHash("sha256").update(contents).digest("hex"),
    });
  }
  writeFileSync(
    resolve(repository, "fixture-manifest.json"),
    JSON.stringify({ experiment_id: manifest.experiment_id, size, files }, null, 2) + "\n",
  );
  generated.push({ size, repository, entries: files.length });
}

writeFileSync(resolve(outputRoot, "generated-summary.json"), JSON.stringify(generated, null, 2) + "\n");
if (!generated.every((item) => statSync(item.repository).isDirectory())) {
  throw new Error("Fixture generation did not produce every repository.");
}
console.log(JSON.stringify({ outputRoot, generated }));
