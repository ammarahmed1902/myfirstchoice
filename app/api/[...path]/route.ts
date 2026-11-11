import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { session, database } from "@/lib/supabase";
import {
  authSchema,
  applicationSchema,
  enquirySchema,
  orderSchema,
} from "@/lib/validation";
import { business } from "@/lib/config";
export const dynamic = "force-dynamic";
const reply = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
  });
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const route = (await params).path.join("/");
  const { db, user, profile } = await session();
  if (route === "session")
    return reply({
      configured: !!db,
      account: user
        ? {
            email: user.email,
            status: profile?.status || "pending",
            company: profile?.company || "",
          }
        : null,
    });
  if (!db)
    return reply({ error: "Trade services are not connected yet." }, 503);
  if (!user) return reply({ error: "Please sign in." }, 401);
  if (route === "prices") {
    if (profile?.status !== "approved")
      return reply({ error: "Approved wholesale access is required." }, 403);
    const { data, error } = await db
      .from("product_prices")
      .select("product_id,min_qty,unit_price,currency")
      .order("min_qty");
    if (error)
      return reply({ error: "Pricing is temporarily unavailable." }, 503);
    return reply({ tiers: data });
  }
  if (route === "orders") {
    const { data, error } = await db
      .from("quote_requests")
      .select("id,status,created_at,lines,company")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error)
      return reply({ error: "History is temporarily unavailable." }, 503);
    return reply({ orders: data });
  }
  return reply({ error: "Not found" }, 404);
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const route = (await params).path.join("/");
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return reply({ error: "Invalid request origin." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 32000)
    return reply({ error: "Request is too large." }, 413);
  let body: unknown = {};
  if (route !== "signout") {
    try {
      const text = await request.text();
      if (text.length > 32000)
        return reply({ error: "Request is too large." }, 413);
      body = JSON.parse(text);
    } catch {
      return reply({ error: "Invalid request body." }, 400);
    }
  }
  const db = await database();
  if (!db)
    return reply(
      {
        error:
          "Trade services are not connected yet. Your list remains on this device.",
      },
      503,
    );
  if (route === "password-reset") {
    const parsed = z.object({ email: z.email().max(200) }).safeParse(body);
    if (!parsed.success) return reply({ error: "Enter a valid email." }, 400);
    const { error } = await db.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${business.siteUrl}/auth/confirm`,
    });
    if (error)
      return reply(
        {
          error:
            "A reset email could not be requested. Please try again later.",
        },
        429,
      );
    return reply({
      message:
        "If this address has an account, check your email for a password reset link.",
    });
  }
  if (route === "auth") {
    const parsed = authSchema.safeParse(body);
    if (!parsed.success)
      return reply(
        { error: "Enter a valid email and a password of 12–128 characters." },
        400,
      );
    const { email, password, mode } = parsed.data;
    if (mode === "signup") {
      const { error } = await db.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${business.siteUrl}/auth/confirm` },
      });
      if (error)
        return reply(
          {
            error:
              "Account creation could not be completed. Try again later or contact the business.",
          },
          400,
        );
      return reply({
        message:
          "If this address is eligible, check your email to verify your account. Wholesale approval is a separate step.",
      });
    }
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error)
      return reply(
        { error: "Sign-in failed. Check your details and verify your email." },
        401,
      );
    return reply({ message: "Signed in." });
  }
  if (route === "signout") {
    const { error } = await db.auth.signOut();
    return error
      ? reply({ error: "Could not sign out." }, 503)
      : reply({ ok: true });
  }
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user)
    return reply({ error: "Sign in with your verified account first." }, 401);
  if (!user.email_confirmed_at)
    return reply({ error: "Verify your email before continuing." }, 403);
  if (route === "password") {
    const parsed = z
      .object({ password: z.string().min(12).max(128) })
      .safeParse(body);
    if (!parsed.success)
      return reply({ error: "Use a password of 12–128 characters." }, 400);
    const { error } = await db.auth.updateUser({
      password: parsed.data.password,
    });
    return error
      ? reply(
          {
            error:
              "Could not update the password. Try the reset email flow again.",
          },
          400,
        )
      : reply({ message: "Your password has been updated." });
  }
  if (route === "applications") {
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success)
      return reply(
        {
          error:
            "Check all business fields. Requirements must contain 10–3,000 characters.",
        },
        400,
      );
    const { data, error } = await db.rpc("submit_application", {
      details: parsed.data,
    });
    return error
      ? reply(
          {
            error:
              error.code === "P0001"
                ? error.message
                : "Application could not be saved. Check the database setup.",
          },
          400,
        )
      : reply({ id: data }, 201);
  }
  if (route === "enquiries") {
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success)
      return reply(
        {
          error: "Check your name, company and message (10–4,000 characters).",
        },
        400,
      );
    const { data, error } = await db.rpc("submit_enquiry", {
      details: parsed.data,
    });
    return error
      ? reply(
          {
            error:
              error.code === "P0001"
                ? error.message
                : "Enquiry could not be saved.",
          },
          400,
        )
      : reply({ id: data }, 201);
  }
  if (route === "orders") {
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success)
      return reply(
        {
          error:
            "Check quantities, product references, company and delivery details.",
        },
        400,
      );
    const { data: profile } = await db
      .from("profiles")
      .select("status")
      .eq("id", user.id)
      .single();
    if (profile?.status !== "approved")
      return reply(
        {
          error:
            "Wholesale approval is required before submitting a quote request.",
        },
        403,
      );
    const { data, error } = await db.rpc("submit_quote", {
      details: parsed.data,
    });
    return error
      ? reply(
          {
            error:
              error.code === "P0001"
                ? error.message
                : "Quote request could not be saved.",
          },
          400,
        )
      : reply({ id: data }, 201);
  }
  return reply({ error: "Not found" }, 404);
}
