import { EDITORIAL_GUIDES } from "@/lib/guides";
import type { MetadataRoute } from "next";
import { getAllSkills } from "@/lib/skills";
import { AGENTS, AGENT_IDS } from "@/lib/agents";

const siteUrl = "https://www.slashskills.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/compatibility`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/changelog`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/guides/chatgpt`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/guides/claude-app`, changeFrequency: "monthly", priority: 0.8 },
    ...EDITORIAL_GUIDES.map((guide) => ({ url: `${siteUrl}/guides/${guide.slug}`, lastModified: guide.date, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...AGENT_IDS.map((agent) => ({
      url: `${siteUrl}${AGENTS[agent].guideRoute}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  const staticPaths = new Set(staticPages.map((page) => new URL(page.url).pathname));
  const skillPages = getAllSkills().filter((skill) => !staticPaths.has(`/${skill.slug}`)).map((skill) => ({
    url: `${siteUrl}/${skill.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...skillPages];
}
