import Image from "next/image";
import Link from "next/link";
import styles from "./logo.module.css";

/** Compact header presentation and full footer artwork share the unchanged SVG. */
export function HomeLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`${styles.brand} ${inverse ? styles.inverse : ""}`}
      data-site-logo
    >
      {inverse ? (
        <Image
          src="/assets/my-first-choice-logo.svg"
          width={2149}
          height={732}
          alt="EBAY 1ST CHOICE LTD — Electronics & Car Accessories Wholesale"
          className={styles.image}
          loading="lazy"
          unoptimized
          data-logo-variant="full"
        />
      ) : (
        <svg
          className={styles.image}
          viewBox="115 40 1940 460"
          width="1940"
          height="460"
          role="img"
          aria-label="EBAY 1ST CHOICE LTD"
          data-logo-variant="compact"
        >
          <title>EBAY 1ST CHOICE LTD</title>
          <image
            href="/assets/my-first-choice-logo.svg"
            width="2149"
            height="732"
          />
        </svg>
      )}
      <span className="sr-only"> Home</span>
    </Link>
  );
}
