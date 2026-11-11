"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { type Product, formatPrice } from "@/lib/catalogue";
import { useTrade } from "./trade-provider";
export function ProductPurchase({ product: p }: { product: Product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(p.moq || 1),
    [error, setError] = useState("");
  const { account, tiers, add } = useTrade();
  const rows = tiers
    .filter((t) => t.product_id === p.id)
    .sort((a, b) => a.min_qty - b.min_qty);
  function addItem(sample = false) {
    if (
      !sample &&
      (!Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10000 ||
        (p.moq && quantity < p.moq))
    ) {
      setError(`Enter a whole quantity from ${p.moq || 1} to 10,000.`);
      return false;
    }
    setError("");
    return add({ productId: p.id, quantity: sample ? 1 : quantity, sample });
  }
  return (
    <>
      <div className="pricing-box">
        <div className="eyebrow">
          <LockKeyhole size={14} /> WHOLESALE PRICING
        </div>
        {account?.status === "approved" ? (
          <>
            <h3>Your trade pricing</h3>
            {rows.length ? (
              <table>
                <caption className="sr-only">
                  Quantity price tiers for {p.name}
                </caption>
                <thead>
                  <tr>
                    <th>Quantity from</th>
                    <th>Price per unit</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr key={t.min_qty}>
                      <td>{t.min_qty} units</td>
                      <td>{formatPrice(t.unit_price, t.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>
                Your account is approved. Request a quote for this range; no
                confirmed price tiers have been published.
              </p>
            )}
          </>
        ) : (
          <>
            <h3>Made for your business.</h3>
            <p>
              Trade prices are available only to signed-in, approved wholesale
              buyers.
            </p>
            <Link href="/wholesale-application" className="underlined">
              Apply for a wholesale account ↗
            </Link>
          </>
        )}
      </div>
      <dl className="spec-list">
        <div>
          <dt>Minimum order</dt>
          <dd>{p.moq ? `${p.moq} units` : "Confirmed on quotation"}</dd>
        </div>
        <div>
          <dt>Availability</dt>
          <dd>Confirm with our team</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>UK · method and cost quoted individually</dd>
        </div>
      </dl>
      <label className="quantity-label">
        Quantity required
        <input
          type="number"
          min={p.moq || 1}
          max="10000"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="purchase-actions">
        <button className="button" onClick={() => addItem()}>
          Add to enquiry list <span>＋</span>
        </button>
        <button
          className="button outline"
          onClick={() => {
            if (addItem()) router.push("/cart");
          }}
        >
          Request a quote ↗
        </button>
      </div>
      {p.sample && (
        <button className="text-button" onClick={() => addItem(true)}>
          Request a sample · availability and cost to confirm
        </button>
      )}
    </>
  );
}
