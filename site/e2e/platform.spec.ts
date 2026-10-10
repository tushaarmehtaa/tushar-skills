import { expect, test, type Page } from "@playwright/test";

async function expectNoDocumentOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.describe("slashskills platform", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps core pages within the mobile viewport", async ({ page }) => {
    await page.goto("/");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { name: "Great work starts with a useful skill." })).toBeVisible();

    await page.goto("/cold-outreach");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("/cold-outreach");
    await expect(page.getByRole("heading", { name: "What you get back" })).toBeVisible();
    await expect(page.locator("main [data-status]:not(.command-copy)")).toHaveCount(0);

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

  test("marks every chat-capable skill in the library", async ({ page, request }) => {
    const catalog = await (await request.get("/skills.json")).json();
    const chat = new Set(
      catalog.skills
        .filter((skill: { surfaces: string[] }) => skill.surfaces.includes("claude-app"))
        .map((skill: { slug: string }) => skill.slug),
    );
    expect(chat.has("decision-doc")).toBe(true);
    await page.goto("/");
    const rows = page.locator(".row");
    await expect(rows).toHaveCount(34);
    for (let i = 0; i < 34; i++) {
      const row = rows.nth(i);
      const slug = (await row.locator(".row-name").textContent())!.slice(1);
      await expect(row.getByText("Chat too", { exact: true }), slug).toHaveCount(chat.has(slug) ? 1 : 0);
    }
    await page.getByRole("searchbox", { name: "Search skills" }).fill("decision-doc");
    await expect(page.getByRole("link", { name: /^\/decision-doc/ })).toContainText("Chat too");
  });

  test("shows a real run with loaded before and after shots", async ({ page }) => {
    await page.goto("/remove-ai-slop");
    await expectNoDocumentOverflow(page);
    const output = page.getByRole("region", { name: "What you get back" });
    await expect(output.getByRole("heading", { name: "What you get back" })).toBeVisible();
    await expect(output.getByText("From a real run on a sample project", { exact: true })).toBeVisible();
    await expect(output.locator(".ask")).toBeVisible();
    await expect(output.locator(".result-headline")).not.toBeEmpty();
    for (const name of ["Sample project before /remove-ai-slop", "Sample project after one /remove-ai-slop run"]) {
      const image = output.getByRole("img", { name });
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test("shows image-editing's real run as a before and after", async ({ page }) => {
    await page.goto("/image-editing");
    await expectNoDocumentOverflow(page);
    const output = page.getByRole("region", { name: "What you get back" });
    await expect(output.getByText("From a real run on a sample project")).toBeVisible();
    await expect(output.getByRole("img")).toHaveCount(2);
    await expect(output.getByText("Banner attached, not described")).toBeVisible();
  });

  test("renders the new skill packages without mobile overflow", async ({ page }) => {
    for (const slug of ["humanize", "landing-page", "mobile-first"]) {
      await page.goto(`/${slug}`);
      await expectNoDocumentOverflow(page);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(`/${slug}`);
      await expect(page.getByRole("region", { name: `Install /${slug}` })).toBeVisible();
      await expect(page.locator(".skill-lead")).not.toBeEmpty();
    }
  });
});
