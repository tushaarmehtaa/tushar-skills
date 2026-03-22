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
    <article>
      <div className="mb-10 animate-fade-up">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-[var(--color-heading)] sm:text-4xl">
          <span className="text-[var(--color-accent)]">/</span>{skill.name}
        </h1>
        <p className="text-base leading-relaxed text-[var(--color-text)]">
          {skill.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="tag rounded border border-[var(--color-border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Install */}
      <div className="animate-fade-up delay-1 mb-12 overflow-hidden rounded-lg border border-[var(--color-border)] gradient-border">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
          <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
            install
          </span>
          <CopyButton text={skill.installCommand} label="copy" />
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3 font-[family-name:var(--font-mono)] text-sm">
            <span className="select-none text-[var(--color-accent)]">$</span>
            <code className="break-all leading-relaxed text-[var(--color-heading)]">
              {skill.installCommand}
            </code>
          </div>
        </div>
      </div>

      <div className="divider mb-10" />

      <div
        className="prose animate-fade-up delay-2"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-16 border-t border-[var(--color-border)] pt-8">
        <a
          href={`https://github.com/tushaarmehtaa/tushar-skills/blob/main/${skill.slug}/SKILL.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          edit on github
        </a>
      </div>
    </article>
  );
}
