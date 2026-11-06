"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ProjectSideInfoProps {
  project: ProjectItem;
  activeIndex: number;
  totalProjects: number;
  projects: ProjectItem[];
  onSelectIndex: (index: number) => void;
  onOpenGallery: (project: ProjectItem) => void;
  className?: string;
}

export default function ProjectSideInfo({
  project,
  activeIndex,
  totalProjects,
  onSelectIndex,
  onOpenGallery,
  className = "",
}: ProjectSideInfoProps) {
  if (!project) return null;

  return (
    <div
      className={`flex flex-col justify-between w-full max-w-xl text-left select-none transition-all duration-300 ${className}`}
    >
      {/* Top Meta Row: Category Badge + Project Counter Number */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
            {project.category}
          </span>

          {project.isPrivate === 1 ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-medium flex items-center gap-1">
              <Lock size={9} className="text-amber-400" />
              <span>NDA Enterprise</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-medium">
              Public Live
            </span>
          )}
        </div>

        {/* Large Styled Project Number Counter */}
        <div className="flex items-baseline font-mono">
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-slate-500 text-[11px] font-semibold ml-1">
            / {String(totalProjects).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Main Content Area with Smooth Crossfade on Project Change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="py-2 space-y-1.5"
        >
          {/* Project Title & Subtitle */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {project.description}
          </p>

          {/* Detailed Architecture & Feature Highlights (2 concise highlights) */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-0.5 pt-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                Key Highlights:
              </span>
              <ul className="space-y-0.5 text-[10px] text-slate-300">
                {project.highlights.slice(0, 2).map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2
                      size={11}
                      className="text-cyan-400 shrink-0 mt-0.5"
                    />
                    <span className="line-clamp-1">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Stack Badges */}
          <div className="pt-0.5">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-200 text-[9px] font-mono hover:border-blue-500/40 hover:bg-white/[0.08] transition-colors"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 6 && (
                <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono">
                  +{project.technologies.length - 6}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Row: Actions & Project Navigation Controls */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
        {/* Action CTAs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenGallery(project)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-700 hover:to-cyan-600 text-white text-[10px] font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Eye size={12} />
            <span>Full Gallery ({project.images?.length || 1})</span>
          </button>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[10px] font-medium flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={11} />
              <span>Live</span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[10px] font-medium flex items-center gap-1 transition-colors"
            >
              <FolderGit2 size={11} />
              <span>Code</span>
            </a>
          )}
        </div>

        {/* Quick Prev / Next Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onSelectIndex((activeIndex - 1 + totalProjects) % totalProjects)
            }
            aria-label="Previous project"
            className="h-6 w-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={() => onSelectIndex((activeIndex + 1) % totalProjects)}
            aria-label="Next project"
            className="h-6 w-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
