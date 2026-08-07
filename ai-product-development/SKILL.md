---
name: ai-product-development
description: Design and implement production AI features with model selection, streaming UX, tool use, safety, evaluation, observability, and cost controls. Use when building AI into an app.
license: MIT
---

# AI product development

Build an AI feature as a complete product path. Start with the user decision or task, then implement the model boundary, interface states, reliability controls, and evaluation needed to ship it responsibly.

## Workflow

1. Define the job, user input, expected output, acceptable latency, quality bar, failure cost, privacy constraints, and whether deterministic software can solve part of the task better.
2. Inspect the existing framework, AI SDKs, providers, auth, storage, rate limits, analytics, and deployment runtime.
3. Design a typed server-side contract. Validate input and structured output, cap context and generations, keep secrets server-side, and make provider-specific code replaceable.
4. Choose the simplest interaction pattern that fits: request/response, streamed generation, background job, retrieval, tool use, or an agent loop. Do not use streaming or agents as decoration.
5. Implement the full UI state model: initial, composing, queued, connecting, streaming, tool activity, partial result, cancellation, retry, refusal, rate limit, error, and completed output.
6. Handle disconnects, timeouts, retries, duplicate submissions, idempotency, partial output, persistence, and provider failure. Abort upstream work when the user cancels where the provider supports it.
7. Add safety and trust controls appropriate to the domain: data minimization, prompt-injection boundaries, tool permissions, provenance, confirmation before consequential actions, and clear uncertainty.
8. Build an evaluation set from real tasks. Measure correctness, format adherence, refusal behavior, latency, and cost before changing models or prompts.
9. Instrument model, route, latency, tokens or media units, cache status, errors, user feedback, and task outcome without logging sensitive inputs by default.
10. Verify locally and in the target runtime with happy paths, slow streams, malformed output, cancellation, rate limits, provider errors, and repeated requests.

## Load deeper guidance

- Read [streaming implementation](references/streaming.md) when using the Vercel AI SDK or implementing streamed chat/generation in Next.js.
- Use the `ai-cost-audit` skill when the task requires a repository-wide model and margin analysis.

## Output

Report the chosen interaction pattern, implemented paths, state coverage, safety boundaries, evaluation results, observability, and remaining production setup.
