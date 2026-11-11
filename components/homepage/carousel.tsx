"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { homeSlides } from "@/lib/homepage-content";
import { ProductImage } from "./product-image";
import styles from "./homepage.module.css";
const count = homeSlides.length;
const panels = [homeSlides[count - 1], ...homeSlides, homeSlides[0]];
export function HeroCarousel() {
  const [position, setPosition] = useState(1),
    [resetting, setResetting] = useState(false),
    [motion, setMotion] = useState(false),
    [manualPause, setManualPause] = useState(false),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false),
    [visible, setVisible] = useState(true);
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
      () => setPosition((p) => Math.min(p + 1, count + 1)),
      5000,
    );
    return () => clearInterval(timer);
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
    setPosition((p) =>
      motion
        ? Math.max(0, Math.min(count + 1, p + direction))
        : ((p - 1 + direction + count) % count) + 1,
    );
  }
  function finish() {
    if (position === 0 || position === count + 1) {
      setResetting(true);
      setPosition(position === 0 ? count : 1);
    }
  }
  return (
    <section
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Wholesale product ranges"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x,
          dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
          move(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
      onTouchCancel={() => {
        touch.current = null;
      }}
    >
      <div className={styles.carouselTop}>
        <span>THE PRODUCT SHOWCASE</span>
        <span aria-hidden="true">
          0{active + 1} / 0{count}
        </span>
      </div>
      <div className={styles.carouselWindow}>
        <div
          className={styles.slideTrack}
          style={{
            transform: `translateX(-${position * 100}%)`,
            transition:
              motion && !resetting
                ? "transform 600ms cubic-bezier(.25,.65,.25,1)"
                : "none",
          }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === "transform")
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
              <div
                className={`${styles.slideProducts} ${slide.products.length === 1 ? styles.singleProduct : ""}`}
              >
                {slide.products.map((product, n) => (
                  <div className={styles.heroProductSlot} key={product.id}>
                    <ProductImage
                      product={product}
                      priority={index === 1 && n === 0}
                      sizes={
                        slide.products.length === 1
                          ? "(max-width: 760px) 85vw, 45vw"
                          : "(max-width: 760px) 28vw, 18vw"
                      }
                    />
                  </div>
                ))}
              </div>
              <div className={styles.slideCaption}>
                <h2>{slide.label}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.carouselControls}>
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
            <ChevronLeft size={18} aria-hidden="true" />
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
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next product slide"
            onClick={() => move(1)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <span
        className={styles.srOnly}
        aria-live={manualPause || !motion ? "polite" : "off"}
      >
        {homeSlides[active].label}, slide {active + 1} of {count}
      </span>
    </section>
  );
}
