# My First Choice — EBAY 1ST CHOICE LTD

A Next.js 16 showcase and business-enquiry website, with React, TypeScript and local product imagery. Public pages: Home, Our Products (/shop), About Us, Contact Us, wholesale trading information and privacy contact/information. The full Privacy Policy remains an internal review draft; see docs/review/POLICY_DECISIONS.md.

## Develop

Use the existing checkout; cloud tasks already provide an isolated environment. Do not create a Git worktree unless requested. Node.js 24 is required.

```sh
npm ci --cache /tmp/ebay-npm-cache
# Create only when absent; preserve any existing local configuration.
test -e .env.local || cp .env.example .env.local
npm run dev
```

Next development automatically generates AGENTS.md and adjusts next-env.d.ts for dev-generated types. Preserve user changes and clean up only generated changes when necessary. Homepage and Our Products share approved data in lib/homepage-content.ts. Four supplied photographs are published; the USB-C-to-USB-C photograph is missing and that item is not added to the grid.

```sh
npm run build
npm run typecheck
npm test
npm start
```

Do not run a production build while a dev server is writing the same build output. Stop only servers you started. A production server can use the saved .next build after environment restoration; live processes do not persist.

## Browser QA

System Chromium is available in this cloud environment. The browser form acceptance/failure test uses test-only configuration and intercepts the endpoint; it sends no real mail. Stop any server occupying port 3000 before running this command so Playwright starts a server with the test environment:

```sh
RESEND_API_KEY=test-only-placeholder \
ENQUIRY_FROM_EMAIL=enquiries@example.com \
UPSTASH_REDIS_REST_URL=https://test-only.upstash.io \
UPSTASH_REDIS_REST_TOKEN=test-only-placeholder \
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium \
CI=1 npm run test:browser
```

Do not save these test values as production configuration. Reports and responsive screenshots go in ignored test-results/. Existing legacy PostgreSQL/validation unit tests remain for the retained historical schema; they do not indicate that account/order flows are public or required.

## Email and policies

See docs/EMAIL_SETUP.md for Resend and Upstash configuration. Form sending remains unavailable until all required server-side values are set. Direct email is always available. No Gmail password, checkout, payment collection, customer accounts or admin portal is used. The old commerce URLs redirect to products/contact; their API endpoints return 410.

Set NEXT*PUBLIC_SITE_URL to the canonical origin. Keep NEXT_PUBLIC_LAUNCH_READY=false until content and policy approval. Enquiry keys are server-only. Never expose them in NEXT_PUBLIC*\* variables.

See docs/review/ for the unpublished 15-day clause decisions and full privacy policy draft. The business has specified a six-month enquiry retention period; mailbox deletion must be implemented by staff. The registered office is not a confirmed returns or visit address.
