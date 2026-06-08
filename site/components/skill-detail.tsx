"use client";

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
    <article className="min-w-0">
      <div className="mb-10 animate-fade-up terminal-panel p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="terminal-meta">manual page</span>
          <span className="terminal-caption terminal-status">
            {skill.category}
          </span>
        </div>

        <h1 className="terminal-heading mb-4 text-3xl font-semibold leading-tight text-[var(--color-heading)] sm:text-5xl">
          <span className="text-[var(--color-accent)]">man </span>/{skill.name}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--color-text)]">
          {skill.description}
        </p>

        <div className="mt-6 grid gap-3 border-t border-[var(--color-border)] pt-5 font-[family-name:var(--font-mono)] text-xs sm:grid-cols-[8rem_1fr]">
          <span className="uppercase tracking-[0.14em] text-[var(--color-muted)]">
            command
          </span>
          <span className="text-[var(--color-heading)]">/{skill.name}</span>
          <span className="uppercase tracking-[0.14em] text-[var(--color-muted)]">
            category
          </span>
          <span className="text-[var(--color-info)]">{skill.category}</span>
          <span className="uppercase tracking-[0.14em] text-[var(--color-muted)]">
            tags
          </span>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="tag border border-[var(--color-border)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Install */}
      <div className="animate-fade-up delay-1 mb-6 overflow-hidden terminal-panel">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
          <span className="terminal-caption">
            Claude Code install
          </span>
          <CopyButton text={skill.installCommand} label="copy" />
        </div>
        <div className="p-4">
          <div className="grid min-w-0 grid-cols-[auto_1fr_auto] items-start gap-3 font-[family-name:var(--font-mono)] text-xs sm:text-sm">
            <span className="select-none text-[var(--color-accent)]">$</span>
            <code className="block min-w-0 whitespace-normal break-all leading-relaxed text-[var(--color-heading)]">
              {skill.installCommand}
            </code>
            <span className="cursor-blink hidden sm:inline" />
          </div>
        </div>
      </div>

      <div className="animate-fade-up delay-1 mb-12 overflow-hidden terminal-panel">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
          <span className="terminal-caption">
            Claude app (web, desktop, mobile)
          </span>
        </div>
        <div className="p-4">
          <p className="mb-4 text-sm leading-relaxed text-[var(--color-text)]">
            Download the skill as a zip file, then upload it in Claude.
          </p>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = `/api/download-skill?skill=${skill.slug}`;
              link.download = `${skill.slug}.zip`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="inline-flex items-center gap-2 rounded px-3 py-2 font-[family-name:var(--font-mono)] text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] active:opacity-80"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            download zip
          </button>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">
            Then open Claude, go to <span className="font-semibold">Customize &gt; Skills</span>, upload the zip, and enable it.
          </p>
        </div>
      </div>

      <div className="divider mb-10" />

      <div className="animate-fade-up delay-2">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="terminal-caption text-[var(--color-heading)]">
            skill instructions
          </h2>
          <span className="terminal-caption">
            source: skill.md
          </span>
        </div>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>

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
