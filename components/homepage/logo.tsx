import Link from "next/link";
import { Mark } from "@/components/icons";
import styles from "./logo.module.css";
/** Existing company monogram, with one consistent responsive wordmark lockup. */
export function HomeLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`${styles.brand} ${inverse ? styles.inverse : ""}`}
    >
      <span className={styles.symbol}>
        <Mark />
      </span>
      <span className={styles.wordmark}>
        <span className={styles.companyPrefix}>EBAY</span>
        <span className={styles.name}>
          1ST CHOICE <span className={styles.legalSuffix}>LTD</span>
        </span>
        <span className={styles.descriptor}>WHOLESALE ACCESSORIES</span>
      </span>
      <span className="sr-only"> Home</span>
    </Link>
  );
}
