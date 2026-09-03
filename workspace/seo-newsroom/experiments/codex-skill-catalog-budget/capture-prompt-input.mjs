#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const experimentDirectory = fileURLToPath(new URL(".", import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(experimentDirectory, "manifest.json"), "utf8"));
const fixtureRoot = resolve(process.argv[2] ?? "");
const resultsDirectory = resolve(experimentDirectory, "results");
const rawDirectory = resolve(resultsDirectory, "raw");
const fixtureManifestDirectory = resolve(resultsDirectory, "fixture-manifests");
const codex = "/Users/tushaarmehtaa/.local/bin/codex";

if (!process.argv[2] || !fixtureRoot.startsWith("/private/tmp/slashskills-catalog-")) {
  throw new Error("Pass the generated /private/tmp/slashskills-catalog-* directory.");
}
mkdirSync(rawDirectory, { recursive: true });
mkdirSync(fixtureManifestDirectory, { recursive: true });

function extractSkillsText(promptItems) {
  for (const item of promptItems) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "input_text" && content.text.includes("<skills_instructions>")) {
        const start = content.text.indexOf("<skills_instructions>");
        const end = content.text.indexOf("</skills_instructions>", start);
        return content.text.slice(start, end + "</skills_instructions>".length);
      }
    }
  }
  throw new Error("Codex prompt did not contain skills instructions.");
}

function parseVisibleSkills(skillsText) {
  const lines = skillsText.split("\n");
  const availableIndex = lines.indexOf("### Available skills");
  const availableLines = lines.slice(availableIndex + 1);
  const allSkillLines = availableLines.filter((line) => line.startsWith("- ") && line.includes("(file: "));
  const allDescriptions = allSkillLines.map((line) => {
    const fileIndex = line.lastIndexOf(" (file: ");
    const separatorIndex = line.indexOf(": ");
    return separatorIndex === -1 ? "" : line.slice(separatorIndex + 2, fileIndex);
  });
  const probes = [];
  for (const line of allSkillLines) {
    const match = line.match(/^- ((?:slashskills|catalog)-probe-[a-z0-9-]+): (.*) \(file: (.+)\)$/);
    if (match) probes.push({ name: match[1], description: match[2], rendered_path: match[3], raw_line: line });
  }
  const notices = availableLines.filter(
    (line) => !line.startsWith("- ") && /truncat|omit|budget|not shown|more skills/i.test(line),
  );
  return { allSkillLines, allDescriptions, probes, notices };
}

