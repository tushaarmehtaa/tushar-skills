import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";
import { PageFrame } from "./page-frame";
import { GuideCode } from "./guide-code";
import { TrackedLink } from "./tracked-link";
import { renderMarkdown } from "@/lib/markdown";
import { serializeJsonLd } from "@/lib/json-ld";
import type { EditorialGuide as Guide } from "@/lib/guides";

export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title, description: guide.description,
      images: [{ url: `/api/og?skill=${encodeURIComponent(guide.title)}&description=${encodeURIComponent(guide.description)}`, width: 1200, height: 630, alt: guide.title }],
      type: "article", url: `/guides/${guide.slug}`, publishedTime: guide.date, authors: ["Tushar Mehta"],
    },
  };
}

export function EditorialGuide({ guide, content }: { guide: Guide; content: string }) {
  const html = renderMarkdown(content);
  const headings = Array.from(html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g), (match) => ({ id: match[1], text: match[2].replace(/<[^>]+>/g, "") }));
  const blocks = html.split(/(<pre><code(?: class="[^"]*")?>[\s\S]*?<\/code><\/pre>)/g);
  const minutes = Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
  const schema = {
    "@context": "https://schema.org", "@type": "TechArticle",
    headline: guide.title, description: guide.description,
    datePublished: `${guide.date}T00:00:00+05:30`, dateModified: "2026-09-09T00:00:00+05:30",
    author: { "@type": "Person", name: "Tushar Mehta", url: "https://tushaarmehtaa.xyz" },
    mainEntityOfPage: `https://www.slashskills.xyz/guides/${guide.slug}`,
  };
  const contents = (
    <ol className="guide-contents-list">
      {headings.map((heading, index) => <li key={heading.id}><a href={`#${heading.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{heading.text}</a></li>)}
    </ol>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <main id="main-content" className="flex-1 px-6 pb-16 pt-8 sm:pt-12">
        <PageFrame>
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <Link href="/#guides" className="inline-flex min-h-11 items-center hover:text-[var(--color-accent)]">← Guides</Link>
            <span aria-hidden="true">/</span><span>{guide.category}</span>
          </nav>
          <header className="max-w-3xl">
            <p className="mb-4 text-xs text-[var(--color-muted)]">Tushar Mehta <span aria-hidden="true"> · </span><time dateTime={guide.date}>9 Sep 2026</time><span aria-hidden="true"> · </span>{minutes} min read</p>
            <h1 className="text-[2.25rem] font-semibold leading-[1.13] tracking-[-0.04em] text-[var(--color-heading)] sm:text-[3.5rem]">{guide.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text)] sm:text-lg">{guide.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <TrackedLink href={`/${guide.relatedSkills[0]}`} eventName="guide_skill_open" agent="all" skill={guide.relatedSkills[0]} className="guide-primary-action">{guide.action}<span aria-hidden="true">↗</span></TrackedLink>
              <a href={`#${headings[0]?.id ?? "guide-body"}`} className="inline-flex min-h-11 items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-heading)]">Read the guide ↓</a>
            </div>
          </header>
          <div className="mt-10 grid min-w-0 gap-10 border-t border-[var(--color-border)] pt-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-16 lg:pt-10">
            <div className="min-w-0">
              <details className="guide-mobile-contents mb-8 lg:hidden">
                <summary>In this guide <span>{headings.length} sections</span></summary>
                <nav aria-label="Guide contents">{contents}</nav>
              </details>
              <article id="guide-body" className="guide-prose prose">
                {blocks.map((block, index) => {
                  const example = block.match(/^<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>$/);
                  return example ? <GuideCode key={index} html={example[2]} language={example[1] ?? "text"} /> : <div key={index} dangerouslySetInnerHTML={{ __html: block }} />;
                })}
              </article>
              <section className="mt-12 border-t border-[var(--color-border)] pt-8" aria-label="Next step">
                <p className="mb-2 text-xs text-[var(--color-muted)]">Next step</p>
                <h2 className="mb-3 text-2xl font-medium text-[var(--color-heading)]">Make it part of your workflow.</h2>
                <p className="mb-5 text-sm text-[var(--color-text)]">The skill includes the instructions and references. Check the required tools before installing.</p>
                <TrackedLink href={`/${guide.relatedSkills[0]}`} eventName="guide_skill_open" agent="all" skill={guide.relatedSkills[0]} className="guide-primary-action">View /{guide.relatedSkills[0]}<span aria-hidden="true">→</span></TrackedLink>
              </section>
            </div>
            <aside className="hidden self-start lg:sticky lg:top-8 lg:block" aria-label="On this page">
              <p className="mb-3 text-xs font-medium text-[var(--color-muted)]">IN THIS GUIDE</p>
              <nav aria-label="Guide contents">{contents}</nav>
              <div className="mt-8 border-t border-[var(--color-border)] pt-5">
                <p className="text-xs text-[var(--color-muted)]">Related skills</p>
                {guide.relatedSkills.map((skill) => <TrackedLink key={skill} href={`/${skill}`} eventName="guide_skill_open" agent="all" skill={skill} className="mt-1 flex min-h-11 items-center text-sm text-[var(--color-text)] hover:text-[var(--color-accent)]">/{skill} →</TrackedLink>)}
              </div>
            </aside>
          </div>
        </PageFrame>
      </main>
      <Footer />
    </div>
  );
}
