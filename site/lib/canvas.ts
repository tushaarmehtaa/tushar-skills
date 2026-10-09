export const TASK_GROUPS = {
  "shape-an-idea": [
    "product-spec",
    "decision-doc",
    "product-teardown",
    "user-insights",
    "fundraising",
  ],
  "build-a-product": [
    "agent-instructions",
    "ai-product-development",
    "interface-design",
    "mobile-first",
    "ui-copy",
    "supabase",
    "auth-implementation",
    "email-with-resend",
    "rate-limit",
    "performance-diagnosis",
    "remove-ai-slop",
  ],
  "get-it-out-there": [
    "landing-page",
    "landing-copy",
    "demo-video",
    "image-editing",
    "search-ready",
    "social-sharing",
    "product-launch",
    "deploy-check",
    "readme",
    "changelog",
  ],
  "earn-and-grow": [
    "payments-with-dodo",
    "credit-metering",
    "ai-cost-audit",
    "analytics",
    "cold-outreach",
    "product-experiments",
  ],
} as const;
export const TASK_LABELS: Record<string, string> = {
  "shape-an-idea": "Shape an idea",
  "build-a-product": "Build a product",
  "get-it-out-there": "Get it out there",
  "earn-and-grow": "Earn & grow",
};
export const TASK_TITLES: Record<string, string> = {
  "interface-design": "Design the interface",
  "ai-product-development": "Build the AI feature",
  "auth-implementation": "Let people sign in",
  supabase: "Give it a database",
  "product-spec": "Shape the product idea",
  "decision-doc": "Make the next decision",
  "product-teardown": "Learn from a product",
  "user-insights": "Understand your users",
  fundraising: "Prepare to raise funding",
  "agent-instructions": "Give your agent context",
  "mobile-first": "Make it work on a phone",
  "ui-copy": "Find the right words",
  "email-with-resend": "Send useful emails",
  "rate-limit": "Protect your endpoints",
  "performance-diagnosis": "Find what slows it down",
  "remove-ai-slop": "Make it feel like your product",
  "landing-page": "Build the landing page",
  "landing-copy": "Write the landing page",
  "demo-video": "Show what it can do",
  "image-editing": "Make the right image",
  "search-ready": "Help people find it",
  "social-sharing": "Make it worth sharing",
  "product-launch": "Plan the launch",
  "deploy-check": "Check before you ship",
  readme: "Explain your project",
  changelog: "Explain what changed",
  "payments-with-dodo": "Start taking payments",
  "credit-metering": "Meter product usage",
  "ai-cost-audit": "Understand your AI costs",
  analytics: "Measure what matters",
  "cold-outreach": "Start a conversation",
  "product-experiments": "Test what could work",
  humanize: "Make your writing sound human",
  "skill-creator": "Create a useful skill",
};
export function skillHref(slug: string) {
  return slug === "changelog" ? "/skills/changelog" : `/${slug}`;
}
export function matchesTask(slug: string, task: string) {
  if (!task || task === "all") return true;
  const entries: readonly string[] | undefined =
    TASK_GROUPS[task as keyof typeof TASK_GROUPS];
  return (
    !entries ||
    entries.includes(slug) ||
    ["humanize", "skill-creator"].includes(slug)
  );
}

export const SKILL_DISPLAY: Record<
  string,
  { summary: string; flow: string; icon: string }
