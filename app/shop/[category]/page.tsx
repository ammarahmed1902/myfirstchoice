import { redirect, notFound } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const map: Record<string, string> = {
    electronics: "charging-cables",
    "car-accessories": "car-accessories",
    "charging-cables": "charging-cables",
    "rfid-wallets": "rfid-wallets",
  };
  if (!map[category]) notFound();
  redirect(`/shop?category=${map[category]}`);
}
