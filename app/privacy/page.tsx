export const metadata = {
  title: "Privacy information",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <section className="section prose-page">
      <span className="eyebrow">PRE-LAUNCH INFORMATION</span>
      <h1>Privacy information.</h1>
      <div className="notice">
        A complete UK privacy notice, including the verified controller contact,
        retention periods, lawful bases and processor details, must be approved
        before public launch. This page is not a completed legal policy.
      </div>
      <h2>What this implementation does</h2>
      <p>
        Your product enquiry list is stored in this browser’s local storage. It
        contains product references and quantities, not your password. Clear the
        list to remove those product references.
      </p>
      <p>
        When trade services are configured, authentication is provided by
        Supabase. Account, application, contact and quotation details are stored
        in its database with row-level access controls. Authentication uses
        cookies required for your signed-in session.
      </p>
      <p>
        Representative photographs are requested from Unsplash. The image
        service may receive a request from the server, or from your browser if
        directly configured. Fonts are hosted with the website. No analytics,
        advertising or payment trackers are installed by this implementation.
      </p>
      <h2>Before using this service for customer data</h2>
      <p>
        The business must publish its controller details, privacy contact, data
        retention schedule, lawful bases, supplier and international transfer
        information, and instructions for UK data protection rights and
        complaints to the ICO.
      </p>
    </section>
  );
}
