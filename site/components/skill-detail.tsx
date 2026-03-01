import { CopyButton } from "./copy-button";
import type { Skill } from "@/lib/skills";

export function SkillDetail({
  skill,
  contentHtml,
}: {
  skill: Skill;
  contentHtml: string;
}) {
  return (
    <article className="mx-auto max-w-3xl">
      {/* Title */}
      <div className="mb-10 animate-hero">
        <h1 className="mb-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="gradient-text">/{skill.name}</span>
        </h1>
        <p className="text-lg text-[var(--color-text)] leading-relaxed">
          {skill.description}
        </p>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="tag-hover rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Install block */}
      <div className="animate-hero-delayed mb-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]/40" />
            <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Install
            </span>
          </div>
          <CopyButton text={skill.installCommand} label="Copy command" />
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 font-[family-name:var(--font-mono)] text-sm">
            <span className="select-none text-[var(--color-accent)] font-semibold">$</span>
            <code className="break-all text-[var(--color-heading)] leading-relaxed">
              {skill.installCommand}
            </code>
          </div>
        </div>
      </div>

      <div className="gradient-line mb-10" />

      {/* Markdown content */}
      <div
        className="prose animate-fade-up delay-2"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {/* Footer link */}
      <div className="mt-16 flex items-center justify-between border-t border-[var(--color-border)] pt-8">
        <a
          href={`https://github.com/tushaarmehtaa/tushar-skills/blob/main/${skill.slug}/SKILL.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit on GitHub
        </a>
      </div>
    </article>
  );
}
