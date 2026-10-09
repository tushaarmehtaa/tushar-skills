The site is now set up so Google can find and index it. I built it and checked the pages on a local server; it still needs re-checking on https://tallyroom.app once that's live. I haven't committed anything.

Nothing about the live site was checked, since it isn't up yet. There's also no Search Console data until after launch.

## What was missing, and what I fixed

1. **No titles, descriptions or link previews on any page.** Every page now has its own title, a description, and a canonical address pointing at https://tallyroom.app (the "this is the real version of the page" tag). Link previews for social sites use the dashboard screenshot. The address is set once in `lib/site.js`, so test or preview copies of the site still point Google at the real one.
2. **No `robots.txt` or sitemap.** I added both (`app/robots.js`, `app/sitemap.js`). The sitemap lists only `/` and `/pricing`.
3. **`/dashboard` could have been indexed.** It's linked from the menu and the homepage, but it's an app screen showing made-up demo data. It's now marked "don't index" in `app/dashboard/page.jsx`. I deliberately didn't block it in `robots.txt`, because that would stop Google from seeing the "don't index" tag.
4. **The homepage screenshot was a 3.1 MB image with no size set.** It was the biggest thing at the top of the page and made the layout jump while loading. It now loads early and at a size that fits the screen: about 8 KB at 1080px wide, down from 3.1 MB.
5. **The site name for Google.** I added a small block of structured data on the homepage that tells Google the site is called "Tallyroom". I didn't add FAQ markup for the pricing questions, because Google no longer shows those for sites like this.
6. **Security: part of your Stripe secret key was in the public pricing page.** `lib/checkout.js` added the first 7 characters of the key (`sk_test` or `sk_live`) to the plan button links, so they'd appear in the page and in Google's copy of it. I removed that. Only the start of the key was exposed, not the whole key. The checkout buttons are still placeholders that go to `/dashboard`.

Checked on the local server:
- `/` and `/pricing` load normally and have the right titles, descriptions, canonical addresses and previews.
- `/dashboard` has "don't index" on it, including when the checkout links add the plan to its address.
- `robots.txt` and the sitemap are correct, and a page that doesn't exist correctly returns "not found".

## Still to fix (I didn't change these)

- **The chat widget slows every page.** `public/vendor/support-widget.js` makes the browser wait about 0.35 seconds on every page before anything appears. It only adds its chat button when the page first finishes loading. If I simply made it load later, the button would never appear, and that means editing the supplier's code. It's worth asking SupportDesk for a version that doesn't hold up the page.
- **The homepage doesn't say what Tallyroom does.** Lines like "Revolutionize the Way You Manage Shared Expenses" and "Lightning Fast" give Google little to work with. Your pricing table and FAQ are more concrete: receipt scanning, recurring bills, six currencies, one paid account covering the whole group. That's what people will search for, so the homepage should say it.
- **Prices are in dollars, but everything else points to India.** The demo is in rupees and set in Indiranagar. If India is the main market, decide which currency to show.
- **Smaller issues:**
  - The menu has "Groups" and "Activity" both going to `/dashboard`, and "For Teams" going to `/pricing`.
  - The Team plan has no checkout button.
  - The link-preview image is the full 3.1 MB file. A 1200×630 image made for previews would be better.

## Launch-day steps (outside the code)

- Make one address the main one (for example, send `www` and `http` visitors to `https://tallyroom.app`) in your hosting settings.
- Check that preview deployments aren't indexed. Vercel handles this automatically.
- Add the site to Google Search Console and Bing Webmaster Tools.
- Submit `https://tallyroom.app/sitemap.xml`, then use URL Inspection on `/` and `/pricing`.
- Re-check the live pages against what I checked locally.
- Test the link previews with each social site's preview tool.
- Run PageSpeed Insights once real visitor data starts coming in.

Google decides when it indexes and ranks the site. These changes remove the blockers on your side; they can't guarantee timing or position.

After launch, check Search Console's indexing report every week for the first month, then monthly. Add new public pages to `app/sitemap.js` when you ship them.