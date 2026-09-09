import type { SkillSlug } from "./catalog";

export interface EditorialGuide {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  relatedSkills: SkillSlug[];
  action: string;
}

export const EDITORIAL_GUIDES: EditorialGuide[] = [
  {
    slug: "image-editing-skills",
    title: "Build an image-editing skill with GPT Image 2.5",
    description: "Turn reference images, successive edits, and visual checks into a reusable skill. Includes the package and an edit record.",
    category: "Image workflows",
    date: "2026-09-09",
    relatedSkills: ["image-editing", "ai-product-development"],
    action: "Get the image-editing skill",
  },
  {
    slug: "astra-skill-instructions",
    title: "Adapt your skill instructions for GPT-6 Astra",
    description: "Find conflicting instructions, separate preferences from blockers, and test a revision without widening permissions.",
    category: "Skill engineering",
    date: "2026-09-09",
    relatedSkills: ["skill-creator", "agent-instructions"],
    action: "Get the skill-creator workflow",
  },
];
