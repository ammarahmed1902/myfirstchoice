# Website audit and prioritized redesign

Brand: EBAY 1ST CHOICE LTD. UK wholesale electronics and car accessories for retailers/resellers. Checkout is a quotation request, not online payment, as confirmed by the owner.

## Evidence and scope

- Baseline source reviewed: Git commit `a34addd`, the prior Vite site in this repository.
- A live HTTP request to `https://my1stchoice.vercel.app` was denied by this environment's outbound proxy (403 CONNECT). This is **not evidence that the deployed website is down or returns 403 to visitors**.
- Code inspection and local production-browser testing are available. There is no Search Console, CrUX, analytics, conversion-rate or production account/database access. Live Core Web Vitals and actual business results cannot be reported.
- Current product ranges/images are illustrative. The owner confirmed the UK market and quote/team approval checkout. Currency, MOQ, shipping methods, contact details, registered office, company number, VAT treatment, exact catalogue and actual price tiers remain unconfirmed.

## Priorities

Impact rankings are qualitative engineering/UX estimates, not measured conversion uplift.

| Priority | Area and baseline finding | Impact | Redesign / remaining action |
| --- | --- | --- | --- |
| P0 | Conversion: the enquiry form downloads a text file; it never reaches the business. There is no delivery channel or saved request history. | A buyer cannot complete a business enquiry through the site. | Database-backed contact, application and quote submission routes, explicit saved/failure states. Connect Supabase before launch. No false success when unavailable. |
| P0 | Trade access: there is no authentication, approval system, private price source or per-buyer history. | Required wholesale functionality is absent. | Supabase verified accounts, trusted approval, protected pricing API, RLS policies and own-request history. No client-controlled approval switch or prices shipped in public JS. |
| P0 | Trust: verified contact, registered office/company number and approved trading/privacy policies are missing. MOQ, shipping, stock and pricing are unknown. | Buyers cannot independently assess the supplier or commercial commitment. | Dedicated Contact, About and trade-information pages; explicit confirmation wording. Publish verified company/legal details before enabling indexing. Do not fabricate testimonials, certifications or customer logos. |
| P1 | Navigation: one long page, anchor navigation and modal-only product descriptions. No indexable category/product routes. | Discovery, sharing and return visits are harder. | Persistent search; real Home, Shop, category, product, quick-order, application, contact and account URLs. Breadcrumbs and custom 404. |
| P1 | SEO: baseline relies on JS-generated content and has only global metadata, without a sitemap, route canonicals or route-level metadata. | Weak discoverability of individual ranges. | Next.js server/static rendering, per-route titles/descriptions/canonicals, sitemap, robots and Organization schema. Product schema is conditional on real verified product data; private prices are never exposed in public offers markup. |
| P1 | Conversion: no persistent multi-product workflow, CSV entry, sample request or repeat enquiry. | Trade buyers must manually describe repeat requirements. | Browser-persisted enquiry cart, quantity validation, atomic CSV import, sample enquiries, account history and repeat enquiry controls. Quote-only checkout. |
| P1 | Visual design: attractive palette, but a car-led hero and mixed category photography can obscure electronics and specific accessory products. Illustrations are fallbacks, not stock evidence. Accumulated CSS overrides make consistency harder. | Buyers need clearer product hierarchy and more credible product information. | Coherent navy/ivory/emerald/gold system; paired category cards, electronics-led featured products and a dedicated automotive feature. Reusable components, product pages, grouped buying information. Approved stock photography/specifications remain a content prerequisite. |
| P1 | Mobile: the baseline has responsive rules and passed earlier overflow checks; a mobile defect is not established. However, long pages and compressed product information create extra navigation work. | High potential friction for quick-order users. | Mobile-first search/menu, responsive filters, one-column checkout, labelled quantity controls and keyboard-friendly forms. New mobile/browser checks are recorded separately. |
| P1 | Accessibility: ad-hoc icon/text controls and dynamic states need consistent focus, labels, feedback and contrast review. | Some buyers may struggle with navigation and forms. | Skip link, landmarks, labelled controls, visible focus, live status, disabled-state explanations, reduced-motion support and automated WCAG checks. Automated checks alone do not establish full WCAG conformance. |
| P2 | Speed: external image availability is unreliable in this environment; baseline already includes fallback illustrations. Production CWV are unavailable. A heavier framework is not automatically a speed improvement. | Potential LCP/image reliability and maintenance costs. | Next/Image sizing and modern formats, priority hero image, lazy below-fold images, local fonts and retained SVG fallbacks. Run production lab audits and field monitoring; do not claim an unmeasured INP improvement. |
| P2 | Measurement: no verified analytics, event tracking or consent configuration. | No baseline conversion funnel or real-user performance evidence. | Launch checklist defines approved analytics, quote events, error monitoring and UK consent review. No trackers installed without a chosen provider and consent decision. |

## Design decisions

- Main promise: **Good products. Better business.** Primary action: **Become a wholesale buyer**.
- UK trade positioning; no automatic order acceptance or payment collection.
- Trust comes from verifiable information and clear processes. Certification badges, client logos, ratings and fast-shipping claims are intentionally absent until supported by evidence and permission.
- Dark text on warm ivory, emerald actions and restrained gold accents. Manrope headings and DM Sans body text are hosted locally. Semantic content is present in initial HTML.
- A product reference, MOQ status and availability status appear on each card/detail page. Unknown values say “confirm on enquiry”; the site never invents stock or bulk discounts.
- Approved trade prices are optional database records, not placeholder numbers. The price filter explicitly uses GBP records for the UK interface; actual currency is read from each confirmed price tier. Currency and VAT treatment still need owner confirmation.

## Readiness boundary

The frontend and database integration code can be tested locally. The platform is **not ready to accept customer accounts or quotation requests** until a Supabase project, email verification/SMTP and the schema are configured. The current build uses honest disabled submission states when these are absent. No live authentication, email delivery, production approval or deployment success is inferred from local tests.

See `VALIDATION.md` for executed tests and lab measurements, `SITEMAP.md` for page wireframes, `COPY.md` for copy, and `LAUNCH_CHECKLIST.md` for the remaining release work.
