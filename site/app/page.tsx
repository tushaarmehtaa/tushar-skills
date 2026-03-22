import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CopyButton } from "@/components/copy-button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getAllSkills, type Skill } from "@/lib/skills";

const SKILL_ORDER = [
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
  "deploy-check": 'the "did i just push .env to prod" prevention',
  "seo-ready": "your project is invisible to search. this fixes that.",
  "ship-credits": "you built the app. now figure out how to charge for it.",
  "wire-auth": "you spent 3 days on auth instead of building your product.",
  "add-analytics": "it broke in prod and you had no idea.",
  "model-audit": "which AI call is quietly burning through your budget",
  "economics": "the unit economics spreadsheet you keep saying you'll make",
  "changelog": "a week of git, distilled into something you can post",
  "cold-email": "3 sentences. they reply or they don't.",
  "ship-email": "welcome emails, campaigns, segmentation. wired in one shot.",
  "aeo-ready": "google is one thing. chatgpt, perplexity, claude — that's where you're invisible.",
  "og-image": "your links look broken when shared. this fixes that in 10 minutes.",
  "pricing-page": "tiers, feature gates, dodo checkout, and the ui. all of it.",
  "cold-outreach-sequence": "one email gets ignored. five emails, the right way, get replies.",
  "dodo-webhook": "the dodo webhook part that everyone gets wrong. done right.",
  "segment-users": "who are your power users? who's about to churn? now you'll know.",
  "mvp-spec": "the spec you should write before touching any code.",
  "landing-copy": "your landing page copy isn't converting. here's why and how to fix it.",
  "app-copy": "empty states, error messages, buttons — all the copy you left as placeholder.",
  "readme": "your repo has no README. or worse, a bad one. fixed in one pass.",
  "product-brief": "one page. what you're building, who it's for, what v1 doesn't do.",
  "teardown": "pick apart a product. what works, what doesn't, what to steal.",
  "decision-doc": "stuck between two approaches. this picks one and kills the other.",
  "make-skill": "package any workflow into a skill so you never explain it again.",
  "remotion-video": "25 seconds, 3 formats, beat-synced audio. scaffolded, not hand-wired.",
};

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
        <div className="mx-auto max-w-3xl">
          {/* Hero */}
          <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
            <h1 className="animate-hero hero-gradient text-4xl font-bold tracking-tight leading-[1.15] sm:text-5xl">
              same problems.
              <br />
              every product.
            </h1>
            <div className="animate-hero-delayed mt-8 space-y-4 text-base leading-relaxed sm:text-lg">
              <p>
                seo i never set up. credits i wired from scratch.
                <br className="hidden sm:inline" />
                {" "}deploys i pushed without checking. changelogs i never wrote.
              </p>
              <p className="text-[var(--color-heading)]">
                solved them across three products.
                <br />
                turned them into skills so i never solve them again.
              </p>
            </div>
          </section>

          {/* Install */}
          <section className="animate-fade-up delay-2 mb-16">
            <div className="install-box gradient-border flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-sm">
                <span className="text-[var(--color-accent)]">$</span>
                <code className="text-[var(--color-heading)]">
                  npx skills add tushaarmehtaa/tushar-skills
                </code>
                <span className="cursor-blink" />
              </div>
              <CopyButton text="npx skills add tushaarmehtaa/tushar-skills" />
            </div>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">
              installs all <span className="skill-count">{skills.length}</span> skills. or click any below to install individually.
            </p>
          </section>

          <div className="divider mb-12" />

          {/* Skills */}
          <section className="pb-16">
            <h2 className="animate-fade-up delay-3 mb-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)]">
              skills
            </h2>
            <div>
              {skills.map((skill, i) => (
                <ScrollReveal key={skill.slug} delay={i * 40}>
                  <Link
                    href={`/${skill.slug}`}
                    className="skill-row group flex items-start gap-5 border-b border-[var(--color-border)] px-3 py-5 sm:items-baseline"
                  >
                    <span className="w-6 shrink-0 pt-px font-[family-name:var(--font-mono)] text-sm text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="font-[family-name:var(--font-mono)] font-semibold text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-accent)]">
                          /{skill.name}
                        </span>
                        <span className="hidden font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
                          {skill.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-text)]">
                        {TAGLINES[skill.slug] || skill.description}
                      </p>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mt-1 shrink-0 text-[var(--color-border)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <div className="divider mb-16" />

          {/* How it works */}
          <section className="pb-20">
            <ScrollReveal>
              <h2 className="mb-10 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)]">
                how it works
              </h2>
            </ScrollReveal>
            <div className="space-y-8">
              <ScrollReveal delay={0}>
                <div className="step flex items-start gap-4">
                  <div className="step-number">1</div>
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">install</p>
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
                    <p className="font-semibold text-[var(--color-heading)]">invoke</p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      type{" "}
                      <code className="rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)]">
                        /skill-name
                      </code>{" "}
                      in any Claude Code session. it reads your project and runs.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={160}>
                <div className="step flex items-start gap-4">
                  <div className="step-number">3</div>
                  <div>
                    <p className="font-semibold text-[var(--color-heading)]">done</p>
                    <p className="mt-1 text-sm text-[var(--color-text)]">
                      skills adapt to your codebase. no config, no setup, no re-explaining.
                      <br />
                      <span className="text-[var(--color-muted)]">
                        they read your stack and do the right thing.
                      </span>
                    </p>
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
