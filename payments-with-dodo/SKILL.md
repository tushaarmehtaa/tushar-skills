---
name: payments-with-dodo
description: Implement Dodo Payments checkout, subscriptions, webhooks, entitlements, billing UI, and verification. Use when adding or repairing Dodo billing in an app.
license: MIT
---

# Payments with Dodo

Implement the full billing lifecycle, not an isolated checkout button or webhook. Match the existing stack and treat the payment provider as the source of billing events, not the application's authorization model.

## Workflow

1. Inspect the framework, auth, database, existing products, billing code, environment variables, and deployment targets.
2. Confirm the commercial model: one-time purchase or subscription, plans, currency, trial behavior, cancellation rules, refund policy, tax handling, and which capabilities each purchase unlocks.
3. Model products and entitlements in one typed server-side definition. Do not trust plan names, prices, or feature access sent by the browser.
4. Configure Dodo products and environments. Keep test and live identifiers separate and document the mapping in `.env.example` without secrets.
5. Build server-created checkout sessions with authenticated customer identity and stable metadata that can map every event back to the correct account.
6. Implement billing UI for pricing, checkout states, current plan, renewal/cancellation state, invoices or portal access, and recovery from failed payments.
7. Implement signature-verified, idempotent webhooks. Store event IDs, process retries safely, tolerate out-of-order delivery, and update subscriptions and entitlements transactionally.
8. Protect paid features on the server. The UI may explain access, but it must not be the security boundary.
9. Test purchase, duplicate webhook, renewal, cancellation, expiration, refund, failed payment, replay, and unknown-customer paths in the provider's test environment.
10. Report provider-dashboard steps separately from code changes and list the exact production checks still required.

## Load deeper guidance

- Read [webhooks](references/webhooks.md) for signature verification, event handling, database synchronization, and framework examples.
- Read [pricing and checkout](references/pricing-and-checkout.md) for tiers, feature gates, checkout, portal, and UI implementation.
- Read [implementation guide](references/implementation-guide.md) for supporting pricing-page patterns.

Use current Dodo documentation for API names, event types, and SDK behavior. Do not rely on remembered endpoints when the implementation can be verified against primary documentation.
