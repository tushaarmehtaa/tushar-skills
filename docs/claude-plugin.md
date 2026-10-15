# Slashskills for Claude Code

The repository's marketplace lists two plugins:

- **`slashskills`** (`plugin/`): the skills tested in Claude Code. `changelog`, `deploy-check`, `rate-limit`, `remove-ai-slop` and `who-to-sell-to`. Each one has a record in [`runtime-verification.json`](../runtime-verification.json).
- **`slashskills-labs`** (`plugins-labs/`): every other skill in the catalog, including `decision-doc` and `readme`. These work as plain Agent Skills but have no Claude Code verification record yet.

## Install

In Claude Code:

```text
/plugin marketplace add tushaarmehtaa/tushar-skills
/plugin install slashskills@slashskills
/plugin install slashskills-labs@slashskills
```

Restart Claude Code or reload plugins when prompted. Invoke a workflow explicitly:

```text
/slashskills:deploy-check Review this release against our existing CI and deployment configuration. Do not deploy.
/slashskills-labs:decision-doc Record why we are delaying this release until the migration rollback is checked.
```

Neither plugin has hooks, MCP servers, background processes, executables or user settings. Repository workflows still need the agent's normal file and terminal tools. Installing a plugin grants no permissions and triggers no deployment.

To remove them:

```text
/plugin uninstall slashskills@slashskills
/plugin uninstall slashskills-labs@slashskills
```

## How the plugins are built

The skill folders at the repository root are the source of truth, and `npx skills add` installs from them. Each plugin's `skills/` folder is a copy.

[`plugin-skills.json`](../plugin-skills.json) lists which skills go into which plugin. After editing a root skill or that list, rebuild and commit the copies:

```bash
npm run plugin:build
```

The build replaces each plugin's `skills/` folder and refuses images, fonts, archives and binaries. Each plugin's `.claude-plugin/plugin.json` is edited by hand.

## Validation

```bash
claude plugin validate --strict ./plugin
claude plugin validate --strict ./plugins-labs
claude plugin validate --strict .
```

Validation checks structure. Individual task outcomes depend on the model, runtime, project, and available tools. This is an independently maintained community plugin, not an Anthropic-endorsed or verified plugin.
