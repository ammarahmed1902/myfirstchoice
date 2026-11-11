import type { MetadataRoute } from "next";
import { products } from "@/lib/catalogue";
import { business } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/shop",
    "/shop/electronics",
    "/shop/car-accessories",
    "/about",
    "/contact",
    ...products.map((p) => `/product/${p.slug}`),
  ].map((path) => ({
    url: `${business.siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
