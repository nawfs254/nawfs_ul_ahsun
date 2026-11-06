"use client";

import React, { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;

    const setBarProgress = (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      // Using GPU-accelerated translate3d from -100% to 0% with zero layout reflows
      bar.style.transform = `translate3d(${-100 + clamped * 100}%, 0, 0)`;
    };

    const handleWindowScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;

          if (totalHeight > 0) {
            setBarProgress(scrollY / totalHeight);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("resize", handleWindowScroll, { passive: true });
    handleWindowScroll();

    // Attach to Lenis smooth scroll for direct 120fps sync
    let cleanupLenis: (() => void) | undefined;
    const attachLenis = () => {
      if (typeof window !== "undefined" && (window as any).lenis) {
        const lenis = (window as any).lenis;
        const lenisHandler = (e: any) => {
          const scrollY =
            typeof e.scroll === "number" ? e.scroll : window.scrollY || 0;
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setBarProgress(scrollY / totalHeight);
          } else if (typeof e.progress === "number") {
            setBarProgress(e.progress);
          }
        };
        lenis.on("scroll", lenisHandler);
        cleanupLenis = () => lenis.off("scroll", lenisHandler);
        return true;
      }
      return false;
    };

    if (!attachLenis()) {
      const timer = setTimeout(attachLenis, 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("scroll", handleWindowScroll);
        window.removeEventListener("resize", handleWindowScroll);
        if (cleanupLenis) cleanupLenis();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
      window.removeEventListener("resize", handleWindowScroll);
      if (cleanupLenis) cleanupLenis();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] sm:h-[3.5px] z-[9999] pointer-events-none overflow-hidden bg-transparent">
      {/* Background track subtle guide */}
      <div className="absolute inset-0 bg-blue-500/10 dark:bg-white/5" />

      {/* GPU Accelerated Smooth Progress Bar */}
      <div
        ref={barRef}
        className="w-full h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 relative will-change-transform shadow-[0_0_12px_rgba(56,189,248,0.7)]"
        style={{
          transform: "translate3d(-100%, 0, 0)",
        }}
      >
        {/* Glowing tip accent at the exact leading edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8,0_0_16px_#3b82f6]" />
      </div>
    </div>
  );
}
