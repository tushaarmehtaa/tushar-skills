import fs from "fs";
import path from "path";
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
}

const REPO_ROOT = path.join(process.cwd(), "..");

let skillsCache: Skill[] | null = null;

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

      return {
        slug,
        name: data.name || slug,
        description: data.description || "",
        license: data.license || "MIT",
        compatibility: data.compatibility,
        content,
        ...catalog,
      } satisfies Skill;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return skillsCache;
}

export function getSkill(slug: string): Skill | undefined {
  return getAllSkills().find((s) => s.slug === slug);
}
