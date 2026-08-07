# Credit Payment Providers

Read this reference after the user selects a provider or the project reveals an existing one. Implement exactly one provider path.

## Contents

- [Shared payment flow](#payment-flow)
- [Stripe](#stripe-integration)
- [Lemon Squeezy](#lemon-squeezy-integration)
- [Dodo Payments](#dodo-payments-integration)
- [Webhook security](#webhook-security-checklist)

## Payment Flow

Wire up the payment provider the user chose. Each provider follows the same pattern:
1. Create a checkout session with credits amount in metadata
2. Redirect user to hosted checkout page
3. Receive webhook when payment succeeds
4. Add credits to user's account

### Stripe Integration

**Create checkout endpoint:**
```
POST /api/payments/create-checkout
Body: { credits: number, price_id: string }

Logic:
  1. Get authenticated user
  2. Create Stripe Checkout Session:
     - line_items: the selected credit pack
     - metadata: { user_id, credits_amount }
     - success_url: /checkout/success?session_id={CHECKOUT_SESSION_ID}
     - cancel_url: /pricing
  3. Return { url: session.url }
```

**Webhook handler:**
```
POST /api/webhooks/stripe
Headers: stripe-signature

Logic:
  1. Verify webhook signature using STRIPE_WEBHOOK_SECRET
  2. Handle event type: checkout.session.completed
  3. Extract metadata.user_id and metadata.credits_amount
  4. IDEMPOTENCY CHECK: query credit_transactions for this payment_id
     - If found → return 200 (already processed)
  5. Call add_credits(user_id, credits_amount, 'purchase', { payment_id: session.id })
  6. Return 200

CRITICAL: Always return 200 to prevent retries, even on errors. Log the error instead.
```

**Environment variables needed:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_100=price_...    # $5 = 100 credits
STRIPE_PRICE_ID_250=price_...    # $10 = 250 credits
```

### Lemon Squeezy Integration

**Create checkout:**
```
POST /api/payments/create-checkout
Body: { variant_id: string, credits: number }

Logic:
  1. POST to https://api.lemonsqueezy.com/v1/checkouts
  2. Include custom_data: { user_id, credits }
  3. Return { url: checkout_url }
```

**Webhook:**
```
POST /api/webhooks/lemonsqueezy
Headers: x-signature (HMAC hex)

Logic:
  1. Verify HMAC-SHA256 signature
  2. Handle event: order_created
  3. Extract custom_data.user_id, custom_data.credits
  4. Idempotency check → add_credits
```

### Dodo Payments Integration

**Create checkout:**
```
POST /api/payments/create-checkout
Body: { amount_cents: number, credits: number }

Logic:
  1. POST to https://live.dodopayments.com/checkouts
  2. Headers: Authorization: Bearer DODO_API_KEY
  3. Include metadata: { user_id, credits }
  4. Return { checkout_url }
```

**Webhook:**
```
POST /api/webhooks/dodo
Headers: webhook-id, webhook-timestamp, webhook-signature

Logic:
  1. Verify Standard Webhooks signature:
     - Strip "whsec_" prefix from secret
     - Base64 decode the secret
     - HMAC-SHA256 over "{webhook-id}.{webhook-timestamp}.{raw_body}"
     - Compare with webhook-signature header
  2. Handle event: payment.succeeded
  3. Extract metadata → idempotency check → add_credits
```

### Webhook Security Checklist

Regardless of provider, every webhook handler MUST:
1. **Verify the signature** — never trust unverified webhooks
2. **Check idempotency** — payment_id should be unique in credit_transactions
3. **Return 200 always** — even on errors, to prevent infinite retries
4. **Log everything** — payment_id, user_id, amount, timestamp
5. **Use raw body for signature verification** — parsed JSON won't match the signature
