# Check an Agent Skill package

`slashskills-check` checks a local skill's frontmatter, instruction body, and local Markdown references. It works on your own repository, not only Slashskills.

```bash
npx --yes --package=github:tushaarmehtaa/tushar-skills slashskills-check ./my-skill
npx --yes --package=github:tushaarmehtaa/tushar-skills slashskills-check ./skills --collection --json
```

The first command downloads this checker and its dependencies from GitHub/npm. After installation, the checker itself makes no network requests and never executes skill instructions or scripts. Inspect the source or pin a reviewed Git commit in the package URL when using it in automation.

For a local checkout:

```bash
npm ci
node scripts/check-skill.mjs /path/to/my-skill
```

Exit codes: `0` means no structural errors, `1` means a package failed checks, and `2` means invalid arguments or an unreadable collection. JSON output names the scope `structure-and-local-references`. Missing license metadata is a warning; a repository license may cover the package.

Collection mode checks immediate subdirectories containing SKILL.md. It deliberately skips unrelated trees rather than recursively scanning node_modules or an entire workspace. Symlinked package files are rejected instead of followed.

This is a structural checker, not a security scanner, complete Agent Skills specification validator, model benchmark, or runtime compatibility certification. It does not validate remote URLs or Markdown heading fragments.
