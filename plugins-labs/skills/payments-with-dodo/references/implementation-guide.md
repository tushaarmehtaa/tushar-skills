# Pricing and entitlement design

Read this reference only when the task includes pricing architecture, tier presentation, or feature gates. Commercial choices require product evidence; do not manufacture tiers or urgency.

## Contents

- [Define the commercial model](#define-the-commercial-model)
- [Model entitlements](#model-entitlements)
- [Present pricing](#present-pricing)
- [Experiment safely](#experiment-safely)
- [Verification](#verification)

## Define the commercial model

Infer existing plans, prices, trials, limits, and product IDs from server config and Dodo dashboard mappings. Ask only about unresolved choices. Record:

- one-time, subscription, credit, seat, or usage model;
- currency and tax-inclusive/exclusive display;
- monthly/annual periods and truthful annual savings;
- trial start/end and payment-method requirements;
- upgrade/downgrade proration and effective timing;
- cancellation/refund policy;
- exact capabilities and limits granted.

Do not add a decoy tier, “most popular” badge, urgency, or savings claim without evidence. Do not gate core data access or cancellation behind a higher plan.

## Model entitlements

Define capabilities and quantitative limits independently of display names:

```typescript
export type Entitlement =
  | 'export:data'
  | 'api:access'
  | 'team:manage';

export type BillingState = {
  status: 'free' | 'trialing' | 'active' | 'on_hold' | 'cancel_scheduled' | 'expired';
  entitlements: ReadonlySet<Entitlement>;
  currentPeriodEnd?: Date;
};
```

Server checks resolve the latest normalized billing state. Avoid storing only `users.plan = 'pro'`; that cannot represent scheduled cancellation, period boundaries, add-ons, grandfathering, or recovery.

```typescript
export async function requireEntitlement(userId: string, entitlement: Entitlement) {
  const state = await getBillingState(userId);
  if (!state.entitlements.has(entitlement)) {
    throw new BillingAccessError(entitlement);
  }
}
```

Use usage reservations/counters for quantitative limits rather than a simple Boolean gate.

## Present pricing

Pricing UI must derive from the same server-owned catalog used for checkout. Show:

- exact billing period/currency and tax wording;
- trial and renewal terms;
- meaningful feature/limit differences;
- current plan, scheduled changes, and effective dates;
- accessible comparison and CTA states;
- a clear manage/cancel/refund path.

The return/success page displays “confirming” until server billing state reflects a verified provider event or a server-side provider lookup. Never display a query-string `plan` as proof of upgrade.

## Experiment safely

Define a hypothesis, primary conversion metric, guardrails (refunds, support, churn), assignment unit, sample-size plan, and stopping rule before an experiment. Run only one materially interacting pricing experiment at a time and preserve tax/renewal disclosure in every variant.

## Verification

- Catalog, UI display, checkout mapping, and server entitlements agree.
- Unknown products/features deny safely.
- Free, trial, active, on-hold, scheduled-cancel, expired, and grandfathered states render correctly.
- Upgrade/downgrade/refund timing matches provider behavior and policy.
- Accessibility, currency/tax, and renewal disclosures are reviewed.
