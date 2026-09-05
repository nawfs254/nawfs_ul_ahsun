"use client";

import React from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import DynamicIcon from "../DynamicIcon";
import { ArrowUp, Heart } from "lucide-react";

export default function Footer() {
  const { personal } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto border-t border-border/60 bg-background/80 backdrop-blur-md pb-6 pt-8 z-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-border/40">
          {/* Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-base shadow-sm shadow-blue-500/20">
              N
            </div>
            <div>
              <span className="font-bold text-foreground text-sm tracking-tight block">
                {personal.name}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                {personal.title}
              </span>
            </div>
          </div>

          {/* Quick nav links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground font-medium">
            <a href="#home" className="hover:text-blue-500 transition-colors">Home</a>
            <a href="#about" className="hover:text-blue-500 transition-colors">About</a>
            <a href="#experience" className="hover:text-blue-500 transition-colors">Experience</a>
            <a href="#skills" className="hover:text-blue-500 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-blue-500 transition-colors">Projects</a>
            <a href="#education" className="hover:text-blue-500 transition-colors">Education</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors">Contact</a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {personal.socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="
                  group flex h-8 w-8 items-center justify-center
                  rounded-lg border border-border/70 bg-card/60
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500
                "
              >
                <DynamicIcon
                  iconLibrary={link.iconLibrary}
                  icon={link.icon}
                  className="text-sm text-muted-foreground group-hover:text-blue-500 transition-colors"
                />
              </Link>
            ))}

            <button
              onClick={scrollToTop}
              title="Back to Top"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg border border-border/70 bg-card/60
                text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10
                transition-all duration-200 hover:-translate-y-0.5
              "
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} {personal.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed & Built with <Heart size={11} className="text-red-500 fill-red-500" /> in Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
