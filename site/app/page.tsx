import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CopyButton } from "@/components/copy-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getAllSkills, type Skill } from "@/lib/skills";

const SKILL_ORDER = [
  "gtm-launch",
  "deploy-check",
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
  "og-image",
  "pricing-page",
  "cold-outreach-sequence",
  "dodo-webhook",
  "segment-users",
  "mvp-spec",
  "landing-copy",
  "app-copy",
  "readme",
  "product-brief",
  "teardown",
  "decision-doc",
  "make-skill",
  "remotion-video",
];

const TAGLINES: Record<string, string> = {
  "gtm-launch": "research, positioning, launch plan, assets, and post-launch review",
  "deploy-check": "pre-flight checks before production deploys",
  "seo-ready": "SEO and AEO audit for web projects",
  "ship-credits": "credits, metering, payments, and usage state",
  "wire-auth": "auth provider, database sync, sessions, and security checks",
  "add-analytics": "PostHog, Sentry, and health checks for production apps",
  "model-audit": "AI model routing, usage, and cost map",
  "economics": "unit economics for AI products",
  "changelog": "weekly changelog card from git history",
  "cold-email": "short cold emails for specific people",
  "ship-email": "transactional email, campaigns, templates, and cohorts",
  "aeo-ready": "schema, llms.txt, crawler rules, and citation readiness",
  "og-image": "dynamic Open Graph images and social preview metadata",
  "pricing-page": "tiers, feature gates, checkout, and pricing UI",
  "cold-outreach-sequence": "multi-touch outreach sequences with follow-ups",
  "dodo-webhook": "Dodo payment events, signatures, idempotency, and sync",
  "segment-users": "behavioral cohorts from your database schema",
  "mvp-spec": "MVP scope, data model, routes, pages, and launch/later split",
  "landing-copy": "landing page copy audit and rewrite",
  "app-copy": "empty states, errors, buttons, onboarding, and UI copy",
  "readme": "README audit or rewrite for open source projects",
  "product-brief": "one-page product brief before implementation",
  "teardown": "product or landing page teardown",
  "decision-doc": "structured tradeoff analysis and recommendation",
  "make-skill": "turn a repeated workflow into a reusable skill",
  "remotion-video": "Remotion video project scaffold and animation primitives",
};

const EXTERNAL_SKILLS = [
  {
    name: "frontend-design",
    source: "external",
    note: "high-taste frontend direction and implementation",
    url: "https://github.com/Ilm-Alan/frontend-design",
  },
  {
    name: "emil-design-eng",
    source: "Emil Kowalski",
    note: "UI polish, interaction timing, and motion judgment",
    url: "https://emilkowal.ski/skill",
  },
];

