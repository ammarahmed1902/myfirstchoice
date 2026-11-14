"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, UserRound, ClipboardList } from "lucide-react";
import { Arrow } from "./icons";
import { HomeLogo } from "./homepage/logo";
import { useTrade } from "./trade-provider";
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { cart } = useTrade();
  return (
    <>
      <div className="topbar">
        <span>UK WHOLESALE · ELECTRONICS & CAR ACCESSORIES</span>
        <Link href="/wholesale-application">
          Built for retailers & resellers <Arrow />
        </Link>
      </div>
      <header className="site-header">
        <div className="header-main">
          <HomeLogo />
          <form action="/shop" className="header-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              name="q"
              aria-label="Search products or SKUs"
              placeholder="Search products, categories or SKUs"
            />
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>
          <div className="header-tools">
            <Link href="/account" aria-label="Trade account">
              <UserRound size={21} />
              <span>Trade account</span>
            </Link>
            <Link
              href="/cart"
              aria-label={`Enquiry list, ${cart.length} items`}
            >
              <ClipboardList size={21} />
              <span className="count">{cart.length}</span>
            </Link>
            <button
              className="menu-button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="main-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          id="main-nav"
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          <div>
            {[
              ["/shop", "All products"],
              ["/shop/electronics", "Electronics"],
              ["/shop/car-accessories", "Car accessories"],
              ["/quick-order", "Quick order"],
              ["/about", "About us"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <Link
                href={href}
                key={href}
                onClick={() => setOpen(false)}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
          <Link
            className="nav-cta"
            href="/wholesale-application"
            onClick={() => setOpen(false)}
          >
            Become a wholesale buyer <Arrow />
          </Link>
        </nav>
      </header>
    </>
  );
}
