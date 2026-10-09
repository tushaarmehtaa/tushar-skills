I fixed all three problems. The site no longer scrolls sideways on phones, both tables now scroll inside their own box instead of pushing the page wider, and the buttons are touch-sized. What the pages do hasn't changed: same links, checkout targets and table data. I haven't committed anything.

**Page width, before → after** (measured in a headless browser on a production build):

| Width | Home | Pricing | Dashboard |
|---|---|---|---|
| 320px | 788 → 320 | 984 → 320 | 904 → 320 |
| 375px | 787 → 375 | 984 → 375 | 904 → 375 |
| 768px | 787 → 768 | 984 → 768 | 904 → 768 |
| 1440px | no change | no change | no change |

The 768px row means tablets were broken too, because the nav alone was 787px wide.

**What I changed** (`app/globals.css`, plus a wrapper element in `app/pricing/page.jsx` and `app/dashboard/page.jsx`):

- **Nav:** below 960px, the logo and "Start free trial" share the top row and the seven links wrap onto the rows below. Every destination stays visible, and I didn't add a hamburger menu. One trade-off: the trial button sits visually first, but keyboard Tab still reaches it after the links.
- **Pricing table:** it scrolls sideways inside its own area, and the Feature column stays pinned so each row stays readable while you scroll. Column headers wrap on phones so more plans fit on screen.
- **Dashboard ledger:** it scrolls inside its own area too, and fits completely at 768px. Both tables can be scrolled with the keyboard and screen readers announce them by name.
- **Dashboard totals:** the three cards stack full-width on phones and sit in one row on tablets.
- **Buttons:**
  - Edit/Delete went from 20px to 44px on touch screens and 32px with a mouse. 20px was below the WCAG AA minimum of 24px.
  - "Choose Plus/Household" went from 21px tall to 44px. This also makes them bigger on desktop.
  - Nav links and the trial button are 44px tall on narrow screens.
- **Home:** the headline and spacing scale down, the feature cards stack on narrow screens, and the two hero buttons can wrap.
- **Support chat bubble:** the round chat button sat over content at the bottom of the page. On phones I added space at the bottom so the last content can scroll clear of it, without editing the vendored widget.

**What I checked:** the 320/375/768/1440px widths with screenshots, a 320px viewport (the WCAG reflow condition at 400% zoom), the touch sizing using touch-mode emulation, and Tab order on Pricing and Dashboard. The build passes; the repo has no tests.

**Still needed:** a check on a real phone, especially iOS Safari, for the bottom spacing near the home bar and how sideways scrolling inside the tables feels. I didn't test 200% text enlargement or landscape separately.

**Two problems outside this task, which I didn't touch:**
- `lib/checkout.js` puts the first 7 characters of `STRIPE_SECRET_KEY` into the checkout URL. Because it's imported by a client component, its fallback string also ships to the browser.
- `public/vendor/support-widget.js` freezes the page for about 350ms in `<head>` before anything appears, and that delay is worse on phones.