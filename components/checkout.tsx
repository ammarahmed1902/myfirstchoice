"use client";
import Link from "next/link";
import { useState } from "react";
import { useTrade } from "./trade-provider";
import { backendConfigured } from "@/lib/config";
import { productById } from "@/lib/catalogue";
export function Checkout() {
  const { cart, ready, account, clear } = useTrade();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  if (reference)
    return (
      <div className="success-panel">
        <span className="eyebrow">REQUEST RECEIVED</span>
        <h2>Your quotation request is saved.</h2>
        <p>
          Reference: <strong>{reference}</strong>
        </p>
        <p>
          This is a request for quotation, not an accepted order or payment
          confirmation. View its status in your account.
        </p>
        <Link className="button" href="/account">
          View enquiry history
        </Link>
      </div>
    );
  if (!ready) return <p role="status">Loading your list…</p>;
  if (!cart.length)
    return (
      <div className="empty-state">
        <h2>Add your products first.</h2>
        <Link href="/shop" className="button">
          Browse the catalogue
        </Link>
      </div>
    );
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: cart,
          company: f.get("company"),
          destination: f.get("destination"),
          notes: f.get("notes"),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Your request could not be saved.");
      setReference(result.id);
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="cart-layout">
      <div>
        {!backendConfigured && (
          <div className="notice">
            <strong>Quote submission is not connected yet.</strong>
            <p>
              Your enquiry list stays on this device. Account approval and quote
              submission become available when the trade service is connected.
            </p>
          </div>
        )}
        {backendConfigured && !account && (
          <div className="notice">
            <p>Please sign in before submitting your request.</p>
            <Link href="/account" className="underlined">
              Sign in or create an account ↗
            </Link>
          </div>
        )}
        {account && account.status !== "approved" && (
          <div className="notice">
            <p>
              Your wholesale account must be approved before you submit a trade
              quote request.
            </p>
            <Link href="/wholesale-application" className="underlined">
              View application steps ↗
            </Link>
          </div>
        )}
        <form onSubmit={submit} className="form-panel">
          <h2>Your business details</h2>
          <label>
            Company name
            <input
              name="company"
              autoComplete="organization"
              defaultValue={account?.company || ""}
              required
              minLength={2}
              maxLength={160}
            />
          </label>
          <label>
            UK delivery address and postcode
            <textarea
              name="destination"
              autoComplete="street-address"
              required
              minLength={3}
              maxLength={500}
              rows={3}
            />
          </label>
          <label>
            Specifications, sample requirements or delivery notes
            <textarea name="notes" maxLength={4000} rows={4} />
          </label>
          <label className="check">
            <input type="checkbox" required />
            <span>
              I understand this is a quotation request. Pricing, MOQ,
              availability and delivery require confirmation.
            </span>
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button"
            disabled={
              busy || !backendConfigured || account?.status !== "approved"
            }
          >
            {busy ? "Submitting…" : "Submit quotation request"} ↗
          </button>
        </form>
      </div>
      <aside className="summary-card">
        <span className="eyebrow">REQUEST SUMMARY</span>
        <h2>
          {cart.length} product {cart.length === 1 ? "line" : "lines"}
        </h2>
        {cart.map((l) => (
          <div className="summary-line" key={`${l.productId}:${l.sample}`}>
            <span>
              {productById(l.productId)?.name}
              {l.sample ? " (sample)" : ""}
            </span>
            <b>× {l.quantity}</b>
          </div>
        ))}
        <p>
          No online payment. Shipping costs, timing and trade terms are agreed
          by quotation.
        </p>
        <Link href="/cart" className="underlined">
          Edit your list
        </Link>
      </aside>
    </div>
  );
}
