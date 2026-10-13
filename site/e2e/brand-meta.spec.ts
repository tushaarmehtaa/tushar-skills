import { expect, test } from "@playwright/test";

const PAGES = ["/", "/who-to-sell-to", "/changelog", "/compatibility", "/guides", "/guides/chatgpt", "/guides/claude-app", "/guides/codex", "/guides/astra-skill-instructions"];

test("every page shares its own brand card", async ({ page, request }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og, `${path} og:image`).toContain("/api/og");
    const res = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status(), `${path} card`).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    // X reads the page's own card, not a site-wide one.
    const meta = (sel: string) => page.locator(sel).getAttribute("content");
    expect(await meta('meta[name="twitter:title"]'), `${path} twitter:title`).toBe(await meta('meta[property="og:title"]'));
    expect(await meta('meta[name="twitter:image"]'), `${path} twitter:image`).toBe(og);
    expect(await page.title(), `${path} title`).not.toContain("—");
  }
});

test("favicons, touch icon and manifest icons all resolve", async ({ request }) => {
  for (const path of ["/favicon.ico", "/icon.svg", "/apple-icon.png", "/apple-touch-icon.png"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
  const manifest = await (await request.get("/site.webmanifest")).json();
  expect(manifest.theme_color).toBe("#FAF9F5");
  for (const icon of manifest.icons) expect((await request.get(icon.src)).status(), icon.src).toBe(200);
});
