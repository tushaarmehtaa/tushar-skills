The Tallyroom homepage now explains what the product does for a shared flat, and it shows the real product instead of a placeholder picture. `next build` passes. I haven't committed or deployed anything.

**What the page says now** (everything is taken from the pricing page and dashboard; I made up no testimonials or stats):
- **Headline:** "Know who owes what in your flat, without the spreadsheet." The line under it says you log rent, groceries and bills as you pay, Tallyroom splits each one, and settling up is one number.
- **Main button:** "See plans", going to `/pricing`. Under it: "Free for one group of up to 4 housemates. One paid account covers everyone." That second line answers the most likely question from someone's housemates, and comes from your pricing FAQ.
- **Product preview:** the old `hero-dashboard.png` was a 3 MB placeholder with grey bars and no real content. In its place is a live view of the dashboard's example flat: real ₹ amounts, who paid, how each bill is split, and settled/unsettled. It's marked "Example group" so nobody mistakes it for a customer's data.
- **Sections:** a three-step "How it works", then the paid features (recurring bills, receipt scanning, multi-currency, CSV export), each labelled with the plan it needs.
- **Closing section:** "Only one of you has to pay", the price, cancel anytime, and the button again.
- **Wording removed:** "AI-driven", "Enterprise-grade" and "Lightning Fast", because nothing in the product backs them up.

**Other changes:**
- **Nav:** "Start free trial" is now "See plans", because there is no free trial. I removed four links that duplicated other links, and the nav now wraps on phones.
- **Styling:** same brand purple, made darker so the white text on it passes contrast, and the gradient-filled heading is now plain white. There's also a visible keyboard focus outline now.
- **Example data:** I moved it into `lib/exampleFlat.js` so the homepage and `/dashboard` share it. Amounts now show two decimals (₹2,840.50), on the dashboard as well.
- **Search and sharing:** the page now has its own title and description.

**Checked in a browser:** nothing scrolls sideways at phone, tablet, desktop or 200% zoom, the tab order makes sense, and every link loads. Port 3456 was already in use by another process, which I left alone; I tested on port 3977 and stopped my server afterwards.

**Problems I found but didn't change:**
1. **Nobody can actually sign up yet.** There's no signup page, the free plan has no button, and the "Choose Plus" / "Choose Household" buttons only go to the dashboard mock. Every button on the new homepage leads to that dead end, so this is the biggest thing stopping signups.
2. **Possible secret-key leak (`lib/checkout.js`).** The checkout button runs in the browser but imports a module that reads `STRIPE_SECRET_KEY` and puts its first 7 characters into the page's links. Only the key's prefix shows today, but code that touches the secret key shouldn't run in the browser at all. The real checkout should run on the server.
3. **The chat widget slows every page.** It loads in `<head>` and deliberately ties up the browser for 350 ms before anything appears. Loading it after the page appears would fix that.
4. **Prices are in dollars while the product is in rupees.** If the people you're targeting are mostly in India, $3 and $6 a month will feel odd next to ₹ amounts.

**How to tell if it's working:** there's no analytics in the repo yet. Once it's added, the useful numbers are the share of homepage visitors who click "See plans", and how many of those go on to pick a plan on `/pricing`. Comparing button-click rates would also show whether the "See an example flat" link helps or distracts.