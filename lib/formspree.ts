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
// Do not echo provider error text: it may contain private notification settings.
const publicFieldErrors: Record<string, string> = {
  name: "Please check your full name.",
  email: "Please check your email address.",
  company: "Please check your company name.",
  phone: "Please check your phone number.",
  type: "Please choose an enquiry type.",
  product: "Please choose a product from our range.",
  quantity: "Please enter a valid whole quantity.",
  message: "Please check your message.",
};
export function formspreeErrors(
  data: { errors?: FormspreeError[]; error?: string },
  status: number,
) {
  const errors: Record<string, string[]> = {};
  for (const issue of Array.isArray(data.errors) ? data.errors : []) {
    const field = issue?.field && fields[issue.field];
    if (field) errors[field] = [publicFieldErrors[field]];
  }
  const explanation =
    status === 429
      ? "Too many requests. Please wait before trying again."
      : Object.keys(errors).length
        ? "Please check the highlighted details."
        : "Your enquiry could not be submitted. Please try again.";
  return {
    fields: errors,
    message: `${explanation} Your entered information has been kept.`,
  };
}
