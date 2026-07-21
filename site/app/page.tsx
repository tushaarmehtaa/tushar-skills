import { Suspense } from "react";
import { Header } from "@/components/header";
import { PageFrame } from "@/components/page-frame";
import { Footer } from "@/components/footer";
import { InteractiveInstaller } from "@/components/interactive-installer";
import { RuntimeLogoTile } from "@/components/runtime-logo";
import { SkillDirectory } from "@/components/skill-directory";
import { TrackedLink } from "@/components/tracked-link";
import { AGENT_IDS } from "@/lib/agents";
import { getAllSkills, type Skill } from "@/lib/skills";

const SKILL_ORDER = [
  "remove-ai-slop",
  "deploy-check",
  "remotion-video",
  "decision-doc",
  "make-skill",
  "gtm-launch",
  "seo-ready",
  "ship-credits",
  "wire-auth",
  "add-analytics",
  "model-audit",
  "economics",
  "changelog",
  "cold-email",
  "ship-email",
  "aeo-ready",
  "ai-streaming",
  "feature-flags",
  "file-upload",
  "rate-limit",
  "waitlist",
];

function orderSkills(allSkills: Skill[]) {
  const priority = new Map(SKILL_ORDER.map((slug, index) => [slug, index]));
  return [...allSkills].sort((a, b) => {
    const aIndex = priority.get(a.slug) ?? Number.POSITIVE_INFINITY;
    const bIndex = priority.get(b.slug) ?? Number.POSITIVE_INFINITY;
    return aIndex - bIndex || a.name.localeCompare(b.name);
  });
}

export default function Home() {
  const skills = orderSkills(getAllSkills());

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main id="main-content" className="flex-1 px-6">
        <PageFrame>
          <section className="animate-fade-up pt-20 pb-12 sm:pt-28 sm:pb-16">
            <h1 className="terminal-heading max-w-4xl text-[2rem] font-semibold leading-[1.15] text-[var(--color-heading)] sm:text-6xl sm:leading-[1.12]">
              workflows saved as <span className="text-[var(--color-accent)]">Agent Skills.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-relaxed sm:text-lg">
              Reusable <code className="font-[family-name:var(--font-mono)] text-[var(--color-heading)]">SKILL.md</code> workflows from real projects. Install them in
              <span className="sr-only"> Codex, Claude Code, or Cursor</span>
              <span aria-hidden="true" className="mx-2 inline-flex translate-y-[7px] items-center gap-1.5">
                {AGENT_IDS.map((agentId) => (
                  <RuntimeLogoTile key={agentId} runtime={agentId} size="sm" decorative />
                ))}
              </span>
              and see what each skill needs and where it has been tested.
            </p>
          </section>

          <section className="mb-6" aria-label="Install a skill">
            <InteractiveInstaller skills={skills.map(({ slug, name }) => ({ slug, name }))} />
          </section>

          <section className="mb-16 grid gap-7 border-y border-[var(--color-border)] py-8 sm:grid-cols-[1.1fr_1fr] sm:items-center">
            <div>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--color-text)]">
                Agent Skills standardizes the folder and <code className="text-[var(--color-heading)]">SKILL.md</code>. Discovery, install location, invocation, and available tools still belong to each runtime.
              </p>
            </div>
            <div>
              <div className="relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4">
                <div aria-hidden="true" className="absolute left-[4.25rem] right-[4.25rem] top-[2.1rem] h-px bg-[linear-gradient(90deg,var(--color-accent-dim),var(--color-border-hover),var(--color-accent-dim))]" />
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <RuntimeLogoTile runtime="agent-skills" size="md" decorative />
                    <code className="hidden font-[family-name:var(--font-mono)] text-xs text-[var(--color-heading)] lg:block">SKILL.md</code>
                  </div>
                  <span aria-hidden="true" className="bg-[var(--color-surface)] px-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">→</span>
                  <div role="img" aria-label="Codex, Claude Code, and Cursor" className="flex items-center gap-1.5 bg-[var(--color-surface)] pl-2">
                    {AGENT_IDS.map((agentId) => (
                      <RuntimeLogoTile key={agentId} runtime={agentId} size="sm" decorative />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs">
                <TrackedLink href="/compatibility" eventName="guide_open" agent="all" skill="all" className="text-[var(--color-accent)] hover:text-[var(--color-heading)]">
                  Compare compatibility →
                </TrackedLink>
              </div>
            </div>
          </section>

          <Suspense
            fallback={<section className="pb-20" aria-labelledby="skill-index-heading"><h2 id="skill-index-heading" className="mb-5 text-xl font-semibold text-[var(--color-heading)]">Skills</h2></section>}
          >
            <SkillDirectory
              skills={skills.map(({ slug, name, category, description, surfaces }) => ({
                slug,
                name,
                category,
                description,
                localAvailable: surfaces.includes("coding-agent"),
                claudeAppReady: surfaces.includes("claude-app"),
              }))}
            />
          </Suspense>
        </PageFrame>
      </main>

      <Footer />
    </div>
  );
}
