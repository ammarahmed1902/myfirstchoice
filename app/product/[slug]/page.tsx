import Link from "next/link";
import { notFound } from "next/navigation";
import { products, categoryName } from "@/lib/catalogue";
import { Photo } from "@/components/photo";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import { business } from "@/lib/config";
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  return {
    title: p?.name || "Product not found",
    description: p?.description,
    alternates: { canonical: `/product/${slug}` },
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <section className="section product-detail">
        <div className="breadcrumbs">
          <Link href="/shop">Catalogue</Link>
          <span>/</span>
          <Link href={`/shop/${p.category}`}>{categoryName(p.category)}</Link>
          <span>/</span>
          <span>{p.id}</span>
        </div>
        <div className="product-detail-grid">
          <div>
            <div className="detail-photo">
              <Photo
                image={p.image}
                alt={`Representative photograph for ${p.name}`}
                priority
                sizes="(max-width:760px) 90vw, 45vw"
              />
            </div>
            <p className="image-caption">
              Representative category photography. Exact model and
              specifications to be agreed.
            </p>
          </div>
          <div>
            <span className="eyebrow">
              {p.id} · {categoryName(p.category)}
            </span>
            <h1>{p.name}</h1>
            <p className="description">{p.description}</p>
            <ProductPurchase product={p} />
          </div>
        </div>
        <section className="detail-information">
          <h2>Know what you’re enquiring about.</h2>
          <p>
            This is an illustrative product range, not a confirmed stock item.
            Please include your preferred specification, compatibility,
            packaging and quantity in your enquiry. Sample availability, MOQ,
            pricing and delivery are confirmed in your quotation.
          </p>
        </section>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <h2>Continue exploring.</h2>
          <Link className="underlined" href={`/shop/${p.category}`}>
            View the category ↗
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((v) => v.category === p.category && v.id !== p.id)
            .map((v) => (
              <ProductCard product={v} key={v.id} />
            ))}
        </div>
      </section>
      {p.verified && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: p.name,
              sku: p.id,
              description: p.description,
              url: `${business.siteUrl}/product/${p.slug}`,
              image: `${business.siteUrl}/images/${p.image}.svg`,
            }),
          }}
        />
      )}
    </>
  );
}
