import type { Metadata } from "next";
import localFont from "next/font/local";
const headingFont = localFont({
  src: "../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2",
  weight: "500",
  display: "swap",
  variable: "--font-heading",
  adjustFontFallback: "Arial",
});
import "./globals.css";
import { SiteFrame } from "@/components/site-frame";

import { business } from "@/lib/config";
export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "EBAY 1ST CHOICE LTD | Wholesale & Business Services",
    template: "%s | EBAY 1ST CHOICE LTD",
  },
  description:
    "Wholesale supply, 3PL services, product sourcing and e-commerce management. Contact EBAY 1ST CHOICE LTD to discuss your requirements.",
  robots: business.launchReady
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: business.name,
    title: "Your next wholesale connection",
    description: "Wholesale supply and business services.",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={headingFont.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
