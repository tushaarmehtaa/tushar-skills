---
name: ship-credits
description: Scaffold credit metering with storage, atomic spending, payments, state, UI, promos, and audit history. Use when an app must sell and consume credits.
license: MIT
---

Scaffold a full credits system — database schema, backend middleware, payment webhooks, frontend state, and UI components. Reads the project first, builds on top of what's already there.

## Phase 1: Understand the Project

Before writing any code, answer these questions by reading the codebase:

### 1.1 Detect the Stack
- **Backend**: Next.js API routes / FastAPI / Express / Django / Rails?
- **Database**: Supabase / Postgres / PlanetScale / MongoDB / Prisma?
- **Auth**: Clerk / NextAuth / Supabase Auth / Firebase Auth / custom JWT?
- **Frontend state**: Zustand / Redux / React Context / Jotai / vanilla?
- **Existing payments?**: Check for Stripe / Lemon Squeezy / Dodo / Paddle imports

### 1.2 Ask the User
Before scaffolding, confirm these decisions:

```
I'll set up credits for your [framework] app with [database].

Quick decisions needed:

1. What costs credits? (e.g., "AI generation = 5, image gen = 4, export = 2")
2. Free tier: How many credits on signup? (e.g., 50)
3. Payment provider preference? (Stripe / Lemon Squeezy / Dodo / manual only)
4. Credit pack pricing? (e.g., "$5 = 100 credits, $10 = 250 credits")

Defaults: 50 free credits, per-action costs you define, Stripe.
```

## Phase 2: Database Schema

Read [references/database-schemas.md](references/database-schemas.md), then implement only the variant matching the detected database.

Every variant must provide:

- A non-negative balance on the user record
- An immutable credit transaction audit trail
- Indexes for user and time-based transaction lookup
- Atomic balance changes that cannot race below zero
- Optional promo-code storage only when the user requests it

Tell the user when the transaction ledger is ready and name the migration or schema file changed.

## Phase 3: Backend Credit Service

Create a credit service module with these core functions. Adapt to the project's language and framework.

### Core Functions

**get_credits(user_identifier)** — Get current balance:
```
Input: auth_id or email (whatever the project uses to identify users)
Output: integer (credit balance) or null (user not found)
Logic: Query users table, return credits column
```

**deduct_credits(user_identifier, amount, reason)** — Spend credits:
```
Input: user identifier, amount to deduct, reason string
Output: boolean (success/failure)
Logic:
  1. Get current credits
  2. If credits < amount → return false (DO NOT go negative)
  3. Update users.credits = credits - amount
  4. Insert credit_transactions record with negative amount
  5. Return true
```

**add_credits(user_identifier, amount, reason, metadata)** — Add credits:
```
Input: user identifier, amount to add, reason, optional metadata (payment_id, promo_code, etc.)
Output: new balance
Logic:
  1. Update users.credits = credits + amount
  2. Insert credit_transactions record with positive amount
  3. Return new balance
```

**Important implementation details:**
- The deduct function MUST check balance before deducting — never trust the frontend
- Use database-level constraints or transactions to prevent race conditions
- For high-throughput: use `UPDATE users SET credits = credits - $amount WHERE id = $id AND credits >= $amount` and check affected rows
- Always log to credit_transactions — this is your financial audit trail

### Credit Check Middleware

Create middleware that runs before any credit-consuming endpoint:

**For Next.js API routes:**
```typescript
// middleware pattern — adapt to project's auth
export function withCredits(handler, cost) {
  return async (req, res) => {
    const user = await getAuthUser(req); // from project's auth
    const credits = await getCredits(user.id);

    if (credits < cost) {
      return res.status(402).json({
        error: 'Insufficient credits',
        required: cost,
        balance: credits,
      });
    }

    // Attach to request for handler to use
    req.creditsCost = cost;
    req.deductCredits = () => deductCredits(user.id, cost, 'api_action');

    return handler(req, res);
  };
}
```

**For FastAPI:**
```python
async def require_credits(amount: int):
    async def dependency(request: Request):
        user = await get_current_user(request)  # from project's auth
        credits = get_credits(user.id)
        if credits is None or credits < amount:
            raise HTTPException(
                status_code=402,
                detail={"error": "Insufficient credits", "required": amount, "balance": credits or 0}
            )
        return user
    return Depends(dependency)
```

**For Express:**
```javascript
function requireCredits(cost) {
  return async (req, res, next) => {
    const credits = await getCredits(req.user.id);
    if (credits < cost) {
      return res.status(402).json({ error: 'Insufficient credits', required: cost, balance: credits });
    }
    req.creditsCost = cost;
    next();
  };
}
```

