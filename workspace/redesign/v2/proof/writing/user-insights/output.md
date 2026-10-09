Fix the Apple Notes import date bug first. We can be sure it's hurting new users, but not yet how much fixing it will add to activation. The full write-up is in `insights.md`.

**What the data shows**
- **Users who import from Apple Notes activate at about 60% of the rate of users who start blank.** Week-4 active is 19.5% for importers vs 33.0% for blank starters, a gap of 13.6 points (95% CI 10.8–16.3). Tagging by day 7 shows the same gap: 22.9% vs 36.3%.
- **The gap holds in all four weeks**, so it's real and not noise.
- **Importers are 44.5% of signups**, so this is a large group.
- **Both interviewees who imported were hurt by the date bug.** Marco nearly quit. Aisha did quit within a week, before she ever reached tags. Her experience lines up with each step of the drop-off in the data.

**Why we can't say the bug causes the whole gap**
- **There's no before-the-bug comparison.** All four weeks of signups came after the bug shipped on June 30.
- **Importers are a different kind of user.** People switching over with hundreds of notes probably behave differently from people starting fresh, so some gap would likely remain even with a working import.
- **One interview doesn't fit the June 30 date.** Marco signed up around April and still hit the date reset. Either the bug is older than we think or there's a second cause. If it's older, May–June signups aren't a clean "before" comparison either, so check this first.

**Second priority: search.** All three users complained that search only matches titles, including the two who are still using the product. There are no numbers on it yet, though, so it ranks behind a known bug that hits nearly half of new users.

`insights.md` also covers how to measure the fix (compare import vs blank signups before and after it ships), which data to pull first, and how to check search in the logs. Python needed approval, so I calculated the rates and confidence intervals by hand. They're simple ratios, but rerun them if exact decimals matter.