# Slashskills product principles

## Authority and benchmark

On September 9, 2026, Tushar designated https://www.skills.sh/ as the gold-standard reference for Slashskills decisions, alongside our own thinking. Apply this to information architecture, UX, visual hierarchy, skill discovery, installation, content placement, SEO surfaces, and trust signals. This is a standing product preference, not a request to clone the site or add every feature it has.

Before a material product decision, inspect the relevant current skills.sh surface and compare its reader journey with ours. Identify the user job, the useful pattern, the decision for Slashskills, and the reason for any departure. Keep this reasoning proportional to the change; do not introduce an approval ritual for routine fixes. A reference site's popularity does not prove that every choice will work for our audience.

Explicit user direction and observed Slashskills behavior take precedence. Provider documentation remains the source for model, runtime and protocol claims; skills.sh is the product benchmark and an ecosystem discovery source, not authority for every technical claim.

## Standing decisions

1. **The homepage serves skill discovery and installation.** Do not place guides, articles, experiments, or editorial promotions on the homepage. The user explicitly rejected that hierarchy. Preserve the skill catalog as the main product surface.
2. **Make the shortest useful journey obvious:** find a relevant skill → understand its purpose and requirements → install it. Supporting information must earn its position by helping that decision.
3. **Guides live at `/guides` and on their own URLs.** Link them contextually from relevant skills. A successful SEO idea does not automatically deserve homepage space.
4. **Skill detail pages should explain and enable use early.** Favor the purpose, install action, and genuinely necessary requirements before long source content or metadata. Distinguish setup help from the package itself.
5. **Use progressive disclosure.** Keep source, references, alternate installation paths, and background available without making every visitor process all of them first. Preserve keyboard access and mobile usability.
6. **Use real evidence for trust.** Never fabricate installs, popularity, rankings, audits, compatibility or outcomes to resemble a benchmark. Our own package provenance, requirements, validation and recorded tests supply our evidence.
7. **Adapt to our scale.** A curated 34-skill library does not automatically need leaderboards, trending tabs, packs, or many topic pages. Add a surface when it improves a demonstrated reader job.
8. **Keep editorial discovery ambitious.** Model and media launches can lead to useful skills, recipes and experiments. Evaluate those opportunities without turning the homepage into a news feed or publishing unperformed tests as findings.
9. **Validate the decision, not just the code.** Check hierarchy, content placement, findability and the complete mobile/desktop journey as well as links, interactions and build status. Passing tests alone is not proof of a good UX decision.

## Inspected benchmark evidence — September 9, 2026

These observations come from retrieved page content and link structure, not an interactive usability study or pixel-level visual audit. Reinspect the relevant page before relying on details that may change.

| Source | Observed pattern | Application to Slashskills |
| --- | --- | --- |
| [Homepage](https://www.skills.sh/) | Brief explanation, install command, skill search and leaderboard; supporting areas in navigation. | Skills and installation lead the homepage. Use their clear task hierarchy; do not copy unsupported popularity metrics. |
| [Skill detail](https://www.skills.sh/anthropics/skills/frontend-design) | Breadcrumb, skill identity, installation, summary, source content and related skills. | Bring purpose and installation forward. Keep long package material available after the immediate decision. |
| [Documentation](https://www.skills.sh/docs) | Separate documentation surface for discovery, installation, CLI and related help. | Maintain a separate Guides destination and contextual links. |
| [Topics](https://www.skills.sh/topic) | Domain collections provide alternate routes to relevant skills. | Existing category search/filtering is the first option; create topic pages only if our catalog warrants them. |

## Review of this session's decisions

- **Guides above skills on the homepage:** wrong for the product and explicitly rejected; removed. Do not restore through another visual treatment.
- **Dedicated guide pages with related skill links:** fits the supporting-content role; retain.
- **Guide contents, readable typography and copyable examples:** useful for the reading task; retain, with runtime/UI verification.
- **New image-editing package:** a concrete catalog artifact; keep its untested status honest. Topic timeliness does not justify special homepage ordering.
- **Skill detail and installer density:** next review area. The current UI exposes substantial package metadata and multiple runtime surfaces. Compare it with the benchmark's install-first sequence before proposing changes; this is a review hypothesis, not evidence of measured conversion loss.
- **SEO:** maintain useful canonical pages and connect them to relevant skills. Traffic acquisition supports product use; it does not determine the homepage hierarchy.
