---
name: economics
description: Calculate unit economics for AI products. Revenue per action, API cost, gross margin, free tier damage, cache savings, batch discounts. Run when pricing changes.
category: ai
tags: [economics, pricing, margins, ai, cost]
author: tushaarmehtaa
---

Calculate the current unit economics for your AI product.

## Before you start

Ask the founder:

> "What do you think your gross margin is on each action? Take a guess."

Wait for the answer. Write it down. Then run the calculation. Founders almost always overestimate margin. Showing the real number after they've committed to a guess lands harder.

If they say "I have no idea" — proceed. But get the guess first if there is one.

---

## Current model pricing (June 2026)

### Anthropic Claude

| Model | Input $/MTok | Output $/MTok | Cache read $/MTok | Batch (50% off) |
|-------|-------------|---------------|------------------|-----------------|
| Opus 4.8 | $5.00 | $25.00 | $0.50 | $2.50 / $12.50 |
| Sonnet 4.6 | $3.00 | $15.00 | $0.30 | $1.50 / $7.50 |
| Haiku 4.5 | $1.00 | $5.00 | $0.10 | $0.50 / $2.50 |

Cache write cost: 1.25× input rate for 5-min TTL, 2.0× for 1-hr TTL.

### OpenAI

| Model | Input $/MTok | Output $/MTok |
|-------|-------------|---------------|
| GPT-4.1 | $2.00 | $8.00 |
| GPT-4o | $2.50 | $10.00 |

### Google Gemini

| Model | Input $/MTok | Output $/MTok |
|-------|-------------|---------------|
| Gemini 2.5 Pro | $1.00 | $10.00 |
| Gemini 2.5 Flash | $0.30 | $2.50 |

---

## Steps

### 1. Get pricing from the codebase

```bash
grep -rn "CREDIT\|credit_cost\|COST\|FREE_CREDITS\|signup_bonus\|price\|PRICE" --include="*.py" --include="*.ts" -i
```

Find:
- How much users pay (e.g. $5 = 100 credits → $0.05/credit)
- Credits per action (generation, image, regen, etc.)
- Free credits on signup

### 2. Estimate tokens per action

Read the actual prompt files if they exist. Otherwise use these baselines:

| Action type | Input tokens | Output tokens |
|-------------|-------------|---------------|
| Short generation (tweet, subject line) | 500–1,000 | 100–200 |
| Medium generation (email, summary) | 1,000–3,000 | 300–800 |
| Long generation (article, report) | 2,000–6,000 | 800–2,000 |
| Classification / extraction | 500–2,000 | 50–150 |
| Chat turn (with history) | 2,000–8,000 | 200–500 |

### 3. Calculate cost per action

```
API cost = (input_tokens / 1,000,000 × input_price)
         + (output_tokens / 1,000,000 × output_price)

Revenue  = credits_charged × price_per_credit
Margin   = (revenue - api_cost) / revenue × 100
```

### 4. Calculate cache impact (if using prompt caching)

Cache only helps when you have a large repeated prefix (system prompt, document context, few-shot examples).

```
Standard cost     = input_tokens / 1M × input_price
Cached cost       = cached_tokens / 1M × cache_read_price
                  + uncached_tokens / 1M × input_price

Savings per call  = standard_cost - cached_cost
Break-even calls  = cache_write_cost / savings_per_call
```

Example with Sonnet 4.6 and a 10,000-token system prompt:
- Standard: 10,000 / 1M × $3.00 = $0.030 per call
- Cache read: 10,000 / 1M × $0.30 = $0.003 per call
- Cache write (5min): 10,000 / 1M × $3.75 = $0.0375
- Break-even: $0.0375 / $0.027 savings = 1.4 calls

Any repeated system prompt over ~2,000 tokens with more than 2 calls per session: cache it.

### 5. Check batch eligibility

Anthropic's Batch API is 50% off all models. Use it for:
- Bulk processing (document analysis, content moderation, bulk generation)
- Anything that doesn't need a real-time response (under 24hr turnaround)
- Background jobs, nightly processing, bulk exports

If more than 20% of your API spend is on non-real-time work, batch processing alone could halve that portion.

### 6. Output the table

```
UNIT ECONOMICS — [your product]
════════════════════════════════════════════════════════════════
USER PRICING
  [price] = [credits] credits → $X.XX per credit
  Signup bonus: [N] free credits

ACTION ECONOMICS
────────────────────────────────────────────────────────────────
Action              Credits   Revenue   API Cost   Margin
────────────────────────────────────────────────────────────────
[action name]         [N]     $X.XX     $X.XXX     XX%
[action name]         [N]     $X.XX     $X.XXX     XX%
────────────────────────────────────────────────────────────────

CACHE SAVINGS (if applicable)
  System prompt tokens: [N]
  Savings per call: $X.XXX
  Monthly savings at [volume] calls: $XXX

FREE TIER DAMAGE (N signup credits)
  Conservative user:   costs you ~$X.XX
  Typical user:        costs you ~$X.XX
  Heavy user:          costs you ~$X.XX

PAYBACK POINT
  One paying user covers ~X non-converting free users
════════════════════════════════════════════════════════════════
```

### 7. Flag anything concerning

**Red flags:**
- Any action with margin below 50% — flag it prominently
- Free tier cost above $1 per signup — flag it
- Large repeated system prompt with no caching — calculate the monthly savings they're leaving on the table
- Non-real-time work running on live API instead of batch — flag the cost delta

**Margin benchmarks (2026):**
- >70% gross margin — healthy for an AI product
- 60–70% — acceptable, industry average for AI-augmented SaaS
- 50–60% — watch this closely, leaves little room for infra and support costs
- <50% — pricing problem or model choice problem, fix before scaling

### 8. Pricing sensitivity (if asked)

Show margins at ±20% credit price. Helps decide whether to reprice without rebuilding the whole spreadsheet.

Also show the "upgrade model" scenario: what margin looks like if they move one tier up or down (e.g. Sonnet → Haiku, GPT-4.1 → Gemini 2.5 Flash). The cheapest model that meets quality bar is often not the one they're using.
