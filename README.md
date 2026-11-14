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

System Chromium is available in this cloud environment. Formspree requests in browser tests are intercepted, so automated tests do not send real enquiries. Stop any server occupying port 3000 so Playwright starts its production server:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium CI=1 npm run test:browser
```

Reports and responsive screenshots go in ignored test-results/. Historical PostgreSQL/validation tests exercise the retained schema; public account/order flows are retired.

## Email and policies

The Contact Us form posts directly to `https://formspree.io/f/myewknly` using JSON and Formspree's public form ID. No Resend, Redis, SMTP credentials or email API key are required by this integration. `/api/enquiries` no longer sends email: old POSTs return 410 with instructions to reload the contact page.

See [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md) for the notification settings, subject and Reply-To verification checklist. The receiving address must be verified in the Formspree dashboard; endpoint acceptance alone does not prove the recipient or inbox delivery. Public contact, privacy requests and order issues use Contact Us links to the enquiry form. The notification destination is kept only in Formspree.

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin. Keep `NEXT_PUBLIC_LAUNCH_READY=false` until content and policy approval. The Formspree endpoint is public; never put dashboard credentials in browser code.

See docs/review/ for the unpublished 15-day clause decisions and full privacy policy draft. The business has specified a six-month enquiry retention period; mailbox deletion must be implemented by staff. The registered office is not a confirmed returns or visit address.
