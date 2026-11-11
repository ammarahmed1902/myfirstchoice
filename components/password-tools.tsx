"use client";
import { useState } from "react";
import { backendConfigured } from "@/lib/config";
export function PasswordTools({ signedIn = false }: { signedIn?: boolean }) {
  const [open, setOpen] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      const response = await fetch(
        signedIn ? "/api/password" : "/api/password-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            signedIn
              ? { password: f.get("password") }
              : { email: f.get("email") },
          ),
        },
      );
      const data = await response.json();
      setMessage(data.message || data.error || "Please try again.");
    } catch {
      setMessage("The account service is unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="password-tools">
      <button
        type="button"
        className="text-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {signedIn ? "Set a new password" : "Forgot your password?"}
      </button>
      {open && (
        <form onSubmit={submit}>
          {signedIn ? (
            <label>
              New password
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
              />
            </label>
          ) : (
            <label>
              Your account email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={200}
              />
            </label>
          )}
          <button
            className="button outline"
            disabled={!backendConfigured || busy}
          >
            {busy
              ? "Please wait…"
              : signedIn
                ? "Update password"
                : "Send reset email"}
          </button>
          {message && (
            <p role="status" className="small-text mt-4">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
