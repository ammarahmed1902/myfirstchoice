export default function Loading() {
  return (
    <section className="section" aria-busy="true" aria-label="Loading page">
      <div className="skeleton h-12 w-2/3" />
      <div className="skeleton h-5 w-1/2 mt-6" />
      <div className="product-grid mt-12">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton h-80" />
        ))}
      </div>
    </section>
  );
}
