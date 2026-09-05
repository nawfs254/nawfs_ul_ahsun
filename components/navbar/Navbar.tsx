"use client";

import React, { useEffect, useState } from "react";
import NavBtn from "./NavBtn";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section spy
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleResume = () => {
    const pdfUrl = portfolioData.personal.cvPdfUrl || "/assets/cv.pdf";
    window.open(pdfUrl, "_blank");

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Nawfs_Ul_Ahsun_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScrollTo = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (typeof document === "undefined" || !("startViewTransition" in document)) {
      setTheme(nextTheme);
      return;
    }

    // Origin: bottom-left corner of the screen
    const x = 0;
    const y = window.innerHeight;
    const endRadius = Math.hypot(window.innerWidth, window.innerHeight);

    // Run View Transition
    const transition = (document as any).startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60 shadow-xs"
          : "bg-background/50 backdrop-blur-xs border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleScrollTo("home");
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            N
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground tracking-tight text-base group-hover:text-blue-500 transition-colors">
              nawfs.dev
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest -mt-1 font-semibold">
              Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-muted/40 p-1 rounded-2xl border border-border/50">
          {navLinks.map((link) => (
            <NavBtn
              key={link.href}
              label={link.label}
              href={link.href}
              isActive={activeSection === link.href.substring(1)}
            />
          ))}
        </nav>

        {/* Action Buttons & Theme Controls */}
        <div className="flex items-center gap-2.5">
          {/* Resume Download / Preview */}
          <button
            onClick={handleResume}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium text-xs md:text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            title="Preview & Download CV"
          >
            <FileText size={15} />
            <span>Resume</span>
            <Download size={13} className="opacity-80" />
          </button>

          {/* Dark Mode Toggle with Bottom-Left Animated Corner Wipe */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-card hover:bg-muted/70 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-slate-700" />
              )}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 lg:hidden items-center justify-center rounded-xl border border-border/60 bg-card hover:bg-muted/70 transition-all duration-200"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl px-6 py-5 shadow-xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const secId = link.href.substring(1);
                const isActive = activeSection === secId;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleScrollTo(secId)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-left font-medium transition-all ${
                      isActive
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                );
              })}

              <div className="pt-3">
                <button
                  onClick={handleResume}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-sm shadow-md"
                >
                  <FileText size={16} />
                  <span>Download CV</span>
                  <Download size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
