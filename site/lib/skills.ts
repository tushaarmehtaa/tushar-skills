import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import {
  CATALOG,
  CATALOG_SLUGS,
  type CatalogEntry,
  type SkillSlug,
} from "./catalog";

export interface Skill extends CatalogEntry {
  slug: SkillSlug;
  name: string;
  description: string;
  license: string;
  compatibility?: string;
  content: string;
  files: SkillFile[];
}

export interface SkillFile {
  path: string;
  content: string;
  lineCount: number;
}

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

let skillsCache: Skill[] | null = null;

function getBundledMarkdownFiles(skillRoot: string): SkillFile[] {
  const files: SkillFile[] = [];

  function walk(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".md") || absolutePath === path.join(skillRoot, "SKILL.md")) {
        continue;
      }

      const raw = fs.readFileSync(absolutePath, "utf-8");
      const { content } = matter(raw);
      files.push({
        path: path.relative(skillRoot, absolutePath).split(path.sep).join("/"),
        content,
        lineCount: content.split(/\r?\n/).length,
      });
    }
  }

  walk(skillRoot);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

export function getAllSkills(): Skill[] {
  if (skillsCache) return skillsCache;

  skillsCache = CATALOG_SLUGS.map((slug) => {
      const skillPath = path.join(REPO_ROOT, slug, "SKILL.md");
      if (!fs.existsSync(skillPath)) {
        throw new Error(`Catalog skill is missing SKILL.md: ${slug}`);
      }

      const raw = fs.readFileSync(skillPath, "utf-8");
      const { data, content } = matter(raw);
      const catalog = CATALOG[slug];
      const skillRoot = path.dirname(skillPath);

      return {
        slug,
        name: data.name || slug,
        description: data.description || "",
        license: data.license || "MIT",
        compatibility: data.compatibility,
        content,
        files: getBundledMarkdownFiles(skillRoot),
        ...catalog,
      } satisfies Skill;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return skillsCache;
}

export function getSkill(slug: string): Skill | undefined {
  return getAllSkills().find((s) => s.slug === slug);
}
