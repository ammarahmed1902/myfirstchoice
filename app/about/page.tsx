import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Services } from "@/components/services";
import { business } from "@/lib/config";
export const metadata = {
  title: "About Us",
  description:
    "Learn about EBAY 1ST CHOICE LTD, our director and our wholesale supply and business services.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <>
      <section className="content-section about-intro">
        <header className="page-intro">
          <span className="kicker">OUR BUSINESS</span>
          <h1>About Us</h1>
        </header>
        <div className="editorial-copy">
          <p className="lead">
            EBAY 1ST CHOICE LTD is a UK company providing wholesale supply,
            third-party logistics (3PL), product sourcing and e-commerce
            management services.
          </p>
          <p>
            We work with a variety of products and support businesses with their
            sourcing and operational requirements. Customers can contact us to
            discuss wholesale quantities, logistics needs or support with
            managing their e-commerce platforms.
          </p>
          <p>
            Our approach starts with understanding your requirements and
            discussing the products and services relevant to your business.
          </p>
        </div>
      </section>
      <section className="content-section services-section">
        <span className="kicker">WHAT WE DO</span>
        <h2>Our Services</h2>
        <Services />
      </section>
      <section className="content-section company-editorial">
        <div>
          <span className="kicker">PEOPLE &amp; COMPANY</span>
          <h2>Our Director</h2>
          <p>Mohammad Ummar Khan is the director of EBAY 1ST CHOICE LTD.</p>
        </div>
        <div>
          <h2>Company Information</h2>
          <dl className="company-details">
            <div>
              <dt>Registered company name</dt>
              <dd>{business.name}</dd>
            </div>
            <div>
              <dt>Company number</dt>
              <dd>{business.number}</dd>
            </div>
            <div>
              <dt>Registered office</dt>
              <dd>{business.address}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="enquiry-banner">
        <div>
          <h2>Discuss Your Requirements</h2>
          <p>
            Contact us to discuss wholesale supply or the business services you
            need.
          </p>
        </div>
        <Link className="action-button light" href="/contact">
          Contact Us <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
