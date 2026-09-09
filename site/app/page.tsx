import { Suspense } from "react";
import { Header } from "@/components/header";
import { PageFrame } from "@/components/page-frame";
import { Footer } from "@/components/footer";
import { InteractiveInstaller } from "@/components/interactive-installer";
import { SkillDirectory } from "@/components/skill-directory";
import { getAllSkills, type Skill } from "@/lib/skills";

const SKILL_ORDER = [
  "remove-ai-slop",
  "ai-product-development",
  "interface-design",
  "deploy-check",
  "demo-video",
  "search-ready",
  "analytics",
  "payments-with-dodo",
  "auth-implementation",
  "credit-metering",
  "email-with-resend",
  "product-experiments",
  "performance-diagnosis",
  "decision-doc",
  "product-spec",
  "product-launch",
  "skill-creator",
  "landing-copy",
  "ui-copy",
  "fundraising",
  "product-teardown",
  "ai-cost-audit",
  "user-insights",
  "changelog",
  "cold-outreach",
  "rate-limit",
  "social-sharing",
  "supabase",
  "readme",
  "agent-instructions",
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
          <section className="animate-fade-up pt-10 pb-6 sm:pt-14 sm:pb-8">
            <h1 className="terminal-heading max-w-4xl text-[2rem] font-semibold leading-tight text-[var(--color-heading)] sm:text-5xl">
              workflows saved as <span className="text-[var(--color-accent)]">Agent Skills.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
              Find a workflow for your next task. Install it in Codex, Claude Code, or Cursor.
            </p>
          </section>
          <section className="mb-8" aria-label="Install a skill">
            <InteractiveInstaller skills={skills.map(({ slug, name }) => ({ slug, name }))} />
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
