"use client";
import Image from "next/image";
import { useState } from "react";
const ids: Record<string, string> = {
  hero: "photo-1492144534655-ae79c964c9d7",
  headphones: "photo-1546435770-a3e426bf472b",
  audio: "photo-1606220945770-b5b6c2c55bf1",
  charger: "photo-1583863788434-e58a36330cf0",
  phone: "photo-1511707171634-5f897ff02aa9",
  car: "photo-1503376780353-7e6692767b70",
  dash: "photo-1449965408869-eaa3f722e40d",
};
export function Photo({
  image,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 90vw, (max-width: 1000px) 45vw, 30vw",
}: {
  image: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      src={
        failed
          ? `/images/${image}.svg`
          : `https://images.unsplash.com/${ids[image]}?auto=format&fit=crop`
      }
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={failed}
      loader={
        failed
          ? undefined
          : ({ src, width, quality }) => {
              const url = new URL(src);
              url.searchParams.set("w", String(width));
              url.searchParams.set("q", String(quality || 75));
              return url.toString();
            }
      }
      onError={() => setFailed(true)}
      className="object-cover"
    />
  );
}
