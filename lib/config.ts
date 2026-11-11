export const business = {
  name: "EBAY 1ST CHOICE LTD",
  market: "United Kingdom",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://my1stchoice.vercel.app",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  launchReady: process.env.NEXT_PUBLIC_LAUNCH_READY === "true",
};
export const backendConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
