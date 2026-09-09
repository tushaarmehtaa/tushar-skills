import { EDITORIAL_GUIDES } from "@/lib/guides";
import { TrackedLink } from "./tracked-link";

export function LatestGuides({ skill }: { skill?: string }) {
  const guides = EDITORIAL_GUIDES.filter((guide) => !skill || guide.relatedSkills.some((slug) => slug === skill));
  if (!guides.length) return null;
  return (
    <section id={skill ? undefined : "guides"} aria-labelledby={skill ? "related-guides-heading" : "latest-guides-heading"} className="scroll-mt-8 border-t border-[var(--color-border)] py-10 sm:py-14">
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id={skill ? "related-guides-heading" : "latest-guides-heading"} className="text-xl font-semibold text-[var(--color-heading)]">{skill ? "Put this skill to work" : "Latest guides"}</h2>
        <p className="text-xs text-[var(--color-muted)]">Practical workflows, with the files to try them.</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
        {guides.map((guide) => (
          <article key={guide.slug} className="min-w-0">
            <p className="mb-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-widest text-[var(--color-muted)]">{guide.category} <span aria-hidden="true"> / </span> <time dateTime={guide.date}>09 Sep 2026</time></p>
            <TrackedLink href={`/guides/${guide.slug}`} eventName="guide_open" agent="all" skill={skill ?? guide.relatedSkills[0]} className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]">
              <h3 className="max-w-md text-xl font-medium leading-snug tracking-tight text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-accent)] sm:text-2xl">{guide.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--color-text)]">{guide.description}</p>
              <span className="mt-5 inline-block text-xs text-[var(--color-accent)]">Read the guide <span aria-hidden="true">→</span></span>
            </TrackedLink>
          </article>
        ))}
      </div>
    </section>
  );
}
