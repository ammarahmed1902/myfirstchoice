import { test, expect } from "@playwright/test";
import { FORMSPREE_ENDPOINT, ENQUIRY_SUBJECT } from "../../lib/formspree";
async function fill(page: import("@playwright/test").Page) {
  await page.goto("/contact?product=lightning-cable");
  await page.getByLabel("Full name").fill("Clearly labelled QA Test");
  await page.getByLabel("Email address").fill("qa@example.com");
  await page.getByLabel("Company name").fill("QA Company");
  await page.getByLabel("Phone number").fill("+44 1234");
  await page.getByLabel("Quantity required").fill("20");
  await page
    .getByLabel("Message", { exact: false })
    .fill("Automated My First Choice test — intercepted, no real email.");
}
test("direct Formspree request includes branding, all details and customer Reply-To; locks while sending", async ({
  page,
}) => {
  let requests = 0;
  let release!: () => void;
  const pending = new Promise<void>((r) => (release = r));
  await page.route(FORMSPREE_ENDPOINT, async (route) => {
    requests++;
    const data = route.request().postDataJSON();
    expect(data).toMatchObject({
      name: "Clearly labelled QA Test",
      email: "qa@example.com",
      _replyto: "qa@example.com",
      company: "QA Company",
      phone: "+44 1234",
      enquiry_type: "Wholesale Products",
      product_of_interest: "USB-C to Lightning Cable",
      product_reference: "lightning-cable",
      quantity_required: "20",
      website_name: "My First Choice",
      _subject: ENQUIRY_SUBJECT,
      subject: ENQUIRY_SUBJECT,
    });
    expect(data.message).toContain("Website: My First Choice");
    expect(route.request().headers().accept).toBe("application/json");
    await pending;
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await fill(page);
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await expect(page.getByRole("status")).toBeEmpty();
  expect(requests).toBe(1);
  release();
  await expect(page.getByRole("status")).toHaveText(
    "Thank you! Your enquiry has been submitted.",
  );
  await expect(
    page.getByRole("button", { name: "Enquiry accepted" }),
  ).toBeDisabled();
});
for (const outcome of ["rejected", "network", "malformed", "not-accepted"])
  test(`Formspree ${outcome}: no false success, entered details preserved`, async ({
    page,
  }) => {
    await page.route(FORMSPREE_ENDPOINT, (route) =>
      outcome === "network"
        ? route.abort("failed")
        : route.fulfill(
            outcome === "malformed"
              ? { status: 502, body: "not JSON" }
              : outcome === "not-accepted"
                ? { status: 200, json: { ok: false } }
                : {
                    status: 422,
                    json: {
                      errors: [
                        {
                          field: "email",
                          message: "Email needs verification.",
                        },
                      ],
                    },
                  },
          ),
    );
    await fill(page);
    await page
      .getByRole("button", { name: "Send Enquiry", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Send Enquiry", exact: true }),
    ).toBeEnabled();
    await expect(page.getByLabel("Full name")).toHaveValue(
      "Clearly labelled QA Test",
    );
    await expect(page.getByLabel("Email address")).toHaveValue(
      "qa@example.com",
    );
    await expect(page.getByLabel("Message", { exact: false })).toHaveValue(
      "Automated My First Choice test — intercepted, no real email.",
    );
    await expect(
      page.getByRole("button", { name: "Enquiry accepted" }),
    ).toHaveCount(0);
    await expect(page.locator(".submission-notice")).not.toBeEmpty();
  });
test("invalid email, empty required fields and honeypot never submit", async ({
  page,
}) => {
  let requests = 0;
  await page.route(FORMSPREE_ENDPOINT, async (route) => {
    requests++;
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(
    page.getByText("Enter your full name.", { exact: true }),
  ).toBeVisible();
  await fill(page);
  await page.getByLabel("Email address").fill("invalid");
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(
    page.getByText("Enter a valid email address.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Email address").fill("qa@example.com");
  await page
    .locator('[name="website"]')
    .evaluate((el: HTMLInputElement) => (el.value = "bot"));
  await page.getByRole("button", { name: "Send Enquiry", exact: true }).click();
  await expect(page.locator(".submission-notice")).toContainText(
    "could not be accepted",
  );
  expect(requests).toBe(0);
});
