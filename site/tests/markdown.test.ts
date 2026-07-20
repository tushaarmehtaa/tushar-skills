import assert from "node:assert/strict";
import test from "node:test";
import { renderMarkdown } from "../lib/markdown.ts";

test("renders normal Markdown while stripping raw HTML", () => {
  const html = renderMarkdown("# Heading\n\n[Guide](references/guide.md)\n\n`code`\n\n<script>alert(1)</script>");

  assert.match(html, /<h1>Heading<\/h1>/);
  assert.match(html, /href="references\/guide\.md"/);
  assert.match(html, /<code>code<\/code>/);
  assert.doesNotMatch(html, /script|alert\(1\)/i);
});

test("strips unsafe Markdown links and images without dropping their text", () => {
  const html = renderMarkdown("[Do not run](javascript:alert(1)) ![Unsafe image](javascript:alert(1))");

  assert.match(html, /Do not run/);
  assert.match(html, /Unsafe image/);
  assert.doesNotMatch(html, /javascript:/i);
  assert.doesNotMatch(html, /<a\b/i);
  assert.doesNotMatch(html, /<img\b/i);
});
