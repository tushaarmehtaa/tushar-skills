import { expect, test, type Page } from "@playwright/test";

async function expectNoDocumentOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.describe("slashskills platform", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps core pages within the mobile viewport", async ({ page }) => {
    await page.goto("/");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "Good work starts with a useful skill." })).toBeVisible();

    await page.goto("/cold-outreach");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "Start a conversation" })).toBeVisible();
    await expect(page.locator("main [data-status]")).toHaveCount(0);

    await page.goto("/compatibility");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "Requirements", exact: true })).toBeVisible();
    const matrix = page.locator('[role="region"]');
    await expect(matrix).toBeVisible();
    await expect(page.getByText("Swipe horizontally to compare requirements.")).toBeVisible();
    await expect(page.getByText(/^(Tested|Untested|Available|Unsupported)$/)).toHaveCount(0);

    await page.goto("/guides/cursor");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "Cursor Agent Skills" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keep a skill active with Custom Mode" })).toBeVisible();
    await expect(page.getByText("Swipe horizontally to compare all three columns.")).toBeVisible();
    await expect(page.getByRole("region", { name: "Cursor workflow mechanism comparison" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Official Cursor skill docs ↗" })).toHaveAttribute(
      "href",
      "https://cursor.com/docs/skills",
    );
  });

  test("requires an explicit runtime and scope before generating an install command", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Installation options", { exact: true }).click();
    await expect(page.getByText("Choose a runtime and scope to generate an install command.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy install command" })).toHaveCount(0);

    await page.getByLabel("Runtime").selectOption("codex");
    await page.getByLabel("Scope").selectOption("global");
    await expect(page.locator("code").filter({ hasText: "npx skills add" }).last()).toContainText("-g -a codex -y");
    await expect(page.getByRole("button", { name: "Copy install command" })).toBeVisible();
  });

  test("keeps chat-capable skills in the local-agent filter", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Platform", exact: true }).selectOption("local");
    await expect(page.getByRole("combobox", { name: "Platform", exact: true })).toHaveValue("local");
    await expect(page.getByRole("link", { name: /decision-doc/ })).toBeVisible();
    await expect(page).toHaveURL(/surface=local/);
  });

  test("renders the new skill packages without mobile overflow", async ({ page }) => {
    for (const slug of ["humanize", "landing-page", "mobile-first"]) {
      await page.goto(`/${slug}`);
      await expectNoDocumentOverflow(page);
      await expect(page.locator(".skill-intro .skill-pill").first()).toBeVisible();
    }
  });
});
