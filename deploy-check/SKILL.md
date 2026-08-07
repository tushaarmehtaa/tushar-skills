---
name: deploy-check
description: Run a production preflight across release scope, tests, builds, secrets, migrations, dependencies, configuration, observability, and rollback. Use when deploying, pushing, or approving a release.
license: MIT
---

# Deploy check

Assess release readiness without deploying or pushing unless the user separately authorizes that action. A preflight can establish observed checks and unknowns; it cannot guarantee production safety.

## Workflow

1. Detect repository root, workspaces, package managers, CI config, deploy target, release branch/base, and current worktree state. Do not assume `origin/main` exists.
2. Determine release scope from the merge base or deployment range. Include committed, staged, unstaged, and untracked files as separate categories. Never overwrite or discard user changes.
3. Run the project’s existing verification commands in the same order/configuration as CI where feasible: formatting/lint, type checks, unit/integration tests, build, and relevant smoke tests. Do not use `npx` to download an undeclared checker when the project already defines scripts or lockfiles.
4. Scan staged content and release diff for likely credentials, private keys, tokens, connection strings, and accidentally tracked environment files. Filename matching alone is insufficient. Do not print discovered secret values.
5. Review dependency and lockfile changes, runtime/engine changes, generated artifacts, and known deployment-platform constraints. Report what was inspected; do not imply a vulnerability audit unless one actually ran.
6. Review migrations for target, ordering, backward compatibility, lock/rewrite risk, data backfill, expand-contract sequencing, and rollback/roll-forward plan. Never casually instruct the user to run a production migration before compatible code is deployed.
7. Diff environment-variable references and deployment config. Classify each value as public/server-secret/build-time/runtime and mark production presence as verified only if the target environment was actually inspected.
8. Check user-visible docs/release notes, monitoring/alerts, feature flags, scheduled jobs, queues, and third-party dashboard changes when relevant.

## Verdict

Return one of:

- `READY`: all required checks passed and no known blocker remains;
- `BLOCKED`: a reproducible release blocker exists;
- `NEEDS CONFIRMATION`: automated checks passed but external state or an authorized manual step is unverified.

## Output

Report release base/head and scope, commands with exit status, blockers, warnings, migrations and rollout order, config/secrets findings without values, external confirmations, rollback/roll-forward notes, and the evidence behind the verdict. Never say “safe to push” solely because type checking passed.
