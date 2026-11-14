import { test, expect } from "@playwright/test";
import { FORMSPREE_ENDPOINT, ENQUIRY_SUBJECT } from "../../lib/formspree";
const receivingAddress = ["ebayecommerce1947", "gmail.com"].join("@");
const routes = [
  "/",
  "/shop",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/not-a-real-page",
];
test("every public page omits the recipient from HTML, links, fields and metadata", async ({
  page,
  request,
}) => {
  for (const path of routes) {
    const response = await request.get(path);
    const html = (await response.text()).toLowerCase();
    expect(html).not.toContain(receivingAddress);
    expect(html).not.toContain(
      encodeURIComponent(receivingAddress).toLowerCase(),
    );
    await page.goto(path);
    expect((await page.content()).toLowerCase()).not.toContain(
      receivingAddress,
    );
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    const contact = page
      .locator("footer")
      .getByRole("link", { name: "Contact Us", exact: true })
      .last();
    await expect(contact).toHaveAttribute("href", "/contact#enquiry-form");
  }
});
for (const [path, reason, prefix] of [
  ["/privacy", "privacy", "Privacy request:"],
  ["/terms", "order-issue", "Order issue:"],
] as const) {
  test(`${path} retains a clear form channel for ${reason}`, async ({
    page,
  }) => {
    let count = 0;
    await page.route(FORMSPREE_ENDPOINT, async (route) => {
      const body = route.request().postDataJSON();
      count++;
      expect(body._subject).toBe(ENQUIRY_SUBJECT);
      expect(body.email).toBe("requester@example.com");
      expect(body._replyto).toBe("requester@example.com");
      expect(body.enquiry_type).toBe("General Enquiry");
      expect(body.message).toContain(prefix);
      expect(body.message).toContain("Please help with this request.");
      expect(JSON.stringify(body)).not.toContain(receivingAddress);
      expect(body).not.toHaveProperty("to");
      expect(body).not.toHaveProperty("recipient");
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await page.goto(path);
    await page
      .locator(`main a[href="/contact?reason=${reason}#enquiry-form"]`)
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`reason=${reason}#enquiry-form$`));
    await expect(page.getByLabel("Enquiry type")).toHaveValue(
      "General Enquiry",
    );
    const message = page.getByLabel("Message", { exact: false });
    await expect(message).toHaveValue(new RegExp(prefix));
    await page.getByLabel("Full name").fill("QA Requester");
    await page.getByLabel("Email address").fill("requester@example.com");
    await message.fill(
      `${await message.inputValue()}\nPlease help with this request.`,
    );
    await page
      .getByRole("button", { name: "Send Enquiry", exact: true })
      .click();
    await expect(page.getByRole("status")).toHaveText(
      "Thank you! Your enquiry has been submitted.",
    );
    expect(count).toBe(1);
  });
}
test("provider errors cannot reveal private recipient details and preserve entered text", async ({
  page,
}) => {
  await page.route(FORMSPREE_ENDPOINT, (route) =>
    route.fulfill({
      status: 422,
      json: {
        error: `Recipient ${receivingAddress} is not configured`,
        errors: [
          {
            field: "email",
            message: `Private destination: ${receivingAddress}`,
          },
        ],
      },
    }),
  );
  await page.goto("/contact?reason=privacy#enquiry-form");
  await page.getByLabel("Full name").fill("QA Requester");
  await page.getByLabel("Email address").fill("requester@example.com");
  await page
    .getByLabel("Message", { exact: false })
    .fill("Privacy request: please review my information.");
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(
    page.getByText("Please check your email address.", { exact: true }),
  ).toBeVisible();
  expect(await page.locator("body").innerText()).not.toContain(
    receivingAddress,
  );
  await expect(page.getByLabel("Message", { exact: false })).toHaveValue(
    "Privacy request: please review my information.",
  );
  await expect(page.locator(".submission-notice a")).toHaveAttribute(
    "href",
    "#enquiry-form",
  );
});
