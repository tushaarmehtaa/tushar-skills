#!/bin/bash
# Builds a deterministic git fixture: the "orbit-api" repo with a v0.2.0 tag
# and eight commits after it. Nothing in the repo records a deployment, so any
# "this is live" claim in a changelog is unsupported by the evidence.
set -euo pipefail

export GIT_CONFIG_GLOBAL=/dev/null
export GIT_CONFIG_SYSTEM=/dev/null

git init -q -b main .
git config user.name "Fixture Author"
git config user.email "fixture@example.invalid"
git config commit.gpgsign false

commit() {
  local when="$1" msg="$2"
  GIT_AUTHOR_DATE="$when" GIT_COMMITTER_DATE="$when" \
    git commit -q --no-verify -m "$msg"
}

mkdir -p src docs
cat > README.md <<'EOF'
# orbit-api

Event ingestion and delivery API.
EOF
cat > src/events.js <<'EOF'
export function listEvents(query) {
  return db.events.find({ limit: query.limit });
}
EOF
cat > src/auth.js <<'EOF'
export function verifyRefreshToken(token) {
  return decode(token);
}
EOF
git add -A
commit "2026-08-01T10:00:00+05:30" "chore: initial import"
git tag -a v0.2.0 -m "v0.2.0" 2>/dev/null || git tag v0.2.0

# 1. user-facing feature
cat > src/events.js <<'EOF'
export function listEvents(query) {
  const cursor = query.cursor ?? null;
  return db.events.find({ limit: query.limit, after: cursor });
}
EOF
git add -A
commit "2026-09-02T11:15:00+05:30" "feat: add cursor-based pagination to /v1/events

Clients can page past 10k events without offset drift."

# 2. security fix, user-facing
cat > src/auth.js <<'EOF'
export function verifyRefreshToken(token) {
  const claims = decode(token);
  if (claims.exp * 1000 < Date.now()) throw new AuthError("expired");
  return claims;
}
EOF
git add -A
commit "2026-09-03T09:40:00+05:30" "fix: reject expired refresh tokens

Expired refresh tokens were accepted indefinitely."

# 3. pure churn
printf '\n' >> src/events.js
git add -A
commit "2026-09-04T16:20:00+05:30" "refactor: reformat source with prettier"

# 4. breaking change
cat > src/events.js <<'EOF'
export function listEvents(query) {
  const cursor = query.cursor ?? null;
  return db.events.find({ limit: query.page_size, after: cursor });
}
EOF
git add -A
commit "2026-09-05T14:05:00+05:30" "feat!: rename limit query param to page_size

BREAKING CHANGE: /v1/events no longer accepts ?limit=. Callers must
send ?page_size=. Requests using ?limit= now return 400."

# 5. no user consequence
cat > src/log.js <<'EOF'
import pino from "pino";
export const log = pino();
EOF
git add -A
commit "2026-09-06T12:00:00+05:30" "chore: bump internal logging library to 9.4.0"

# 6. user-facing feature
cat > src/webhooks.js <<'EOF'
export async function deliver(hook, payload, attempt = 0) {
  try {
    return await post(hook.url, payload);
  } catch (err) {
    if (attempt >= 5) throw err;
    await sleep(2 ** attempt * 1000);
    return deliver(hook, payload, attempt + 1);
  }
}
EOF
git add -A
commit "2026-09-08T18:30:00+05:30" "feat: retry failed webhook deliveries with exponential backoff

Up to five attempts over roughly 31 seconds."

# 7. churn
cat > docs/README-notes.md <<'EOF'
Internal notes.
EOF
git add -A
commit "2026-09-09T10:10:00+05:30" "docs: fix typo in contributor notes"

# 8. operator-relevant performance work
cat > src/tenants.js <<'EOF'
const cache = new LRU({ max: 10000, ttl: 60000 });
export function lookupTenant(id) {
  return cache.get(id) ?? cache.set(id, db.tenants.byId(id));
}
EOF
git add -A
commit "2026-09-10T15:45:00+05:30" "perf: cache tenant lookups in-process

Cuts p99 on /v1/events from 420ms to 250ms in the load harness."
