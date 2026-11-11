import { QuickOrder } from "@/components/quick-order";
export const metadata = {
  title: "Quick order & CSV enquiry",
  alternates: { canonical: "/quick-order" },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">LESS REPETITION. MORE BUSINESS.</span>
        <h1>Your list. One simple step.</h1>
        <p>Build a wholesale enquiry by reference code or CSV upload.</p>
      </div>
      <section className="section pt-0">
        <QuickOrder />
      </section>
    </>
  );
}
