I've written a post, but most of this week's commits shouldn't be announced yet. Several of them would make the post untrue.

**Draft for X (271 characters):**

> This week on Tallyroom 🧾
>
> • A new top nav across the site, so you can get to Pricing and the FAQ from any page
> • A first look at the product on the homepage
> • A pricing FAQ that covers switching plans and who pays in a shared group
>
> More soon, with real billing next.

This is about all I can honestly claim. It covers the week's 8 commits (14d98fd..b674c00, Oct 3–8, `main`), and there's no git remote or deploy config, so I couldn't confirm any of it is live. Only post it once it's actually deployed.

**What I left out and why:**

- **Checkout buttons (2949f54).** "Choose Plus" and "Choose Household" don't start a checkout. They link to `/dashboard?plan=…&k=sk_test` (or `sk_live` once you set a real key), which puts the first 7 characters of your Stripe secret key in a public URL (`lib/checkout.js:12`). That's only the key's prefix, but a secret key shouldn't feed into a client-visible URL at all. Fix this before launch, and don't say people can subscribe yet.
- **"Cancel anytime" and the billing answers in the FAQ (13bb2ae, b674c00).** These describe how billing works, but billing doesn't exist yet.
- **"INR, USD, EUR, GBP, SGD and AED, with daily exchange rates" in the FAQ.** Nothing in `app/` or `lib/` handles currencies or exchange rates. I'd remove or soften that answer before people see it.
- **Dashboard and rupee formatting (14d98fd, c29bfe0).** This is a mock with hardcoded sample data, not a feature people can use.
- **SupportDesk chat widget (c47d313).** `public/vendor/support-widget.js` is loaded in `<head>`, where it blocks the page, and it busy-loops for 350ms before anything renders. That makes every page load slower. Look into it before promoting the widget.

**Smaller issues I noticed:**

- `hero-dashboard.png` is 3.1 MB. Compressing it or converting it to WebP would help page load.
- The nav links "Groups", "Activity" and "For Teams" just point to `/dashboard` and `/pricing`.

If you fix the checkout key and the currency FAQ answer and deploy, I can rewrite the post to include more.