import Link from "next/link";
import { ProductShowcaseCard } from "@/components/product-showcase-card";
import { approvedProducts, homeCategories } from "@/lib/homepage-content";
export function Products({ category = "" }: { category?: string }) {
  const products = approvedProducts.filter(
    (p) => !category || p.category === category,
  );
  return (
    <>
      <nav className="product-filters" aria-label="Product categories">
        {homeCategories.map((c, i) => (
          <Link
            key={c.label}
            href={c.href}
            aria-current={
              (
                i === 0
                  ? !category
                  : Boolean(category) && c.href.endsWith(category)
              )
                ? "page"
                : undefined
            }
          >
            {c.label}
          </Link>
        ))}
      </nav>
      <div className="showcase-grid products-grid">
        {products.map((product) => (
          <ProductShowcaseCard key={product.id} product={product} catalogue />
        ))}
      </div>
    </>
  );
}
