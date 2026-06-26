import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "changelog",
  description: "What's changed in tushar-skills — new skills, updates, and fixes.",
};

type EntryType = "skill" | "update" | "fix" | "site";

interface Entry {
  type: EntryType;
  text: string;
}

interface Release {
  date: string;
  entries: Entry[];
}

const RELEASES: Release[] = [
  {
    date: "2026-06-26",
    entries: [
      { type: "update", text: "renamed aeo-ready → search-ready" },
      { type: "update", text: "rewrote search-ready as a full SEO + AEO skill — live site fetch, technical SEO layer, directory strategy, programmatic SEO check, web search for citations, implementation cadence, 90-point audit report" },
    ],
  },
  {
    date: "2026-06-22",
    entries: [
      { type: "skill", text: "added /tushar-design" },
      { type: "site", text: "added full branding metadata — favicon, OG image, Twitter cards, web manifest" },
      { type: "fix", text: "favicon now uses Next.js file-based app/icon.svg instead of Vercel triangle" },
    ],
  },
  {
    date: "2026-06-20",
    entries: [
      { type: "skill", text: "added /app-copy, /product-brief, /decision-doc, /teardown, /debug-perf" },
      { type: "update", text: "improved cold-email, gtm-launch, model-audit, economics" },
      { type: "fix", text: "removed non-owned skills from the repo" },
    ],
  },
  {
    date: "2026-06-19",
    entries: [
      { type: "update", text: "rewrote model-audit with 2026 pricing tables, cache math, and batch API flags" },
      { type: "update", text: "updated cold-email with 2026 deliverability requirements and signal-based formula" },
      { type: "update", text: "updated aeo-ready with 2026 AEO research" },
      { type: "update", text: "updated gtm-launch with 2026 channel playbooks" },
      { type: "update", text: "updated cold-outreach-sequence with 2026 multichannel research" },
      { type: "update", text: "updated economics with 2026 model pricing, cache, and batch math" },
      { type: "update", text: "expanded /remove-ai-slop with deep research + interactive confirmation flow" },
      { type: "site", text: "animation polish pass" },
    ],
  },
  {
    date: "2026-06-16",
    entries: [
      { type: "skill", text: "added /remove-ai-slop" },
      { type: "skill", text: "added /pmarca and /pitch-vc" },
      { type: "update", text: "made 6 planning skills interactive" },
      { type: "site", text: "added logos to all skills in the table" },
      { type: "fix", text: "fixed zip downloads, README skill count, and missing skills" },
    ],
  },
  {
    date: "2026-06-08",
    entries: [
      { type: "skill", text: "added /gtm-launch" },
      { type: "site", text: "added Claude app zip download on each skill page" },
      { type: "update", text: "audited all 26 skill descriptions" },
      { type: "fix", text: "fixed zip download path resolution and external skill links" },
    ],
  },
  {
    date: "2026-03-22",
    entries: [
      { type: "site", text: "upgraded animations and design polish" },
      { type: "skill", text: "added /app-copy, /readme, /product-brief, /teardown, /decision-doc — 25 skills total" },
    ],
  },
  {
    date: "2026-03-15",
    entries: [
      { type: "skill", text: "added /remotion-video — 20 skills total" },
    ],
  },
  {
    date: "2026-03-08",
    entries: [
      { type: "skill", text: "added /ship-email, /og-image, /pricing-page, /cold-outreach-sequence, /dodo-webhook, /segment-users, /mvp-spec, /landing-copy, /make-skill + aeo-ready — 10 new skills" },
      { type: "update", text: "rewrote all 10 new skills to match consistent format" },
      { type: "update", text: "stripped AI slop from all skill openers" },
    ],
  },
  {
    date: "2026-03-07",
    entries: [
      { type: "skill", text: "added /wire-auth and /add-analytics — 9 skills total" },
    ],
  },
  {
    date: "2026-03-06",
    entries: [
      { type: "skill", text: "added /seo-ready and /ship-credits" },
      { type: "site", text: "redesigned frontend" },
    ],
  },
  {
    date: "2026-03-01",
    entries: [
      { type: "skill", text: "initial launch — /deploy-check, /model-audit, /economics, /changelog, /cold-email" },
      { type: "site", text: "slashskills frontend with Geist font system" },
    ],
  },
];

const TYPE_STYLES: Record<EntryType, { label: string; color: string; border: string }> = {
  skill:  { label: "new",    color: "text-[var(--color-accent)]",   border: "border-[var(--color-accent)]/30" },
  update: { label: "update", color: "text-[#60a5fa]",               border: "border-[#60a5fa]/30" },
  fix:    { label: "fix",    color: "text-[#a78bfa]",               border: "border-[#a78bfa]/30" },
  site:   { label: "site",   color: "text-[var(--color-muted)]",    border: "border-[var(--color-border)]" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ChangelogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="back-link mb-10 -ml-3 inline-flex items-center gap-2 rounded px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-heading)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            back
          </Link>

          <div className="animate-fade-up mb-12">
            <p className="terminal-caption mb-2 text-[var(--color-muted)]">history</p>
            <h1 className="terminal-heading text-4xl font-semibold text-[var(--color-heading)] sm:text-5xl">
              changelog
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
              every skill added, updated, or fixed.
            </p>
          </div>

          <div className="relative space-y-10">
            {RELEASES.map((release, i) => (
              <ScrollReveal key={release.date} delay={i * 50}>
                <div className="grid grid-cols-[7rem_1fr] gap-6 sm:grid-cols-[9rem_1fr]">
                  {/* Date */}
                  <div className="pt-0.5">
                    <time
                      dateTime={release.date}
                      className="font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-muted)]"
                    >
                      {formatDate(release.date)}
                    </time>
                  </div>

                  {/* Entries */}
                  <div className="terminal-panel divide-y divide-[var(--color-border)]">
                    {release.entries.map((entry, j) => {
                      const style = TYPE_STYLES[entry.type];
                      return (
                        <div key={j} className="flex items-start gap-3 px-4 py-3">
                          <span
                            className={`mt-0.5 shrink-0 border px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.12em] ${style.color} ${style.border}`}
                          >
                            {style.label}
                          </span>
                          <p className="text-sm leading-relaxed text-[var(--color-text)]">
                            {entry.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
