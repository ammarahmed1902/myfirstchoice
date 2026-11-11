import Link from "next/link";
import { Mark, Arrow } from "./icons";
import { business } from "@/lib/config";
export function Footer() {
  return (
    <>
      <section className="closing">
        <div>
          <span className="eyebrow">YOUR NEXT BUSINESS CONNECTION</span>
          <h2>
            Let’s talk <em>wholesale.</em>
          </h2>
        </div>
        <Link href="/contact" className="button light">
          Discuss your requirements <Arrow />
        </Link>
      </section>
      <footer>
        <div className="footer-grid">
          <div>
            <Link href="/" className="brand">
              <Mark />
              <span>
                EBAY 1ST CHOICE<small>LTD · WHOLESALE</small>
              </span>
            </Link>
            <p>
              Electronics and car accessories.
              <br />A clear starting point for your next range.
            </p>
            <span className="footer-market">
              Serving trade enquiries in the United Kingdom.
            </span>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/shop/electronics">Electronics</Link>
            <Link href="/shop/car-accessories">Car accessories</Link>
            <Link href="/quick-order">Quick order</Link>
          </div>
          <div>
            <h3>For your business</h3>
            <Link href="/wholesale-application">Wholesale application</Link>
            <Link href="/account">Account & enquiries</Link>
            <Link href="/about">About us</Link>
          </div>
          <div>
            <h3>Get in touch</h3>
            <Link href="/contact">
              Contact our team <Arrow />
            </Link>
            {business.email && (
              <a href={`mailto:${business.email}`}>{business.email}</a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp <Arrow />
              </a>
            )}
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Trade information</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {business.name}
          </span>
          <span>Wholesale quotations · No online payment</span>
          <Link href="/shop">Explore the catalogue ↑</Link>
        </div>
      </footer>
      {business.whatsapp && (
        <a
          className="whatsapp"
          href={`https://wa.me/${business.whatsapp}`}
          aria-label="Chat with our business on WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp ↗
        </a>
      )}
    </>
  );
}
