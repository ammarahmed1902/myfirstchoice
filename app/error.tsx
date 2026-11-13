"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section empty-state">
      <h1>Something interrupted this page.</h1>
      <p>Please try again or contact us directly by email.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
