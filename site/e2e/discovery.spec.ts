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
    const categories = page.getByRole("group", { name: "Skill categories" });
    await categories.getByRole("button", { name: "design", exact: true }).click();
    await expect(page).toHaveURL(/category=design/);
    await expect(categories.getByRole("button", { name: "design", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("heading", { name: "Skills", exact: true })).toBeInViewport();
    await categories.getByRole("button", { name: "All skills", exact: true }).click();
    await page.keyboard.press("/");
    await expect(search).toBeFocused();
    await search.fill("interface-design");
    await expect(page.locator(".skill-row").first()).toContainText("interface-design");
    await page.locator(".skill-row").first().click();
    const copy = page.getByRole("button", { name: "Copy command", exact: true });
    await expect(copy).toBeInViewport();
    await expect(page.getByText("Package details", { exact: true })).toBeVisible();
    await expect(page.getByText("Other platforms and downloads", { exact: true })).toBeVisible();
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
