import { test, expect } from "@playwright/test";
const pages = ["/", "/shop", "/about", "/contact", "/terms", "/privacy"];
for (const width of [360, 390, 768, 820, 1024, 1280, 1440]) {
  test(`supplied logo is consistent, proportional and aligned on all pages at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      const logos = page.locator("[data-site-logo]");
      await expect(logos).toHaveCount(2);
      for (const link of await logos.all()) {
        await expect(link).toHaveAttribute("href", "/");
        const img = link.locator("img");
        await link.scrollIntoViewIfNeeded();
        await expect(img).toHaveAttribute(
          "src",
          "/assets/my-first-choice-logo.svg",
        );
        await expect(img).toHaveAttribute(
          "alt",
          "EBAY 1ST CHOICE LTD — Electronics & Car Accessories Wholesale",
        );
        await expect
          .poll(() =>
            img.evaluate(
              (el: HTMLImageElement) =>
                el.complete &&
                el.naturalWidth === 2149 &&
                el.naturalHeight === 732,
            ),
          )
          .toBe(true);
        const rect = await img.boundingBox();
        expect(rect).not.toBeNull();
        expect(Math.abs(rect!.width / rect!.height - 2149 / 732)).toBeLessThan(
          0.02,
        );
        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
        expect(await img.evaluate((el) => getComputedStyle(el).filter)).toBe(
          "none",
        );
        expect((await link.innerText()).trim()).toBe("Home");
      }
      const header = page.locator("header").first();
      const headerRect = await header.boundingBox();
      expect(headerRect!.height).toBeLessThanOrEqual(
        width <= 600 ? 72 : width <= 960 ? 77 : 88,
      );
      expect(
        await page
          .locator("footer [data-site-logo]")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe("rgb(247, 246, 242)");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}
