import { SKILL_DISPLAY } from "./canvas";
import { GROUP_IDS, GROUP_ORDER, getProfile } from "./profiles";
import { getAllSkills } from "./skills";
import type { BrandSkill } from "./brand-shared";

/** Shown first on the homepage, before the rest in profile order. */
const FIRST = [
  "who-to-sell-to", "remove-ai-slop", "mobile-first", "deploy-check", "landing-page", "interface-design",
  "supabase", "search-ready", "user-insights", "changelog", "product-spec", "agent-instructions",
];
const NEW_SLUGS = ["who-to-sell-to"];

/** Popular is data, not decoration: the four most installed skills. */
export function buildBrandSkills(bySlug: Record<string, number>): BrandSkill[] {
  const all = GROUP_IDS.flatMap((group) => GROUP_ORDER[group].map((slug) => ({ slug, group })));
  const ranked = [...all].sort((a, b) => (bySlug[b.slug] ?? 0) - (bySlug[a.slug] ?? 0)).slice(0, 4).map((s) => s.slug);
  const order = [...FIRST, ...all.map((s) => s.slug).filter((s) => !FIRST.includes(s))];
  const packages = new Map(getAllSkills().map((s) => [s.slug as string, s]));
  return order.map((slug) => {
    const pkg = packages.get(slug);
    return {
      slug,
      group: all.find((s) => s.slug === slug)!.group,
      flow: SKILL_DISPLAY[slug]?.flow ?? "",
      outcome: getProfile(slug).outcome,
      installs: bySlug[slug] ?? 0,
      isNew: NEW_SLUGS.includes(slug),
      popular: ranked.includes(slug),
      chat: pkg ? pkg.surfaces.includes("claude-app") : false,
      keywords: pkg ? [pkg.description, ...pkg.tags, pkg.category].join(" ").toLowerCase() : "",
    };
  });
}
