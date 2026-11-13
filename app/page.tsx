import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroCarousel } from "@/components/homepage/carousel";
import { ProductShowcaseCard } from "@/components/product-showcase-card";
import { approvedProducts } from "@/lib/homepage-content";
import { Services } from "@/components/services";
import styles from "@/components/homepage/homepage.module.css";
export const metadata = {
  title: { absolute: "My First Choice | Wholesale Accessories" },
  description:
    "Explore charging cables, car accessories and RFID wallets for your wholesale enquiries.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "My First Choice · Wholesale",
    description: "Everyday accessories. Ready for your business.",
  },
};
export default function Home() {
  return (
    <div id="home" className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-heading">
        <HeroCarousel>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>MY FIRST CHOICE · WHOLESALE</span>
            <h1 id="home-heading">
              Everyday accessories.
              <br />
              <span>Ready for your business.</span>
            </h1>
            <p>
              Explore our range of Lightning and USB-C cables, car accessories
              and RFID wallets for wholesale enquiries.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop" className={styles.button}>
                View Our Products <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className={`${styles.button} ${styles.outline}`}
              >
                Wholesale Enquiry
              </Link>
            </div>
          </div>
        </HeroCarousel>
      </section>
      <section
        id="selected-products"
        className="content-section"
        aria-labelledby="selected-heading"
      >
        <div className="section-intro">
          <div>
            <span className="kicker">A SELECTION FROM OUR RANGE</span>
            <h2 id="selected-heading">Selected Products</h2>
          </div>
          <Link href="/shop" className="text-link">
            View Our Products <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="showcase-grid">
          {approvedProducts.map((product) => (
            <ProductShowcaseCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section
        className="business-editorial content-section"
        aria-labelledby="business-heading"
      >
        <span className="kicker">OUR BUSINESS</span>
        <div>
          <h2 id="business-heading">Support for your next step.</h2>
          <p className="lead">
            EBAY 1ST CHOICE LTD works across wholesale supply, third-party
            logistics (3PL), product sourcing and e-commerce platform
            management. We work with businesses to discuss their product
            requirements and the support they need for their operations.
          </p>
          <Link className="text-link" href="/about">
            About Our Business <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section
        className="content-section services-section"
        aria-labelledby="services-heading"
      >
        <div className="section-intro">
          <div>
            <span className="kicker">PRODUCTS &amp; BUSINESS SUPPORT</span>
            <h2 id="services-heading">What We Do</h2>
          </div>
        </div>
        <Services />
      </section>
      <section
        className="content-section enquiry-steps"
        aria-labelledby="how-heading"
      >
        <span className="kicker">A STRAIGHTFORWARD START</span>
        <h2 id="how-heading">How to Enquire</h2>
        <ol>
          {[
            "Explore our products and services.",
            "Share your requirements.",
            "Discuss the next steps with our team.",
          ].map((text, i) => (
            <li key={text}>
              <span>0{i + 1}</span>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="enquiry-banner">
        <div>
          <span className="kicker">LET’S TALK BUSINESS</span>
          <h2>Let’s discuss your business requirements.</h2>
          <p>
            Contact us about wholesale supply, 3PL services, product sourcing or
            e-commerce management.
          </p>
        </div>
        <Link href="/contact" className="action-button light">
          Make an Enquiry <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
