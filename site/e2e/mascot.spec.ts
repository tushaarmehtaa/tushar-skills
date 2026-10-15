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

for (const [seed, move, frames] of [
  [0.45, "flies past Cursor, then opens the laptop", [16, 17, 21, 22]],
  [0.3, "spins all the way round", [23, 24, 25]],
  [0.6, "goes for a space swim", [18, 19, 20]],
] as const) {
  test(`the pixel astronaut ${move}`, async ({ page }) => {
    await page.addInitScript((r) => (Math.random = () => r), seed);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const sprite = page.locator(".hero-mascot .mascot-sprite");
    const seen = new Set<number>();
    const t0 = Date.now();
    while (Date.now() - t0 < 14000 && !frames.every((f) => seen.has(f))) {
      seen.add(frameOf(await sprite.evaluate((n) => getComputedStyle(n).backgroundPosition)));
      await page.waitForTimeout(40);
    }
    for (const f of frames) expect(seen, `pose ${f}`).toContain(f);
  });
}

test.describe("playing with the astronaut", () => {
  test.beforeEach(async ({ page }) => {
    // Fixed randomness: it idles where it starts, so the click lands on it.
    await page.addInitScript(() => (Math.random = () => 0));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator(".hero-mascot .install").evaluate((n) => Promise.all(n.getAnimations().map((a) => a.finished)));
  });

  const feet = async (page: import("@playwright/test").Page) => {
    const s = (await page.locator(".hero-mascot .mascot-sprite").boundingBox())!;
    return { x: s.x + s.width / 2, y: s.y + s.height - 6 };
  };
  const hold = async (page: import("@playwright/test").Page, key: string, ms: number) => {
    await page.keyboard.down(key);
    await page.waitForTimeout(ms);
    await page.keyboard.up(key);
  };

  test("arrows walk it, space jumps, and the page never scrolls", async ({ page }) => {
    const astronaut = page.getByRole("button", { name: "Play with the astronaut" });
    const hint = page.locator(".mascot-hint");
    await expect(hint).toBeHidden();
    await astronaut.click();
    await expect(astronaut).toHaveAttribute("aria-pressed", "true");
    await expect(hint).toBeVisible();
    const pageY = await page.evaluate(() => window.scrollY);

    const start = await feet(page);
    await hold(page, "ArrowRight", 500);
    const walked = await feet(page);
    expect(walked.x - start.x).toBeGreaterThan(30);
    expect(walked.y).toBeCloseTo(start.y, 0);

    await page.keyboard.press(" ");
    await expect.poll(async () => (await feet(page)).y, { intervals: [20] }).toBeLessThan(start.y - 20);
    await expect.poll(async () => Math.round((await feet(page)).y)).toBe(Math.round(start.y));
    expect(await page.evaluate(() => window.scrollY)).toBe(pageY);

    await page.keyboard.press("Escape");
    await expect(astronaut).toHaveAttribute("aria-pressed", "false");
    await expect(hint).toBeHidden();
  });

  test("it walks off the last tab onto the bar, and needs a jump to get back up", async ({ page }) => {
    const lane = page.locator(".hero-mascot");
    const tabs = await lane.locator(".tab").evaluateAll((ns) => ns.map((n) => n.getBoundingClientRect().toJSON()));
    const edge = Math.max(...tabs.map((r) => r.right));
    const top = tabs[0].top;
    const bar = (await lane.locator(".cmdbar").boundingBox())!;
    await page.getByRole("button", { name: "Play with the astronaut" }).click();

    await page.keyboard.down("ArrowRight");
    await expect.poll(async () => (await feet(page)).x, { timeout: 15000 }).toBeGreaterThan(edge + 40);
    await page.keyboard.up("ArrowRight");
    await expect.poll(async () => Math.round((await feet(page)).y)).toBe(Math.round(bar.y));

    // The end of the tabs is a wall at bar level.
    await hold(page, "ArrowLeft", 1500);
    const blocked = await feet(page);
    expect(blocked.x).toBeGreaterThan(edge);
    expect(Math.round(blocked.y)).toBe(Math.round(bar.y));

    await page.keyboard.down("ArrowLeft");
    await page.keyboard.press(" ");
    await page.waitForTimeout(700);
    await page.keyboard.up("ArrowLeft");
    await expect.poll(async () => Math.round((await feet(page)).y)).toBe(Math.round(top));
    expect((await feet(page)).x).toBeLessThan(edge);
  });

  test("holding up fires the jetpack, and clicking away hands it back", async ({ page }) => {
    const astronaut = page.getByRole("button", { name: "Play with the astronaut" });
    const sprite = page.locator(".hero-mascot .mascot-sprite");
    await astronaut.click();
    const start = await feet(page);
    await page.keyboard.down("ArrowUp");
    await expect.poll(async () => frameOf(await sprite.evaluate((n) => getComputedStyle(n).backgroundPosition)), { intervals: [20] }).toBeGreaterThanOrEqual(16);
    await expect.poll(async () => (await feet(page)).y).toBeLessThan(start.y - 25);
    await page.keyboard.up("ArrowUp");
    await expect.poll(async () => Math.round((await feet(page)).y)).toBe(Math.round(start.y));

    await page.getByRole("heading", { level: 1 }).click();
    await expect(astronaut).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".mascot-hint")).toBeHidden();
  });
});

test("the astronaut can be picked up from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const astronaut = page.getByRole("button", { name: "Play with the astronaut" });
  await astronaut.focus();
  await page.keyboard.press("Enter");
  await expect(astronaut).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Enter");
  await expect(astronaut).toHaveAttribute("aria-pressed", "false");
});

test("the astronaut is not playable on touch screens", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".hero-mascot .mascot-sprite")).not.toHaveAttribute("role", "button");
  await expect(page.locator(".mascot-hint")).toHaveCount(0);
  await context.close();
});
