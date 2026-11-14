# QA follow-up — 14 November 2026

Changes are in the local working tree. No push, deployment or live enquiry submission was performed. This is not full QA approval: the approved USB-C-to-USB-C photograph, policy decisions and production network checks remain outstanding.

## Issue status

| Issue | Status | Result |
|---|---|---|
| Dedicated USB-C-to-USB-C product | Blocked | Approved photograph unavailable. Existing internal `usb-c-cable` record remains unpublished, including its selector option. The Amazon reference B0DCBPXF8Y is not a supplied approved image. Need the actual photograph showing USB-C connectors at both ends and verified variations. |
| Hero/product consistency | Fixed | Cable caption and intro match the four published products; no claim or photograph substitution for the missing cable. Shared homepage/catalogue data preserved. |
| Public receiving address | Fixed locally | Zero exact matches in app, components, lib, public, compiled static assets and rendered app output. Existing endpoint unchanged; no recipient field added. Production deployment not inspected. |
| Order-issue/privacy contact journey | Fixed | Contextual Contact Us links and editable prompts; privacy requests need no product. Contact page points directly to its form. |
| 15-day rule | Pending | Owner's 1 November → 15 November example recorded internally. Required action, non-delivery handling and returns decisions remain unclear. Accurate reporting guidance stays live. |
| Privacy language/naming | Fixed | Plain English; consistent Privacy Information, providers and rights retained, irrelevant Redis/implementation wording removed. |
| Retention verification | Pending | Business-stated six months retained without an automatic-deletion guarantee. Start event is confirmed as last correspondence; provider/mailbox deletion evidence remains unresolved. |
| Internal card references | Fixed | Visible Ref values removed; IDs, filtering and product enquiry prefilling retained. |
| Header logo | Fixed | Compact presentation of the unchanged original SVG shows symbol and full company name; full logo retained in footer. No colour/proportion changes. |
| Responsive/accessibility/form regression | Fixed for tested scope | Local Chromium emulation and mocked submission results below. No physical-device or cross-browser certification. |
| Production HTTP→HTTPS and live page verification | Blocked | Outbound proxy returned 403/CONNECT denial for domain; this is not a website redirect failure. |

## Test conditions and actual results

Linux headless Chromium 156, Playwright, local Next.js production build at localhost:3000. Tested Home, Our Products, About Us, Contact Us, Wholesale Terms and Privacy Information at 360, 390, 768, 820, 1024, 1366 and 1440px. Screenshots and automated checks cover all 42 page/width combinations. Reduced heights 820×390 and 1440×620 were also checked. Touch/mobile emulation at 360×430 and 390×430 checked focused fields and scrolling; this simulates available keyboard space, not a real operating-system keyboard.

- Production build, typecheck and all 22 unit tests passed. No lint command exists in this project.
- Browser suite initially passed 81/83. Two test selectors conflicted with the SVG title/Next route-announcer, and were scoped correctly; both affected tests passed on targeted rerun. All 83 checks are therefore verified across the main run plus rerun, not represented as one clean 83-test execution. Logs are in `docs/qa/followup-*-results.txt` and `followup-browser-recheck.txt`.
- Checked mobile menu/category expansion, keyboard focus/Escape, overflow, headings, image loading, logo sizing, footer/policy wrapping, sticky-header clearance, filters, back/forward, refresh/direct routes, legacy navigation, metadata, excluded products, console/application errors and reduced motion through existing and extended tests.
- Visually inspected current mobile homepage/catalogue, header at 390/820/1440, responsive privacy/contact/terms sheets and mobile car hero. Automated hero checks cover all three scenes at 390/820/1440, including image crops and stationary overlay. Screenshots permit review of the full page/width matrix.
- Local mobile Lighthouse: performance 93, accessibility 100, best practices 100, SEO 69; FCP 0.9s, LCP 3.2s, TBT 80ms, CLS 0. One simulated local production run, not production field Core Web Vitals or INP. Launch indexing remains disabled by existing configuration, contributing to SEO result. Exact conditions: `docs/qa/followup-lighthouse-summary.json`.
- Original logo file hash and missing-photo inventory: `docs/QA_ASSET_AND_LOGO_NOTES.md`.

## Form regression and delivery status

Formspree remains `https://formspree.io/f/myewknly`. Customer email/Reply-To, website name, subject and clear field names preserved. The recipient remains exclusively in private provider settings.

Local intercepted tests passed: empty/whitespace required values, invalid email, first-invalid focus and accessible alerts, 9/10/4000/4001-character message boundaries, product prefilling, General default, product/service switching and exclusion of stale hidden product values, duplicate-click locking, loading/disabled controls, network failure, timeout, provider rejection, malformed response, preserved entries on error, accepted success and reset. Success requires Formspree's accepted response and does not independently prove inbox delivery.

The owner reports that real enquiries are currently received and previously confirmed the recipient setting. No authenticated dashboard inspection or new live email delivery test occurred in this task. No repeated live tests were sent.

## Remaining decisions

1. Does the 1–15 November deadline require reporting, dispatching a return, or arrival of a return? How does it apply when delivery arrives near/after the deadline?
2. What starts the non-delivery reporting period, including orders still in transit?
3. The return address will be supplied in response to the customer’s message (now reflected on the page). Postage responsibility and the inspection/replacement/refund procedure remain to be confirmed.
4. Six-month retention begins from last correspondence, explicitly confirmed by the owner and now reflected on the page. Who deletes copies in Formspree and the mailbox, how are exceptions handled, and what account settings support this?
5. Confirm actual supplier transfer safeguards/additional recipients for final privacy review. Current ICO guidance could not be retrieved through this environment's proxy; no legal approval/compliance claim is made.

Internal proposed wording: `docs/review/QA_POLICY_DRAFT.md`. No unsupported deadline, return fees, refund conditions or registered-office return instruction was published.

Production HTTP/HTTPS checks must be repeated once outbound access permits them. A network allowlist draft includes the business domains and ICO while retaining Formspree; it was saved but not published/applied. Canonical default now uses the supplied custom domain; confirm production NEXT_PUBLIC_SITE_URL agrees when deploying.

## Screenshots

Current captures, separate from older historical reports:

| Page | Mobile 390px | Desktop 1440px | All seven widths |
|---|---|---|---|
| Home | [Mobile](qa/followup-home-390.png) | [Desktop](qa/followup-home-1440.png) | [Comparison](qa/followup-review-home.png) |
| Our Products | [Mobile](qa/followup-shop-390.png) | [Desktop](qa/followup-shop-1440.png) | [Comparison](qa/followup-review-shop.png) |
| About Us | [Mobile](qa/followup-about-390.png) | [Desktop](qa/followup-about-1440.png) | [Comparison](qa/followup-review-about.png) |
| Contact Us | [Mobile](qa/followup-contact-390.png) | [Desktop](qa/followup-contact-1440.png) | [Comparison](qa/followup-review-contact.png) |
| Wholesale Terms | [Mobile](qa/followup-terms-390.png) | [Desktop](qa/followup-terms-1440.png) | [Comparison](qa/followup-review-terms.png) |
| Privacy Information | [Mobile](qa/followup-privacy-390.png) | [Desktop](qa/followup-privacy-1440.png) | [Comparison](qa/followup-review-privacy.png) |
