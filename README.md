# EBAY 1ST CHOICE LTD

Responsive wholesale catalogue for electronics and car accessories. Built with Vite, vanilla JavaScript and CSS. No cart, checkout or online payment.

## Local development

Requires Node.js 22.12+ or 24 LTS.

```sh
npm ci
npm run dev
```

Open the address reported by Vite. For production validation:

```sh
npm run build
npm run preview
```

If the environment's default npm cache is not writable, append `--cache /tmp/ebay-npm-cache` to npm installation commands.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import `ammarahmed1902/myfirstchoice`.
3. Use the repository root, the Vite preset, build command `npm run build`, and output directory `dist` (also specified in `vercel.json`).
4. Deploy. Subsequent pushes to your configured production branch trigger deployment.

The site needs no environment variables in its current demo configuration.

## Content and enquiry status

Product ranges and photography are illustrative, not a verified stock catalogue. Edit the `products` collection and homepage content in `src/main.js` with approved details before launch. Representative online photography is served by Unsplash. If a photograph fails to load, the site uses its original local SVG illustration instead. These are category illustrations, not claims about exact products in stock. Replace with approved product photography when the actual catalogue is available. DM Sans and Manrope fonts are bundled locally through Fontsource. See `IMAGE_SOURCES.md` for source URLs and usage notes.

The enquiry form validates its fields and downloads a local `.txt` file. **It does not send email or store submissions.** This is explicitly explained beside the form and in the confirmation. Connect a verified business email and a server-side mail provider or form service before accepting customer enquiries. Keep provider secrets on Vercel, never in client JavaScript.

Add the company's verified contact details, registered office, registration number and applicable privacy/trading policies before public launch. The current logo is a custom SVG concept; this implementation does not claim trademark clearance or affiliation with eBay.

## Editing

- `src/main.js`: page content, product data, filters, search and local enquiry preparation.
- `src/style.css`: responsive layout and colors.
- `public/favicon.svg`: geometric monogram.
- `vercel.json`: deployment settings.

## Updated catalogue experience

The homepage includes a dedicated car accessories feature, category filters, search, product detail dialogs (keyboard Escape to close), enquiry prefill, local enquiry download and responsive mobile navigation. The image error handler uses local SVG fallbacks and prevents broken-image loops.
