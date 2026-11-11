import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
async function ready(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.waitForFunction(
    () => document.documentElement.dataset.tradeReady === "true",
  );
}
test("home exposes the approved product groups, no wall-adapter imagery or retail/account promotions", async ({
  page,
}) => {
  await ready(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const hero = page.getByRole("region", {
    name: "Everyday accessories. Ready for your business.",
  });
  const heroBox = await hero.boundingBox();
  expect(heroBox?.x).toBe(0);
  expect(heroBox?.width).toBe(page.viewportSize()?.width);
  await expect(page.getByText("THE PRODUCT SHOWCASE", { exact: true })).toHaveCount(0);
  for (const name of [
    "4-in-1 Nylon-Braided Cable",
    "USB-C to Lightning Cable",
    "Compact Car Charger",
    "Aluminium RFID Card Holder",
  ])
    await expect(
      page.getByRole("heading", { level: 3, name, exact: true }),
    ).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(
    /Samsung|Apple|iPhone|wall adapter|bestseller|£|\$|Sign up|Add to cart/i,
  );
  await expect(page.locator("main img")).toHaveCount(11);
  await expect(page.locator('picture source[srcset^="/images/hero/"]')).toHaveCount(5);
  await expect(page.locator("main")).toContainText("USB-C to USB-C");
  await expect(page.getByText(/Product photograph pending/i)).toHaveCount(0);
  await expect(
    page.getByRole("link", {
      name: /account|checkout|registration|shopping cart/i,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /submit|register/i }),
  ).toHaveCount(0);
});
test("desktop catalogue supports click, hover, arrow keys, Escape and real anchor destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  const trigger = page.getByRole("button", {
    name: "Our Catalogue",
    exact: true,
  });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await trigger.press("ArrowDown");
  await expect(
    page.getByRole("link", { name: /View All Products/ }),
  ).toBeFocused();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("link", { name: /RFID Wallets.*Everyday carry essentials/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.locator("h1").click();
  await trigger.hover();
  const cables = page.getByRole("link", { name: /Charging Cables.*Braided/ });
  await cables.hover();
  await expect(cables).toBeVisible();
  await cables.click();
  await expect(page).toHaveURL(/#charging-cables$/);
  const top = await page.locator("#charging-cables").boundingBox();
  expect(top!.y).toBeGreaterThanOrEqual(86);
});
test("mobile drawer expands categories, traps focus, closes and restores opener focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await ready(page);
  const opener = page.getByRole("button", { name: "Open navigation menu" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close navigation menu" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: "Wholesale Enquiry", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close navigation menu" }),
  ).toBeFocused();
  await dialog.getByRole("button", { name: "Our Catalogue" }).click();
  await expect(
    dialog.getByRole("link", { name: "RFID Wallets" }),
  ).toBeVisible();
  await dialog.getByRole("link", { name: "RFID Wallets" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#rfid-wallets$/);
  await opener.click();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await dialog.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(dialog).not.toBeVisible();
});
test("three slides have stationary copy, next/previous, indicators and swipe", async ({
  page,
}) => {
  await ready(page);
  const carousel = page.getByRole("region", {
    name: "Wholesale product ranges",
  });
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveCount(1);
  const initial = await heading.boundingBox();
  const labels = ["Charging Cables", "Car Accessories", "RFID Wallets"];
  for (let i = 0; i < 3; i++) {
    await carousel
      .getByRole("button", { name: `Show ${labels[i]} slide` })
      .click();
    await expect(
      carousel.getByRole("group", { name: `${i + 1} of 3: ${labels[i]}` }),
    ).toBeVisible();
    await expect(
      carousel.getByRole("button", { name: `Show ${labels[i]} slide` }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(heading).toHaveCount(1);
    expect(await heading.boundingBox()).toEqual(initial);
  }
  await carousel
    .getByRole("button", { name: "Show Charging Cables slide" })
    .click();
  await carousel.getByRole("button", { name: "Next product slide" }).click();
  await expect(
    carousel.getByRole("button", { name: "Show Car Accessories slide" }),
  ).toHaveAttribute("aria-pressed", "true");
  await carousel
    .getByRole("button", { name: "Previous product slide" })
    .click();
  await expect(
    carousel.getByRole("button", { name: "Show Charging Cables slide" }),
  ).toHaveAttribute("aria-pressed", "true");
  await carousel.evaluate((el) => {
    el.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        touches: [
          new Touch({ identifier: 1, target: el, clientX: 300, clientY: 200 }),
        ],
      }),
    );
    el.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 1, target: el, clientX: 140, clientY: 205 }),
        ],
      }),
    );
  });
  await expect(
    carousel.getByRole("button", { name: "Show Car Accessories slide" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("autoplay advances around five seconds, pauses on focus and has explicit pause control", async ({
  page,
}) => {
  await ready(page);
  const carousel = page.getByRole("region", {
    name: "Wholesale product ranges",
  });
  await carousel.hover();
  await page.waitForTimeout(5300);
  await expect(
    carousel.getByRole("button", { name: "Show Charging Cables slide" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(0, 0);
  await expect(
    carousel.getByRole("button", { name: "Show Car Accessories slide" }),
  ).toHaveAttribute("aria-pressed", "true", { timeout: 6500 });
  await carousel
    .getByRole("button", { name: "Pause product slideshow" })
    .focus();
  await page.waitForTimeout(5300);
  await expect(
    carousel.getByRole("button", { name: "Show Car Accessories slide" }),
  ).toHaveAttribute("aria-pressed", "true");
  await carousel
    .getByRole("button", { name: "Pause product slideshow" })
    .click();
  await expect(
    carousel.getByRole("button", { name: "Play product slideshow" }),
  ).toBeVisible();
});
test("reduced motion disables automatic sliding while manual navigation remains available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const carousel = page.getByRole("region", {
    name: "Wholesale product ranges",
  });
  await expect(
    carousel.getByRole("button", {
      name: "Autoplay disabled by reduced motion preference",
    }),
  ).toBeDisabled();
  await page.waitForTimeout(5300);
  await expect(
    carousel.getByRole("button", { name: "Show Charging Cables slide" }),
  ).toHaveAttribute("aria-pressed", "true");
  await carousel.getByRole("button", { name: "Next product slide" }).click();
  await expect(
    carousel.getByRole("button", { name: "Show Car Accessories slide" }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("all visible homepage destinations exist, with no new browser errors", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error") errors.push(e.text());
  });
  await ready(page);
  const links = await page
    .locator("a")
    .evaluateAll((as) => as.map((a) => a.getAttribute("href")).filter(Boolean));
  for (const href of [...new Set(links)]) {
    const url = new URL(href!, "http://127.0.0.1:3000");
    if (url.origin !== "http://127.0.0.1:3000") continue;
    if (url.pathname === "/" && url.hash)
      await expect(page.locator(url.hash)).toHaveCount(1);
    else expect((await request.get(url.pathname)).status()).toBe(200);
  }
  expect(errors).toEqual([]);
});
for (const width of [375, 768, 1024, 1440])
  test(`rendered homepage at ${width}px has no overflow or WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const a = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(a.violations).toEqual([]);
    await mkdir("test-results/homepage-screenshots", { recursive: true });
    await page.screenshot({
      path: `test-results/homepage-screenshots/home-${width}.png`,
      fullPage: true,
    });
  });