**HTTP 402 is the right status code** for insufficient credits. It literally means "Payment Required." Handle it explicitly in error handlers — don't let it get caught by generic 4xx/5xx handlers.

### Credit Costs Config

Create a single source of truth for what things cost:

```typescript
// config/credits.ts (or equivalent)
export const CREDIT_COSTS = {
  // Define based on user's answer from Phase 1
  GENERATE: 5,
  REGENERATE: 1,
  IMAGE: 4,
  EXPORT: 2,
} as const;

export const FREE_CREDITS = 50;

export const CREDIT_PACKS = [
  { credits: 100, price_cents: 500, label: '$5' },
  { credits: 250, price_cents: 1000, label: '$10' },
  { credits: 600, price_cents: 2000, label: '$20' },
] as const;
```

## Phase 4: Payment Integration

Read [references/payment-providers.md](references/payment-providers.md), then implement only the provider selected in Phase 1. Do not install a second provider when the project already has one.

Every provider path must:

1. Put the user identifier and credit amount in checkout metadata.
2. Verify webhook signatures against the raw request body.
3. Enforce idempotency with the provider payment or event ID.
4. Add credits and write the transaction ledger only after verified payment.
5. Log processing failures while returning the provider-safe acknowledgement described in the reference.

## Phase 5: Frontend Credit State

### Zustand Store (recommended for React)

```typescript
import { create } from 'zustand';

interface CreditsStore {
  credits: number | null;  // null = not loaded yet
  setCredits: (credits: number | null) => void;
  deduct: (amount: number) => void;
}

export const useCreditsStore = create<CreditsStore>((set) => ({
  credits: null,
  setCredits: (credits) => set({ credits }),
  deduct: (amount) =>
    set((state) => ({
      credits: state.credits !== null ? Math.max(0, state.credits - amount) : null,
    })),
}));
```

### Credit Sync Hook

```typescript
// hooks/useCredits.ts
export function useCredits() {
  const { credits, setCredits, deduct } = useCreditsStore();

  // Fetch on mount (after auth)
  const fetchCredits = async () => {
    const res = await fetch('/api/user/credits');
    const data = await res.json();
    setCredits(data.credits);
  };

  // Optimistic deduction — update UI immediately, backend confirms async
  const spendCredits = async (amount: number, action: () => Promise<void>) => {
    if (credits !== null && credits < amount) {
      // Trigger low credit UI
      return { success: false, reason: 'insufficient' };
    }

    deduct(amount); // Optimistic UI update
    try {
      await action(); // The actual API call (which also deducts server-side)
      return { success: true };
    } catch (error) {
      // Refund the optimistic deduction
      await fetchCredits();
      return { success: false, reason: 'error' };
    }
  };

  const hasEnough = (amount: number) => credits !== null && credits >= amount;

  return { credits, fetchCredits, spendCredits, hasEnough };
}
```

### Key UX Patterns

**Credit display in header/nav:**
- Show current balance near user avatar/menu
- Format: "42 credits" or just "42" with a coin/token icon
- If null (loading), show skeleton or nothing — never show 0 while loading

**Low credit warning thresholds:**
```typescript
const LOW_CREDIT_THRESHOLD = 20;      // Show gentle reminder
const CRITICAL_THRESHOLD = 10;         // Show prominent warning
const ZERO_THRESHOLD = 0;              // Block action, show buy modal
```

**Pre-action credit check:**
Before any credit-consuming action, check client-side first:
```typescript
if (!hasEnough(CREDIT_COSTS.GENERATE)) {
  openBuyCreditsModal();
  return;
}
```
This prevents unnecessary API calls. The server still validates — this is just UX.

## Phase 6: UI Components

Create these components, matching the project's existing design system.

### 1. Credit Balance Display
- Shows in header/nav bar
- Updates in real-time after actions
- Subtle pulse animation when credits change
- Click to open buy modal

### 2. Buy Credits Modal/Slider
- Shows credit pack options with pricing
- Highlights best value pack
- Shows what credits buy: "100 credits = ~20 generations + 5 images"
- CTA button that creates checkout and redirects

### 3. Low Credit Warning
- Appears when balance drops below threshold
- Non-blocking for LOW (banner/toast)
- Blocking for ZERO (modal with buy CTA)
- Shows credit costs as reminder
- "Buy credits" primary CTA + "I'll be careful" dismiss (if credits > 0)

