import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CommandBlock } from "@/components/command-block";
import { Library, type LibrarySkill } from "@/components/library";
import { skillHref } from "@/lib/canvas";
import { generateInstallCommand } from "@/lib/agents";
import { GROUPS, GROUP_IDS, GROUP_ORDER, getProfile, getProof } from "@/lib/profiles";
import { getAllSkills } from "@/lib/skills";

/** Three real runs, condensed. Each line traces to that skill's result card. */
const HERO_RESULTS = [
  {
    slug: "deploy-check",
    badge: "BLOCKED",
    tone: "bad",
    title: "The Stripe secret key ships to the browser.",
    note: "Caught before tonight's deploy.",
  },
  {
    slug: "performance-diagnosis",
    badge: "788 → 404 ms",
    tone: "good",
    title: "A chat widget doubled the first paint.",
    note: "Measured with and without it. Fix: load it lazily.",
  },
  {
    slug: "humanize",
    badge: "revolutionize",
    tone: "cut",
    title: "The launch post, minus the press-release voice.",
    note: "Every fact kept. Four clichés cut.",
  },
] as const;

export default function Home() {
  const bySlug = new Map(getAllSkills().map((skill) => [skill.slug, skill]));
  const skills: LibrarySkill[] = GROUP_IDS.flatMap((group) =>
    GROUP_ORDER[group].map((slug) => {
      const skill = bySlug.get(slug as never);
      if (!skill) throw new Error(`Profile without a package: ${slug}`);
      const profile = getProfile(slug);
      return {
        slug,
        href: skillHref(slug),
        outcome: profile.outcome,
        group,
        chat: skill.surfaces.includes("claude-app"),
        verified: Object.values(skill.support).includes("tested"),
        sampleRun: getProof(slug) !== null,
        keywords: [skill.description, ...skill.tags, skill.category].join(" ").toLowerCase(),
      };
    }),
  );
  const groups = GROUP_IDS.map((id) => ({ id, ...GROUPS[id] }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="page">
        <section className="hero">
          <h1>
            <span className="hero-line">Great work starts </span>
            <span className="hero-line">
              with a <em>useful skill.</em>
            </span>
          </h1>
          <div className="hero-side">
            <p>
              {skills.length} skills that turn Claude Code, Codex or Cursor into a product team. Spec the idea, wire auth
              and payments, block the bad deploy, write the launch.
            </p>
            <CommandBlock command={generateInstallCommand()} copyLabel="Copy all" analytics={{ agent: "all", skill: "all" }} />
            <p className="hero-hint">Installs all {skills.length} into Claude Code, Codex or Cursor. Or pick one below.</p>
          </div>
          <ul className="hero-results" aria-label="Real runs">
            {HERO_RESULTS.map((result) => (
              <li key={result.slug}>
                <Link href={skillHref(result.slug)} className="hero-result">
                  <span className="hero-badge" data-tone={result.tone}>
                    {result.tone === "cut" ? <s>{result.badge}</s> : result.badge}
                  </span>
                  <span className="hero-result-text">
                    <strong>{result.title}</strong>
                    <span>{result.note}</span>
                  </span>
                  <span className="hero-result-skill">/{result.slug} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <Library skills={skills} groups={groups} />
      </main>
      <Footer />
    </div>
  );
}
