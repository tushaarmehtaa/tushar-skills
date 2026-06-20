---
name: waitlist
description: Scaffold a complete waitlist. Email capture, duplicate detection, confirmation email via Resend, Supabase storage, admin view of signups, optional referral tracking. Use when launching a product, building an audience, or gating early access.
category: marketing
tags: [waitlist, email, launch, early-access, resend, supabase]
author: tushaarmehtaa
---

Scaffold a complete waitlist — email capture, storage, confirmation email, and an admin view. Reads the project first, wires into existing stack.

## Phase 1: Detect the Project

```bash
cat package.json | grep -E "next|supabase|prisma|drizzle|resend"
```

Check for:
- **Database**: Supabase / Prisma / Drizzle / raw Postgres?
- **Email**: Resend already installed?
- **Auth**: Any auth provider? (Admin view needs it)
- **Existing waitlist table?** Search for `waitlist` in schema files

## Phase 2: Ask the User

```
I'll scaffold a waitlist for [product name].

Quick decisions:

1. What info do you want to collect?
   a) Email only (default — highest conversion)
   b) Email + name
   c) Email + name + "what are you building?" (optional field)

2. Referral tracking?
   a) No — simple list
   b) Yes — each signup gets a unique referral link, referred count tracked

3. Confirmation email?
   a) Yes — send a "you're on the list" email via Resend (default)
   b) No

4. Do you have Resend and a verified sending domain? (yes / need to set up)
```

## Phase 3: Database Schema

Adapt to the detected database. Create a `waitlist` table:

**Supabase / raw SQL:**
```sql
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  note text,                              -- optional "what are you building?" field
  referral_code text unique,              -- their shareable code (if referral enabled)
  referred_by text references public.waitlist(referral_code),  -- who sent them
  referral_count integer default 0,       -- how many they've referred
  position integer,                       -- queue position (set by trigger)
  confirmed_at timestamptz,               -- null = unconfirmed
  created_at timestamptz default now()
);

-- Auto-increment position on insert
create or replace function set_waitlist_position()
returns trigger as $$
begin
  new.position = (select coalesce(max(position), 0) + 1 from public.waitlist);
  return new;
end;
$$ language plpgsql;

create trigger waitlist_position_trigger
  before insert on public.waitlist
  for each row execute function set_waitlist_position();
```

If no referral tracking needed, drop `referral_code`, `referred_by`, `referral_count`.

**Prisma:**
```prisma
model Waitlist {
  id           String    @id @default(cuid())
  email        String    @unique
  name         String?
  note         String?
  referralCode String?   @unique
  referredBy   String?
  referralCount Int      @default(0)
  position     Int
  confirmedAt  DateTime?
  createdAt    DateTime  @default(now())
}
```

## Phase 4: The Signup API Route

```typescript
// app/api/waitlist/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, name, note, referredBy } = await req.json();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  // Normalize
  const normalizedEmail = email.toLowerCase().trim();

  // Check for duplicate
  const existing = await db.query.waitlist.findFirst({
    where: eq(waitlist.email, normalizedEmail),
  });

  if (existing) {
    // Return success — don't tell spammers which emails are registered
    return NextResponse.json({
      success: true,
      position: existing.position,
      alreadyRegistered: true,
    });
  }

  // Generate referral code if enabled
  const referralCode = generateReferralCode(normalizedEmail);  // e.g., first 8 chars of email hash

  // Insert
  const entry = await db.insert(waitlistTable).values({
    email: normalizedEmail,
    name: name?.trim() || null,
    note: note?.trim() || null,
    referralCode,
    referredBy: referredBy || null,
  }).returning();

  // Increment referrer's count
  if (referredBy) {
    await db.update(waitlistTable)
      .set({ referralCount: sql`referral_count + 1` })
      .where(eq(waitlistTable.referralCode, referredBy));
  }

  // Send confirmation email (if Resend is set up)
  if (process.env.RESEND_API_KEY) {
    await sendWaitlistConfirmation({
      email: normalizedEmail,
      name: name || 'there',
      position: entry[0].position,
      referralCode,
    });
  }

  return NextResponse.json({
    success: true,
    position: entry[0].position,
    referralCode,
  });
}

function generateReferralCode(email: string): string {
  const { createHash } = require('crypto');
  return createHash('sha256').update(email).digest('hex').slice(0, 8);
}
```

## Phase 5: Confirmation Email

```typescript
// lib/emails/waitlist-confirmation.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWaitlistConfirmation({
  email, name, position, referralCode,
}: { email: string; name: string; position: number; referralCode?: string }) {
  const referralUrl = referralCode
    ? `${process.env.NEXT_PUBLIC_APP_URL}/?ref=${referralCode}`
    : null;

  await resend.emails.send({
    from: `[Product Name] <hi@yourdomain.com>`,
    to: email,
    subject: `you're #${position} on the list`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #111;">
        <p>Hey ${name},</p>
        <p>You're <strong>#${position}</strong> on the waitlist. We'll reach out when you're up.</p>
        ${referralUrl ? `
        <p style="margin-top: 24px;">
          Move up the list — share your link:<br>
          <a href="${referralUrl}" style="color: #000; font-weight: bold;">${referralUrl}</a>
        </p>
        ` : ''}
        <p style="color: #666; font-size: 13px; margin-top: 40px;">— [Your Name]</p>
      </div>
    `,
  });
}
```

## Phase 6: The Signup Form Component

```tsx
// components/waitlist-form.tsx
'use client';
import { useState } from 'react';

export function WaitlistForm({ referralCode }: { referralCode?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [position, setPosition] = useState<number | null>(null);
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, referredBy: referralCode }),
    });

    const data = await res.json();

    if (data.success) {
      setState('success');
      setPosition(data.position);
      setUserReferralCode(data.referralCode);
    } else {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div>
        <p>you're #{position} on the list.</p>
        {userReferralCode && (
          <p>
            share your link to move up:{' '}
            <code>{`${window.location.origin}/?ref=${userReferralCode}`}</code>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={state === 'loading'}
      />
      <button type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? 'joining...' : 'join waitlist'}
      </button>
      {state === 'error' && <p>something went wrong. try again.</p>}
    </form>
  );
}
```

Read the referral code from URL params in the page:
```tsx
// app/page.tsx
export default function Page({ searchParams }: { searchParams: { ref?: string } }) {
  return <WaitlistForm referralCode={searchParams.ref} />;
}
```

## Phase 7: Admin View

Simple route that requires a secret header — no full auth needed for a waitlist admin:

```typescript
// app/api/admin/waitlist/route.ts
export async function GET(req: Request) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signups = await db.select().from(waitlistTable).orderBy(asc(waitlistTable.position));

  return Response.json({
    total: signups.length,
    signups,
  });
}
```

Fetch with: `curl -H "x-admin-secret: $ADMIN_SECRET" https://yoursite.com/api/admin/waitlist`

## Verify

```
[ ] Duplicate email returns success with alreadyRegistered: true (no error, no leak)
[ ] Email normalized to lowercase before storage
[ ] Position increments correctly — first signup is #1
[ ] Confirmation email arrives in inbox, not spam
[ ] Referral code in URL (?ref=) is captured and stored on signup
[ ] Referrer's count increments when referred signup completes
[ ] Admin route requires x-admin-secret header
[ ] ADMIN_SECRET and RESEND_API_KEY in .env.example
[ ] Form disables input during submission
[ ] Success state shows position and referral link
```
