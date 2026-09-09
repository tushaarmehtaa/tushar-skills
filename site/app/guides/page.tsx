import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageFrame } from "@/components/page-frame";
import { LatestGuides } from "@/components/latest-guides";
import { AGENTS, AGENT_IDS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Guides",
  description: "Installation help and practical workflows for Agent Skills.",
  alternates: { canonical: "/guides" },
  // Navigation hub only; individual guides own indexable search destinations.
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  openGraph: { title: "Guides — slashskills", description: "Installation help and practical workflows for Agent Skills.", url: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 px-6 py-8 sm:py-12">
        <PageFrame>
          <Link href="/" className="mb-7 inline-flex min-h-11 items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">← All skills</Link>
          <header className="mb-10 max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-heading)] sm:text-5xl">Guides</h1>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text)]">Set up your agent and learn how to use the skills.</p>
          </header>
          <section aria-labelledby="installation-guides" className="mb-10 border-y border-[var(--color-border)] py-6">
            <h2 id="installation-guides" className="mb-4 text-lg font-medium text-[var(--color-heading)]">Installation</h2>
            <div className="flex flex-wrap gap-3">
              {AGENT_IDS.map((id) => <Link key={id} href={AGENTS[id].guideRoute} className="inline-flex min-h-11 items-center rounded border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">{AGENTS[id].label} →</Link>)}
              <Link href="/guides/chatgpt" className="inline-flex min-h-11 items-center rounded border border-[var(--color-border)] px-4 text-sm hover:text-[var(--color-accent)]">ChatGPT →</Link>
              <Link href="/guides/claude-app" className="inline-flex min-h-11 items-center rounded border border-[var(--color-border)] px-4 text-sm hover:text-[var(--color-accent)]">Claude app →</Link>
            </div>
          </section>
          <LatestGuides />
        </PageFrame>
      </main>
      <Footer />
    </div>
  );
}
