import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { approvedProducts } from "../../lib/homepage-content";
const paths = ["/", "/shop", "/about", "/contact", "/terms", "/privacy"];
const widths = [360, 390, 768, 820, 1024, 1280, 1440];
async function ready(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await page.waitForFunction(
    () => document.documentElement.dataset.showcaseReady === "true",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
}
for (const width of widths)
  for (const path of paths)
    test(`${path} at ${width}px: layout, images, semantics and console`, async ({
      page,
    }) => {
      const errors: string[] = [];
      const failed: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (e) => {
        if (e.type() === "error") errors.push(e.text());
      });
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      await page.setViewportSize({ width, height: 900 });
      await ready(page, path);
      await expect(page.locator("h1")).toHaveCount(1);
      if (path === "/shop")
        await expect(
          page.locator(".product-filters [aria-current=page]"),
        ).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator("footer").scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        for (const img of document.images) img.loading = "eager";
        await Promise.all(
          [...document.images].map((img) => img.decode().catch(() => {})),
        );
      });
      expect(
        await page
          .locator('img:not([alt=""])')
          .evaluateAll((imgs) =>
            imgs
              .filter((i) => !(i as HTMLImageElement).naturalWidth)
              .map((i) => i.getAttribute("src")),
          ),
      ).toEqual([]);
      await expect(page.locator("footer")).toContainText(
        "117 Crocketts Road, Birmingham, England, B21 0HS",
      );
      await expect(page.locator("footer")).toContainText("17532062");
      if (width === 390 || width === 1440)
        expect(
          (
            await new AxeBuilder({ page })
              .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag22a",
                "wcag21aa",
                "wcag22aa",
              ])
              .analyze()
          ).violations,
        ).toEqual([]);
      await page.evaluate(() => scrollTo(0, 0));
      await mkdir("test-results/showcase-screenshots", { recursive: true });
      await page.screenshot({
        path: `test-results/showcase-screenshots/${path === "/" ? "home" : path.slice(1)}-${width}.png`,
        fullPage: true,
      });
      expect(errors).toEqual([]);
      expect(failed).toEqual([]);
    });
