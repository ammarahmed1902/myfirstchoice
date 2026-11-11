"use client";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, categories, type Category } from "@/lib/catalogue";
import { ProductCard } from "./product-card";
import { useTrade } from "./trade-provider";
export function Catalogue({
  initialCategory,
  initialQuery = "",
}: {
  initialCategory?: Category;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery),
    [category, setCategory] = useState(initialCategory || ""),
    [moq, setMoq] = useState(""),
    [availability, setAvailability] = useState(""),
    [maxPrice, setMaxPrice] = useState("");
  const { account, tiers } = useTrade();
  const shown = products.filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.name} ${p.id} ${p.type}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!moq || (p.moq !== null && p.moq <= Number(moq))) &&
      (!availability || p.availability === availability) &&
      (!maxPrice ||
        tiers.some(
          (t) =>
            t.product_id === p.id &&
            t.currency === "GBP" &&
            t.unit_price <= Number(maxPrice),
        )),
  );
  return (
    <div className="catalogue-layout">
      <aside className="filters">
        <h2>
          <SlidersHorizontal size={17} /> Refine your range
        </h2>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option value={c.slug} key={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Maximum MOQ
          <select value={moq} onChange={(e) => setMoq(e.target.value)}>
            <option value="">Any / enquire</option>
            <option value="10">10 units</option>
            <option value="50">50 units</option>
            <option value="100">100 units</option>
          </select>
        </label>
        <label>
          Availability
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">Any status</option>
            <option value="enquire">Confirm on enquiry</option>
            <option value="available">Confirmed available</option>
          </select>
        </label>
        <label>
          Maximum unit price (GBP)
          <input
            type="number"
            min="0"
            value={maxPrice}
            disabled={account?.status !== "approved"}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={
              account?.status === "approved"
                ? "Enter amount"
                : "Approved account required"
            }
          />
        </label>
        <p className="muted small-text">
          Unconfirmed MOQs and availability are never treated as confirmed
          stock. The price filter applies to GBP trade prices only.
        </p>
        <button
          className="text-button"
          onClick={() => {
            setQuery("");
            setCategory("");
            setMoq("");
            setAvailability("");
            setMaxPrice("");
          }}
        >
          Reset filters
        </button>
      </aside>
      <div>
        <div className="catalogue-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or reference codes"
              aria-label="Search catalogue"
            />
          </label>
          <span role="status">{shown.length} ranges</span>
        </div>
        <div className="catalogue-disclosure">
          Representative ranges and photography. Products, MOQ, pricing and
          stock are confirmed by quotation.
        </div>
        <div className="product-grid">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!shown.length && (
          <div className="empty-state">
            <h2>No matching ranges</h2>
            <p>
              Try a broader search, reset your filters or send us your
              requirements.
            </p>
            <button
              className="button"
              onClick={() => {
                setQuery("");
                setCategory("");
                setMoq("");
                setAvailability("");
                setMaxPrice("");
              }}
            >
              Show all ranges
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
