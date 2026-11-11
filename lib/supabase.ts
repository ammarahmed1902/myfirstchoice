import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { backendConfigured } from "./config";
export async function database() {
  if (!backendConfigured) return null;
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll: () => store.getAll(),
        setAll(values) {
          try {
            values.forEach(({ name, value, options }) =>
              store.set(name, value, options),
            );
          } catch {
            /* Server components cannot refresh cookies; route handlers can. */
          }
        },
      },
    },
  );
}
export async function session() {
  const db = await database();
  if (!db) return { db: null, user: null, profile: null };
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return { db, user: null, profile: null };
  const { data: profile } = await db
    .from("profiles")
    .select("status,company,full_name")
    .eq("id", user.id)
    .single();
  return { db, user, profile };
}
