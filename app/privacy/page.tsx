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
        privacy request, email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
      <h2>The website enquiry form</h2>
      <p>
        The form asks for your name, email address, enquiry type and message.
        You may also provide a company name, phone number and, for product
        enquiries, the product and quantity. These details are used to respond
        to the enquiry. No marketing permission is requested.
      </p>
      <p>
        Online sending is available only when the email service and spam
        controls are configured. When enabled, the website sends the enquiry
        through Resend to the company’s email inbox. An acceptance message means
        that the email provider has accepted the request; it does not confirm
        inbox receipt. You can also email the company directly.
      </p>
      <h2>Retention</h2>
      <p>
        Business enquiry correspondence is retained for six months. For a
        deletion request or questions about your correspondence, contact the
        company at the email address above.
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
        When online sending is enabled, Upstash Redis stores a keyed hash used
        for hourly abuse limits and a hash used to recognise duplicate enquiries
        for up to 24 hours. The application does not store the message body in
        Redis or write it to application logs. Hosting, email and network
        providers may process request and delivery information as part of
        operating their services.
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
