"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades/slides [data-reveal] elements in as they scroll into view.
 * Content stays visible without JavaScript; CSS in globals.css only hides
 * elements once <html> has .reveal-ready, and skips motion entirely for
 * prefers-reduced-motion.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      root.classList.remove("reveal-ready");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );
    // Anything already on screen is revealed on the next frame so the hero
    // animates in instead of popping.
    root.classList.add("reveal-ready");
    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
