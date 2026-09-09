import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`guide discovery and package download at ${width}px`, async ({ page, request }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "guides", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Latest guides" })).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath("homepage-guides.png") });
    await page.locator("#guides").getByRole("link").filter({ hasText: "Build an image-editing skill" }).click();
    await expect(page).toHaveURL(/\/guides\/image-editing-skills$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.slashskills.xyz/guides/image-editing-skills");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Get the image-editing skill" })).toBeInViewport();
    if (width < 1024) await page.getByText("In this guide", { exact: false }).filter({ hasText: "sections" }).click();
    const toc = page.getByRole("navigation", { name: "Guide contents" }).filter({ visible: true });
    await toc.getByRole("link", { name: /Start with a change/ }).click();
    await expect(page.getByRole("heading", { name: "Start with a change/preserve contract" })).toBeInViewport();
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy example" }).first().click();
    await expect(page.getByRole("status").filter({ hasText: "Example copied" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("Edit the attached product photograph.");
    await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Guides" }).click();
    await expect(page).toHaveURL(/\/#guides$/);
    await page.goto("/guides/image-editing-skills");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("image-guide.png"), fullPage: true });
    await page.getByRole("link", { name: "revision record", exact: true }).click();
    const fragment = new URL(page.url()).hash.slice(1);
    await expect(page.locator(`[id="${fragment}"]`)).toBeVisible();
    const archive = await request.get("/zips/image-editing.zip");
    expect(archive.status()).toBe(200);
    expect((await archive.body()).subarray(0, 2).toString()).toBe("PK");
    await page.goto("/guides/astra-skill-instructions");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("GPT-6 Astra");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("link", { name: "Get the skill-creator workflow" }).click();
    await expect(page).toHaveURL(/\/skill-creator$/);
    await expect(page.getByRole("heading", { name: "Put this skill to work" })).toBeVisible();
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/guides/image-editing-skills", "/guides/astra-skill-instructions", "/image-editing"]) {
      expect(sitemap).toContain(`https://www.slashskills.xyz${path}</loc>`);
    }
  });
}
