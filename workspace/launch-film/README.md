# slashskills launch film

A 45-second launch film for slashskills.xyz, made in code. Final cut approved by Tushar on 11 Oct 2026.

Finals live outside git: `~/Movies/slashskills/slashskills-launch-2026-10-11-4k.mp4` (3840×2160) and `-1080p.mp4` (for X). `out/` holds the latest render.

## The story

| Time | Scene | What it says |
|---|---|---|
| 0–13s | Chrome + Google, 9pm to 5am | Three real problems typed into Google (auth, payments, deploying), tabs pile up, then a spiral of endless searches and a hard cut to black |
| 13–16s | Black card | "all i wanted was to build my app." |
| 16–19s | Every tab closes, the clock runs back | "focus on your app. skills take care of the rest." |
| 19–34s | Four demos, one bar of music each | auth (Clerk sign-in), payments (Dodo subscriptions), mobile (real screenshots), deploy-check (BLOCKED verdict in the agent card) |
| 34–39s | The skills wheel | "/skills" hub on the left, all 34 names radiating and turning on the right |
| 39–41s | Works where you already build | Claude Code, Codex, Cursor tiles with real marks |
| 41–45s | End card | slashskills mark, "34 skills for everything that isn't your app.", the install command pasted, slashskills.xyz |

Every change shown in a demo comes from a real run in `site/lib/skill-results.json`. The app screens are redrawn (the mobile screenshots are the real ones). Act 1's search results are written for the film.

## Run it

```bash
npm install
sh audio/fetch-samples.sh   # recorded effects, kept out of git
npm run audio               # schedule.json, then music.wav + sfx.wav
npm run dev                 # Remotion Studio on :3012
npm run stills -- 120 600   # review frames as JPGs in out/stills
npm run render              # 4K master, then a lanczos 1080p copy
```

## How it fits together

- `scripts/schedule.mjs` writes `src/schedule.json`: every keystroke, Enter, tab, scene start and beat timing, in frames. Picture and sound both read it, so they can't drift. Change timing here, never in a scene.
- `src/scenes/`: `Chrome.tsx` (macOS menu bar, tab strip, omnibox, pointer), `Google.tsx` (home, suggestions, results), `Browser.tsx` (act 1), `Captions.tsx` (black card and turn), `Tally.tsx` (the sample app's screens), `Beats.tsx` (demos and deploy-check), `Wheel.tsx` (all 34 skills), `Ending.tsx`.
- Everything is drawn at real UI size (Chrome at 1280×720, scaled 1.5×) and rendered at `--scale=2`, so text is crisp at 4K.
- `src/theme.ts` holds the site's colours and Geist fonts. `src/Logo.tsx` uses simple-icons, the same package the site uses.
- `audio/score.py` builds two stems. `music.wav` is synthesised (pads, piano, heartbeat; one bar per demo so the wipe lands on beat three). `sfx.wav` uses recorded effects: 62 single keystrokes sliced from a real laptop recording, a mouse click, Kenney drop and click sounds, a soft confirmation tone, an explainer pop, a negative tap for the verdict. To use a licensed track, replace `public/audio/music.wav` and keep `sfx.wav`.

## Licences

- Kenney Interface Sounds: CC0.
- Mixkit sound effects: Mixkit Sound Effects Free License. Fine inside the video, not to be redistributed as files, which is why `audio/samples/` is gitignored and `fetch-samples.sh` downloads them.
- Brand marks (Google, Clerk, Supabase, Stripe, Vercel, Dodo, Claude Code, Codex, Cursor and the act 1 sites) are used to name the tools, nothing more.

## What we learned (Tushar's feedback, in order)

1. **Typewriter effects irritate when they're fast and loud.** A word-by-word blur was "irritating" too. What worked: real typing in a real UI (Google with its suggestion dropdown), at human pace, with quiet real keystrokes.
2. **Copy has to sound like a person.** "same week. with /slashskills." was rejected. "now you can with X" is ad voice. Keepers: "all i wanted was to build my app.", "focus on your app.", "34 skills for everything that isn't your app."
3. **Show the real thing.** Real Chrome and Google beat a stylised browser. Real logos everywhere. Fonts and colours from the live site, never new ones.
4. **Less information per screen.** One line, one visual, one proof line. Cut topbars, durations and "you typed" prompts.
5. **Show what the skill changes,** as a before/after on the actual app, not as a list of rows.
6. **Consistency beats a big moment.** A full-screen red BLOCKED felt like it came from nowhere. The same card layout as the other demos, with a red badge inside, worked.
7. **Sound design:** synthesised clicks and pops sound cheap. Recorded effects are better, but whooshes still read as ugly and were all removed. Terminal typing at 20–30 keys a second clatters; type at search pace or paste the command. Typing should sit about 8 dB under the music. Keep the black-card cut fully silent.
8. **Length and structure:** 45 seconds. Three problems are enough, then the spiral. Three or four demos. Then everything at once (the wheel), where it works, how to get it.
9. **Pacing:** slow where people read (results pages, demo lines, the verdict), fast where the feeling matters (the spiral, closing tabs, transitions).
10. **I can't watch or hear the film.** Review every change as still frames (`npm run stills`) and measured audio levels before rendering, and say plainly that the sound needs a human ear.

## Open

- A licensed music track (Artlist, Epidemic Sound or Musicbed) is the biggest quality jump left. Drop it in as `music.wav` and re-time cuts to its downbeats.
- A 4:5 version for the X feed, recomposed rather than cropped.
