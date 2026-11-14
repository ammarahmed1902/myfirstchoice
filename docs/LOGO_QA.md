# Supplied logo replacement

The original uploaded My_First_Choice_Logo.svg is stored unchanged at public/assets/my-first-choice-logo.svg and used by the shared HomeLogo component in the header and footer. The legacy header/footer components also reference HomeLogo; the old generated monogram and separate wordmark markup were removed.

Original and stored asset SHA-256: dfb7b530a05fccf9f1b43a3c6273770ef0b66bae1f65102477bce1097bf59216.

The SVG contains paths only, without external references. No colours, paths, text, transparency or intrinsic proportions were changed. It is served as SVG without raster conversion. CSS uses width with automatic height and no colour filters or clipping. Original intrinsic dimensions: 2149 × 732.

The dark footer uses a small warm-white background panel behind this same transparent asset to preserve readability without creating a recoloured variant. The existing legal company information remains separate from the logo. Other site styles and content were not changed.

Validation: production build and TypeScript passed; all 72 browser tests passed. Logo-specific checks cover both logo instances on all six pages at 360, 390, 768, 820, 1024, 1280 and 1440px. Checks include the shared asset path, successful image loading, original aspect ratio, homepage links, alt text, no duplicated wordmark text, footer contrast surface, no overflow and compact header height. The existing suite also checks page images, responsive layouts, keyboard navigation, accessibility and form behaviour.

Header height stays within 72px on mobile, 77px on tablet and 88px on desktop. Screenshots were visually inspected for header/footer alignment and legibility.

| Viewport | Header | Footer |
| --- | --- | --- |
| Mobile, 390px | [Header](qa/new-logo-header-390.png) | [Footer](qa/new-logo-footer-390.png) |
| Tablet, 820px | [Header](qa/new-logo-header-820.png) | [Footer](qa/new-logo-footer-820.png) |
| Desktop, 1440px | [Header](qa/new-logo-header-1440.png) | [Footer](qa/new-logo-footer-1440.png) |

The working changes have not been pushed or deployed in this task. Tests use Linux Chromium; no physical-device or Safari/Firefox verification is claimed.
