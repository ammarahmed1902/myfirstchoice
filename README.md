# EBAY 1ST CHOICE LTD — UK wholesale platform

Next.js App Router, React, TypeScript and Tailwind CSS. A quote-based wholesale catalogue for electronics and car accessories. **No online payment or automatic order acceptance.**

## Run locally

Node.js 24 LTS recommended (Next.js requires a supported Node.js 20.9+ release).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Use the repository's existing checkout; cloud tasks already provide an isolated environment. No Git worktree is needed.

```sh
npm run typecheck
npm test
npm run build
npm start
```

If npm's default cache is not writable, append `--cache /tmp/ebay-npm-cache` to installation commands. Do not disable TLS or dependency integrity checks.

## Backend configuration

The site renders and its cart/search/CSV flows work without credentials. **Account creation, approval, private prices, contact submission and quote persistence require Supabase.** Unconfigured forms explain this and cannot return fake success.

1. Create a Supabase project and run `supabase/schema.sql` once in its SQL editor. This creates profiles, private prices, applications, enquiries and quotation requests with RLS, validated RPC functions and per-user write limits. Do not run against an existing production schema without review.
2. Set the URL and public anon/publishable key in `.env.local` and Vercel using the names in `.env.example`. No service-role key is needed or permitted in client code.
3. Enable email confirmation; set the Site URL and `/auth/confirm` redirect. Configure production SMTP. Signup template URL: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`. Recovery uses `type=recovery`.
4. Create/verify an account, apply for wholesale access and approve a verified buyer through trusted Supabase administration:
   ```sql
   update public.profiles set status = 'approved' where id = '<verified buyer UUID>';
   ```
5. Add only confirmed rows to `product_prices`. A tier contains `product_id`, `min_qty`, `unit_price` and ISO currency. No invented tier prices are seeded. Do not use unverified example prices in production.
6. Staff monitor and manage `applications`, `enquiries` and `quote_requests` through trusted administration. No staff email alerts or staff-facing dashboard have been implemented; successful submission means saved in the database, not emailed.

Public content is in `lib/catalogue.ts`; confirmed prices live only in the protected database. Keep published product/MOQ validation synchronized in the SQL RPC when replacing the illustrative catalogue.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin; defaults to the supplied Vercel URL. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon/publishable key; security is enforced by RLS and validated server/database operations. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Verified business email; omitted when unset. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Verified international-format digits; WhatsApp link omitted when unset. |
| `NEXT_PUBLIC_LAUNCH_READY` | Keep `false` until catalogue/company/legal information is approved. `true` enables search indexing after rebuild. |

Never place SMTP credentials, service-role keys or private account data in `NEXT_PUBLIC_*` values. Environment variable changes require rebuild/redeployment.

## Testing

`npm test` includes validation and a real embedded PostgreSQL engine (PGlite) exercising the supplied SQL policies/functions. The test auth schema emulates Supabase auth identity; this does not prove production Supabase email or network connectivity.

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

To use system Chromium in this cloud machine:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

Playwright starts a production server if one is not running. It validates public navigation, cart persistence, CSV validation, missing-service states, private endpoint boundaries, metadata/404s and mobile axe checks. Live signup/SMTP/approval requires configured Supabase and is a launch check.

With a production server running, use `npm run audit:mobile`. Set `CHROME_PATH=/usr/bin/chromium` when necessary. Lab Lighthouse results do not measure real-user INP or guarantee deployed scores. Reports are generated in ignored `test-results/`.

## Vercel

Import the GitHub repository with the **Next.js** preset. `vercel.json` explicitly sets the Next.js framework, build command and `.next` output directory. This overrides the old Vite `dist` output setting and prevents `NEXT_OUTPUT_DIR_MISSING` after the framework migration. Add backend/contact variables securely, then redeploy. Pushes to the connected production branch trigger builds; verify their outcome in Vercel.

## Structure and deliverables

- `app/`: server-rendered routes, route metadata, API handlers, sitemap, robots and custom 404.
- `components/`: reusable navigation, product, cart, trade forms and account UI.
- `lib/`: business configuration, public catalogue, validation and server-only database client.
- `supabase/schema.sql`: database schema, RLS, approval and quote validation.
- `tests/`: unit/database tests and browser regression tests.
- `docs/AUDIT.md`: prioritized audit with evidence limits.
- `docs/SITEMAP.md`: full sitemap and per-page wireframes.
- `docs/COPY.md`: section copy and CTAs.
- `docs/VALIDATION.md`: executed checks and measurement evidence.
- `docs/LAUNCH_CHECKLIST.md`: business, SEO, backend, analytics, payment-scope and security release checks.

Photography is representative Unsplash category imagery with original local SVG fallbacks; see `IMAGE_SOURCES.md`. Approved real product information, company/contact/legal details, MOQ, currency/VAT and shipping terms remain launch prerequisites. No customer logos, reviews, certifications or fulfilment claims have been fabricated.
