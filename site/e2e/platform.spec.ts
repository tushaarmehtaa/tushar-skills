import { expect, test, type Page } from "@playwright/test";

async function expectNoDocumentOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.describe("slashskills platform", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps core pages within the mobile viewport", async ({ page }) => {
    await page.goto("/");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "workflows saved as Agent Skills." })).toBeVisible();

    await page.goto("/cold-outreach-sequence");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "cold-outreach-sequence" })).toBeVisible();

    await page.goto("/compatibility");
    await expectNoDocumentOverflow(page);
    const matrix = page.locator('[role="region"]');
    await expect(matrix).toBeVisible();
    await expect(page.getByText("Swipe horizontally to compare runtimes.")).toBeVisible();
  });

  test("requires an explicit runtime and scope before generating an install command", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Choose a runtime and scope to generate an install command.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy install command" })).toHaveCount(0);

    await page.getByLabel("Runtime").selectOption("codex");
    await page.getByLabel("Scope").selectOption("global");
    await expect(page.locator("code").filter({ hasText: "npx skills add" }).last()).toContainText("-g -a codex -y");
    await expect(page.getByRole("button", { name: "Copy install command" })).toBeVisible();
  });

  test("keeps chat-capable skills in the local-agent filter", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Surface").selectOption("local");
    await expect(page.getByRole("link", { name: /decision-doc/ })).toBeVisible();
    await expect(page).toHaveURL(/surface=local/);
  });
});
