import type { Metadata } from "next";
import { Catalogue } from "@/components/catalogue";
export const metadata: Metadata = {
  title: "Wholesale catalogue",
  alternates: { canonical: "/shop" },
};
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">ELECTRONICS & CAR ACCESSORIES</span>
        <h1>The wholesale catalogue.</h1>
        <p>
          Explore the ranges. Build an enquiry. Start your next business
          conversation.
        </p>
      </div>
      <section className="section pt-0">
        <Catalogue
          initialQuery={typeof q === "string" ? q.slice(0, 200) : ""}
        />
      </section>
    </>
  );
}
