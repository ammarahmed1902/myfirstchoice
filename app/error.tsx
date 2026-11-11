"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section empty-state">
      <h1>Something interrupted this page.</h1>
      <p>Your enquiry list remains on this device. Please try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
