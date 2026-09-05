"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function ScrollNavigationDots() {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3.5 pointer-events-auto">
      <div className="flex flex-col items-center gap-3 p-2 rounded-full bg-background/60 backdrop-blur-md border border-border/50 shadow-lg">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;

          return (
            <div
              key={section.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {/* Tooltip Label */}
              <AnimatePresence>
                {(isHovered || isActive) && (
                  <motion.span
                    initial={{ opacity: 0, x: 10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-7 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shadow-md pointer-events-none ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    {section.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Dot Button */}
              <button
                onClick={() => scrollTo(section.id)}
                aria-label={`Scroll to ${section.label}`}
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-4 w-4 bg-blue-500/20"
                    : "h-3 w-3 hover:scale-125"
                }`}
              >
                <motion.div
                  layout
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-2.5 w-2.5 bg-gradient-to-r from-blue-600 to-cyan-400 shadow-md shadow-blue-500/50"
                      : "h-1.5 w-1.5 bg-muted-foreground/50 hover:bg-foreground"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
