# who-to-sell-to: Claude Code verification, 2026-10-13

Claude Code 2.1.296, model claude-opus-5-5, npx skills 1.7.2, macOS 27.0. Fixture: a synthetic six-deal `deals.md` for an invented studio.

| Check | Result |
| --- | --- |
| Install from the pushed repository | Pass; installed SKILL.md byte-identical (sha256 f7d2de031648) |
| Automatic discovery, phrasings without the skill's keywords | 2 of 2 called the Skill tool |
| Explicit `/who-to-sell-to deals.md` | 1 of 1 loaded the skill and read the bundled references |
| Full workflow, fast path | 1 of 1: 145 s, 10 turns, $0.76; report has the ICP card, 8 collapsible sections and no example content; labels facts as told, not researched; lists gaps as open questions; raised the confidentiality check |
| Removal | `skills remove` left an empty lockfile and no skill folder |

| Interactive interview | Run live by the maintainer in Claude Code on 2026-10-13 and reported working; no transcript kept |

Limits: small counts, no without-skill baseline, and the headless runs above were single-turn. Bash was denied under `acceptEdits`; the agent wrote the file directly.
