"use client";

import React from "react";
import { ProjectItem } from "@/data/portfolioData";
import {
  ExternalLink,
  Eye,
  FolderGit2,
  Lock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface ProjectShowcaseDetailsProps {
  projects: ProjectItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenGallery: (project: ProjectItem) => void;
  className?: string;
}

export default function ProjectShowcaseDetails({
  projects,
  activeIndex,
  onSelectIndex,
  onOpenGallery,
  className = "",
}: ProjectShowcaseDetailsProps) {
  const current = projects[activeIndex] || projects[0];
  if (!current) return null;

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
        {/* Left Column: Project Info */}
        <div className="flex-1 space-y-3">
          {/* Header Row: Category + Confidentiality + Index indicator */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              {current.category}
            </span>

            {current.isPrivate === 1 ? (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1.5">
                <Lock size={12} className="text-amber-400" />
                <span>Enterprise NDA (Protected IP)</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                Public Showcase
              </span>
            )}

            <span className="ml-auto text-xs font-mono text-slate-400">
              {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {current.title}
            </h3>
            {current.subtitle && (
              <p className="text-xs sm:text-sm text-cyan-400 font-medium mt-0.5">
                {current.subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 md:line-clamp-none">
            {current.description}
          </p>

          {/* Key Highlights */}
          {current.highlights && current.highlights.length > 0 && (
            <div className="space-y-1.5 pt-1 hidden sm:block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Architectural Highlights:
              </span>
              <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                {current.highlights.slice(0, 4).map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Badges */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-1.5">
              {current.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Project Selector Navigation */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
          {/* Main Action CTAs */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onOpenGallery(current)}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:to-cyan-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye size={15} />
              <span>Full Gallery ({current.images?.length || 1})</span>
            </button>

            {current.liveUrl && (
              <a
                href={current.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all"
              >
                <ExternalLink size={14} />
                <span>Live</span>
              </a>
            )}

            {current.githubUrl && (
              <a
                href={current.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all"
              >
                <FolderGit2 size={14} />
                <span>Code</span>
              </a>
            )}
          </div>

          {/* Project Pagination Selector Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectIndex((activeIndex - 1 + projects.length) % projects.length)}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Previous Project"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex items-center gap-1">
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => onSelectIndex(idx)}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    idx === activeIndex
                      ? "w-6 bg-gradient-to-r from-blue-500 to-cyan-400"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  title={p.title}
                />
              ))}
            </div>

            <button
              onClick={() => onSelectIndex((activeIndex + 1) % projects.length)}
              className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Next Project"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
