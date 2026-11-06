"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = 18;
  const circumference = 2 * Math.PI * radius; // ~113.097

  useEffect(() => {
    let ticking = false;

    const updateRing = (progress: number) => {
      const clamped = Math.min(1, Math.max(0, progress));
      if (circleRef.current) {
        const offset = circumference - clamped * circumference;
        circleRef.current.style.strokeDashoffset = `${offset}`;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

          const shouldShow = scrollY > 250;
          setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));

          if (docHeight > 0) {
            updateRing(scrollY / docHeight);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Attach to Lenis if active
    let cleanupLenis: (() => void) | undefined;
    const attachLenis = () => {
      if (typeof window !== "undefined" && (window as any).lenis) {
        const lenis = (window as any).lenis;
        const lenisHandler = (e: any) => {
          const scrollY =
            typeof e.scroll === "number" ? e.scroll : window.scrollY || 0;
          const shouldShow = scrollY > 250;
          setIsVisible((prev) => (prev !== shouldShow ? shouldShow : prev));

          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            updateRing(scrollY / totalHeight);
          } else if (typeof e.progress === "number") {
            updateRing(e.progress);
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
        window.removeEventListener("scroll", handleScroll);
        if (cleanupLenis) cleanupLenis();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (cleanupLenis) cleanupLenis();
    };
  }, [circumference]);

  const scrollToTop = () => {
    if (typeof window !== "undefined" && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group flex h-11 w-11 items-center justify-center rounded-full bg-background/85 dark:bg-card/90 backdrop-blur-md border border-border/80 text-foreground shadow-lg shadow-black/10 hover:border-blue-500/60 hover:text-blue-500 hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {/* Circular SVG Scroll Progress Ring */}
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            width="44"
            height="44"
            viewBox="0 0 44 44"
          >
            {/* Background Track */}
            <circle
              cx="22"
              cy="22"
              r={radius}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-border/40"
            />
            {/* Dynamic Progress Fill - updated directly via ref for 120fps smoothness */}
            <circle
              ref={circleRef}
              cx="22"
              cy="22"
              r={radius}
              stroke="url(#scroll-top-gradient)"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              fill="transparent"
              className="will-change-[stroke-dashoffset]"
            />
            <defs>
              <linearGradient
                id="scroll-top-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Up Arrow Icon */}
          <ArrowUp
            size={18}
            className="text-muted-foreground group-hover:text-blue-500 group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
