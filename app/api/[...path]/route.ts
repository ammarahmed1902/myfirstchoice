// Previous account, pricing and ordering APIs are retired for the showcase site.
export const dynamic = "force-dynamic";
const retired = () =>
  Response.json(
    {
      error:
        "This service has been retired. Please use the contact page for enquiries.",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
export const GET = retired;
export const POST = retired;
