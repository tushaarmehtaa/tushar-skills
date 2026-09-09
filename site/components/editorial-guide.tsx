import type { Metadata } from "next";
import { GuideLayout } from "./guide-layout";
import { TrackedLink } from "./tracked-link";
import { renderMarkdown } from "@/lib/markdown";
import { serializeJsonLd } from "@/lib/json-ld";
import type { EditorialGuide as Guide } from "@/lib/guides";

export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title: guide.title, description: guide.description, images: [{ url: `/api/og?skill=${encodeURIComponent(guide.title)}&description=${encodeURIComponent(guide.description)}`, width: 1200, height: 630, alt: guide.title }], type: "article", url: `/guides/${guide.slug}`, publishedTime: guide.date, authors: ["Tushar Mehta"] },
  };
}

export function EditorialGuide({ guide, content }: { guide: Guide; content: string }) {
  const schema = { "@context": "https://schema.org", "@type": "TechArticle", headline: guide.title, description: guide.description, datePublished: `${guide.date}T00:00:00+05:30`, dateModified: `${guide.date}T00:00:00+05:30`, author: { "@type": "Person", name: "Tushar Mehta", url: "https://tushaarmehtaa.xyz" }, mainEntityOfPage: `https://www.slashskills.xyz/guides/${guide.slug}` };
  return (
    <GuideLayout title={guide.title} intro={guide.description}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-16">
        <article className="min-w-0">
          <p className="mb-8 border-y border-[var(--color-border)] py-4 text-xs text-[var(--color-muted)]">By Tushar Mehta · <time dateTime={guide.date}>9 September 2026</time> · Implementation recipe</p>
          <div className="prose min-w-0" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </article>
        <aside className="self-start border-t border-[var(--color-border)] pt-5 lg:sticky lg:top-8" aria-label="Use this guide">
          <p className="mb-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)]">Put it to work</p>
          <TrackedLink href={`/${guide.relatedSkills[0]}`} eventName="guide_skill_open" agent="all" skill={guide.relatedSkills[0]} className="block text-base font-medium text-[var(--color-accent)] hover:underline">{guide.action} →</TrackedLink>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">Requirements and installation commands for your coding agent.</p>
          <p className="mt-7 text-xs text-[var(--color-muted)]">Also useful</p>
          {guide.relatedSkills.slice(1).map((skill) => <TrackedLink key={skill} href={`/${skill}`} eventName="guide_skill_open" agent="all" skill={skill} className="mt-3 block text-sm text-[var(--color-text)] hover:text-[var(--color-accent)]">/{skill} →</TrackedLink>)}
          <a href="/#guides" className="mt-8 inline-block text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)]">← All latest guides</a>
        </aside>
      </div>
    </GuideLayout>
  );
}
