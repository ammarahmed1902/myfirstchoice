import {
  deliveryConfig,
  deliveryReady,
  handleEnquiry,
} from "@/lib/enquiry-delivery";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(
    { configured: deliveryReady(deliveryConfig()) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export function POST(request: Request) {
  // On Vercel this header is overwritten by its edge; never trust arbitrary forwarding headers locally.
  const identity =
    process.env.VERCEL === "1"
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local-shared";
  return handleEnquiry(request, deliveryConfig(), fetch, identity);
}
