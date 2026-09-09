import assert from "node:assert/strict";
import test from "node:test";
import {
  generateInstallCommand,
  generateRemoveCommand,
  invocationFor,
} from "../lib/agents.ts";
import { CATALOG } from "../lib/catalog.ts";
import { RUNTIME_BRANDS } from "../lib/runtime-brands.ts";
import {
  filterDirectorySkills,
  getDirectoryCategories,
  type DirectorySkill,
} from "../lib/skill-directory.ts";
import {
  createAgentPanelViewModel,
  createAgentPanelViewModels,
  createClaudeAppViewModel,
} from "../lib/skill-presentation.ts";

test("install commands are generated centrally for every runtime", () => {
  assert.equal(
    generateInstallCommand({ skill: "remove-ai-slop" }),
    "npx skills add tushaarmehtaa/tushar-skills --skill remove-ai-slop",
  );
  assert.equal(
    generateInstallCommand({ skill: "remove-ai-slop", agent: "claude-code" }),
    "npx skills add tushaarmehtaa/tushar-skills --skill remove-ai-slop -g -a claude-code -y",
  );
  assert.equal(
    generateInstallCommand({ skill: "remove-ai-slop", agent: "codex" }),
    "npx skills add tushaarmehtaa/tushar-skills --skill remove-ai-slop -g -a codex -y",
  );
  assert.equal(
    generateInstallCommand({ skill: "remove-ai-slop", agent: "cursor" }),
    "npx skills add tushaarmehtaa/tushar-skills --skill remove-ai-slop -g -a cursor -y",
  );
});

test("documented install paths match observed skills CLI destinations", async () => {
  const { AGENTS } = await import("../lib/agents.ts");
  assert.deepEqual(
    Object.fromEntries(Object.entries(AGENTS).map(([id, agent]) => [id, [agent.globalDirectory, agent.projectDirectory]])),
    {
      codex: ["~/.agents/skills", ".agents/skills"],
      "claude-code": ["~/.claude/skills", ".claude/skills"],
      cursor: ["~/.agents/skills", ".agents/skills"],
    },
  );
  for (const agent of Object.values(AGENTS)) {
    assert.match(agent.installVerification, /skills CLI 1\.5\.23/);
  }
});

test("internal support evidence controls installability without a public badge", () => {
  const tested = createAgentPanelViewModel({
    slug: "remove-ai-slop",
    agentId: "cursor",
    support: { "claude-code": "tested", codex: "tested", cursor: "tested" },
    capabilities: CATALOG["remove-ai-slop"].capabilities,
  });
  assert.equal("supportBadge" in tested, false);
  assert.equal(tested.install.visible, true);
  assert.match(tested.install.command ?? "", /-a cursor -y$/);

  const untested = createAgentPanelViewModel({
    slug: "email-with-resend",
    agentId: "claude-code",
    support: CATALOG["email-with-resend"].support,
    capabilities: CATALOG["email-with-resend"].capabilities,
  });
  assert.equal("supportBadge" in untested, false);
  assert.equal(untested.install.visible, true);
});

test("capability labels render user-facing access requirements", () => {
  const panel = createAgentPanelViewModel({
    slug: "remove-ai-slop",
    agentId: "claude-code",
    support: CATALOG["remove-ai-slop"].support,
    capabilities: CATALOG["remove-ai-slop"].capabilities,
  });
  assert.equal(panel.capabilitySection.visible, true);
  assert.equal(panel.capabilitySection.label, "required access");
  assert.deepEqual(panel.capabilitySection.items, [
    { id: "filesystem", label: "project files" },
    { id: "shell", label: "terminal commands" },
    { id: "browser", label: "browser access" },
  ]);

  const noCapabilities = createAgentPanelViewModel({
    slug: "decision-doc",
    agentId: "claude-code",
    support: CATALOG["decision-doc"].support,
    capabilities: [],
  });
  assert.equal(noCapabilities.capabilitySection.visible, false);
  assert.deepEqual(noCapabilities.capabilitySection.items, []);
});

test("Claude app gating matches the exact chat-capable whitelist", () => {
  const actual = Object.entries(CATALOG)
    .filter(([, entry]) => createClaudeAppViewModel({
      surfaces: entry.surfaces,
      capabilities: entry.capabilities,
      support: entry.support,
    }).showUploadInstructions)
    .map(([slug]) => slug)
    .sort();
  const expected = [
    "ai-cost-audit",
    "cold-outreach",
    "decision-doc",
    "fundraising",
    "humanize",
    "landing-copy",
    "product-spec",
    "product-teardown",
    "skill-creator",
    "ui-copy",
    "user-insights",
  ].sort();
  assert.deepEqual(actual, expected);

  assert.deepEqual(createClaudeAppViewModel({
    surfaces: CATALOG["decision-doc"].surfaces,
    capabilities: CATALOG["decision-doc"].capabilities,
    support: CATALOG["decision-doc"].support,
  }), {
    available: true,
    state: "available",
    heading: "Claude app",
    description: "This workflow can run in chat using the files and context you provide. Download its complete ZIP, then upload it from Claude's Skills settings.",
    downloadLabel: "↓ download ZIP",
    analyticsAgent: "claude-app",
    showUploadInstructions: true,
  });

  const localOnly = createClaudeAppViewModel({
    surfaces: CATALOG["deploy-check"].surfaces,
    capabilities: CATALOG["deploy-check"].capabilities,
    support: CATALOG["deploy-check"].support,
  });
  assert.equal(localOnly.state, "unavailable");
  assert.equal(localOnly.heading, "local coding agent required");
  assert.equal(
    localOnly.description,
    "This skill requires project files and terminal commands. Uploading it to a chat app does not provide equivalent execution.",
  );
  assert.equal(localOnly.analyticsAgent, "inspection");
  assert.equal(localOnly.showUploadInstructions, false);

  const browserDependent = createClaudeAppViewModel({
    surfaces: CATALOG["remove-ai-slop"].surfaces,
    capabilities: CATALOG["remove-ai-slop"].capabilities,
    support: CATALOG["remove-ai-slop"].support,
  });
  assert.equal(
    browserDependent.description,
    "This skill requires project files, terminal commands, and browser access. Uploading it to a chat app does not provide equivalent execution.",
  );
});

