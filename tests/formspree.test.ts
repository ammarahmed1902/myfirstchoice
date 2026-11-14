import { test } from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../lib/contact-schema";
import {
  FORMSPREE_ENDPOINT,
  ENQUIRY_SUBJECT,
  formspreePayload,
  formspreeErrors,
} from "../lib/formspree";
const details = {
  name: "QA Buyer",
  email: "buyer@example.com",
  company: "Buyer Ltd",
  phone: "+44 1234",
  type: "Wholesale Products" as const,
  product: "lightning-cable",
  quantity: "20",
  message: "Please discuss the cable requirements.",
  website: "",
};
test("Formspree payload fixes endpoint, subject and website identity; preserves every enquiry field", () => {
  assert.equal(FORMSPREE_ENDPOINT, "https://formspree.io/f/myewknly");
  const p = formspreePayload(contactSchema.parse(details));
  assert.equal(p.subject, ENQUIRY_SUBJECT);
  assert.equal(p._subject, "My First Choice — New Website Enquiry");
  assert.equal(p.website_name, "My First Choice");
  assert.equal(p.message, `Website: My First Choice\n\n${details.message}`);
  for (const field of ["name", "email", "company", "phone"] as const)
    assert.equal(p[field], details[field]);
  assert.equal(p.enquiry_type, details.type);
  assert.equal(p.product_of_interest, "USB-C to Lightning Cable");
  assert.equal(p.product_reference, details.product);
  assert.equal(p.quantity_required, "20");
  assert.equal(p._replyto, details.email);
  assert.equal(p._gotcha, "");
  assert.equal("to" in p, false);
  assert.equal("recipient" in p, false);
});
test("service enquiry does not include stale product fields", () => {
  const p = formspreePayload(
    contactSchema.parse({
      ...details,
      type: "3PL Services",
      product: "",
      quantity: "",
    }),
  );
  assert.equal(p.enquiry_type, "3PL Services");
  assert.equal("product_reference" in p, false);
  assert.equal("quantity_required" in p, false);
});
test("required fields, invalid email and header injection are rejected", () => {
  for (const change of [
    { name: "" },
    { email: "invalid" },
    { email: "buyer@example.com\r\nBcc:other@example.com" },
    { message: "" },
    { type: "unknown" },
    { quantity: "-1" },
  ])
    assert.equal(
      contactSchema.safeParse({ ...details, ...change }).success,
      false,
    );
});
test("provider validation errors map back to visible form fields", () => {
  const failure = formspreeErrors(
    {
      errors: [
        { field: "email", message: "Enter a valid address." },
        { field: "quantity_required", message: "Invalid quantity." },
      ],
    },
    422,
  );
  assert.deepEqual(failure.fields, {
    email: ["Please check your email address."],
    quantity: ["Please enter a valid whole quantity."],
  });
  assert.match(failure.message, /information has been kept/);
});
test("rate limits and unexpected provider failures give useful preserved-input messages", () => {
  assert.match(formspreeErrors({}, 429).message, /wait/);
  assert.match(formspreeErrors({}, 503).message, /try again/);
  assert.deepEqual(
    formspreeErrors({ errors: [{ message: "Form is not verified." }] }, 403)
      .fields,
    {},
  );
});

test("provider error text and private destination addresses are never passed through", () => {
  const result = formspreeErrors(
    {
      error: "Private destination private-inbox@example.com",
      errors: [
        { field: "email", message: "Settings for private-inbox@example.com" },
      ],
    },
    422,
  );
  assert.doesNotMatch(
    JSON.stringify(result),
    /private-inbox|Settings|Private destination/,
  );
  assert.deepEqual(result.fields.email, ["Please check your email address."]);
});
