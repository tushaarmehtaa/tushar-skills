Links to the home and pricing pages will now show a large preview card: title, description and a 1200×630 image. I've tested this on a local production build; nothing will show in WhatsApp or X until tallyroom.app is live, because their crawlers have to fetch the pages and images from that address. I haven't committed anything.

**Why there was no card:** the app set no metadata at all, so pages had no title, description, OG/Twitter tags or preview image.

**What I changed**
- **`app/layout.jsx`**: every page now points at `https://tallyroom.app`. The default title is "Tallyroom — Split shared expenses", other pages get "… · Tallyroom", and there's a default description and large-image card type.
- **`app/page.jsx`** and **`app/pricing/page.jsx`**: each page has its own canonical URL, `og:url`, title and description. The pricing description uses the real plans and prices from the page.
- **`app/opengraph-image.jsx`** and **`app/pricing/opengraph-image.jsx`**: the preview images, generated at build time in the homepage's purple gradient. Both use a shared template in `lib/og-card.jsx`.

I didn't use the existing hero screenshot because it's a placeholder wireframe and the wrong shape for a share card. I also kept the homepage's "AI-driven" and "enterprise-grade security" wording off the cards, since I couldn't confirm either claim from the code.

**What I checked locally**
- The served pages have the right titles: "Tallyroom — Split shared expenses" and "Pricing · Tallyroom".
- Each page has one canonical URL, and it matches `og:url` (`https://tallyroom.app` and `https://tallyroom.app/pricing`). All the `og:*` and `twitter:*` tags are there.
- Both images return 200 as `image/png` at 1200×630. I looked at both: the text fits without clipping and stays readable small.
- The build passes.

**Things to know**
- `/dashboard` sets no metadata of its own, so it falls back to the generic site card. That's harmless for now. If it becomes a logged-in page, it should probably be marked noindex.
- Port 3123 already had another Node process (PID 37815) listening, serving an older build. I didn't touch it and ran my checks on port 3471, which I've since shut down.
- **After launch:** fetch `https://tallyroom.app` and `/pricing` to confirm the tags and images load publicly, then paste each link into WhatsApp and X. WhatsApp caches previews, so a link that was shared before launch may keep showing a bare URL for a while.