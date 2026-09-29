# OpenAI DevDay coverage triage — 2026-09-29

## Evidence and gap

Live observation: OpenAI's [official recap](https://openai.com/index/devday-2026-recap/) dated September 29 lists the announcements below. Retrieved September 29. Availability is reported by OpenAI, not independently tested. Today's saved raw scout does not cover these announcements. Repository intent already includes capability launches; the missing event sweep is a completeness gap, not an editorial-territory restriction. Queue review also remains behind the raw reports.

This is an initial event brief, not a complete daily scout, runtime verification, or publication approval. Linked product documentation, current search intent, and owned experiments remain to be reviewed. No traffic or search-volume evidence was collected.

## Complete recap ledger

All rows are sourced to the official recap above. Dispositions are Slashskills recommendations; availability describes the provider's announcement.

| Announcement | Announced availability | Reader consequence / disposition |
| --- | --- | --- |
| Dots | Pro/Business Premium, eligible markets; admin-enabled beta for other listed workspaces | Persistent delegated work: research responsibility, permission and recovery boundaries |
| GPT-6.1 Sol | API and listed ChatGPT plans | Reevaluate an existing skill; research brief |
| Ultrafast | Astra available; Sol coming soon | Measure workflow latency and cost if access exists; watchlist |
| Private Intelligence | Private Safety Processing offered; Private Inference preview coming fall | Privacy-specific workflows; watchlist, no broad safety claims |
| Codex in the cloud | Listed paid/workspace plans | Check environment, dependencies and skill installation scope; update-existing research |
| Refreshed Codex CLI | All plans | Verify session, worktree and delegation effects on existing Codex guide |
| Code Review | All plans | Existing changelog/eval workflow angle; watchlist |
| Codex Security Cloud | Pro and listed workspace plans | Security-review skill evidence possible; watchlist |
| Decisions API | Limited preview; broader release planned | Routing/skill-selection experiment; access-dependent watchlist |
| Agents API with computer use | API; listed higher-tier product access | Reusable skill-backed automation and recovery fixture; research brief |
| Bedrock Managed Agents | AWS offering announced | Deployment-specific packaging; watchlist pending AWS docs |
| Plugin extensions | All plans | Skill + MCP + optional UI packaging; research brief |
| Improved plugin creation, submission and discovery | All plans | Distribution and metadata job; combine with plugin packaging brief |
| Sites hosting plugins | Listed workspace plans | Shared connected-data workflow; watchlist |
| MCP events for plugin automations | All plans; proposed MCP Events specification | Event-triggered skills, retries and permissions; research brief, not stable-protocol claim |
| ChatGPT Space | Listed plans; mobile has partial functionality | Collaborative knowledge workflows; watchlist |
| Pages | Pro/Business/Enterprise | Potential reusable authoring workflow; watchlist |
| Collaborative slides | Coming weeks | Hold until available; do not claim shipped |
| Teams and shared tasks | Business/Enterprise | Recurring responsibility handoffs; combine with persistent-work research |
| @ChatGPT in Slack/Teams | Business/Enterprise | Tool permissions and collaborative invocation; watchlist |
| Meetings plugin | macOS beta for Pro/Business; Enterprise forthcoming | Meeting-to-action artifact possible; watchlist |
| Shareable profiles | Business/Enterprise; skills sharing workspace-only | Document distribution boundary; combine with plugin brief |
| Sign in with ChatGPT | Identity global; plan usage Plus/Pro in participating tools | Authentication versus allowance distinction; watchlist |
| Pro 500 | Available now | Access/cost prerequisite only; no standalone editorial candidate |
| OpenAI Marketplace | Eligible enterprises can express interest | Commercial ecosystem signal; no immediate catalog reader job |

## Prioritized research briefs

These are inferred reader jobs, not measured search demand. The plugin packaging recipe is ready for an existing-guide publication: it uses official instructions and a checked original package. Its separate runtime experiment remains unperformed. Other briefs still require development. Check existing routes by intent before selecting any new URL.

