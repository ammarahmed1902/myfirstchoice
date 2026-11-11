import { test } from "node:test";
import assert from "node:assert/strict";
import {
  lineSchema,
  orderSchema,
  mergeLines,
  applicationSchema,
} from "../lib/validation";
test("unknown SKUs, fractional and excessive quantities cannot be ordered", () => {
  for (const line of [
    { productId: "FAKE", quantity: 1 },
    { productId: "EL-001", quantity: 1.5 },
    { productId: "EL-001", quantity: 0 },
    { productId: "EL-001", quantity: 10001 },
  ])
    assert.equal(
      lineSchema.safeParse({ ...line, sample: false }).success,
      false,
    );
});
test("a sample cannot be requested for a range without sample enquiries", () =>
  assert.equal(
    lineSchema.safeParse({ productId: "CA-003", quantity: 1, sample: true })
      .success,
    false,
  ));
test("repeated references combine, but samples remain separate", () => {
  assert.deepEqual(
    mergeLines([
      { productId: "EL-001", quantity: 5, sample: false },
      { productId: "EL-001", quantity: 2, sample: false },
      { productId: "EL-001", quantity: 1, sample: true },
    ]),
    [
      { productId: "EL-001", quantity: 7, sample: false },
      { productId: "EL-001", quantity: 1, sample: true },
    ],
  );
});
test("combined quantities cannot bypass the maximum", () =>
  assert.throws(() =>
    mergeLines([
      { productId: "EL-001", quantity: 6000, sample: false },
      { productId: "EL-001", quantity: 6000, sample: false },
    ]),
  ));
test("empty carts and missing delivery details fail validation", () => {
  assert.equal(
    orderSchema.safeParse({
      lines: [],
      company: "Buyer",
      destination: "London",
    }).success,
    false,
  );
  assert.equal(
    orderSchema.safeParse({
      lines: [{ productId: "EL-001", quantity: 10, sample: false }],
      company: "Buyer",
      destination: "",
    }).success,
    false,
  );
});
test("applications need usable business information", () =>
  assert.equal(
    applicationSchema.safeParse({
      name: "Buyer",
      company: "Retail Ltd",
      phone: "",
      website: "",
      businessType: "Retailer",
      requirements: "Audio accessories for our shop.",
    }).success,
    true,
  ));
