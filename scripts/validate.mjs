#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { extractMarkdownLinks } from "./markdown-links.mjs";
import {
  README_CATALOG_END,
  README_CATALOG_START,
  README_PATH,
  REPO_ROOT,
  expectedReadmeCatalogBlock,
  getSkillDirectories,
  listRegularFiles,
  loadParsedSkills,
  logicalLineCount,
  readCatalog,
} from "./repository.mjs";

const EXPECTED_SKILL_COUNT = 34;
const ALLOWED_FRONTMATTER = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);
const REQUIRED_FRONTMATTER = ["name", "description", "license"];
const AGENT_IDS = ["claude-code", "codex", "cursor"];
const SUPPORT_STATUSES = new Set(["tested", "untested", "unsupported"]);
const SURFACES = new Set(["coding-agent", "claude-app", "chatgpt"]);
const CAPABILITIES = new Set([
  "filesystem",
  "shell",
  "browser",
  "network",
  "user-files",
]);
const CATALOG_FIELDS = [
  "author",
  "capabilities",
  "category",
  "support",
  "surfaces",
  "tags",
];
const RUNTIME_VERIFICATION_PATH = path.join(REPO_ROOT, "runtime-verification.json");
const SKILL_EVALS_PATH = path.join(REPO_ROOT, "skill-evals.json");
const CLAUDE_APP_SKILLS = new Set([
  "ai-cost-audit",
  "cold-outreach",
  "decision-doc",
  "fundraising",
  "humanize",
  "landing-copy",
  "product-spec",
  "product-teardown",
  "skill-creator",
  "ui-copy",
  "user-insights",
]);

const errors = [];
const addError = (message) => errors.push(message);
const sorted = (values) => [...values].sort();
const sameValues = (left, right) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

function validateRootLicense() {
  const licensePath = path.join(REPO_ROOT, "LICENSE");
  if (!fs.existsSync(licensePath)) {
    addError("LICENSE: root MIT license is missing");
    return;
  }

  const license = fs.readFileSync(licensePath, "utf8");
  for (const requiredText of [
    "MIT License",
    "Permission is hereby granted, free of charge",
    'THE SOFTWARE IS PROVIDED "AS IS"',
  ]) {
    if (!license.includes(requiredText)) {
      addError(`LICENSE: expected MIT license text containing ${JSON.stringify(requiredText)}`);
    }
  }
}

function validatePackageLicenses() {
  for (const relativePath of ["package.json", "site/package.json"]) {
    const packagePath = path.join(REPO_ROOT, relativePath);
    if (!fs.existsSync(packagePath)) continue;
    try {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
      if (packageJson.license !== "MIT") {
        addError(`${relativePath}: package license must be MIT`);
      }
    } catch (error) {
      addError(`${relativePath}: invalid JSON (${error.message})`);
    }
  }
}

function validateFrontmatter(slug, parsed) {
  for (const message of parsed.errors) addError(message);
  const { data, types } = parsed;
  const skillPath = `${slug}/SKILL.md`;

  for (const field of Object.keys(data)) {
    if (!ALLOWED_FRONTMATTER.has(field)) {
      addError(`${skillPath}: frontmatter field ${field} is not part of Agent Skills`);
    }
  }
  for (const field of REQUIRED_FRONTMATTER) {
    if (!Object.hasOwn(data, field)) {
      addError(`${skillPath}: missing required frontmatter field ${field}`);
    }
  }

  for (const field of [
    "name",
    "description",
    "license",
    "compatibility",
    "allowed-tools",
  ]) {
    if (Object.hasOwn(data, field) && types[field] !== "string") {
      addError(`${skillPath}: ${field} must be a string`);
    }
  }

  if (data.name !== slug) {
    addError(`${skillPath}: name must match its directory (${slug})`);
  }
  if (
    typeof data.name === "string" &&
    (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name) || data.name.length > 64)
  ) {
    addError(`${skillPath}: name must be a lowercase hyphenated name of at most 64 characters`);
  }

  if (typeof data.description === "string") {
    const descriptionLength = [...data.description].length;
    if (!data.description.trim()) addError(`${skillPath}: description must not be empty`);
    if (descriptionLength > 200) {
      addError(`${skillPath}: description is ${descriptionLength} characters; maximum is 200`);
    }
    if (!/\buse when\b/i.test(data.description)) {
      addError(`${skillPath}: description must state when to use it with an explicit “Use when …” clause`);
    }
    const beforeUseWhen = data.description.split(/\buse when\b/i)[0].trim();
    if (beforeUseWhen.length < 10) {
      addError(`${skillPath}: description must explain what the skill does before “Use when …”`);
    }
  }

  if (data.license !== "MIT") {
    addError(`${skillPath}: license must be MIT`);
  }
  if (
    typeof data.compatibility === "string" &&
    [...data.compatibility].length > 500
  ) {
    addError(`${skillPath}: compatibility is longer than 500 characters`);
  }
  if (
    typeof data.compatibility === "string" &&
    !data.compatibility.trim()
  ) {
    addError(`${skillPath}: compatibility must contain between 1 and 500 characters`);
  }
  if (Object.hasOwn(data, "metadata")) {
    if (types.metadata !== "object" || Array.isArray(data.metadata) || data.metadata === null) {
      addError(`${skillPath}: metadata must be a string-to-string mapping`);
    } else {
      for (const [key, value] of Object.entries(data.metadata)) {
        if (!key || types[`metadata.${key}`] !== "string" || typeof value !== "string") {
          addError(`${skillPath}: metadata.${key || "<empty>"} must be a string`);
        }
      }
    }
  }

  const lineCount = logicalLineCount(parsed.raw);
  if (lineCount > 500) {
    addError(`${skillPath}: main skill is ${lineCount} lines; maximum is 500`);
  }
}

