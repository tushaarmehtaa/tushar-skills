import { AgentTabs } from "./agent-tabs";
import { RuntimeLogo } from "./runtime-logo";
import { TrackedLink } from "./tracked-link";
import { createClaudeAppViewModel } from "@/lib/skill-presentation";
import { supportsChatGPT } from "@/lib/catalog";
import type { Skill } from "@/lib/skills";

export function SkillDetail({
  skill,
  contentHtml,
}: {
  skill: Skill;
  contentHtml: string;
}) {
  const claudeApp = createClaudeAppViewModel({
    surfaces: skill.surfaces,
    capabilities: skill.capabilities,
    support: skill.support,
  });
  const chatgptAvailable = supportsChatGPT(skill.surfaces);

  return (
    <article className="min-w-0">
      <div className="animate-fade-up mb-10">
        <h1 className="terminal-heading mb-4 break-words text-3xl font-semibold leading-tight text-[var(--color-heading)] sm:text-5xl">
          {skill.name}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-[var(--color-text)]">
          {skill.description}
        </p>

        <dl className="mt-6 grid gap-x-5 gap-y-3 border-t border-[var(--color-border)] pt-5 text-xs sm:grid-cols-[8rem_1fr]">
          <dt className="text-[var(--color-muted)]">Category</dt>
          <dd className="text-[var(--color-text)]">{skill.category}</dd>
          <dt className="text-[var(--color-muted)]">Package</dt>
          <dd className="break-all font-[family-name:var(--font-mono)] text-[var(--color-heading)]">{skill.slug}/SKILL.md</dd>
          <dt className="text-[var(--color-muted)]">License</dt>
          <dd className="text-[var(--color-text)]">{skill.license}</dd>
          <dt className="text-[var(--color-muted)]">Author</dt>
          <dd className="text-[var(--color-text)]">@{skill.author}</dd>
          {skill.compatibility ? (
            <>
              <dt className="text-[var(--color-muted)]">Compatibility</dt>
              <dd className="text-[var(--color-text)]">{skill.compatibility}</dd>
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
      </div>

      <AgentTabs slug={skill.slug} support={skill.support} capabilities={skill.capabilities} />

      <section
        data-claude-app={claudeApp.state}
        className="mb-12 overflow-hidden terminal-panel"
        aria-labelledby="claude-app-surface-heading"
      >
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <h2 id="claude-app-surface-heading" className="flex items-center gap-2 text-sm font-medium text-[var(--color-heading)]">
            {claudeApp.available ? (
              <RuntimeLogo runtime="claude-app" decorative className="h-3.5 w-3.5" />
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

      <section className="mb-12 overflow-hidden terminal-panel" aria-labelledby="chatgpt-surface-heading">
        <div className="border-b border-[var(--color-border)] px-4 py-3">
          <h2 id="chatgpt-surface-heading" className="text-sm font-medium text-[var(--color-heading)]">ChatGPT Skills</h2>
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
            {chatgptAvailable ? "ChatGPT upload guide →" : "Why local agent required →"}
          </TrackedLink>
        </div>
      </section>

      <div className="divider mb-10" />

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-[var(--color-heading)]">Instructions</h2>
          <span className="text-xs text-[var(--color-muted)]">Source: SKILL.md</span>
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

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
