---
name: pricing-page
description: Scaffold a complete pricing page with tier structure, feature gating, Dodo Payments integration, and the frontend component. Use when the user wants to add pricing, create a pricing page, set up payment tiers, integrate Dodo Payments, or implement feature gating based on subscription plans. Triggers on requests like "pricing page", "add pricing", "subscription tiers", "Dodo Payments integration", "payment plans", "feature gating", "freemium model", "monetize my app", "charge users", or any mention of pricing, billing, or subscription management.
category: workflow
tags: [pricing, dodo-payments, feature-gating, subscriptions, monetization]
author: tushaarmehtaa
---

# Pricing Page

Scaffold a complete pricing system — tier definitions, feature gating logic, Dodo Payments integration, and a polished frontend component. Reads your codebase and adapts to your stack.

## What This Builds

| Component | What It Does |
|-----------|-------------|
| **Tier Definitions** | Data structure for pricing tiers (Free, Pro, Enterprise) |
| **Feature Gate** | Utility to check user's plan before allowing features |
| **Dodo Integration** | Checkout creation + webhook handling |
| **Pricing UI** | Frontend component with tier cards, CTA buttons |
| **Billing Portal** | Link to Dodo customer portal for managing subscription |

## Required Information

1. **Stack** — Framework, database, existing auth method
2. **Tiers** — How many tiers? What's in each? (skill will suggest if undefined)
3. **Pricing model** — Flat rate, per-seat, usage-based, or credits
4. **Billing frequency** — Monthly, annual, or both

## Tier Structure (suggest if not defined)

Default suggestion for SaaS:

| | Free | Pro | Enterprise |
|---|---|---|---|
| **Price** | $0 | $X/mo | Custom |
| **Core feature** | Limited | Full | Full |
| **API access** | No | Yes | Yes + higher limits |
| **Support** | Community | Email | Priority |
| **CTA** | "Get Started" | "Upgrade" | "Contact Us" |

For credits-based (AI apps):

| | Free | Pro | Enterprise |
|---|---|---|---|
| **Credits** | 50 | 500/mo | Unlimited |
| **Price** | $0 | $X/mo | Custom |
| **Rollover** | No | No | Yes |

## Feature Gating

```typescript
// lib/feature-gate.ts
type Plan = 'free' | 'pro' | 'enterprise';

const FEATURES: Record<string, Plan[]> = {
  'api-access': ['pro', 'enterprise'],
  'export-data': ['pro', 'enterprise'],
  'custom-domain': ['enterprise'],
  'priority-support': ['enterprise'],
};

export function canAccess(userPlan: Plan, feature: string): boolean {
  return FEATURES[feature]?.includes(userPlan) ?? false;
}

// Usage in API routes
export function requirePlan(userPlan: Plan, feature: string) {
  if (!canAccess(userPlan, feature)) {
    throw new Response(
      JSON.stringify({ error: 'Upgrade required', upgradeUrl: '/pricing' }),
      { status: 403 }
    );
  }
}
```

## Dodo Payments Integration

### Environment Variables

```bash
DODO_API_KEY=          # From Dodo dashboard
DODO_WEBHOOK_SECRET=   # whsec_... format — see /dodo-webhook skill
DODO_PRODUCT_ID=       # Product ID from Dodo dashboard
APP_URL=               # Your frontend URL for checkout redirect
```

### Checkout Creation

```typescript
// app/api/payments/create-checkout/route.ts
import DodoPayments from '@dodopayments/sdk';

const dodo = new DodoPayments({ bearerToken: process.env.DODO_API_KEY });

export async function POST(req: Request) {
  const { userId, email, planId } = await req.json();

  const checkout = await dodo.payments.create({
    payment_link: true,
    customer: { email },
    product_cart: [{ product_id: process.env.DODO_PRODUCT_ID!, quantity: 1 }],
    metadata: { userId, planId },  // CRITICAL: attach userId so webhook can find the user
    return_url: `${process.env.APP_URL}/checkout/success`,
  });

  return Response.json({ checkout_url: checkout.payment_link });
}
```

