# Decision Record: Ship Now vs. Fix Failing Migration Test First

**Date:** 2026-09-10
**Status:** Decided
**Owner:** Maya
**Participants:** Maya (decision owner)

## Decision Statement
Whether to ship the app today with a known failing migration test, or delay shipping to fix that test first.
**Deadline:** 2026-09-12

## Context
The app has a known failing migration test. Today is 2026-09-10, two days before the deadline. A fix for the test is estimated to take one day, and a two-day delay to the ship date is acceptable.

## Constraints
- Deadline: 2026-09-12 (no later)
- Fix effort: 1 day
- Tolerable delay: up to 2 days

## Decision Drivers
1. **Risk of shipping with a known failing migration test** — the failure mode of the test is not specified in the supplied facts, so its downstream risk (e.g., data integrity, deploy failure) is an *assumption*, not a measured fact.
2. **Time cost vs. available slack** — whether the fix fits inside both the deadline and the acceptable-delay window.
3. **Reversibility** — a bad migration is typically costly or difficult to reverse once run against production data, which raises the bar for shipping with a known defect.

## Evidence and Assumptions
- **Fact:** Migration test is currently failing.
- **Fact:** Fix takes 1 day.
- **Fact:** 2-day delay is acceptable; deadline is 2026-09-12.
- **Assumption:** The failing test reflects a real defect in the migration (not a flaky/false-positive test) — not confirmed in the supplied facts, and is the main residual uncertainty in this record.
- **Assumption:** No other blocking work competes for the 1-day fix window.

## Options

| Option | Description |
|---|---|
| A. Ship today, migration test still failing | Status quo path — ship immediately, defer the fix |
| B. Fix the test first, then ship | Spend 1 day fixing, then ship |

## Comparison

| | Strongest argument for | Strongest argument against |
|---|---|---|
| **A. Ship today** | Fastest path to shipping; no delay to users/stakeholders | Ships a known defect in the migration path — migrations are generally hard to reverse once run against real data; the actual risk is unverified since the failure's root cause isn't confirmed |
| **B. Fix first, then ship** | Fully consumes the acceptable delay budget only partially (1 of 2 days) and still lands 1 day before deadline; removes a known, unresolved defect before it touches production | Delays shipping by 1 day versus Option A |

## Decision
**Fix the test first, then ship (Option B).**

**Confidence: High.**

**Rationale:** The fix (1 day) fits comfortably inside both the acceptable delay (2 days) and the deadline (2026-09-12), leaving a full day of buffer. There is no stated benefit to shipping today that outweighs deploying a known-failing migration test when slack exists to fix it first and still land on time. Given migrations are typically difficult to reverse, absorbing 1 day of slack that was already deemed acceptable is the lower-risk path.

## Consequences
- Ship date moves from today (2026-09-10) to tomorrow (2026-09-11), one day later than the fastest option but still 1 day ahead of the 2026-09-12 deadline.
- Gives up the marginal speed of shipping today; this is an explicit, accepted tradeoff since the delay budget was pre-approved.

## First Action
Maya begins the migration test fix today, 2026-09-10.
**Due:** Fix complete and verified by end of day 2026-09-11; ship by 2026-09-12 (deadline) or earlier.

## Review / Expiry Trigger
If the fix is not complete by end of day 2026-09-11, re-open this decision immediately — the deadline requires a second decision at that point (ship with a known-failing test, or slip past the deadline).

## Unresolved Risks / Dissent
- The actual severity/root cause of the failing migration test is not established in the supplied facts. If further information shows the failure is a false positive or trivial, this record should be revisited — the recommendation could reasonably shift toward Option A.
- No dissenting stakeholder input was supplied; this record reflects a single-owner decision.

---
Let me know if you'd like this saved to a file in the repo (e.g., under `docs/decisions/`).