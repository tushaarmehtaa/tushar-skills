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
  "add-analytics": {
    category: "devops",
    tags: ["analytics", "posthog", "sentry", "monitoring", "error-tracking", "observability", "health-check"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "aeo-ready": {
    category: "seo",
    tags: ["aeo", "schema", "llms-txt", "structured-data", "ai-search"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "ai-streaming": {
    category: "ai",
    tags: ["ai", "streaming", "vercel-ai-sdk", "sse", "chat", "generation", "llm"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "app-copy": {
    category: "workflow",
    tags: ["microcopy", "ux-writing", "ui-copy", "empty-states", "onboarding"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  changelog: {
    category: "workflow",
    tags: ["changelog", "twitter", "marketing", "git"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "cold-email": {
    category: "marketing",
    tags: ["email", "outreach", "sales", "networking", "founders"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "cold-outreach-sequence": {
    category: "workflow",
    tags: ["cold-email", "outreach", "sequence", "sales", "follow-up", "linkedin", "multichannel"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "debug-perf": {
    category: "devops",
    tags: ["performance", "nextjs", "turbopack", "webpack", "bundle", "caching", "cpu"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
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
  "deploy-check": {
    category: "devops",
    tags: ["deploy", "ci", "typescript", "secrets", "migrations"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "dodo-webhook": {
    category: "payments",
    tags: ["dodo-payments", "webhooks", "payments", "billing", "backend"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  economics: {
    category: "ai",
    tags: ["economics", "pricing", "margins", "ai", "cost"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "feature-flags": {
    category: "ai",
    tags: ["feature-flags", "posthog", "rollout", "ab-testing", "experiments"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "file-upload": {
    category: "infrastructure",
    tags: ["file-upload", "vercel-blob", "r2", "s3", "storage", "presigned-urls"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "gtm-launch": {
    category: "marketing",
    tags: ["gtm", "launch", "product-hunt", "positioning", "distribution"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "init-claude-md": {
    category: "workflow",
    tags: ["claude", "context", "setup", "onboarding"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "unsupported", cursor: "unsupported" },
  },
  "landing-copy": {
    category: "marketing",
    tags: ["copy", "landing-page", "conversion", "marketing", "headlines"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "make-skill": {
    category: "meta",
    tags: ["agent-skills", "automation", "workflow", "meta"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "model-audit": {
    category: "ai",
    tags: ["ai", "models", "cost", "routing", "audit", "caching", "batch"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "mvp-spec": {
    category: "planning",
    tags: ["mvp", "spec", "planning", "product", "prd"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "og-image": {
    category: "marketing",
    tags: ["og-image", "open-graph", "meta-tags", "twitter-card", "social-preview"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "pitch-vc": {
    category: "planning",
    tags: ["fundraising", "pitch", "venture-capital", "khosla", "startups"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  pmarca: {
    category: "planning",
    tags: ["pmf", "fundraising", "startups", "product-market-fit", "marc-andreessen"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "pricing-page": {
    category: "monetization",
    tags: ["pricing", "dodo-payments", "feature-gating", "subscriptions", "monetization"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "product-brief": {
    category: "planning",
    tags: ["product", "brief", "planning", "scope", "v1"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["user-files"],
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
  "remotion-video": {
    category: "workflow",
    tags: ["remotion", "video", "animation", "demo", "product-video"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
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
  "segment-users": {
    category: "analytics",
    tags: ["segmentation", "users", "cohorts", "churn", "analytics"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "seo-ready": {
    category: "seo",
    tags: ["seo", "aeo", "meta-tags", "structured-data", "sitemap", "robots-txt", "llms-txt", "open-graph", "schema", "ai-search"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "ship-credits": {
    category: "monetization",
    tags: ["credits", "payments", "monetization", "saas", "billing", "tokens", "metering", "webhooks"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "ship-email": {
    category: "infrastructure",
    tags: ["email", "resend", "transactional", "campaigns", "deliverability"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
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
  teardown: {
    category: "workflow",
    tags: ["teardown", "analysis", "competitor", "landing-page", "product-thinking"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent", "claude-app", "chatgpt"],
    capabilities: ["browser", "network", "user-files"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "tushar-design": {
    category: "design",
    tags: ["frontend", "design-system", "ui", "interaction", "web"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "browser"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  waitlist: {
    category: "marketing",
    tags: ["waitlist", "email", "launch", "early-access", "resend", "supabase"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
    support: { "claude-code": "untested", codex: "untested", cursor: "untested" },
  },
  "wire-auth": {
    category: "auth",
    tags: ["auth", "clerk", "nextauth", "supabase", "rls", "session", "security"],
    author: "tushaarmehtaa",
    surfaces: ["coding-agent"],
    capabilities: ["filesystem", "shell", "network"],
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
