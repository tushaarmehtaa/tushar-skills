import { expect, test } from "@playwright/test";

test("long queries reflow and empty search has a working recovery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?q=" + "a".repeat(160));
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.locator(".skill-row")).toHaveCount(34);
  await page
    .getByRole("combobox", { name: "Platform", exact: true })
    .selectOption("chat");
  await page.getByRole("searchbox").fill("zzzz");
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .last()
    .click();
  await expect(page.getByRole("searchbox")).toHaveValue("zzzz");
  await expect(
    page.getByRole("button", { name: "Clear search", exact: true }),
  ).toBeVisible();
});
test("tablet discovery and active search give results priority", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 844 });
  await page.goto("/");
  await expect
    .poll(() =>
      page
        .locator(".skill-row")
        .first()
        .evaluate((n) => n.getBoundingClientRect().bottom),
    )
    .toBeLessThan(844);
  await page.getByRole("searchbox").fill("design");
  await expect
    .poll(() =>
      page
        .locator(".skill-row")
        .first()
        .evaluate((n) => n.getBoundingClientRect().top),
    )
    .toBeLessThan(420);
  await page.getByRole("link", { name: "Install collection" }).click();
  await expect(
    page.getByRole("heading", { name: "Want the whole collection?" }),
  ).toBeInViewport();
});
test("mobile installer is inline and appears before the outcome", async ({ page }) => {
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/interface-design");
    const install = page.getByRole("button", { name: "Install skill", exact: true });
    await expect(install).toBeInViewport();
    const positions = await page.evaluate(() => ({
      button: document.querySelector(".install-mobile-bar")!.getBoundingClientRect().bottom,
      preview: document.querySelector(".skill-outcome")!.getBoundingClientRect().top,
      position: getComputedStyle(document.querySelector(".install-mobile-bar")!).position,
    }));
    expect(positions.position).toBe("static");
    expect(positions.button).toBeLessThanOrEqual(positions.preview);
  }
});
test("package detail anchor opens and source reader switches files and modes", async ({
  page,
}) => {
  await page.goto("/ai-product-development");
  await page
    .getByRole("link", { name: "Package details", exact: true })
    .click();
  await expect(page.locator("#package-details")).toHaveAttribute("open", "");
  await expect(page.locator("#package-details summary")).toBeFocused();
  await page.getByRole("link", { name: "Instructions", exact: true }).click();
  await expect(page.locator(".reader-sidebar")).toBeVisible();
  const fileLinks = page
    .getByRole("navigation", { name: "Package files", exact: true })
    .getByRole("link");
  expect(await fileLinks.count()).toBeGreaterThan(1);
  await fileLinks.nth(1).click();
  const filename = await fileLinks.nth(1).textContent();
  await expect(page.locator(".reader-file:visible")).toHaveCount(1);
  await expect(page.locator(".reader-filename")).toContainText(filename!);
  await page.getByRole("button", { name: "Raw", exact: true }).click();
  await expect(page.locator(".reader-raw")).toBeVisible();
  await expect(page.locator(".reader-file:visible .prose")).not.toBeVisible();
  await page.reload();
  await expect(page.locator(".reader-filename")).toContainText(filename!);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("combobox", { name: "Package file" }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Package file" })
    .selectOption({ label: "SKILL.md" });
  await expect(page.locator(".reader-filename")).toContainText("SKILL.md");
  await page.locator(".reader-mobile-files summary").click();
  await page.locator(".reader-mobile-files nav a").first().click();
  await expect(
    page.locator(".reader-mobile-files details"),
  ).not.toHaveAttribute("open", "");
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});
test("package links reveal hidden reference files", async ({ page }) => {
  await page.goto("/ai-product-development");
  const link = page
    .locator('.reader-file:visible .prose a[href^="#package-file-"]')
    .first();
  const href = await link.getAttribute("href");
  expect(href).toBeTruthy();
  await link.click();
  const target = page.locator(`[id="${href!.slice(1)}"]`);
  await expect(target).toBeVisible();
  await expect(target).toBeFocused();
});
