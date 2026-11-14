import Link from "next/link";
import { HomeLogo } from "./logo";
import { business } from "@/lib/config";
import styles from "./homepage.module.css";
export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <div>
          <HomeLogo inverse />
          <p>
            Wholesale supply, 3PL services, product sourcing
            <br /> and e-commerce management.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/shop">Our Products</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/terms">Wholesale Terms, Payments &amp; Returns</Link>
          <Link href="/privacy">Privacy contact</Link>
        </nav>
        <div className={styles.footerContact}>
          <Link href="/contact#enquiry-form">Contact Us</Link>
          <strong>{business.name}</strong>
          <span>Company number: {business.number}</span>
          <address>
            <strong>Registered office</strong>
            <br />
            {business.address}
          </address>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>
          © {new Date().getFullYear()} {business.name}
        </span>
        <span>My First Choice</span>
      </div>
    </footer>
  );
}
