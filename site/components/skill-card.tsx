import Link from "next/link";
import { CopyButton } from "./copy-button";
import type { Skill } from "@/lib/skills";

const CATEGORY_STYLES: Record<string, { text: string; border: string; bg: string }> = {
  devops: { text: "text-[var(--color-orange)]", border: "border-[var(--color-orange)]/20", bg: "bg-[var(--color-orange)]/5" },
  ai: { text: "text-[var(--color-purple)]", border: "border-[var(--color-purple)]/20", bg: "bg-[var(--color-purple)]/5" },
  workflow: { text: "text-[var(--color-blue)]", border: "border-[var(--color-blue)]/20", bg: "bg-[var(--color-blue)]/5" },
  quality: { text: "text-[var(--color-yellow)]", border: "border-[var(--color-yellow)]/20", bg: "bg-[var(--color-yellow)]/5" },
};

export function SkillCard({
  skill,
  index,
}: {
  skill: Skill;
  index: number;
}) {
  const style = CATEGORY_STYLES[skill.category] || {
    text: "text-[var(--color-muted)]",
    border: "border-[var(--color-border)]",
    bg: "bg-[var(--color-surface)]",
  };

  return (
    <div
      className={`card-glow animate-fade-up delay-${index + 2} group flex flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 backdrop-blur-sm`}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <Link
            href={`/${skill.slug}`}
            className="font-[family-name:var(--font-mono)] text-xl font-bold text-[var(--color-heading)] transition-colors hover:text-[var(--color-accent)]"
          >
            /{skill.name}
          </Link>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${style.text} ${style.border} ${style.bg}`}
          >
            {skill.category}
          </span>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-[var(--color-text)]">
          {skill.description}
        </p>
      </div>

      {/* Install bar */}
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)] overflow-hidden">
        <span className="text-[var(--color-accent)] font-semibold shrink-0">$</span>
        <span className="truncate opacity-60">curl -sL .../{skill.slug}/SKILL.md</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <CopyButton text={skill.installCommand} />
        <Link
          href={`/${skill.slug}`}
          className="group/link flex items-center gap-1 text-xs font-medium text-[var(--color-muted)] transition-all hover:text-[var(--color-heading)]"
        >
          View docs
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover/link:translate-x-0.5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
