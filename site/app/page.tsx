import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CopyButton } from "@/components/copy-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SkillLogo } from "@/components/skill-logo";
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
  "debug-perf",
  "supabase",
  "init-claude-md",
  "remove-ai-slop",
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
  "debug-perf": "hot reload loops, CPU spikes, bundle bloat, and missing caches",
  "supabase": "schema, RLS policies, migrations, and TypeScript types",
  "init-claude-md": "read the codebase, write a complete CLAUDE.md",
  "remove-ai-slop": "audit and remove AI slop tells in design and copy",
};

const EXTERNAL_SKILLS = [
  {
    name: "frontend-design",
    source: "Ilm-Alan",
    logoSlug: "init-claude-md",
    avatar: null,
    round: false,
    note: "high-taste frontend direction and implementation",
    url: "https://github.com/Ilm-Alan/frontend-design",
  },
  {
    name: "emil-design-eng",
    source: "Emil Kowalski",
    logoSlug: null,
    avatar: "https://github.com/emilkowalski.png",
    round: true,
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
            <h1 className="animate-fade-up delay-1 terminal-heading max-w-4xl text-[2rem] font-semibold leading-[1.15] text-[var(--color-heading)] sm:text-6xl sm:leading-[1.12]">
              <span className="block">workflows</span>
              <span className="block">saved as</span>
              <span className="hidden sm:block">terminal skills.</span>
              <span className="block sm:hidden">terminal</span>
              <span className="block sm:hidden">skills.</span>
            </h1>

            <div className="animate-fade-up delay-2 mt-8 max-w-2xl space-y-4 text-base leading-relaxed sm:text-lg">
              <p>
                these came from workflows I kept repeating. each one ran on a real project before it became a command.
              </p>
              <p>
                each folder is a <code className="font-[family-name:var(--font-mono)] text-[var(--color-heading)]">SKILL.md</code>: when to trigger, what to read, what to run, what to produce. install in Claude Code or zip a folder and upload it to the Claude app.
              </p>
            </div>
          </section>

          {/* Install */}
          <section className="animate-fade-up delay-3 mb-12 grid gap-4 lg:grid-cols-2">
            <div className="terminal-panel install-box flex flex-col gap-3 p-4">
              <div className="terminal-caption text-[var(--color-heading)]">
                Claude Code
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text)]">
                Run the command. All{" "}
                <span className="text-[var(--color-heading)]">{skills.length} skills</span>{" "}
                land in{" "}
                <span className="font-[family-name:var(--font-mono)] text-[var(--color-heading)]">
                  ~/.claude/skills/
                </span>{" "}
                and activate automatically.
              </p>
              <div className="flex min-w-0 max-w-full items-center gap-3 overflow-hidden font-[family-name:var(--font-mono)] text-xs sm:text-sm">
                <span className="select-none text-[var(--color-accent)]">$</span>
                <code className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-heading)]">
                  npx skills add tushaarmehtaa/tushar-skills
                </code>
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#use"
                  className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-accent)]"
                >
                  read guide
                </a>
                <CopyButton
                  text="npx skills add tushaarmehtaa/tushar-skills"
                  className="shrink-0"
                />
              </div>
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
            <div className="animate-fade-up delay-3 mb-5 flex items-center justify-between">
              <h2 className="terminal-caption text-[var(--color-heading)]">skill index</h2>
              <p className="terminal-caption hidden sm:block">included in this repo</p>
            </div>

            <div className="terminal-rule mb-3 hidden grid-cols-[3rem_minmax(11rem,1fr)_8rem_minmax(16rem,1.5fr)_3rem] gap-4 px-3 pt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)] sm:grid">
              <span>id</span>
              <span>command</span>
              <span>class</span>
              <span>output</span>
              <span className="text-right">tools</span>
            </div>

            <div className="terminal-panel p-1">
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.slug} delay={i * 40}>
                  <Link
                    href={`/${skill.slug}`}
                    className="skill-row group grid gap-2 border-b border-[var(--color-border)] px-3 py-4 font-[family-name:var(--font-mono)] last:border-b-0 sm:grid-cols-[3rem_minmax(11rem,1fr)_8rem_minmax(16rem,1.5fr)_3rem] sm:items-center sm:gap-4"
                  >
                    <span className="relative z-10 text-xs text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)] sm:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="skill-row-command relative z-10 text-sm font-semibold text-[var(--color-heading)] transition-colors sm:text-base">
                      /{skill.name}
                    </span>
                    <span className="relative z-10 w-fit border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors group-hover:border-[var(--color-accent-dim)] group-hover:text-[var(--color-text)]">
                      {skill.category}
                    </span>
                    <p className="relative z-10 text-sm leading-relaxed text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-text)]">
                      {TAGLINES[skill.slug] || skill.description}
                    </p>
                    <span className="relative z-10 flex items-center justify-end">
                      <SkillLogo slug={skill.slug} className="h-4 w-4 opacity-30 transition-opacity group-hover:opacity-70" />
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
                    {skill.logoSlug ? (
                      <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                        <SkillLogo slug={skill.logoSlug} className="h-4 w-4 opacity-70" />
                      </span>
                    ) : skill.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={skill.avatar}
                        alt={skill.source}
                        width={28}
                        height={28}
                        className={`relative z-10 h-7 w-7 shrink-0 object-cover opacity-80 transition-opacity hover:opacity-100 ${skill.round ? "rounded-full" : "rounded-sm"}`}
                      />
                    ) : null}
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
              </div>
            </ScrollReveal>
            <div className="grid gap-6 lg:grid-cols-2">
              <ScrollReveal delay={0}>
                <div className="terminal-panel flex h-full flex-col gap-6 p-6">
                  <div className="terminal-caption text-[var(--color-heading)]">Claude Code</div>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        install
                      </p>
                      <div className="flex items-center gap-3 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 font-[family-name:var(--font-mono)] text-xs">
                        <span className="select-none text-[var(--color-accent)]">$</span>
                        <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-heading)]">
                          npx skills add tushaarmehtaa/tushar-skills
                        </code>
                        <CopyButton text="npx skills add tushaarmehtaa/tushar-skills" className="shrink-0" />
                      </div>
                      <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
                        skills land in ~/.claude/skills/
                      </p>
                    </div>
                    <div>
                      <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        trigger
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--color-text)]">
                        type{" "}
                        <code className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">
                          /skill-name
                        </code>{" "}
                        or just describe the task. Claude reads the SKILL.md and runs the workflow.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={80}>
                <div className="terminal-panel flex h-full flex-col gap-6 p-6">
                  <div className="terminal-caption text-[var(--color-heading)]">Claude app</div>
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        get the skill
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--color-text)]">
                        open a skill page and download the zip.
                      </p>
                    </div>
                    <div>
                      <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        upload
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--color-text)]">
                        go to{" "}
                        <span className="font-[family-name:var(--font-mono)] text-[var(--color-heading)]">
                          Customize &gt; Skills
                        </span>
                        . upload the zip. toggle it on.
                      </p>
                    </div>
                    <div>
                      <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        use it
                      </p>
                      <p className="text-sm leading-relaxed text-[var(--color-text)]">
                        ask Claude normally. it reads the description and triggers when the task matches.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://support.claude.com/en/articles/12512180-use-skills-in-claude"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--color-accent)]"
                  >
                    official skills docs
                  </a>
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
