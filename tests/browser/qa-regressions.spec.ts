import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { FORMSPREE_ENDPOINT } from "../../lib/formspree";
test("privacy naming is consistent; product IDs and missing-product claims are not visible", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/shop",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
  ]) {
    await page.goto(path);
    await expect(page.locator('footer a[href="/privacy"]')).toHaveText(
      "Privacy Information",
    );
    await expect(page.locator("main")).not.toContainText("Ref:");
    if (path === "/" || path === "/shop") {
      await expect(page.locator("main")).not.toContainText("USB-C to USB-C");
      await expect(page.locator("main")).not.toContainText(
        "Product photograph pending",
      );
    }
  }
  await expect(page.locator("h1")).toHaveText("Privacy Information");
  await expect(page.locator("main")).not.toContainText("Redis");
  await expect(page.locator("main")).not.toContainText("provider acceptance");
  await page.goto("/contact");
  await expect(page.locator('.privacy-note a[href="/privacy"]')).toHaveText(
    "Privacy Information",
  );
});
test("required field whitespace, message limits and keyboard errors never send invalid data", async ({
  page,
}) => {
  let sends = 0;
  await page.route(FORMSPREE_ENDPOINT, async (route) => {
    sends++;
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact");
  await page.getByLabel("Full name").fill("   ");
  await page.getByLabel("Email address").fill("   ");
  await page.getByLabel("Message", { exact: false }).fill("   ");
  await page
    .getByRole("button", { name: "Send Enquiry", exact: true })
    .press("Enter");
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(page.locator("#enquiry-form").getByRole("alert")).toContainText("highlighted fields");
  await expect(page.getByLabel("Full name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByLabel("Full name").fill("QA Boundary Test");
  await page.getByLabel("Email address").fill("qa@example.com");
  const message = page.getByLabel("Message", { exact: false });
  await expect(message).toHaveAttribute("maxlength", "4000");
  await message.fill("x".repeat(9));
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(message).toBeFocused();
  expect(sends).toBe(0);
  await message.evaluate(
    (el: HTMLTextAreaElement) => (el.value = "x".repeat(4001)),
  );
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(
    page.getByText("Use no more than 4,000 characters.", { exact: true }),
  ).toBeVisible();
  expect(sends).toBe(0);
  await message.fill("x".repeat(4000));
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Thank you! Your enquiry has been submitted.",
  );
  expect(sends).toBe(1);
  await page.getByRole("button", { name: "Write another enquiry" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("");
  await expect(page.getByLabel("Email address")).toHaveValue("");
  await expect(message).toHaveValue("");
  await expect(page.getByLabel("Enquiry type")).toHaveValue("General Enquiry");
  await expect(
    page.getByRole("button", { name: "Send Enquiry", exact: true }),
  ).toBeEnabled();
});
test("switching product/service fields does not send hidden stale product data", async ({
  page,
}) => {
  const payloads: Record<string, string>[] = [];
  await page.route(FORMSPREE_ENDPOINT, async (route) => {
    payloads.push(route.request().postDataJSON());
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact?product=lightning-cable");
  await expect(page.getByLabel("Product of interest")).toHaveValue(
    "lightning-cable",
  );
  await page.getByLabel("Quantity required").fill("24");
  await page.getByLabel("Enquiry type").selectOption("3PL Services");
  await expect(page.getByLabel("Product of interest")).toHaveCount(0);
  await expect(page.getByLabel("Quantity required")).toHaveCount(0);
  await page.getByLabel("Full name").fill("QA Service Switch");
  await page.getByLabel("Email address").fill("qa@example.com");
  await page
    .getByLabel("Message", { exact: false })
    .fill("Please discuss our operational requirements.");
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("submitted");
  expect(payloads[0].enquiry_type).toBe("3PL Services");
  expect(payloads[0]).not.toHaveProperty("product_reference");
  expect(payloads[0]).not.toHaveProperty("quantity_required");
  await page.getByRole("button", { name: "Write another enquiry" }).click();
  await expect(page.getByLabel("Enquiry type")).toHaveValue(
    "Wholesale Products",
  );
  await expect(page.getByLabel("Product of interest")).toHaveValue(
    "lightning-cable",
  );
  await expect(page.getByLabel("Quantity required")).toHaveValue("");
});
test("navigation supports browser back/forward and direct refresh", async ({
  page,
}) => {
  await page.goto("/shop");
  await page
    .getByRole("navigation", { name: "Product categories" })
    .getByRole("link", { name: "Charging Cables", exact: true })
    .click();
  await expect(page).toHaveURL(/category=charging-cables/);
  await expect(page.locator(".showcase-card")).toHaveCount(2);
  await page.reload();
  await expect(page.locator(".showcase-card")).toHaveCount(2);
  await page.goBack();
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.locator(".showcase-card")).toHaveCount(4);
  await page.goForward();
  await expect(page).toHaveURL(/category=charging-cables/);
  await expect(page.locator(".showcase-card")).toHaveCount(2);
});
for (const width of [390, 820, 1440])
  test(`hero scene crops and stationary overlay remain consistent at ${width}px`, async ({
    page,
  }) => {
    await mkdir("test-results/showcase-screenshots", { recursive: true });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.emulateMedia({ reducedMotion: "reduce" });
    const heading = page.getByRole("heading", { level: 1 });
    const initial = await heading.boundingBox();
    for (const label of [
      "Charging Cables",
      "Car Accessories",
      "RFID Wallets",
    ]) {
      await page.getByRole("button", { name: `Show ${label} slide` }).click();
      expect(await heading.boundingBox()).toEqual(initial);
      await page.screenshot({
        path: `test-results/showcase-screenshots/hero-${label.toLowerCase().replaceAll(" ", "-")}-${width}.png`,
      });
    }
  });
