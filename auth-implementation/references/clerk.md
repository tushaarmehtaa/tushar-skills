# Clerk Provider Implementation

Read this reference only when the detected authentication provider is Clerk. The examples target Next.js App Router with Supabase persistence.

## Contents

- [Database sync](#clerk--supabase-most-common-indie-stack)
- [Frontend auth hook](#for-clerk--nextjs)
- [Middleware](#middleware)
- [API route protection](#api-route-protection)
- [Environment variables](#environment-variables)

### Clerk + Supabase (most common indie stack)

**API route** — `app/api/auth/sync/route.ts`:
```typescript
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service key bypasses RLS
);

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { email, name, imageUrl } = body;

  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('id, auth_id')
    .eq('auth_id', userId)
    .maybeSingle();

  let isNewUser = false;

  if (!existing) {
    // Also check by email (user might exist from a different auth method)
    const { data: byEmail } = email
      ? await supabase.from('users').select('id').eq('email', email).maybeSingle()
      : { data: null };

    if (byEmail) {
      // Link existing user to this auth provider
      await supabase
        .from('users')
        .update({ auth_id: userId, name, avatar_url: imageUrl })
        .eq('id', byEmail.id);
    } else {
      // Create new user
      await supabase.from('users').insert({
        auth_id: userId,
        email,
        name,
        avatar_url: imageUrl,
      });
      isNewUser = true;
    }
  } else {
    // Update existing user (name/avatar might have changed)
    await supabase
      .from('users')
      .update({ name, avatar_url: imageUrl, updated_at: new Date().toISOString() })
      .eq('auth_id', userId);
  }

  // Fetch the user's current state
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', userId)
    .single();

  return Response.json({
    user,
    isNewUser,
  });
}
```

### For Clerk + Next.js

```typescript
// hooks/useAuthSync.ts
'use client';

import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AuthState {
  user: any | null;
  isNewUser: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuthSync() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const [state, setState] = useState<AuthState>({
    user: null,
    isNewUser: false,
    isLoading: true,
    isAuthenticated: false,
  });

  // Prevent double-sync on React strict mode / fast re-renders
  const syncStarted = useRef(false);

  const syncUser = useCallback(async () => {
    if (!clerkUser || syncStarted.current) return;
    syncStarted.current = true;

    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clerkUser.primaryEmailAddress?.emailAddress,
          name: clerkUser.fullName,
          imageUrl: clerkUser.imageUrl,
        }),
      });

      const data = await res.json();

      setState({
        user: data.user,
        isNewUser: data.isNewUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      setState(prev => ({ ...prev, isLoading: false }));
      syncStarted.current = false; // Allow retry on error
    }
  }, [clerkUser]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      syncUser();
    } else if (isLoaded && !isSignedIn) {
      setState({ user: null, isNewUser: false, isLoading: false, isAuthenticated: false });
      syncStarted.current = false;
    }
  }, [isLoaded, isSignedIn, syncUser]);

  return state;
}
```

**Critical detail:** The `syncStarted` ref prevents double-sync. Without it, React strict mode calls the effect twice, creating duplicate users or race conditions. This is the bug that costs people 4 hours.

## Middleware

Create `middleware.ts` at the project root:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  // Add your public routes here
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
```

## API Route Protection

For every API route that requires authentication:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... your logic
}
```

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Keep the Supabase service-role key server-side and verify that `.env` and `.env.local` cannot be committed.