function resolveLocalLink(skillRoot, sourcePath, target) {
  if (
    !target ||
    target.startsWith("/") ||
    /^[a-z][a-z0-9+.-]*:/i.test(target)
  ) {
    return null;
  }

  const [beforeFragment, fragment = ""] = target.split("#", 2);
  const withoutFragment = beforeFragment.split("?", 1)[0];
  let decoded;
  try {
    decoded = decodeURIComponent(withoutFragment);
  } catch {
    return { invalidEncoding: true };
  }

  const absolutePath = decoded ? path.resolve(path.dirname(sourcePath), decoded) : sourcePath;
  const relativeToSkill = path.relative(skillRoot, absolutePath);
  return {
    absolutePath,
    fragment,
    escaped: relativeToSkill === ".." || relativeToSkill.startsWith(`..${path.sep}`),
    relativeToSkill: relativeToSkill.split(path.sep).join("/"),
  };
}

function canonicalHeadingSlug(value) {
  let decoded;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null;
  }
  const slug = decoded
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal) => String.fromCodePoint(Number.parseInt(hexadecimal, 16)))
    .replace(/&(?:amp|#38);/gi, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/[\s-]+/g, "-");
  return slug || "section";
}

function markdownHeadingIds(source) {
  const ids = new Set();
  const counts = new Map();
  let fence = null;
  for (const line of source.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0];
      else if (fence === fenceMatch[1][0]) fence = null;
      continue;
    }
    if (fence) continue;
    const heading = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/);
    if (!heading) continue;
    const base = canonicalHeadingSlug(heading[1]);
    if (!base) continue;
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    ids.add(count === 0 ? base : `${base}-${count}`);
  }
  return ids;
}

function unsafeLinkReason(target) {
  if (/[\u0000-\u001f\u007f\\]/.test(target)) return "contains a control character or backslash";
  if (target.startsWith("//")) return "uses a protocol-relative URL";
  const scheme = target.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && !["http", "https", "mailto"].includes(scheme)) return `uses disallowed ${scheme}: scheme`;
  return null;
}

