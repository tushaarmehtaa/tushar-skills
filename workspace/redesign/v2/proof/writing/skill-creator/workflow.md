# How I write our weekly release notes (synthetic sample)

Every Friday I write release notes for Quillnote customers. I do it by hand and it takes about an hour.

1. Look at the merged pull requests since last Friday (`git log --merges --since="last friday"`).
2. Skip anything labeled internal, chore, refactor, or test. Customers don't care.
3. Group what's left into New, Improved, Fixed.
4. Rewrite each PR title in plain customer language. "fix: null check in importer" becomes "Imports from Apple Notes no longer fail on empty notes."
5. If a change only affects iOS or only web, say so in brackets: [iOS], [Web].
6. Never mention customer names, internal ticket numbers, or engineer names.
7. Keep the whole thing under 200 words. If there's nothing customer-facing, write one line: "Small fixes and performance work this week."
8. Save it as release-notes/YYYY-MM-DD.md.

Mistakes I've made before: including a refactor because the title sounded exciting; calling something "Fixed" when it was really a new behavior; forgetting the platform tag.
