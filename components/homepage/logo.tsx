import Image from "next/image";
import Link from "next/link";
import styles from "./logo.module.css";

/** The original supplied SVG is shared by every header and footer. */
export function HomeLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`${styles.brand} ${inverse ? styles.inverse : ""}`}
      data-site-logo
    >
      <Image
        src="/assets/my-first-choice-logo.svg"
        width={2149}
        height={732}
        alt="EBAY 1ST CHOICE LTD — Electronics & Car Accessories Wholesale"
        className={styles.image}
        loading={inverse ? "lazy" : "eager"}
        unoptimized
      />
      <span className="sr-only"> Home</span>
    </Link>
  );
}
