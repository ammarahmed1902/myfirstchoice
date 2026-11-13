import { test, expect, type Page } from "@playwright/test";
import { approvedProducts } from "../../lib/homepage-content";

async function renderedProducts(page: Page) {
  return page.locator(".showcase-card").evaluateAll((cards) =>
    cards.map((card) => {
      const image = card.querySelector("img")!;
      const url = new URL(image.src);
      return {
        name: card.querySelector("h2,h3")!.textContent,
        description: card.querySelector("p")!.textContent,
        image: url.searchParams.get("url") || url.pathname,
        alt: image.alt,
        enquiry: card.querySelector("a")!.getAttribute("href"),
      };
    }),
  );
}

for (const width of [390, 820, 1440]) {
  test(`catalogue exactly matches homepage product content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const expected = approvedProducts.map((product) => ({
      name: product.name,
      description: product.detail,
      image: product.image,
      alt: product.alt,
      enquiry: `/contact?product=${product.id}`,
    }));
    for (const path of ["/", "/shop"]) {
      await page.goto(path);
      await expect(page.locator(".showcase-card")).toHaveCount(expected.length);
      expect(await renderedProducts(page)).toEqual(expected);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const card of await page.locator(".showcase-card").all()) {
        await card.scrollIntoViewIfNeeded();
        await expect(card.locator("img")).toBeVisible();
        await expect.poll(() => card.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
        await expect(card.locator("a")).toBeVisible();
      }
    }
  });
}
