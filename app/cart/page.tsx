import { Cart } from "@/components/cart";
export const metadata = {
  title: "Your enquiry list",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">YOUR WHOLESALE SHORTLIST</span>
        <h1>Your enquiry list.</h1>
        <p>
          Check your product references and quantities before requesting a
          quotation.
        </p>
      </div>
      <section className="section pt-0">
        <Cart />
      </section>
    </>
  );
}
