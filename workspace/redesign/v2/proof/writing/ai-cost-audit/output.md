I've written `cost-review.md`. September AI spend comes to **$13,819**. That's **$0.29 per monthly active user**, or **$4.46 per Pro subscriber** if the whole bill is charged to paying users. Revenue is $24,800, so AI cost is **56%** of it.

**Where the margin goes:** mostly the free tier. Features free users get account for $10,511 (76% of spend). An average Pro user costs about $1.29/month against $8 of revenue, so Pro is profitable. The ~44,900 free users cost about $9,800/month with no revenue behind them. If free users double while Pro stays flat, AI cost reaches about 95% of revenue. That growth risk matters more than any model choice.

**What can be cut, ranked:**
1. **Batch the weekly digest:** about $627/month. Nobody reads it before Monday 9am, so slower processing changes nothing for users.
2. **Stop re-summarizing unchanged notes:** about $500–3,000/month, also invisible to users. Every 10% of skipped saves is worth $494. The export doesn't show how many saves are unchanged, so log that for a week to pin it down.
3. **Move auto-tag to Haiku 4.5:** up to $851/month. It picks 1–3 tags from a fixed list of 40, which should suit a smaller model, but test it on real notes first.
4. **Chat (ask_your_notes) runs on Opus 4.1:** $0.16 per message, 13× the cost of a note summary. A cheaper model could save up to $2,646/month. This is the paid flagship feature, so it needs a strict quality test, and it isn't what's hurting margin.

Items 1 and 2 alone save about $1.1k–3.6k/month, bringing AI cost down to about 41–51% of revenue. These are projections from the export, not measured results.

**Things to know before acting:**
- **The search-rerank caching idea doesn't hold up yet.** The export's note says every call sends the same 2,400-token prompt, but the logged average input is only 1,600 tokens per call. Both can't be true. The saving that note implies (~$4k) is more than rerank's entire input bill ($2,944). Measure the real prompt length before planning this.
- **Prices aren't confirmed.** All costs use the rates in `context.md`. I couldn't check them against Anthropic's official pricing page because the web fetch was denied. Whether caching is even possible depends on a minimum prompt length on that page, which I also couldn't check.
- **No invoice to compare against.** These are bottom-up numbers from the usage export, so they miss retries, failed calls and staging traffic. Comparing them with the September invoice is the first step.
- **No per-plan or per-user data.** The Pro and free split assumes Pro users use the shared features at the average rate. Tagging usage logs by plan would replace that assumption with real numbers.