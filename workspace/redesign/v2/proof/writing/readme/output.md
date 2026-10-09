I added `README.md` at the repo root. It covers mdtally 0.3.1, a Node CLI that counts words in Markdown files and estimates reading time.

**What's in it:** what the tool does, requirements (Node ≥ 20, no dependencies), install, usage and both flags, sample output, how words are counted, known limitations, how to use it as a library, how to run tests and lint, and the license.

**What I ran to check it (Node v23.11.0):**
- `npm test` passed all 3 tests, and `npm run lint` was clean.
- Both example outputs in the README are copied from real runs on `test/sample.md`.
- Running with no files printed the usage line and exited with status 2.
- The library example gives the values shown (3 and 2), and `well-known` counts as 2 words.
- `--wpm=abc` prints `NaN min`, and a missing file crashes with a Node error (exit 1) before any results print.

**Not run:** `npm install -g .`, because it changes your global setup. I only show installing from a checkout: there's no repository URL in `package.json` and nothing shows the package is on npm.

**Worth knowing:**
- The README lists three rough edges as limitations rather than hiding them: `--wpm` isn't validated, one bad file stops the whole run, and unknown `--` flags are silently ignored. Fixing them in the code would mean removing those notes.
- `package.json` says MIT, but there's no `LICENSE` file, and the README says so. Adding the file makes the license clear for anyone using the code.
- `package.json` has no `main` or `exports` entry, so the library example imports `src/count.js` by its path.
- I left out badges and screenshots because there's no CI or published package for them to point to.

I haven't committed anything.