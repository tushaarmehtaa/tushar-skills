import { expect, test } from "@playwright/test";

const frameOf = (pos: string) => {
  const [x, y] = pos.split(" ").map((v) => -parseFloat(v));
  return (y / 72) * 4 + x / 64;
};

test("the astronaut stands on the footer install bar and cheers on copy", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const lane = page.locator(".mascot-lane");
  await lane.scrollIntoViewIfNeeded();
  const sprite = lane.locator(".mascot-sprite");
  const bar = lane.locator(".cmdbar");
  const s = (await sprite.boundingBox())!;
  const b = (await bar.boundingBox())!;
  // Feet end on row 33 of 36 at 2x: 6px of transparent cell overlaps the bar's top edge.
  expect(Math.round(s.y + s.height - 6)).toBe(Math.round(b.y));
  await expect(page.locator(".astro")).toHaveCount(0);
  await bar.getByRole("button", { name: /^Cop/ }).click();
  await expect.poll(async () => frameOf(await sprite.evaluate((n) => getComputedStyle(n).backgroundPosition)), { intervals: [50] }).toBe(13);
});

test("the astronaut holds still for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const body = page.locator(".mascot");
  await body.scrollIntoViewIfNeeded();
  const before = await body.evaluate((n) => getComputedStyle(n).transform);
  await page.waitForTimeout(6000);
  expect(await body.evaluate((n) => getComputedStyle(n).transform)).toBe(before);
  expect(await page.locator(".mascot-sprite").evaluate((n) => getComputedStyle(n).backgroundPosition)).toBe("0px 0px");
});
