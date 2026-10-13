import { expect, test } from "@playwright/test";

const ALL = (agent: string) => `npx skills add tushaarmehtaa/tushar-skills -g -a ${agent} -y`;
const CMD = (skill: string, agent: string, scope = " -g") => `npx skills add tushaarmehtaa/tushar-skills --skill ${skill}${scope} -a ${agent} -y`;

for (const [width, height] of [
  [390, 844],
  [1440, 900],
]) {
  test(`hero install and the demo strip fit the first screen at ${width}px`, async ({ page, context }) => {
    await page.setViewportSize({ width, height });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const install = page.getByRole("region", { name: "Install all skills" });
    await expect(install.locator(".cmd")).toHaveAttribute("data-command", ALL("claude-code"));
    await expect(install).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("good work starts with a useful skill.");
    await install.getByRole("button", { name: "Copy install command" }).click();
    await expect(install.getByRole("button", { name: "Copied" })).toBeVisible();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(ALL("claude-code"));
  });

  test(`find and install a skill at ${width}px`, async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("tab", { name: /^ship\s*9$/i }).click();
    await expect(page).toHaveURL(/group=ship/);
    await expect(page.locator(".v-row")).toHaveCount(9);
    await page.getByRole("tab", { name: /^all\s*35$/i }).click();
    await expect(page.locator(".v-row")).toHaveCount(12);
    await page.getByRole("button", { name: "Load more" }).click();
    await expect(page.locator(".v-row")).toHaveCount(35);
    await page.getByRole("heading", { level: 1 }).click();
    await page.keyboard.press("/");
    const search = page.getByRole("searchbox", { name: "Search skills" });
    await expect(search).toBeFocused();
    await search.fill("interface-design");
    await expect(page.locator(".v-row").first()).toContainText("interface-design");
    await page.locator(".v-row").first().getByRole("link", { name: "interface-design" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("/interface-design");
    const installer = page.getByRole("region", { name: "Install /interface-design" });
    await installer.getByRole("button", { name: "Copy install command" }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(CMD("interface-design", "claude-code"));
    await installer.getByRole("tab", { name: "Codex", exact: true }).click();
    await installer.getByRole("button", { name: /^Cop/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(CMD("interface-design", "codex"));
    await page.screenshot({ path: `test-results/skill-detail-${width}.png` });
    await page.goto("/");
    await page.screenshot({ path: `test-results/discovery-${width}.png` });
  });
}

test("a directory row copies the install for the chosen agent", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("tab", { name: "Cursor", exact: true }).click();
  await page.locator("#skill-deploy-check").hover();
  await page.getByRole("button", { name: "Copy install command for deploy-check" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(CMD("deploy-check", "cursor"));
});

test("demo strip: number keys switch the run and update the install", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("heading", { level: 1 }).click();
  await page.keyboard.press("4");
  await expect(page.getByRole("tab", { name: /deploy-check/ })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".pane.on .stamp")).toHaveText("BLOCKED");
});

test("installer tabs work from the keyboard", async ({ page }) => {
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  const tab = (name: string) => installer.getByRole("tab", { name, exact: true });
  await expect(tab("Claude Code")).toHaveAttribute("aria-selected", "true");
  await tab("Claude Code").focus();
  await page.keyboard.press("ArrowRight");
  await expect(tab("Codex")).toBeFocused();
  await expect(tab("Codex")).toHaveAttribute("aria-selected", "true");
  await expect(installer.locator(".cmd")).toHaveAttribute("data-command", /-a codex/);
  await page.keyboard.press("ArrowLeft");
  await expect(tab("Claude Code")).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(tab("As a prompt")).toBeFocused();
  await expect(tab("As a prompt")).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tab("Claude Code")).toBeFocused();
  await page.keyboard.press("End");
  await expect(tab("As a prompt")).toBeFocused();
  await expect(installer.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  await expect(installer.getByRole("tabpanel")).toBeVisible();
});

test("installer remembers the chosen agent across a reload and other skills", async ({ page }) => {
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  await installer.getByRole("tab", { name: "Cursor", exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("slashskills:agent"))).toBe("cursor");
  await page.reload();
  await expect(installer.getByRole("tab", { name: "Cursor", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(installer.locator(".cmd")).toHaveAttribute("data-command", CMD("interface-design", "cursor"));
  await page.goto("/rate-limit");
  await expect(
    page.getByRole("region", { name: "Install /rate-limit" }).getByRole("tab", { name: "Cursor", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});

test("prompt mode hands the agent a project-scope install", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  await installer.getByRole("tab", { name: "As a prompt", exact: true }).click();
  await expect(installer.getByRole("combobox", { name: "Install for" })).toHaveCount(0);
  const command = "npx skills add tushaarmehtaa/tushar-skills --skill interface-design -a claude-code -y";
  await expect(installer.locator(".cmd")).toContainText(command);
  await installer.getByRole("button", { name: "Copy install command" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(`\`${command}\``);
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).not.toContain(" -g ");
  expect(prompt).toContain("interface-design");
});