function validateLinksAndReferences(slug) {
  const skillRoot = path.join(REPO_ROOT, slug);
  const markdownFiles = listRegularFiles(skillRoot).filter((file) => file.endsWith(".md"));
  const graph = new Map();
  const headingIds = new Map(
    markdownFiles.map((markdownPath) => [markdownPath, markdownHeadingIds(fs.readFileSync(markdownPath, "utf8"))]),
  );

  for (const markdownPath of markdownFiles) {
    const relativeSource = path.relative(skillRoot, markdownPath).split(path.sep).join("/");
    const source = fs.readFileSync(markdownPath, "utf8");
    const targets = [];
    for (const link of extractMarkdownLinks(source)) {
      const unsafeReason = unsafeLinkReason(link.target);
      if (unsafeReason) {
        addError(`${slug}/${relativeSource}:${link.line}: unsafe Markdown target ${JSON.stringify(link.target)} ${unsafeReason}`);
        continue;
      }
      const resolved = resolveLocalLink(skillRoot, markdownPath, link.target);
      if (!resolved) continue;
      const displaySource = `${slug}/${relativeSource}:${link.line}`;
      if (resolved.invalidEncoding) {
        addError(`${displaySource}: relative link has invalid percent encoding: ${link.target}`);
        continue;
      }
      if (resolved.escaped) {
        addError(`${displaySource}: relative link escapes the portable skill package: ${link.target}`);
        continue;
      }
      if (!fs.existsSync(resolved.absolutePath)) {
        addError(`${displaySource}: relative link does not exist: ${link.target}`);
        continue;
      }
      const stat = fs.statSync(resolved.absolutePath);
      if (resolved.fragment && stat.isFile() && resolved.absolutePath.endsWith(".md")) {
        const fragmentSlug = canonicalHeadingSlug(resolved.fragment);
        if (!fragmentSlug || !headingIds.get(resolved.absolutePath)?.has(fragmentSlug)) {
          addError(`${displaySource}: Markdown fragment does not match a heading: ${link.target}`);
        }
      }
      if (stat.isFile() && link.reachable) targets.push(resolved.relativeToSkill);
    }
    graph.set(relativeSource, targets);
  }

  const reachable = new Set(["SKILL.md"]);
  const queue = ["SKILL.md"];
  while (queue.length) {
    const current = queue.shift();
    for (const target of graph.get(current) ?? []) {
      if (reachable.has(target)) continue;
      reachable.add(target);
      if (target.endsWith(".md")) queue.push(target);
    }
  }

  const referencesRoot = path.join(skillRoot, "references");
  if (fs.existsSync(referencesRoot)) {
    for (const referencePath of listRegularFiles(referencesRoot)) {
      const relativeReference = path
        .relative(skillRoot, referencePath)
        .split(path.sep)
        .join("/");
      if (!reachable.has(relativeReference)) {
        addError(`${slug}/${relativeReference}: bundled reference is not reachable from SKILL.md`);
      }
    }
  }
}

function validateReferenceQuality(slug) {
  const referencesRoot = path.join(REPO_ROOT, slug, "references");
  if (!fs.existsSync(referencesRoot)) return;

  for (const referencePath of listRegularFiles(referencesRoot).filter((file) => file.endsWith(".md"))) {
    const source = fs.readFileSync(referencePath, "utf8");
    const displayPath = `${slug}/${path.relative(path.join(REPO_ROOT, slug), referencePath).split(path.sep).join("/")}`;
    if (source.startsWith("---\n") || source.startsWith("---\r\n")) {
      addError(`${displayPath}: references must not contain standalone skill frontmatter`);
    }
    if (logicalLineCount(source) > 100 && !/^## Contents\s*$/im.test(source)) {
      addError(`${displayPath}: references longer than 100 lines need a Contents section`);
    }
  }
}

function loadRuntimeVerifications() {
  if (!fs.existsSync(RUNTIME_VERIFICATION_PATH)) {
    addError("runtime-verification.json: file is missing");
    return [];
  }

  try {
    const registry = JSON.parse(fs.readFileSync(RUNTIME_VERIFICATION_PATH, "utf8"));
    if (!registry || typeof registry !== "object" || Array.isArray(registry)) {
      addError("runtime-verification.json: root must be an object");
      return [];
    }
    if (!Array.isArray(registry.verifications)) {
      addError("runtime-verification.json: verifications must be an array");
      return [];
    }
    return registry.verifications;
  } catch (error) {
    addError(`runtime-verification.json: invalid JSON (${error.message})`);
    return [];
  }
}

