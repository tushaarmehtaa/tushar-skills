# DevDay changelog model comparison

September 30, 2026. Six completed Responses API calls: `gpt-6.1-sol` Standard and `gpt-6-astra` Standard, three each. Requested and returned models/tiers match. Astra Ultrafast was attempted twice (initial diagnostic error, then detailed capture) and returned **Invalid service_tier argument**. No Ultrafast result exists. This establishes a failure in this project/session; it does not establish general unavailability.

## Reproduction

Create a fresh temporary directory, run `evals/changelog-normal/scaffold.sh` from it, then:

```sh
node --env-file=<authorized-env-file> workspace/seo-newsroom/experiments/devday-model-eval/run.mjs <fixture-directory> <fresh-results-directory>
node workspace/seo-newsroom/experiments/devday-model-eval/summarize.mjs <results-directory>
```

`OPENAI_API_KEY` is read from the environment and never saved. Use `--resume` after the output path to preserve completed calls and continue an interrupted matrix. The runner rejects differing input/settings on resume. It sends only the checked-in skill, synthetic git log/diff and task prompt; no Tweetbuzz source or data. There is no runtime skill discovery, filesystem tool use or automatic grading model. It fails closed for credentials/network errors and skips later repetitions of an arm after its first failure in an invocation.

## Fixed method

- Skill: `changelog/SKILL.md`, explicitly supplied as instructions.
- Task and repository: existing `evals/changelog-normal` fixture, captured log, stat, name-status and full diff.
- HTTP streaming, medium reasoning, 4,096 maximum output tokens; no temperature override, tools or stored response.
- Three rotated arm orders: Sol/Astra/Ultrafast; Astra/Ultrafast/Sol; Ultrafast/Sol/Astra. Unavailable arm skipped after error. A sandbox networking failure occurred before the API matrix; initial completed calls were retained during diagnostic resume.
- Save exact input/settings/hash, responses, returned model/tier, usage and request/response IDs. Time first text delta and completed stream on the local client. This includes HTTP/network overhead; it is not engine-only latency or a WebSocket comparison.
- No cache normalization: first run of each completed model reported 2,189 cache-write tokens; later runs reported 2,189 cached tokens. Costs include those distinct charges. First/warm observations are retained separately in raw results.
- Conservative pre-call token cap under $12 based on input UTF-8 byte upper bound and maximum output length. Completed-run token estimate is approximately $0.19; no invoice/billing reconciliation performed.

Prices per million, dated September 30: Sol input 2/cached 0.10/write 2.50/output 10; Astra Standard 10/1/12.50/50; Astra Ultrafast 60/6/75/300. Sources: [pricing](https://developers.openai.com/api/docs/pricing), exact [Sol model](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [Astra model](https://developers.openai.com/api/docs/models/gpt-6-astra) and [Ultrafast HTTP support](https://developers.openai.com/api/docs/guides/ultrafast-mode), inspected this session. Model/service eligibility must still be verified in the actual response. Codex `/fast` is not evidence of API Ultrafast.

## Review

Codex assistant reviewed all six outputs, unblinded. Core checks inherited from the existing fixture: 4–6 meaningful items, breaking migration, churn excluded from customer bullets, output contract, provenance and no unverified deployment. All six met those checks. Tool inspection/skill selection graders do not apply because evidence was pre-captured and the skill explicitly supplied.

Exploratory observations, not preregistered win criteria: all six noticed a discrepancy between the webhook commit's five-attempt wording and six attempts in the code. Astra omitted or explicitly attributed the commit-only HTTP 400 claim in customer bullets in 3/3; Sol stated it without attribution in the customer bullet in 3/3, then disclosed the missing validation code in the handoff. Both preserved the required migration. Human publication review remains necessary.

One task and three repeats cannot rank overall model quality or characterize p95 production latency. Nearest-rank sample p95 is simply the maximum with n=3. No instruction revision/ablation, runtime compatibility or billing outcome was measured. Revisit Ultrafast when this API project accepts the requested tier; do not count fallback Standard as Ultrafast.
