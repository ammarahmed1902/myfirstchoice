"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./homepage.module.css";
import type { HomeProduct } from "@/lib/homepage-content";
export function ProductImage({
  product,
  priority = false,
  sizes = "(max-width: 520px) 45vw, (max-width: 1000px) 30vw, 24vw",
}: {
  product: HomeProduct;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={styles.productImage}>
      {product.image && !failed ? (
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.containedImage}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={styles.photoPending}
          role="img"
          aria-label={`${product.name}: actual product photograph has not been supplied`}
        >
          <span className={styles.photoRule} aria-hidden="true" />
          <span className={styles.pendingName}>{product.name}</span>
          <span className={styles.pendingCaption}>
            {failed
              ? "Product photograph unavailable"
              : "Product photograph pending"}
          </span>
        </div>
      )}
    </div>
  );
}
