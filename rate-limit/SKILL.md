---
name: rate-limit
description: Wire rate limiting into any Next.js app. IP-based and user-based sliding window with Upstash Redis. Per-route config, 429 responses with Retry-After headers, middleware and route handler patterns. Use when adding rate limiting, preventing abuse, or protecting AI endpoints from cost overruns.
category: devops
tags: [rate-limit, upstash, redis, security, api, abuse-prevention]
author: tushaarmehtaa
---

Wire rate limiting into your Next.js app using Upstash Redis sliding window. Reads the project first, applies IP-based limiting by default, user-based when auth is available.

## Three things that silently break rate limiting

1. **Wrong Redis key scope.** Using just the IP address as the key means all routes share one counter. A user who hits `/api/generate` 50 times uses up the budget for `/api/auth/login` too. Always namespace keys: `rate:generate:${ip}` not `rate:${ip}`.
2. **No fallback when Redis is down.** If Upstash times out and you throw, the entire route fails. Rate limiting is best-effort — fail open (allow the request) when the store is unreachable, and log the failure.
3. **Not returning `Retry-After`.** Clients that hit a 429 without a `Retry-After` header will retry immediately, making the problem worse. Always include it.

## Phase 1: Detect the Project

```bash
cat package.json | grep -E "next|@upstash|upstash"
```

- **Next.js present?** → proceed
- **`@upstash/ratelimit` already installed?** → skip Phase 2, go to Phase 3
- **Auth provider?** (Clerk, NextAuth, Supabase Auth) → determines whether user-based limiting is available

## Phase 2: Install and Configure

```bash
npm install @upstash/ratelimit @upstash/redis
```

Add to `.env.example`:
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Tell the user: "Get these from console.upstash.com → your Redis database → REST API."

Create the rate limiter config — one place, all limiters defined here:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const rateLimiters = {
  // AI endpoints — expensive, tight limits
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),  // 10 req/min
    prefix: 'rate:ai',
    analytics: true,
  }),
  // Auth endpoints — loose limits, brute-force protection
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),  // 20 req/min
    prefix: 'rate:auth',
    analytics: true,
  }),
  // General API — default for everything else
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),  // 60 req/min
    prefix: 'rate:api',
    analytics: true,
  }),
};
```

## Phase 3: The Rate Limit Helper

One helper that route handlers call. Fail open on Redis errors:

```typescript
// lib/rate-limit.ts (add below rateLimiters)
import { headers } from 'next/headers';

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  try {
    const result = await limiter.limit(identifier);
    return result;
  } catch (error) {
    // Redis unavailable — fail open, log it
    console.error('Rate limit check failed:', error);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}

export function getIdentifier(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  // IP fallback — check forwarded headers for proxied deployments
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  return `ip:${ip}`;
}
```

## Phase 4: Apply to Routes

### In a Next.js API route handler

```typescript
// app/api/generate/route.ts
import { rateLimiters, checkRateLimit, getIdentifier } from '@/lib/rate-limit';

export async function POST(req: Request) {
  // Get identifier — prefer user ID if auth available
  const user = await getAuthUser(req);  // your auth helper
  const identifier = getIdentifier(req, user?.id);

  const { success, limit, remaining, reset } = await checkRateLimit(
    rateLimiters.ai,
    identifier
  );

  if (!success) {
    return Response.json(
      { error: 'Too many requests. Try again in a moment.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      }
    );
  }

  // Add rate limit headers to successful responses too
  const response = await handleRequest(req);
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  return response;
}
```

### In Next.js middleware (blanket protection for a path prefix)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  prefix: 'rate:middleware',
});

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

  try {
    const { success, reset } = await ratelimit.limit(ip);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
        },
      });
    }
  } catch {
    // fail open
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## Phase 5: Ask the User

After detecting the stack, confirm:

```
I'll wire rate limiting with Upstash Redis.

Per-route limits (adjust if needed):
- AI/generation endpoints: 10 req/min per user
- Auth endpoints: 20 req/min per IP
- General API: 60 req/min per user/IP

Which endpoints are highest priority to protect?
And do you want middleware-level protection (all /api/* routes)
or per-route (only specific handlers)?
```

Apply to the routes they name. For AI endpoints (anything calling an LLM), always use the tightest limiter — cost overruns happen fast.

## Verify

```
[ ] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.example
[ ] Rate limiter keys are namespaced by route prefix (rate:ai:, rate:auth:, etc.)
[ ] 429 responses include Retry-After header
[ ] Redis errors fail open (allow request, log error) — not throw
[ ] AI/LLM endpoints use tightest limits
[ ] Identifier uses user ID when available, IP as fallback
[ ] Middleware or per-route applied based on user's preference
[ ] Test: hit endpoint 11 times in 1 minute — 11th should 429
```
