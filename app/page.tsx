import Link from "next/link";
import {
  PackageCheck,
  Layers3,
  MessagesSquare,
  Truck,
  ArrowRight,
} from "lucide-react";
import { Photo } from "@/components/photo";
import { Arrow } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { products, categories } from "@/lib/catalogue";
import { business } from "@/lib/config";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: business.name,
            url: business.siteUrl,
            areaServed: { "@type": "Country", name: "United Kingdom" },
          }),
        }}
      />
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <i /> YOUR WHOLESALE CONNECTION
          </span>
          <h1>
            Good products.
            <br />
            Better <em>business.</em>
          </h1>
          <p>
            Electronics and car accessories for UK retailers and resellers.
            Explore your next range. Build your next opportunity.
          </p>
          <div className="hero-actions">
            <Link href="/wholesale-application" className="button light">
              Become a wholesale buyer <Arrow />
            </Link>
            <Link href="/shop" className="hero-link">
              Explore the catalogue <Arrow />
            </Link>
          </div>
          <div className="hero-foot">
            <span>01 / ELECTRONICS</span>
            <span>02 / CAR ACCESSORIES</span>
          </div>
        </div>
        <div className="hero-photo">
          <Photo
            image="hero"
            alt="Representative automotive range photography"
            priority
            sizes="(max-width: 760px) 100vw, 50vw"
          />
          <div className="hero-overlay" />
          <span className="hero-photo-label">FOR LIFE ON THE MOVE</span>
          <div className="hero-photo-copy">
            <span>THE AUTOMOTIVE COLLECTION</span>
            <h2>
              Drive your
              <br />
              next opportunity.
            </h2>
            <Link
              href="/shop/car-accessories"
              aria-label="Explore car accessories"
            >
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="trust-strip" aria-label="How we work">
        {[
          [PackageCheck, "Wholesale focused", "For UK trade requirements"],
          [Layers3, "Two specialist ranges", "Electronics & car accessories"],
          [
            MessagesSquare,
            "Personal quotations",
            "Products and quantities discussed",
          ],
          [Truck, "Delivery by quotation", "Confirm method, timing and cost"],
        ].map(([Icon, title, copy]) => {
          const I = Icon as typeof Truck;
          return (
            <div key={title as string}>
              <I size={25} />
              <span>
                {title as string}
                <small>{copy as string}</small>
              </span>
            </div>
          );
        })}
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">TWO RANGES. ONE TRADE PARTNER.</span>
            <h2>Your next range starts here.</h2>
          </div>
          <Link href="/shop" className="underlined">
            View the catalogue <Arrow />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link
              href={`/shop/${c.slug}`}
              className="category-card"
              key={c.slug}
            >
              <Photo
                image={c.image}
                alt={`Representative ${c.name.toLowerCase()} photography`}
                sizes="(max-width:760px) 90vw, 45vw"
              />
              <div className="category-overlay" />
              <div className="category-copy">
                <span>0{i + 1} / THE COLLECTION</span>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
              <span className="round-arrow">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE WHOLESALE EDIT</span>
            <h2>Find your next opportunity.</h2>
          </div>
          <Link href="/shop" className="underlined">
            Explore all ranges <Arrow />
          </Link>
        </div>
        <p className="section-note">
          Illustrative product ranges. Exact products, stock, MOQ and pricing
          are confirmed by quotation.
        </p>
        <div className="product-grid featured-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="section auto-feature">
        <div className="auto-image">
          <Photo
            image="dash"
            alt="Representative dashboard and automotive accessory setting"
            sizes="(max-width:760px) 90vw, 45vw"
          />
          <span>THE CAR ACCESSORIES COLLECTION</span>
        </div>
        <div>
          <span className="eyebrow">BUILT FOR LIFE ON THE ROAD</span>
          <h2>
            Put your business
            <br />
            in the <em>driving seat.</em>
          </h2>
          <p>
            From in-car charging enquiries to phone mounting requirements, give
            your automotive range the attention it deserves.
          </p>
          <div className="feature-links">
            <Link href="/product/car-charging">
              Car charging <Arrow />
            </Link>
            <Link href="/product/phone-mounts">
              Phone mounts <Arrow />
            </Link>
            <Link href="/contact">
              Specific sourcing requirements <Arrow />
            </Link>
          </div>
          <Link href="/shop/car-accessories" className="button">
            Explore car accessories <Arrow />
          </Link>
        </div>
      </section>
      <section className="section why-us">
        <div>
          <span className="eyebrow">CLEAR TERMS. BETTER CONVERSATIONS.</span>
          <h2>
            Wholesale, with
            <br />
            the details in view.
          </h2>
          <p>
            Your quotation is the place to agree the details. We keep
            unconfirmed commercial terms out of the small print.
          </p>
        </div>
        <div className="why-grid">
          {[
            [
              "01",
              "Minimum quantities",
              "MOQ and pack quantities are confirmed for each product.",
            ],
            [
              "02",
              "Bulk quotations",
              "Share your quantities so the team can discuss volume pricing.",
            ],
            [
              "03",
              "Delivery details",
              "Agree UK shipping method, cost and expected timing before ordering.",
            ],
            [
              "04",
              "Trade access",
              "Approved accounts can access published pricing and their own enquiry history.",
            ],
          ].map(([n, title, copy]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section process">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FROM BROWSING TO BUSINESS</span>
            <h2>Three steps to your next quotation.</h2>
          </div>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Apply for trade access",
              "Create an account and share a little about your business.",
            ],
            [
              "02",
              "Build your enquiry",
              "Browse products or upload your SKU and quantity list.",
            ],
            [
              "03",
              "Agree the details",
              "Submit a quote request. Pricing and fulfilment follow team approval.",
            ],
          ].map(([n, title, copy]) => (
            <article key={n}>
              <span>
                {n}
                <ArrowRight size={20} />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section faq">
        <span className="eyebrow">BEFORE WE CONNECT</span>
        <h2>A few useful answers.</h2>
        {[
          [
            "Who is the website for?",
            "UK retailers, resellers and other trade buyers sourcing electronics and car accessories.",
          ],
          [
            "Why can’t I see prices?",
            "Trade prices are private. Sign in with an approved wholesale account to see any published price tiers. You can also request a tailored quotation.",
          ],
          [
            "What is your minimum order?",
            "Minimum quantities are confirmed per product. No unverified MOQ, pack size or minimum spend is presented as a trading promise.",
          ],
          [
            "Can I request samples?",
            "You can add a sample enquiry for eligible ranges. Sample availability, cost and delivery are confirmed by the team.",
          ],
          [
            "Does checkout take payment?",
            "No. Checkout submits a quotation request for team review. It does not confirm an order, shipping arrangement or payment.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
