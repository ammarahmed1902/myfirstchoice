import Link from "next/link";
import { business } from "@/lib/config";
export const metadata = {
  title: "Website privacy information & contact",
  robots: { index: false, follow: false },
};
export default function PrivacyContact() {
  return (
    <article className="content-section document-page">
      <header className="page-intro">
        <span className="kicker">YOUR INFORMATION</span>
        <h1>Privacy Information &amp; Contact</h1>
      </header>
      <p>
        {business.name} is the company responsible for this website. Company
        number: {business.number}. Registered office: {business.address}.
      </p>
      <h2>Contact us about your information</h2>
      <p>
        For questions about the use of your personal information or to make a
        privacy request, use our{" "}
        <Link href="/contact?reason=privacy#enquiry-form">Contact Us</Link>{" "}
        form. Select General Enquiry and describe the information or rights
        request in your message.
      </p>
      <h2>The website enquiry form</h2>
      <p>
        The form asks for your name, email address, enquiry type and message.
        You may also provide a company name, phone number and, for product
        enquiries, the product and quantity. These details are used to respond
        to the enquiry. No marketing permission is requested.
      </p>
      <p>
        When you submit the form, your enquiry is sent directly to Formspree for
        processing and email notification to the business. A success message
        means Formspree has accepted the submission; it does not confirm inbox
        receipt. The same Contact Us form accepts privacy and information
        requests.
      </p>
      <h2>Retention</h2>
      <p>
        Business enquiry correspondence is retained for six months. For a
        deletion request or questions about your correspondence, contact the
        company through the{" "}
        <Link href="/contact?reason=privacy#enquiry-form">Contact Us</Link>{" "}
        form.
      </p>
      <h2>Website technology</h2>
      <p>
        The website is hosted on Vercel. Fonts and product images are served
        with the website. This showcase does not use customer accounts, shopping
        carts, payment services, analytics or advertising trackers, and does not
        set application cookies or store enquiry text in browser storage. Unsent
        form text remains in the current page while you use it and is not saved
        when you close or reload the page.
      </p>
      <p>
        Formspree processes the enquiry details and request information for
        delivery and spam prevention. The website does not copy form messages
        into its own database or use Redis for this form. Formspree and the
        business email provider may retain submissions and delivery records
        under their configured settings and policies. Contact us about your
        information; the six-month correspondence policy also requires the
        business to manage copies held in those services.
      </p>
      <h2>Your choices and rights</h2>
      <p>
        You may ask the company about access to, correction or deletion of your
        information. Depending on the circumstances, UK data protection rights
        also include restriction, objection and data portability. You can raise
        a concern with the{" "}
        <a href="https://ico.org.uk/make-a-complaint/">
          Information Commissioner’s Office
        </a>
        .
      </p>
    </article>
  );
}
