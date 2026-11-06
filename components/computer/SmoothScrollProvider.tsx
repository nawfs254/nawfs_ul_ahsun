"use client";

import React, { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: false,
      autoResize: true,
    });

    (window as any).lenis = lenis;

    // Direct synchronization between Lenis and GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Dynamic dimension synchronization:
    // Guarantees Lenis's scroll limit and GSAP triggers match actual document height,
    // so scrolling never gets clamped early before reaching the bottom/footer.
    const syncDimensions = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    // 1. Continuous DOM ResizeObserver on document.body and document.documentElement
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        syncDimensions();
      });
      if (document.body) resizeObserver.observe(document.body);
      if (document.documentElement) resizeObserver.observe(document.documentElement);
    }

    // 2. Delayed checks on mount to catch asynchronous font loading, image layout, or dynamic MongoDB data
    const timers = [50, 150, 300, 600, 1200, 2500, 4000].map((delay) =>
      setTimeout(syncDimensions, delay)
    );

    // 3. Window load and orientation changes
    window.addEventListener("load", syncDimensions);
    window.addEventListener("resize", syncDimensions);
    window.addEventListener("orientationchange", syncDimensions);

    // 4. Near-bottom check: ensure limit is never truncated when approaching footer
    const handleScrollNearBottom = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      if (scrollY + winHeight >= docHeight - 350) {
        lenis.resize();
      }
    };
    lenis.on("scroll", handleScrollNearBottom);

    // 5. Observer to automatically freeze background window scroll when a modal is open
    const modalObserver = new MutationObserver(() => {
      if (document.body.classList.contains("modal-open")) {
        lenis.stop();
      } else {
        lenis.start();
        syncDimensions();
      }
    });

    modalObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      timers.forEach(clearTimeout);
      if (resizeObserver) resizeObserver.disconnect();
      modalObserver.disconnect();
      window.removeEventListener("load", syncDimensions);
      window.removeEventListener("resize", syncDimensions);
      window.removeEventListener("orientationchange", syncDimensions);
      lenis.off("scroll", handleScrollNearBottom);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
