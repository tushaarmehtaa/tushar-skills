import { expect, test, type Page } from "@playwright/test";

async function expectNoDocumentOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.describe("slashskills platform", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps core pages within the mobile viewport", async ({ page }) => {
    await page.goto("/");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("good work starts with a useful skill.");

    await page.goto("/cold-outreach");
    await expectNoDocumentOverflow(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("/cold-outreach");
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

  test("marks every chat-capable skill in the library", async ({ page, request }) => {
    const catalog = await (await request.get("/skills.json")).json();
    const chat = new Set(
      catalog.skills
        .filter((skill: { surfaces: string[] }) => skill.surfaces.includes("claude-app"))
        .map((skill: { slug: string }) => skill.slug),
    );
    expect(chat.has("decision-doc")).toBe(true);
    await page.goto("/");
    await page.keyboard.press("l");
    const rows = page.locator(".v-row");
    await expect(rows).toHaveCount(35);
    for (let i = 0; i < 35; i++) {
      const row = rows.nth(i);
      const slug = (await row.locator(".nm .rl").textContent())!;
      await expect(row.locator(".badge.tagchat"), slug).toHaveCount(chat.has(slug) ? 1 : 0);
    }
  });

  test("shows a real run with loaded before and after shots", async ({ page }) => {
    await page.goto("/landing-page");
    await expectNoDocumentOverflow(page);
    const output = page.getByRole("region", { name: /What you get back/ });
    await expect(output.getByRole("heading", { name: /What you get back/ })).toBeVisible();
    await expect(output.getByText(/recorded run/)).toBeVisible();
    await output.locator(".pane").scrollIntoViewIfNeeded();
    await expect(output.locator(".aprompt")).toBeVisible();
    await expect(output.locator(".pane.s4")).toBeVisible({ timeout: 15000 });
    await expect(output.locator(".aprompt .live")).toContainText("convinces");
    await expect(output.locator(".said")).not.toBeEmpty();
    const images = output.locator(".wimg img");
    await expect(images).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const image = images.nth(i);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test("shows image-editing's real run as a before and after", async ({ page }) => {
    await page.goto("/image-editing");
    await expectNoDocumentOverflow(page);
    const output = page.getByRole("region", { name: /What you get back/ });
    await expect(output.getByText(/recorded run/)).toBeVisible();
    await expect(output.locator(".wimg img")).toHaveCount(2);
    await expect(output.getByText("Banner attached, not described")).toBeVisible();
  });

  test("renders the new skill packages without mobile overflow", async ({ page }) => {
    for (const slug of ["humanize", "landing-page", "mobile-first"]) {
      await page.goto(`/${slug}`);
      await expectNoDocumentOverflow(page);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(`/${slug}`);
      await expect(page.getByRole("region", { name: `Install /${slug}` })).toBeVisible();
      await expect(page.locator(".skout")).not.toBeEmpty();
    }
  });
});
