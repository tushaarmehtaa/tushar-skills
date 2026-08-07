# Supabase Auth implementation

Read this reference only when the project uses Supabase Auth. Decide whether an application profile table is needed; `auth.users` already owns authentication identities.

## Contents

- [Profile synchronization](#profile-synchronization)
- [Sessions and authorization](#sessions-and-authorization)
- [Verification](#verification)

## Profile synchronization

If app-specific fields require `public.users`/`profiles`, use a migration-backed trigger with a fixed `search_path`, idempotent conflict behavior, and only the metadata fields the application trusts.

```sql
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = excluded.display_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row execute function public.handle_new_auth_user();
```

Adapt table/field names to the existing schema. Decide how deletion, email changes, anonymous users, and metadata trust are handled. Restrict function execution/grants as appropriate and review all `security definer` code.

## Sessions and authorization

Use current `@supabase/ssr` guidance for cookie-backed Next.js sessions: create clients per request, use `getAll`/`setAll`, await framework cookie APIs, and implement the required refresh proxy/middleware. Enforce access with RLS and server checks; a client auth hook is not authorization.

Prefer current publishable/secret key names when the project has migrated, while preserving supported legacy anon/service environment names until an intentional key migration.

## Verification

- Create/update/delete users and confirm profile lifecycle behavior.
- Replay the trigger path and confirm no duplicate profile.
- Test session refresh/expiry in the target runtime.
- Test RLS as owner, another user, and anonymous for every profile-backed resource.
- Run the migration from a clean local database and regenerate types.