> = {
  "interface-design": {
    summary: "Build a thoughtful, usable interface.",
    flow: "Brief → Interface",
    icon: "design",
  },
  "ai-product-development": {
    summary: "Work through models, tools, streaming and evaluation.",
    flow: "Input → Response",
    icon: "ai",
  },
  "auth-implementation": {
    summary: "Set up identity, sessions and protected routes.",
    flow: "Sign-in → Access",
    icon: "auth",
  },
  supabase: {
    summary: "Build your data layer with Supabase.",
    flow: "Data → Product",
    icon: "database",
  },
  "product-spec": {
    summary: "Turn an idea into a clear product specification.",
    flow: "Idea → Spec",
    icon: "idea",
  },
  "decision-doc": {
    summary: "Weigh the options and document the decision.",
    flow: "Options → Decision",
    icon: "file",
  },
  "product-teardown": {
    summary: "Study a product’s choices and trade-offs.",
    flow: "Product → Insight",
    icon: "search",
  },
  "user-insights": {
    summary: "Turn customer evidence into product decisions.",
    flow: "Feedback → Insight",
    icon: "search",
  },
  fundraising: {
    summary: "Prepare your story, materials and investor outreach.",
    flow: "Evidence → Pitch",
    icon: "growth",
  },
  "agent-instructions": {
    summary: "Give coding agents useful project instructions.",
    flow: "Project → Context",
    icon: "code",
  },
  "mobile-first": {
    summary: "Make layouts, touch and focus work on small screens.",
    flow: "Desktop → Mobile",
    icon: "design",
  },
  "ui-copy": {
    summary: "Write clear labels, messages and product guidance.",
    flow: "Task → Words",
    icon: "file",
  },
  "email-with-resend": {
    summary: "Build and check transactional email with Resend.",
    flow: "Event → Email",
    icon: "send",
  },
  "rate-limit": {
    summary: "Control request traffic and handle limits clearly.",
    flow: "Traffic → Limits",
    icon: "auth",
  },
  "performance-diagnosis": {
    summary: "Measure a slowdown and find its cause.",
    flow: "Slowdown → Diagnosis",
    icon: "search",
  },
  "remove-ai-slop": {
    summary: "Replace generic design and copy with deliberate choices.",
    flow: "Generic → Specific",
    icon: "design",
  },
  "landing-page": {
    summary: "Build a page around your offer and its evidence.",
    flow: "Offer → Page",
    icon: "design",
  },
  "landing-copy": {
    summary: "Explain your offer with clear, convincing copy.",
    flow: "Offer → Message",
    icon: "file",
  },
  "demo-video": {
    summary: "Turn a working product into a focused demo.",
    flow: "Product → Demo",
    icon: "play",
  },
  "image-editing": {
    summary: "Revise an image while preserving what matters.",
    flow: "Reference → Revision",
    icon: "image",
  },
  "search-ready": {
    summary: "Make your site easier to crawl and discover.",
    flow: "Site → Discovery",
    icon: "search",
  },
  "social-sharing": {
    summary: "Prepare links, previews and sharing metadata.",
    flow: "Link → Preview",
    icon: "share",
  },
  "product-launch": {
    summary: "Plan the audience, message and launch sequence.",
    flow: "Product → Launch",
    icon: "launch",
  },
  "deploy-check": {
    summary: "Check the release before it reaches users.",
    flow: "Release → Checks",
    icon: "check",
  },
  readme: {
    summary: "Explain setup, usage and contribution clearly.",
    flow: "Project → README",
    icon: "file",
  },
  changelog: {
    summary: "Turn shipped changes into useful release notes.",
    flow: "Changes → Notes",
    icon: "file",
  },
  "payments-with-dodo": {
    summary: "Set up payments, webhooks and billing flows.",
    flow: "Checkout → Payment",
    icon: "growth",
  },
  "credit-metering": {
    summary: "Track usage, credits and billing boundaries.",
    flow: "Usage → Credits",
    icon: "growth",
  },
  "ai-cost-audit": {
    summary: "Audit AI spend and the economics behind it.",
    flow: "Usage → Costs",
    icon: "growth",
  },
  analytics: {
    summary: "Choose useful events and verify your tracking.",
    flow: "Events → Measures",
    icon: "growth",
  },
  "cold-outreach": {
    summary: "Write relevant outreach with a clear next step.",
    flow: "Context → Outreach",
    icon: "send",
  },
  "product-experiments": {
    summary: "Turn a hypothesis into a measurable test.",
    flow: "Hypothesis → Test",
    icon: "route",
  },
  humanize: {
    summary: "Edit prose for a natural voice without losing meaning.",
    flow: "Draft → Voice",
    icon: "file",
  },
  "skill-creator": {
    summary: "Build, package and check a reusable skill.",
    flow: "Workflow → Skill",
    icon: "code",
  },
};
