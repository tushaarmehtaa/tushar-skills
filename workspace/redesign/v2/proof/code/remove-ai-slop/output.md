I rewrote the homepage and fixed it in place. `next build` passes, and I compared screenshots before and after at 1440px and 390px. Nothing is committed.

**Copy: removed and why**
- **"✨ Introducing Tallyroom"** was decoration that said nothing new. Deleted.
- **"Revolutionize the Way You Manage Shared Expenses"** and the "unlock… seamless… empowers… elevate your financial harmony" paragraph never said what the product does. It also claimed **"AI-driven,"** and nothing in the repo shows AI.
- **"Get Started Today 🚀" / "Learn More"** didn't say where they lead. They now read **"Compare plans"** (goes to /pricing) and **"See a sample group"** (goes to /dashboard).
- **The three feature cards** ("Lightning Fast", "Enterprise-grade security", "Collaborate with your team… productivity") made claims the repo can't back up, and were written for workplace teams rather than flatmates.

**New copy.** Every line comes from something already in the repo: the pricing table, the FAQ, or the sample dashboard data.
- **Headline:** "Track shared bills and see who owes whom."
- **Subheading:** says you log who paid, split it between the people it was for, and get a running balance. It notes the free plan covers one group of up to four people.
- **"What a group can do":** four items:
  - uneven splits
  - recurring bills (marked "Plus and up")
  - six currencies at daily exchange rates (marked "Plus and up")
  - one paid account covers the whole group

**Design**
- **Purple gradients and effects:** removed the gradient background, the gradient-filled headline, the glow shadows, and the gradient emoji icon tiles. The hero is now left-aligned on white. I kept the purple you already use (`#764ba2`) as the single accent, so it still matches the nav button, pricing buttons and chat widget.
- **Buttons:** one primary and one secondary style, with hover and keyboard-focus states and the same 8px corners as the nav button.
- **Hero image:** `hero-dashboard.png` was a grey wireframe on a grainy gradient, 3 MB, with alt text calling it the Tallyroom dashboard. I replaced it with a real table of four expenses from the sample group. The sample data now lives in `lib/sampleGroup.js` and the dashboard reads it from there too. I checked the dashboard after the change and it renders the same.
- **Mobile:** at 390px the headline used to run off the screen and the three cards were squeezed into narrow columns. The headline now shrinks to fit, the four items stack, and the table scrolls sideways inside its box.

**Problems I found but didn't change** (outside the homepage content, or your call):
1. **Chat widget slows every page.** `public/vendor/support-widget.js` loads first in `<head>` and spins the CPU for about 350ms before anything appears.
2. **Stripe key handling.** `lib/checkout.js` reads `STRIPE_SECRET_KEY` inside a module the browser loads, and puts the first 7 characters into checkout URLs (still a "TODO: move to env" placeholder). Server-only code should handle secret keys.
3. **"Start free trial" is wrong.** The nav button says it, but pricing offers a free plan, not a trial.
4. **The nav doesn't fit on phones.** Its seven links run off the edge at 390px, and Dashboard, Groups and Activity all go to the same page.
5. **Unused image.** `public/hero-dashboard.png` (3 MB) is no longer used. I left it in place; it's safe to delete.

I can fix items 1–4 if you want.