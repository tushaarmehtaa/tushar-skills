# Marketplace submission packet — 2026-09-10

Status: prepared, not submitted. The available browser reaches a sign-in screen; Claude Code CLI authentication does not authenticate the Console website. Native browser automation is currently unavailable.

## Claude plugin directory

Submission: https://platform.claude.com/plugins/submit
Name: Slashskills
Plugin ID: slashskills
Version: 0.1.0
Category: Productivity / developer workflows
Repository: https://github.com/tushaarmehtaa/tushar-skills
Manifest: .claude-plugin/plugin.json
Marketplace manifest: .claude-plugin/marketplace.json
Website: https://www.slashskills.xyz
Support: https://github.com/tushaarmehtaa/tushar-skills/issues
License: MIT
Description: Four workflows for reviewing releases, recording decisions, writing changelogs, and maintaining README documentation. Uses existing repository tools and permissions; does not deploy automatically.
Skills: deploy-check, decision-doc, changelog, readme.
Permissions: no hooks or MCP servers; repository workflows need normal file/terminal access granted by the user.
Validation: strict manifest validation passed; all four namespaced commands discovered in Claude Code; decision-doc invoked in a supplied-facts smoke scenario. Public marketplace add and plugin install both passed in an isolated configuration directory. This is not a certification of all skill outcomes.
Contact email is available through the connected Gmail account; browser sign-in remains the blocker.

## skills.sh pack

Create: https://www.skills.sh/packs/create
Name: Release review and documentation
Description: Review a release, record the decision, and prepare its changelog and README using four focused workflows.
Repository: tushaarmehtaa/tushar-skills
Skills: deploy-check, decision-doc, changelog, readme.
Status: Vercel sign-in required. Pack has not been created. User-owned Vercel team must be selected in the authenticated form.

## Other registries

agentskill.sh: attempted repository import at https://agentskill.sh/submit. Server response: Too many submissions. Please try again in an hour. Not accepted; retry after cooldown. Do not mistake this for an import confirmation.
SkillsMP: browser received a Cloudflare challenge. Index coverage is unverified. Do not bypass challenge or claim a listing.
