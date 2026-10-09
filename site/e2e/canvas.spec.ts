import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
for (const width of [320, 768, 1024])
  test(`Canvas reflows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/interface-design",
      "/guides",
      "/guides/codex",
      "/guides/chatgpt",
      "/compatibility",
      "/changelog",
    ]) {
      await page.goto(path);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    }
  });
test("mobile menu, sheet focus and clipboard failure", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.goto("/interface-design");
  const install = page.getByRole("button", {
    name: "Install skill",
    exact: true,
  });
  await install.click();
  const dialog = page.getByRole("dialog", { name: "Install skill" });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close installer" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() =>
      page.evaluate(() =>
        document.querySelector("dialog")?.contains(document.activeElement),
      ),
    )
    .toBe(true);
  await page.evaluate(() =>
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: () => Promise.reject(new Error("Denied")),
    }),
  );
  await page.getByRole("button", { name: "Copy command", exact: true }).click();
  await expect(
    page.getByText("Copy failed. Select the text and copy it manually."),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Install for" })).toHaveValue(
    "global",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(install).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});
test("search typing, filters and return path", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search skills" });
  await search.pressSequentially("interface-design", { delay: 10 });
  await expect(search).toHaveValue("interface-design");
  await expect(page).toHaveURL(/q=interface-design/);
  await page
    .getByRole("button", { name: /^Build a product\s*13$/ })
    .click();
  await page.locator(".skill-row").first().click();
  await page.getByRole("link", { name: "Back to results" }).click();
  await expect(search).toHaveValue("interface-design");
  await expect(page).toHaveURL(/task=build-a-product/);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(search).toHaveValue("interface-design");
  await search.fill("zzzz-unmatched");
  await expect(
    page.getByRole("heading", { name: "No skills match your search." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit search", exact: true }).click();
  await expect(search).toBeFocused();
  await search.fill("");
  await page.getByText("Topics", { exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".topic-filter")).not.toHaveAttribute("open", "");
  await expect(page.locator(".topic-filter summary")).toBeFocused();
});
test("commands for all runtimes and scopes; exact raw source copy", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/interface-design");
  for (const [agent, label] of [
    ["codex", "Codex"],
    ["claude-code", "Claude Code"],
    ["cursor", "Cursor"],
  ]) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    for (const scope of ["global", "project"]) {
      await page
        .getByRole("combobox", { name: "Install for" })
        .selectOption(scope);
      await page
        .getByRole("button", { name: /^(Copy command|Copied)$/ })
        .click();
      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(
          `npx skills add tushaarmehtaa/tushar-skills --skill interface-design${scope === "global" ? " -g" : ""} -a ${agent} -y`,
        );
    }
  }
  await page.getByRole("button", { name: "Raw", exact: true }).click();
  await page.getByRole("button", { name: "Copy source", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(readFileSync("../interface-design/SKILL.md", "utf8"));
});
test("discovery uses one consistent treatment for every skill", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".skill-row")).toHaveCount(34);
  await expect(page.locator(".workflow-mark")).toHaveCount(34);
  await expect(page.locator(".skill-row .skill-visual")).toHaveCount(0);
  await page.goto("/interface-design");
  await expect(page.locator(".skill-outcome .skill-visual")).toBeVisible();
});
test("all catalog routes, guides, archives, metadata and recovery", async ({
  request,
}) => {
  const catalog = await (await request.get("/skills.json")).json();
  expect(catalog.skills).toHaveLength(34);
  for (const skill of catalog.skills) {
    const path = new URL(skill.url).pathname;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text()).toContain(`href="${skill.url}"`);
    const zip = await request.get(`/zips/${skill.slug}.zip`);
    expect(zip.status()).toBe(200);
    expect((await zip.body()).subarray(0, 2).toString()).toBe("PK");
  }
  for (const slug of [
    "codex",
    "claude-code",
    "cursor",
    "claude-app",
    "chatgpt",
    "image-editing-skills",
    "astra-skill-instructions",
    "mcp-event-automation",
  ])
    expect((await request.get(`/guides/${slug}`)).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(
    "https://www.slashskills.xyz/skills/changelog</loc>",
  );
  expect(sitemap).toContain("https://www.slashskills.xyz/changelog</loc>");
  expect((await request.get("/nothing-at-this-route")).status()).toBe(404);
  const og = await request.get("/api/og");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});
