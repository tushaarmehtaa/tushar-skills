I wrote the readout to `results/readout.md`. My answer is no, don't ship Monday. The checklist arm does look better, but the test result isn't valid as it stands.

**Why:**

- **The arms are uneven.** Assignment was meant to be 50/50, but control has 10,120 users and the checklist arm has 9,480. A gap that size is very unlikely to be chance (p ≈ 5×10⁻⁶). About 640 users are missing from the checklist arm.
- **The missing users are probably the crash victims.** From Sept 6 to 8, the checklist page crashed for Safari users with ad blockers and sent them back to the login page. If those users were dropped, the checklist arm is left with people who were more likely to do well anyway, which would make it look better than it is.
- **The lift depends on those users.** The primary metric (3 notes created by day 7) is up 2.0 percentage points: 37.0% vs 35.0%. If 35 or fewer of the 640 missing users would have reached 3 notes, the lift disappears. If none would have, the checklist comes out slightly behind control (−0.35 points). Since they hit a crash, a low success rate seems likely.
- **We can't see who actually saw the checklist.** The "exposed" column is just a copy of the assigned count, so there's no record of who the checklist was shown to.
- **The checklist made onboarding slower, not faster.** The hypothesis was that it gets users to their "aha" moment faster, but median onboarding time went up by 36 seconds. The guardrail metrics (support tickets, week-2 activity) look flat, but they come from the same skewed sample.

**Path to a real answer:** the fastest step is to find those 640 users in the flag tool's assignment log. If they were assigned but left out of the analysis, put them back and re-run it, which could take days rather than another two-week test. Re-running with Sept 6–8 removed from both arms would be useful supporting evidence. The readout also includes a ship rule written before anyone looks at the data again, so the decision isn't shaped by the new numbers.

All the figures come from the two-row summary CSV. With daily or per-user data, the Sept 6–8 check could be done now.