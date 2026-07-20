import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RuntimeLogo, RuntimeLogoTile } from "@/components/runtime-logo";
import { AGENTS, AGENT_IDS, CAPABILITY_LABELS, SUPPORT_LABELS } from "@/lib/agents";
import type { SupportStatus } from "@/lib/catalog";
import { getAllSkills } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Agent Skills compatibility",
  description: "Compare slashskills support, required capabilities, and surfaces across Claude Code, Codex, Cursor, and the Claude app.",
};

const STATUS_MARKS: Record<SupportStatus, string> = {
  tested: "text-emerald-300",
  untested: "text-amber-200",
  unsupported: "text-rose-300",
};

export default function CompatibilityPage() {
  const skills = getAllSkills();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1 px-6 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            href="/"
            className="back-link mb-10 -ml-3 inline-flex items-center gap-2 rounded px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-heading)]"
          >
            ← home
          </Link>

          <header className="animate-fade-up mb-12 max-w-4xl">
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-[var(--color-heading)] sm:text-6xl">
              Compatibility
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--color-text)] sm:text-lg">
              Compare runtime support and required access for every skill. Installation does not grant tools or permissions.
            </p>
          </header>

          <section className="mb-10 grid gap-3 md:grid-cols-3" aria-label="Coding agent guides">
            {AGENT_IDS.map((agentId) => (
              <Link
                key={agentId}
                href={AGENTS[agentId].guideRoute}
                className="group terminal-panel install-box flex items-start gap-3 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                <RuntimeLogoTile runtime={agentId} size="md" decorative />
                <div className="min-w-0 pt-0.5">
                  <p
                    translate="no"
                    className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-heading)]"
                  >
                    {AGENTS[agentId].label}
                  </p>
                  <p className="mt-1.5 break-words text-xs leading-relaxed text-[var(--color-muted)]">
                    {AGENTS[agentId].projectDirectory} · {AGENTS[agentId].invocation}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          <section className="mb-12 grid gap-4 border-y border-[var(--color-border)] py-7 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-medium text-emerald-300">Tested</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">Installed and exercised in that runtime using the representative workflow checks.</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-amber-200">Available</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">The package has a documented install path. Runtime verification is published when available.</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-rose-300">Unsupported</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">Intentionally tied to another runtime or incompatible with this one.</p>
            </div>
          </section>

          <section aria-labelledby="matrix-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="matrix-heading" className="text-lg font-medium text-[var(--color-heading)]">Skill compatibility</h2>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link href="/guides/claude-app" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
                  <RuntimeLogo runtime="claude-app" decorative className="h-3.5 w-3.5" />
                  <span>Claude app Skills →</span>
                </Link>
                <Link href="/guides/chatgpt" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
                  <RuntimeLogo runtime="chatgpt" decorative className="h-3.5 w-3.5" />
                  <span>ChatGPT Skills →</span>
                </Link>
              </div>
            </div>
            <p className="mb-2 text-xs text-[var(--color-muted)] sm:hidden">Swipe horizontally to compare runtimes.</p>
            <div
              role="region"
              aria-labelledby="matrix-heading"
              aria-label="Skill compatibility table. Scroll horizontally to compare runtimes."
              className="overflow-x-auto rounded border border-[var(--color-border)]"
            >
              <table className="w-full min-w-[58rem] border-collapse text-left">
                <thead className="bg-[var(--color-surface)] text-xs text-[var(--color-muted)]">
                  <tr>
                    <th className="sticky left-0 z-20 border-r border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 font-normal">skill</th>
                    {AGENT_IDS.map((agentId) => (
                      <th key={agentId} className="px-3 py-3 font-normal">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <RuntimeLogo runtime={agentId} decorative className="h-3.5 w-3.5" />
                          <span translate="no">{AGENTS[agentId].label}</span>
                        </span>
                      </th>
                    ))}
                    <th className="px-3 py-3 font-normal">surface</th>
                    <th className="px-3 py-3 font-normal">required access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {skills.map((skill) => (
                    <tr key={skill.slug} className="group bg-[var(--color-bg)] transition-colors hover:bg-[var(--color-surface)]">
                      <th className="sticky left-0 z-10 border-r border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-3 font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--color-heading)] transition-colors group-hover:bg-[var(--color-surface)]">
                        <Link href={`/${skill.slug}`} className="hover:text-[var(--color-accent)]">{skill.name}</Link>
                      </th>
                      {AGENT_IDS.map((agentId) => {
                        const status = skill.support[agentId];
                        return (
                          <td key={agentId} className={`px-3 py-3 font-[family-name:var(--font-mono)] text-[10px] ${STATUS_MARKS[status]}`}>
                            {SUPPORT_LABELS[status]}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text)]">
                        {skill.surfaces.includes("claude-app") ? "local + chat" : "local"}
                      </td>
                      <td className="px-3 py-3 text-xs text-[var(--color-muted)]">
                        {skill.capabilities.map((capability) => CAPABILITY_LABELS[capability]).join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12 border-l-2 border-[var(--color-accent)] bg-[var(--color-surface)] px-5 py-4">
            <h2 className="mb-2 text-base font-medium text-[var(--color-heading)]">Not included in v1</h2>
            <p className="text-sm leading-relaxed text-[var(--color-text)]">
              Copilot, Gemini, and OpenAI plugin packaging are outside v1. OpenAI support is local Codex Agent Skills only. Raw ZIP downloads remain available for inspection and complete multi-file transfer.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
