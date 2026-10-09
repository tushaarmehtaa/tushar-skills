import { expect, test } from "@playwright/test";

for (const [width, height] of [
  [390, 844],
  [1440, 900],
]) {
  test(`hero install-all and first skill row fit the first screen at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const hero = page.locator(".hero .command");
    await expect(hero.locator(".command-text")).toHaveText(
      "npx skills add tushaarmehtaa/tushar-skills",
    );
    await expect(hero).toBeInViewport({ ratio: 1 });
    await expect(page.locator(".row").first()).toBeInViewport({ ratio: 1 });
    await expect(page.locator(".row-name").first()).toHaveText(/^\/[a-z0-9-]+$/);
    await hero.getByRole("button", { name: "Copy all", exact: true }).click();
    await expect(hero.getByRole("button", { name: "Copied", exact: true })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("npx skills add tushaarmehtaa/tushar-skills");
  });

  test(`find and install a skill at ${width}px`, async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const search = page.getByRole("searchbox", { name: "Search skills" });
    await expect(search).toBeInViewport();
    await page.getByRole("button", { name: /^Ship\s*9$/ }).click();
    await expect(page).toHaveURL(/group=ship/);
    await expect(page.locator(".row")).toHaveCount(9);
    await page.getByRole("button", { name: /^All\s*34$/ }).click();
    await page.getByRole("heading", { level: 1 }).click();
    await page.keyboard.press("/");
    await expect(search).toBeFocused();
    await search.fill("interface-design");
    await expect(page.locator(".row").first()).toContainText("/interface-design");
    await page.locator(".row").first().click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("/interface-design");
    const installer = page.getByRole("region", { name: "Install /interface-design" });
    const copy = installer.getByRole("button", { name: "Copy", exact: true });
    await copy.click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("npx skills add tushaarmehtaa/tushar-skills --skill interface-design -g -a codex -y");
    await installer.getByRole("tab", { name: "Claude Code", exact: true }).click();
    await installer.getByRole("button", { name: /^(Copy|Copied)$/ }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe("npx skills add tushaarmehtaa/tushar-skills --skill interface-design -g -a claude-code -y");
    await expect(installer).toContainText("/interface-design");
    await page.screenshot({ path: `test-results/skill-detail-${width}.png` });
    await page.goto("/");
    await page.screenshot({ path: `test-results/discovery-${width}.png` });
  });
}

test("installer tabs work from the keyboard", async ({ page }) => {
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  const tab = (name: string) => installer.getByRole("tab", { name, exact: true });
  await expect(tab("Codex")).toHaveAttribute("aria-selected", "true");
  await tab("Codex").focus();
  await page.keyboard.press("ArrowRight");
  await expect(tab("Claude Code")).toBeFocused();
  await expect(tab("Claude Code")).toHaveAttribute("aria-selected", "true");
  await expect(installer.locator(".command-text")).toContainText("-a claude-code");
  await page.keyboard.press("ArrowLeft");
  await expect(tab("Codex")).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(tab("As a prompt")).toBeFocused();
  await expect(tab("As a prompt")).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tab("Codex")).toBeFocused();
  await page.keyboard.press("End");
  await expect(tab("As a prompt")).toBeFocused();
  await expect(installer.locator('[role="tab"][tabindex="0"]')).toHaveCount(1);
  await expect(installer.getByRole("tabpanel")).toBeVisible();
});

test("installer remembers the chosen agent across a reload", async ({ page }) => {
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  await installer.getByRole("tab", { name: "Cursor", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("slashskills:agent")))
    .toBe("cursor");
  await page.reload();
  await expect(installer.getByRole("tab", { name: "Cursor", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(installer.locator(".command-text")).toHaveText(
    "npx skills add tushaarmehtaa/tushar-skills --skill interface-design -g -a cursor -y",
  );
  await page.goto("/rate-limit");
  await expect(
    page
      .getByRole("region", { name: "Install /rate-limit" })
      .getByRole("tab", { name: "Cursor", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
});

test("prompt mode hands the agent a project-scope install", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  await installer.getByRole("tab", { name: "As a prompt", exact: true }).click();
  await expect(installer.getByRole("combobox", { name: "Install for" })).toHaveCount(0);
  const command =
    "npx skills add tushaarmehtaa/tushar-skills --skill interface-design -a claude-code -y";
  await expect(installer.locator(".command-text")).toContainText(command);
  await installer.getByRole("button", { name: "Copy prompt", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain(`\`${command}\``);
  const prompt = await page.evaluate(() => navigator.clipboard.readText());
  expect(prompt).not.toContain(" -g ");
  expect(prompt).toContain("interface-design");
});
