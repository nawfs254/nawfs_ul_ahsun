"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<
    "default" | "text" | "interactive" | "code"
  >("default");
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check for touch / mobile device
    const checkTouch = () => {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        window.innerWidth < 1024;
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hovered element type
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for code / pre elements
      if (target.closest("code, pre, .font-mono, [data-code]")) {
        setCursorType("code");
        return;
      }

      // Check for interactive clickable elements
      if (
        target.closest(
          "a, button, [role='button'], input, textarea, select, .cursor-pointer, [data-interactive]"
        )
      ) {
        setCursorType("interactive");
        return;
      }

      // Check for text content
      if (
        target.closest(
          "h1, h2, h3, h4, h5, h6, p, span, li, blockquote, label"
        )
      ) {
        setCursorType("text");
        return;
      }

      setCursorType("default");
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // 120fps direct physics interpolation loop
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animateLoop = () => {
      currentPos.current.x = lerp(
        currentPos.current.x,
        mousePos.current.x,
        0.22
      );
      currentPos.current.y = lerp(
        currentPos.current.y,
        mousePos.current.y,
        0.22
      );

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animateLoop);
    };

    rafId.current = requestAnimationFrame(animateLoop);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice) return null;

  // Configuration per cursor state
  const config = {
    default: {
      size: 32,
      label: null,
    },
    text: {
      size: 52,
      label: null,
    },
    interactive: {
      size: 58,
      label: "</>",
    },
    code: {
      size: 62,
      label: "{ }",
    },
  }[cursorType];

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform transition-opacity duration-200 select-none ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transform: "translate3d(-100px, -100px, 0)",
        mixBlendMode: "difference",
      }}
    >
      {/* Round Shady White / Lavender Cursor Circle with Difference Blend */}
      <motion.div
        animate={{
          width: config.size,
          height: config.size,
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
        className="relative flex items-center justify-center rounded-full bg-[#f3e8ff] -translate-x-1/2 -translate-y-1/2"
        style={{
          boxShadow:
            "0 0 22px rgba(216, 180, 254, 0.6), 0 0 40px rgba(168, 85, 247, 0.35)",
        }}
      >
        {/* Coding Vibe Micro Monospace Label */}
        <AnimatePresence mode="wait">
          {config.label && (
            <motion.span
              key={config.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.15 }}
              className="text-[11px] font-mono font-extrabold tracking-tight text-black select-none pointer-events-none"
            >
              {config.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Small center dot when in default mode */}
        {cursorType === "default" && (
          <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
        )}
      </motion.div>
    </div>
  );
}
