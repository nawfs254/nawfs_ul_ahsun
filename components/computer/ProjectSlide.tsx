"use client";

import React from "react";
import { ProjectItem } from "@/data/portfolioData";
import {
  ExternalLink,
  Eye,
  Images,
  Lock,
  ChevronDown,
} from "lucide-react";

interface ProjectSlideProps {
  project: ProjectItem;
  isActive?: boolean;
  onOpenGallery?: (project: ProjectItem) => void;
  scrollOffset?: number; // 0 to 1 for vertical scrolling website preview
}

export default function ProjectSlide({
  project,
  onOpenGallery,
}: ProjectSlideProps) {
  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.image];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#06080d]">
      {/* Website Viewport Content */}
      <div className="relative flex-1 w-full overflow-hidden bg-slate-950 group">
        {/* Webpage Preview Container */}
        <div className="absolute inset-x-0 top-0 will-change-transform">
          <img
            src={images[0] || project.image}
            alt={project.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/projects/eprescription-system/thumbnail.png";
            }}
            className="w-full object-cover object-top shadow-2xl block"
          />

          {/* Secondary preview image if available for continuous scroll illusion */}
          {images.length > 1 && (
            <img
              src={images[1 % images.length]}
              alt={`${project.title} preview 2`}
              className="w-full object-cover object-top block border-t border-slate-800"
            />
          )}
        </div>

        {/* Ambient Top Gradient Shadow for depth */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

        {/* Floating Category & Image Counter Badges inside screen */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-semibold shadow-xs">
              {project.category}
            </span>
            {project.isPrivate === 1 && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-semibold flex items-center gap-1 shadow-xs">
                <Lock size={8} />
                <span>NDA / Enterprise</span>
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-mono flex items-center gap-1 shadow-xs">
              <Images size={9} />
              <span>{images.length} Views</span>
            </div>
          )}
        </div>

        {/* Subtle Webpage Scroll Guide Indicator */}
        <div className="absolute bottom-12 right-2.5 z-20 pointer-events-none hidden sm:flex items-center gap-1 text-[7px] text-white/70 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
          <span>Scroll to inspect</span>
          <ChevronDown size={8} className="animate-bounce" />
        </div>

        {/* Interactive Bottom Overlay Bar inside Monitor */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 bg-gradient-to-t from-black via-black/90 to-transparent z-20 flex items-center justify-between backdrop-blur-xs">
          <div className="max-w-[70%] truncate">
            <h4 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-white truncate">
              {project.title}
            </h4>
            <p className="text-[8px] sm:text-[9px] text-slate-300 truncate hidden sm:block">
              {project.subtitle || project.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenGallery && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenGallery(project);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-[8px] sm:text-[9px] font-semibold flex items-center gap-1 shadow-md shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Eye size={9} />
                <span>Gallery</span>
              </button>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[8px] sm:text-[9px] font-medium flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={9} />
                <span className="hidden sm:inline">Live</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
