import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { approvedProducts } from "@/lib/homepage-content";
import { business } from "@/lib/config";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Contact Us",
  description:
    "Contact EBAY 1ST CHOICE LTD about wholesale supply, 3PL, product sourcing or e-commerce management.",
  alternates: { canonical: "/contact" },
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; reason?: string }>;
}) {
  const { product, reason } = await searchParams;
  const initialMessage =
    reason === "privacy"
      ? "Privacy request:\n"
      : reason === "order-issue"
        ? "Order issue:\nOrder or invoice reference: \nDetails: "
        : "";
  const selected = approvedProducts.some((p) => p.id === product)
    ? product
    : "";
  return (
    <section className="content-section">
      <header className="page-intro">
        <span className="kicker">LET’S TALK BUSINESS</span>
        <h1>Contact Us</h1>
        <p>Tell us about the products and business support you need.</p>
      </header>
      <div className="contact-layout">
        <aside className="contact-details">
          <h2>A conversation starts here.</h2>
          <p>
            Contact us about wholesale supply, 3PL services, product sourcing or
            e-commerce management.
          </p>
          <dl className="company-details">
            <div>
              <dt>Company</dt>
              <dd>{business.name}</dd>
            </div>
            <div>
              <dt>Enquiries</dt>
              <dd>
                <Link href="#enquiry-form">Contact Us</Link>
              </dd>
            </div>
            <div>
              <dt>Registered office</dt>
              <dd>{business.address}</dd>
            </div>
          </dl>
          <p className="small-note">
            The registered office is a company correspondence address. Visits,
            collections and returns have not been arranged through this website.
          </p>
        </aside>
        <ContactForm
          key={`${selected}:${reason || ""}`}
          product={selected}
          initialMessage={initialMessage}
        />
      </div>
    </section>
  );
}
