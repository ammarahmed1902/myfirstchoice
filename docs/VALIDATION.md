# Validation evidence

## Scope

Executed against the Next.js production build in this cloud environment on 11 November 2026. The public Vercel URL and image host are blocked by the environment's outbound network policy. Results below are local evidence, not a claim that the Vercel deployment, production SMTP or hosted Supabase has been verified.

## Checks completed

| Check | Result | What it establishes |
| --- | --- | --- |
| `npm run typecheck` | Passed | Strict TypeScript checks for the application and tests. |
| `npm run build` | Passed | Next.js production compilation and route generation, including 24 generated static/SSG outputs and dynamic handlers. |
| `npm test` | 15 tests passed; 0 failed/skipped | Quantity/SKU/application validation and PostgreSQL security tests described below. |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` | 8 tests passed; 0 failed/skipped | SSR content, real category navigation, filters/search/empty states, cart/sample persistence, atomic CSV import, API protection when unconfigured, honest account/application/checkout states, metadata/robots/sitemap/404 and mobile layout/accessibility. |
| Axe WCAG A/AA automated checks | No violations in tested views | Mobile Home, Shop, Product, empty Cart/Checkout, Wholesale Application, Account, Quick Order and Contact views. Not a full manual WCAG conformance review. |
| `npm audit --omit=dev --json` | 0 known production dependency vulnerabilities reported | Registry advisory results at the time of execution, not a guarantee of security or a penetration test. |
| `git diff --check` | Passed | No patch whitespace errors. |

## Database test detail

The actual `supabase/schema.sql` is executed in PGlite (embedded PostgreSQL), with an isolated test `auth.users` and `auth.uid()` fixture emulating the identity contract of Supabase. Assertions cover:

- Anonymous users cannot select private prices.
- Pending buyers see no price rows, cannot approve themselves and cannot submit wholesale quotes.
- Missing enquiry fields cannot bypass SQL validation.
- Applications stay private and do not grant approval.
- A trusted administrative approval unlocks prices for the approved buyer.
- Quote requests persist and remain invisible to another buyer.
- Forged references, invalid quantities, missing flags and duplicate lines are rejected even through direct database RPC calls.
- Per-buyer quotation request limits are enforced.

These are real database-policy/function tests, not live Supabase end-to-end tests. Production email verification, SMTP delivery, cookie behavior on the deployed origin, actual staff approval and durable hosted storage still require the services listed in the launch checklist.

## Mobile Lighthouse lab result

Production Home route at a local origin, Lighthouse 13.6.0, mobile simulated throttling. Report timestamp: 11 November 2026, 17:46 Asia/Karachi. Source data is saved in `lighthouse-summary.json`.

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 69 |

| Lab metric | Observed |
| --- | ---: |
| First Contentful Paint | 0.8 s |
| Largest Contentful Paint | 0.8 s |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 110 ms |

SEO remains below 90 because the site intentionally outputs `noindex,nofollow` and disallows crawling while the company/catalogue/legal information is provisional. Set `NEXT_PUBLIC_LAUNCH_READY=true` and rebuild only after that content is approved, then rerun the deployed SEO audit. This report does **not** claim the SEO target has already been reached.

Best practices loses points for browser errors from the blocked external photo host; fallback illustrations still render. The deployed photo path has not been verified here. Local font preloading and metric-adjusted fallbacks removed the font-driven layout shift discovered during development.

This is one local lab measurement, not field CWV, a Vercel performance guarantee, a verified live baseline comparison or a measurement of INP. The 90+ performance/accessibility target is met locally; deployed networking and real catalogue imagery still need validation. Only field monitoring can establish p75 LCP, INP and CLS for real buyers.

## Review artifacts

- `home-desktop.png`: local full homepage screenshot with fallback illustrations.
- `catalogue-mobile.png`: local mobile car-accessories catalogue screenshot with fallback illustrations.
- `lighthouse-summary.json`: scores, metric values, failed audits and measurement limits.
- Full browser traces and Lighthouse HTML/JSON can be regenerated under ignored `test-results/` using the commands in README.

## Not executed / outstanding

- Live Vercel page/deployment inspection: outbound access blocked.
- Real Supabase signup/sign-in, recovery mail, account approval, approved-price retrieval and quote persistence: no project credentials/provider connected.
- Real SMTP delivery or staff notification: no production mail provider configured. Contact/quote handlers save database records when configured; they do not send staff email.
- Real commercial product/MOQ/stock/currency/shipping validation: owner data not supplied.
- Field CWV, real conversion funnel, payments and full manual screen-reader/security reviews: not measured; payments are outside the confirmed quote-only scope.
