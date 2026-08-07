# Supabase Auth Provider Implementation

Read this reference only when the project uses Supabase Auth. Supabase creates identities in `auth.users`; the trigger below mirrors app-specific fields into `public.users`.

## Contents

- [Public-user sync](#supabase-auth-no-separate-sync-needed)
- [Environment variables](#environment-variables)

### Supabase Auth (no separate sync needed)

Supabase Auth creates users in `auth.users` automatically. But you likely want a `public.users` table with app-specific fields:

```sql
-- Trigger to auto-create public user on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (auth_id, email, name, avatar_url)
  values (
    new.id::text,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Keep the service-role key server-side, use the anonymous key only where appropriate, and verify that `.env` and `.env.local` cannot be committed.
