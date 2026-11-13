import { test } from "node:test";
import assert from "node:assert/strict";
import {
  handleEnquiry,
  emailContent,
  deliveryReady,
  ENQUIRY_RECIPIENT,
} from "../lib/enquiry-delivery";
const details = {
  name: "Test Buyer",
  email: "buyer@example.com",
  company: "Example Ltd",
  phone: "",
  type: "Wholesale Products" as const,
  product: "lightning-cable",
  quantity: "20",
  message: "Please discuss our business requirements.",
  website: "",
};
const config = {
  apiKey: "test-only-key",
  from: "enquiries@example.com",
  redisUrl: "https://test-only.upstash.io",
  redisToken: "test-only-token",
};
function request(
  data: unknown = details,
  origin = "https://my1stchoice.vercel.app",
) {
  return new Request("https://my1stchoice.vercel.app/api/enquiries", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(data),
  });
}
function provider(
  options: {
    reject?: boolean;
    throw?: boolean;
    rate?: number;
    redisFail?: boolean;
  } = {},
) {
  const state = new Map<string, string>();
  let calls = 0;
  const emails: Record<string, unknown>[] = [];
  const keys: string[] = [];
  const send: typeof fetch = async (input, init) => {
    if (String(input).includes("upstash.io")) {
      if (options.redisFail) throw new Error("offline");
      const [cmd, key, value, ...args] = JSON.parse(String(init?.body));
      let result: unknown = null;
      if (cmd === "GET") result = state.get(key) || null;
      if (cmd === "EVAL") result = options.rate || 1;
      if (cmd === "SET") {
        if (args.includes("NX") && state.has(key)) result = null;
        else {
          state.set(key, value);
          result = "OK";
        }
      }
      if (cmd === "DEL") {
        state.delete(key);
        result = 1;
      }
      return Response.json({ result });
    }
    calls++;
    emails.push(JSON.parse(String(init?.body)));
    keys.push(new Headers(init?.headers).get("Idempotency-Key")!);
    if (options.throw) throw new Error("uncertain timeout");
    return options.reject
      ? Response.json({ error: "invalid sender" }, { status: 422 })
      : Response.json({ id: "test-provider-acceptance" });
  };
  return {
    send,
    emails,
    keys,
    state,
    get calls() {
      return calls;
    },
  };
}
test("invalid fields, header injection, unknown products and honeypot never call delivery", async () => {
  for (const data of [
    { ...details, email: "buyer@example.com\r\nBcc: victim@example.com" },
    { ...details, name: "Name\nBCC: other" },
    { ...details, product: "invented" },
    { ...details, quantity: "0" },
    { ...details, type: "General Enquiry" },
    { ...details, website: "spam" },
  ]) {
    const p = provider();
    const r = await handleEnquiry(request(data), config, p.send);
    assert.equal(r.status, 400);
    assert.equal(p.calls, 0);
  }
});
test("cross-origin, malformed, non-JSON and oversized bodies are rejected", async () => {
  const p = provider();
  assert.equal(
    (
      await handleEnquiry(
        request(details, "https://attacker.example"),
        config,
        p.send,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleEnquiry(
        new Request("https://my1stchoice.vercel.app/api/enquiries", {
          method: "POST",
          headers: {
            origin: "https://my1stchoice.vercel.app",
            "content-type": "application/json",
          },
          body: "{",
        }),
        config,
        p.send,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ ...details, message: "x".repeat(25000) }),
        config,
        p.send,
      )
    ).status,
    413,
  );
  const r = request();
  r.headers.set("content-type", "text/plain");
  assert.equal((await handleEnquiry(r, config, p.send)).status, 415);
  assert.equal(p.calls, 0);
});
test("missing provider, unverified-style sender or absent shared limiter fails closed", async () => {
  const p = provider();
  for (const c of [
    {},
    { ...config, from: "invalid\naddress" },
    { ...config, redisToken: undefined },
  ]) {
    assert.equal(deliveryReady(c), false);
    assert.equal((await handleEnquiry(request(), c, p.send)).status, 503);
  }
  assert.equal(p.calls, 0);
});
test("email fixes the recipient, validates Reply-To, escapes HTML and includes the selected product", async () => {
  const p = provider();
  const r = await handleEnquiry(
    request({
      ...details,
      message: 'Please supply <script>alert("x")</script> & products.',
    }),
    config,
    p.send,
  );
  assert.equal(r.status, 202);
  const mail = p.emails[0];
  assert.deepEqual(mail.to, [ENQUIRY_RECIPIENT]);
  assert.equal(mail.from, config.from);
  assert.equal(mail.reply_to, details.email);
  assert.match(String(mail.html), /&lt;script&gt;/);
  assert.doesNotMatch(String(mail.html), /<script>/);
  assert.match(String(mail.text), /USB-C to Lightning Cable/);
  assert.match(String(mail.text), /Quantity: 20/);
  assert.match((await r.json()).message, /does not confirm inbox receipt/);
});
test("identical submissions are accepted once and reused across requests", async () => {
  const p = provider();
  assert.equal((await handleEnquiry(request(), config, p.send)).status, 202);
  assert.equal((await handleEnquiry(request(), config, p.send)).status, 200);
  assert.equal(p.calls, 1);
});
test("a pending duplicate cannot send twice", async () => {
  const p = provider({ throw: true });
  assert.equal((await handleEnquiry(request(), config, p.send)).status, 503);
  assert.equal((await handleEnquiry(request(), config, p.send)).status, 409);
  assert.equal(p.calls, 1);
});
test("shared hourly limiter and unavailable Redis prevent sending", async () => {
  for (const [options, status] of [
    [{ rate: 6 }, 429],
    [{ redisFail: true }, 503],
  ] as const) {
    const p = provider(options);
    assert.equal(
      (await handleEnquiry(request(), config, p.send)).status,
      status,
    );
    assert.equal(p.calls, 0);
  }
});
test("provider rejection returns failure; retry reuses the idempotency key", async () => {
  const p = provider({ reject: true });
  for (let i = 0; i < 2; i++) {
    const r = await handleEnquiry(request(), config, p.send);
    assert.equal(r.status, 503);
    assert.equal((await r.json()).accepted, undefined);
  }
  assert.equal(p.calls, 2);
  assert.equal(p.keys[0], p.keys[1]);
});
test("optional fields may be empty and service enquiries omit product fields", () => {
  const content = emailContent({
    ...details,
    type: "3PL Services",
    product: "",
    quantity: "",
  });
  assert.doesNotMatch(content.text, /Product:|Quantity:/);
  assert.match(content.subject, /3PL Services/);
});

test("local origin validation uses the request Host when the framework normalises its internal URL", async () => {
  const req = new Request("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers: {
      host: "127.0.0.1:3000",
      origin: "http://127.0.0.1:3000",
      "content-type": "application/json",
    },
    body: JSON.stringify(details),
  });
  const p = provider();
  assert.equal((await handleEnquiry(req, config, p.send)).status, 202);
});
