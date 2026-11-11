export const metadata = {
  title: "Wholesale trade information",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <section className="section prose-page">
      <span className="eyebrow">QUOTE-BASED WHOLESALE</span>
      <h1>Trade information.</h1>
      <p>
        This website prepares and submits wholesale quotation requests. It does
        not take online payment or automatically accept orders.
      </p>
      <h2>Commercial terms are confirmed in your quotation</h2>
      <p>
        Product specifications, availability, minimum quantities, pack sizes,
        currency, VAT treatment, sample costs, delivery arrangements and payment
        terms must be agreed before an order is placed.
      </p>
      <h2>Representative ranges</h2>
      <p>
        Current product ranges and photography are illustrative. They do not
        promise a particular brand, exact model, certification or stock
        quantity.
      </p>
      <div className="notice">
        The business must publish its verified company registration, registered
        office and approved B2B terms, including returns, faults, warranties,
        liability and order acceptance, before public launch.
      </div>
    </section>
  );
}
