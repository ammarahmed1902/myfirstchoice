import Link from "next/link";
import { business } from "@/lib/config";
export const metadata = {
  title: "Privacy Information",
  description:
    "How My First Choice uses enquiry information and how to contact us about your privacy rights.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
};
const privacyContact = "/contact?reason=privacy#enquiry-form";
export default function PrivacyInformation() {
  return (
    <article className="content-section document-page">
      <header className="page-intro">
        <span className="kicker">YOUR INFORMATION</span>
        <h1>Privacy Information</h1>
      </header>
      <p>
        {business.name} is responsible for this website. Company number:{" "}
        {business.number}. Registered office: {business.address}.
      </p>
      <h2>What information you provide</h2>
      <p>
        When you send an enquiry, we ask for your name, email address, enquiry
        type and message. You can also provide your company name, phone number
        and, for product enquiries, a product and quantity. Please include only
        information relevant to your request.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your details to answer your questions, discuss the products or
        services you have requested, and handle order issues or privacy
        requests. Sending an enquiry does not sign you up for marketing.
      </p>
      <h2>Services that help us handle enquiries</h2>
      <p>
        Vercel hosts the website. Formspree receives and processes form
        submissions, helps prevent spam and sends notifications to our business
        email account. Our email provider handles the resulting correspondence.
        These services may also process information about requests and delivery
        to operate and protect their services.
      </p>
      <p>
        These providers may process information outside the UK. You can use{" "}
        <Link href={privacyContact}>Contact Us</Link> to ask about how your
        information is handled or the providers involved.
      </p>
      <h2>How long correspondence is kept</h2>
      <p>
        The business has stated a six-month retention policy for enquiry
        correspondence, measured from the last correspondence. This is not a
        promise that messages are automatically
        deleted after six months. Copies may be held in our email account and
        Formspree. For questions about retention or to request deletion, use{" "}
        <Link href={privacyContact}>Contact Us</Link>.
      </p>
      <h2>Your privacy requests and rights</h2>
      <p>
        You can ask about access to your information, correction of inaccurate
        details or deletion. Depending on the circumstances, you may also have
        rights to restrict processing, object to its use or receive a portable
        copy.
      </p>
      <p>
        To make a request, use <Link href={privacyContact}>Contact Us</Link>.
        The form opens as General Enquiry with a privacy-request prompt.
        Describe your request in the message; you do not need to select a
        product.
      </p>
      <p>
        If you are concerned about how your information has been used, you can
        contact us through the same form or complain to the{" "}
        <a href="https://ico.org.uk/make-a-complaint/">
          Information Commissioner’s Office
        </a>
        .
      </p>
      <h2>Using this website</h2>
      <p>
        The website does not use advertising or analytics trackers. Fonts and
        product pictures are served with the site. We do not use customer
        accounts or online payments. Unsent form text is not saved when you
        close or reload the page.
      </p>
    </article>
  );
}