for (const viewport of [
  { width: 820, height: 390 },
  { width: 1440, height: 620 },
])
  test(`short viewport navigation and contact ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await ready(page, "/contact");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (viewport.width < 961) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: "Close navigation menu" }).click();
    }
    await page
      .getByRole("textbox", { name: "Message", exact: false })
      .fill("Landscape contact form remains usable.");
    await page
      .getByRole("textbox", { name: "Message", exact: false })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("textbox", { name: "Message", exact: false }),
    ).toBeInViewport();
  });
test("desktop dropdown supports hover, keyboard, Escape and current page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page, "/");
  const trigger = page.getByRole("button", {
    name: "Our Products",
    exact: true,
  });
  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(
    page.getByRole("link", { name: /All Products.*Explore/ }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("link", { name: /RFID Wallets.*Everyday/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.locator("h1").click();
  await trigger.hover();
  const category = page.getByRole("link", { name: /Car Accessories.*Explore/ });
  await category.hover();
  await expect(category).toBeVisible();
  await category.click();
  await expect(page).toHaveURL(/shop\?category=car-accessories/);
  await expect(page.locator(".showcase-card")).toHaveCount(1);
  await expect(trigger).toHaveAttribute("aria-current", "page");
});
test("mobile drawer traps focus, expands, closes after navigation and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page, "/");
  const opener = page.getByRole("button", { name: "Open navigation menu" });
  await opener.click();
  const dialog = page.getByRole("dialog");
  const close = dialog.getByRole("button", { name: "Close navigation menu" });
  await expect(close).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: "Wholesale Enquiry", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await dialog.getByRole("button", { name: "Our Products" }).click();
  await dialog.getByRole("link", { name: "RFID Wallets", exact: true }).click();
  await expect(page).toHaveURL(/category=rfid-wallets/);
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await opener.click();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});
test("shared products, category filters and every product enquiry prefill agree", async ({
  page,
}) => {
  await ready(page, "/");
  await expect(page.locator(".showcase-card")).toHaveCount(4);
  for (const product of approvedProducts) {
    await expect(
      page.getByRole("heading", { name: product.name, exact: true }),
    ).toBeVisible();
  }
  await page.goto("/shop");
  await expect(page.locator(".showcase-card")).toHaveCount(4);
  for (const product of approvedProducts) {
    const card = page.locator(`article[id="${product.id}"]`);
    await expect(card).toContainText(product.detail);
    await card
      .getByRole("link", { name: "Enquire About This Product" })
      .click();
    await expect(page.getByLabel("Product of interest")).toHaveValue(
      product.id,
    );
    await expect(page.getByLabel("Enquiry type")).toHaveValue(
      "Wholesale Products",
    );
    await page.goto("/shop");
  }
  await page
    .getByRole("navigation", { name: "Product categories" })
    .getByRole("link", { name: "Charging Cables" })
    .click();
  await expect(page.locator(".showcase-card")).toHaveCount(2);
});
test("company, service and balance copy is exact and no old commerce links remain", async ({
  page,
}) => {
  for (const path of paths) {
    await ready(page, path);
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(
      /wall adapter|Product photograph pending|VAT registered|Founder|Owner|15.day/i,
    );
    await expect(
      page.locator(
        'a[href="/cart"],a[href="/checkout"],a[href="/account"],a[href="/quick-order"],a[href="/wholesale-application"]',
      ),
    ).toHaveCount(0);
  }
  await page.goto("/about");
  await expect(page.locator("main")).toContainText(
    "Mohammad Ummar Khan is the director of EBAY 1ST CHOICE LTD.",
  );
  expect(await page.locator("main").innerText()).not.toMatch(
    /Lightning|RFID|Car Charger|Nylon/,
  );
  await page.goto("/terms");
  await expect(page.locator("main")).toContainText(
    "remaining unused balance is £700",
  );
  await expect(page.locator("main")).toContainText(
    "Amounts already used for orders are not included",
  );
});
test("internal links, legacy visits, metadata and 404 response work", async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const path of paths) {
    await ready(page, path);
    expect((await request.get(path)).status()).toBe(200);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
      links.add(href);
    await expect(page.locator("title")).not.toBeEmpty();
  }
  for (const link of links) {
    expect((await request.get(link)).status(), link).toBe(200);
  }
  for (const path of [
    "/cart",
    "/checkout",
    "/account",
    "/quick-order",
    "/wholesale-application",
    "/product/wireless-audio",
    "/product/phone-mounts",
    "/product/mobile-accessories",
    "/product/automotive-essentials",
    "/shop/electronics",
  ]) {
    const r = await request.get(path);
    expect(r.status()).toBe(200);
    expect(r.url()).toMatch(/\/(contact|shop)/);
  }
  expect((await request.get("/not-a-real-page")).status()).toBe(404);
  expect((await request.get("/api/session")).status()).toBe(410);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});
test("retired delivery endpoint cannot send through the previous provider", async ({
  request,
}) => {
  const forged = await request.post("/api/enquiries", {
    headers: { origin: "https://attacker.example" },
    data: {},
  });
  expect(forged.status()).toBe(410);
  const invalid = await request.post("/api/enquiries", {
    headers: { origin: "http://127.0.0.1:3000" },
    data: { name: "A", email: "invalid" },
  });
  expect(invalid.status()).toBe(410);
  expect(await invalid.json()).not.toHaveProperty("accepted");
});
test("contact validation, service fields, failed sends preserve text; duplicate clicks submit once", async ({
  page,
}) => {
  await ready(page, "/contact?product=lightning-cable");
  const send = page.getByRole("button", { name: "Send Enquiry", exact: true });
  // Formspree requests are intercepted; this test sends no real email.
  await expect(send).toBeEnabled();
  await send.click();
  await expect(
    page.getByText("Enter your full name.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await page.getByLabel("Full name").fill("QA Test Buyer");
  await page.getByLabel("Email address").fill("qa@example.com");
  await page
    .getByLabel("Message", { exact: false })
    .fill("Clearly labelled automated QA enquiry — do not send.");
  await page.getByLabel("Enquiry type").selectOption("3PL Services");
  await expect(page.getByLabel("Product of interest")).toHaveCount(0);
  await page.getByLabel("Enquiry type").selectOption("Wholesale Products");
  let count = 0;
  await page.route("https://formspree.io/f/myewknly", async (route) => {
    count++;
    await new Promise((r) => setTimeout(r, 250));
    await route.fulfill({
      status: 503,
      json: { errors: [{ message: "Test provider unavailable." }] },
    });
  });
  await send.dblclick({ force: true });
  await expect(page.getByRole("status")).toContainText(
    "Your enquiry could not be submitted.",
  );
  expect(count).toBe(1);
  await expect(page.getByLabel("Message", { exact: false })).toHaveValue(
    "Clearly labelled automated QA enquiry — do not send.",
  );
  await expect(send).toBeEnabled();
  await page.unroute("https://formspree.io/f/myewknly");
  await page.route("https://formspree.io/f/myewknly", async (route) => {
    count++;
    const data = route.request().postDataJSON();
    expect(data.email).toBe("qa@example.com");
    await route.fulfill({
      status: 202,
      json: {
        ok: true,
        message: "Thank you! Your enquiry has been submitted.",
      },
    });
  });
  await send.click();
  await expect(page.getByRole("status")).toContainText(
    "Thank you! Your enquiry has been submitted.",
  );
  await expect(
    page.getByRole("button", { name: "Enquiry accepted" }),
  ).toBeDisabled();
  expect(count).toBe(2);
});
test("application sets no cookies or browser storage and serves no secret to the browser", async ({
  page,
  context,
}) => {
  await ready(page, "/contact");
  expect(await context.cookies()).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
    })),
  ).toEqual({ local: 0, session: 0 });
  expect(await page.content()).not.toMatch(
    /test-only-placeholder|UPSTASH_REDIS_REST_TOKEN|RESEND_API_KEY/,
  );
});
