import { redirect, notFound } from "next/navigation";
import { approvedProducts, productEnquiryHref } from "@/lib/homepage-content";
const previous = [
  "wireless-audio",
  "car-charging",
  "over-ear-audio",
  "phone-mounts",
  "phone-accessories",
  "dash-cameras",
  "car-essentials",
  "vehicle-accessories",
  "mobile-accessories",
  "automotive-essentials",
];
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (approvedProducts.some((p) => p.id === slug))
    redirect(productEnquiryHref(slug));
  if (previous.includes(slug)) redirect("/shop");
  notFound();
}
