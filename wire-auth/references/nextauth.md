# NextAuth Provider Implementation

Read this reference only when the detected authentication provider is NextAuth. The examples target Next.js App Router with Prisma.

## Contents

- [Database sync](#nextauth--prisma)
- [Frontend auth hook](#for-nextauth)
- [Middleware](#middleware)
- [API route protection](#api-route-protection)
- [Environment variables](#environment-variables)

### NextAuth + Prisma

**Adapter handles sync automatically.** But you need callbacks for extra fields:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [/* your providers */],
  callbacks: {
    async session({ session, user }) {
      // Attach database user ID to session
      session.user.id = user.id;
      return session;
    },
    async signIn({ user, account, profile }) {
      // Custom logic on every sign-in (e.g., update last_login)
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });
      return true;
    },
  },
});
```

### For NextAuth

```typescript
// hooks/useAuthSync.ts
'use client';

import { useSession } from 'next-auth/react';

export function useAuthSync() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isNewUser: false, // NextAuth adapter handles creation
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
```

NextAuth is simpler because the adapter handles user creation. The hook is mostly a wrapper.

## Middleware

Create `middleware.ts` at the project root:

```typescript
export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*'],
};
```

## API Route Protection

For every API route that requires authentication:

```typescript
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ... your logic
}
```

## Environment Variables

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=... (generate with: openssl rand -base64 32)
DATABASE_URL=postgresql://...
```

Verify that `.env` and `.env.local` cannot be committed.
