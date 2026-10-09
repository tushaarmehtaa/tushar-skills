import { expect, test } from "@playwright/test";

test("long queries reflow and empty search has a working recovery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?group=grow&q=" + "a".repeat(160));
  await expect(page.getByRole("searchbox")).toHaveValue("a".repeat(160));
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await expect(page.getByText("Nothing matches that.")).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByRole("button", { name: /^Grow\s*11$/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".row")).toHaveCount(11);
  await page.getByRole("button", { name: /^All\s*34$/ }).click();
  await expect(page.locator(".row")).toHaveCount(34);
});
test("search results and the first row stay in the first screen", async ({
  page,
}) => {
  for (const [width, height] of [
    [390, 844],
    [768, 844],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await expect(page.locator(".row").first()).toBeInViewport({ ratio: 1 });
    await page.getByRole("searchbox").fill("design");
    await expect(page.locator(".row").first()).toContainText("/interface-design");
    await expect(page.locator(".row").first()).toBeInViewport({ ratio: 1 });
  }
});
test("mobile installer is inline, one tap, and appears before the output", async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/interface-design");
    const installer = page.getByRole("region", { name: "Install /interface-design" });
    const copy = installer.getByRole("button", { name: "Copy", exact: true });
    await copy.scrollIntoViewIfNeeded();
    await expect(copy).toBeInViewport();
    const layout = await page.evaluate(() => {
      const box = document.querySelector(".installer")!;
      const text = box.querySelector(".command-text")!;
      return {
        installer: box.getBoundingClientRect().bottom,
        output: document.getElementById("get-back")!.getBoundingClientRect().top,
        position: getComputedStyle(box).position,
        clipped: text.scrollWidth > text.clientWidth,
      };
    });
    expect(layout.position).toBe("static");
    expect(layout.installer).toBeLessThanOrEqual(layout.output);
    expect(layout.clipped, `command clipped at ${width}px`).toBe(false);
  }
});
test("package detail anchor opens and source reader switches files and modes", async ({
  page,
}) => {
  await page.goto("/ai-product-development#package-details");
  await expect(page.locator("#package-details")).toHaveAttribute("open", "");
  await expect(page.locator("#package-details summary")).toBeFocused();
  await page.goto("/ai-product-development");
  await expect(page.locator(".clamp")).toHaveAttribute("data-open", "false");
  await page
    .getByRole("button", { name: "Read the full skill", exact: true })
    .click();
  await expect(page.locator(".clamp")).toHaveAttribute("data-open", "true");
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
  await expect(page.locator(".clamp")).toHaveAttribute("data-open", "true");
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
test("a hash inside the clamped reader opens it on load", async ({ page }) => {
  await page.goto("/ai-product-development");
  const anchor = await page
    .locator(".reader-file")
    .nth(1)
    .getAttribute("id");
  await page.goto(`/ai-product-development#${anchor}`);
  await expect(page.locator(".clamp")).toHaveAttribute("data-open", "true");
  const target = page.locator(`[id="${anchor}"]`);
  await expect(target).toBeVisible();
  await expect(target).toBeFocused();
  await expect(target).toBeInViewport();
});
test("package links reveal hidden reference files", async ({ page }) => {
  await page.goto("/ai-product-development");
  await page
    .getByRole("button", { name: "Read the full skill", exact: true })
    .click();
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
test("every in-page link on a skill page has a target", async ({ page }) => {
  await page.goto("/ai-product-development");
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .map((a) => decodeURIComponent(a.getAttribute("href")!.slice(1)))
      .filter((id) => id && !document.getElementById(id)),
  );
  expect(missing).toEqual([]);
});
