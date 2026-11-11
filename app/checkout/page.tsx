import { Checkout } from "@/components/checkout";
export const metadata = {
  title: "Request a wholesale quotation",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">QUOTE-BASED CHECKOUT</span>
        <h1>Let’s confirm the details.</h1>
        <p>Send your requirements for trade review. No payment is taken.</p>
      </div>
      <section className="section pt-0">
        <Checkout />
      </section>
    </>
  );
}