function validateRuntimeVerifications(catalog, verifications) {
  const seen = new Set();
  const verified = new Set();
  const requiredFields = [
    "skill",
    "runtime",
    "verifiedAt",
    "environment",
    "smokeTest",
    "verifiedBy",
    "result",
  ];

  for (const [index, verification] of verifications.entries()) {
    const location = `runtime-verification.json: verifications[${index}]`;
    if (!verification || typeof verification !== "object" || Array.isArray(verification)) {
      addError(`${location}: entry must be an object`);
      continue;
    }
    for (const field of requiredFields) {
      if (typeof verification[field] !== "string" || !verification[field].trim()) {
        addError(`${location}: ${field} must be a non-empty string`);
      }
    }
    if (!Object.hasOwn(catalog, verification.skill)) {
      addError(`${location}: unknown skill ${verification.skill}`);
      continue;
    }
    if (!AGENT_IDS.includes(verification.runtime)) {
      addError(`${location}: unknown runtime ${verification.runtime}`);
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(verification.verifiedAt)) {
      addError(`${location}: verifiedAt must use YYYY-MM-DD`);
    }
    if (verification.result !== "passed") {
      addError(`${location}: result must be passed`);
    }

    const key = `${verification.skill}:${verification.runtime}`;
    if (seen.has(key)) {
      addError(`${location}: duplicate verification for ${key}`);
      continue;
    }
    seen.add(key);
    verified.add(key);

    const status = catalog[verification.skill].support[verification.runtime];
    if (status === "unsupported") {
      addError(`${location}: unsupported runtimes cannot have a verification record`);
    }
    if (status !== "tested") {
      addError(`${location}: catalog support for ${key} must be tested`);
    }
  }

  for (const [slug, entry] of Object.entries(catalog)) {
    for (const runtime of AGENT_IDS) {
      const key = `${slug}:${runtime}`;
      if (entry.support[runtime] === "tested" && !verified.has(key)) {
        addError(`site/lib/catalog.ts (${slug}): tested support for ${runtime} requires a runtime-verification record`);
      }
    }
  }
}

function validateSkillEvals(skillDirectories) {
  if (!fs.existsSync(SKILL_EVALS_PATH)) {
    addError("skill-evals.json: file is missing");
    return;
  }

  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(SKILL_EVALS_PATH, "utf8"));
  } catch (error) {
    addError(`skill-evals.json: invalid JSON (${error.message})`);
    return;
  }

  if (registry?.version !== 2 || !registry.skills || typeof registry.skills !== "object" || Array.isArray(registry.skills)) {
    addError("skill-evals.json: expected version 2 and a skills object");
    return;
  }

  if (!registry.rubric || typeof registry.rubric !== "object" || Array.isArray(registry.rubric)) {
    addError("skill-evals.json: rubric must define observable criteria for each case type");
  } else {
    for (const field of ["normal", "ambiguous", "risk"]) {
      const criteria = registry.rubric[field];
      if (!Array.isArray(criteria) || criteria.length < 2 || criteria.some((criterion) => typeof criterion !== "string" || criterion.trim().length < 20)) {
        addError(`skill-evals.json: rubric.${field} must contain at least two concrete observable criteria`);
      }
    }
  }

  const evalSlugs = Object.keys(registry.skills).sort();
  if (!sameValues(evalSlugs, skillDirectories)) {
    const missing = skillDirectories.filter((slug) => !evalSlugs.includes(slug));
    const extra = evalSlugs.filter((slug) => !skillDirectories.includes(slug));
    if (missing.length) addError(`skill-evals.json: missing skills: ${missing.join(", ")}`);
    if (extra.length) addError(`skill-evals.json: unknown skills: ${extra.join(", ")}`);
  }

  for (const [slug, cases] of Object.entries(registry.skills)) {
    const location = `skill-evals.json (${slug})`;
    if (!cases || typeof cases !== "object" || Array.isArray(cases)) {
      addError(`${location}: cases must be an object`);
      continue;
    }
    const fields = Object.keys(cases).sort();
    if (!sameValues(fields, ["ambiguous", "normal", "risk"])) {
      addError(`${location}: cases must contain exactly normal, ambiguous, and risk`);
    }
    for (const field of ["normal", "ambiguous", "risk"]) {
      if (typeof cases[field] !== "string" || cases[field].trim().length < 20) {
        addError(`${location}: ${field} must be a concrete prompt of at least 20 characters`);
      }
    }
    const prompts = [cases.normal, cases.ambiguous, cases.risk].filter((value) => typeof value === "string");
    if (new Set(prompts.map((prompt) => prompt.trim().toLowerCase())).size !== prompts.length) {
      addError(`${location}: prompts must be distinct`);
    }
  }
}