const summaries = [];
for (const size of [0, ...manifest.sizes]) {
  const label = String(size).padStart(3, "0");
  const repository = resolve(fixtureRoot, `repo-${label}`);
  const stdout = execFileSync(
    codex,
    ["-c", `model=${JSON.stringify(manifest.model)}`, "debug", "prompt-input", "Return READY."],
    { cwd: repository, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
  const promptItems = JSON.parse(stdout);
  const skillsText = extractSkillsText(promptItems);
  const sanitizedSkillsText = skillsText
    .replaceAll("/Users/tushaarmehtaa", "$HOME")
    .replaceAll(fixtureRoot, "$FIXTURE_ROOT");
  writeFileSync(resolve(rawDirectory, `${label}-skills-instructions.txt`), sanitizedSkillsText + "\n");

  const { allSkillLines, allDescriptions, probes, notices } = parseVisibleSkills(skillsText);
  const fixtureManifestText = readFileSync(resolve(repository, "fixture-manifest.json"), "utf8");
  const fixtureManifest = JSON.parse(fixtureManifestText);
  const sanitizedFixtureManifest = {
    ...fixtureManifest,
    files: fixtureManifest.files.map((entry) => ({
      ...entry,
      path: entry.path.replace(fixtureRoot, "$FIXTURE_ROOT"),
    })),
  };
  writeFileSync(
    resolve(fixtureManifestDirectory, `${label}.json`),
    JSON.stringify(sanitizedFixtureManifest, null, 2) + "\n",
  );
  const expected = size === 0 ? [] : fixtureManifest.files;
  const expectedByName = new Map(expected.map((entry) => [entry.name, entry]));
  const visibleByName = new Map(probes.map((entry) => [entry.name, entry]));
  const comparisons = probes.map((entry) => {
    const original = expectedByName.get(entry.name)?.description ?? "";
    const withoutEllipsis = entry.description.endsWith("…") ? entry.description.slice(0, -1) : entry.description;
    const state = entry.description === original
      ? "exact"
      : original.startsWith(withoutEllipsis)
        ? "shortened"
        : "altered";
    return {
      name: entry.name,
      profile: expectedByName.get(entry.name)?.profile ?? "real",
      state,
      original_length: original.length,
      visible_length: entry.description.length,
      marker_visible: entry.description.includes(expectedByName.get(entry.name)?.marker ?? ""),
    };
  });
  const omitted = expected.filter((entry) => !visibleByName.has(entry.name)).map((entry) => entry.name);
  summaries.push({
    size,
    repository: repository.replace(fixtureRoot, "$FIXTURE_ROOT"),
    fixture_manifest_sha256: createHash("sha256").update(fixtureManifestText).digest("hex"),
    skill_instructions_characters: skillsText.length,
    total_visible_skills: allSkillLines.length,
    total_visible_description_characters: allDescriptions.reduce((sum, description) => sum + description.length, 0),
    shortest_visible_description: Math.min(...allDescriptions.map((description) => description.length)),
    longest_visible_description: Math.max(...allDescriptions.map((description) => description.length)),
    expected_probes: expected.length,
    visible_probes: probes.length,
    omitted_probes: omitted,
    exact_descriptions: comparisons.filter((entry) => entry.state === "exact").length,
    shortened_descriptions: comparisons.filter((entry) => entry.state === "shortened").length,
    altered_descriptions: comparisons.filter((entry) => entry.state === "altered").length,
    original_probe_description_characters: expected.reduce((sum, entry) => sum + entry.description.length, 0),
    visible_probe_description_characters: probes.reduce((sum, entry) => sum + entry.description.length, 0),
    markers_visible: comparisons.filter((entry) => entry.marker_visible).length,
    notices,
    comparisons,
  });
}

writeFileSync(resolve(resultsDirectory, "catalog-summary.json"), JSON.stringify({
  experiment_id: manifest.experiment_id,
  captured_at: new Date().toISOString(),
  codex_version: execFileSync(codex, ["--version"], { encoding: "utf8" }).trim(),
  model: manifest.model,
  summaries,
}, null, 2) + "\n");

const markdown = [
  "# Codex prompt-input catalog measurements",
  "",
  `- Codex: ${execFileSync(codex, ["--version"], { encoding: "utf8" }).trim()}`,
  `- Model: ${manifest.model}`,
  `- Fixture sizes: ${manifest.sizes.join(", ")}`,
  "",
  "| Project probes | Total visible skills | Skill-section chars | Visible probes | Exact descriptions | Shortened | Omitted | Visible markers |",
  "| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...summaries.map((item) => `| ${item.size} | ${item.total_visible_skills} | ${item.skill_instructions_characters} | ${item.visible_probes} | ${item.exact_descriptions} | ${item.shortened_descriptions} | ${item.omitted_probes.length} | ${item.markers_visible} |`),
  "",
  "Notices are preserved verbatim in `catalog-summary.json`; model-visible skill sections are under `results/raw/`.",
  "",
];
writeFileSync(resolve(resultsDirectory, "catalog-summary.md"), markdown.join("\n"));
console.log(JSON.stringify(summaries.map(({ size, skill_instructions_characters, total_visible_skills, visible_probes, exact_descriptions, shortened_descriptions, omitted_probes, markers_visible, notices }) => ({
  size,
  skill_instructions_characters,
  total_visible_skills,
  visible_probes,
  exact_descriptions,
  shortened_descriptions,
  omitted: omitted_probes.length,
  markers_visible,
  notices,
}))));
