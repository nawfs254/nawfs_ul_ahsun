"use client";

import React, { ReactNode } from "react";
import { Lock, RefreshCw, ShieldCheck } from "lucide-react";

interface ComputerMonitorProps {
  children: ReactNode;
  activeUrl?: string;
  activeTabTitle?: string;
  className?: string;
  screenClassName?: string;
  is3d?: boolean;
}

export default function ComputerMonitor({
  children,
  activeUrl = "https://nawfs.dev",
  activeTabTitle = "Nawfs Ul Ahsun • Portfolio",
  className = "",
  screenClassName = "",
}: ComputerMonitorProps) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Ambient Backlight Glow behind the monitor */}
      <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-blue-600/30 via-cyan-500/25 to-teal-400/20 rounded-[40px] blur-3xl pointer-events-none opacity-70 transform -translate-z-10" />

      {/* Monitor Main Housing / Bezel */}
      <div className="relative w-full rounded-[18px] sm:rounded-[22px] md:rounded-[26px] p-2.5 sm:p-3 md:p-3.5 bg-gradient-to-b from-[#222733] via-[#141720] to-[#0d0f15] border border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_60px_rgba(30,144,255,0.15)]">
        {/* Subtle Metallic Top Bezel Highlight */}
        <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Top Bezel Center Camera & Sensor */}
        <div className="absolute top-1 sm:top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-950 border border-slate-700/80 shadow-inner flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-cyan-400/90 shadow-[0_0_4px_#38bdf8]" />
          </div>
          <div className="w-1 h-1 rounded-full bg-emerald-500/80 shadow-[0_0_3px_#10b981]" />
        </div>

        {/* Monitor Screen Glass / Viewport Frame */}
        <div className="relative w-full aspect-[16/10] bg-[#07090e] rounded-[10px] sm:rounded-[14px] overflow-hidden border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] flex flex-col">
          {/* Browser Chrome / Header Bar */}
          <div className="h-7 sm:h-8 md:h-9 bg-[#11141b]/95 border-b border-white/10 px-2 sm:px-3 flex items-center justify-between shrink-0 z-30 backdrop-blur-md">
            {/* macOS Style Traffic Light Window Controls */}
            <div className="flex items-center gap-1.5 w-16 sm:w-20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-[0_0_4px_rgba(255,95,86,0.3)] transition-transform hover:scale-110 cursor-pointer" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-[0_0_4px_rgba(255,189,46,0.3)] transition-transform hover:scale-110 cursor-pointer" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-[0_0_4px_rgba(39,201,63,0.3)] transition-transform hover:scale-110 cursor-pointer" />
            </div>

            {/* Address Bar with Lock and URL */}
            <div className="flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm mx-1 sm:mx-2">
              <div className="h-5 sm:h-6 px-2 sm:px-2.5 rounded-md bg-[#090b10]/90 border border-white/10 flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300 font-mono shadow-inner overflow-hidden">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock size={10} className="text-emerald-400 shrink-0" />
                  <span className="truncate text-slate-300" title={activeTabTitle}>{activeUrl}</span>
                </div>
                <RefreshCw size={9} className="text-slate-500 hover:text-slate-300 shrink-0 hidden sm:block transition-colors" />
              </div>
            </div>

            {/* Right Status / Security Pill */}
            <div className="w-16 sm:w-20 flex justify-end items-center gap-1 text-[9px] text-slate-400 font-medium">
              <ShieldCheck size={11} className="text-cyan-400 hidden sm:block" />
              <span className="text-[9px] sm:text-[10px] text-cyan-400/90 font-mono hidden md:inline">200 OK</span>
            </div>
          </div>

          {/* Screen Content Viewport Area */}
          <div className={`relative flex-1 w-full overflow-hidden bg-gradient-to-b from-[#080b12] to-[#040609] ${screenClassName}`}>
            {children}

            {/* Glass Glare / Specular Reflection Sheen (Layered over screen without blocking pointer events) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.05] via-white/[0.01] to-transparent z-20" />
            <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none bg-gradient-to-l from-cyan-500/[0.02] to-transparent z-20" />
          </div>
        </div>

        {/* Bottom Bezel / Chin */}
        <div className="relative pt-1.5 sm:pt-2 flex items-center justify-between px-3 text-slate-500">
          <div className="w-8" />
          {/* Centered Minimalist Logo / Branding */}
          <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold text-slate-400">
              NAWFS ULTRA
            </span>
          </div>
          {/* Power Status LED */}
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Monitor Stand: Neck */}
      <div className="relative w-12 sm:w-16 md:w-20 h-6 sm:h-8 md:h-10 bg-gradient-to-b from-[#1b1f2b] via-[#151821] to-[#0f1118] border-x border-white/10 shadow-lg -mt-1 z-0 flex items-center justify-center">
        {/* Cable Pass-through Hole */}
        <div className="w-4 sm:w-6 h-2 sm:h-3 rounded-full bg-slate-950/90 border border-white/10 shadow-inner" />
      </div>

      {/* Monitor Stand: Base Plate */}
      <div className="relative w-36 sm:w-48 md:w-56 h-2.5 sm:h-3.5 bg-gradient-to-b from-[#262c3d] via-[#1c212d] to-[#12141c] rounded-t-sm rounded-b-md border border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.7)] z-0">
        {/* Specular highlight on front edge of base plate */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20" />
      </div>

      {/* Realistic Multi-Layer Contact Shadow on the Desk / Surface */}
      <div className="w-48 sm:w-64 md:w-80 h-3 sm:h-4 bg-black/90 blur-[6px] rounded-full -mt-1 pointer-events-none" />
      <div className="w-64 sm:w-80 md:w-[420px] h-6 sm:h-8 bg-black/50 blur-[18px] rounded-full -mt-3 pointer-events-none" />
    </div>
  );
}