function validateCatalog(catalog, skillDirectories) {
  const catalogSlugs = Object.keys(catalog).sort();
  if (skillDirectories.length !== EXPECTED_SKILL_COUNT) {
    addError(
      `repository: expected ${EXPECTED_SKILL_COUNT} skill directories, found ${skillDirectories.length}`,
    );
  }
  if (catalogSlugs.length !== EXPECTED_SKILL_COUNT) {
    addError(`site/lib/catalog.ts: expected ${EXPECTED_SKILL_COUNT} entries, found ${catalogSlugs.length}`);
  }
  if (!sameValues(catalogSlugs, skillDirectories)) {
    const missing = skillDirectories.filter((slug) => !catalogSlugs.includes(slug));
    const extra = catalogSlugs.filter((slug) => !skillDirectories.includes(slug));
    if (missing.length) addError(`site/lib/catalog.ts: missing skills: ${missing.join(", ")}`);
    if (extra.length) addError(`site/lib/catalog.ts: unknown skills: ${extra.join(", ")}`);
  }

  for (const [slug, entry] of Object.entries(catalog)) {
    const location = `site/lib/catalog.ts (${slug})`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      addError(`${location}: entry must be an object`);
      continue;
    }

    const fields = Object.keys(entry).sort();
    if (!sameValues(fields, [...CATALOG_FIELDS].sort())) {
      addError(`${location}: fields must be exactly ${CATALOG_FIELDS.join(", ")}`);
    }
    if (typeof entry.category !== "string" || !entry.category.trim()) {
      addError(`${location}: category must be a non-empty string`);
    }
    if (typeof entry.author !== "string" || !entry.author.trim()) {
      addError(`${location}: author must be a non-empty string`);
    }

    for (const field of ["tags", "surfaces", "capabilities"]) {
      if (!Array.isArray(entry[field]) || entry[field].some((value) => typeof value !== "string")) {
        addError(`${location}: ${field} must be a string array`);
      } else if (new Set(entry[field]).size !== entry[field].length) {
        addError(`${location}: ${field} must not contain duplicates`);
      }
    }
    if (Array.isArray(entry.tags) && entry.tags.length === 0) {
      addError(`${location}: tags must not be empty`);
    }
    if (Array.isArray(entry.surfaces)) {
      if (!entry.surfaces.includes("coding-agent")) {
        addError(`${location}: every v1 skill must include the coding-agent surface`);
      }
      for (const surface of entry.surfaces) {
        if (!SURFACES.has(surface)) addError(`${location}: unknown surface ${surface}`);
      }
    }
    if (Array.isArray(entry.capabilities)) {
      for (const capability of entry.capabilities) {
        if (!CAPABILITIES.has(capability)) addError(`${location}: unknown capability ${capability}`);
      }
    }

    if (!entry.support || typeof entry.support !== "object" || Array.isArray(entry.support)) {
      addError(`${location}: support must be an object`);
    } else {
      const supportAgents = Object.keys(entry.support).sort();
      if (!sameValues(supportAgents, [...AGENT_IDS].sort())) {
        addError(`${location}: support must contain exactly ${AGENT_IDS.join(", ")}`);
      }
      for (const agent of AGENT_IDS) {
        if (!SUPPORT_STATUSES.has(entry.support[agent])) {
          addError(`${location}: invalid ${agent} support status ${entry.support[agent]}`);
        }
      }
    }

    const hasClaudeApp = Array.isArray(entry.surfaces) && entry.surfaces.includes("claude-app");
    if (hasClaudeApp !== CLAUDE_APP_SKILLS.has(slug)) {
      addError(`${location}: claude-app surface does not match the v1 capability whitelist`);
    }
  }

  const actualClaudeAppSkills = sorted(
    Object.entries(catalog)
      .filter(([, entry]) => entry.surfaces?.includes("claude-app"))
      .map(([slug]) => slug),
  );
  if (!sameValues(actualClaudeAppSkills, sorted(CLAUDE_APP_SKILLS))) {
    addError("site/lib/catalog.ts: Claude app whitelist is incomplete or has extra skills");
  }
}

function validateReadme(catalog, parsedSkills) {
  if (!fs.existsSync(README_PATH)) {
    addError("README.md: file is missing");
    return;
  }
  const readme = fs.readFileSync(README_PATH, "utf8");
  const expectedBlock = expectedReadmeCatalogBlock(catalog, parsedSkills);
  const startCount = readme.split(README_CATALOG_START).length - 1;
  const endCount = readme.split(README_CATALOG_END).length - 1;
  if (startCount !== 1 || endCount !== 1) {
    addError(
      `README.md: expected exactly one generated catalog block; found ${startCount} start and ${endCount} end markers`,
    );
    return;
  }
  const blockStart = readme.indexOf(README_CATALOG_START);
  const blockEnd = readme.indexOf(README_CATALOG_END) + README_CATALOG_END.length;
  if (blockEnd < blockStart || readme.slice(blockStart, blockEnd) !== expectedBlock) {
    addError("README.md: generated skill catalog is stale; run `npm run catalog:sync`");
  }
}

