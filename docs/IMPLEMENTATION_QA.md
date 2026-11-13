# My First Choice implementation and QA handoff

12 November 2026. Local repository implementation; not a Vercel deployment. The existing production address is https://my1stchoice.vercel.app/ but this task has not updated or validated a new deployment there. No remote preview/deployment URL is available in this session.

## Page-by-page changes

| Area                                | Result                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shared frame                        | The established homepage header/logo and navy footer now serve every page. Main links are Home, Our Products, About Us and Contact Us. Desktop categories support hover, click, arrows and Escape; mobile uses a modal drawer, category expansion, focus trapping and body scroll locking. Current pages are identified. |
| Home                                | Preserved the full-width background slideshow, stationary text, controls, autoplay pause and reduced-motion behaviour. Added shared selected products with product-specific enquiries, the supplied business introduction, four service descriptions, three compact enquiry steps and the supplied enquiry invitation.   |
| Our Products (/shop)                | Four photographed approved homepage products from one data source, identical names/images/details, category filters and prefilled Contact Us links. No extra illustrative products, prices, customer accounts or ordering UI.                                                                                            |
| About Us                            | Supplied business copy and four services, director statement, exact legal company information and contact invitation in an editorial layout.                                                                                                                                                                             |
| Contact Us                          | Exact company/email/registered-office information beside the enquiry form. All requested fields, service-specific product fields, editable product selection, visible validation, preserved failure values and direct email fallback. Public email endpoint replaces login-required database-only enquiries.             |
| Wholesale Terms, Payments & Returns | Explains used/unused funded balances and the £500/£1,000/£300/£700 example, agreed schedules, company invoices, tracking and separate damage/non-delivery guidance. No invented return deadline/address or legally approved-contract claim.                                                                              |
| Privacy                             | Public /privacy supplies factual website handling, privacy contact/rights and the business-confirmed six-month retention period. The complete Privacy Policy remains an internal review draft pending supplier, transfer, sharing and retention-operation decisions. Footer deliberately says “Privacy contact”.         |
| Legacy URLs                         | Shopping/account/quick-order/application URLs redirect to Contact Us; former product URLs redirect to Our Products; old category URLs map to approved categories. Former account/order APIs return 410. No online payments, shopping flow or admin portal remains publicly connected.                                    |

## QA results

Final verification results and screenshots are recorded below. Run commands are in README.md.

| Check                      | Actual result                                                                                                                                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production build           | Passed: npm run build, Next.js webpack production build.                                                                                                                                                                                                         |
| TypeScript                 | Passed: npm run typecheck.                                                                                                                                                                                                                                       |
| Unit/database tests        | 25 passed, zero failed/skipped: 10 new enquiry-delivery tests plus 15 retained historical validation/database tests. The historical tests do not imply public accounts or an active Supabase requirement.                                                        |
| Browser suite              | 56 passed, zero failed/skipped in the completed verification run. Headless system Chromium on Linux.                                                                                                                                                             |
| Responsive pages           | All six pages at 360, 390, 768, 820, 1024, 1280 and 1440 CSS pixels: 42 screenshots, one H1 each, no horizontal overflow, decoded local images, exact footer details and no captured browser console errors or HTTP failures.                                    |
| Short/landscape viewports  | Navigation and contact fields checked at 820×390 and 1440×620. Native phone keyboards/physical devices were not tested.                                                                                                                                          |
| Accessibility              | Automated axe scans on all six pages at 390 and 1440, including WCAG 2/2.1/2.2 A and AA tags, plus dropdown/drawer keyboard tests. Zero violations in tested scans. This is not a complete manual accessibility certification.                                   |
| Navigation & URLs          | Header/footer/CTA destinations, all internal links, category queries, every product prefill, direct visits, legacy redirects, metadata and 404 response checked.                                                                                                 |
| Contact UI                 | Required-field validation and focus, conditional product fields, simulated provider errors with text preservation, duplicate click suppression and provider-accepted wording checked. Browser success/error responses were intercepted, not real email delivery. |
| Server email controls      | Fixed recipient/Reply-To, escaping, header injection, unknown products, body limits, wrong origins, honeypot, atomic rate limit, accepted/pending duplicates, provider errors and idempotent retries checked with fake provider/Redis dependencies.              |
| Real unconfigured instance | Submit disabled and direct email available; valid POST /api/enquiries returns 503 without accepted:true. No live send attempted.                                                                                                                                 |
| Browser privacy/secrets    | No application cookies/local/session storage written in a fresh context. Client HTML and built static output checked for server key names/test-only secret values; none found.                                                                                   |
| Formatting/diff            | Prettier used; git diff --check passed. Package manifest and lockfile unchanged.                                                                                                                                                                                 |
| Lint                       | No lint script is configured; no lint result is claimed.                                                                                                                                                                                                         |
| External ICO guidance      | Retrieval blocked by restricted cloud proxy (403). Current ICO guidance was not read/verified; policy review remains outstanding.                                                                                                                                |
| Deployment                 | Not performed. No Vercel acceptance, deployment result or production inbox receipt claimed.                                                                                                                                                                      |

