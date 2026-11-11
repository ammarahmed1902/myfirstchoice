"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { homeSlides } from "@/lib/homepage-content";
import styles from "./homepage.module.css";

const count = homeSlides.length;
const panels = [homeSlides[count - 1], ...homeSlides, homeSlides[0]];

export function HeroCarousel({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState(1);
  const [resetting, setResetting] = useState(false);
  const [motion, setMotion] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const active = (position - 1 + count) % count;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!query.matches);
    update();
    query.addEventListener("change", update);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      query.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!motion || manualPause || hovered || focused || !visible || resetting)
      return;
    const timer = window.setInterval(
      () => setPosition((current) => Math.min(current + 1, count + 1)),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [motion, manualPause, hovered, focused, visible, resetting, position]);

  useEffect(() => {
    if (!resetting) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setResetting(false));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [resetting]);

  function move(direction: number) {
    if (resetting) return;
    setPosition((current) =>
      motion
        ? Math.max(0, Math.min(count + 1, current + direction))
        : ((current - 1 + direction + count) % count) + 1,
    );
  }

  function finish() {
    if (position === 0 || position === count + 1) {
      setResetting(true);
      setPosition(position === 0 ? count : 1);
    }
  }

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Wholesale product ranges"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onTouchStart={(event) => {
        touch.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
          move(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
      onTouchCancel={() => {
        touch.current = null;
      }}
    >
      <div className={styles.carouselWindow} aria-live="off">
        <div
          className={styles.slideTrack}
          style={{
            transform: `translateX(-${position * 100}%)`,
            transition:
              motion && !resetting
                ? "transform 600ms cubic-bezier(.25,.65,.25,1)"
                : "none",
          }}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "transform"
            )
              finish();
          }}
        >
          {panels.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${((index - 1 + count) % count) + 1} of ${count}: ${slide.label}`}
              aria-hidden={position !== index}
            >
              <picture>
                <source media="(max-width: 700px)" srcSet={slide.mobileImage} />
                <img
                  src={slide.desktopImage}
                  alt={position === index ? slide.alt : ""}
                  width="1774"
                  height="887"
                  loading={index === 1 ? "eager" : "lazy"}
                  fetchPriority={index === 1 ? "high" : "auto"}
                  style={{ objectPosition: slide.focalPoint }}
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.heroOverlay} aria-hidden="true" />

      {children}

      <div className={styles.carouselControls}>
        <div className={styles.slideIdentity} aria-hidden="true">
          <span>0{active + 1}</span>
          <span>
            {homeSlides[active].label}
            <small>{homeSlides[active].description}</small>
          </span>
        </div>
        <div className={styles.indicators} aria-label="Choose a product range">
          {homeSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              aria-label={`Show ${slide.label} slide`}
              aria-pressed={active === index}
              onClick={() => setPosition(index + 1)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className={styles.carouselButtons}>
          <button
            type="button"
            aria-label="Previous product slide"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={
              !motion
                ? "Autoplay disabled by reduced motion preference"
                : manualPause
                  ? "Play product slideshow"
                  : "Pause product slideshow"
            }
            disabled={!motion}
            onClick={() => setManualPause(!manualPause)}
          >
            {manualPause || !motion ? (
              <Play size={15} aria-hidden="true" />
            ) : (
              <Pause size={15} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next product slide"
            onClick={() => move(1)}
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      <span
        className={styles.srOnly}
        aria-live={manualPause || !motion ? "polite" : "off"}
      >
        {homeSlides[active].label}, slide {active + 1} of {count}
      </span>
    </div>
  );
}
