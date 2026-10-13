import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
for (const width of [320, 390, 768, 1024, 1440])
  test(`Canvas reflows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/interface-design",
      "/remove-ai-slop",
      "/rate-limit",
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
test("mobile menu focus and clipboard failure", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  const panel = page.getByRole("navigation", { name: "Menu" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("link")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.click();
  await panel.getByRole("link", { name: /Guides/ }).click();
  await expect(page).toHaveURL(/\/guides$/);
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  await expect(installer.getByRole("combobox", { name: "Install for" })).toHaveValue(
    "global",
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: () => Promise.reject(new Error("Denied")),
    });
    document.execCommand = () => false;
  });
  await installer.getByRole("button", { name: "Copy install command" }).click();
  await expect(
    installer.getByRole("button", { name: "Select the command and copy it" }),
  ).toBeVisible();
  await expect(installer.getByRole("status")).toHaveText(
    "Copy failed. Select the command and copy it manually.",
  );
});
test("search typing, group filter and return path", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("/");
  const search = page.getByRole("searchbox", { name: "Search skills" });
  await search.pressSequentially("interface-design", { delay: 10 });
  await expect(search).toHaveValue("interface-design");
  await expect(page).toHaveURL(/q=interface-design/);
  await expect(page.locator(".v-row").first()).toContainText("interface-design");
  await page.locator(".v-row").first().getByRole("link").click();
  await expect(page).toHaveURL(/\/interface-design$/);
  await page.goBack();
  await expect(search).toHaveValue("interface-design");
  await expect(page.locator(".v-row").first()).toContainText("interface-design");
  const build = page.getByRole("tab", { name: /^build\s*10$/i });
  await build.click();
  await expect(search).toHaveValue("");
  await expect(build).toHaveAttribute("aria-selected", "true");
  await expect(page).toHaveURL(/group=build/);
  await expect(page.locator(".v-row")).toHaveCount(10);
  await page.reload();
  await expect(build).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".v-row")).toHaveCount(10);
  await page.keyboard.press("/");
  await search.fill("zzzz-unmatched");
  await expect(page.getByText("Nothing matches that.")).toBeVisible();
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(page.locator(".v-row")).toHaveCount(10);
  await page.getByRole("tab", { name: /^all\s*35$/i }).click();
  await page.keyboard.press("l");
  await expect(page.locator(".v-row")).toHaveCount(35);
  await expect(page).not.toHaveURL(/group=/);
});
test("commands for all runtimes and scopes; exact raw source copy", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/interface-design");
  const installer = page.getByRole("region", { name: "Install /interface-design" });
  for (const [agent, label] of [
    ["claude-code", "Claude Code"],
    ["codex", "Codex"],
    ["cursor", "Cursor"],
  ]) {
    await installer.getByRole("tab", { name: label, exact: true }).click();
    for (const scope of ["global", "project"]) {
      await installer
        .getByRole("combobox", { name: "Install for" })
        .selectOption(scope);
      const command = `npx skills add tushaarmehtaa/tushar-skills --skill interface-design${scope === "global" ? " -g" : ""} -a ${agent} -y`;
      await expect(installer.locator(".cmd")).toHaveAttribute("data-command", command);
      await installer.getByRole("button", { name: /^Cop/ }).click();
      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(command);
    }
  }
  await page.getByRole("button", { name: "Read the full skill", exact: true }).click();
  await page.getByRole("button", { name: "Raw", exact: true }).click();
  await page.getByRole("button", { name: "Copy source", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(readFileSync("../interface-design/SKILL.md", "utf8"));
});
test("discovery uses one consistent treatment for every skill", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("l");
  const rows = page.locator(".v-row");
  await expect(rows).toHaveCount(35);
  for (let i = 0; i < 35; i++) {
    const link = rows.nth(i).locator(".nm .rl");
    const name = (await link.textContent())!;
    expect(name, `row ${i}`).toMatch(/^[a-z0-9-]+$/);
    expect(await link.getAttribute("href"), name).toMatch(new RegExp(`/${name}$`));
    expect(await rows.nth(i).locator(".ds").textContent(), name).toBeTruthy();
    await expect(rows.nth(i).locator(".ico svg"), name).toHaveCount(1);
  }
  await page.goto("/interface-design");
  await expect(page.getByText(/Illustrative concept/)).toHaveCount(0);
});
test("all catalog routes, guides, archives, metadata and recovery", async ({
  request,
}) => {
  const catalog = await (await request.get("/skills.json")).json();
  expect(catalog.skills).toHaveLength(35);
  for (const skill of catalog.skills) {
    const path = new URL(skill.url).pathname;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain(`href="${skill.url}"`);
    expect(html, path).toContain(`${skill.slug}</span>`);
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