The mobile Lighthouse lab result is saved in [qa/lighthouse-summary.json](qa/lighthouse-summary.json). The full local HTML/JSON report is under ignored test-results/. Indexing stays deliberately disabled via NEXT_PUBLIC_LAUNCH_READY=false while policy/launch review is pending; interpret the SEO result accordingly. Lab values are a single local Chromium run, not field Core Web Vitals or cross-browser certification.

Visual review covered full-size mobile/desktop pages and rendered comparison sheets for every target width. No adapter stock images or generated products were introduced. The approved source photographs retain their source composition; CSS uses contain fitting and consistent light surfaces.

## Screenshots

Desktop captures are 1440px; mobile captures are 390px. Contact screenshots show the actual unconfigured delivery state, rather than the test-only enabled form. All seven widths are in the comparison sheets.

| Page                        | Desktop                        | Mobile                       | Seven-width comparison          |
| --------------------------- | ------------------------------ | ---------------------------- | ------------------------------- |
| Home                        | [Desktop](qa/home-1440.png)    | [Mobile](qa/home-390.png)    | [Widths](qa/review-home.png)    |
| Our Products                | [Desktop](qa/shop-1440.png)    | [Mobile](qa/shop-390.png)    | [Widths](qa/review-shop.png)    |
| About Us                    | [Desktop](qa/about-1440.png)   | [Mobile](qa/about-390.png)   | [Widths](qa/review-about.png)   |
| Contact Us                  | [Desktop](qa/contact-1440.png) | [Mobile](qa/contact-390.png) | [Widths](qa/review-contact.png) |
| Wholesale terms             | [Desktop](qa/terms-1440.png)   | [Mobile](qa/terms-390.png)   | [Widths](qa/review-terms.png)   |
| Privacy information/contact | [Desktop](qa/privacy-1440.png) | [Mobile](qa/privacy-390.png) | [Widths](qa/review-privacy.png) |

## Email setup and test status

See [EMAIL_SETUP.md](EMAIL_SETUP.md). Required server-only configuration is RESEND_API_KEY, ENQUIRY_FROM_EMAIL (a plain address on a Resend-verified sending domain), UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. The recipient is fixed at ebayecommerce1947@gmail.com. The receiving Gmail address is not verification of a sending domain, and its normal password must not be used.

Restricted cloud outbound access must permit api.resend.com and the selected Upstash REST hostname before live testing. No production sender, API key or Redis account was supplied. Provider acceptance: **not observed live**. Inbox receipt: **not observed or confirmed**. The automatic fake-provider tests and intercepted browser success state do not establish either outcome.

Once configured, send a clearly labelled controlled test enquiry and separately record provider acceptance and recipient-confirmed inbox receipt. Review reply-to, delivered fields, spam protection and retry behaviour. The interface never equates provider acceptance with receipt.

## Missing asset and policy decisions

- Missing approved asset: a USB-C-to-USB-C product photograph. That entry remains unpublished in the product grid. Four products with supplied photographs are shared by Home and Our Products. No unrelated substitute or public photograph-pending card is used.
- Returns: does 15 days mean reporting damage, sending a return, or completing it? Confirm the start date; the reply “when user order” is recorded as a possible order-date interpretation, not published as a firm deadline. Also confirm how non-delivery is reported, authorised returns address, postage responsibility and the replacement/refund procedure. No returns are directed to the registered office.
- Privacy: six months is confirmed for enquiry correspondence. Confirm the start event and mailbox deletion process, actual production suppliers/regions/contracts, additional recipients, legal bases and transfer safeguards. The application cannot automatically delete Gmail correspondence.
- The complete [privacy draft](review/PRIVACY_POLICY_DRAFT.md) and [exact decision list](review/POLICY_DECISIONS.md) are internal documents, not public web routes. No complete-policy or legal-compliance claim is made.

The reusable cloud install_script and start_skill drafts were refreshed for this showcase workflow and its tests. They were saved, not published; environment settings review/save and environment publication remain separate from deploying the website to Vercel. Live processes are not part of an environment snapshot.
