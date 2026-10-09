import { SkillVisual } from "./skill-visual";
import { formatInstalls } from "@/lib/installs";
import { SourceReader } from "./source-reader";
import { PackageDisclosure } from "./package-disclosure";
import { LatestGuides } from "./latest-guides";
import { InstallPanel } from "./install-panel";
import { CopyButton } from "./copy-button";
import { SKILL_DISPLAY, TASK_TITLES } from "@/lib/canvas";
import { RuntimeLogo } from "./runtime-logo";
import { TrackedLink } from "./tracked-link";
import { createClaudeAppViewModel } from "@/lib/skill-presentation";
import { CAPABILITY_LABELS } from "@/lib/agents";
import { supportsChatGPT } from "@/lib/catalog";
import type { Skill } from "@/lib/skills";
import { githubFileUrl, packageFileAnchor } from "@/lib/markdown";

export function SkillDetail({
  skill,
  contentHtml,
  renderedFiles,
  installs = null,
}: {
  skill: Skill;
  contentHtml: string;
  installs?: number | null;
  renderedFiles: Array<{
    path: string;
    lineCount: number;
    anchor: string;
    contentHtml: string;
    rawContent: string;
  }>;
}) {
  const claudeApp = createClaudeAppViewModel({
    surfaces: skill.surfaces,
    capabilities: skill.capabilities,
    support: skill.support,
  });
  const chatgptAvailable = supportsChatGPT(skill.surfaces);

  return (
    <article className="min-w-0 skill-page">
      <div className="skill-overview" id="overview">
        <div className="skill-intro">
          <div className="skill-title-block">
            <div className="skill-pill-row">
              <span className="skill-pill">{skill.slug}</span>
              {installs !== null && installs > 0 && (
                <a
                  className="skill-pill skill-pill-installs"
                  href={`https://www.skills.sh/tushaarmehtaa/tushar-skills/${skill.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Installs tracked by skills.sh"
                >
                  <span className="tabular-nums">{formatInstalls(installs)}</span> installs
                </a>
              )}
            </div>
            <h1 className="terminal-heading mb-4 break-words text-3xl font-semibold leading-tight text-[var(--color-heading)] sm:text-5xl">
              {TASK_TITLES[skill.slug] ?? skill.name}
            </h1>
            <p className="intro-description">
              {SKILL_DISPLAY[skill.slug]?.summary ?? skill.description.split(/\s+Use when\b/)[0]}
            </p>

          </div>

        </div>
        <InstallPanel
          slug={skill.slug}
          support={skill.support}
          capabilities={skill.capabilities}
        />
        <figure className="skill-outcome">
          <SkillVisual slug={skill.slug} detail />
          <figcaption>Illustrative concept · Your brief sets the direction.</figcaption>
          <div className="outcome-requirements">            <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
              {skill.slug === "image-editing"
                ? "Requires an image-editing tool or configured API and your reference images. Model access is separate."
                : skill.surfaces.includes("coding-agent")
                  ? `Needs a coding agent. Required tools: ${skill.capabilities.map((capability) => CAPABILITY_LABELS[capability]).join(", ") || "none beyond the agent"}.`
                  : null}
            </p>

          <p className="skill-provenance">
            By {skill.author} · {skill.license} license ·{" "}
            {skill.surfaces.includes("claude-app")
              ? "Local + chat"
              : "Local agent"}
          </p>
          <nav className="skill-section-links" aria-label="Skill sections">
            <a href="#overview">Overview</a>
            <a href="#package-skill-md">Instructions</a>
            <a href="#package-details">Package details</a>
          </nav></div>
        </figure>
      </div>
      <div className="skill-explanation">
          <section>
            <h2>When it’s useful</h2>
            <p>
              {skill.description.includes("Use when")
                ? "Use this when " +
                  skill.description.split("Use when")[1].trim()
                : skill.description}
            </p>
          </section>
          {skill.slug === "interface-design" && (
            <div className="skill-steps">
              {[
                [
                  "01 · Understand",
                  "Clarify the task, audience and constraints.",
                ],
                [
                  "02 · Structure",
                  "Shape the layout, visual system and interaction states.",
                ],
                [
                  "03 · Check",
                  "Build and check the result across screen sizes.",
                ],
              ].map(([title, body]) => (
                <div key={title} className="skill-step">
                  <strong>{title}</strong>
                  {body}
                </div>
              ))}
            </div>
          )}

          {skill.slug === "interface-design" ? (
            <section className="starter-prompt">
              <h2 className="text-sm font-medium text-[var(--color-heading)]">
                Try asking
              </h2>
              <p className="mt-3 text-sm leading-relaxed">
                “Redesign this dashboard so I can find overdue tasks quickly.
                Keep our existing components and check the mobile layout.”
              </p>
              <CopyButton
                text="Redesign this dashboard so I can find overdue tasks quickly. Keep our existing components and check the mobile layout."
                label="Copy starting prompt"
                className="mt-4"
              />
            </section>
          ) : null}
      </div>
      <details className="platform-disclosure mb-8 border-y border-[var(--color-border)]">
        <summary className="cursor-pointer text-sm text-[var(--color-heading)]">
          Other platforms and downloads
        </summary>
        <div className="pt-5">
          <section
            data-claude-app={claudeApp.state}
            className="mb-12 overflow-hidden terminal-panel"
            aria-labelledby="claude-app-surface-heading"
          >
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <h2
                id="claude-app-surface-heading"
                className="flex items-center gap-2 text-sm font-medium text-[var(--color-heading)]"
              >
                {claudeApp.available ? (
                  <RuntimeLogo
                    runtime="claude-app"
                    decorative
                    className="h-3.5 w-3.5"
                  />
                ) : null}
                <span>{claudeApp.heading}</span>
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text)]">
                {claudeApp.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <TrackedLink
                  href={`/zips/${skill.slug}.zip`}
                  download={`${skill.slug}.zip`}
                  eventName="zip_download"
                  agent={claudeApp.analyticsAgent}
                  skill={skill.slug}
                  className={`inline-flex items-center gap-2 rounded border border-[var(--color-border)] px-3 py-2 font-[family-name:var(--font-mono)] text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
                    claudeApp.available
                      ? "text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-raised)]"
                      : "text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-heading)]"
                  }`}
                >
                  {claudeApp.downloadLabel}
                </TrackedLink>
                {claudeApp.showUploadInstructions ? (
                  <TrackedLink
                    href="/guides/claude-app"
                    eventName="guide_open"
                    agent="claude-app"
                    skill={skill.slug}
                    className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    Upload guide →
                  </TrackedLink>
                ) : null}
              </div>
            </div>
          </section>

          <section
            className="mb-12 overflow-hidden terminal-panel"
            aria-labelledby="chatgpt-surface-heading"
          >
            <div className="border-b border-[var(--color-border)] px-4 py-3">
              <h2
                id="chatgpt-surface-heading"
                className="text-sm font-medium text-[var(--color-heading)]"
              >
                ChatGPT Skills
              </h2>
            </div>
            <div className="p-4 sm:p-5">
              <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-text)]">
                {chatgptAvailable
                  ? "This workflow is suitable for ChatGPT Skills. ChatGPT does not document the same upload archive format as Claude, so follow its uploader instead of reusing the Claude ZIP."
                  : "This workflow needs a local coding environment or capabilities that a chat-only Skills upload does not provide."}
              </p>
              <TrackedLink
                href="/guides/chatgpt"
                eventName="guide_open"
                agent="chatgpt"
                skill={skill.slug}
                className="mt-4 inline-flex min-h-11 items-center font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                {chatgptAvailable
                  ? "ChatGPT upload guide →"
                  : "Why local agent required →"}
              </TrackedLink>
            </div>
          </section>
        </div>
      </details>

      <PackageDisclosure>
        <dl className="mt-6 grid gap-x-5 gap-y-3 border-t border-[var(--color-border)] pt-5 text-xs sm:grid-cols-[8rem_1fr]">
          <dt className="text-[var(--color-muted)]">Category</dt>
          <dd className="text-[var(--color-text)]">{skill.category}</dd>
          <dt className="text-[var(--color-muted)]">Package</dt>
          <dd className="break-all font-[family-name:var(--font-mono)] text-[var(--color-heading)]">
            {skill.slug}/SKILL.md
          </dd>
          <dt className="text-[var(--color-muted)]">License</dt>
          <dd className="text-[var(--color-text)]">{skill.license}</dd>
          <dt className="text-[var(--color-muted)]">Author</dt>
          <dd className="text-[var(--color-text)]">@{skill.author}</dd>
          {skill.compatibility ? (
            <>
              <dt className="text-[var(--color-muted)]">Compatibility</dt>
              <dd className="text-[var(--color-text)]">
                {skill.compatibility}
              </dd>
            </>
          ) : null}
          <dt className="text-[var(--color-muted)]">Tags</dt>
          <dd className="flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="tag border border-[var(--color-border)] px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
              >
                {tag}
              </span>
            ))}
          </dd>
        </dl>
      </PackageDisclosure>
      <LatestGuides skill={skill.slug} />
      <SourceReader
        license={skill.license}
        files={[
          {
            path: "SKILL.md",
            anchor: packageFileAnchor("SKILL.md"),
            contentHtml,
            rawContent: skill.rawContent,
            sourceUrl: githubFileUrl(skill.slug, "SKILL.md"),
          },
          ...renderedFiles.map((file) => ({
            ...file,
            sourceUrl: githubFileUrl(skill.slug, file.path),
          })),
        ]}
      />

      <div className="mt-16 border-t border-[var(--color-border)] pt-8">
        <a
          href={`https://github.com/tushaarmehtaa/tushar-skills/blob/main/${skill.slug}/SKILL.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          edit source on GitHub ↗
        </a>
      </div>
    </article>
  );
}
