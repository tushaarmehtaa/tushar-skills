# Quillnote: what to fix first

**Recommendation:** Fix the Apple Notes import date bug first. Title-only search comes second.

**How sure:** We can be confident that the bug is real, that it affects a large share of new users, and that both interviewees who imported were hurt by it. We are much less sure how much it explains the activation gap between importers and blank-start users. The data can't separate the bug from the fact that importers are a different kind of user. That uncertainty doesn't change the ranking. A known bug that sits at the very start of onboarding for ~45% of signups is cheap to justify fixing. Just don't promise a specific activation lift.

---

## Evidence ledger

| Source | What it is | Size | Weight |
|---|---|---|---|
| `activation.csv` | Weekly signup cohorts, 2026-07-06 → 2026-07-27, split by signup source | 3,775 signups (4 weeks × 2 sources) | Aggregates only. All cohorts are **after** the bug shipped (2026-06-30). |
| `interviews/01-marco.md` | Pro, ~5 months tenure, imported | 1 | Retained user who nearly churned |
| `interviews/02-aisha.md` | Free, ~3 weeks tenure, imported | 1 | Churned after ~1 week |
| `interviews/03-jun.md` | Free, ~2 months tenure, blank start | 1 | Retained weekly user |

## Metric definitions (from README-data.md)

- **Unit:** account. **Cohort:** signup week × signup source. Internal/test accounts are already excluded.
- **Day-7 tag rate** = accounts that created ≥1 tag within 7 days ÷ signups.
- **Week-4 active rate** = accounts with ≥1 note edit on days 22–28 ÷ signups.
- **Maturity:** the latest cohort (2026-07-27) reached day 28 by 2026-08-24, so every cohort is fully mature.
- `imported_notes` equals `signups` on every import row by definition, so it adds no information.

## Results

### Importers activate at about 60% of the blank-start rate, and the gap is the same every week

| Week | Source | Signups | Tag by day 7 | Active week 4 |
|---|---|---:|---:|---:|
| 07-06 | import | 410 | 23.4% | 20.0% |
| 07-06 | blank | 520 | 36.2% | 32.9% |
| 07-13 | import | 395 | 22.3% | 19.0% |
| 07-13 | blank | 540 | 37.2% | 33.3% |
| 07-20 | import | 430 | 23.5% | 20.0% |
| 07-20 | blank | 505 | 35.4% | 32.9% |
| 07-27 | import | 445 | 22.2% | 18.9% |
| 07-27 | blank | 530 | 36.2% | 33.0% |

Pooled, with 95% normal-approximation CIs:

| | Import (n=1,680) | Blank (n=2,095) | Gap (blank − import) |
|---|---:|---:|---:|
| Tag by day 7 | 22.9% (20.8–24.9) | 36.3% (34.2–38.3) | 13.4 pp (10.5–16.3) |
| Active week 4 | 19.5% (17.6–21.4) | 33.0% (31.0–35.0) | 13.6 pp (10.8–16.3) |

- The gap is not noise. It is about 13–14 pp, and every one of the four weeks falls within about 1 pp of the pooled rates.
- Importers make up **44.5%** of signups, so this group is not a niche.
- If importers activated at the blank-start rate, there would be ~228 more week-4-active accounts across these 4 cohorts (~57 per week). Treat this as a **ceiling**, not a forecast (see below).

### Interviews

| Theme | Who | Count |
|---|---|---|
| Import wipes original note dates | Marco (nearly quit), Aisha (quit) | 2/2 importers |
| Search only matches titles | Marco, Aisha, Jun | 3/3 |
| Tags are the reason to stay | Marco, Jun (Aisha "didn't get to tags") | 2/3 |
| PDF export would drive a Pro upgrade | Jun | 1/3 |

Aisha's story lines up with the funnel step by step: she imported, saw her dates were wrong, never reached tags, and was gone within a week. Dates were the core of her use case, because she was keeping 1:1 history in chronological order.

## Why we can't say the bug *causes* the gap

1. **No pre-bug baseline.** All four cohorts started after 2026-06-30. We have never seen importer activation without the bug, so the 13.6 pp gap is "importers vs. blank starters under the bug", not "with vs. without the bug".
2. **Self-selection.** People who import 400 notes are switchers with an existing system, and people who start blank chose a fresh start. Their intent, habits, and churn risk probably differ for reasons that have nothing to do with the bug. Some gap would likely remain even with a perfect import.
3. **Marco's timing doesn't fit the stated ship date.** He signed up about 5 months before 2026-09-03 (around April 2026) and saw the same date reset. Either the bug existed before 2026-06-30, there's a second import path with the same problem, or he misremembered. This matters a lot: if dates were broken before June 30, then pre-June cohorts aren't a clean baseline either. **Check this before relying on any before/after comparison.**
4. **Interview sample.** Three people, all recruited by us, and two of them retained. The interviews show *how* the bug hurts. They can't tell us *how often* it does.

## Second priority: search

All three users brought up title-only search without being asked, including both retained users. It's the only complaint that cuts across every segment. We have no quantitative data on it, though, and it seems to annoy people who stay more than it drives people away. That's why it ranks second: the import bug sits on the activation path, and search mostly affects retention and satisfaction. Both claims are cheap to check (see below).

PDF export is one user's monetization signal. Note it, but don't act on n=1.

## What to do

1. **Ship the import date fix.** It's a regression, so it doesn't need an experiment to justify it.
2. **Measure the effect** by comparing 4–6 post-fix import cohorts with the July cohorts. Use blank-start cohorts over the same weeks as a control for seasonality and acquisition mix (difference-in-differences on the import − blank gap). Our current weekly n (~400 importers) can detect a shift of roughly 4–5 pp or more in the gap over 4 weeks. Smaller effects will need more weeks.
3. **Before that, pull these:**
   - The same export for May–June 2026 cohorts (pre-June 30). If the importer gap was smaller then, that's the best observational evidence we can get that the bug is costing us. Resolve the Marco timing question first.
   - Day-1 and day-3 activity for importers. If the bug drives churn, importers should drop off right after import, more sharply than blank starters.
   - Import size distribution vs. activation. The harm should grow with the number of notes imported. This is a dose-response check.
4. **Search:** pull the zero-result rate and search → note-open rate from logs, and check whether queries that found nothing match words in note bodies. If that rate is high, build body search next.

## Privacy

The interview files contain first names plus role/employer-size details. This write-up only uses first names already present in the source files. The activation data is aggregate only.
