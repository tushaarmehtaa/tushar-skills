import { ImgWipe, MfViz, SlopViz, VerdictViz, type PaneData, type Reason, type WipeCtl } from "./visuals";

export interface DemoSeed { slug: string; ask: string; said: string; ok: string[]; meta: string[] }

/** The five runs on the homepage. Every line comes from that skill's recorded run (lib/skill-proof.json, lib/skill-results.json). */
export const HOME_DEMOS: DemoSeed[] = [
  { slug: "remove-ai-slop", ask: "Our homepage looks and reads like every other AI-generated startup site. Strip out the generic stuff and apply the fixes.", said: "The hype and gradients are gone. Every new line comes from facts in the repo.", ok: ['Unbacked "AI-driven" claim cut', "3 MB wireframe → real table"], meta: ["Claude Code 2.1.295", "2m 11s", "4 files changed"] },
  { slug: "mobile-first", ask: "On my phone the site scrolls sideways, the tables run off the screen and the buttons are tiny. Fix it without changing what the pages do.", said: "The pricing page was 984px wide on a 320px phone. Now it fits.", ok: ["Tables scroll in their own box", "Edit/Delete: 20px → 44px"], meta: ["Claude Code 2.1.295", "3m 51s", "3 files changed"] },
  { slug: "landing-page", ask: "Rework our homepage so it actually convinces housemates to sign up. Right now it says nothing specific about the product.", said: "It leads with who owes what in your flat and shows the real product.", ok: ["Free for up to 4 housemates", "No made-up testimonials or stats"], meta: ["Claude Code 2.1.295", "2m 48s", "5 files changed"] },
  { slug: "deploy-check", ask: "I'm about to push this to production on Vercel tonight. Is it safe to ship? Don't deploy or push anything, just tell me.", said: "Don't ship this tonight.", ok: ["Build passes", "Nothing pushed or deployed"], meta: ["Claude Code 2.1.295", "39s", "read-only"] },
  { slug: "interface-design", ask: "Redesign the dashboard as the real home screen for a shared flat: who owes whom, what needs settling, recent activity.", said: "It opens on what you owe and the one payment that clears it.", ok: ["Fewest payments to settle up", "Undo instead of confirm steps"], meta: ["Claude Code 2.1.295", "5m 26s", "5 files changed"] },
];

export const DEPLOY_REASONS: Reason[] = [
  { tone: "bad", title: "The Stripe secret key ships to the browser", text: "A client component imports lib/checkout.js, so the key's fallback value ends up in a public JavaScript file." },
  { tone: "bad", title: "Checkout doesn't take payment", text: "The pricing buttons point at a placeholder, so nobody can pay." },
  { tone: "good", title: "The build passes. Nothing was pushed or deployed." },
];

/** The visual for a homepage demo. Uses the same pieces as the skill pages. */
export function homePane(seed: DemoSeed, ctl: WipeCtl): PaneData {
  const viz = (go: boolean) => {
    const c = { ...ctl, active: ctl.active && go };
    return seed.slug === "remove-ai-slop" ? <SlopViz ctl={c} />
      : seed.slug === "mobile-first" ? <MfViz />
      : seed.slug === "deploy-check" ? <VerdictViz reasons={DEPLOY_REASONS} go={go} />
      : <ImgWipe before={`/proof/${seed.slug}/before.jpg`} after={`/proof/${seed.slug}/after.jpg`} ctl={c} />;
  };
  return { ...seed, viz };
}
