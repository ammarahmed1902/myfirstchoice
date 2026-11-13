import { test, expect } from "@playwright/test";
async function ready(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.waitForFunction(
    () => document.documentElement.dataset.showcaseReady === "true",
  );
}
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

test("hero keeps the full-width slideshow and stationary copy on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const hero = page.getByRole("region", {
    name: "Everyday accessories. Ready for your business.",
  });
  const box = await hero.boundingBox();
  expect(box?.x).toBe(0);
  expect(box?.width).toBe(390);
  const heading = page.getByRole("heading", { level: 1 });
  const start = await heading.boundingBox();
  await page.getByRole("button", { name: "Next product slide" }).click();
  expect(await heading.boundingBox()).toEqual(start);
  await expect(
    page.locator('picture source[srcset^="/images/hero/"]'),
  ).toHaveCount(5);
});
