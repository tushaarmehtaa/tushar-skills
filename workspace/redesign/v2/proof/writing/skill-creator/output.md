I've written a `release-notes` skill in `skills/release-notes/`. I haven't run it yet: running the helper script needed approval in this session, so the script and the skill are both untested.

**What I created:**
- **`SKILL.md`**: your Friday steps written as instructions the agent follows:
  1. Collect the PRs merged since the last notes.
  2. Drop anything labeled internal, chore, refactor or test.
  3. Sort the rest into New, Improved or Fixed, rewrite each in plain customer language, and add `[iOS]`/`[Web]` tags.
  4. Keep it under 200 words, with your one-line message for an empty week, and save it as `release-notes/YYYY-MM-DD.md`.
  5. Check the file before reporting back.

  Each of the three mistakes you listed has its own rule and check. The skill is used for requests like "write the release notes" or "what did we ship to customers this week", but not for internal summaries like standup notes.
- **`scripts/collect_prs.py`**: lists the merged PRs as JSON, including labels, changed files and descriptions.
- **`evals/evals.md`**: 12 test prompts with the expected behaviour, including one for each of your past mistakes, plus name and ticket-number leaks, the 200-word limit, a missing `gh` tool, and a same-day re-run.

**Changes from how you do it by hand:**
- **Labels:** `git log` can't see PR labels. The script gets them from GitHub using the `gh` tool. If `gh` isn't available, it reads only your local git history, so the agent guesses the category from title prefixes like `chore:` and from which files changed. It tells you when it did that.
- **Date range:** it starts from the date of your most recent notes file rather than "last friday". That avoids missing or repeating PRs if a week is skipped or you run it on a different day. You can still give it a range yourself.
- **Leaks:** merge commits contain things like "from alice/QN-412-acme-export", so the final check specifically looks for names, handles and ticket or PR numbers.
- **Limits:** it writes the file but never commits or publishes it. It asks before overwriting an existing note. Its report lists every PR it excluded, so you can catch a wrong exclusion.

**Running the test:** I wrote a test that builds a throwaway repo with a real merge, a squash merge, a direct commit and an earlier notes file, then checks the script's error handling. It needed approval, so it never ran. To run it:

```
bash ../../../tests/test_collect.sh "$PWD/skills/release-notes/scripts/collect_prs.py"
```

(The test lives in `scratchpad/tests/`, outside this folder.) The `gh` path, which reads labels from GitHub, also needs your Quillnote repo with GitHub access.

**Assumptions to check:**
- iOS and web changes can be told apart by file paths such as `ios/`, `*.swift`, `web/` and `*.tsx`. If your repo is laid out differently, change that line in `SKILL.md`.
- I added a few things to the "customers don't care" list: docs-only changes, CI and build work, and dependency bumps. Remove them from step 2 if you'd rather see those.