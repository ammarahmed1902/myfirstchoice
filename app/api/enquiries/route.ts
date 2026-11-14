// The Contact Us form now submits directly to its fixed Formspree endpoint.
// Retire the previous Resend endpoint so old clients cannot use a second delivery path.
export function GET() {
  return Response.json(
    { provider: "Formspree", formId: "myewknly" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export function POST() {
  return Response.json(
    {
      error:
        "Please reload the Contact Us page to use the updated enquiry form.",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
