"use client";
import Link from "next/link";
import { useState } from "react";
import { backendConfigured } from "@/lib/config";
import { useTrade } from "./trade-provider";
export function BusinessForm({ kind }: { kind: "application" | "enquiry" }) {
  const { account } = useTrade();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  const application = kind === "application";
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch(
        application ? "/api/applications" : "/api/enquiries",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(f)),
        },
      );
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Your request could not be saved.");
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="success-panel" role="status">
        <h2>
          {application
            ? "Your application is saved."
            : "Your enquiry is saved."}
        </h2>
        <p>
          {application
            ? "Your business details have been submitted for wholesale review. Your account is not approved until the team changes its status."
            : "Your message is saved for team review. No email delivery or response time is promised."}
        </p>
        <Link className="underlined" href="/account">
          Return to your account ↗
        </Link>
      </div>
    );
  return (
    <div className="form-panel">
      {!backendConfigured ? (
        <div className="notice">
          <strong>
            {application ? "Wholesale applications" : "Enquiry submissions"} are
            not connected yet.
          </strong>
          <p>
            Browse our ranges and prepare an enquiry list while account services
            are being connected.
          </p>
        </div>
      ) : !account ? (
        <div className="notice">
          <p>
            Sign in with your verified email to submit{" "}
            {application ? "your application" : "an enquiry"}.
          </p>
          <Link href="/account" className="underlined">
            Sign in / create an account ↗
          </Link>
        </div>
      ) : null}
      <form onSubmit={submit}>
        <div className="form-row">
          <label>
            Contact name
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
            />
          </label>
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
        </div>
        {application ? (
          <>
            <div className="form-row">
              <label>
                Phone <span>(optional)</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={50}
                />
              </label>
              <label>
                Website <span>(optional)</span>
                <input
                  name="website"
                  type="url"
                  maxLength={200}
                  placeholder="https://"
                />
              </label>
            </div>
            <label>
              Business type
              <select name="businessType" required>
                <option>Retailer</option>
                <option>Reseller</option>
                <option>Distributor</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Your products and sourcing requirements
              <textarea
                name="requirements"
                rows={4}
                required
                minLength={10}
                maxLength={3000}
              />
            </label>
          </>
        ) : (
          <label>
            How can we help?
            <textarea
              name="message"
              rows={5}
              required
              minLength={10}
              maxLength={4000}
            />
          </label>
        )}
        <label className="check">
          <input type="checkbox" required />
          <span>
            I have read the{" "}
            <Link href="/privacy" className="underlined">
              Privacy Information
            </Link>{" "}
            and understand that my business details will be used to handle this
            request.
          </span>
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button
          className="button"
          disabled={busy || !backendConfigured || !account}
        >
          {busy
            ? "Submitting…"
            : application
              ? "Submit wholesale application"
              : "Send business enquiry"}{" "}
          ↗
        </button>
      </form>
    </div>
  );
}
