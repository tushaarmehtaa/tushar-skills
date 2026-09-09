# Slashskills for Claude Code

A focused bundle for reviewing a release and documenting the decision: `deploy-check`, `decision-doc`, `changelog`, and `readme`. Other skills remain available individually through the skills CLI.

## Install

In Claude Code:

```text
/plugin marketplace add tushaarmehtaa/tushar-skills
/plugin install slashskills@slashskills
```

Restart Claude Code or reload plugins when prompted. Invoke a workflow explicitly:

```text
/slashskills:decision-doc Record why we are delaying this release until the migration rollback is checked.
/slashskills:deploy-check Review this release against our existing CI and deployment configuration. Do not deploy.
```

The plugin uses the original skill directories in this repository, so package instructions and their website counterparts share the same source. It contains no hooks, MCP servers, background processes, or additional executables. Repository workflows still need the agent's normal file and terminal tools; installation does not grant permissions or trigger a deployment.

To remove it:

```text
/plugin uninstall slashskills@slashskills
```

## Validation

```bash
claude plugin validate .claude-plugin/plugin.json --strict
claude plugin validate .claude-plugin/marketplace.json --strict
```

Validation checks structure. Individual task outcomes depend on the model, runtime, project, and available tools. This is an independently maintained community plugin, not an Anthropic-endorsed or verified plugin.
