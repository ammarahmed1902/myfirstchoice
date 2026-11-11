import { z } from "zod";
import { productById } from "./catalogue";
export const lineSchema = z
  .object({
    productId: z.string().max(30),
    quantity: z.number().int().min(1).max(10000),
    sample: z.boolean().default(false),
  })
  .superRefine((line, ctx) => {
    const p = productById(line.productId);
    if (!p) {
      ctx.addIssue({ code: "custom", message: "Unknown product reference" });
      return;
    }
    if (line.sample && !p.sample)
      ctx.addIssue({
        code: "custom",
        message: "Sample enquiry not available for this range",
      });
    if (!line.sample && p.moq && line.quantity < p.moq)
      ctx.addIssue({ code: "custom", message: `Minimum quantity is ${p.moq}` });
  });
export const linesSchema = z
  .array(lineSchema)
  .min(1)
  .max(100)
  .superRefine((lines, ctx) => {
    const keys = new Set<string>();
    for (const l of lines) {
      const key = `${l.productId}:${l.sample}`;
      if (keys.has(key))
        ctx.addIssue({
          code: "custom",
          message: "Combine duplicate product lines before submitting",
        });
      keys.add(key);
    }
  });
export const orderSchema = z.object({
  lines: linesSchema,
  company: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(3).max(500),
  notes: z.string().trim().max(4000).default(""),
});
export const applicationSchema = z.object({
  company: z.string().trim().min(2).max(160),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(50),
  website: z.string().trim().max(200),
  businessType: z.enum(["Retailer", "Reseller", "Distributor", "Other"]),
  requirements: z.string().trim().min(10).max(3000),
});
export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(4000),
});
export const authSchema = z.object({
  email: z.email().max(200),
  password: z.string().min(12).max(128),
  mode: z.enum(["signin", "signup"]),
});
export function mergeLines(lines: z.infer<typeof lineSchema>[]) {
  const map = new Map<string, z.infer<typeof lineSchema>>();
  for (const line of lines) {
    lineSchema.parse(line);
    const key = `${line.productId}:${line.sample}`;
    const existing = map.get(key);
    const merged = {
      ...line,
      quantity: line.quantity + (existing?.quantity || 0),
    };
    lineSchema.parse(merged);
    map.set(key, merged);
  }
  return linesSchema.parse([...map.values()]);
}
