import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`find and install a skill at ${width}px`, async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const search = page.getByRole("searchbox", { name: "Search skills" });
    await expect(search).toBeInViewport();
    await expect(page.locator(".skill-row").first()).toBeInViewport();
    await page.getByText("Topics", { exact: true }).click();
    await page.getByRole("combobox", { name: "Topic", exact: true }).selectOption("design");
    await expect(page).toHaveURL(/category=design/);
    await expect(page.getByRole("combobox", { name: "Topic", exact: true })).toHaveValue("design");
    await page.getByRole("combobox", { name: "Topic", exact: true }).selectOption("all");
    await page.getByText("Topics", { exact: true }).click();
    await page.getByRole("heading", { level: 1 }).click();
    await page.keyboard.press("/");
    await expect(search).toBeFocused();
    await search.fill("interface-design");
    await expect(page.locator(".skill-row").first()).toContainText("interface-design");
    await page.locator(".skill-row").first().click();
    const copy = page.getByRole("button", { name: "Copy command", exact: true });
    if (width < 1024) await page.getByRole("button", { name: "Install skill", exact: true }).click();
    await expect(copy).toBeInViewport();

    await copy.click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe("npx skills add tushaarmehtaa/tushar-skills --skill interface-design -g -a codex -y");
    await page.getByRole("tab", { name: "Claude Code", exact: true }).click();
    await page.getByRole("button", { name: "Copy command", exact: true }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("-a claude-code");
    await page.screenshot({ path: `test-results/skill-detail-${width}.png` });
    await page.goto("/");
    await page.screenshot({ path: `test-results/discovery-${width}.png` });
  });
}