1. **High: package and distribute a skill-backed ChatGPT plugin.** The existing `decision-doc` skill-only fixture builds under the official portable manifest; local structural/reference validation passes. Next, install it in a disposable marketplace and test direct/indirect invocation, unsupported claims, permissions, and removal. Success: documented invocation behaves correctly with declared permissions and uninstall removes it cleanly. Kill: unsupported activation or no useful advantage for our users. Overlap: existing plugin-marketplace candidate; reconcile rather than duplicate it.
2. **High: event-triggered skill automation.** Build a local synthetic task-created event that drafts a plan, with duplicate delivery, retry, revoked authorization and cancellation cases. Success: one intended draft per event, traceable recovery, no action after revocation. Kill: unavailable access or no reproducible event contract. Verify the proposed MCP Events status separately from OpenAI's implementation. Distinct from general MCP migration coverage.
3. **High: run a skill-backed workflow through Agents API computer use.** Use a disposable app and harmless form; preserve tool events, artifacts and restart behavior. Success: completion after a recoverable interruption without duplicate submission. Kill: inability to load the intended skill or inspect execution. Overlap: cross-runtime evaluation only if it answers this deployment job.
4. **High: reevaluate one existing skill on GPT-6.1 Sol.** Use the existing changelog fixture and rubric, compare with the prior model at fixed runtime/settings, retain failures and billed usage. Success: reproducible evidence about quality/cost tradeoffs. Kill: no material actionable difference; update eval records instead of creating a page. Model claims source: [launch](https://openai.com/index/introducing-gpt-6-1-sol/); do not present provider benchmarks as our results.
5. **Medium: persistent agent responsibilities.** Test a harmless recurring repository digest with explicit scope, missed-run recovery, approval boundaries and cancellation. Success: bounded execution and inspectable handoff. Kill: unavailable product access or insufficient traces. [Dots announcement](https://openai.com/index/introducing-dots/) supplies product evidence; behavior remains untested.

## Product placement and next action

Current [skills.sh documentation](https://www.skills.sh/docs) provides a separate supporting surface. Slashskills keeps discovery and installation on its homepage and places practical coverage in guides with contextual skill links. Our departure is to lead with small owned fixtures and measured behavior rather than a broad announcement recap.

Next: run the smallest accessible fixture for the prioritized queue items, beginning with plugin packaging and the documented event contract. No publication or deployment occurred. The raw September 29 scout is preserved; this supplemental brief does not silently replace it.

## Linked documentation review — September 29

Reviewed the official OpenAI recap and primary documentation rather than relying on event coverage:

- [Plugin build docs](https://developers.openai.com/plugins) now include dedicated guides for [skills](https://developers.openai.com/plugins/build/skills), [MCP servers](https://developers.openai.com/plugins/build/mcp-server), [events](https://developers.openai.com/plugins/build/mcp-events), [extensions](https://developers.openai.com/plugins/build/extensions), packaging, testing, and submission. That gives the plugin/skill distribution idea a specific test surface. It still does not prove any Slashskills package works there.
- [OpenAI MCP Events docs](https://developers.openai.com/plugins/build/mcp-events) state that the ChatGPT integration requires MCP 2.0 / protocol version `2026-07-28`; it supports webhook delivery and callback verification, but not polling, streaming, or the draft spec's `gap` and `terminated` notifications. The docs specify event discovery, subscription lifecycle, signed delivery, bounded retries, out-of-order delivery, access rechecks, and idempotency. The separate [MCP Triggers & Events working-group charter](https://modelcontextprotocol.io/community/working-groups/triggers-events) describes proposal work. Keep implementation documentation distinct from stable-spec status.
- [Agents API computer-use docs](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use) define per-origin approval and explicitly say origin approval does not enforce confirmation before individual purchases or destructive actions. They recommend restricting the browser to non-consequential resources or using a controlled browser runtime when that guarantee is needed.
- [GPT-6.1 Sol and Ultrafast API docs](https://developers.openai.com/api/docs/changelog) and the [Ultrafast guide](https://developers.openai.com/api/docs/guides/ultrafast-mode) are the source map for the model/speed evaluation. Availability and advertised speed remain provider claims until our own measured run exists.
- Dots remains a medium-priority experiment: the [Dots announcement](https://openai.com/index/introducing-dots/) confirms the product, while [computer and app controls](https://learn.chatgpt.com/docs/dots/computers-and-apps) and [Dots controls](https://learn.chatgpt.com/docs/dots/controls) are the relevant operational docs. Local-skill package compatibility still needs a live test.

The newsroom queue tracks five concrete DevDay experiments/updates alongside the full announcement ledger. Publish the supported packaging recipe on the existing ChatGPT guide; zero new URLs are required for that coverage. Runtime performance, installation and activation claims remain outside the recipe's evidence scope.

## September 30 outcome

Tushar authorized all three proposed follow-ups. The ChatGPT packaging update, local MCP event-testing guide, and supplied-skill Sol/Astra comparison are now published and live-verified. Fifteen event lifecycle tests pass; six Standard API calls completed. Astra Ultrafast was rejected with Invalid service_tier argument and has no comparative result. See [the daily production record](../daily/2026-09-30-devday-review.md), [MCP research](2026-09-30-mcp-events-workflow.md), [model study](2026-09-30-sol-astra-changelog.md), and the dated baseline. Agents API computer use and Dots remain research follow-ups. The original launch ledger below/above describes provider announcements; later owned experiments do not prove every advertised feature or host compatibility.

### Owned fixture check

Built the existing [`devday-skill-plugin` fixture](../experiments/devday-skill-plugin/README.md) into `/private/tmp/slashskills-devday-plugin-20260930` with its documented builder. The builder reported structure passed; `scripts/check-skill.mjs` reported no errors or warnings. This validates the local package layout and skill references only. ChatGPT/Codex installation, discovery, activation, behavior, and removal have not been tested.
