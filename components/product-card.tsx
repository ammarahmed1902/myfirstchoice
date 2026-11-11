"use client";
import Link from "next/link";
import { LockKeyhole, Plus } from "lucide-react";
import { type Product, categoryName, formatPrice } from "@/lib/catalogue";
import { Photo } from "./photo";
import { useTrade } from "./trade-provider";
export function ProductCard({ product: p }: { product: Product }) {
  const { account, tiers, add } = useTrade();
  const prices = tiers
    .filter((t) => t.product_id === p.id)
    .sort((a, b) => a.min_qty - b.min_qty);
  return (
    <article className="product-card">
      <Link href={`/product/${p.slug}`} className="product-photo">
        <Photo image={p.image} alt={`Representative image for ${p.name}`} />
        <span className="photo-badge">{categoryName(p.category)}</span>
      </Link>
      <div className="product-content">
        <span className="sku">
          {p.id} · {p.verified ? "PRODUCT" : "RANGE REFERENCE"}
        </span>
        <h3>
          <Link href={`/product/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="price-label">
          {account?.status === "approved" ? (
            prices.length ? (
              new Set(prices.map((t) => t.currency)).size === 1 ? (
                `From ${formatPrice(Math.min(...prices.map((t) => t.unit_price)), prices[0].currency)} / unit`
              ) : (
                "View currency-specific trade tiers"
              )
            ) : (
              "Request your trade quotation"
            )
          ) : (
            <>
              <LockKeyhole size={13} /> Trade pricing after approval
            </>
          )}
        </p>
        <div className="product-terms">
          <span>MOQ: {p.moq ? `${p.moq} units` : "Confirm on enquiry"}</span>
          <span>Availability: enquire</span>
        </div>
        <button
          className="product-add"
          onClick={() =>
            add({ productId: p.id, quantity: p.moq || 1, sample: false })
          }
        >
          Add to enquiry <Plus size={16} />
        </button>
      </div>
    </article>
  );
}
