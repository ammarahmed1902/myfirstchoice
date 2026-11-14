# Formspree handoff — 14 November 2026

Contact Us now submits directly to https://formspree.io/f/myewknly. No Resend/Redis/SMTP secrets are required. The existing form fields, product prefills, classes and responsive layout are preserved. The old Resend delivery endpoint is retired (POST /api/enquiries returns 410).

Fixed notification subject: **My First Choice — New Website Enquiry**. The website name is also sent as website_name and included in the message body. The customer's validated email is submitted as email and _replyto. Customer data uses clear field names, including the selected product's display name and stable reference.

| Check | Result |
| --- | --- |
| Production build | Passed |
| TypeScript | Passed |
| Unit tests | 20 passed: 5 Formspree payload/schema/error tests and 15 retained validation/database tests |
| Browser suite | 65 passed; no skipped/failed tests |
| Loading and duplicate clicks | Checked: in-flight lock, disabled fields/button, success not shown while pending |
| Acceptance | Intercepted HTTP success + ok:true; button locks after acceptance |
| Failures | Provider rejection, field errors, network failure, malformed response and ok:false tested; user input preserved |
| Validation | Empty required fields, invalid email, quantity validation and honeypot checked |
| Payload | All entered fields, product name/reference, subject, website branding and customer Reply-To checked |
| Responsive/accessibility | Existing all-page seven-width sweep passed; Contact Us inspected at mobile/desktop with tablet screenshot captured; axe scans passed at 390 and 1440 |
| Notification recipient | Account owner confirmed ebayecommerce1947@gmail.com is verified/enabled in Formspree; not independently inspected by the assistant |
| Actual provider acceptance | Not tested: cloud proxy blocks Formspree with 403 |
| Actual inbox receipt | Not observed or confirmed |
| Git push / Vercel deployment | Not performed in this task |

Screenshots: [mobile](qa/formspree-contact-390.png), [tablet](qa/formspree-contact-820.png), [desktop](qa/formspree-contact-1440.png).

The tests intercept external submissions and send no email. The public form ID cannot prove dashboard recipients. The user's dashboard confirmation establishes the reported recipient setting, not delivery. After deployment, submit one clearly labelled controlled enquiry, confirm it appears in Formspree submissions, confirm receipt separately in Gmail, and check the exact subject and Reply-To. Custom notification templates may override submitted values; verify those bindings in the dashboard.

The required cloud outbound domains formspree.io and help.formspree.io were saved as a configuration draft. A draft save does not apply the runtime policy or publish anything; review/save those settings, then retry actual connectivity. Environment publication and Vercel website deployment are separate operations.

See [EMAIL_SETUP.md](EMAIL_SETUP.md) for the exact dashboard and email verification checklist. The public privacy text now identifies Formspree. Supplier retention and international-transfer details remain part of the outstanding full-policy review.
