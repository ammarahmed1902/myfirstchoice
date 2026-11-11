"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HomeHeader } from "@/components/homepage/header";
import { HomeFooter } from "@/components/homepage/footer";
import styles from "@/components/homepage/homepage.module.css";
export function SiteFrame({ children }: { children: ReactNode }) {
  const home = usePathname() === "/";
  return (
    <div className={home ? styles.frame : undefined}>
      {home ? <HomeHeader /> : <Header />}
      <main id="main-content">{children}</main>
      {home ? <HomeFooter /> : <Footer />}
    </div>
  );
}
