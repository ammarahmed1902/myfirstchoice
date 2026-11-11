import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { HeroCarousel } from "@/components/homepage/carousel";
import { ProductImage } from "@/components/homepage/product-image";
import { homeProducts } from "@/lib/homepage-content";
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
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>MY FIRST CHOICE · WHOLESALE</span>
          <h1 id="home-heading">
            Everyday accessories.
            <br />
            <span>Ready for your business.</span>
          </h1>
          <p>
            Explore charging cables, car accessories and RFID wallets for your
            wholesale enquiries.
          </p>
          <div className={styles.heroActions}>
            <Link href="/shop" className={styles.button}>
              Explore Catalogue <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className={`${styles.button} ${styles.outline}`}
            >
              Wholesale Enquiry
            </Link>
          </div>
          <div className={styles.heroNote}>
            <span aria-hidden="true" />
            <p>Explore the range. Share your requirements.</p>
          </div>
        </div>
        <HeroCarousel />
      </section>
      <section
        id="selected-products"
        className={styles.selected}
        aria-labelledby="selected-heading"
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>A SELECTION FROM OUR RANGE</span>
            <h2 id="selected-heading">
              Everyday essentials.
              <br className={styles.mobileBreak} /> Considered for your
              business.
            </h2>
          </div>
          <Link href="/shop" className={styles.textLink}>
            View Catalogue <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <p className={styles.assetNote}>
          Product photography is awaiting the supplied images. The product
          groups below are confirmed; colours, lengths and specifications are
          discussed on enquiry.
        </p>
        <div id="charging-cables" className={styles.productGrid}>
          {homeProducts.map((product, index) => (
            <article
              key={product.id}
              id={product.id}
              className={`${styles.productCard} ${index === 3 ? styles.carCard : index === 4 ? styles.walletCard : ""}`}
            >
              <div className={styles.cardPhoto}>
                <ProductImage product={product} />
                <span className={styles.productNumber} aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <div className={styles.cardDetails}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                </div>
                <Link
                  href="/contact"
                  className={styles.enquireLink}
                  aria-label={`Enquire about ${product.name}`}
                >
                  Enquire <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        id="our-business"
        className={styles.business}
        aria-labelledby="business-heading"
      >
        <div className={styles.businessImage}>
          <div className={styles.editorialTop}>
            <span>MY FIRST CHOICE</span>
            <span>THE ACCESSORY EDIT</span>
          </div>
          <div className={styles.businessComposition}>
            <ProductImage product={homeProducts[0]} />
            <ProductImage product={homeProducts[4]} />
          </div>
          <p>Own-product composition · photography pending</p>
        </div>
        <div className={styles.businessCopy}>
          <span className={styles.eyebrow}>OUR BUSINESS</span>
          <h2 id="business-heading">
            Accessories for
            <br />
            your business.
          </h2>
          <p>
            My First Choice offers a selection of charging cables, car
            accessories and RFID wallets for wholesale enquiries. Explore our
            products and contact us to discuss the items and quantities you
            need.
          </p>
          <Link href="/about" className={styles.textLink}>
            About My First Choice <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className={styles.how} aria-labelledby="how-heading">
        <div className={styles.howHeading}>
          <span className={styles.eyebrow}>A STRAIGHTFORWARD START</span>
          <h2 id="how-heading">How to enquire.</h2>
        </div>
        <ol>
          {[
            ["Explore the range", "Find the products you are interested in."],
            [
              "Share your requirements",
              "Tell us the items and quantities you need.",
            ],
            [
              "Discuss your enquiry",
              "Contact us to discuss your requirements.",
            ],
          ].map(([title, copy], index) => (
            <li key={title}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              {index < 2 && <ArrowRight size={17} aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>
      <section
        id="wholesale-enquiry"
        className={styles.invitation}
        aria-labelledby="enquiry-heading"
      >
        <div>
          <span className={styles.eyebrow}>LET’S TALK WHOLESALE</span>
          <h2 id="enquiry-heading">
            Let’s discuss your next
            <br />
            wholesale enquiry.
          </h2>
          <p>
            Tell us which products you need and the quantities you have in mind.
          </p>
        </div>
        <Link href="/contact" className={`${styles.button} ${styles.light}`}>
          Make an Enquiry <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
