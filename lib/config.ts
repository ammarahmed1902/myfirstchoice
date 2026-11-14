export const business = {
  name: "EBAY 1ST CHOICE LTD",
  market: "United Kingdom",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ebay1stchoice.co.uk",
  number: "17532062",
  address: "117 Crocketts Road, Birmingham, England, B21 0HS",
  director: "Mohammad Ummar Khan",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  launchReady: process.env.NEXT_PUBLIC_LAUNCH_READY === "true",
};
export const backendConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
