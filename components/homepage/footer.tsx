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
            A considered selection of charging cables,
            <br />
            car accessories and RFID wallets for your business.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/#home">Home</Link>
          <Link href="/shop">Our Catalogue</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
        {(business.email || business.whatsapp) && (
          <div className={styles.footerContact}>
            {business.email && (
              <a href={`mailto:${business.email}`}>{business.email}</a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp enquiry ↗
              </a>
            )}
          </div>
        )}
      </div>
      <div className={styles.footerBottom}>
        <span>
          © {new Date().getFullYear()} {business.name}
        </span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Trade information</Link>
        </div>
        <span>Wholesale product enquiries</span>
      </div>
    </footer>
  );
}
