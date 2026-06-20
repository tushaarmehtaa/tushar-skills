---
name: supabase
description: Wire up Supabase for a project or extend an existing integration. Covers schema design, RLS policies, migrations, TypeScript type generation, and auth sync with external providers.
category: devops
tags: [supabase, postgres, rls, auth, migrations, typescript]
author: tushaarmehtaa
---

Set up or extend a Supabase integration from schema to type-safe queries.

## Context to read

- `supabase/` directory if it exists
- Any `*.sql` files in the repo
- `.env.local` or `.env` for `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Auth config (Clerk, Auth0, or Supabase Auth)
- `package.json` for `@supabase/supabase-js` version

## Steps

### 1. Check what exists

```bash
ls supabase/ 2>/dev/null
cat supabase/config.toml 2>/dev/null
```

Is Supabase initialized? Are there existing migrations? Which tables exist?

### 2. Schema design

For each new table:
- `uuid` primary key with `gen_random_uuid()` default
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- `user_id` for user-owned rows

If using an external auth provider (Clerk, Auth0), store their user ID as text — not a reference to `auth.users`:

```sql
user_id text not null  -- clerk user_id, not uuid ref to auth.users
```

### 3. RLS policies

Enable RLS on every table that holds user data. **Never leave RLS enabled with no policies — every query will fail silently and return empty results, not an error.**

```sql
alter table public.your_table enable row level security;
```

Three canonical patterns. Pick the one that matches the table:

**Pattern A — User owns row** (most common: posts, files, credits, settings)
```sql
-- Supabase Auth
create policy "select own" on public.your_table for select using (user_id = auth.uid()::text);
create policy "insert own" on public.your_table for insert with check (user_id = auth.uid()::text);
create policy "update own" on public.your_table for update using (user_id = auth.uid()::text);
create policy "delete own" on public.your_table for delete using (user_id = auth.uid()::text);

-- External auth (Clerk / Auth0) — user_id is the JWT sub claim
create policy "select own" on public.your_table for select using (user_id = (auth.jwt() ->> 'sub'));
create policy "insert own" on public.your_table for insert with check (user_id = (auth.jwt() ->> 'sub'));
create policy "update own" on public.your_table for update using (user_id = (auth.jwt() ->> 'sub'));
create policy "delete own" on public.your_table for delete using (user_id = (auth.jwt() ->> 'sub'));
```

**Pattern B — Team owns row** (workspaces, shared projects)
```sql
-- Users can access rows where their user_id is in the team_members join table
create policy "select team rows" on public.your_table for select
  using (
    team_id in (
      select team_id from team_members where user_id = (auth.jwt() ->> 'sub')
    )
  );
-- Repeat for insert/update/delete with same team_id check
```

**Pattern C — Admin bypass** (service role for background jobs, webhooks)
```sql
-- Webhooks and cron jobs use the service role key, which bypasses RLS entirely.
-- Never use the service role key in client-side code.
-- In Next.js route handlers that need admin access:
import { createClient } from '@supabase/supabase-js';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // server-side only, never expose
);
```

For each new table: generate all 4 CRUD policies (select, insert, update, delete). Don't leave gaps — a table with only a select policy will silently block all inserts.

### 4. Migrations

```bash
supabase db diff --file describe_the_change
supabase migration up
```

Always generate a named migration file. Never edit the schema directly in production. If no Supabase CLI:

```bash
npx supabase db diff --file describe_the_change
```

### 5. Generate TypeScript types

```bash
supabase gen types typescript --local > src/types/supabase.ts
# or for remote:
supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

Import the generated types in every query. Do not use `any` for Supabase results.

### 6. Client setup

```ts
// lib/supabase.ts — browser client
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

```ts
// lib/supabase-server.ts — server components / route handlers
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );
}
```

### 7. Output

Report:
- Tables created or modified
- RLS policies set (and which auth strategy they use)
- Migration files written
- Type generation command confirmed
- Any auth edge cases (external provider JWT claims, service role usage)
