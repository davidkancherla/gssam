"use client";

import { useEffect, useRef } from "react";

/**
 * Google Maps embeds can fire load/navigation events that make Next.js
 * remount the surrounding RSC tree. Build the iframe outside React's
 * child list so that load cannot reset sibling form state.
 */
export function IsolatedMap({ src, title }: { src: string; title: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.querySelector("iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.title = title;
    iframe.src = src;
    iframe.className = "h-72 w-full border-0";
    iframe.setAttribute("loading", "eager");
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    // Allow the map to run, but not to navigate the church page.
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox",
    );
    iframe.addEventListener("load", (event) => {
      event.stopPropagation();
    });
    host.appendChild(iframe);
  }, [src, title]);

  return (
    <div
      ref={hostRef}
      className="mt-8 h-72 overflow-hidden rounded-2xl border border-line bg-cream"
      aria-label={title}
    />
  );
}
