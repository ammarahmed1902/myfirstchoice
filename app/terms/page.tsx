import { business } from "@/lib/config";
export const metadata = {
  title: "Wholesale Terms, Payments & Returns",
  description:
    "How funded wholesale balances, payment arrangements, invoices and order issue enquiries work.",
  alternates: { canonical: "/terms" },
};
export default function Terms() {
  return (
    <article className="content-section document-page">
      <header className="page-intro">
        <span className="kicker">WHOLESALE TRADING INFORMATION</span>
        <h1>Wholesale Terms, Payments &amp; Returns</h1>
        <p>
          Published <time dateTime="2026-11-12">12 November 2026</time>
        </p>
      </header>
      <p>
        This page explains the wholesale trading arrangements of {business.name}
        , company number {business.number}, with its registered office at{" "}
        {business.address}. It is trading information, rather than a complete
        set of contractual terms. The scope and terms of 3PL, product sourcing
        and e-commerce management services are agreed separately.
      </p>
      <h2>Deposited funds, available balance and sales limit</h2>
      <p>
        We refer to funds deposited towards a customer’s account as a “security
        deposit”. These funds are used for orders; the original deposit is not
        held untouched.
      </p>
      <p>
        Your deposited funds establish your available account balance and sales
        limit. As funds are used for orders, your available balance reduces.
        Please replenish your balance before it is exhausted to avoid
        interruptions to further orders.
      </p>
      <p>
        When your previous balance has been fully used, any new deposit provides
        a new available balance. If you stop working with us, the remaining
        unused balance is refundable. Amounts already used for orders are not
        included in that balance refund.
      </p>
      <aside className="balance-example" aria-label="Available balance example">
        <h3>A balance example</h3>
        <p>
          If you deposit £500 and use all £500 for orders, that balance is
          exhausted. A further £1,000 deposit provides a new £1,000 balance. If
          £300 of that balance is then used, the remaining unused balance is
          £700.
        </p>
      </aside>
      <h2>Payment arrangements and invoices</h2>
      <p>
        Weekly or monthly payment arrangements are agreed with the customer
        where applicable. There is no universal payment schedule. Amounts
        already deducted from your funded balance do not require a second
        payment because an invoice is issued.
      </p>
      <p>We provide company invoices for transactions.</p>
      <p>This website does not collect deposits or payments online.</p>
      <h2>Shipment updates</h2>
      <p>
        We provide tracking information and update shipment details as updates
        become available.
      </p>
      <h2>Damaged items</h2>
      <p>
        If an item arrives damaged, contact us at{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a> with your
        order or invoice reference and details of the issue. Contact us to
        discuss the next steps before sending an item back. The registered
        office is not a confirmed returns address.
      </p>
      <h2>Orders that have not arrived</h2>
      <p>
        If your order has not arrived, contact us at{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a> with your
        order or invoice reference and details of the issue. Report non-delivery
        so it can be discussed separately from returning a physical item.
      </p>
    </article>
  );
}
