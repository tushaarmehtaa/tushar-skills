import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { CATALOG_SLUGS } from "../lib/catalog.ts";
import { packageFileAnchor, renderMarkdown } from "../lib/markdown.ts";

const REPO_ROOT = path.join(process.cwd(), "..");

function markdownFiles(root: string): string[] {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) return markdownFiles(absolute);
    return entry.isFile() && entry.name.endsWith(".md") ? [absolute] : [];
  });
}

test("every bundled Markdown link resolves to rendered package content", () => {
  for (const slug of CATALOG_SLUGS) {
    const skillRoot = path.join(REPO_ROOT, slug);
    const files = markdownFiles(skillRoot).map((absolutePath) => {
      const filePath = path.relative(skillRoot, absolutePath).split(path.sep).join("/");
      return { path: filePath, content: matter(fs.readFileSync(absolutePath, "utf8")).content };
    });
    const availableFiles = new Set(files.map((file) => file.path));
    const options = { availableFiles, skillSlug: slug };
    const rendered = files.map(
      (file) => `<section id="${packageFileAnchor(file.path)}">${renderMarkdown(file.content, { ...options, sourcePath: file.path })}</section>`,
    ).join("\n");

    const rawIds = [...rendered.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    const ids = new Set(rawIds);
    assert.equal(rawIds.length, ids.size, `${slug}: rendered package contains duplicate IDs`);
    const anchors = [...rendered.matchAll(/\shref="#([^"]+)"/g)].map((match) => match[1]);
    for (const anchor of anchors) {
      assert.ok(ids.has(anchor), `${slug}: missing rendered anchor #${anchor}`);
    }
    assert.doesNotMatch(rendered, /href="(?:\.\.\/|\.\/|references\/)[^"]+\.md(?:#|\")/i, `${slug}: raw relative Markdown link remains`);
  }
});
