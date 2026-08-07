# Credit payment providers

Read this reference after detecting the existing provider and installed SDK version. Implement one provider path and verify API/event names against current primary documentation.

## Contents

- [Shared checkout contract](#shared-checkout-contract)
- [Stripe](#stripe)
- [Lemon-Squeezy](#lemon-squeezy)
- [Dodo Payments](#dodo-payments)
- [Webhook processing](#webhook-processing)
- [Verification](#verification)

## Shared checkout contract

The browser submits only a server-owned pack key. The server maps that key to provider price/product ID, currency, and credit amount.

```text
POST /api/billing/credit-checkout
authenticated body: { pack: "starter" }
server lookup: starter -> provider product/price -> 100 credits
```

Attach stable internal account/user ID and pack key as provider metadata. Never accept `credits`, `amount_cents`, price IDs outside an allow-list, or user identity as authoritative browser input.

## Stripe

Use the installed Stripe SDK’s Checkout Session pattern and a server-owned `price` mapping. Process the current successful-payment event appropriate to the checkout mode and payment status. Verify `stripe-signature` over the raw body with the endpoint secret. Store both event ID and payment/session reference as unique identifiers where useful.

## Lemon Squeezy

Use the current Lemon Squeezy checkout API/SDK with a server-owned variant mapping and `custom_data` containing stable account/user ID plus pack key. Verify the webhook signature exactly as current primary docs specify and handle only the paid/order state that guarantees funds.

## Dodo Payments

Use the current official `dodopayments` SDK and Checkout Sessions API with a server-owned `product_cart`. Store account/user ID plus pack key in metadata. Prefer the official SDK webhook verification helper and current event guide. Dodo also has provider-managed credit capabilities; decide deliberately whether the application ledger or Dodo wallet is the source of truth—do not update both without reconciliation.

## Webhook processing

1. Read the raw body and verify signature/timestamp with the provider-supported helper.
2. Insert a webhook-inbox/event row with a unique provider event ID.
3. If processing synchronously, grant credits and mark the event complete in a database transaction. Return non-2xx for transient failure so the provider retries.
4. If acknowledging immediately, first durably enqueue/store the event, then return success and process with retry/dead-letter monitoring.
5. Resolve pack value from the server-owned mapping, not mutable metadata credit amounts alone. Cross-check product/price, currency, amount, payment status, and environment.
6. Grant with the payment/event reference as the ledger idempotency key.
7. Handle refunds/disputes according to the explicit clawback/debt policy and link reversal entries to the purchase.

Do not “always return 200” after a database error in a synchronous handler; that permanently discards the provider’s retry opportunity.

## Verification

- Unknown/tampered pack keys are rejected before checkout.
- Test and live product IDs cannot cross environments.
- Valid, invalid, duplicate, concurrent, and out-of-order events behave deterministically.
- A transient database failure is retried or remains in a durable queue.
- Refund/dispute behavior matches the documented balance policy.
- Ledger, cached balance, provider payment, and UI reconcile.
