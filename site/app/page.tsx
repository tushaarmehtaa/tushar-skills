import { TASK_TITLES } from "@/lib/canvas";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { PageFrame } from "@/components/page-frame";
import { Footer } from "@/components/footer";
import { InteractiveInstaller } from "@/components/interactive-installer";
import { SkillDirectory } from "@/components/skill-directory";
import { getAllSkills, type Skill } from "@/lib/skills";

const SKILL_ORDER = [
  "interface-design",
  "ai-product-development",
  "user-insights",
  "auth-implementation",
  "remove-ai-slop",
  "deploy-check",
  "demo-video",
  "search-ready",
  "analytics",
  "payments-with-dodo",
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
          <section className="canvas-hero">
            <div className="hero-copy">
              <h1>Good work starts<br />with a <span>useful skill.</span></h1>
              <p>Give your agent a better way to work. Pick a workflow, install it, and make it yours.</p>
            </div>
          </section>
          <Suspense
            fallback={
              <section className="pb-20" aria-labelledby="skill-index-heading">
                <h2
                  id="skill-index-heading"
                  className="mb-5 text-xl font-semibold text-[var(--color-heading)]"
                >
                  Skills
                </h2>
              </section>
            }
          >
            <SkillDirectory
              skills={skills.map(
                ({ slug, name, category, description, surfaces }) => ({
                  slug,
                  name,
                  displayName: TASK_TITLES[slug],
                  category,
                  description,
                  localAvailable: surfaces.includes("coding-agent"),
                  claudeAppReady: surfaces.includes("claude-app"),
                }),
              )}
            />
          </Suspense>
          <section
            id="library-install"
            tabIndex={-1}
            className="library-install"
            aria-labelledby="library-heading"
          >
            <div>
              <h2 id="library-heading">Want the whole collection?</h2>
              <p>Install the library, or choose a single skill and scope.</p>
            </div>
            <InteractiveInstaller
              skills={skills.map(({ slug, name }) => ({ slug, name }))}
            />
          </section>
        </PageFrame>
      </main>

      <Footer />
    </div>
  );
}