export default function Home() {
  const allSkills = getAllSkills();

  const orderedSlugs = new Set(SKILL_ORDER);
  const ordered = SKILL_ORDER.map((slug) =>
    allSkills.find((s) => s.slug === slug)
  ).filter((s): s is Skill => !!s);
  const remaining = allSkills.filter((s) => !orderedSlugs.has(s.slug));
  const skills = [...ordered, ...remaining];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-6">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <section className="pt-20 pb-10 sm:pt-28 sm:pb-14">
            <div className="animate-fade-up mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="terminal-meta">slashskills</span>
              <span className="terminal-caption">
                {skills.length} skills
              </span>
              <span className="terminal-caption terminal-status">
                Claude Code + Claude app
              </span>
            </div>

            <h1 className="animate-hero terminal-heading hero-gradient max-w-4xl text-[2rem] font-semibold leading-[1.15] sm:text-6xl sm:leading-[1.12]">
              <span className="terminal-line">workflows</span>
              <span className="terminal-line">saved as</span>
              <span className="terminal-line terminal-line-desktop">terminal skills.</span>
              <span className="terminal-line terminal-line-mobile">terminal</span>
              <span className="terminal-line terminal-line-mobile">skills.</span>
            </h1>

            <div className="animate-hero-delayed mt-8 max-w-2xl space-y-4 text-base leading-relaxed sm:text-lg">
              <p>
                each folder is a <code className="font-[family-name:var(--font-mono)] text-[var(--color-heading)]">SKILL.md</code>: when to use it, what context to read, what steps to run, and what output to produce.
              </p>
              <p className="text-[var(--color-heading)]">
                install them in Claude Code, or zip an individual skill folder and upload it in Claude.
              </p>
            </div>
          </section>

          {/* Install */}
          <section className="animate-fade-up delay-2 mb-12 grid gap-4 lg:grid-cols-2">
            <div className="terminal-panel install-box flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 max-w-full items-center gap-3 overflow-hidden font-[family-name:var(--font-mono)] text-xs sm:text-sm">
                <span className="select-none text-[var(--color-accent)]">$</span>
                <code className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-heading)]">
                  npx skills add tushaarmehtaa/tushar-skills
                </code>
                <span className="cursor-blink" />
              </div>
              <CopyButton
                text="npx skills add tushaarmehtaa/tushar-skills"
                className="shrink-0"
              />
            </div>
            <div className="terminal-panel install-box flex flex-col gap-3 p-4">
              <div className="terminal-caption text-[var(--color-heading)]">
                Claude app
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text)]">
                Zip one skill folder, then upload it in{" "}
                <span className="font-[family-name:var(--font-mono)] text-[var(--color-heading)]">
                  Customize &gt; Skills
                </span>
                .
              </p>
              <a
                href="#use"
                className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-accent)]"
              >
                read guide
              </a>
            </div>
          </section>
          <p className="mb-16 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
            install all <span className="skill-count">{skills.length}</span> repo skills, or open a skill page to copy the one-skill command.
          </p>

          <div className="divider mb-12" />

          {/* Skills */}
          <section className="pb-16">
            <div className="animate-fade-up delay-3 mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="terminal-caption text-[var(--color-heading)]">
                  skill index
                </h2>
                <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                  name / category / what it does
                </p>
              </div>
              <p className="terminal-caption hidden sm:block">
                included in this repo
              </p>
            </div>

            <div className="terminal-rule mb-3 hidden grid-cols-[3rem_minmax(11rem,1fr)_8rem_minmax(16rem,1.5fr)_5rem] gap-4 px-3 pt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)] sm:grid">
              <span>id</span>
              <span>command</span>
              <span>class</span>
              <span>output</span>
              <span className="text-right">run</span>
            </div>

            <div className="terminal-panel p-1">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.slug} delay={i * 40}>
                  <Link
                    href={`/${skill.slug}`}
                    className="skill-row group grid gap-2 border-b border-[var(--color-border)] px-3 py-4 font-[family-name:var(--font-mono)] last:border-b-0 sm:grid-cols-[3rem_minmax(11rem,1fr)_8rem_minmax(16rem,1.5fr)_5rem] sm:items-baseline sm:gap-4"
                  >
                    <span className="relative z-10 text-xs text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)] sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="skill-row-command relative z-10 text-sm font-semibold text-[var(--color-heading)] transition-colors sm:text-base">
                      /{skill.name}
                    </span>
                    <span className="relative z-10 w-fit border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors group-hover:border-[var(--color-accent-dim)] group-hover:text-[var(--color-info)]">
                      {skill.category}
                    </span>
                    <p className="relative z-10 text-sm leading-relaxed text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-text)]">
                      {TAGLINES[skill.slug] || skill.description}
                    </p>
                    <span className="skill-row-action relative z-10 text-left text-xs uppercase tracking-[0.12em] text-[var(--color-accent)] sm:text-right">
                      exec
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <div className="divider mb-16" />

          {/* External */}
          <section className="pb-16">
            <ScrollReveal>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="terminal-caption text-[var(--color-heading)]">
                    external skills i use
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                    listed for discovery; not bundled by the install command
                  </p>
                </div>
                <p className="terminal-caption hidden sm:block">
                  external
                </p>
              </div>
            </ScrollReveal>

            <div className="terminal-panel p-1">
              {EXTERNAL_SKILLS.map((skill, i) => (
                <ScrollReveal key={skill.name} delay={i * 35}>
                  <a
                    href={skill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="skill-row grid gap-2 border-b border-[var(--color-border)] px-3 py-4 font-[family-name:var(--font-mono)] last:border-b-0 transition-colors hover:bg-[var(--color-accent)]/5 sm:grid-cols-[3rem_minmax(11rem,1fr)_10rem_minmax(16rem,1.5fr)] sm:items-baseline sm:gap-4"
                  >
                    <span className="relative z-10 text-xs text-[var(--color-muted)] sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative z-10 text-sm font-semibold text-[var(--color-heading)] sm:text-base">
                      /{skill.name}
                    </span>
                    <span className="relative z-10 w-fit border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--color-info)]">
                      {skill.source}
                    </span>
                    <p className="relative z-10 text-sm leading-relaxed text-[var(--color-muted)]">
                      {skill.note}
                    </p>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <div className="divider mb-16" />

          {/* How it works */}
          <section id="use" className="pb-20">
            <ScrollReveal>
              <div className="mb-10">
                <h2 className="terminal-caption text-[var(--color-heading)]">
                  how to use
                </h2>
                <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                  Claude Code uses folders. Claude app uses zipped skill folders.
                </p>
              </div>
            </ScrollReveal>
            <div className="space-y-8">
              <ScrollReveal delay={0}>
                <div className="step flex items-start gap-4">
                  <div className="step-number">1</div>
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">Claude Code</p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      run the install command. skills land in{" "}
                      <code className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">
                        ~/.claude/skills/
                      </code>
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={80}>
                <div className="step flex items-start gap-4">
                  <div className="step-number">2</div>
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">Claude app</p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      zip a skill folder, upload the zip in{" "}
                      <code className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">
                        Customize &gt; Skills
                      </code>{" "}
                      and toggle it on.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <div className="step flex items-start gap-4">
                  <div className="step-number">3</div>
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">Use it</p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      ask normally. Claude loads a skill when its description matches the task.
                      <br />
                      <span className="text-[var(--color-muted)]">
                        for codebase work, Claude Code is still the natural home for these.
                      </span>
                    </p>
                    <a
                      href="https://support.claude.com/en/articles/12512180-use-skills-in-claude"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-accent)]"
                    >
                      official Claude skills docs
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
