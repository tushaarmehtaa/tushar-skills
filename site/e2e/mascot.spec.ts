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

test("the pixel astronaut never walks on air: it hops down past the last tab", async ({ page }) => {
  // Fixed randomness: it idles, then heads right past Cursor, which forces the hop down to the command bar.
  await page.addInitScript(() => (Math.random = () => 0.9));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const lane = page.locator(".hero-mascot");
  await lane.locator(".install").evaluate((n) => Promise.all(n.getAnimations().map((a) => a.finished)));
  const tabs = await lane.locator(".tab").evaluateAll((ns) => ns.map((n) => n.getBoundingClientRect().toJSON()));
  const edge = Math.max(...tabs.map((r) => r.right));
  const left = tabs[0].left;
  const top = tabs[0].top;
  const bar = (await lane.locator(".cmdbar").boundingBox())!;
  const seen = { tabs: 0, bar: 0, hop: 0 };
  for (let i = 0; i < 140; i++) {
    const s = (await lane.locator(".mascot-sprite").boundingBox())!;
    const feetY = s.y + s.height - 6;
    const feetX = s.x + s.width / 2;
    if (Math.abs(feetY - top) <= 1 && feetX >= left && feetX <= edge) seen.tabs++;
    else if (Math.abs(feetY - bar.y) <= 1 && feetX >= bar.x && feetX <= bar.x + bar.width) seen.bar++;
    else {
      expect(Math.abs(feetX - edge), `floating at x=${feetX}, y=${feetY}`).toBeLessThanOrEqual(70);
      seen.hop++;
    }
    await page.waitForTimeout(100);
  }
  expect(seen.tabs).toBeGreaterThan(0);
  expect(seen.bar).toBeGreaterThan(0);
});
