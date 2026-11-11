"use client";
import Link from "next/link";
import { useState } from "react";
import Papa from "papaparse";
import { Upload, Plus } from "lucide-react";
import { useTrade, type Line } from "./trade-provider";
import { productById } from "@/lib/catalogue";
import { lineSchema, mergeLines } from "@/lib/validation";
export function QuickOrder() {
  const { cart, replace } = useTrade();
  const [rows, setRows] = useState([{ sku: "", quantity: "1" }]),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  function addLines(lines: Line[]) {
    replace(mergeLines([...cart, ...lines]));
    setMessage(
      `${lines.length} valid ${lines.length === 1 ? "line added" : "lines added"} to your enquiry list.`,
    );
    setError("");
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      addLines(
        rows.map((r, i) => {
          const p = productById(r.sku.trim().toUpperCase());
          if (!p)
            throw new Error(`Row ${i + 1}: unknown SKU or range reference.`);
          return lineSchema.parse({
            productId: p.id,
            quantity: Number(r.quantity),
            sample: false,
          });
        }),
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Check your references and quantities.",
      );
    }
  }
  async function upload(file?: File) {
    setError("");
    setMessage("");
    if (!file) return;
    if (file.size > 100000) {
      setError("CSV files must be 100 KB or smaller.");
      return;
    }
    try {
      const text = await file.text();
      const result = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (h) =>
          h
            .replace(/^\uFEFF/, "")
            .trim()
            .toLowerCase(),
      });
      if (result.errors.length)
        throw new Error(`CSV could not be read: ${result.errors[0].message}`);
      if (
        !result.meta.fields?.includes("sku") ||
        !result.meta.fields?.includes("quantity")
      )
        throw new Error("CSV headers must include sku and quantity.");
      if (result.data.length < 1 || result.data.length > 100)
        throw new Error("Upload between 1 and 100 product rows.");
      const lines = result.data.map((r, i) => {
        const id = (r.sku || "").trim().toUpperCase();
        if (!productById(id))
          throw new Error(
            `CSV row ${i + 2}: unknown reference ${id || "(empty)"}.`,
          );
        const parsed = lineSchema.safeParse({
          productId: id,
          quantity: Number(r.quantity),
          sample: false,
        });
        if (!parsed.success)
          throw new Error(
            `CSV row ${i + 2}: quantity must be a whole number from 1 to 10,000 and meet any published MOQ.`,
          );
        return parsed.data;
      });
      addLines(lines);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not import this file.");
    }
  }
  return (
    <div className="quick-layout">
      <form className="form-panel" onSubmit={submit}>
        <h2>Already know your references?</h2>
        <p className="muted">
          Add your SKU or range reference and required quantity. Duplicate
          references are combined.
        </p>
        <div className="quick-head">
          <span>SKU / reference</span>
          <span>Quantity</span>
        </div>
        {rows.map((row, i) => (
          <div className="quick-row" key={i}>
            <input
              aria-label={`SKU row ${i + 1}`}
              required
              maxLength={30}
              value={row.sku}
              placeholder="e.g. EL-001"
              onChange={(e) =>
                setRows(
                  rows.map((r, n) =>
                    n === i ? { ...r, sku: e.target.value } : r,
                  ),
                )
              }
            />
            <input
              aria-label={`Quantity row ${i + 1}`}
              required
              type="number"
              min="1"
              max="10000"
              step="1"
              value={row.quantity}
              onChange={(e) =>
                setRows(
                  rows.map((r, n) =>
                    n === i ? { ...r, quantity: e.target.value } : r,
                  ),
                )
              }
            />
            <button
              type="button"
              className="icon-button"
              aria-label={`Remove row ${i + 1}`}
              disabled={rows.length === 1}
              onClick={() => setRows(rows.filter((_, n) => n !== i))}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-button"
          disabled={rows.length >= 100}
          onClick={() => setRows([...rows, { sku: "", quantity: "1" }])}
        >
          <Plus size={15} /> Add another row
        </button>
        <button className="button mt-6">Add lines to enquiry ↗</button>
      </form>
      <aside className="summary-card">
        <Upload size={27} />
        <h2>Bring your list.</h2>
        <p>
          Upload a CSV with <code>sku</code> and <code>quantity</code> columns.
          Up to 100 rows, maximum 100 KB.
        </p>
        <label>
          Choose CSV file
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              void upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <a className="underlined" href="/quick-order-template.csv" download>
          Download CSV template
        </a>
        <p>
          Unknown references or invalid quantities stop the entire import.
          Nothing is silently skipped.
        </p>
      </aside>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="success-panel" role="status">
          {message}{" "}
          <Link className="underlined" href="/cart">
            Review your list ↗
          </Link>
        </div>
      )}
    </div>
  );
}
