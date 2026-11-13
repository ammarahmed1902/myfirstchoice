# Enquiry delivery setup

The old /api/enquiries implementation required a verified Supabase login and saved to a database. It did not deliver email. The new endpoint at the same URL is a public, server-validated email integration. Account/order APIs have been retired with HTTP 410. No database migration is needed.

## Production configuration

Set these server-only variables securely in Vercel (and environment settings for cloud live testing), then restart/redeploy:

| Variable                 | Required value                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| RESEND_API_KEY           | A Resend API key authorised to send mail. Never a Gmail password.                                                              |
| ENQUIRY_FROM_EMAIL       | A plain email address on a domain verified for sending in Resend. The receiving Gmail address is not a verified sender domain. |
| UPSTASH_REDIS_REST_URL   | The HTTPS REST URL of a dedicated Upstash Redis database.                                                                      |
| UPSTASH_REDIS_REST_TOKEN | The token for that database, kept server-side.                                                                                 |

The recipient is fixed in server code as ebayecommerce1947@gmail.com. Reply-To is the validated customer email. Do not set customer input as From or recipient. No service-role key or customer account is required. Sender verification/DNS records and production keys are not available in this session.

For this restricted cloud environment, outbound access is needed to api.resend.com and the precise Upstash REST hostname once chosen. ICO guidance requires ico.org.uk. Enter keys through secure settings, never chat. No keys are included in the repository or browser bundle.

## Controls

- Same-origin JSON requests only; streamed body limit of 24 KB.
- Server field validation, fixed subject types, single-line header fields and escaped HTML email content.
- Honeypot plus an atomic, shared Redis limit of five attempts per hour per hosting-provided client identity. Vercel's overwritten x-vercel-forwarded-for is used on Vercel; local execution deliberately shares one identity. Other hosts need a trusted identity adapter before public use. Do not trust arbitrary forwarded headers.
- Redis deduplication for identical validated payloads: two-minute in-flight reservation, accepted hash retained for 24 hours. Resend gets a stable content-based idempotency key, protecting uncertain retries and concurrent instances. Changing a field makes a new enquiry, subject to rate limits.
- No raw message or email/IP data in Redis; an HMAC keyed by the Redis token protects the rate-limit IP identifier. Request/delivery suppliers can have their own logs.
- No simulated success. Missing configuration or Redis fails closed; acceptance is shown only after a provider response with an ID, or a previously accepted identical payload.
- A client-side synchronous lock prevents repeated clicks. Failure leaves form values on the page. Reload/close does not persist messages.

The Redis limiter must not be shared with an untrusted client or configured for public reads. Apply appropriate account access controls and review the chosen suppliers' regions and retention.

## Delivery QA

Automated tests inject a fake provider and fake Redis; browser acceptance/error checks intercept the endpoint. These tests send no email. After real configuration:

1. Use Contact Us to send a clearly labelled test enquiry with a controlled Reply-To address.
2. Verify actual provider acceptance and recorded provider ID in its dashboard without logging customer messages publicly.
3. Confirm the receiving inbox separately with the recipient; do not infer inbox receipt from HTTP 202.
4. Verify Reply-To, product/quantity and service-type content, spam/rate limiting and retry behaviour.
5. Record the provider acceptance and recipient-confirmed receipt as separate outcomes.

Current status: no production credentials, verified sender or Upstash database. No live email submitted; no provider acceptance or inbox receipt observed.
