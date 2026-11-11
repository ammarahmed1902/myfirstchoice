import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/supabase";
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const db = await database();
  if (db) {
    if (code) {
      const { error } = await db.auth.exchangeCodeForSession(code);
      if (!error)
        return NextResponse.redirect(
          new URL("/wholesale-application", request.url),
        );
    }
    if (token && type && ["signup", "email", "recovery"].includes(type)) {
      const { error } = await db.auth.verifyOtp({ token_hash: token, type });
      if (!error)
        return NextResponse.redirect(
          new URL(
            type === "recovery" ? "/account" : "/wholesale-application",
            request.url,
          ),
        );
    }
  }
  return NextResponse.redirect(
    new URL("/account?verification=failed", request.url),
  );
}
