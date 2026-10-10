import Link from "next/link";
import { InstallBox } from "./install-box";
import { SourceReader } from "./source-reader";
import { PackageDisclosure } from "./package-disclosure";
import { RuntimeLogo } from "./runtime-logo";
import { TrackedLink } from "./tracked-link";
import { Clamp } from "./clamp";
import { Crumb } from "./crumb";
import { LatestGuides } from "./latest-guides";
import { ResultCard } from "./result-card";
import { AGENTS, AGENT_IDS, CAPABILITY_LABELS } from "@/lib/agents";
import { supportsChatGPT } from "@/lib/catalog";
import { createClaudeAppViewModel } from "@/lib/skill-presentation";
import { formatInstalls } from "@/lib/installs";
import { githubFileUrl, packageFileAnchor } from "@/lib/markdown";
import { skillHref } from "@/lib/canvas";
import {
  GROUPS,
  formatDate,
  getHistory,
  getProfile,
  getProof,
  getResult,
} from "@/lib/profiles";
import type { Skill } from "@/lib/skills";

interface RenderedFile {
  path: string;
  lineCount: number;
  anchor: string;
  contentHtml: string;
  rawContent: string;
}

export function SkillDetail({
  skill,
  contentHtml,
  outputHtml,
  renderedFiles,
  installs = null,
  next,
}: {
  skill: Skill;
  contentHtml: string;
  outputHtml: string;
  renderedFiles: RenderedFile[];
  installs?: number | null;
  next: { slug: string; outcome: string } | null;
}) {
  const profile = getProfile(skill.slug);
  const proof = getProof(skill.slug);
  const result = getResult(skill.slug);
  const history = getHistory(skill.slug);
  const group = GROUPS[profile.group];
  const verified = AGENT_IDS.filter((agent) => skill.support[agent] === "tested");
  const skillLines = skill.rawContent.split(/\r?\n/).length;

  return (
    <article className="skill">
      <div className="skill-layout">
        <div className="skill-main">
          <Crumb items={[{ label: "Skills", href: "/" }, { label: group.label, href: `/?group=${profile.group}` }, { label: skill.slug }]} />
          <h1 className="skill-name">/{skill.slug}</h1>
          {verified.length > 0 && (
            <p className="verified-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="m5 12 5 5L20 7" />
              </svg>
              Verified in {verified.map((a) => AGENTS[a].label).join(", ")}
            </p>
          )}
          <p className="skill-lead">{profile.outcome}</p>
          <p className="skill-skip">{profile.skipWhen}</p>
          <blockquote className="skill-why">
            <p>{profile.why}</p>
            <footer>The thinking behind it</footer>
          </blockquote>
          <InstallBox slug={skill.slug} support={skill.support} />
        </div>

        <aside className="facts" aria-label="Facts">
          <h2>Facts</h2>
          <dl>
            {installs !== null && installs > 0 && (
              <div>
                <dt>Installs</dt>
                <dd>
                  <a href={`https://www.skills.sh/tushaarmehtaa/tushar-skills/${skill.slug}`} target="_blank" rel="noopener noreferrer">
                    {formatInstalls(installs)} via skills.sh
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt>Works in</dt>
              <dd>
                {[
                  ...AGENT_IDS.filter((a) => skill.support[a] !== "unsupported").map((a) => AGENTS[a].label),
                  ...(skill.surfaces.includes("claude-app") ? ["Claude app"] : []),
                ].join(", ")}
              </dd>
            </div>
            <div>
              <dt>Needs</dt>
              <dd>{skill.capabilities.map((c) => CAPABILITY_LABELS[c]).join(", ") || "Nothing beyond the agent"}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                <a href={githubFileUrl(skill.slug, "SKILL.md")} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="skill-section" aria-labelledby="get-back">
        <div className="section-head">
          <h2 id="get-back">What you get back</h2>
          <span className="section-note">{result ? "From a real run on a sample project" : `From the skill's ${profile.outputSource} section`}</span>
        </div>
        {result ? (
          <ResultCard slug={skill.slug} result={result} images={proof?.images} still={proof?.still} />
        ) : (
          <>
            <div className="contract prose" dangerouslySetInnerHTML={{ __html: outputHtml }} />
            <p className="section-foot">
              {profile.proofTier === "contract"
                ? "No sample run here. This skill works against your own accounts or keys, so it runs on your project, not ours."
                : "No sample run on this page yet."}
            </p>
          </>
        )}
      </section>

      <section className="skill-section" aria-labelledby="checks">
        <div className="section-head">
          <h2 id="checks">How it checks its own work</h2>
          <span className="section-note">From the skill's instructions</span>
        </div>
        <ul className="checks">
          {profile.checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </section>

      <section className="skill-section" aria-labelledby="instructions">
        <div className="section-head">
          <h2 id="instructions">The instructions</h2>
          <span className="section-note mono">SKILL.md · {skillLines} lines</span>
        </div>
        <Clamp label="Read the full skill">
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
              ...renderedFiles.map((file) => ({ ...file, sourceUrl: githubFileUrl(skill.slug, file.path) })),
            ]}
          />
        </Clamp>
      </section>

      <LatestGuides skill={skill.slug} />

      <OtherPlatforms skill={skill} />

      <PackageDisclosure>
        <dl className="package-facts">
          <dt>Package</dt>
          <dd className="mono">{skill.slug}/SKILL.md</dd>
          <dt>Author</dt>
          <dd>@{skill.author}</dd>
          {history && (
            <>
              <dt>Added</dt>
              <dd>{formatDate(history.added)}</dd>
            </>
          )}
          {skill.compatibility && (
            <>
              <dt>Compatibility</dt>
              <dd>{skill.compatibility}</dd>
            </>
          )}
          <dt>Tags</dt>
          <dd className="tags">
            {skill.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </dd>
        </dl>
      </PackageDisclosure>

      {next && (
        <Link href={skillHref(next.slug)} className="next-skill">
          <span className="next-label">Next in {group.label}</span>
          <span className="next-name">/{next.slug}</span>
          <span className="next-outcome">{next.outcome}</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </article>
  );
}

function OtherPlatforms({ skill }: { skill: Skill }) {
  const claudeApp = createClaudeAppViewModel({ surfaces: skill.surfaces, capabilities: skill.capabilities, support: skill.support });
  const chatgpt = supportsChatGPT(skill.surfaces);
  return (
    <details className="platforms">
      <summary>Claude app, ChatGPT and ZIP download</summary>
      <div className="platforms-body">
        <section data-claude-app={claudeApp.state} aria-labelledby="claude-app-surface-heading">
          <h3 id="claude-app-surface-heading">
            {claudeApp.available && <RuntimeLogo runtime="claude-app" decorative className="h-3.5 w-3.5" />}
            {claudeApp.heading}
          </h3>
          <p>{claudeApp.description}</p>
          <div className="platform-links">
            <TrackedLink href={`/zips/${skill.slug}.zip`} download={`${skill.slug}.zip`} eventName="zip_download" agent={claudeApp.analyticsAgent} skill={skill.slug}>
              {claudeApp.downloadLabel}
            </TrackedLink>
            {claudeApp.showUploadInstructions && (
              <TrackedLink href="/guides/claude-app" eventName="guide_open" agent="claude-app" skill={skill.slug}>
                Upload guide →
              </TrackedLink>
            )}
          </div>
        </section>
        <section aria-labelledby="chatgpt-surface-heading">
          <h3 id="chatgpt-surface-heading">ChatGPT Skills</h3>
          <p>
            {chatgpt
              ? "This workflow is suitable for ChatGPT Skills. ChatGPT does not document the same upload archive format as Claude, so follow its uploader instead of reusing the Claude ZIP."
              : "This workflow needs a local coding environment or capabilities that a chat-only Skills upload does not provide."}
          </p>
          <div className="platform-links">
            <TrackedLink href="/guides/chatgpt" eventName="guide_open" agent="chatgpt" skill={skill.slug}>
              {chatgpt ? "ChatGPT upload guide →" : "Why local agent required →"}
            </TrackedLink>
          </div>
        </section>
      </div>
    </details>
  );
}
