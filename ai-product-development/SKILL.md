---
name: ai-product-development
description: Design, implement, or audit production AI features with model selection, streaming UX, tool use, safety, evaluation, observability, and cost controls. Use when building AI into an app.
license: MIT
---

# AI product development

Build an AI feature as a complete product path, not an isolated model call.

## Workflow

1. Define the user job, input, expected output, quality bar, acceptable latency, failure cost, privacy constraints, and the deterministic work that should remain ordinary software.
2. Inspect the framework/runtime, AI SDK and version, providers, auth, storage, rate limits, billing, analytics, deployment limits, existing prompts, and evaluation fixtures.
3. Choose the simplest fitting interaction: request/response, streamed generation, background job, retrieval, bounded tool use, or an agent loop. Ask only about unresolved product choices that change this boundary.
4. Define a typed server contract. Validate input, authorize before model work, cap context/output/tool steps, keep provider secrets server-side, and isolate provider-specific code behind a replaceable adapter.
5. Model the UI states the chosen interaction needs: initial, composing, submitted/queued, connecting, streaming or progress, tool approval/activity, partial result, cancellation, retry, refusal, rate limit, error, and completion.
6. Design reliability before implementation: timeouts, retry policy, duplicate-submission keys, persistence, disconnect behavior, partial results, provider fallback, and cancellation. Treat model-selected tools and arguments as untrusted. For every consequential action, the server-side tool handler must re-authorize the current actor and tenant at execution time, validate the resource's current state and policy constraints, require explicit approval where appropriate, and apply idempotency immediately around the external mutation. An earlier request-level authorization is not sufficient.
7. Treat usage charging as a reservation-and-settlement flow when concurrency or variable cost exists. Do not rely on a pre-check followed by post-hoc deduction.
8. Add domain-appropriate trust controls: data minimization, prompt-injection boundaries, provenance, uncertainty, moderation/refusal behavior, tenant isolation, and audit logs for tool actions.
9. Build an evaluation set from representative and adversarial tasks. Measure correctness, format adherence, refusal behavior, latency, and cost before changing models or prompts.
10. Instrument provider/model, route, latency, usage units, cache status, retries, errors, user feedback, and task outcome without recording sensitive prompts or outputs by default.

## Conditional guidance

- Read [streaming implementation](references/streaming.md) only when implementing streamed chat or generation with the Vercel AI SDK. Detect the installed major version before using an API example.
- Use the `ai-cost-audit` skill for repository-wide inventory and unit economics, but fetch current primary-source prices; do not copy embedded price tables without verification.

## Verification

Test the happy path plus malformed input/output, slow first token, mid-stream failure, cancellation, disconnect, timeout, rate limit, duplicate submission, provider failure, and repeated concurrent requests. For tool actions, test prompt-injected arguments, cross-tenant resource IDs, state changes between proposal and execution, duplicate approval, provider retry, and policy-limit violations. Verify execution-time authorization and usage settlement under concurrency. Run the evaluation set and the repository’s lint/type/test/build commands in the target runtime.

## Output

Report the chosen interaction and why, server/UI paths changed, state coverage, safety and permission boundaries, evaluation results, latency/cost observations, usage-settlement behavior, verification evidence, and remaining provider or production setup.
