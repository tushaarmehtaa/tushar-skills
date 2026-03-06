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
          /{skill.name}
        </h1>
        <p className="text-base leading-relaxed text-[var(--color-text)]">
          {skill.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-[var(--color-border)] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Install */}
      <div className="animate-fade-up delay-1 mb-12 overflow-hidden rounded-lg border border-[var(--color-border)]">
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

      <div className="mb-10 h-px bg-[var(--color-border)]" />

      <div
        className="prose animate-fade-up delay-2"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-16 border-t border-[var(--color-border)] pt-8">
        <a
          href={`https://github.com/tushaarmehtaa/tushar-skills/blob/main/${skill.slug}/SKILL.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          edit on github
        </a>
      </div>
    </article>
  );
}
