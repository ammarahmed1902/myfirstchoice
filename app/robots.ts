import type { MetadataRoute } from "next";
import { business } from "@/lib/config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: business.launchReady ? "/" : undefined,
      disallow: business.launchReady
        ? ["/api/", "/account", "/cart", "/checkout", "/auth/"]
        : ["/"],
    },
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
