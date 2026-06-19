---
name: model-audit
description: Print the complete AI model routing table with cost-per-call math, cache opportunities, batch API candidates, and right-sizing flags. Run whenever you change models or pricing.
category: ai
tags: [ai, models, cost, routing, audit, caching, batch]
author: tushaarmehtaa
---

Audit every AI model call in the codebase. Output a routing table with real cost math, not just model names.

## Phase 1 — Find model configuration

Search for where models are defined:
```bash
grep -r "gpt-4\|claude\|gemini\|anthropic\|openai\|mistral\|groq\|llama" \
  --include="*.py" --include="*.ts" --include="*.js" --include="*.env*" \
  -l 2>/dev/null | head -30
grep -rn "MODEL\|model_config\|AI_MODEL\|LLM_MODEL\|OPENAI_MODEL\|ANTHROPIC_MODEL" \
  --include="*.py" --include="*.ts" --include="*.env*" -l 2>/dev/null
```

Read every file returned. Map alias → actual model string. Example: `AI_MODEL="claude-sonnet-4-6"` or `const FAST_MODEL = "gpt-4o-mini"`.

## Phase 2 — Find every AI call

```bash
# Anthropic
grep -rn "messages\.create\|anthropic\.messages\|client\.messages" \
  --include="*.py" --include="*.ts" --include="*.js"

# OpenAI
grep -rn "chat\.completions\.create\|openai\.chat\|completion\.create" \
  --include="*.py" --include="*.ts" --include="*.js"

# Google / Gemini
grep -rn "generate_content\|GenerativeModel\|genai\." \
  --include="*.py" --include="*.ts" --include="*.js"

# Embeddings
grep -rn "embeddings\.create\|embed_content\|embedding" \
  --include="*.py" --include="*.ts" --include="*.js"
```

For each call, record:
- Feature / file / function triggering it
- Model alias or literal model string
- Task type: generation, classification, summarization, embedding, tool use, reasoning
- Rough prompt size: small (<1K tokens), medium (1–10K), large (>10K)
- Frequency: per-request, per-user-action, background job, one-time

## Phase 3 — Pricing reference (2026)

### Anthropic Claude

| Model | Input $/1M | Output $/1M | Cache write $/1M | Cache read $/1M | Context |
|-------|-----------|-------------|-----------------|-----------------|---------|
| claude-fable-5 | $10.00 | $50.00 | $12.50 | $1.00 | 1M |
| claude-opus-4-8 | $5.00 | $25.00 | $6.25 | $0.50 | 1M |
| claude-sonnet-4-6 | $3.00 | $15.00 | $3.75 | $0.30 | 1M |
| claude-haiku-4-5 | $1.00 | $5.00 | $1.25 | $0.10 | 200K |

Prompt caching saves ~90% on cache read vs uncached input. Requires 1024+ tokens in the cacheable prefix.

### OpenAI

| Model | Input $/1M | Output $/1M | Cached input $/1M | Notes |
|-------|-----------|-------------|------------------|-------|
| gpt-4o | $2.50 | $10.00 | $1.25 | Vision capable |
| gpt-4o-mini | $0.15 | $0.60 | $0.075 | High-volume workhorse |
| gpt-4.1 | $2.00 | $8.00 | $0.50 | Longer context, strong coding |
| gpt-4.1-mini | $0.40 | $1.60 | $0.10 | Good at instruction following |
| gpt-4.1-nano | $0.10 | $0.40 | $0.025 | Cheapest, short tasks only |
| o4-mini | $1.10 | $4.40 | $0.55 | Reasoning, budget version |
| o3 | $10.00 | $40.00 | $2.50 | Heavy reasoning tasks |

Batch API: 50% discount on all models. Min latency ~24h. Use for offline/async workloads.

### Google Gemini

| Model | Input $/1M (≤200K) | Input $/1M (>200K) | Output $/1M | Notes |
|-------|--------------------|--------------------|-------------|-------|
| gemini-2.5-pro | $1.25 | $2.50 | $10.00 | Best for reasoning |
| gemini-2.5-flash | $0.15 | $0.15 | $0.60 | Fast, multimodal |
| gemini-2.0-flash | $0.10 | $0.10 | $0.40 | Cheapest Gemini |

Context caching: free to cache, billed per-token-per-hour (~$1/1M tokens/hour for 2.5 Pro).

## Phase 4 — Build the routing table

Output this table:

```
AI MODEL ROUTING — [product name]
════════════════════════════════════════════════════════════════════════════
FEATURE                  TASK TYPE        MODEL                   $/1K CALLS
────────────────────────────────────────────────────────────────────────────
[feature]                [task]           [actual model string]   $[estimate]
[feature]                [task]           [actual model string]   $[estimate]
════════════════════════════════════════════════════════════════════════════

COST MATH (per call):
  Input tokens × (input rate / 1M) + Output tokens × (output rate / 1M)
  Example: 2K in, 500 out on claude-sonnet-4-6 = (2000 × $3/1M) + (500 × $15/1M)
                                                = $0.006 + $0.0075 = $0.0135/call

UNUSED CONFIG (defined, never called):
  [alias] → [model string]

DEPRECATED / RENAMED MODELS:
  ⚠️  [any model string that no longer exists or has been superseded]
```

## Phase 5 — Check for caching opportunities

For each call with a large, stable prefix (system prompt, docs, schema, examples):
- Is the prefix ≥1024 tokens? → Prompt caching candidate
- Does the prefix change per-user or per-request? → Not cacheable
- Same system prompt on every call? → Cache it; saves ~90% on those tokens

Flag calls that have a large system prompt but aren't using `cache_control`.

Anthropic pattern:
```python
{"role": "system", "content": [{"type": "text", "text": "...", "cache_control": {"type": "ephemeral"}}]}
```

OpenAI (automatic): input caching is automatic on gpt-4o / gpt-4.1 for repeated prefixes.

## Phase 6 — Check for batch API candidates

Any call that is:
- Not user-facing (background job, scheduled task, dataset processing)
- Can tolerate hours of latency
- Volume > 100 calls/day

→ Flag as batch candidate. Batch = 50% cheaper (OpenAI) or up to 50% (Anthropic).

## Phase 7 — Right-sizing flags

For each call, check if the model is over- or under-powered for the task:

**Downgrade candidates** (expensive model on a simple task):
- Classification or extraction → gpt-4.1-nano, haiku, or gemini-2.0-flash
- Short Q&A with a known answer domain → gpt-4o-mini or haiku
- Embedding generation → text-embedding-3-small (OpenAI) at $0.02/1M
- Summarization of short text → haiku, gpt-4.1-mini

**Keep the powerful model when:**
- Multi-step reasoning or tool use chains
- User-facing creative or long-form generation
- Code generation where correctness matters
- Tasks with high retry cost if wrong

**Upgrade candidates** (cheap model failing silently):
- Tool use with complex schemas → needs sonnet/gpt-4o minimum
- Long-context reasoning (>50K tokens) → needs a model with proven long-context recall
- Structured extraction from noisy input → cheap models hallucinate field names

## Phase 8 — Final flags

```
OPTIMIZATION FLAGS:
  CACHE   [feature] — large static system prompt, not cached. Estimated savings: $X/day
  BATCH   [feature] — background job, 50% savings available
  OVERFIT [feature] — using [expensive model] for [simple task], [cheap model] would work
  SCATTER [feature] — hardcoded model string outside central config, won't update on model changes
  DEPR    [model string] — deprecated, may stop working; migrate to [replacement]
  INCON   [task type] — same task using different models in different files: [file A] uses X, [file B] uses Y
```
