import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("home is server rendered and the existing catalogue route is preserved", async ({
  page,
  request,
}) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("Everyday accessories.");
  await page.goto("/");
  await page.waitForFunction(
    () => document.documentElement.dataset.tradeReady === "true",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ready for your business.",
  );
  await page
    .getByRole("button", { name: "Our Catalogue", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: /View All Products/ })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator(".product-card")).toHaveCount(6);
});
test("filters, search and explicit empty states work", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(6);
  await page
    .getByRole("combobox", { name: "Category", exact: true })
    .selectOption("electronics");
  await expect(page.locator(".product-card")).toHaveCount(3);
  await page
    .getByRole("searchbox", { name: "Search catalogue" })
    .fill("EL-001");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("combobox", { name: "Maximum MOQ" }).selectOption("10");
  await expect(
    page.getByRole("heading", { name: "No matching ranges" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all ranges" }).click();
  await expect(page.locator(".product-card")).toHaveCount(6);
  await expect(page.getByLabel("Maximum unit price (GBP)")).toBeDisabled();
});
test("enquiry cart persists, samples remain separate and unconfigured checkout cannot pretend to submit", async ({
  page,
}) => {
  await page.goto("/product/wireless-audio");
  await expect(page.getByText("MOQ", { exact: true })).toHaveCount(0);
  await page.getByLabel("Quantity required").fill("12");
  await page.getByRole("button", { name: "Add to enquiry list" }).click();
  await page.getByRole("button", { name: /Request a sample/ }).click();
  await page.goto("/cart");
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await page.reload();
  await expect(
    page.getByRole("spinbutton", {
      name: "Quantity for Wireless audio accessories",
      exact: true,
    }),
  ).toHaveValue("12");
  await page.getByRole("link", { name: /Continue to quote request/ }).click();
  await expect(
    page.getByRole("button", { name: /Submit quotation request/ }),
  ).toBeDisabled();
  await expect(
    page.getByText("Quote submission is not connected yet."),
  ).toBeVisible();
});
test("CSV import is atomic, validates unknown references and combines duplicates", async ({
  page,
}) => {
  await page.goto("/quick-order");
  const input = page.getByLabel("Choose CSV file");
  await input.setInputFiles({
    name: "invalid.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("sku,quantity\nEL-001,5\nFAKE,2"),
  });
  await expect(page.locator(".error[role=alert]")).toContainText(
    "unknown reference",
  );
  await page.goto("/cart");
  await expect(
    page.getByRole("heading", { name: "Your next enquiry starts here." }),
  ).toBeVisible();
  await page.goto("/quick-order");
  await page.getByLabel("Choose CSV file").setInputFiles({
    name: "valid.csv",
    mimeType: "text/csv",
    buffer: Buffer.from('\uFEFFsku,quantity\n"EL-001",5\nEL-001,2\nCA-002,3'),
  });
  await expect(
    page.getByRole("status").filter({ hasText: "3 valid lines added" }),
  ).toBeVisible();
  await page.goto("/cart");
  await expect(page.locator(".cart-line")).toHaveCount(2);
  await expect(
    page.getByRole("spinbutton", {
      name: "Quantity for Wireless audio accessories",
      exact: true,
    }),
  ).toHaveValue("7");
});
test("private endpoints disclose no prices and enforce origin checks", async ({
  request,
}) => {
  const prices = await request.get("/api/prices");
  expect(prices.status()).toBe(503);
  expect(await prices.json()).not.toHaveProperty("tiers");
  const forged = await request.post("/api/orders", {
    headers: { origin: "https://attacker.example" },
    data: { lines: [] },
  });
  expect(forged.status()).toBe(403);
  const session = await request.get("/api/session");
  expect(await session.json()).toEqual({ configured: false, account: null });
});
test("wholesale application and account states are honest without providers", async ({
  page,
}) => {
  await page.goto("/wholesale-application");
  await expect(
    page.getByRole("button", { name: /Submit wholesale application/ }),
  ).toBeDisabled();
  await page.goto("/account");
  await expect(
    page.getByRole("button", { name: "Sign in ↗", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "minlength",
    "12",
  );
});
test("SEO routes and missing pages return their correct content and HTTP status", async ({
  request,
}) => {
  expect((await request.get("/not-a-real-product")).status()).toBe(404);
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/product/wireless-audio");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  const product = await (await request.get("/product/wireless-audio")).text();
  expect(product).toContain('rel="canonical"');
  expect(product).not.toContain('"@type":"Offer"');
});
test("mobile navigation, layout and key pages have no WCAG A/AA axe violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("button", { name: "Our Catalogue" })
    .click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "View All Products" })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  for (const path of [
    "/",
    "/shop",
    "/product/wireless-audio",
    "/cart",
    "/checkout",
    "/wholesale-application",
    "/account",
    "/quick-order",
    "/contact",
  ]) {
    await page.goto(path);
    await page.waitForTimeout(300);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow on ${path}`,
    ).toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, `accessibility on ${path}`).toEqual([]);
  }
});
