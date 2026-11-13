import { Products } from "@/components/products";
import { homeCategories } from "@/lib/homepage-content";
export const metadata = {
  title: "Our Products",
  description:
    "Explore charging cables, car accessories and RFID wallets, and enquire about the products and quantities you need.",
  alternates: { canonical: "/shop" },
};
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected = homeCategories
    .slice(1)
    .some((c) => c.href === `/shop?category=${category}`)
    ? category
    : "";
  return (
    <div className="content-section">
      <header className="page-intro">
        <span className="kicker">THE PRODUCT RANGE</span>
        <h1>Our Products</h1>
        <p>
          Explore our products and contact us with the items and quantities you
          need.
        </p>
      </header>
      <Products category={selected} />
    </div>
  );
}
