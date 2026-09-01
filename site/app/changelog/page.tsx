import Link from "next/link";
import { Header } from "@/components/header";
import { PageFrame } from "@/components/page-frame";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "changelog",
  description: "What's changed in slashskills — new skills, updates, and fixes.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "changelog — slashskills",
    description: "What's changed in slashskills — new skills, updates, and fixes.",
    url: "/changelog",
  },
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
    date: "2026-09-01",
    entries: [
      { type: "skill", text: "added /humanize for voice-preserving prose edits and evidence-based AI-pattern detection" },
      { type: "skill", text: "added /landing-page for evidence-led page architecture, proof selection, implementation, and conversion verification" },
      { type: "skill", text: "added /mobile-first for measured responsive audits and repairs across reflow, touch, zoom, focus, and reduced motion" },
      { type: "fix", text: "replaced missing references and universal layout or writing rules with complete packages, interactive decisions, primary sources, and behavioral evals" },
    ],
  },
  {
    date: "2026-08-08",
    entries: [
      { type: "update", text: "reconstructed all 30 skills with adaptive workflows, safety boundaries, concrete outputs, and outcome-level verification" },
      { type: "update", text: "replaced hidden standalone references, forced questionnaires, personal style presets, static prices, and stale provider patterns with conditional specialist guidance" },
      { type: "site", text: "skill pages now render every bundled reference and keep intra-package Markdown links on the correct file and heading" },
      { type: "fix", text: "hardened reference anchors, package links, source URLs, and JSON-LD rendering; added repository-wide quality and behavioral eval gates" },
    ],
  },
  {
    date: "2026-08-07",
    entries: [
      { type: "update", text: "refocused the catalog from 38 narrow packages to 30 outcome-driven skills with clear public names" },
      { type: "update", text: "merged search, outreach, AI cost, Dodo billing, product specification, fundraising, and launch workflows without dropping their detailed references" },
      { type: "update", text: "expanded AI development, analytics, experiments, agent instructions, UI copy, landing copy, social sharing, and demo video guidance" },
      { type: "fix", text: "removed the standalone file-upload package and synchronized routes, ZIPs, compatibility metadata, tests, and documentation" },
    ],
  },
  {
    date: "2026-07-21",
    entries: [
      { type: "site", text: "made Codex the primary local runtime across the installer, documentation, and site defaults" },
      { type: "site", text: "linked the footer to tushaarmehtaa.xyz" },
    ],
  },
  {
    date: "2026-07-17",
    entries: [
      { type: "update", text: "migrated the library to portable Agent Skills frontmatter with MIT licensing and a synchronized runtime catalog" },
      { type: "site", text: "added deterministic installers and setup guides for Claude Code, Codex, Cursor, and the capability-gated Claude app path" },
      { type: "fix", text: "corrected multi-file skill installs, runtime support labels, and misleading chat upload instructions for local coding workflows" },
    ],
  },
  {
    date: "2026-07-16",
    entries: [
      { type: "update", text: "rebuilt /remove-ai-slop with hard bans for unmistakable design and copy slop plus evidence-based contextual scoring" },
      { type: "update", text: "added rendered and cross-route convergence audits, page-role and UI-state checks, copy clustering, and claim provenance" },
      { type: "fix", text: "blocked or unverified copy can no longer be written into production as a generated replacement" },
    ],
  },
  {
    date: "2026-06-26",
    entries: [
      { type: "update", text: "rewrote aeo-ready as a full SEO + AEO skill — live site fetch, technical SEO layer, directory strategy, programmatic SEO check, web search for citations, implementation cadence, 90-point audit report" },
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

const TYPE_STYLES: Record<EntryType, { label: string; color: string }> = {
  skill:  { label: "new",    color: "text-[var(--color-accent)]" },
  update: { label: "update", color: "text-[#60a5fa]" },
  fix:    { label: "fix",    color: "text-[#a78bfa]" },
  site:   { label: "site",   color: "text-[var(--color-muted)]" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ChangelogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 px-6 py-12">
        <PageFrame>
          <div className="max-w-3xl">
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
            <h1 className="terminal-heading text-4xl font-semibold text-[var(--color-heading)] sm:text-5xl">
              changelog
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text)]">
              every skill added, updated, or fixed.
            </p>
          </div>

          <div className="relative space-y-10">
            {RELEASES.map((release) => (
              <div key={release.date} className="grid grid-cols-1 gap-3 sm:grid-cols-[9rem_1fr] sm:gap-6">
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
                          className={`mt-0.5 w-10 shrink-0 text-xs ${style.color}`}
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
            ))}
          </div>
          </div>
        </PageFrame>
      </main>
      <Footer />
    </div>
  );
}
