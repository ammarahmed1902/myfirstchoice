import Link from "next/link";
import { BusinessForm } from "@/components/business-form";
import { business } from "@/lib/config";
export const metadata = {
  title: "Contact & wholesale enquiries",
  alternates: { canonical: "/contact" },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">LET'S TALK WHOLESALE</span>
        <h1>What’s next for your business?</h1>
        <p>Tell us about the electronics or car accessories you need.</p>
      </div>
      <section className="section pt-0 two-column">
        <div>
          <h2>
            A good conversation
            <br />
            starts with the details.
          </h2>
          <p>
            Include product references, specifications, quantities and your UK
            delivery postcode. The more detail you share, the clearer the
            starting point for your quotation.
          </p>
          <dl className="spec-list">
            <div>
              <dt>Business</dt>
              <dd>{business.name}</dd>
            </div>
            <div>
              <dt>Trade market</dt>
              <dd>United Kingdom</dd>
            </div>
            <div>
              <dt>Product areas</dt>
              <dd>Electronics & car accessories</dd>
            </div>
            {business.email && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </dd>
              </div>
            )}
            {business.whatsapp && (
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a
                    href={`https://wa.me/${business.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat with our business ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {!business.email && !business.whatsapp && (
            <div className="notice">
              Direct contact details have not been published yet. The catalogue
              and enquiry list are available to explore.
            </div>
          )}
          <Link className="underlined" href="/quick-order">
            Already have a product list? Use quick order ↗
          </Link>
        </div>
        <BusinessForm kind="enquiry" />
      </section>
    </>
  );
}
