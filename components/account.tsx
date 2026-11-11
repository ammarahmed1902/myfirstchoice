"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PasswordTools } from "./password-tools";
import { backendConfigured } from "@/lib/config";
import { useTrade, type Line } from "./trade-provider";
type Order = {
  id: string;
  status: string;
  created_at: string;
  lines: Line[];
  company: string;
};
export function Account() {
  const { account, refresh, replace } = useTrade();
  const [mode, setMode] = useState<"signin" | "signup">("signin"),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [orders, setOrders] = useState<Order[]>([]),
    [historyError, setHistoryError] = useState("");
  useEffect(() => {
    if (!account) {
      setOrders([]);
      return;
    }
    fetch("/api/orders", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "History unavailable");
        setOrders(d.orders);
      })
      .catch(() =>
        setHistoryError(
          "Your enquiry history could not be loaded. Please refresh to try again.",
        ),
      );
  }, [account]);
  async function auth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: f.get("email"),
          password: f.get("password"),
          mode,
        }),
      });
      const d = await r.json();
      if (!r.ok)
        throw new Error(d.error || "Could not complete authentication.");
      setMessage(d.message || "Signed in.");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      const r = await fetch("/api/signout", { method: "POST" });
      if (!r.ok) throw new Error();
      await refresh();
      setMessage("You have signed out.");
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (account)
    return (
      <div>
        <div className="account-welcome">
          <div>
            <span className="eyebrow">YOUR TRADE ACCOUNT</span>
            <h2>Good to see you.</h2>
            <p>{account.email}</p>
            <span className="status-pill">
              {account.status === "approved"
                ? "Approved wholesale buyer"
                : "Wholesale approval pending"}
            </span>
          </div>
          <button onClick={logout} disabled={busy} className="button outline">
            Sign out
          </button>
        </div>
        {account.status !== "approved" && (
          <div className="notice">
            <p>
              Trade pricing and quote submission are available after approval.
            </p>
            <Link href="/wholesale-application" className="underlined">
              Complete your application ↗
            </Link>
          </div>
        )}
        <PasswordTools signedIn />
        <div className="section-heading mt-12">
          <h2>Your quotation history.</h2>
          <Link href="/shop" className="underlined">
            Build a new enquiry ↗
          </Link>
        </div>
        {historyError && (
          <p role="alert" className="error">
            {historyError}
          </p>
        )}
        {!orders.length && !historyError && (
          <div className="empty-state">
            <p>
              No quotation requests yet. Explore the catalogue to start your
              first enquiry.
            </p>
          </div>
        )}
        {orders.map((o) => (
          <article key={o.id} className="order-card">
            <div>
              <span className="sku">{o.id}</span>
              <h3>
                {new Date(o.created_at).toLocaleDateString("en-GB")} ·{" "}
                {o.lines.length} lines
              </h3>
              <p>Status: {o.status.replaceAll("_", " ")}</p>
            </div>
            <button
              className="button outline"
              onClick={() => {
                replace(o.lines);
                setMessage(
                  "Past request copied to your enquiry list. Review quantities and current terms before resubmitting.",
                );
              }}
            >
              Reorder / repeat enquiry ↗
            </button>
          </article>
        ))}
        {message && (
          <p className="success-panel" role="status">
            {message}{" "}
            <Link href="/cart" className="underlined">
              View list
            </Link>
          </p>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
      </div>
    );
  return (
    <div className="auth-layout">
      <div>
        <span className="eyebrow">A BETTER WAY TO BUY FOR BUSINESS</span>
        <h2>
          Your wholesale
          <br />
          connection starts here.
        </h2>
        <p>
          Apply for trade access, view approved pricing and keep your quotation
          requests in one place.
        </p>
        <ul className="check-list">
          <li>Private pricing for approved accounts</li>
          <li>Your own quotation history</li>
          <li>Repeat enquiries without starting again</li>
        </ul>
      </div>
      <div className="form-panel">
        {!backendConfigured && (
          <div className="notice">
            <strong>Trade accounts are not connected yet.</strong>
            <p>
              You can explore the catalogue and prepare an enquiry list.
              Registration and sign-in will open once the trade service is
              configured.
            </p>
          </div>
        )}
        <div className="auth-tabs">
          <button
            onClick={() => setMode("signin")}
            aria-pressed={mode === "signin"}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            aria-pressed={mode === "signup"}
          >
            Create account
          </button>
        </div>
        <form onSubmit={auth}>
          <label>
            Business email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={200}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={12}
              maxLength={128}
              required
            />
          </label>
          <p className="small-text muted">
            Use at least 12 characters. New accounts require email verification
            and separate wholesale approval.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="success-panel">
              {message}
            </p>
          )}
          <button className="button" disabled={!backendConfigured || busy}>
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create trade account"
                : "Sign in"}{" "}
            ↗
          </button>
          <p className="small-text muted">
            By creating an account, you acknowledge the{" "}
            <Link href="/privacy" className="underlined">
              privacy information
            </Link>
            .
          </p>
        </form>
        <PasswordTools />
      </div>
    </div>
  );
}
