# Launch checklist

## Business and catalogue — required

- [ ] Confirm UK trading entity, company registration number, registered office, business email and phone/WhatsApp. Add these to Contact/footer.
- [ ] Confirm selling currency (GBP is the UK filter convention, not a supplied pricing promise), VAT treatment, MOQ/pack sizes, supported UK regions, delivery methods, charges, lead times, returns, faults, warranties and sample policy.
- [ ] Replace all illustrative ranges/references with approved sellable catalogue records, specifications and licensed product photographs. Keep `lib/catalogue.ts` and the SQL RPC reference/MOQ validation synchronized.
- [ ] Set `verified:true` only for real published products. This enables honest Product schema without exposing private price Offers publicly.
- [ ] Add only verified certification documents, authorized client logos and consented testimonials. Their absence is better than unsupported claims.

## Supabase account and quotation services — required

- [ ] Create a Supabase project in a suitable region; review its data processing terms and UK/international transfer implications.
- [ ] Run `supabase/schema.sql` once in a clean project. Review RLS, grants, functions and rate limits before using a production project.
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` and the public anon/publishable key in Vercel; never put a service-role secret in a `NEXT_PUBLIC_*` variable.
- [ ] Keep mandatory email confirmation enabled. Set the Site URL to the production origin and allow the `/auth/confirm` redirect.
- [ ] Configure production SMTP (for example a verified transactional email provider), verified sender/domain and SPF/DKIM/DMARC. Supabase's built-in test sender is not a production delivery commitment.
- [ ] Configure signup email link with `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup` and recovery email with `type=recovery`. Test delivery, expiration, signup verification, sign-in, password reset and sign-out.
- [ ] Create a real test buyer, submit an application, and approve only after trusted staff review. Staff updates `profiles.status` through trusted Supabase administration; the public site has no self-approval control.
- [ ] Add only confirmed tier rows to `product_prices`; there are no fabricated prices in the seed. Verify pending/anonymous users cannot select them directly through Supabase as well as through the application API.
- [ ] Submit real contact and quote requests; verify records are durable, visible only to their owner and trusted staff, and have correct statuses.
- [ ] Confirm staff responsibility for monitoring `applications`, `enquiries` and `quote_requests`. There is currently no staff notification email or admin dashboard in the website; Supabase administration is the operational interface.
- [ ] Test two separate buyers for order isolation and repeat enquiries. Set retention and deletion procedures, backups, recovery and access reviews.

## Quote checkout and payments

- [ ] Keep checkout as request-for-quote/team approval, as the owner requested. It takes no payment and accepts no order automatically.
- [ ] Agree company, delivery, pricing, VAT, shipping and fulfilment terms in the actual quotation process.
- [ ] Do not add card fields or publish payment badges. Online payments are outside this selected workflow. A future payment task needs a provider, webhook verification, idempotency, amount validation, reconciliation and refund handling.

## SEO and indexing

- [ ] Verify route titles, descriptions, canonicals and production `NEXT_PUBLIC_SITE_URL`.
- [ ] Keep `NEXT_PUBLIC_LAUNCH_READY=false` while catalogue and legal information are incomplete. Set true and rebuild only after release approval; this updates robots and page metadata.
- [ ] Check `/sitemap.xml`, `/robots.txt`, canonical URLs and actual HTTP 404s on Vercel. Submit the sitemap in Search Console.
- [ ] Validate Organization/Product structured data. Do not invent reviews, offers, availability, product brands or price snippets. Real verified products only.
- [ ] Add approved social sharing artwork and verify share previews.
- [ ] Preserve existing URLs or implement redirects for any previously indexed pages. The old site used anchors, not separate product URLs.

## Accessibility and performance

- [ ] Run `npm run build`, `npm run typecheck`, `npm test` and `npm run test:browser`.
- [ ] Repeat production mobile Lighthouse runs on Home, Shop and Product with the deployed network/CDN and real photography. Target 90+ where appropriate; never represent a local lab run as real-user CWV.
- [ ] Measure field LCP, INP and CLS after launch. Targets at the 75th percentile: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1.
- [ ] Replace blocked/unavailable photo sources with approved locally stored WebP/AVIF files. Verify image optimization responses, layout stability and responsive crops on Vercel.
- [ ] Manually test keyboard-only use, zoom, screen readers, mobile touch targets, contrast and error announcements. Axe passing is not a WCAG certificate.

## Analytics and security

- [ ] Choose analytics/error monitoring providers and evaluate UK consent requirements before adding nonessential trackers.
- [ ] Define events: application saved, quote request saved, product/category view, CSV import success/failure. Count successful server outcomes, not button clicks, as leads.
- [ ] Avoid logging passwords, API keys, full enquiry bodies or personal data into analytics.
- [ ] Confirm HTTPS, secure cookie behavior, headers, CSRF origin checks and no client exposure of service-role credentials.
- [ ] Enable Supabase Auth rate limits and CAPTCHA/bot protections; configure Vercel WAF/rate rules where appropriate. Database per-user write limits do not replace authentication abuse controls.
- [ ] Run dependency/security scans on the locked versions and schedule updates. Configure a Content Security Policy for the actual deployed image/auth/analytics origins using Next-compatible nonce handling if adopted; a strict CSP is not implemented here.
- [ ] Publish approved UK privacy/trading policies, controller contact, retention details and processor information. Review data subject request handling.

## Vercel release

- [ ] Import `ammarahmed1902/myfirstchoice`, use Next.js preset, build `npm run build` and Node.js 24 LTS. Remove any manually overridden Vite `dist` output setting.
- [ ] Configure environment variables for the correct Preview/Production scopes; rebuild after changes.
- [ ] Protect previews from accidental public indexing/customer submissions. Verify production and preview auth redirect origins separately.
- [ ] Confirm GitHub commit SHA and successful Vercel build in the dashboard, then smoke-test the actual deployment. A Git push is not proof of a successful deployment.
