import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/homepage/product-image";
import { productEnquiryHref, type HomeProduct } from "@/lib/homepage-content";

/** One presentation of the shared product details on Home and Our Products. */
export function ProductShowcaseCard({
  product,
  catalogue = false,
}: {
  product: HomeProduct;
  catalogue?: boolean;
}) {
  const Heading = catalogue ? "h2" : "h3";
  return (
    <article className="showcase-card" id={catalogue ? product.id : undefined}>
      <div className="showcase-image">
        <ProductImage product={product} />
      </div>
      {catalogue && <span className="product-ref">Ref: {product.id}</span>}
      <Heading>{product.name}</Heading>
      <p>{product.detail}</p>
      <Link
        className="text-link"
        href={productEnquiryHref(product.id)}
        aria-label={catalogue ? undefined : `Enquire about ${product.name}`}
      >
        {catalogue ? "Enquire About This Product" : "Enquire"}{" "}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
