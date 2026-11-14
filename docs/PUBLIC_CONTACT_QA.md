# Public contact privacy update — 14 November 2026

The notification recipient has been removed from the shared application configuration, all public contact/footer/policy links and customer-visible messages. Current documentation no longer repeats the literal recipient. The recipient remains configured in Formspree; no destination setting was changed.

The existing Formspree endpoint `https://formspree.io/f/myewknly`, subject, request payload fields and customer email/Reply-To remain intact. No recipient, `to` or destination hidden field is sent by the browser. Raw provider error messages are no longer echoed; known fields map to safe customer messages, avoiding accidental disclosure of private provider settings.

Email references have been replaced by Contact Us links to the same enquiry form:

- General contact: `/contact#enquiry-form`.
- Privacy requests: `/contact?reason=privacy#enquiry-form`, with General Enquiry selected and a privacy message prompt.
- Damaged or undelivered order issues: `/contact?reason=order-issue#enquiry-form`, with an order/invoice reference and issue message prompt.

All existing form fields and product-prefill behaviour are retained. No CSS, logo, product data or Formspree dashboard configuration was changed. Input values remain on failed submissions. Error notices provide a Contact Us anchor without navigating away or discarding the current message.

## Verification

- Production build and TypeScript passed.
- 21 unit/database tests passed, including safe handling of errors containing private destination details.
- Public source, public assets, browser bundles and generated page output scanned: no literal notification recipient remains.
- All six public pages plus the 404 page checked for recipient absence in rendered HTML, fields, links and metadata. No mailto links remain.
- The browser suite verified all pages at seven responsive widths, accessibility, logo alignment, product content and Formspree request behaviour.
- Full browser run: 75 passed; one pre-existing text assertion expected the old honeypot message. That assertion was updated for the new contact wording and its targeted rerun passed (one test). All 76 browser checks have therefore been verified against the final application code.
- Privacy and order-issue links were followed and completed through intercepted Formspree success responses, with customer email/Reply-To, subject and request-purpose message checked. A provider error containing a private destination was injected and did not appear in the page; entered information was preserved.

Browser submissions were intercepted and sent no real emails. No new inbox delivery test or independent Formspree dashboard inspection is claimed. The unchanged endpoint continues to use the existing dashboard-controlled destination. Changes have not been pushed or deployed in this task.
