import Link from "next/link";
import { SkillInstall } from "./brand/skill-install";
import { SkillRun } from "./brand/skill-run";
import { SkillIcon } from "./brand/skill-icon";
import { SourceReader } from "./source-reader";
import { PackageDisclosure } from "./package-disclosure";
import { RuntimeLogo } from "./runtime-logo";
import { TrackedLink } from "./tracked-link";
import { Clamp } from "./clamp";
import { LatestGuides } from "./latest-guides";
import { AGENTS, AGENT_IDS, CAPABILITY_LABELS } from "@/lib/agents";
import { supportsChatGPT } from "@/lib/catalog";
import { createClaudeAppViewModel } from "@/lib/skill-presentation";
import { githubFileUrl, packageFileAnchor } from "@/lib/markdown";
import { skillHref, SKILL_DISPLAY } from "@/lib/canvas";
import { GROUPS, GROUP_ORDER, formatDate, getHistory, getProfile, getProof, getResult } from "@/lib/profiles";
import type { Skill } from "@/lib/skills";

interface RenderedFile {
  path: string;
  lineCount: number;
  anchor: string;
  contentHtml: string;
  rawContent: string;
}

function dur(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`;
}

export function SkillDetail({
  skill,
  contentHtml,
  outputHtml,
  renderedFiles,
  installs = null,
  popular = false,
  next,
}: {
  skill: Skill;
  contentHtml: string;
  outputHtml: string;
  renderedFiles: RenderedFile[];
  installs?: number | null;
  popular?: boolean;
  next: { slug: string; outcome: string } | null;
}) {
  const profile = getProfile(skill.slug);
  const proof = getProof(skill.slug);
  const result = getResult(skill.slug);
  const history = getHistory(skill.slug);
  const group = GROUPS[profile.group];
  const verified = AGENT_IDS.filter((agent) => skill.support[agent] === "tested");
  const skillLines = skill.rawContent.split(/\r?\n/).length;
  const flow = SKILL_DISPLAY[skill.slug]?.flow;
  const order = (Object.keys(GROUP_ORDER) as (keyof typeof GROUP_ORDER)[]).flatMap((g) => GROUP_ORDER[g]);
  const i = order.indexOf(skill.slug);
  const prev = order[(i + order.length - 1) % order.length];
  const worksIn = [
    ...AGENT_IDS.filter((a) => skill.support[a] !== "unsupported").map((a) => AGENTS[a].label),
    ...(skill.surfaces.includes("claude-app") ? ["Claude app"] : []),
  ].join(", ");
  const pair = proof?.pair;
  const showPair = pair && pair.kind !== "screenshots" && pair.before.text && pair.after.text;
  const meta = proof
    ? [
        `${proof.run.agent} ${proof.run.version}`,
        dur(proof.run.durationSec),
        proof.run.filesChanged ? `${proof.run.filesChanged} ${proof.run.filesChanged === 1 ? "file" : "files"} changed` : "no files changed",
      ]
    : [];
  const imgs = proof?.images && (skill.slug === "landing-page" || skill.slug === "interface-design" || skill.slug === "image-editing" || skill.slug === "remove-ai-slop" || skill.slug === "mobile-first")
    ? { before: proof.images.before.replace("-mobile", ""), after: proof.images.after.replace("-mobile", "") }
    : null;

  return (
    <article className="sk-main">
      <div className="wrap">
        <nav aria-label="Breadcrumb">
          <Link className="v-crumb" href="/#skills">
            <b>[S]</b> skills / <span aria-current="page">{skill.slug}</span>
          </Link>
        </nav>
        <header className="skhead">
          <div className="skico"><SkillIcon slug={skill.slug} /></div>
          <div>
            <h1 className="sktitle">
              <span>/{skill.slug}</span>
              {skill.slug === "who-to-sell-to" && <span className="badge">NEW</span>}
              {popular && <span className="badge pop">POPULAR</span>}
            </h1>
            <p className="skout">{profile.outcome}</p>
            <div className="skmeta">
              <span>{group.label}</span>
              {flow && <><i>·</i><span>{flow}</span></>}
              {installs !== null && installs >= 20 && (
                <>
                  <i>·</i>
                  <a href={`https://www.skills.sh/tushaarmehtaa/tushar-skills/${skill.slug}`} target="_blank" rel="noopener noreferrer">{installs} installs</a>
                </>
              )}
              {verified.length > 0 && <><i>·</i><span>verified in {verified.map((a) => AGENTS[a].label).join(", ")}</span></>}
              <i>·</i><span>{skill.license}</span>
            </div>
          </div>
        </header>
        <div className="sk-install"><SkillInstall slug={skill.slug} support={skill.support} /></div>
      </div>

      {proof && result && (
        <section className="wrap sec" aria-labelledby="run-h">
          <h2 id="run-h">What you get back <span>{profile.proofTier === "run" ? "recorded run" : "contract tests"} · {formatDate(proof.run.date)}</span></h2>
          <div className="stage-wrap">
            <SkillRun
              slug={skill.slug}
              request={proof.request}
              headline={result.headline}
              chips={result.type === "screenshots" || result.type === "built" ? (result.chips ?? []) : []}
              meta={meta}
              images={imgs}
              reasons={skill.slug === "deploy-check" ? (result.reasons ?? []) : []}
              excerpt={proof.excerpt}
            />
          </div>
          {proof.caveat && <div className="caveat"><b>Caveat</b>{proof.caveat}</div>}
        </section>
      )}

      {proof?.table && (
        <section className="wrap sec" aria-labelledby="measured-h">
          <h2 id="measured-h">Measured <span>before → after</span></h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>{proof.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{proof.table.rows.map((r) => <tr key={r.join("|")}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {showPair && pair && (
        <section className="wrap sec" aria-labelledby="io-h">
          <h2 id="io-h">Input → output <span>from the run</span></h2>
          <div className="two">
            {[pair.before, pair.after].map((side) => (
              <div key={side.label}>
                <span className="lbl">{side.label}</span>
                <pre className="srcbox io">{side.text}</pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {!result && (
        <section className="wrap sec" aria-labelledby="get-back">
          <h2 id="get-back">What you get <span>from the skill&apos;s {profile.outputSource} section</span></h2>
          <div className="v-prose" dangerouslySetInnerHTML={{ __html: outputHtml }} />
          <p className="section-foot">
            {profile.proofTier === "contract"
              ? "No sample run here. This skill works against your own accounts or keys, so it runs on your project, not ours."
              : "No sample run on this page yet."}
          </p>
        </section>
      )}

      <section className="wrap sec" aria-labelledby="when-h">
        <h2 id="when-h">When to use it</h2>
        <div className="two">
          <div><span className="lbl">Use when</span><p>{profile.useWhen}</p></div>
          <div><span className="lbl">Skip it when</span><p>{profile.skipWhen}</p></div>
        </div>
        <blockquote className="why"><span className="lbl">The thinking behind it</span><p>{profile.why}</p></blockquote>
      </section>

      {result && (
        <section className="wrap sec" aria-labelledby="contract-h">
          <h2 id="contract-h">Output contract <span>from the skill&apos;s {profile.outputSource} section</span></h2>
          <div className="v-prose" dangerouslySetInnerHTML={{ __html: outputHtml }} />
        </section>
      )}

      <section className="wrap sec" aria-labelledby="checks-h">
        <h2 id="checks-h">How it checks its own work <span>from the instructions</span></h2>
        <div className="v-prose">
          <ul>{profile.checks.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="req-h">
        <h2 id="req-h">Requirements <span>what it needs</span></h2>
        <dl className="kv">
          <dt>Works in</dt><dd>{worksIn}</dd>
          <dt>Needs</dt><dd>{skill.capabilities.map((c) => CAPABILITY_LABELS[c]).join(", ") || "Nothing beyond the agent"}</dd>
          {skill.compatibility && (<><dt>Compatibility</dt><dd>{skill.compatibility}</dd></>)}
        </dl>
      </section>

      <section className="wrap sec" aria-labelledby="src-h">
        <h2 id="src-h">The instructions <span>SKILL.md · {skillLines} lines</span></h2>
        <Clamp label="Read the full skill">
          <SourceReader
            license={skill.license}
            files={[
              { path: "SKILL.md", anchor: packageFileAnchor("SKILL.md"), contentHtml, rawContent: skill.rawContent, sourceUrl: githubFileUrl(skill.slug, "SKILL.md") },
              ...renderedFiles.map((file) => ({ ...file, sourceUrl: githubFileUrl(skill.slug, file.path) })),
            ]}
          />
        </Clamp>
      </section>

      <div className="wrap sec"><LatestGuides skill={skill.slug} /></div>
      <div className="wrap sec"><OtherPlatforms skill={skill} /></div>

      <div className="wrap sec">
        <PackageDisclosure>
          <dl className="package-facts">
            <dt>Package</dt><dd className="mono">{skill.slug}/SKILL.md</dd>
            <dt>Author</dt><dd>@{skill.author}</dd>
            {history && (<><dt>Added</dt><dd>{formatDate(history.added)}</dd></>)}
            {skill.compatibility && (<><dt>Compatibility</dt><dd>{skill.compatibility}</dd></>)}
            <dt>Tags</dt>
            <dd className="tags">{skill.tags.map((tag) => <span key={tag}>{tag}</span>)}</dd>
          </dl>
        </PackageDisclosure>
      </div>

      <section className="wrap sec" aria-label="More skills">
        <div className="nextrow">
          <Link href={skillHref(prev)}>
            <span className="ico"><SkillIcon slug={prev} /></span>
            <div><small>← previous</small><b>/{prev}</b></div>
          </Link>
          {next && (
            <Link href={skillHref(next.slug)}>
              <div><small>next in {group.label} →</small><b>/{next.slug}</b></div>
              <span className="ico"><SkillIcon slug={next.slug} /></span>
            </Link>
          )}
        </div>
      </section>
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
