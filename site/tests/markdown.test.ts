import assert from "node:assert/strict";
import test from "node:test";
import { githubFileUrl, packageFileAnchor, renderMarkdown } from "../lib/markdown.ts";

test("renders normal Markdown while stripping raw HTML", () => {
  const html = renderMarkdown("# Heading\n\n[Guide](references/guide.md)\n\n`code`\n\n<script>alert(1)</script>");

  assert.match(html, new RegExp(`<h1 id="${packageFileAnchor("SKILL.md")}-heading">Heading</h1>`));
  assert.match(html, /href="references\/guide\.md"/);
  assert.match(html, /<code>code<\/code>/);
  assert.doesNotMatch(html, /script|alert\(1\)/i);
});

test("rewrites package Markdown links to rendered reference anchors", () => {
  const availableFiles = new Set(["SKILL.md", "references/guide.md"]);
  const html = renderMarkdown("# Start\n\n[Guide](references/guide.md#Details)", {
    sourcePath: "SKILL.md",
    availableFiles,
    skillSlug: "search-ready",
  });

  assert.match(html, new RegExp(`id="${packageFileAnchor("SKILL.md")}-start"`));
  assert.match(html, new RegExp(`href="#${packageFileAnchor("references/guide.md")}-details"`));
});

test("resolves sibling reference links from the source file", () => {
  const availableFiles = new Set(["SKILL.md", "references/one.md", "references/two.md"]);
  const html = renderMarkdown("[Next](two.md)", {
    sourcePath: "references/one.md",
    availableFiles,
    skillSlug: "search-ready",
  });

  assert.match(html, new RegExp(`href="#${packageFileAnchor("references/two.md")}"`));
});

test("uses unique stable IDs for duplicate and punctuation-only headings", () => {
  const html = renderMarkdown("## Repeat\n\n## Repeat\n\n## A & B\n\n## !!!\n\n[first](#Repeat) [second](#repeat-1) [entity](#A-%26-B) [empty](#!!!)");
  const prefix = packageFileAnchor("SKILL.md");

  assert.match(html, new RegExp(`id="${prefix}-repeat"`));
  assert.match(html, new RegExp(`id="${prefix}-repeat-1"`));
  assert.match(html, new RegExp(`href="#${prefix}-a-b"`));
  assert.match(html, new RegExp(`id="${prefix}-section"`));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
});

test("file anchors cannot collide and source paths preserve URL semantics", () => {
  assert.notEqual(packageFileAnchor("references/a+b.md"), packageFileAnchor("references/a-b.md"));
  assert.notEqual(packageFileAnchor("A.md"), packageFileAnchor("a.md"));
  assert.equal(
    githubFileUrl("search-ready", "references/name #1.md"),
    "https://github.com/tushaarmehtaa/tushar-skills/blob/main/search-ready/references/name%20%231.md",
  );

  const html = renderMarkdown("[asset](assets/report.pdf?plain=1#L3)", { skillSlug: "search-ready" });
  assert.match(html, /assets\/report\.pdf\?plain=1#L3/);
});

test("strips unsafe Markdown links and images without dropping their text", () => {
  const html = renderMarkdown("[Do not run](javascript:alert(1)) ![Unsafe image](javascript:alert(1)) [remote](//evil.example/x) [traversal](%2e%2e/secret.md)", { skillSlug: "search-ready" });

  assert.match(html, /Do not run/);
  assert.match(html, /Unsafe image/);
  assert.doesNotMatch(html, /javascript:/i);
  assert.doesNotMatch(html, /<a\b/i);
  assert.doesNotMatch(html, /<img\b/i);
  assert.doesNotMatch(html, /evil\.example|secret\.md/i);
});
