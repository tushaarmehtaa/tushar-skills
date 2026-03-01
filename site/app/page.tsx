import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SkillsGrid } from "@/components/skills-grid";
import { getAllSkills } from "@/lib/skills";

export default function Home() {
  const skills = getAllSkills();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="animate-hero mb-4">
            <span className="inline-block rounded-full border border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] px-3 py-1 font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--color-accent)]">
              open source
            </span>
          </div>
          <h1 className="animate-hero font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text">/slashskills</span>
          </h1>
          <p className="animate-hero-delayed mt-5 max-w-xl text-lg text-[var(--color-text)] leading-relaxed sm:text-xl">
            Claude Code skills that actually work.
            <br />
            <span className="text-[var(--color-muted)]">
              Drop them in, invoke with a slash command, ship faster.
            </span>
          </p>

          {/* Quick install hint */}
          <div className="animate-fade-up delay-3 mt-8 inline-flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-5 py-3 font-[family-name:var(--font-mono)] text-sm backdrop-blur-sm">
            <span className="text-[var(--color-accent)] font-semibold">$</span>
            <span className="text-[var(--color-muted)]">
              curl -sL <span className="text-[var(--color-heading)]">...skill/SKILL.md</span> -o ~/.claude/skills/
            </span>
            <span className="cursor-blink text-[var(--color-accent)]" />
          </div>

          {/* Stats row */}
          <div className="animate-fade-up delay-4 mt-10 flex items-center gap-8">
            <div>
              <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-heading)]">
                {skills.length}
              </div>
              <div className="text-xs text-[var(--color-muted)]">skills</div>
            </div>
            <div className="h-8 w-px bg-[var(--color-border)]" />
            <div>
              <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-heading)]">
                1-line
              </div>
              <div className="text-xs text-[var(--color-muted)]">install</div>
            </div>
            <div className="h-8 w-px bg-[var(--color-border)]" />
            <div>
              <div className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-heading)]">
                0 config
              </div>
              <div className="text-xs text-[var(--color-muted)]">needed</div>
            </div>
          </div>
        </div>
      </section>

      <div className="gradient-line mx-6" />

      {/* Skills directory */}
      <main className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <SkillsGrid skills={skills} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
