import type { NextConfig } from "next";
const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async redirects() {
    const previousProducts = [
      "wireless-audio",
      "car-charging",
      "over-ear-audio",
      "phone-mounts",
      "mobile-accessories",
      "automotive-essentials",
    ];
    return [
      ...[
        "cart",
        "checkout",
        "account",
        "quick-order",
        "wholesale-application",
      ].map((path) => ({
        source: `/${path}`,
        destination: "/contact",
        permanent: false,
      })),
      ...previousProducts.map((slug) => ({
        source: `/product/${slug}`,
        destination: "/shop",
        permanent: false,
      })),
      ...[
        { old: "electronics", category: "charging-cables" },
        { old: "charging-cables", category: "charging-cables" },
        { old: "car-accessories", category: "car-accessories" },
        { old: "rfid-wallets", category: "rfid-wallets" },
      ].map(({ old, category }) => ({
        source: `/shop/${old}`,
        destination: `/shop?category=${category}`,
        permanent: false,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default config;
