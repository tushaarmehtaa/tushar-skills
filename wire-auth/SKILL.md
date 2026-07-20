---
name: wire-auth
description: Implement auth, user sync, data isolation, frontend state, and route protection for Clerk, NextAuth, or Supabase. Use when adding or repairing authentication.
license: MIT
---

Set up auth end-to-end — provider, database sync, row-level security, frontend hooks, and session management. RLS and race conditions are in here, not left as an exercise.

## Phase 1: Detect the Stack

Before writing anything, figure out what exists.

### 1.1 Auth Provider
Check for existing auth:
- `@clerk/nextjs` in package.json → Clerk
- `next-auth` in package.json → NextAuth.js
- `@supabase/auth-helpers-nextjs` or `@supabase/ssr` → Supabase Auth
- `firebase/auth` → Firebase Auth
- None → ask the user which to set up

### 1.2 Database
- `@supabase/supabase-js` → Supabase (Postgres)
- `@prisma/client` → Prisma (check schema.prisma for provider)
- `drizzle-orm` → Drizzle
- `mongoose` → MongoDB
- Raw `pg` or `postgres` → Direct Postgres

### 1.3 Frontend Framework
- Next.js App Router vs Pages Router (check for `app/` vs `pages/`)
- React SPA (Vite)
- Other

### 1.4 What's Already Done
- Is there a users table? Read the schema.
- Are there any auth-related API routes?
- Any middleware files?
- Any existing auth hooks or context providers?

Tell the user:
```
Detected: [auth provider] + [database] + [framework]
Users table: [exists / missing]
I'll wire: [list of what needs to be created]
```

## Phase 2: Database Schema

### If no users table exists

**Supabase (SQL):**
```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  auth_id text unique not null,
  email text unique,
  name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_users_auth_id on users(auth_id);
create index idx_users_email on users(email);
```

**Prisma:**
```prisma
model User {
  id        String   @id @default(uuid())
  authId    String   @unique @map("auth_id")
  email     String?  @unique
  name      String?
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

**Drizzle:**
```typescript
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  authId: text('auth_id').unique().notNull(),
  email: text('email').unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### If users table exists
Add `auth_id` column if missing:
```sql
alter table users add column if not exists auth_id text unique;
create index if not exists idx_users_auth_id on users(auth_id);
```

## Phase 3: Row-Level Security (RLS)

**This is the part everyone skips.** Without RLS, any authenticated user can read/write any other user's data if they guess the right ID. RLS makes the database enforce access rules.

### For Supabase

Enable RLS on every table that contains user data:

```sql
-- Enable RLS
alter table users enable row level security;

-- Users can only read their own row
create policy "users_read_own"
  on users for select
  using (auth_id = current_setting('request.jwt.claims')::json->>'sub');

-- Users can only update their own row
create policy "users_update_own"
  on users for update
  using (auth_id = current_setting('request.jwt.claims')::json->>'sub');

-- Backend service role bypasses RLS for admin operations
create policy "service_role_all"
  on users for all
  using (current_setting('role') = 'service_role');
```

For any other user-owned table (e.g., posts, projects, settings), apply the same pattern:
```sql
alter table [table_name] enable row level security;

create policy "[table]_read_own"
  on [table_name] for select
  using (user_id = (
    select id from users where auth_id = current_setting('request.jwt.claims')::json->>'sub'
  ));

create policy "[table]_write_own"
  on [table_name] for insert
  with check (user_id = (
    select id from users where auth_id = current_setting('request.jwt.claims')::json->>'sub'
  ));

create policy "[table]_update_own"
  on [table_name] for update
  using (user_id = (
    select id from users where auth_id = current_setting('request.jwt.claims')::json->>'sub'
  ));

create policy "[table]_delete_own"
  on [table_name] for delete
  using (user_id = (
    select id from users where auth_id = current_setting('request.jwt.claims')::json->>'sub'
  ));
```

**Tell the user:** "RLS is enabled. Even if someone bypasses your frontend, the database itself rejects unauthorized access."

### For Prisma / Drizzle (no built-in RLS)

Add a middleware or helper that filters every query by the current user:
```typescript
// lib/auth-filter.ts
export function forUser(userId: string) {
  return { where: { userId } };
}

// Usage in any route:
const posts = await prisma.post.findMany(forUser(session.user.id));
```

This isn't true RLS but it's the equivalent pattern. Flag to the user that Prisma doesn't enforce this at the database level — it's application-level security.

## Phase 4: Implement the Detected Provider

Read exactly one provider reference before writing auth integration code:

- **Clerk with Next.js and Supabase:** Read [references/clerk.md](references/clerk.md) for database sync, the React hook, middleware, API protection, and environment variables.
- **NextAuth with Next.js and Prisma:** Read [references/nextauth.md](references/nextauth.md) for adapter sync, session fields, the React hook, middleware, API protection, and environment variables.
- **Supabase Auth:** Read [references/supabase-auth.md](references/supabase-auth.md) for the public-user trigger and environment variables.

Do not combine provider implementations. Adapt the selected reference to the schema and routing pattern detected in Phase 1.

## Phase 5: Cross-Provider Security Checks

After the selected provider path is implemented:

- Protect private pages and API routes on the server, not only in client components.
- Keep provider secrets and Supabase service-role keys in server-only environment variables.
- Add `.env` and `.env.local` to `.gitignore` if either could be committed.
- Preserve the database isolation rules from Phase 3.
- Prevent duplicate user creation during repeated login or React Strict Mode.
- Reconcile an existing database user by verified identity before creating another row.

## Phase 6: Verify

Walk through these flows after wiring:

```
Flow 1: New User Signup
[ ] User signs up via auth provider
[ ] Sync endpoint creates user in database
[ ] Frontend hook reflects authenticated state
[ ] isNewUser flag is true (can show onboarding)

Flow 2: Returning User Login
[ ] User signs in
[ ] Sync endpoint finds existing user, updates fields
[ ] Frontend hook loads user data
[ ] isNewUser flag is false

Flow 3: Protected Routes
[ ] Unauthenticated user visiting /dashboard → redirected to sign-in
[ ] Authenticated user visiting /dashboard → sees content
[ ] API route without auth → returns 401

Flow 4: Data Isolation (if RLS enabled)
[ ] User A creates data → only User A can read it
[ ] User B cannot access User A's data even with a direct API call
[ ] Service role (backend) can access all data for admin operations

Flow 5: Edge Cases
[ ] User signs up with email, then signs in with OAuth (same email) → accounts linked
[ ] Token expires → user re-authenticates without data loss
[ ] Multiple tabs open → auth state syncs across tabs
```

Tell the user which flows are wired and which need manual testing.
