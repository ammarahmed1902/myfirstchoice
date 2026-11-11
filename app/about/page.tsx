import Link from "next/link";
import { Mark } from "@/components/icons";
export const metadata = {
  title: "About our wholesale business",
  alternates: { canonical: "/about" },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">MEET EBAY 1ST CHOICE LTD</span>
        <h1>Your next business connection.</h1>
        <p>
          Wholesale electronics and car accessories for UK trade requirements.
        </p>
      </div>
      <section className="section pt-0 two-column">
        <div className="about-art">
          <Mark />
          <span>ELECTRONICS · CAR ACCESSORIES · WHOLESALE</span>
        </div>
        <div>
          <h2>
            Two product areas.
            <br />
            One clear focus.
          </h2>
          <p>
            EBAY 1ST CHOICE LTD brings electronics and car accessories together
            in a catalogue designed for business buyers. Our focus is giving
            retailers and resellers a clear starting point for their next
            sourcing conversation.
          </p>
          <p>
            Explore the ranges, share your specifications and quantities, and
            discuss the details through a tailored quotation. Product
            availability, minimum quantities, samples and delivery arrangements
            are confirmed before an order is agreed.
          </p>
          <Link href="/wholesale-application" className="button">
            Become a wholesale buyer ↗
          </Link>
        </div>
      </section>
      <section className="section featured">
        <span className="eyebrow">OUR APPROACH</span>
        <div className="steps">
          {[
            [
              "Clarity",
              "Representative ranges are identified. Unconfirmed prices and commercial terms stay unconfirmed.",
            ],
            [
              "Relevance",
              "Two dedicated product areas make electronics and automotive sourcing easier to explore.",
            ],
            [
              "Conversation",
              "A quotation is the place to agree the right product, quantity and delivery requirements.",
            ],
          ].map(([title, text]) => (
            <article key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
