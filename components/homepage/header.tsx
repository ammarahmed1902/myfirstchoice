"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { HomeLogo } from "./logo";
import { homeCategories } from "@/lib/homepage-content";
import styles from "./homepage.module.css";
export function HomeHeader() {
  const [open, setOpen] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [expanded, setExpanded] = useState(false);
  const pinned = useRef(false);
  const group = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    drawer = useRef<HTMLDialogElement>(null),
    mobileTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [mobileOpen]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!group.current?.contains(e.target as Node)) {
        pinned.current = false;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  function focusItem(last = false) {
    requestAnimationFrame(() => {
      const links = group.current?.querySelectorAll<HTMLAnchorElement>(
        "[data-category-link]",
      );
      if (links?.length) links[last ? links.length - 1 : 0].focus();
    });
  }
  function closeMobile() {
    drawer.current?.close();
    setMobileOpen(false);
    setExpanded(false);
    mobileTrigger.current?.focus({ preventScroll: true });
  }
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <HomeLogo />
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <Link href="/#home" aria-current="page">
            Home
          </Link>
          <div
            className={styles.catalogueGroup}
            ref={group}
            onPointerEnter={() => {
              if (window.matchMedia("(min-width: 961px)").matches)
                setOpen(true);
            }}
            onPointerLeave={() => {
              if (
                !pinned.current &&
                !group.current?.contains(document.activeElement)
              )
                setOpen(false);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                pinned.current = false;
                setOpen(false);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                pinned.current = false;
                setOpen(false);
                trigger.current?.focus();
              }
              const links = Array.from(
                group.current?.querySelectorAll<HTMLAnchorElement>(
                  "[data-category-link]",
                ) || [],
              );
              const index = links.indexOf(
                document.activeElement as HTMLAnchorElement,
              );
              if (
                index >= 0 &&
                ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)
              ) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? links.length - 1
                      : (index +
                          (e.key === "ArrowDown" ? 1 : -1) +
                          links.length) %
                        links.length;
                links[next]?.focus();
              }
            }}
          >
            <button
              ref={trigger}
              className={styles.catalogueTrigger}
              aria-expanded={open}
              aria-controls="home-catalogue-dropdown"
              onClick={() => {
                pinned.current = !pinned.current;
                setOpen(pinned.current);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  pinned.current = true;
                  setOpen(true);
                  focusItem(e.key === "ArrowUp");
                }
              }}
            >
              Our Catalogue <ChevronDown size={13} aria-hidden="true" />
            </button>
            <div
              className={styles.dropdown}
              id="home-catalogue-dropdown"
              hidden={!open}
            >
              <ul>
                {homeCategories.map((c) => (
                  <li key={c.label}>
                    <Link
                      href={c.href}
                      data-category-link
                      onClick={() => {
                        pinned.current = false;
                        setOpen(false);
                      }}
                    >
                      <span>
                        {c.label}
                        <small>{c.description}</small>
                      </span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
        <Link
          href="/contact"
          className={`${styles.button} ${styles.headerEnquiry}`}
        >
          Wholesale Enquiry <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <button
          className={styles.mobileMenuButton}
          ref={mobileTrigger}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="home-mobile-menu"
          onClick={() => {
            setMobileOpen(true);
            setOpen(false);
            drawer.current?.showModal();
            requestAnimationFrame(() =>
              drawer.current
                ?.querySelector<HTMLButtonElement>(
                  '[aria-label="Close navigation menu"]',
                )
                ?.focus(),
            );
          }}
        >
          <Menu size={23} aria-hidden="true" />
        </button>
      </div>
      <dialog
        id="home-mobile-menu"
        ref={drawer}
        className={styles.mobileDrawer}
        aria-label="Navigation menu"
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const focusable = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>(
              "a[href],button:not([disabled])",
            ),
          ).filter((el) => el.getClientRects().length > 0);
          const first = focusable[0],
            last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => {
          setMobileOpen(false);
          setExpanded(false);
        }}
        onClose={() => {
          setMobileOpen(false);
          setExpanded(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMobile();
        }}
      >
        <div className={styles.drawerInner}>
          <div className={styles.drawerTop}>
            <span>MY FIRST CHOICE</span>
            <button aria-label="Close navigation menu" onClick={closeMobile}>
              <X size={23} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            <Link href="/#home" onClick={closeMobile}>
              Home
            </Link>
            <button
              className={styles.mobileCatalogueToggle}
              aria-expanded={expanded}
              aria-controls="mobile-home-categories"
              onClick={() => setExpanded(!expanded)}
            >
              Our Catalogue <ChevronDown size={17} aria-hidden="true" />
            </button>
            <ul
              id="mobile-home-categories"
              className={styles.mobileCategories}
              hidden={!expanded}
            >
              {homeCategories.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} onClick={closeMobile}>
                    {c.label}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/about" onClick={closeMobile}>
              About Us
            </Link>
            <Link href="/contact" onClick={closeMobile}>
              Contact Us
            </Link>
          </nav>
          <Link href="/contact" className={styles.button} onClick={closeMobile}>
            Wholesale Enquiry <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <p>Charging cables. Car accessories. RFID wallets.</p>
        </div>
      </dialog>
    </header>
  );
}
