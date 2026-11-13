import type { ReactNode } from "react";
import { HomeHeader } from "@/components/homepage/header";
import { HomeFooter } from "@/components/homepage/footer";
import styles from "@/components/homepage/homepage.module.css";
export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame}>
      <HomeHeader />
      <main id="main-content">{children}</main>
      <HomeFooter />
    </div>
  );
}
