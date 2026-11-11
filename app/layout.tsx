import type { Metadata } from "next";
import localFont from "next/font/local";
const headingFont = localFont({
  src: "../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2",
  weight: "500",
  display: "swap",
  variable: "--font-heading",
  adjustFontFallback: "Arial",
});
const bodyFont = localFont({
  src: "../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-body",
  adjustFontFallback: "Arial",
});
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TradeProvider } from "@/components/trade-provider";
import { business } from "@/lib/config";
export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "EBAY 1ST CHOICE LTD | UK Electronics & Car Accessories Wholesale",
    template: "%s | EBAY 1ST CHOICE LTD",
  },
  description:
    "Explore wholesale electronics and car accessories for UK retailers and resellers. Apply for a trade account and request a tailored quotation.",
  robots: business.launchReady
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: business.name,
    title: "Your next wholesale connection",
    description: "Electronics and car accessories for UK trade buyers.",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <TradeProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </TradeProvider>
      </body>
    </html>
  );
}
