import { approvedProducts } from "./homepage-content";
import type { ContactDetails } from "./contact-schema";

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/myewknly";
export const ENQUIRY_SUBJECT = "My First Choice — New Website Enquiry";

export function formspreePayload(details: ContactDetails) {
  const product = approvedProducts.find((item) => item.id === details.product);
  return {
    name: details.name,
    email: details.email,
    _replyto: details.email,
    company: details.company,
    phone: details.phone,
    enquiry_type: details.type,
    ...(details.type === "Wholesale Products"
      ? {
          product_of_interest: product?.name || "",
          product_reference: details.product,
          quantity_required: details.quantity,
        }
      : {}),
    website_name: "My First Choice",
    subject: ENQUIRY_SUBJECT,
    _subject: ENQUIRY_SUBJECT,
    message: `Website: My First Choice\n\n${details.message}`,
    _gotcha: details.website,
  };
}

export type FormspreeError = { field?: string; message?: string };
const fields: Record<string, string> = {
  name: "name",
  email: "email",
  _replyto: "email",
  company: "company",
  phone: "phone",
  enquiry_type: "type",
  product_of_interest: "product",
  product_reference: "product",
  quantity_required: "quantity",
  message: "message",
};
export function formspreeErrors(
  data: { errors?: FormspreeError[]; error?: string },
  status: number,
) {
  const errors: Record<string, string[]> = {};
  const messages: string[] = [];
  for (const issue of Array.isArray(data.errors) ? data.errors : []) {
    if (typeof issue.message !== "string") continue;
    messages.push(issue.message);
    const field = issue.field && fields[issue.field];
    if (field) (errors[field] ||= []).push(issue.message);
  }
  const explanation =
    messages.join(" ") ||
    (typeof data.error === "string" ? data.error : "") ||
    (status === 429
      ? "Too many requests. Please wait before trying again."
      : "Your enquiry could not be accepted. Please try again or email us directly.");
  return {
    fields: errors,
    message: `${explanation} Your entered information has been kept.`,
  };
}
