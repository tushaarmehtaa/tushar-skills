# mdtally

A small command-line tool that counts the words in Markdown files and estimates how long they take to read. It skips code and link URLs, so you get the length of the prose only.

## Requirements

- Node.js 20 or newer
- No runtime dependencies

## Install

Run it straight from a checkout:

```sh
node bin/mdtally.js README.md
```

Or put `mdtally` on your `PATH` from the repository root:

```sh
npm install -g .
```

## Usage

```text
mdtally <file.md...> [--json] [--wpm=N]
```

| Option    | Effect                                                  |
| --------- | ------------------------------------------------------- |
| `--json`  | Print results as a JSON array instead of tab-separated lines |
| `--wpm=N` | Reading speed in words per minute (default `230`)       |

You can pass any number of files. If you pass none, mdtally prints the usage line and exits with status `2`.

### Examples

```console
$ mdtally test/sample.md
test/sample.md	5 words	1 min
```

```console
$ mdtally test/sample.md --json --wpm=100
[
  {
    "file": "test/sample.md",
    "words": 5,
    "minutes": 1
  }
]
```

## How counting works

Before counting, mdtally strips some Markdown syntax (see `src/count.js`):

- Fenced code blocks (` ``` `) and inline code spans are removed entirely.
- Links keep their text and lose their URL: `[the docs](https://…)` counts as 2 words.
- Heading markers and the characters `* _ > # -` become spaces. **Hyphenated words count as separate words** (`well-known` counts as 2).

The rest is split on whitespace. Reading time is `words / wpm`, rounded up to a whole minute, and is never less than 1 minute.

Limitations:

- `--wpm` is not validated. A non-numeric value such as `--wpm=abc` prints `NaN min`.
- A missing or unreadable file stops the run with a Node.js error, and no results are printed for the other files.
- Any other argument that starts with `--` is ignored without a warning.

## Library use

The counting functions are exported from `src/count.js`:

```js
import { countWords, readingMinutes, stripMarkdown } from "./src/count.js";

countWords("see [the docs](https://example.com)"); // 3
readingMinutes(231);                                 // 2
```

`package.json` does not declare a `main` or `exports` entry, so import the file by its path.

## Development

```sh
npm test       # node --test (built-in test runner)
npm run lint   # syntax check with node --check
```

Tests live in `test/count.test.js`. `test/sample.md` is the fixture used in the examples above.

## License

`package.json` declares the MIT license, but the repository has no `LICENSE` file yet.
