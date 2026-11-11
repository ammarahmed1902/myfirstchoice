import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section empty-state">
      <span className="eyebrow">404 · A SMALL DETOUR</span>
      <h1>This page has moved off the map.</h1>
      <p>Let’s get you back to the wholesale catalogue.</p>
      <Link href="/shop" className="button">
        Explore the catalogue ↗
      </Link>
    </section>
  );
}
