> Update, 14 November 2026: Contact Us now uses Formspree form `myewknly` directly. Earlier Resend/Upstash descriptions below are historical and superseded. See [current email integration notes](../EMAIL_SETUP.md). Confirm Formspree recipient, notification settings, retention and transfer terms during review.

# Privacy Policy — INTERNAL REVIEW DRAFT

Prepared 12 November 2026. Do not publish this draft before the decisions listed in POLICY_DECISIONS.md are resolved. It has not been checked against retrievable current ICO guidance or verified supplier account contracts.

## Controller and contact

EBAY 1ST CHOICE LTD, company number 17532062, registered office: 117 Crocketts Road, Birmingham, England, B21 0HS. Privacy contact: ebayecommerce1947@gmail.com.

## Information collected

Website enquiries contain full name, email address, enquiry type and message; company name and phone number are optional. Wholesale product enquiries may include a selected product identifier and quantity. Direct email correspondence may contain other information the sender chooses to provide. Request metadata, including IP addresses, may be processed by hosting/network suppliers. The application uses a keyed IP hash for short-lived abuse limits and a message-content hash to suppress duplicates. It does not store message text in Redis or application logs.

## Purposes and proposed lawful bases — confirm with the controller

Responding to a person's request about potential business: steps at their request before entering a contract, where that basis actually applies. Business-to-business communication where the enquirer represents another organisation: legitimate interests in handling business enquiries. Abuse prevention and protecting website availability: legitimate interests in security, with proportionate limits and short retention. No enquiry marketing consent is bundled into the form, and no marketing programme is implemented. Confirm that these bases match the actual controller relationship and document the legitimate-interest assessment where needed.

## Suppliers and recipients — confirm production accounts

The live site is on Vercel. The proposed sending integration is Resend. Upstash Redis supplies shared rate limiting and duplicate suppression when configured. The fixed recipient is the company's Gmail mailbox. Staff with access to that inbox can read enquiries. Confirm the account types, processor/controller roles, authorised staff and any additional recipients. Do not use the phrase “we never share data”. The previous Supabase/account backend is retired from public routes; no customer login or database persistence is used by the new enquiry endpoint.

## International processing and safeguards — requires confirmation

Do not claim data stays only in the UK. Confirm regions and transfers for Vercel, Resend, Upstash and the Google email account. Review the contracts and applicable UK adequacy decisions, UK IDTA or UK Addendum safeguards before specifying which apply. Provide a way to request information about the safeguards. No supplier-specific safeguard is asserted as verified by this draft.

## Retention

The business has specified six months for enquiry correspondence. Confirm when this starts and how mailbox deletion is performed. The code does not schedule deletion from Gmail or a provider. The website's Redis abuse counter expires after one hour; accepted duplicate hashes expire after 24 hours; pending reservations expire after two minutes. Confirm supplier delivery/log retention separately. Distinguish other records needed for a later transaction from general enquiry correspondence.

## Rights and complaints

Explain access, correction, erasure, restriction, objection and portability subject to applicable conditions, and withdrawal where a separate processing purpose relies on consent. Explain that a request is made using the privacy email, with proportionate identity checks where necessary. Give the right to complain to the UK Information Commissioner's Office at https://ico.org.uk/make-a-complaint/ and explain how to raise a concern with the company. No solely automated legal/significant-effect decision system is implemented.

## Cookies and similar technology

The new showcase has no customer authentication, cart, browser persistence of enquiry text, payment provider, analytics or advertising integration. Fonts and approved product/hero images are local. No application cookies are set. Check the actual deployed site and hosting settings before extending this statement to platform-injected analytics, cookies or all third parties. Unsent values live in page memory and are lost on reload/close. No cookie banner is necessary for nonexistent trackers, and none is added.

## Finalisation

Once the business decisions and provider contracts are confirmed, replace the public limited privacy information with the complete notice, add a genuine publication date, change the footer link to “Privacy Policy”, and update the contact-form link. Do not treat this internal draft as compliance verification.
