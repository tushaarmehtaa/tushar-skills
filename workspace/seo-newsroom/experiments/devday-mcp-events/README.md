# Local MCP event workflow fixture

Observed September 30, 2026. Node built-ins only; no credentials, external service, HTTP listener or LLM is used.

```sh
node --test workspace/seo-newsroom/experiments/devday-mcp-events/fixture.test.mjs
```

The broker subscribes one synthetic principal to `task.created` for a project. The injected callback returns a signed challenge response, persists receipt, then creates deterministic draft records when explicitly drained. Separate JSON journals retain subscriptions, delivery attempts, inbox jobs and outputs across object reconstruction. Test files use fresh temporary directories and clean them up.

## Scope

This exercises selected application semantics from [OpenAI's MCP Events integration](https://developers.openai.com/plugins/build/mcp-events), inspected September 30. It is **not** a complete MCP server, OAuth implementation, ChatGPT callback, or host compatibility test. The direct `subscribe`/`unsubscribe` calls correspond to lifecycle operations; they are not JSON-RPC endpoint tests. All owner identities and permissions are injected synthetic values.

The fixture accepts only `https://receiver.example.test/callback` and never opens a connection. It therefore does not test DNS rebinding, TLS, redirects, SSRF prevention, real timeouts or public ingress. Follow the official connection-time destination validation contract before replacing this transport with network delivery. Do not reuse the test secret in production.

Single-process JSON atomic rename demonstrates reconstruction and local transaction boundaries. It does not establish multi-worker locking, database transactions, power-loss durability, exactly-once remote writes or operational reliability. The receiver must recheck access before completing a job. Production writes need their own idempotency key and transaction/outbox design.

Replay is deliberately unsupported (`cursor: null`). Saved pending deliveries can be retried; events never enqueued during an interruption cannot be recovered. Four attempts, one-second initial backoff and five-minute signature tolerance are **fixture choices**, not provider defaults. Secret rotation generation/overlap, challenge-verification caching, batching and live host activation are not implemented.

## Signature evidence

HMAC implementation follows the [Standard Webhooks specification](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md). A known-answer test uses the public synthetic vector in the MIT-licensed [upstream JavaScript tests](https://github.com/standard-webhooks/standard-webhooks/blob/main/libraries/javascript/src/webhook.test.ts), retrieved September 30. Use the maintained Standard Webhooks library for a production integration; this small implementation is for inspection of the experiment.

GitHub classified the upstream key's literal spelling as a Stripe webhook secret in alert #1. The fixture now constructs that public known-answer key from explicit test bytes, preserving the independent expected signature without a credential-shaped literal. This exception applies only to the verified public test vector; real credentials must never be committed in any representation.

## Test matrix

15 cases cover the upstream signing vector; body/ID/timestamp tampering and signature lists; failed callback verification; single-use verification; subscription validation; refresh and restart; receipt before work and duplicate delivery; distinct out-of-order events; transient retry after restart; exhaustion; terminal 410 and 413; revoked access; owner-scoped unsubscribe; and expiry/filter/payload size. See `results.json` for the observed command and scope.

The output is a local draft object, not a `decision-doc` model response. To test a real skill-backed run, connect a disposable authenticated server through a plugin, capture discovery/subscription/challenge/webhook traces, verify the resulting draft and rerun the failure cases. Never infer host success from this local suite.
