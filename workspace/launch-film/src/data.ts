// Act 2 renders from the site's run records, so every result on screen comes from a real run.
import results from "../../../site/lib/skill-results.json";
import profiles from "../../../site/lib/skill-profiles.json";
import type { Brand } from "./Logo";

type Row = { label: string; value: string };
export type Result = {
  ask: string;
  headline: string;
  groups?: { title: string; rows: Row[] }[];
  reasons?: { tone: string; title: string; text?: string }[];
  chips?: string[];
  rewrite?: { before: string; after: string; cut?: string[] };
};
export const result = (slug: string) => (results as Record<string, Result>)[slug];

const order = (profiles as { groupOrder: Record<string, string[]> }).groupOrder;
export const ALL_SKILLS = ["shape", "build", "ship", "grow"].flatMap((g) => order[g]);
export const SKILL_COUNT = ALL_SKILLS.length;

// Act 1 is a dramatisation: the searches a builder makes before giving up. Each rhymes with an act 2 run.
export type Hit = { brand: Brand | null; site: string; crumb: string; title: string; snippet: string };
export const RESULTS: Hit[][] = [
  [
    { brand: "clerk", site: "Clerk", crumb: "clerk.com › docs › quickstarts › nextjs", title: "Next.js Quickstart (App Router)", snippet: "Add authentication and user management to your Next.js app. Install @clerk/nextjs, then wrap your app in ClerkProvider." },
    { brand: null, site: "Auth.js", crumb: "authjs.dev › getting-started", title: "Getting Started | Auth.js", snippet: "Auth.js is a set of open-source packages built on standard Web APIs for authentication in modern applications." },
    { brand: "supabase", site: "Supabase", crumb: "supabase.com › docs › guides › auth", title: "Auth | Supabase Docs", snippet: "Use Supabase to authenticate and authorize your users. Supports password, magic link, OTP, social login and SSO." },
    { brand: "reddit", site: "Reddit · r/nextjs", crumb: "120+ comments · 1y", title: "Clerk vs Auth.js vs Supabase Auth in 2026?", snippet: "I've rebuilt auth three times now. Every option has a catch, and nobody agrees on which one…" },
  ],
  [
    { brand: "stripe", site: "Stripe Docs", crumb: "docs.stripe.com › billing › subscriptions", title: "Build a subscriptions integration", snippet: "Create and manage subscriptions to accept recurring payments. Listen for webhook events to provision access." },
    { brand: "stackoverflow", site: "Stack Overflow", crumb: "stackoverflow.com › questions", title: "Webhook signature verification failed in Next.js route", snippet: "No signatures found matching the expected signature for payload. The raw body is being parsed…" },
    { brand: "github", site: "GitHub", crumb: "github.com › vercel › next.js › discussions", title: "Webhook fires twice, user charged once?", snippet: "Retries delivered the same event twice and we created two subscriptions. How do you make it idempotent…" },
    { brand: "youtube", site: "YouTube", crumb: "youtube.com · 1:42:08", title: "Full SaaS Billing Tutorial (Next.js 15, 2026)", snippet: "In this tutorial we build subscriptions from scratch. Part 1 of 4." },
  ],
  [
    { brand: "reddit", site: "Reddit · r/webdev", crumb: "200+ comments · 1y", title: "What's on your deploy checklist?", snippet: "Env vars, migrations, secrets, rollback plan. I always forget one of these at 2am." },
    { brand: "vercel", site: "Vercel", crumb: "vercel.com › docs › environment-variables", title: "Environment Variables | Vercel Docs", snippet: "Environment variables are key-value pairs configured outside your source code. Prefix with NEXT_PUBLIC_ to expose…" },
    { brand: "github", site: "GitHub", crumb: "github.com › topics › secrets", title: "I leaked my API key in a client bundle", snippet: "Woke up to a bill. The key was in a public JS chunk the whole time." },
    { brand: "hn", site: "Hacker News", crumb: "news.ycombinator.com", title: "Ask HN: How do you know it's safe to deploy?", snippet: "Honestly? We ship and watch the error tracker." },
  ],
];

// What Google offers under the box while you type.
export const SUGGESTIONS: string[][] = [
  ["clerk vs auth.js", "clerk vs auth.js vs supabase auth", "clerk vs auth0", "clerk vs auth.js reddit"],
  ["nextjs subscription", "nextjs subscriptions webhook not firing", "nextjs subscription billing", "nextjs subscriptions stripe"],
  ["is it safe to deploy on friday", "is it safe to deploy tonight", "is it safe to deploy without tests", "is it safe to deploy to production"],
];
export const PICKED = 1;

// The spiral after the three: everything else a first product makes you look up.
export const ENDLESS_QUERIES = [
  "env var undefined in production", "nextjs hydration error", "stripe test mode vs live", "resend emails going to spam",
  "rate limit api route nextjs", "og image not showing on x", "vercel build failed exit code 1", "what is idempotency",
  "supabase auth redirect loop", "cors error fetch", "how to write terms of service", "sitemap app router",
  "how to get first 100 users", "postgres migration locked table", "do i need a cookie banner", "how to price a saas",
  "why is lighthouse red", "dark mode flash on load", "how to write a changelog", "is my api key leaked",
  "webhook fired twice", "how to test payments", "favicon not updating", "should i raise money",
];
export const ENDLESS_TABS: { title: string; brand: Brand | null }[] = [
  { title: "Stack Overflow", brand: "stackoverflow" }, { title: "Docs", brand: null }, { title: "GitHub Issues", brand: "github" },
  { title: "Reddit", brand: "reddit" }, { title: "YouTube", brand: "youtube" }, { title: "Next.js Docs", brand: "next" },
  { title: "Discord", brand: "discord" }, { title: "MDN", brand: "mdn" }, { title: "Hacker News", brand: "hn" },
  { title: "Medium", brand: "medium" }, { title: "Vercel Docs", brand: "vercel" }, { title: "Supabase Docs", brand: "supabase" },
  { title: "Stripe Docs", brand: "stripe" }, { title: "DEV Community", brand: "dev" }, { title: "npm", brand: "npm" },
];

// Act 2: one line you'd say out loud, one proof line straight from the run.
export const BEATS: Record<string, { line: string; proof: string }> = {
  "auth-implementation": { line: "only the right people get in.", proof: "Signed out goes to sign-in. Members see only their own groups." },
  "payments-with-dodo": { line: "people can pay you now.", proof: "Bad signatures rejected. Repeat deliveries saved once." },
  "mobile-first": { line: "fits the smallest phone.", proof: "The pricing page was 984px wide on a 320px phone." },
  "deploy-check": { line: "catches the leak before your users do.", proof: "Checked before you pushed. Nothing was deployed." },
};
