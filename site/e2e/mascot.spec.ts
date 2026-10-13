import { expect, test } from "@playwright/test";

const frameOf = (pos: string) => {
  const [x, y] = pos.split(" ").map((v) => -parseFloat(v));
  return (y / 72) * 4 + x / 64;
};

test("the pixel astronaut stands on the homepage install panel and cheers on copy", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const lane = page.locator(".hero-mascot");
  const sprite = lane.locator(".mascot-sprite");
  const panel = lane.locator(".install");
  await panel.evaluate((n) => Promise.all(n.getAnimations().map((a) => a.finished)));
  const s = (await sprite.boundingBox())!;
  const b = (await panel.boundingBox())!;
  // Feet end on row 33 of 36 at 2x: 6px of transparent cell overlaps the panel's top edge.
  expect(Math.round(s.y + s.height - 6)).toBe(Math.round(b.y));
  await expect(page.locator(".v-footer .astro")).toHaveCount(1);
  await lane.getByRole("button", { name: /^Cop/ }).click();
  await expect.poll(async () => frameOf(await sprite.evaluate((n) => getComputedStyle(n).backgroundPosition)), { intervals: [50] }).toBe(13);
});

test("the astronaut holds still for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const body = page.locator(".mascot");
  const before = await body.evaluate((n) => getComputedStyle(n).transform);
  await page.waitForTimeout(6000);
  expect(await body.evaluate((n) => getComputedStyle(n).transform)).toBe(before);
  expect(await page.locator(".mascot-sprite").evaluate((n) => getComputedStyle(n).backgroundPosition)).toBe("0px 0px");
});

test("the pixel astronaut only walks where the tabs give it ground", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const tabs = (await page.locator(".hero-mascot .tabs").boundingBox())!.width;
  let furthest = 0;
  for (let i = 0; i < 40; i++) {
    furthest = Math.max(furthest, await page.locator(".hero-mascot .mascot").evaluate((n) => new DOMMatrixReadOnly(getComputedStyle(n).transform).m41));
    await page.waitForTimeout(250);
  }
  expect(furthest).toBeGreaterThan(16);
  expect(furthest).toBeLessThanOrEqual(tabs - 64);
});
