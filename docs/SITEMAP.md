# Sitemap and page wireframes

## Global navigation

Announcement strip → sticky brand/search/account/enquiry-list header → category/quick-order navigation. Footer links to ranges, application, account, About, Contact and legal information. A WhatsApp link appears only when the verified business number is configured.

| URL | Desktop wireframe and purpose | Mobile behavior |
| --- | --- | --- |
| `/` | Split hero with buyer-application CTA and secondary catalogue CTA → process/trade strip → equal Electronics/Car Accessories cards → featured ranges → large dedicated automotive feature → MOQ/quotation/delivery/access explanations → three-step trade process → FAQ → wholesale/contact banner → footer. | Search stays visible; menu collapses; hero and categories stack; products use two columns; all explanatory sections stack. |
| `/shop` | Page heading → left filter panel (category, MOQ, availability, approved GBP prices) + catalogue toolbar/search/results and product grid. Explicit representative-range disclosure. | Filter panel sits above the results in a compact two-column control grid; product cards use two columns. |
| `/shop/electronics` | Category-specific heading and preselected catalogue/filter view. | Same responsive catalogue layout. |
| `/shop/car-accessories` | Automotive category heading and preselected car accessory grid. | Same responsive catalogue layout, with automotive navigation remaining equally accessible. |
| `/product/[slug]` | Breadcrumbs → large representative photograph + product name/reference/description → private trade-price panel/tier table → MOQ/availability/delivery terms → quantity → add/request quote/sample actions → product-information disclaimer → related ranges. | Image precedes buying information. Actions wrap to full available width. Quantity remains labelled and editable. |
| `/cart` | Enquiry product lines with image, reference, quantity, sample flag and remove action → sticky summary with lines/units and quote checkout CTA. Cart stores references/quantities locally, never private prices. | Summary follows line items; each item retains labelled quantity and remove button. |
| `/checkout` | Business/address/notes form + enquiry summary. Signed-in approved buyers submit a quotation request; only confirmed database success produces a reference and clears the list. No tax, shipping or payment amount is invented. | Single column; clear service/account/approval prerequisite messages appear above the form. |
| `/quick-order` | SKU/quantity rows and add-row controls + CSV instructions/template/upload. Whole import succeeds or fails; duplicate lines combine. | Rows fit the viewport; upload instructions follow the entry form. |
| `/wholesale-application` | Trade benefits/three application steps + verified-account business application form. Pending is distinct from approved. | Explanation precedes the form. Missing service/sign-in prerequisites are visible. |
| `/account` | Signed out: trade benefits + sign-in/create-account form and password recovery. Signed in: status, password tools, own quote history and repeat enquiry action. No buyer can self-approve. | Forms and request cards stack. Repeat enquiry copies into the local cart for review, not automatic reordering. |
| `/about` | Brand mark + substantive business introduction → clarity/relevance/conversation approach → application CTA. No invented company history, years, certifications or scale. | Brand and introduction stack. |
| `/contact` | Company/product/market details + verified email/WhatsApp when configured + signed-in enquiry form. | One column, contact details first. |
| `/privacy` | Pre-launch privacy implementation facts and explicit outstanding legal requirements. | Readable narrow prose. Not presented as an approved final policy. |
| `/terms` | Quote-based trading explanation, unconfirmed commercial terms and legal launch requirements. | Readable narrow prose. |
| unknown URL | Real HTTP 404, concise recovery message and catalogue link. | Large readable recovery action. |

## Trade flow

Browse without an account → create/verify account → submit wholesale application → staff reviews in trusted Supabase administration → approved account can retrieve private tiers → build enquiry via products/CSV/history → review cart → submit quotation request → view own request history → team manages the quote outside automatic checkout.

Prices and approval are enforced on the server/database, not merely hidden in CSS. Anonymous visitors may prepare an enquiry cart but cannot impersonate an approved buyer. No fulfilment, order acceptance or payment is inferred from a quote request.