**Critical:** Always attach `userId` in metadata. The webhook uses it to find the user and update their plan.

### Webhook Handler

Wire the webhook using the `/dodo-webhook` skill — it handles signature verification, idempotency, and database sync for subscription lifecycle events.

### Customer Portal

```typescript
// Link to Dodo's hosted billing portal
export async function GET(req: Request) {
  const { userId } = await getAuthUser(req);
  const user = await db.user.findUnique({ where: { id: userId } });

  const portal = await dodo.customerPortal.create({
    customer_id: user.dodoCustomerId,
    return_url: `${process.env.APP_URL}/settings`,
  });

  return Response.json({ portal_url: portal.url });
}
```

## Pricing UI Component

Generate a responsive pricing component with:

- **Tier cards** — Side by side on desktop, stacked on mobile
- **Feature checklist** — Per tier with check/cross marks
- **CTA buttons** — Different style for recommended tier
- **Current plan indicator** — Highlight user's current plan if logged in
- **"Most Popular" badge** — On the recommended tier

### Design Principles

- One tier must be visually emphasized (larger, different border, badge)
- Free tier CTA: "Get Started" (not "Sign Up for Free")
- Pro tier CTA: "Upgrade" or "Start Free Trial"
- Enterprise CTA: "Contact Us" (opens email)
- Annual pricing shown as monthly equivalent with total in small text

```tsx
// components/pricing-cards.tsx
export function PricingCards({ currentPlan }: { currentPlan?: string }) {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      features: ['[Feature 1]', '[Feature 2]'],
      cta: 'Get Started',
      href: '/signup',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$[X]/mo',
      features: ['Everything in Free', '[Pro Feature 1]', '[Pro Feature 2]'],
      cta: 'Upgrade',
      href: '/api/payments/create-checkout',
      highlighted: true,
      badge: 'Most Popular',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className={`rounded-xl border p-6 ${tier.highlighted ? 'border-black shadow-lg' : 'border-gray-200'}`}
        >
          {tier.badge && <span className="text-xs font-bold uppercase">{tier.badge}</span>}
          <h3 className="text-lg font-bold">{tier.name}</h3>
          <p className="text-3xl font-bold">{tier.price}</p>
          <ul className="mt-4 space-y-2">
            {tier.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span>✓</span> {f}
              </li>
            ))}
          </ul>
          {currentPlan === tier.name.toLowerCase() ? (
            <div className="mt-6 text-center text-sm text-gray-500">Current plan</div>
          ) : (
            <a href={tier.href} className="mt-6 block w-full rounded-lg bg-black py-2 text-center text-sm text-white">
              {tier.cta}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Workflow

1. Detect stack (framework, database, existing auth)
2. Prompt for missing info (tiers, pricing model)
3. Generate tier definition data structure
4. Create feature gating utility
5. Set up Dodo checkout creation endpoint
6. Point to `/dodo-webhook` skill for webhook handling
7. Generate pricing UI component
8. Add billing portal link to user settings
9. Add env vars to .env.example
10. Output setup instructions (Dodo dashboard steps)

## Checklist

- [ ] Tier definitions created with feature lists
- [ ] Feature gating utility covers all defined features
- [ ] Dodo SDK installed (`@dodopayments/sdk`)
- [ ] Checkout creation endpoint returns `checkout_url`
- [ ] `userId` attached in checkout metadata
- [ ] Webhook wired (use `/dodo-webhook` skill)
- [ ] Pricing UI responsive with recommended tier emphasized
- [ ] Current plan indicated for logged-in users
- [ ] Billing portal link accessible from settings
- [ ] Env vars documented in .env.example

## Detailed Reference

For pricing psychology, A/B test ideas, and advanced feature gating patterns, see [references/guide.md](references/guide.md).
