import { notFound } from "next/navigation";
import { categories, type Category } from "@/lib/catalogue";
import { Catalogue } from "@/components/catalogue";
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = categories.find((c) => c.slug === category);
  return {
    title: c ? `${c.name} wholesale` : "Category not found",
    alternates: { canonical: `/shop/${category}` },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = categories.find((c) => c.slug === category);
  if (!c) notFound();
  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">THE COLLECTION</span>
        <h1>{c.name} wholesale.</h1>
        <p>{c.description}</p>
      </div>
      <section className="section pt-0">
        <Catalogue initialCategory={category as Category} />
      </section>
    </>
  );
}