function validateZipArchives(skillDirectories) {
  const zipDirectory = path.join(REPO_ROOT, "site", "public", "zips");
  if (!fs.existsSync(zipDirectory)) {
    addError("site/public/zips: generated ZIP directory is missing");
    return;
  }

  const actualArchives = fs
    .readdirSync(zipDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".zip"))
    .map((entry) => entry.name.slice(0, -4))
    .sort();
  if (!sameValues(actualArchives, skillDirectories)) {
    const missing = skillDirectories.filter((slug) => !actualArchives.includes(slug));
    const extra = actualArchives.filter((slug) => !skillDirectories.includes(slug));
    if (missing.length) addError(`site/public/zips: missing archives: ${missing.join(", ")}`);
    if (extra.length) addError(`site/public/zips: extra archives: ${extra.join(", ")}`);
  }

  for (const slug of skillDirectories) {
    const zipPath = path.join(zipDirectory, `${slug}.zip`);
    if (!fs.existsSync(zipPath)) continue;

    const listing = spawnSync("unzip", ["-Z1", zipPath], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });
    if (listing.error?.code === "ENOENT") {
      addError("ZIP validation requires the `unzip` command");
      return;
    }
    if (listing.status !== 0) {
      addError(`site/public/zips/${slug}.zip: unreadable archive (${listing.stderr.trim()})`);
      continue;
    }

    const archiveFiles = listing.stdout
      .split(/\r?\n/)
      .filter((entry) => entry && !entry.endsWith("/"))
      .sort();
    const duplicateArchiveFiles = archiveFiles.filter(
      (entry, index) => index > 0 && archiveFiles[index - 1] === entry,
    );
    if (duplicateArchiveFiles.length) {
      addError(
        `site/public/zips/${slug}.zip: duplicate files: ${[...new Set(duplicateArchiveFiles)].join(", ")}`,
      );
      continue;
    }
    const sourceFiles = listRegularFiles(path.join(REPO_ROOT, slug));
    const sourceByArchivePath = new Map(
      sourceFiles.map((file) => [
        `${slug}/${path.relative(path.join(REPO_ROOT, slug), file).split(path.sep).join("/")}`,
        file,
      ]),
    );
    const expectedFiles = [...sourceByArchivePath.keys()].sort();

    if (!sameValues(archiveFiles, expectedFiles)) {
      const missing = expectedFiles.filter((file) => !archiveFiles.includes(file));
      const extra = archiveFiles.filter((file) => !expectedFiles.includes(file));
      if (missing.length) {
        addError(`site/public/zips/${slug}.zip: missing files: ${missing.join(", ")}`);
      }
      if (extra.length) {
        addError(`site/public/zips/${slug}.zip: extra files: ${extra.join(", ")}`);
      }
      if (!missing.length && !extra.length) {
        addError(`site/public/zips/${slug}.zip: file listing does not exactly match the source package`);
      }
      continue;
    }

    for (const archiveFile of archiveFiles) {
      const extracted = spawnSync("unzip", ["-p", zipPath, archiveFile], {
        encoding: null,
        maxBuffer: 20 * 1024 * 1024,
      });
      if (extracted.status !== 0) {
        addError(`site/public/zips/${slug}.zip: could not extract ${archiveFile}`);
        break;
      }
      const source = fs.readFileSync(sourceByArchivePath.get(archiveFile));
      if (!source.equals(extracted.stdout)) {
        addError(`site/public/zips/${slug}.zip: stale content for ${archiveFile}`);
      }
    }
  }
}

validateRootLicense();
validatePackageLicenses();

const skillDirectories = getSkillDirectories();
validateSkillEvals(skillDirectories);
const parsedSkills = loadParsedSkills(skillDirectories);
for (const slug of skillDirectories) {
  validateFrontmatter(slug, parsedSkills.get(slug));
  validateLinksAndReferences(slug);
  validateReferenceQuality(slug);
}

let catalog;
try {
  catalog = readCatalog();
  validateCatalog(catalog, skillDirectories);
  validateRuntimeVerifications(catalog, loadRuntimeVerifications());
  validateReadme(catalog, parsedSkills);
} catch (error) {
  addError(error instanceof Error ? error.message : String(error));
}

validateZipArchives(skillDirectories);

if (errors.length) {
  console.error(`Repository validation failed with ${errors.length} error${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Repository validation passed: ${skillDirectories.length} Agent Skills, catalog, README, references, and ZIPs are synchronized.`,
  );
}
