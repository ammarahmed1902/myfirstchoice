import { BusinessForm } from "@/components/business-form";
export const metadata = {
  title: "Become a wholesale buyer",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">FOR RETAILERS, RESELLERS & TRADE BUYERS</span>
        <h1>Let’s build better business.</h1>
        <p>
          Apply for wholesale access to our electronics and car accessory
          ranges.
        </p>
      </div>
      <section className="section pt-0 two-column">
        <div>
          <h2>Trade access, with a personal introduction.</h2>
          <p>
            Tell us about your UK business and the products you are looking for.
            Approved accounts can view published trade prices and submit
            quotations for review.
          </p>
          <ol className="numbered-list">
            <li>Create an account and verify your email.</li>
            <li>Submit your business details for review.</li>
            <li>
              After approval, explore trade pricing and request a quotation.
            </li>
          </ol>
          <div className="notice">
            Application approval does not establish credit terms, stock
            availability or a guaranteed supply agreement.
          </div>
        </div>
        <BusinessForm kind="application" />
      </section>
    </>
  );
}
