# Homepage-only redesign

## Scope

The existing Next.js/React/Tailwind project is retained. Only the `/` homepage is redesigned, including its route-specific header/footer and scoped visual system. Existing Catalogue, About, Contact, product, cart, checkout and account implementations remain unchanged. Those pre-existing commerce/account routes are preserved but not promoted on the new homepage. No new pages, backend integrations, registration, pricing, cart actions or submission success states were added.

`components/site-frame.tsx` selects the new homepage chrome only at `/`; other paths continue to use their original header and footer. The existing logo/monogram and company wordmark are reused. Homepage type uses the existing locally hosted Manrope family, with warm white `#F7F6F2`, navy `#142333` and small muted gold `#B39762` details. The single visible H1 and copy follow the supplied brief.

## Product approval and missing photography

The repository and workspace were inspected, including existing public images, earlier mockups and available files. **No actual product photographs for the five approved types were supplied.** Previous generated mockups, generic illustrations, vehicle photos and wall-charger imagery are not used anywhere on this homepage.

The page intentionally displays labelled “Product photograph pending” panels. These are not product renderings or substitutes. The photographic showcase is not complete and must not be described as having verified product images.

Provide at least these original photographs/cutouts on white, transparent or light-stone backgrounds (ideally 1,600 pixels or more on the long edge):

| Required photo | What must be clearly shown | Suggested local filename |
| --- | --- | --- |
| Nylon-braided cable | Actual braided texture, finish and both actual connectors | `/images/homepage/nylon-braided-cable.webp` |
| Lightning cable | Actual Lightning connector and the other actual connector; no inferred brand/authenticity | `/images/homepage/lightning-cable.webp` |
| USB-C to USB-C cable | Both USB-C ends and actual cable finish | `/images/homepage/usb-c-to-usb-c-cable.webp` |
| Car charger | Actual in-car charger shape, finish and ports; not a wall adapter | `/images/homepage/car-charger.webp` |
| RFID wallet | Actual exterior, proportions and material | `/images/homepage/rfid-wallet.webp` |

An additional wallet angle/colour/interior photo is optional and may be used only if actually supplied. No interior or product feature is invented. The Our Business composition can reuse the actual cable/wallet images; no warehouse photograph is implied.

To integrate supplied images, place optimized files under `public/images/homepage/` and set their `image` paths in `lib/homepage-content.ts`. `ProductImage` uses Next/Image with reserved space, responsive sizes and `object-fit: contain`; the first hero cable loads with priority. Offscreen images defer. Loading failures show an honest unavailable panel instead of a broken image or unrelated replacement.

There are five selected products because these are the five explicitly confirmed types. No sixth product, inferred variation, stock level, power rating, length, colour, certification or compatibility claim was invented. Lightning and USB-C to USB-C remain named in the first slide and selected products. No Apple/iPhone or Samsung wall adapter is shown in the hero, cards, background or editorial composition.

## Homepage structure

- Compact, sticky header: original logo, Home, Our Catalogue dropdown, About Us, Contact Us, Wholesale Enquiry.
- Approximately 40/60 split hero, with stationary copy and a fixed-height three-slide product stage.
- Charging Cables / Car Accessories / RFID Wallets slides; next/previous, indicators, pause/play, swipe, hover/focus pause and reduced-motion handling. Next/autoplay loop right-to-left with boundary clones; the reset does not animate backwards.
- Five selected product groups; no prices, ratings or marketing badges.
- Our Business editorial composition and supplied business copy.
- Three-step How to Enquire section with fine dividers.
- Navy wholesale enquiry invitation and refined footer, with existing legal links and configured contact details only.

## Destinations and temporary anchors

| Action | Destination | Reason |
| --- | --- | --- |
| Home / logo | `/#home` | Real homepage target. |
| View All Products / Explore Catalogue / View Catalogue | `/shop` | Existing functioning catalogue route, preserved without redesigning it. |
| Charging Cables dropdown | `/#charging-cables` | A dedicated charging-cables route does not exist; this anchors to the approved product selection. |
| Car Accessories dropdown | `/#car-accessories` | The existing automotive catalogue currently contains other illustrative ranges; this anchors to the newly approved Car Charger card instead of implying that those records were verified. |
| RFID Wallets dropdown | `/#rfid-wallets` | No existing RFID category route; anchors to the approved wallet card. |
| About Us | `/about` | Existing route, not rebuilt. |
| Contact Us / Enquire / Wholesale Enquiry / Make an Enquiry | `/contact` | Existing contact route, not rebuilt or wired to a fabricated receiver. |
| Footer legal links | `/privacy`, `/terms` | Existing routes, preserved. |

All category expansion lives inside the header; there are no homepage filters or secondary category dropdowns. Desktop supports pointer hover/click, Tab, arrow keys, Home/End and Escape with focus return. The mobile dialog provides focus containment, expandable catalogue categories, backdrop/close button and Escape dismissal.

## Enquiry limitation

A receiving business email/phone has not been supplied. The homepage adds no form, external form service or inbox. Existing `/contact` honestly explains its unconfigured state; reaching that page is not a claim of delivered enquiries. Supply a verified receiving email and optional WhatsApp number before completing the future Contact page. No address or registration number was invented.

## Verification

See the accompanying homepage browser tests and locally generated screenshots. Acceptance must distinguish implemented carousel/layout/navigation from the **blocked actual-photography requirement**. The public Vercel host could not be inspected because the execution environment denies the outbound connection; local production rendering is the available evidence.

### Executed checks for this revision

- `npm run typecheck`: passed.
- `npm run build`: passed.
- Production-browser suite: **19 tests passed, 0 failed/skipped** (11 homepage cases plus 8 existing-route regression cases).
- Rendered screenshots reviewed at 375, 768, 1024 and 1440 pixels; no horizontal overflow or automated WCAG A/AA violations in those homepage views.
- Explicitly exercised dropdown hover/click, keyboard opening, End and Escape, mobile Tab/Shift+Tab focus containment and focus return, submenu expansion, carousel controls, swipe, five-second autoplay, hover/focus pause and reduced-motion manual operation.
- One H1, correct approved product names, no adapter/stock/generated imagery, no retail/account promotions, valid link/anchor destinations and no new homepage JavaScript/console errors were checked.
- Existing catalogue/search/filters, cart persistence, quote prerequisite states, CSV validation, endpoint protections, account states and SEO/404 routes continue to pass their previous regression cases. They were not redesigned.
- `homepage-desktop.png` and `homepage-mobile.png` are local review screenshots with **photo-pending panels**, not evidence of final product photography. The previous `lighthouse-summary.json` and earlier design screenshots belong to the previous revision and are not a fresh performance measurement for this homepage.
- Real-photo composition, connector visibility, material fidelity and supplied-image optimization cannot be verified until the five original product photographs are provided. No replacement stock or generated products were used to make that acceptance criterion appear complete.