### 4. Credit Cost Indicators
- Show cost next to every action button: "Generate (5 credits)"
- Gray out buttons when insufficient credits
- Tooltip on disabled button: "You need X more credits"

### 5. Checkout Success Page
- "/checkout/success" route
- Polls /api/user/credits until balance updates (webhook may take a few seconds)
- Shows confetti/celebration + new balance
- CTA back to main app

### 6. Transaction History (optional but recommended)
- Table/list of all credit changes
- Columns: date, action, amount (+/-), balance after
- Filter by reason (purchases, spending, bonuses)
- Useful for user trust — they can see exactly where credits went

## Phase 7: Promo Code System

### Redeem Endpoint
```
POST /api/credits/redeem
Body: { code: string }

Logic:
  1. Get authenticated user
  2. Find promo code by code string
  3. Validate:
     - Code exists
     - Not expired (expires_at is null or > now)
     - times_used < max_uses
     - If email is set on code, must match user's email
  4. Add credits to user
  5. Increment times_used on promo code
  6. Log transaction with reason='promo_code', metadata={ code }
  7. Return { credits_added, new_balance }
```

### Admin Create Code Endpoint
```
POST /api/admin/promo-codes
Body: { credits_amount, max_uses?, email?, expires_in_days?, custom_code? }
Auth: Admin only

Logic:
  1. Generate random 8-char code if no custom_code
  2. Insert into promo_codes table
  3. Return { code, credits_amount, expires_at }
```

Promo codes are essential for:
- Beta user onboarding
- Influencer/partner distribution
- Customer support ("sorry for the issue, here's 50 credits")
- Marketing campaigns

## Phase 8: Admin Tools

### Add Credits Endpoint
```
POST /api/admin/add-credits
Body: { email: string, amount: number, reason?: string }
Auth: Admin only (check admin secret header or admin role)

Logic:
  1. Find user by email
  2. Add credits
  3. Log transaction with reason (default: 'admin_grant')
  4. Return { email, credits_added, new_balance }
```

### Credit Analytics (read from credit_transactions)
Useful queries to surface in an admin panel:
- Total credits purchased (sum where reason='purchase')
- Total credits spent (sum where amount < 0)
- Credits outstanding (sum of all users.credits)
- Revenue (count purchases * price)
- Most active users (group by user_id, sum spending)
- Spend by action type (group by reason)

## Phase 9: Wire It All Together

After creating all the pieces, connect them:

1. **Auth sync**: When a user signs in, fetch their credit balance and hydrate the frontend store
2. **Every protected endpoint**: Add credit check middleware with the appropriate cost
3. **Every credit-consuming UI action**: Add client-side hasEnough check + server-side middleware
4. **After every action**: Optimistically deduct in frontend, confirm via API response
5. **Webhook route**: Register with payment provider, test with CLI tools
6. **Success page**: Create /checkout/success with polling logic

### Verification Checklist

After scaffolding, walk through these flows:

```
Flow 1: New User Signup
[ ] User signs up → gets FREE_CREDITS
[ ] Credit balance shows in UI
[ ] Transaction logged: reason='signup_bonus'

Flow 2: Spend Credits
[ ] User triggers action → credits deducted
[ ] UI updates optimistically
[ ] Server validates balance before processing
[ ] 402 returned if insufficient
[ ] Transaction logged with correct reason

Flow 3: Buy Credits
[ ] User clicks buy → redirected to checkout
[ ] Payment succeeds → webhook received
[ ] Webhook verified → credits added
[ ] Idempotent (double webhook doesn't double-credit)
[ ] UI refreshes with new balance
[ ] Transaction logged: reason='purchase'

Flow 4: Promo Code
[ ] User enters code → credits added
[ ] Code usage incremented
[ ] Expired/used codes rejected
[ ] Email-restricted codes enforced

Flow 5: Edge Cases
[ ] Insufficient credits → clear error, buy CTA shown
[ ] Concurrent requests → no negative balance (DB constraint or check)
[ ] Webhook arrives before redirect → still works
[ ] Network error during action → optimistic deduction rolled back
```

Tell the user which flows are wired and which need manual testing.

## Important Notes

- **Never trust the frontend balance.** Always validate server-side. The frontend balance is for UX only.
- **Log every credit change.** The credit_transactions table is your source of truth, not the credits column. If they ever disagree, transactions win.
- **Idempotency on webhooks is non-negotiable.** Payment providers retry. Double-crediting loses you money.
- **HTTP 402** is the correct status code. Not 403, not 400. 402 means "Payment Required."
- **Start simple.** One credit pack at one price. Add tiers later when you have data on what users actually buy.