test("every agent tab view model controls a persistent unique panel", () => {
  const panels = createAgentPanelViewModels({
    slug: "decision-doc",
    support: CATALOG["decision-doc"].support,
    capabilities: CATALOG["decision-doc"].capabilities,
  });
  assert.equal(panels.length, 3);
  assert.equal(new Set(panels.map((panel) => panel.tabId)).size, 3);
  assert.equal(new Set(panels.map((panel) => panel.panelId)).size, 3);
  for (const panel of panels) {
    assert.equal(panel.tabId, `agent-tab-${panel.id}`);
    assert.equal(panel.panelId, `agent-panel-${panel.id}`);
  }
});

test("invocation syntax follows each runtime", () => {
  assert.equal(invocationFor("claude-code", "decision-doc"), "/decision-doc");
  assert.equal(invocationFor("codex", "decision-doc"), "$decision-doc or /skills");
  assert.equal(invocationFor("cursor", "decision-doc"), "/decision-doc");
});

test("remove commands put the skill before agent flags", () => {
  assert.equal(
    generateRemoveCommand("decision-doc", "codex"),
    "npx skills remove decision-doc -g -a codex -y",
  );
  assert.equal(
    generateRemoveCommand("decision-doc", "codex", "project"),
    "npx skills remove decision-doc -a codex -y",
  );
});

test("every product surface has a local runtime brand mark", () => {
  assert.deepEqual(Object.keys(RUNTIME_BRANDS).sort(), [
    "agent-skills",
    "chatgpt",
    "claude-app",
    "claude-code",
    "codex",
    "cursor",
  ]);

  for (const brand of Object.values(RUNTIME_BRANDS)) {
    const hasSvgPath = "path" in brand.icon && brand.icon.path.length > 20;
    const hasLocalImage = "imageSrc" in brand.icon && brand.icon.imageSrc.startsWith("/");
    assert.ok(hasSvgPath || hasLocalImage, `${brand.id} has a local runtime mark`);
    assert.match(brand.icon.viewBox, /^[-.\d ]+$/);
    assert.match(brand.colorOnDark, /^#[0-9A-F]{6}$/i);
    assert.match(brand.sourceUrl, /^https:\/\//);
  }
});

test("skill directory filters preserve repository order and combine criteria", () => {
  const skills = [
    {
      slug: "remove-ai-slop",
      name: "remove-ai-slop",
      category: "workflow",
      description: "Audit interface patterns with rendered evidence.",
      localAvailable: true,
      claudeAppReady: false,
    },
    {
      slug: "decision-doc",
      name: "decision-doc",
      category: "planning",
      description: "Write a structured decision document.",
      localAvailable: true,
      claudeAppReady: true,
    },
    {
      slug: "demo-video",
      name: "demo-video",
      category: "workflow",
      description: "Create product videos with Remotion.",
      localAvailable: true,
      claudeAppReady: false,
    },
  ] satisfies DirectorySkill[];

  assert.deepEqual(getDirectoryCategories(skills), ["planning", "workflow"]);
  assert.deepEqual(
    filterDirectorySkills(skills, {
      query: "document",
      category: "planning",
      surface: "chat",
    }).map((skill) => skill.slug),
    ["decision-doc"],
  );
  assert.deepEqual(
    filterDirectorySkills(skills, {
      query: "",
      category: "workflow",
      surface: "local",
    }).map((skill) => skill.slug),
    ["remove-ai-slop", "demo-video"],
  );
});

 test("search ranks names before description matches and preserves curated order without a query", () => {
  const base = { category: "design", localAvailable: true, claudeAppReady: false };
  const skills = [
    { ...base, slug: "audit", name: "audit", description: "Review interface-design output." },
    { ...base, slug: "interface-design", name: "interface-design", description: "Build interfaces." },
  ];
  assert.deepEqual(filterDirectorySkills(skills, { query: "interface-design", category: "all", surface: "all" }).map(skill => skill.slug), ["interface-design", "audit"]);
  assert.deepEqual(filterDirectorySkills(skills, { query: "", category: "all", surface: "all" }).map(skill => skill.slug), ["audit", "interface-design"]);
});
