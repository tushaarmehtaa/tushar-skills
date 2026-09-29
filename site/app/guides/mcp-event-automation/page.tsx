import { EditorialGuide, guideMetadata } from "@/components/editorial-guide";
import { EDITORIAL_GUIDES } from "@/lib/guides";

const guide = EDITORIAL_GUIDES.find((item) => item.slug === "mcp-event-automation")!;
export const metadata = guideMetadata(guide);
const content = `## Start with a draft workflow

Suppose a new project task should produce a decision-record draft. Define the authorized project, the evidence the draft may use, and who reviews it. Keep publication as a separate action. A task title arriving in a webhook is input data; it does not grant permission to change that workflow.

Use [ai-product-development](/ai-product-development) to define acceptance cases and [decision-doc](/decision-doc) for the eventual writing step. The adapter delivers the right task to the right workflow; the skill turns supplied evidence into a useful draft.

We built a [reproducible local fixture](https://github.com/tushaarmehtaa/tushar-skills/tree/main/workspace/seo-newsroom/experiments/devday-mcp-events) to inspect delivery failures. **All 15 tests passed on September 30, 2026.** It creates deterministic draft objects, not model-written decision records. No ChatGPT installation, external webhook, OAuth flow, or model behavior was tested.

## Check the integration before building

OpenAI's [MCP Events documentation](https://developers.openai.com/plugins/build/mcp-events), checked September 30, requires protocol \`2026-07-28\`, an authenticated plugin server, persistent subscriptions and outbound HTTPS. ChatGPT supports verified webhooks, but not polling, streaming or gap/terminated notifications. The linked [MCP Events proposal](https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md) remains a draft.

Implement \`events/list\`, \`events/subscribe\`, and \`events/unsubscribe\` beside your tools. Subscription identity includes principal, callback, event name and canonicalized filters. Repeated subscribe refreshes that identity. Consult the official document for the complete wire contract.

Our fixture exposes direct lifecycle methods for one synthetic account and event. It is an application experiment, not a drop-in MCP endpoint.

## Run the local experiment

From a checkout of Slashskills, with Node installed:

\`\`\`sh
node --test workspace/seo-newsroom/experiments/devday-mcp-events/fixture.test.mjs
\`\`\`

No API key is needed. Each case creates temporary journals, injects a clock and permission check, and cleans up afterward. The callback is an in-process function and never makes a network request.

| Stage | Saved evidence | Unfinished work |
| --- | --- | --- |
| Subscribe | Owner, project, callback, expiry | No task has arrived |
| Acknowledge receipt | Signed event in the inbox | No draft exists |
| Complete worker | Draft and inbox completion | No publication occurred |

A \`2xx\` acknowledges webhook receipt; ChatGPT processes events asynchronously. Our receiver returns \`202\` before its worker runs. A test reconstructs the receiver at this boundary, resends the event and checks for one final draft.

## Verify the original bytes

[Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md) signs the identifier, signing timestamp and exact body bytes with the subscription key. Serialize once on the sender and verify the raw body before parsing on the receiver. Attempt time differs from event occurrence time.

Our signer matches a public upstream known-answer vector. Tests reject changed body whitespace, replaced IDs, altered timestamps and timestamps outside a five-minute window. A signature list containing the valid signature is accepted.

A wrong callback challenge echo leaves no active subscription. Repeating the same verification request is rejected. These are local implementation observations. Use the maintained signing library in production and implement OpenAI's connection-time callback destination checks. The injected transport cannot establish TLS, DNS or redirect behavior.

## Make receipt and writes idempotent

The fixture keys inbox jobs by \`subscriptionId + eventId\`. Give the writing operation its own stable key so a restarted worker can find its existing draft. Local draft creation and inbox completion share one journal update.

The duplicate case reconstructs both objects, resends the event and drains the worker again: one draft remains. Two distinct events arriving in reverse timestamp order produce two independent drafts. That suits an append-only workflow. Updating current task status needs a version check or authoritative read; arrival order cannot choose the latest state.

These journals demonstrate single-process reconstruction. They do not establish multi-worker locking, power-loss durability, or exactly-once remote writes. A real write tool needs a durable transaction or another idempotency mechanism around its business operation.

## Bound retries and cancel queued work

OpenAI documents bounded exponential retry with stable event IDs and fresh signing timestamps; \`410\` and \`413\` are terminal. Persist subscriptions across restart and stop delivery after revocation. Without replay, return \`cursor: null\` and do not promise recovery of missed events.

Our test policy uses four attempts and an initial one-second delay. Those are fixture choices. A synthetic \`503\` fails once, the broker restarts, and the next attempt succeeds. Persistent failures stop after four attempts. The \`410\` and \`413\` cases stop after one.

Check access before delivery and before completing received work. The revocation case queues one event in the receiver and another in the broker, then removes access: neither creates a draft. Owner-scoped unsubscribe is idempotent, retains a tombstone and cancels queued work across reconstruction. Expiry and nonmatching projects produce no delivery.

Saved pending events survive this reconstruction. Events never enqueued during an outage are absent; recovering them requires source history or replay.

## Test the host separately

Connect a disposable authenticated server through a plugin. Save discovery, subscribe, challenge and delivery traces, then inspect the actual draft. Receipt alone cannot establish skill completion.

Carry the local failure cases into that environment. Add account disconnection, bursts and feedback-loop checks if writing emits another source event. Save exact host and protocol versions.

The [fixture README](https://github.com/tushaarmehtaa/tushar-skills/tree/main/workspace/seo-newsroom/experiments/devday-mcp-events) records remaining work: real network checks, host activation, batching, rotation overlap, verification caching and concurrent storage. Once delivery and permissions are established, apply [decision-doc](/decision-doc) and evaluate its model output as a separate step.
`;

export default function Page() { return <EditorialGuide guide={guide} content={content} />; }
