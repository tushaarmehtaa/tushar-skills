# DevDay newsroom review — 2026-09-30

Supplemental active-session review of the September 29 event, not a replacement for the unattended daily scout or a full ecosystem sweep.

## Initial decision

Recommend publishing the existing `/guides/chatgpt` update now: a concrete plugin packaging recipe with a checked `decision-doc` example, package layout, source links and sharing boundaries. Preserve runtime status as untested. This is one useful publication with zero new URLs. The complete event ledger lives in [the DevDay brief](../research/2026-09-29-openai-devday.md).

## Evidence created

The [builder](../experiments/devday-skill-plugin/build.mjs) generated a fresh package. Its manifest passed the official Agent Plugins 1.0.0 JSON Schema; copied SKILL.md bytes matched the original; the repository skill checker found zero errors or warnings. [Results](../experiments/devday-skill-plugin/results.json) and [runtime experiment cases](../experiments/devday-skill-plugin/README.md) are retained. These observations establish structure, not host behavior.

## Verified sources and permitted claims

- [Build skills](https://developers.openai.com/plugins/build/skills): an instructions-only workflow can be packaged without MCP. No need to build a server for decision records from supplied context.
- [Package plugins](https://developers.openai.com/plugins/build/plugins): root portable manifest and skills directory; local testing, workspace publication and public submission are distinct distribution paths.
- [Skills in ChatGPT](https://help.openai.com/en/articles/20001066-skills-in-chatgpt): workspace sharing and access remain subject to eligibility and administrator settings.
- [MCP Events integration](https://developers.openai.com/plugins/build/mcp-events): protocol 2026-07-28 prerequisite; webhook delivery; receipt acknowledgment differs from task completion. Polling/streaming and gap/terminated controls are unsupported by this integration.
- [Triggers and Events working group](https://modelcontextprotocol.io/community/working-groups/triggers-events) and [design sketch](https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md): proposal status must remain distinct from a stable core standard.

All inspected in this active session. Sources establish documented behavior; no external runtime installation or event delivery was performed.

## Queue decisions

The packaging recipe becomes `ready` / `update existing`; evaluate its documentation and package-structure claims separately from the unperformed runtime experiment. Its score is 85: reader job 25, observed search intent 12, original artifact 16, claim-matched evidence 18, durable usefulness 10, distribution fit 4. Search results support a packaging/distribution intent, not measured demand. MCP events remains a high-priority research brief with a documented implementation contract. Agents API computer use and model evaluations remain research briefs requiring controlled runs for their proposed outcome claims.

## Product judgment

The current [skills.sh docs](https://www.skills.sh/docs) separates installation help from discovery. Keep our homepage focused on installing skills and add packaging help to the existing ChatGPT guide. More detailed product-specific boundaries are useful here because workspace Skill sharing and public plugin distribution serve different reader jobs.

## Next experiment

Run the fixture's direct, indirect and missing-evidence cases in an isolated supported host, preserving activation and removal traces. For MCP events, build and test a separate callback/subscription fixture before claiming delivery, retry or authorization behavior.

## Unknowns

No search-volume, indexation or traffic data was gathered. No runtime-tested compatibility claim is warranted. Publication/build and live verification outcomes are recorded below only after they occur.

## Production verification — September 30

Commit `d7e46ef` is pushed. The live existing route https://www.slashskills.xyz/guides/chatgpt returned successfully and contains “ChatGPT Skills and plugins”, “Package a workflow as a plugin”, and the package-builder link. It declares the matching self-canonical and `index, follow`. Direct browser checks at 390px and 1440px found no page overflow and copied parseable manifest JSON. Mobile screenshot was visually inspected. Zero new URLs; no new-URL ledger entry or indexing request is needed. This is availability verification, not evidence of indexation or traffic.

## Recipe checks — September 30

The expanded guide has a matching title and description, the existing self-canonical, a copyable manifest and package tree, a contextual link to `decision-doc`, and links to the reproducible fixture and official packaging docs. The existing guide index and sitemap already include this route. Relevant claims remain sourced or explicitly limited to local structure checks.

Root checks passed (9 tests plus ZIP and repository validation); site tests passed (20); production build passed; all existing browser checks passed (8, including 390px and 1440px guide journeys). No new low-value tests were added. The added ChatGPT section uses existing guide/code components; those browser journeys cover the shared guide behavior, not ChatGPT runtime compatibility. `git diff --check` passed. The changes are prepared for publication, with no deployment or live verification yet.

## Authorized production outcome

Tushar said “do all,” then authorized the existing Tweetbuzz API key for the model comparison. All three deliverables are now published and live-verified:

| Deliverable | Route | Evidence |
| --- | --- | --- |
| Skill/plugin packaging | `/guides/chatgpt` | Checked original package structure; host activation untested |
| Event workflow recipe | `/guides/mcp-event-automation` | 15 local lifecycle tests; host integration untested |
| Sol/Astra skill comparison | `/guides/astra-skill-instructions` | Six API calls, fixed inputs, saved outputs/usage/times and unblinded review |

Ultrafast completed zero calls: the API project returned **Invalid service_tier argument**. Sol/Astra medians were 14.8s/24.4s and estimated token cost $0.0083/$0.0441 per run. Completed-call estimate totals $0.1909688, including reported cache writes, without invoice reconciliation. No broad model ranking or runtime compatibility claim. See the experiment README and detailed research records.

Content commits: `d7e46ef` and `09f9dc3`. Production deployments reached Ready; CI passed. Root tests 9, site tests 20, existing browser checks 8, final production build and whitespace checks passed. Targeted guide/index/skill journeys at 390px and 1440px passed; inspected screenshots prompted and verified table-spacing fixes. Metadata uses actual guide modification dates.

The [live baseline](../baselines/2026-09-30-devday-publications.json) records HTTP 200, self-canonicals, index/follow, single H1s, content markers, article dates, sitemap and contextual links. This is technical availability, not observed indexation. Two existing-page updates plus one new URL; ledger recorded only after verification. October 14/28 measurement windows are established; no traffic or Search Console data collected here.

The scout now sweeps complete launch ledgers and scores claim-matched recipes separately from pending runtime evaluations. The 25-item official DevDay ledger is retained; Agents API computer use and Dots remain explicit research follow-ups. Social assets are drafts only; nothing was sent or posted.
