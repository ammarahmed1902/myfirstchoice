import { z } from "zod";
import { approvedProducts } from "./homepage-content";
export const enquiryTypes = [
  "Wholesale Products",
  "3PL Services",
  "Product Sourcing",
  "E-commerce Management",
  "General Enquiry",
] as const;
const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => !/[\r\n\x00]/.test(v), "Use a single line of text.");
export const contactSchema = z
  .object({
    name: singleLine(120).refine((v) => v.length >= 2, "Enter your full name."),
    email: singleLine(200).pipe(z.email("Enter a valid email address.")),
    company: singleLine(160).default(""),
    phone: singleLine(50).default(""),
    type: z.enum(enquiryTypes, { error: "Choose an enquiry type." }),
    product: singleLine(80).default(""),
    quantity: singleLine(12)
      .refine(
        (v) => !v || /^[1-9]\d{0,8}$/.test(v),
        "Enter a whole quantity greater than zero.",
      )
      .default(""),
    message: z
      .string()
      .trim()
      .min(10, "Tell us a little more (at least 10 characters).")
      .max(4000, "Use no more than 4,000 characters.")
      .refine((v) => !v.includes("\x00"), "Remove invalid characters."),
    website: z.string().max(200).default(""),
  })
  .superRefine((v, ctx) => {
    if (
      v.type === "Wholesale Products" &&
      v.product &&
      !approvedProducts.some((p) => p.id === v.product)
    )
      ctx.addIssue({
        code: "custom",
        path: ["product"],
        message: "Choose a product from our range.",
      });
    if (v.type !== "Wholesale Products" && (v.product || v.quantity))
      ctx.addIssue({
        code: "custom",
        path: ["product"],
        message: "Product details apply to wholesale product enquiries only.",
      });
  });
export type ContactDetails = z.infer<typeof contactSchema>;
