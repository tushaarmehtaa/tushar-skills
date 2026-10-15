---
name: payments-with-dodo
description: Implement or repair Dodo Payments checkout, subscriptions, webhooks, entitlements, billing UI, refunds, and verification. Use when adding Dodo billing or auditing its full lifecycle.
license: MIT
---

# Payments with Dodo

Implement the full billing lifecycle. Dodo is the source of billing events; the application’s server-side entitlement model is the authorization boundary.

## Workflow

1. Inspect framework/runtime, auth, database, existing provider/SDK and version, products, billing code, webhook storage, environment mapping, and deployment targets. Do not install Dodo beside another provider without explicit migration scope.
2. Infer existing products and commercial policy. Ask only about unresolved one-time/subscription behavior, currency, trials, cancellation timing, refunds, tax, and capabilities unlocked.
3. Model server-owned products, prices, and entitlements. The browser may submit a stable product key, never price, currency, credit amount, or entitlement.
4. Keep test/live API keys, product IDs, webhook keys, and environment settings separate. Document names in `.env.example` without values.
5. Read [pricing and checkout](references/pricing-and-checkout.md) for current official SDK checkout, product mapping, portal, and UI patterns. Read [implementation guidance](references/implementation-guide.md) only when designing pricing or feature gates.
6. Read [webhooks](references/webhooks.md) before implementing event ingestion. Prefer official SDK verification, a durable webhook inbox with unique event ID, transactional state updates, explicit transient/permanent failure policy, and ordering by provider timestamps/version where available.
7. Store provider customer/payment/subscription IDs and normalized status, billing-period boundaries, cancellation schedule, and last processed event data needed for reconciliation. Handle relevant payment, subscription, refund, dispute, dunning, and entitlement events.
8. Protect paid features on the server using normalized entitlements. UI gates explain access but do not grant it.
9. Build billing UI for checkout states, current entitlement, renewal/cancellation timing, failed-payment recovery, invoices/portal, and delayed webhook confirmation. Never treat a return URL or query parameter as proof of payment.

## Verification

In Dodo test mode, test purchase, invalid product key, duplicate/concurrent webhook, invalid signature, transient database failure and retry, out-of-order update, renewal, scheduled cancellation, expiration, plan change, failed payment/on-hold/recovery, refund, dispute where relevant, replay, and unknown customer. Reconcile a stored subscription against the provider API. Run repository lint/type/test/build commands.

## Output

Report product/entitlement mapping, SDK and environment detected, files/migrations changed, checkout/portal paths, webhook inbox and state transitions, payload minimization/access/retention decisions, server enforcement points, test evidence/event IDs, and exact dashboard/production steps still required.
