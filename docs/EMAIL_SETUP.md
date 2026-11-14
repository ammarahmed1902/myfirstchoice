# Contact Us — Formspree integration

Updated 14 November 2026. Next.js/React, direct AJAX submission. Existing form fields, classes, layout and product-prefill behaviour are preserved.

- Public endpoint: https://formspree.io/f/myewknly
- Form ID: `myewknly`
- Intended receiving email: `ebayecommerce1947@gmail.com`
- Fixed subject: `My First Choice — New Website Enquiry`

## Payload and Reply-To

The React form validates the existing fields with the shared Zod schema, then sends JSON with `Accept: application/json` directly to Formspree. All submitted customer details have explicit fields: `name`, `email`, `company`, `phone`, `enquiry_type`, `product_of_interest`, `product_reference`, `quantity_required`, `message`. Product fields are included only for Wholesale Products. The product name is resolved from the shared approved product data; the reference is also retained.

`website_name` is `My First Choice`, and the message begins `Website: My First Choice`, followed by the customer's text. Both `subject` and the special `_subject` field contain the exact fixed subject for compatibility with Formspree notification settings. The supported customer `email` field and legacy special `_replyto` field both carry the validated customer email. Never set From to the customer's address; Formspree controls its sending identity. The legacy special fields are documented in Formspree's official repository: https://github.com/formspree/formspree#advanced-features.

The intended recipient is NOT submitted by the browser and cannot be verified from the public form ID. Formspree's dashboard notification action is authoritative.

## Recipient confirmation and remaining delivery checks

The account owner confirmed in chat on 14 November 2026 that the notification recipient is **ebayecommerce1947@gmail.com** and is verified/enabled. This is user-confirmed dashboard configuration, not an independent dashboard inspection by the assistant.

Authenticated Formspree dashboard access was not available to the assistant, and this cloud's network proxy blocked `formspree.io` and `help.formspree.io` with 403. No actual provider submission or inbox receipt was observed. Automated tests intercept requests; they are not live email evidence.

The recipient portion of steps 1–2 is confirmed by the account owner. For delivery handoff, review any custom notification template overrides and complete the remaining checks:

1. Sign in to Formspree, open the project containing form **myewknly**, and open that form's email notification action/settings (Workflow/email notification configuration).
2. Confirm notifications are enabled and that the actual recipient is exactly **ebayecommerce1947@gmail.com**. If different, set/add the address there. Complete any Formspree verification email sent to that Gmail inbox and confirm the address is shown as verified/enabled.
3. If a notification template or dashboard subject overrides submitted fields, set its subject to **My First Choice — New Website Enquiry**.
4. Confirm the notification's Reply-To uses the submission's **email** field (the integration also sends `_replyto`). If a custom email template/action is configured, bind its Reply-To to that submitted field, not the receiving Gmail address or a hardcoded sender.
5. Check any allowed-domain restrictions include the actual deployed website origin. Review spam/CAPTCHA settings and the form's current submission allowance.
6. Submit one clearly labelled controlled enquiry through the deployed Contact Us page. Confirm it appears under this form's submissions, then separately confirm the Gmail notification is received, the subject is exact, all customer fields are present and Reply opens a response to the entered customer email. Record provider acceptance and inbox receipt separately.

Do not supply a Gmail password, Formspree dashboard password or private key in code/chat. This public-ID integration requires no Resend, Upstash or SMTP environment variables.

## Success, failure and duplicate handling

A synchronous in-flight lock and disabled fieldset/button prevent repeated sends while a request is pending. Loading text is “Sending…”. Success requires an HTTP success response with Formspree `ok: true` and no errors. Inputs are disabled after acceptance until “Write another enquiry” resets the form. The text explicitly distinguishes Formspree acceptance from inbox receipt.

HTTP errors, field errors, throttling, network errors, timeouts and invalid responses show useful failure text and preserve the entered values. No automatic retry occurs after an uncertain timeout. Formspree does not supply an idempotency guarantee here; a manual retry after an uncertain accepted request can produce another submission. The UI prevents accidental concurrent clicks, not all possible duplicate messages across devices.

The existing honeypot is checked before sending and maps to Formspree `_gotcha`. Formspree handles provider-side spam controls; configure its dashboard validation/CAPTCHA as appropriate. No own Redis limiter or email-delivery backend is involved. The old `/api/enquiries` POST returns 410 to prevent use of the retired Resend path.

## Local validation and deployment

Build/type checks, payload/validation tests and intercepted browser acceptance/error tests can run without credentials. Browser tests check all customer fields and Reply-To, subject and website branding, loading/lock, validation, HTTP/network/malformed-response failures, and preserved values. Responsive capture uses the existing contact layout at 390, 820 and 1440 pixels.

Allow `formspree.io` and `help.formspree.io` in this cloud environment's outbound settings for real endpoint/documentation access. Domain additions were saved as a draft only; review/save those settings and publish the cloud environment if desired. This is separate from deploying website code to Vercel. No live send, inbox verification, Git push or website deployment is claimed by the local tests.

## Privacy

The public website privacy information now names Formspree instead of Resend/Upstash. Formspree processes the customer information and request metadata, and may retain submissions under its account settings/policies. Confirm the account's actual retention and international transfer safeguards during the outstanding policy review. The business's six-month correspondence policy requires handling copies in both the provider account and Gmail; this code does not automatically delete those copies.
