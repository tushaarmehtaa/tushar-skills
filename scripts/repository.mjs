import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const rootRequire = createRequire(import.meta.url);
const siteRequire = createRequire(path.join(REPO_ROOT, "site", "package.json"));

function loadGrayMatter() {
  try {
    return rootRequire("gray-matter");
  } catch (rootError) {
    try {
      return siteRequire("gray-matter");
    } catch {
      throw rootError;
    }
  }
}

const matter = loadGrayMatter();
export const CATALOG_PATH = path.join(REPO_ROOT, "site", "lib", "catalog.ts");
export const README_PATH = path.join(REPO_ROOT, "README.md");
export const README_CATALOG_START = "<!-- BEGIN GENERATED SKILL CATALOG -->";
export const README_CATALOG_END = "<!-- END GENERATED SKILL CATALOG -->";

export function getSkillDirectories() {
  return fs
    .readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(REPO_ROOT, entry.name, "SKILL.md")),
    )
    .map((entry) => entry.name)
    .sort();
}

export function parseSkillFile(filePath) {
  const displayPath = path.relative(REPO_ROOT, filePath);
  let raw;
  try {
    if (!fs.statSync(filePath).isFile()) {
      throw new Error("path is not a regular file");
    }
    raw = fs.readFileSync(filePath, "utf8").replaceAll("\r\n", "\n");
  } catch (error) {
    return {
      data: {},
      types: {},
      body: "",
      raw: "",
      errors: [`${displayPath}: cannot read SKILL.md (${error.message})`],
    };
  }
  const lines = raw.split("\n");
  const errors = [];

  if (lines[0] !== "---") {
    return {
      data: {},
      types: {},
      body: raw,
      raw,
      errors: [`${displayPath}:1: SKILL.md must start with YAML frontmatter`],
    };
  }

  const closingIndex = lines.indexOf("---", 1);
  if (closingIndex === -1) {
    return {
      data: {},
      types: {},
      body: "",
      raw,
      errors: [`${displayPath}: missing closing YAML frontmatter delimiter`],
    };
  }

  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    const line = error?.mark?.line === undefined ? "" : `:${error.mark.line + 1}`;
    return {
      data: {},
      types: {},
      body: "",
      raw,
      errors: [`${displayPath}${line}: invalid YAML frontmatter (${error.message})`],
    };
  }

  const data = parsed.data;
  const types = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      Array.isArray(value) ? "array" : value === null ? "null" : typeof value,
    ]),
  );
  if (
    data.metadata &&
    typeof data.metadata === "object" &&
    !Array.isArray(data.metadata)
  ) {
    for (const [key, value] of Object.entries(data.metadata)) {
      types[`metadata.${key}`] = Array.isArray(value)
        ? "array"
        : value === null
          ? "null"
          : typeof value;
    }
  }

  return {
    data,
    types,
    body: parsed.content,
    raw,
    errors,
  };
}

class LiteralParser {
  constructor(source, startIndex, filePath) {
    this.source = source;
    this.index = startIndex;
    this.filePath = filePath;
  }

  fail(message) {
    const prefix = this.source.slice(0, this.index);
    const line = prefix.split("\n").length;
    throw new Error(`${this.filePath}:${line}: ${message}`);
  }

  skipTrivia() {
    while (this.index < this.source.length) {
      if (/\s/.test(this.source[this.index])) {
        this.index += 1;
        continue;
      }
      if (this.source.startsWith("//", this.index)) {
        const newline = this.source.indexOf("\n", this.index + 2);
        this.index = newline === -1 ? this.source.length : newline + 1;
        continue;
      }
      if (this.source.startsWith("/*", this.index)) {
        const end = this.source.indexOf("*/", this.index + 2);
        if (end === -1) this.fail("unterminated block comment");
        this.index = end + 2;
        continue;
      }
      break;
    }
  }

  parseString() {
    const quote = this.source[this.index];
    this.index += 1;
    let result = "";

    while (this.index < this.source.length) {
      const character = this.source[this.index];
      this.index += 1;
      if (character === quote) return result;
      if (character !== "\\") {
        result += character;
        continue;
      }

      if (this.index >= this.source.length) this.fail("unterminated string escape");
      const escaped = this.source[this.index];
      this.index += 1;
      const escapes = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v" };
      if (escaped === "u") {
        const hex = this.source.slice(this.index, this.index + 4);
        if (!/^[0-9a-f]{4}$/i.test(hex)) this.fail("invalid unicode escape");
        result += String.fromCharCode(Number.parseInt(hex, 16));
        this.index += 4;
      } else {
        result += escapes[escaped] ?? escaped;
      }
    }

    this.fail("unterminated string");
  }

  parseIdentifier() {
    const match = this.source.slice(this.index).match(/^[A-Za-z_$][\w$]*/);
    if (!match) this.fail("expected property name");
    this.index += match[0].length;
    return match[0];
  }

