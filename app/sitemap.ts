import type { MetadataRoute } from "next";
import { business } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/shop", "/about", "/contact", "/terms"].map((path) => ({
    url: `${business.siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
