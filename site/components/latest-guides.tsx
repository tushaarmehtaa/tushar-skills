import { EDITORIAL_GUIDES } from "@/lib/guides";
import { TrackedLink } from "./tracked-link";

export function LatestGuides({ skill }: { skill?: string }) {
  const guides = EDITORIAL_GUIDES.filter((guide) => !skill || guide.relatedSkills.some((slug) => slug === skill));
  if (!guides.length) return null;
  return (
    <section id={skill ? undefined : "guides"} aria-labelledby={skill ? "related-guides-heading" : "latest-guides-heading"} className="scroll-mt-8 pb-10 pt-5 sm:pb-14">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={skill ? "related-guides-heading" : "latest-guides-heading"} className="text-xl font-semibold text-[var(--color-heading)]">{skill ? "Put this skill to work" : "Latest guides"}</h2>
        <p className="text-xs text-[var(--color-muted)]">Learn a workflow. Take the skill with you.</p>
      </div>
      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-lg border border-[var(--color-border)]">
        {guides.map((guide) => (
          <TrackedLink key={guide.slug} href={`/guides/${guide.slug}`} eventName="guide_open" agent="all" skill={skill ?? guide.relatedSkills[0]} className="group grid items-center gap-x-7 gap-y-2 bg-[var(--color-surface)] px-5 py-5 transition-colors hover:bg-[var(--color-surface-raised)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:grid-cols-[8rem_minmax(0,1fr)_2rem] sm:px-6 sm:py-6">
            <span className="text-[11px] text-[var(--color-muted)] sm:text-xs">{guide.category}</span>
            <div className="min-w-0">
              <h3 className="text-lg font-medium leading-snug tracking-tight text-[var(--color-heading)] group-hover:text-[var(--color-accent)] sm:text-xl">{guide.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">{guide.slug === "image-editing-skills" ? "Reference images, copyable edit prompts, and a reusable skill." : "Clearer instructions, fewer unnecessary stops, and a test plan."}</p>
            </div>
            <span aria-hidden="true" className="hidden text-xl text-[var(--color-accent)] sm:block">↗</span>
            <span className="mt-2 text-xs text-[var(--color-accent)] sm:hidden">Read guide →</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
