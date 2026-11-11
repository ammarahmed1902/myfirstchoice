"use client";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useTrade } from "./trade-provider";
import { productById } from "@/lib/catalogue";
import { Photo } from "./photo";
export function Cart() {
  const { cart, ready, replace, remove } = useTrade();
  if (!ready) return <p role="status">Loading your enquiry list…</p>;
  if (!cart.length)
    return (
      <div className="empty-state">
        <h2>Your next enquiry starts here.</h2>
        <p>Add products from the catalogue or upload a quick-order list.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/shop" className="button">
            Browse the catalogue ↗
          </Link>
          <Link href="/quick-order" className="button outline">
            Quick order
          </Link>
        </div>
      </div>
    );
  return (
    <div className="cart-layout">
      <div>
        {cart.map((line, i) => {
          const p = productById(line.productId)!;
          return (
            <article
              className="cart-line"
              key={`${line.productId}:${line.sample}`}
            >
              <Link href={`/product/${p.slug}`} className="cart-photo">
                <Photo image={p.image} alt={`Representative ${p.name}`} />
              </Link>
              <div>
                <span className="sku">
                  {p.id}
                  {line.sample ? " · SAMPLE ENQUIRY" : ""}
                </span>
                <h2>
                  <Link href={`/product/${p.slug}`}>{p.name}</Link>
                </h2>
                <p>Pricing, MOQ and availability confirmed by quotation.</p>
                <label>
                  Quantity
                  <input
                    aria-label={`Quantity for ${p.name}${line.sample ? " sample" : ""}`}
                    type="number"
                    min={line.sample ? 1 : p.moq || 1}
                    max="10000"
                    value={line.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (
                        Number.isInteger(value) &&
                        value >= 1 &&
                        value <= 10000
                      )
                        replace(
                          cart.map((v, index) =>
                            index === i ? { ...v, quantity: value } : v,
                          ),
                        );
                    }}
                  />
                </label>
              </div>
              <button
                className="icon-button"
                aria-label={`Remove ${p.name}${line.sample ? " sample" : ""}`}
                onClick={() => remove(i)}
              >
                <Trash2 size={18} />
              </button>
            </article>
          );
        })}
      </div>
      <aside className="summary-card">
        <span className="eyebrow">YOUR QUOTATION REQUEST</span>
        <h2>Ready for the next step?</h2>
        <dl>
          <div>
            <dt>Product lines</dt>
            <dd>{cart.length}</dd>
          </div>
          <div>
            <dt>Units requested</dt>
            <dd>{cart.reduce((n, l) => n + l.quantity, 0)}</dd>
          </div>
          <div>
            <dt>Pricing & delivery</dt>
            <dd>To be quoted</dd>
          </div>
        </dl>
        <p>
          No payment is taken. Your request is reviewed before any order is
          agreed.
        </p>
        <Link href="/checkout" className="button">
          Continue to quote request ↗
        </Link>
        <Link href="/shop" className="underlined">
          Continue browsing
        </Link>
      </aside>
    </div>
  );
}
