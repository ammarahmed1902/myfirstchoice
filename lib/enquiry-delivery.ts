import { createHash, createHmac } from "node:crypto";
import { contactSchema, type ContactDetails } from "./contact-schema";
import { approvedProducts } from "./homepage-content";
export const ENQUIRY_RECIPIENT = "ebayecommerce1947@gmail.com";
type Config = {
  apiKey?: string;
  from?: string;
  redisUrl?: string;
  redisToken?: string;
};
export function deliveryConfig(): Config {
  return {
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.ENQUIRY_FROM_EMAIL,
    redisUrl: process.env.UPSTASH_REDIS_REST_URL,
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN,
  };
}
export function deliveryReady(c: Config) {
  return Boolean(
    c.apiKey &&
      c.from &&
      /^[^\r\n<>\s]+@[^\r\n<>\s]+\.[^\r\n<>\s]+$/.test(c.from) &&
      c.redisUrl &&
      /^https:\/\/[^/]+\.upstash\.io\/?$/.test(c.redisUrl) &&
      c.redisToken,
  );
}
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function emailContent(d: ContactDetails) {
  const product = approvedProducts.find((p) => p.id === d.product);
  const fields = [
    ["Enquiry type", d.type],
    ["Full name", d.name],
    ["Email", d.email],
    ["Company", d.company],
    ["Phone", d.phone],
    ...(d.type === "Wholesale Products"
      ? [
          ["Product", product ? `${product.name} (${product.id})` : ""],
          ["Quantity", d.quantity],
        ]
      : []),
    ["Message", d.message],
  ].filter(([, value]) => value);
  return {
    subject: `Website enquiry: ${d.type}`,
    text: fields.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
    html: `<h1>My First Choice website enquiry</h1>${fields.map(([label, value]) => `<p><strong>${label}</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`).join("")}`,
  };
}
const response = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
const failure = () =>
  response(
    {
      error:
        "Your enquiry could not be sent. Your text has been kept. Please try again or email us directly.",
    },
    503,
  );
// Redis provides atomic limits and duplicate suppression across serverless instances.
export async function handleEnquiry(
  request: Request,
  c = deliveryConfig(),
  send: typeof fetch = fetch,
  identity = "local-shared",
) {
  const origin = request.headers.get("origin");
  const target = new URL(request.url);
  const host = request.headers.get("host") || target.host;
  let validOrigin = false;
  try {
    const source = new URL(origin || "");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(source.hostname);
    validOrigin =
      source.origin === origin &&
      source.host === host &&
      (source.protocol === "https:" || (local && source.protocol === "http:"));
  } catch {
    /* Invalid or absent Origin is rejected. */
  }
  if (!validOrigin) return response({ error: "Invalid request origin." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return response({ error: "Send JSON form data." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 24000)
    return response({ error: "Request is too large." }, 413);
  let body: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return response({ error: "Enter your enquiry details." }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24000) {
        await reader.cancel();
        return response({ error: "Request is too large." }, 413);
      }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return response({ error: "Invalid form data." }, 400);
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success)
    return response(
      {
        error: "Please check the highlighted fields.",
        fields: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  if (parsed.data.website)
    return response(
      {
        error: "Your enquiry could not be accepted. Please email us directly.",
      },
      400,
    );
  if (!deliveryReady(c))
    return response(
      {
        error:
          "Online enquiry delivery is not available. Your text has been kept. Please email ebayecommerce1947@gmail.com directly.",
      },
      503,
    );
  const { website: _trap, ...details } = parsed.data;
  const digest = createHash("sha256")
    .update(JSON.stringify(details))
    .digest("hex");
  const duplicateKey = `enquiry:duplicate:${digest}`;
  const limiterKey = `enquiry:rate:${createHmac("sha256", c.redisToken!).update(identity).digest("hex")}`;
  async function redis(command: (string | number)[]) {
    const result = await send(c.redisUrl!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) throw new Error("Rate limit service unavailable");
    const json = await result.json();
    if (json.error) throw new Error("Rate limit service rejected request");
    return json.result;
  }
  let reserved = false;
  try {
    const previous = await redis(["GET", duplicateKey]);
    if (previous === "accepted")
      return response({
        accepted: true,
        message:
          "The email provider has already accepted this enquiry. Inbox receipt is not confirmed.",
      });
    if (previous)
      return response(
        {
          error:
            "This enquiry is already being processed. Please wait before trying again.",
        },
        409,
        { "Retry-After": "10" },
      );
    const count = await redis([
      "EVAL",
      "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 3600) end; return n",
      1,
      limiterKey,
    ]);
    if (typeof count !== "number") throw new Error("Invalid rate limit result");
    if (count > 5)
      return response(
        {
          error:
            "Too many enquiries. Please wait an hour or email us directly.",
        },
        429,
        { "Retry-After": "3600" },
      );
    const lock = await redis(["SET", duplicateKey, "pending", "EX", 120, "NX"]);
    if (lock !== "OK")
      return response(
        {
          error:
            "This enquiry is already being processed. Please wait before trying again.",
        },
        409,
        { "Retry-After": "10" },
      );
    reserved = true;
    const result = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${c.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `website-enquiry-${digest}`,
      },
      body: JSON.stringify({
        from: c.from,
        to: [ENQUIRY_RECIPIENT],
        reply_to: details.email,
        ...emailContent(parsed.data),
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await result.json();
    if (!result.ok || typeof data.id !== "string" || !data.id) {
      await redis(["DEL", duplicateKey]);
      return failure();
    }
    // Provider acceptance is already confirmed. A bookkeeping failure must not claim failure or cause another email.
    await redis(["SET", duplicateKey, "accepted", "EX", 86400]).catch(() => {});
    return response(
      {
        accepted: true,
        message:
          "The email provider has accepted your enquiry. This does not confirm inbox receipt.",
      },
      202,
    );
  } catch {
    // Keep uncertain sends locked temporarily; retries use the same provider idempotency key.
    if (!reserved) return failure();
    return response(
      {
        error:
          "We could not confirm provider acceptance. Your text has been kept. Please wait two minutes before retrying, or email us directly.",
      },
      503,
    );
  }
}
