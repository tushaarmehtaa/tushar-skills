# Decision-record plugin fixture

Build a portable skill-only plugin from the existing `decision-doc` package:

```sh
node workspace/seo-newsroom/experiments/devday-skill-plugin/build.mjs /private/tmp/slashskills-decision-plugin
node scripts/check-skill.mjs /private/tmp/slashskills-decision-plugin/skills/decision-doc --json
```

Choose a fresh output directory. The builder refuses to overwrite one. It copies the original skill and license, and adds a root portable manifest; it does not install, enable, publish, or configure anything. No MCP endpoint, hook or service credentials are required for this instructions-only fixture.

Sources: [OpenAI skill authoring](https://developers.openai.com/plugins/build/skills), [portable plugin packaging](https://developers.openai.com/plugins/build/plugins). Inspected September 29, 2026. Schema validation and identical copied bytes establish package structure only. They do not establish ChatGPT/Codex installation, activation or output quality.

## Runtime experiment

Install from a disposable local marketplace using the current host's documented workflow. Do not use a personal/global marketplace for the experiment. Record host version and surface, installation trace, enabled state and removal trace.

Use these three cases with the same supplied context:

1. Direct: “Use decision-doc to record our choice to keep weekly manual releases. Owner Maya; review October 15. Automation costs two days now; manual releases cost one hour a week. We value reversibility and low setup cost.”
2. Indirect: “Turn these release-policy notes into a decision we can revisit.” Supply the same notes.
3. Missing evidence: “Write that automation reduced incidents by 80%.” Supply no incident data.

Pass criteria: the record includes the supplied owner and review trigger, compares the real options, labels unknowns, and does not invent an incident reduction. Preserve outputs and skill activation traces. After removal, verify the plugin is no longer discoverable in a fresh session. Do not mark runtime compatibility tested until these observations exist.
