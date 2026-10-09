# rate-limit: workflow-quality rubric

Written 2026-10-09 before any graded run. Derived from the skill's own Workflow, Verification and Output sections (rate-limit/SKILL.md), applied to the seeded fixture below. Score = passed criteria / 8. Both arms are graded on the same rubric by a blind LLM grader (`claude -p`, no tools) that sees only the run packet: the code diff against the seeded commit, the final reply, the Bash commands the run executed with exit codes, and a post-run `npm test` result I execute myself. The packet does not say which arm produced it.

## Fixture: Tallyroom (Next.js 16.1.6 App Router, "deployed on Vercel")

Copied from the remove-ai-slop proof app at its HEAD, plus one seeded commit:

- `app/api/summarize/route.js`: POST, calls a stubbed LLM summary costing "roughly Rs 4" per call; used signed in and anonymously.
- `app/api/expenses/route.js`: GET (anonymous demo or signed-in group), POST (signed-in only).
- `lib/session.js`: `getSessionUser(request)` from the `tr_session` cookie.
- `@upstash/ratelimit` 2.2.0, `@upstash/redis` 1.39.0, `vitest` 3.2.7 preinstalled; `npm test` = `vitest run` (no tests yet).
- `.env.local` holds FAKE values: `UPSTASH_REDIS_REST_URL=https://fake-tallyroom-verify.upstash.invalid`, token `FAKE_TOKEN_NOT_REAL_tallyroom_verify`. The `.invalid` TLD cannot resolve. liveService: not contacted.

Task prompt (both arms): "Add rate limiting to Tallyroom's API using Upstash. Signed-in users and anonymous visitors need separate limits on /api/summarize (each call costs us about Rs 4 in model tokens) and /api/expenses. The Upstash credentials in .env.local are fake test values for an instance that does not exist, so never call Upstash for real; mock the client in tests. This machine is offline, so don't use the network or install packages. Put a short report of what you built and verified in your reply."

## Criteria (1 = pass, 0 = fail)

1. **trusted-user-key**: signed-in requests are keyed by the server-side session user id (from `getSessionUser`), with limits separate from anonymous traffic.
2. **anon-ip-trust**: anonymous requests are keyed by IP taken from a deployment-trusted source (for example Vercel's `x-real-ip`, `@vercel/functions` `ipAddress`, or the rightmost/platform-appended `x-forwarded-for` hop with stated trust), not the raw leftmost `x-forwarded-for` value without a stated trust model; unknown clients are not collapsed into one shared literal key such as `127.0.0.1` or `"anonymous"` without that being called out as a deliberate choice.
3. **namespaced-policies**: distinct limiter policies per route class and per identity type with distinct key prefixes, and no double counting from blanket middleware plus per-route limiter on the same key.
4. **429-headers**: blocked requests return 429 with a non-negative `Retry-After` and rate-limit headers (limit/remaining/reset or `RateLimit-*`).
5. **outage-behavior**: an explicit Upstash timeout is configured, and store failure on the costly `/api/summarize` route does not silently fail open (fails closed with a clear temporary response, or uses a local emergency limit); any fail-open path does not emit misleading zero-limit headers.
6. **tests-pass**: automated tests with a mocked client exist and cover at least allowed, blocked (429), and store-outage behavior; the post-run `npm test` I execute passes.
7. **repo-checks-run**: the run executed the repo's build (`next build`/`npm run build`) or an equivalent type/lint check and reports its result.
8. **report-contract**: the reply covers at least 5 of the skill's 7 report items: policy table (limits per route and identity); identifier trust model; files and env names changed; outage behavior; response headers; automated test evidence; remaining Upstash/deployment configuration.

Pass criterion for the step: with-skill mean > without-skill mean.
