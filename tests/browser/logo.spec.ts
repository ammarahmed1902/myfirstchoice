import { test, expect } from "@playwright/test";
const pages = ["/", "/shop", "/about", "/contact", "/terms", "/privacy"];
for (const width of [360, 390, 768, 820, 1024, 1366, 1440]) {
  test(`supplied logo is consistent, proportional and aligned on all pages at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      const logos = page.locator("[data-site-logo]");
      await expect(logos).toHaveCount(2);
      const source = await page.request.get("/assets/my-first-choice-logo.svg");
      expect(source.status()).toBe(200);
      const compact = page.locator('header [data-logo-variant="compact"]');
      await expect(compact).toHaveAttribute("viewBox", "115 40 1940 460");
      await expect(compact).toHaveAttribute(
        "aria-label",
        "EBAY 1ST CHOICE LTD",
      );
      await expect(compact.locator("image")).toHaveAttribute(
        "href",
        "/assets/my-first-choice-logo.svg",
      );
      const full = page.locator('footer [data-logo-variant="full"]');
      await full.scrollIntoViewIfNeeded();
      await expect(full).toHaveAttribute(
        "src",
        "/assets/my-first-choice-logo.svg",
      );
      await expect
        .poll(() =>
          full.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth === 2149,
          ),
        )
        .toBe(true);
      for (const [art, ratio] of [
        [compact, 1940 / 460],
        [full, 2149 / 732],
      ] as const) {
        const rect = await art.boundingBox();
        expect(rect).not.toBeNull();
        expect(Math.abs(rect!.width / rect!.height - ratio)).toBeLessThan(0.02);
        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
        expect(await art.evaluate((el) => getComputedStyle(el).filter)).toBe(
          "none",
        );
      }
      for (const link of await logos.all())
        await expect(link).toHaveAttribute("href", "/");
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
