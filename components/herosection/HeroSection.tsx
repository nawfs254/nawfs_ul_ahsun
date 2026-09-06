"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { usePortfolioData } from "@/context/PortfolioContext";
import DynamicIcon from "../DynamicIcon";
import {
  ArrowRight,
  ChevronDown,
  Download,
  FileText,
  Mail,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  const { personal } = usePortfolioData();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleResume = () => {
    window.open(personal.cvPdfUrl, "_blank");
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-6 md:py-8 pb-20 overflow-hidden"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Intro & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>{personal.hiringStatus}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">{personal.location}</span>
            </div>

            {/* Main Greeting & Name */}
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-foreground leading-[1.2]">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                {personal.name}
              </span>
            </h1>

            {/* Subtitle / Role */}
            <h2 className="mt-2 text-lg sm:text-xl font-semibold text-foreground/80 flex flex-wrap items-center gap-2">
              <span>{personal.title}</span>
              <span className="text-blue-500 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                Orange Solutions LTD
              </span>
            </h2>

            {/* Short Objective & Description */}
            <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-xl">
              {personal.tagline}
            </p>

            <p className="mt-2 text-xs sm:text-sm text-muted-foreground/80 max-w-xl italic">
              "{personal.objective}"
            </p>

            {/* Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => scrollToSection("projects")}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted/70 text-foreground font-medium transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
              >
                <Mail size={15} className="text-blue-500" />
                <span>Contact Me</span>
              </button>

              <button
                onClick={handleResume}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted/70 text-foreground font-medium transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
              >
                <FileText size={15} className="text-cyan-500" />
                <span>View CV</span>
                <Download size={13} className="opacity-70" />
              </button>
            </div>

            {/* Social Icons & Connectivity */}
            <div className="mt-6 flex items-center gap-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                Find me on:
              </span>
              {personal.socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.name}
                  className="h-8 w-8 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 hover:-translate-y-0.5 transition-all duration-200 shadow-xs"
                >
                  <DynamicIcon
                    iconLibrary={link.iconLibrary}
                    icon={link.icon}
                    className="text-sm"
                  />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Avatar Portrait & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            {/* Portrait Image with Glowing Ring */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse" />

              <div className="relative h-48 w-48 sm:h-56 sm:w-56 lg:h-60 lg:w-60 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-xl overflow-hidden">
                <img
                  src={personal.profileImage}
                  alt={personal.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/profile.jpg";
                  }}
                  className="h-full w-full object-cover rounded-full bg-slate-900 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Technology Badge */}
              <div className="absolute -bottom-1 -right-1 sm:bottom-1 sm:right-1 rounded-xl border border-border/80 bg-background/90 backdrop-blur-md px-3 py-1.5 shadow-lg flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/15 text-blue-500 font-bold text-xs">
                  <Sparkles size={13} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-foreground leading-none">
                    React & Next.js
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    ERP & Web Architect
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 sm:mt-5 w-full max-w-md">
              {personal.stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs text-center hover:border-blue-500/40 hover:bg-card transition-all duration-200 shadow-xs"
                >
                  <span className="text-sm sm:text-base font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground mt-0.5 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Absolute Positioned Animated Scroll Down Indicator (Fades out when scrolled) */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.25 } }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer group z-20 select-none"
            onClick={() => scrollToSection("about")}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground group-hover:text-blue-500 transition-colors mb-1">
              Scroll Down
            </span>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-5 h-7.5 rounded-full border-2 border-muted-foreground/40 group-hover:border-blue-500/80 transition-colors flex justify-center p-1 shadow-xs bg-background/60 backdrop-blur-xs">
                <motion.div
                  animate={{ y: [0, 7, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-2 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50"
                />
              </div>
              <motion.div
                animate={{ y: [0, 3, 0], opacity: [0.4, 1, 0.4] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                className="text-muted-foreground/60 group-hover:text-blue-500 transition-colors -mt-0.5"
              >
                <ChevronDown size={14} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
