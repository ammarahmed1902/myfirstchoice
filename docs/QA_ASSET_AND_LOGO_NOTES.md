# Product asset and logo presentation audit

## Missing approved product photograph — incomplete

The approved data has a USB-C to USB-C Cable entry (`usb-c-cable`) with the factual description “USB-C connectors at both ends”. No separate photographed product or verified length/colour variations are available in supplied files. The asset record docs/HERO_ASSETS.md lists only a product-page reference (Amazon B0DCBPXF8Y), explicitly marked “Missing approved source photograph”.

Inspected: public/images (including all homepage and hero assets), public/assets, /workspace/attachments, and the source notes. The only dedicated uploaded artwork is the company SVG logo; the earlier text attachment contains requirements, not a cable photograph. Four 1200×1200 product WebP files exist: braided multi-connector cable, USB-C to Lightning cable, car charger and RFID card holder. There are three matching desktop/mobile hero scene pairs. None is a dedicated USB-C-to-USB-C photograph.

Required asset: an owned/reuse-approved high-resolution photograph of the actual dedicated USB-C-to-USB-C cable, clearly showing USB-C connectors at both ends, plus confirmation of any variations to publish. No Lightning photo, adapter bundle or stock substitute is used. The entry remains excluded from both grids and the product selector until this asset is supplied; no missing-photo card is published. Addition of the fifth product is **not complete**.

The cable hero keeps its approved photographs and full-width stationary-overlay treatment. Public copy now says braided/Lightning cables and its slide caption names “Braided multi-connector · USB-C to Lightning”, matching the two pictured products. The missing cable is no longer claimed in the public hero caption/category description.

## Header logo variant

The approved full SVG at public/assets/my-first-choice-logo.svg remains unchanged (SHA-256 dfb7b530a05fccf9f1b43a3c6273770ef0b66bae1f65102477bce1097bf59216). No regenerated artwork, font substitutions, recolouring or stretching were introduced.

The header uses an inline SVG presentation window (`viewBox="115 40 1940 460"`) referencing the original full SVG. This documented compact variant includes the complete approved symbol and company name, while omitting the very small descriptor/tagline rows and unnecessary outer whitespace. The approved primary artwork fits inside this window; no company lettering is clipped. This allows a larger, clearer wordmark without increasing the existing header height. It is a display variant, not a modified source asset.

The footer retains the complete original image, including both tagline lines, on the existing warm-white contrast panel. Both variants link to the homepage and have meaningful accessible names. Existing logo layout checks cover all six pages at 360, 390, 768, 820, 1024, 1366 and 1440px.
