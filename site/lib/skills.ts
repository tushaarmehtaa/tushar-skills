import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  content: string;
  installCommand: string;
}

const REPO_ROOT = path.join(process.cwd(), "..");
const EXCLUDED = new Set(["site", "node_modules", ".git", ".github", ".next"]);

export function getAllSkills(): Skill[] {
  const entries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });

  return entries
    .filter((e) => e.isDirectory() && !EXCLUDED.has(e.name))
    .map((e) => {
      const skillPath = path.join(REPO_ROOT, e.name, "SKILL.md");
      if (!fs.existsSync(skillPath)) return null;

      const raw = fs.readFileSync(skillPath, "utf-8");
      const { data, content } = matter(raw);

      return {
        slug: e.name,
        name: data.name || e.name,
        description: data.description || "",
        category: data.category || "workflow",
        tags: data.tags || [],
        author: data.author || "tushaarmehtaa",
        content,
        installCommand: `curl -sL https://raw.githubusercontent.com/tushaarmehtaa/tushar-skills/main/${e.name}/SKILL.md -o ~/.claude/skills/${e.name}/SKILL.md --create-dirs`,
      } satisfies Skill;
    })
    .filter((s): s is Skill => s !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSkill(slug: string): Skill | undefined {
  return getAllSkills().find((s) => s.slug === slug);
}
