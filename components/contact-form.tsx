"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contactSchema, enquiryTypes } from "@/lib/contact-schema";
import { approvedProducts } from "@/lib/homepage-content";
type Errors = Record<string, string[] | undefined>;
export function ContactForm({
  product = "",
  configured,
}: {
  product?: string;
  configured: boolean;
}) {
  const [type, setType] = useState(
    product ? "Wholesale Products" : "General Enquiry",
  );
  const [busy, setBusy] = useState(false),
    [accepted, setAccepted] = useState(false),
    [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const lock = useRef(false),
    form = useRef<HTMLFormElement>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lock.current) return;
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      setErrors(fields);
      setNotice("Please check the highlighted fields.");
      const first = Object.keys(fields)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    lock.current = true;
    setBusy(true);
    setNotice("");
    try {
      const result = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await result.json();
      if (!result.ok || data.accepted !== true) {
        setErrors(data.fields || {});
        setNotice(
          data.error ||
            "Your enquiry could not be sent. Your text has been kept. Please email us directly.",
        );
      } else {
        setAccepted(true);
        setNotice(data.message);
      }
    } catch {
      setNotice(
        "We could not confirm provider acceptance. Your text has been kept. Please try again later or email us directly.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function error(name: string) {
    return errors[name]?.length ? (
      <span className="field-error" id={`error-${name}`}>
        {errors[name]![0]}
      </span>
    ) : null;
  }
  const a = (name: string) => ({
    "aria-invalid": !!errors[name]?.length,
    "aria-describedby": errors[name]?.length ? `error-${name}` : undefined,
  });
  return (
    <form
      className="enquiry-form"
      ref={form}
      onSubmit={submit}
      noValidate
      aria-labelledby="form-heading"
    >
      <h2 id="form-heading">Make an Enquiry</h2>
      <p>Fields marked * are required.</p>
      {!configured && (
        <div className="form-note">
          Online enquiry delivery is not available yet. You can email{" "}
          <a href="mailto:ebayecommerce1947@gmail.com">
            ebayecommerce1947@gmail.com
          </a>{" "}
          directly.
        </div>
      )}
      <fieldset disabled={busy || accepted}>
        <div className="field-pair">
          <label>
            Full name *
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              {...a("name")}
            />
            {error("name")}
          </label>
          <label>
            Email address *
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              {...a("email")}
            />
            {error("email")}
          </label>
        </div>
        <div className="field-pair">
          <label>
            Company name <span>(optional)</span>
            <input
              name="company"
              autoComplete="organization"
              maxLength={160}
              {...a("company")}
            />
            {error("company")}
          </label>
          <label>
            Phone number <span>(optional)</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={50}
              {...a("phone")}
            />
            {error("phone")}
          </label>
        </div>
        <label>
          Enquiry type *
          <select
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            {...a("type")}
          >
            {enquiryTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {error("type")}
        </label>
        {type === "Wholesale Products" && (
          <div className="field-pair">
            <label>
              Product of interest <span>(optional)</span>
              <select name="product" defaultValue={product} {...a("product")}>
                <option value="">Choose a product</option>
                {approvedProducts.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {error("product")}
            </label>
            <label>
              Quantity required <span>(optional)</span>
              <input
                name="quantity"
                inputMode="numeric"
                pattern="[1-9][0-9]*"
                maxLength={9}
                {...a("quantity")}
              />
              {error("quantity")}
            </label>
          </div>
        )}
        <label>
          Message *
          <textarea
            name="message"
            rows={6}
            required
            minLength={10}
            maxLength={4000}
            {...a("message")}
          />
          {error("message")}
        </label>
        <div className="form-trap" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="privacy-note">
          We use these details to respond to your enquiry. No marketing
          permission is requested. See{" "}
          <Link href="/privacy">website privacy information and contact</Link>.
        </p>
        <button
          type="submit"
          className="action-button"
          disabled={!configured || busy || accepted}
        >
          {busy
            ? "Sending…"
            : accepted
              ? "Accepted by email provider"
              : "Send Enquiry"}
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>
      </fieldset>
      <div
        role={Object.keys(errors).length ? "alert" : "status"}
        aria-live="polite"
        className={notice ? "submission-notice" : undefined}
      >
        {notice}
      </div>
      {accepted && (
        <button
          type="button"
          className="text-link"
          onClick={() => {
            setAccepted(false);
            setNotice("");
          }}
        >
          Write another enquiry
        </button>
      )}
    </form>
  );
}
