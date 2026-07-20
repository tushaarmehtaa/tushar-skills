# The Benchmark Problem

## Everyone Is Cheating, Nobody Is Auditing

In February 2026, OpenAI quietly retired SWE-bench Verified. The reason: 59.4% of audited tasks were flawed or unsolvable. The replacement — SWE-bench Pro — immediately cut top scores from 70-80% to roughly 23%.

That collapse was not a regression in capability. It was the first honest measurement.

---

## The Three Ways Benchmarks Break

**Saturation.** When top models cluster so tightly near a benchmark's ceiling that differences fall within noise. MMLU tells the story: GPT-3 scored 35% in 2022. Every frontier model now exceeds 88%. The top fifteen models sit between 88.8% and 92.5% — a 3.7-point window separating the most capable language models on the planet. Those differences are statistically meaningless.

MMLU-Pro was created to fix this. It replaced four answer choices with ten, across 12,000 graduate-level questions. It caused a 16-33% accuracy drop when it launched. By early 2026, the top model was already at 90%. The pattern repeated in under 18 months.

GPQA Diamond, the "Google-proof" PhD-level science benchmark, is following the same arc. Claude Mythos Preview leads at 94.6%. Five other models cluster within 2.5 points.

Humanity's Last Exam, published in Nature in 2026, is the only frontier benchmark with room to climb. Top model scores are around 64.7%. Human domain experts average approximately 90%. For now, it discriminates.

**Contamination.** When benchmark test questions leak into training data, the model scores on memorization rather than reasoning. The problem is structural: training pipelines ingest the open internet, and benchmarks live on the open internet. The overlap is not a conspiracy. It is architectural inevitability.

A 2023 study found that removing contaminated GSM8K examples dropped accuracy by up to 13% for some models. Meta itself ran 10-gram contamination detection on Llama 2's training corpus and confirmed HellaSwag and MMLU-Humanities were contaminated enough to boost scores.

The numbers keep surfacing. GPT-4 can infer masked MMLU answers 57% of the time without seeing the question. Changing the order of answer choices on MMLU decreases model accuracy by up to 13%. A model that truly understood the content would not care which option is listed first.

A separate analysis confirmed 10.6% direct data leakage between SWE-bench Verified and at least one training corpus. That figure captures only exact string matches.

**Gaming.** In April 2025, Meta announced that Llama 4 beat GPT-4o on LMArena. The score came from an unreleased, customized model labeled Llama-4-Maverick-03-26-Experimental — not the public model. LMArena said Meta's interpretation of its policy did not match what the platform expects. Meta was also accused of training on test sets. They denied it.

This is not an edge case. When benchmark scores are how models get marketed and compared, every lab faces pressure to publish the highest possible numbers. There are no industry standards for contamination detection. No enforcement mechanisms. No auditors. The labs grade themselves.

---

## What the Industry Is Doing About It (Not Much)

The structural fixes exist. Rolling benchmarks like LiveCodeBench resist contamination by refreshing their questions. Private test sets delay leakage. Expert-curated rotation extends useful life.

But every benchmark with publicly available test items eventually contaminates. The useful life of a benchmark is 2-5 years, followed by gradual contamination. Successor benchmarks arrive every 18-24 months.

The 2026 generation — MMLU-Pro, GPQA Diamond, HLE, LiveCodeBench, SWE-bench Pro — will themselves age. Expect MMLU-Pro to lose discriminating power by 2027-2028. GPQA Diamond will be replaced by GPQA-Plat or equivalent. The pattern is not failure. It is the field iterating toward better measurements as old measurements become unreliable.

The problem is that the iteration cycle is slower than the training cycle. By the time a benchmark is proven contaminated, every model has already been trained on it.

---

## The Deeper Problem

Of the 99 MMLU scores tracked by one aggregator, 98 are self-reported and zero are independently verified. The industry's most-cited evaluation number is also its least audited.

The incentive structure guarantees the outcome. Labs optimize their models on the benchmarks used to rank them. The benchmarks stopped reflecting real capability years ago. But they still produce the press releases, the funding rounds, and the valuation marks.

The honest question nobody answers: when a new model claims to be "state of the art" — state of the art at what, exactly? And who decides what "better" means?

The shift toward dynamic, adversarial, expert-grounded evaluation has started. But nobody actually enforces anything yet. The old benchmarks are still quoted in every press release. The new benchmarks will be saturated before anyone admits they mattered.

Meanwhile, the numbers that drive billions in investment and valuation are self-reported, unaudited, and partially contaminated. The industry that wants to be trusted with the future of human knowledge cannot agree on how to measure whether it is making progress.
