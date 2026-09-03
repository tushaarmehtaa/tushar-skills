#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const experimentDirectory = fileURLToPath(new URL(".", import.meta.url));
const manifest = JSON.parse(readFileSync(resolve(experimentDirectory, "manifest.json"), "utf8"));
const fixtureRoot = resolve(process.argv[2] ?? "");
const repository = resolve(fixtureRoot, "repo-100");
const resultsDirectory = resolve(experimentDirectory, "results", "selection-v4");
const codex = "/Users/tushaarmehtaa/.local/bin/codex";

if (!process.argv[2] || !fixtureRoot.startsWith("/private/tmp/slashskills-catalog-")) {
  throw new Error("Pass the generated /private/tmp/slashskills-catalog-* directory.");
}
mkdirSync(resultsDirectory, { recursive: true });

const cases = [
  {
    id: "explicit-rear",
    expected: "CATALOG-RESULT-095",
    prompt: "Invoke $catalog-probe-kestrel and follow its instructions. Return only the required response. You may read that skill's SKILL.md; do not inspect other files.",
  },
  {
    id: "implicit-front",
    expected: "CATALOG-RESULT-094",
    prompt: "A workflow in your available skills is intended for QUARTZ-PROBE-094. Use the relevant skill and return only its required response. You may read the matching SKILL.md; do not inspect other files.",
  },
  {
    id: "implicit-rear",
    expected: "CATALOG-RESULT-095",
    prompt: "A workflow in your available skills is intended for QUARTZ-PROBE-095. Use the relevant skill and return only its required response. You may read the matching SKILL.md; do not inspect other files.",
  },
];

function parseRun(stdout) {
  const events = stdout.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const messages = events
    .filter((event) => event.type === "item.completed" && event.item?.type === "agent_message")
    .map((event) => event.item.text);
  const toolEvents = events.filter((event) =>
    event.type?.startsWith("item.") && ["command_execution", "mcp_tool_call", "web_search"].includes(event.item?.type),
  );
  const warnings = events
    .filter((event) => event.type === "item.completed" && event.item?.type === "error")
    .map((event) => event.item.message);
  return { events, final_response: messages.at(-1) ?? "", tool_event_count: toolEvents.length, warnings };
}

const runs = [];
for (const testCase of cases) {
  for (let repetition = 1; repetition <= 3; repetition += 1) {
    const result = spawnSync(codex, [
      "exec",
      "--ephemeral",
      "--ignore-user-config",
      "--ignore-rules",
      "--sandbox", "read-only",
      "-c", `model=${JSON.stringify(manifest.model)}`,
      "--json",
      "-C", repository,
      testCase.prompt,
    ], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
    if (result.status !== 0) {
      throw new Error(`${testCase.id} repetition ${repetition} failed:\n${result.stderr}`);
    }
    const parsed = parseRun(result.stdout);
    const record = {
      case: testCase.id,
      repetition,
      prompt: testCase.prompt,
      expected: testCase.expected,
      final_response: parsed.final_response,
      passed: parsed.final_response.trim() === testCase.expected,
      tool_event_count: parsed.tool_event_count,
      warnings: parsed.warnings,
    };
    runs.push(record);
    writeFileSync(
      resolve(resultsDirectory, `${testCase.id}-${repetition}.jsonl`),
      result.stdout
        .replaceAll("/Users/tushaarmehtaa", "$HOME")
        .replaceAll(fixtureRoot, "$FIXTURE_ROOT"),
    );
  }
}

const summary = {
  experiment_id: manifest.experiment_id,
  protocol_version: manifest.protocol_version,
  captured_at: new Date().toISOString(),
  codex_version: spawnSync(codex, ["--version"], { encoding: "utf8" }).stdout.trim(),
  model: manifest.model,
  fixture_size: 100,
  runs,
  cases: cases.map((testCase) => {
    const matching = runs.filter((run) => run.case === testCase.id);
    return {
      case: testCase.id,
      expected: testCase.expected,
      passes: matching.filter((run) => run.passed).length,
      repetitions: matching.length,
      tool_events: matching.reduce((sum, run) => sum + run.tool_event_count, 0),
    };
  }),
};
writeFileSync(resolve(resultsDirectory, "selection-summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify(summary.cases));
