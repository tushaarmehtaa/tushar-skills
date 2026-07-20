import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { extractMarkdownLinks } from "./markdown-links.mjs";
import { REPO_ROOT, parseSkillFile, readCatalog } from "./repository.mjs";

function withTemporarySkill(source, assertion) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "slashskills-validator-"));
  const skillPath = path.join(directory, "SKILL.md");
  try {
    fs.writeFileSync(skillPath, source);
    assertion(parseSkillFile(skillPath));
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("frontmatter parsing matches production YAML semantics", () => {
  withTemporarySkill(
    `---
name: fixture
description: >-
  Build a fixture safely. Use when testing folded YAML.
license: "MIT" # a valid trailing YAML comment
---
Body
`,
    (parsed) => {
      assert.deepEqual(parsed.errors, []);
      assert.equal(
        parsed.data.description,
        "Build a fixture safely. Use when testing folded YAML.",
      );
      assert.equal(parsed.data.license, "MIT");
    },
  );

  withTemporarySkill(
    `---
name: fixture
description: Does this: Use when needed.
license: MIT
---
`,
    (parsed) => assert.match(parsed.errors[0], /invalid YAML frontmatter/),
  );
});

test("non-file SKILL.md paths become validation errors", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "slashskills-validator-"));
  const skillPath = path.join(directory, "SKILL.md");
  try {
    fs.mkdirSync(skillPath);
    const parsed = parseSkillFile(skillPath);
    assert.match(parsed.errors[0], /not a regular file/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("link extraction covers Markdown references and HTML but ignores code", () => {
  const source = `Direct [guide](references/direct.md).
[Reference guide][guide-ref]
[guide-ref]: references/reference.md
<a href="references/html.md">HTML guide</a>
<img src='assets/example.png' alt="Example">
\`[inline example](references/not-real.md)\`
\`\`\`markdown
[fenced example](references/also-not-real.md)
\`\`\`
`;
  const links = extractMarkdownLinks(source);
  const reachableTargets = links
    .filter((link) => link.reachable)
    .map((link) => link.target)
    .sort();

  assert.deepEqual(reachableTargets, [
    "assets/example.png",
    "references/direct.md",
    "references/html.md",
    "references/reference.md",
  ]);
  assert.equal(
    links.some((link) => link.target.includes("not-real")),
    false,
  );
});

test("runtime verification records match catalog tested support", () => {
  const registryPath = path.join(REPO_ROOT, "runtime-verification.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  const catalog = readCatalog();

  assert.ok(Array.isArray(registry.verifications));
  for (const verification of registry.verifications) {
    assert.equal(catalog[verification.skill].support[verification.runtime], "tested");
    assert.equal(verification.result, "passed");
  }
});
