export type AgentId = "claude-code" | "codex" | "cursor";
export type SupportStatus = "tested" | "untested" | "unsupported";
export type Surface = "coding-agent" | "claude-app" | "chatgpt";
export type ChatSurfaceId = "claude-app" | "chatgpt";
export type Capability =
  | "filesystem"
  | "shell"
  | "browser"
  | "network"
  | "user-files";

export interface CatalogEntry {
  category: string;
  tags: readonly string[];
  author: string;
  surfaces: readonly Surface[];
  capabilities: readonly Capability[];
  support: Record<AgentId, SupportStatus>;
}

export const CATALOG = {
  "image-editing": {
    category: "design",
    tags: ["images", "editing", "references", "visual-qa"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  analytics: {
    category: "analytics",
    tags: ["analytics", "posthog", "google-analytics", "sentry", "health-check", "dashboard"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "ai-cost-audit": {
    category: "ai",
    tags: ["ai", "models", "cost", "routing", "margins", "caching", "batch"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "ai-product-development": {
    category: "ai",
    tags: ["ai", "streaming", "agents", "evaluation", "observability", "safety"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "agent-instructions": {
    category: "workflow",
    tags: ["agents-md", "claude-md", "cursor", "codex", "project-instructions"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "auth-implementation": {
    category: "auth",
    tags: ["auth", "clerk", "authjs", "supabase", "authorization", "rls", "sessions"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  changelog: {
    category: "workflow",
    tags: ["changelog", "release-notes", "social", "git"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "cold-outreach": {
    category: "marketing",
    tags: ["cold-email", "outreach", "follow-up", "sales", "fundraising", "partnerships"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "credit-metering": {
    category: "monetization",
    tags: ["credits", "metering", "billing", "payments", "usage", "entitlements"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "decision-doc": {
    category: "planning",
    tags: ["decision", "tradeoffs", "architecture", "planning", "analysis"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "demo-video": {
    category: "workflow",
    tags: ["remotion", "video", "demo", "explainer", "product-video", "animation"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "deploy-check": {
    category: "devops",
    tags: ["deploy", "release", "ci", "secrets", "migrations", "preflight"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "email-with-resend": {
    category: "infrastructure",
    tags: ["email", "resend", "transactional", "campaigns", "deliverability", "preferences"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  fundraising: {
    category: "planning",
    tags: ["fundraising", "venture-capital", "pitch", "deck", "investors", "startups"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  humanize: {
    category: "workflow",
    tags: ["writing", "editing", "voice", "ai-slop", "prose", "tone"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "interface-design": {
    category: "design",
    tags: ["frontend", "interface", "design-system", "ui", "interaction", "responsive"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "landing-copy": {
    category: "marketing",
    tags: ["copy", "landing-page", "positioning", "conversion", "headlines", "claims"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "landing-page": {
    category: "marketing",
    tags: ["landing-page", "conversion", "design", "proof", "marketing", "responsive"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "mobile-first": {
    category: "design",
    tags: ["responsive", "mobile", "accessibility", "reflow", "touch", "viewport"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "payments-with-dodo": {
    category: "payments",
    tags: ["dodo-payments", "checkout", "subscriptions", "webhooks", "entitlements", "billing"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "performance-diagnosis": {
    category: "devops",
    tags: ["performance", "profiling", "nextjs", "browser", "server", "bundle", "cpu"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "product-experiments": {
    category: "analytics",
    tags: ["experiments", "feature-flags", "posthog", "rollout", "ab-testing", "measurement"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "product-launch": {
    category: "marketing",
    tags: ["launch", "go-to-market", "positioning", "distribution", "waitlist", "measurement"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "product-spec": {
    category: "planning",
    tags: ["product", "brief", "mvp", "spec", "scope", "acceptance-criteria"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "product-teardown": {
    category: "workflow",
    tags: ["teardown", "competitor", "positioning", "ux", "copy", "research"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "rate-limit": {
    category: "devops",
    tags: ["rate-limit", "upstash", "redis", "security", "api", "abuse-prevention"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  readme: {
    category: "workflow",
    tags: ["readme", "documentation", "github", "open-source", "developer-experience"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "remove-ai-slop": {
    category: "workflow",
    tags: ["design", "copy", "audit", "refactor", "quality"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "search-ready": {
    category: "seo",
    tags: ["seo", "ai-search", "schema", "metadata", "sitemap", "robots", "content", "llms-txt"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "skill-creator": {
    category: "meta",
    tags: ["agent-skills", "skill-md", "workflow", "validation", "packaging"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "social-sharing": {
    category: "marketing",
    tags: ["open-graph", "social-preview", "metadata", "share-image", "twitter-card"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  supabase: {
    category: "devops",
    tags: ["supabase", "postgres", "rls", "auth", "migrations", "typescript"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "ui-copy": {
    category: "workflow",
    tags: ["ui-copy", "microcopy", "ux-writing", "errors", "empty-states", "voice"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "user-insights": {
    category: "analytics",
    tags: ["users", "segmentation", "retention", "churn", "cohorts", "analytics"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
} as const satisfies Record<string, CatalogEntry>;

export type SkillSlug = keyof typeof CATALOG;

export const CATALOG_SLUGS = Object.keys(CATALOG) as SkillSlug[];

export function isSkillSlug(value: string): value is SkillSlug {
  return value in CATALOG;
}

export function supportsClaudeApp(surfaces: readonly Surface[]): boolean {
  return surfaces.includes("claude-app");
}

export function supportsChatGPT(surfaces: readonly Surface[]): boolean {
  return surfaces.includes("chatgpt");
}
