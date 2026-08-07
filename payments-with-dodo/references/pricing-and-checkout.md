# Dodo pricing, checkout, and portal

Read this reference after detecting the official SDK version and existing provider. Current primary documentation uses the `dodopayments` package and Checkout Sessions API; verify names against the installed version.

## Contents

- [Catalog and environment](#catalog-and-environment)
- [Checkout session](#checkout-session)
- [Customer portal](#customer-portal)
- [Success and recovery UI](#success-and-recovery-ui)
- [Verification](#verification)

## Catalog and environment

Create a typed, server-only mapping. The browser submits only a catalog key.

```typescript
export const BILLING_PRODUCTS = {
  proMonthly: {
    productIdEnv: 'DODO_PRO_MONTHLY_PRODUCT_ID',
    entitlementSet: 'pro',
    mode: 'subscription',
  },
  credits100: {
    productIdEnv: 'DODO_CREDITS_100_PRODUCT_ID',
    entitlementSet: 'credits_100',
    mode: 'one_time',
  },
} as const;
```

Keep explicit test/live mappings and initialize the client with the detected environment:

```typescript
import DodoPayments from 'dodopayments';

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode',
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
});
```

Use environment values supported by the installed SDK. Do not expose API/webhook keys.

## Checkout session

```typescript
import { dodo } from '@/lib/dodo';
import { BILLING_PRODUCTS } from '@/config/billing';

export async function POST(req: Request) {
  const user = await requireUser(req);
  const { productKey } = await validateCheckoutBody(req);
  const product = BILLING_PRODUCTS[productKey];
  if (!product) return Response.json({ error: 'Unknown product' }, { status: 400 });

  const productId = process.env[product.productIdEnv];
  if (!productId) throw new Error(`Missing ${product.productIdEnv}`);

  const session = await dodo.checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer: { email: user.email, name: user.name },
    metadata: {
      accountId: user.accountId,
      userId: user.id,
      productKey,
    },
    return_url: `${process.env.APP_URL}/billing/return`,
  });

  return Response.json({ checkoutUrl: session.checkout_url });
}
```

Validate authenticated customer fields, allowed return origin, existing subscription/duplicate checkout policy, and product availability. Do not accept amount, price, credit count, or entitlement from the browser.

## Customer portal

Current official SDK patterns create a portal session from the stored Dodo customer ID:

```typescript
export async function POST(req: Request) {
  const user = await requireUser(req);
  if (!user.dodoCustomerId) {
    return Response.json({ error: 'No billing customer' }, { status: 404 });
  }

  const session = await dodo.customers.customerPortal.create(user.dodoCustomerId, {
    return_url: `${process.env.APP_URL}/settings/billing`,
  });
  return Response.json({ portalUrl: session.link });
}
```

Adapt optional argument shape to the installed SDK version. Authorize the stored customer ID; never accept it from the browser.

## Success and recovery UI

The return route is not payment proof. Show a pending state and poll a server billing-status endpoint with a bounded backoff, or verify the checkout/session server-side when supported. Stop on active/final failure/timeout and provide recovery guidance.

Show current period end, scheduled cancellation, on-hold/payment-update action, invoice/portal access, and support path. Render from normalized server billing state, not URL parameters.

## Verification

- Unknown/tampered product keys are rejected.
- Test/live IDs and keys cannot mix.
- Authenticated checkout metadata maps to the correct account and server catalog.
- Return UI remains pending until verified state changes and times out cleanly.
- Portal denies users without the stored customer and never accepts another customer ID.
- Server entitlement checks pass/deny for all billing states.
