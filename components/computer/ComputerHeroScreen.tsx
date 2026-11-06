"use client";

import React from "react";
import { Sparkles, Activity } from "lucide-react";
import { usePortfolioData } from "@/context/PortfolioContext";

export default function ComputerHeroScreen() {
  const { personal } = usePortfolioData();

  return (
    <div className="relative w-full h-full p-3 sm:p-4 md:p-5 flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#0a0e17] via-[#090c14] to-[#06080d]">
      {/* Background Grid Pattern & Ambient Radial Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Status Bar inside screen */}
      <div className="relative w-full flex items-center justify-between text-[8px] sm:text-[10px] text-muted-foreground z-10 border-b border-white/5 pb-1 sm:pb-1.5">
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>PORTFOLIO_OS // v2.6.4</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-mono">
          <Activity size={10} className="text-cyan-400" />
          <span>Status: Available for Hire</span>
        </div>
      </div>

      {/* Centerpiece: Glowing Portrait Visual & Floating Badge */}
      <div className="relative my-auto flex flex-col items-center justify-center z-10 py-1">
        <div className="relative group">
          {/* Animated Pulsing Gradient Glow Ring */}
          <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full blur-md opacity-70 animate-pulse transition duration-500" />

          {/* Portrait Container */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-36 md:w-36 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-cyan-400 to-emerald-400 shadow-2xl overflow-hidden">
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
          <div className="absolute -bottom-1 -right-3 sm:-bottom-1.5 sm:-right-4 rounded-lg sm:rounded-xl border border-white/20 bg-background/90 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-xl flex items-center gap-1.5">
            <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-md bg-blue-500/20 text-blue-400 font-bold">
              <Sparkles size={11} />
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-bold text-foreground leading-none">
                React & Next.js
              </p>
              <p className="text-[7px] sm:text-[8px] text-muted-foreground mt-0.5">
                ERP & Web Architect
              </p>
            </div>
          </div>
        </div>

        {/* Quick Micro Tagline */}
        <div className="mt-2 text-center">
          <p className="text-[10px] sm:text-xs font-semibold text-foreground/90">
            {personal.name}
          </p>
          <p className="text-[8px] sm:text-[9px] text-cyan-400/80 font-mono">
            {personal.title}
          </p>
        </div>
      </div>

      {/* Bottom Quick Stats Grid inside screen */}
      <div className="relative w-full max-w-sm grid grid-cols-3 gap-1.5 sm:gap-2 z-10 pt-1">
        {personal.stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center py-1 px-1 sm:py-1.5 sm:px-2 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-xs text-center shadow-xs hover:border-blue-500/40 transition-colors"
          >
            <span className="text-[10px] sm:text-xs md:text-sm font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              {stat.value}
            </span>
            <span className="text-[7px] sm:text-[8px] font-medium text-slate-400 line-clamp-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
