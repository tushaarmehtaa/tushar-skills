import type { MetadataRoute } from "next";
import { getAllSkills } from "@/lib/skills";

const siteUrl = "https://www.slashskills.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/compatibility`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/changelog`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/guides/chatgpt`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/guides/claude-app`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const skillPages = getAllSkills().map((skill) => ({
    url: `${siteUrl}/${skill.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...skillPages];
}