  parseObject() {
    if (this.source[this.index] !== "{") this.fail("expected object literal");
    this.index += 1;
    const result = {};

    while (true) {
      this.skipTrivia();
      if (this.source[this.index] === "}") {
        this.index += 1;
        return result;
      }

      const character = this.source[this.index];
      const key = character === '"' || character === "'"
        ? this.parseString()
        : this.parseIdentifier();
      this.skipTrivia();
      if (this.source[this.index] !== ":") this.fail(`expected : after ${key}`);
      this.index += 1;
      if (Object.hasOwn(result, key)) this.fail(`duplicate property ${key}`);
      result[key] = this.parseValue();
      this.skipTrivia();
      if (this.source[this.index] === ",") {
        this.index += 1;
        continue;
      }
      if (this.source[this.index] !== "}") this.fail("expected , or }");
    }
  }

  parseArray() {
    this.index += 1;
    const result = [];
    while (true) {
      this.skipTrivia();
      if (this.source[this.index] === "]") {
        this.index += 1;
        return result;
      }
      result.push(this.parseValue());
      this.skipTrivia();
      if (this.source[this.index] === ",") {
        this.index += 1;
        continue;
      }
      if (this.source[this.index] !== "]") this.fail("expected , or ]");
    }
  }

  parseValue() {
    this.skipTrivia();
    const character = this.source[this.index];
    if (character === "{") return this.parseObject();
    if (character === "[") return this.parseArray();
    if (character === '"' || character === "'") return this.parseString();

    const numberMatch = this.source.slice(this.index).match(/^-?(?:\d+\.?\d*|\.\d+)/);
    if (numberMatch) {
      this.index += numberMatch[0].length;
      return Number(numberMatch[0]);
    }

    const identifier = this.parseIdentifier();
    if (identifier === "true") return true;
    if (identifier === "false") return false;
    if (identifier === "null") return null;
    this.fail(
      `catalog values must be data-only literals; found identifier ${identifier}`,
    );
  }
}

export function readCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(
      `${path.relative(REPO_ROOT, CATALOG_PATH)}: canonical catalog is missing`,
    );
  }

  const source = fs.readFileSync(CATALOG_PATH, "utf8");
  const declaration = source.match(/export\s+const\s+CATALOG\s*=/);
  if (!declaration) {
    throw new Error("site/lib/catalog.ts: expected `export const CATALOG = ...`");
  }
  const objectStart = source.indexOf("{", declaration.index + declaration[0].length);
  if (objectStart === -1) {
    throw new Error("site/lib/catalog.ts: CATALOG must be an object literal");
  }

  return new LiteralParser(source, objectStart, "site/lib/catalog.ts").parseObject();
}

function escapeTableCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

export function renderReadmeCatalog(catalog, parsedSkills) {
  const rows = [
    "| Skill | Category | What it does and when to use it |",
    "| --- | --- | --- |",
  ];

  for (const slug of Object.keys(catalog).sort()) {
    const description = parsedSkills.get(slug)?.data.description ?? "";
    rows.push(
      `| [\`${slug}\`](./${slug}/SKILL.md) | ${escapeTableCell(catalog[slug].category)} | ${escapeTableCell(description)} |`,
    );
  }

  return rows.join("\n");
}

export function expectedReadmeCatalogBlock(catalog, parsedSkills) {
  return `${README_CATALOG_START}\n${renderReadmeCatalog(catalog, parsedSkills)}\n${README_CATALOG_END}`;
}

export function replaceReadmeCatalog(readme, catalog, parsedSkills) {
  const expected = expectedReadmeCatalogBlock(catalog, parsedSkills);
  const startCount = readme.split(README_CATALOG_START).length - 1;
  const endCount = readme.split(README_CATALOG_END).length - 1;
  const start = readme.indexOf(README_CATALOG_START);
  const end = readme.indexOf(README_CATALOG_END);
  if (startCount !== 1 || endCount !== 1 || start === -1 || end === -1 || end < start) {
    throw new Error(
      "README.md: expected exactly one generated catalog block with ordered markers",
    );
  }
  return `${readme.slice(0, start)}${expected}${readme.slice(end + README_CATALOG_END.length)}`;
}

export function loadParsedSkills(skillDirectories = getSkillDirectories()) {
  return new Map(
    skillDirectories.map((slug) => [
      slug,
      parseSkillFile(path.join(REPO_ROOT, slug, "SKILL.md")),
    ]),
  );
}

export function listRegularFiles(directory) {
  const files = [];
  const visit = (current) => {
    for (const entry of fs
      .readdirSync(current, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(absolutePath);
      else if (entry.isFile()) files.push(absolutePath);
    }
  };
  visit(directory);
  return files;
}

export function logicalLineCount(text) {
  if (!text) return 0;
  const normalized = text.replaceAll("\r\n", "\n");
  const lines = normalized.split("\n");
  return normalized.endsWith("\n") ? lines.length - 1 : lines.length;
}
