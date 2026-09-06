"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem } from "@/data/portfolioData";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderGit2,
  Images,
  Lock,
  X,
} from "lucide-react";

interface Props {
  open: boolean;
  project?: ProjectItem | null;
  images?: string[];
  title?: string;
  onClose: () => void;
}

export default function GalleryModal({
  open,
  project,
  images: legacyImages,
  title: legacyTitle,
  onClose,
}: Props) {
  const images =
    project?.images && project.images.length > 0
      ? project.images
      : project?.image
        ? [project.image]
        : legacyImages || [];

  const title = project?.title || legacyTitle || "Project Details";

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrent(0);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && images.length > 1) {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight" && images.length > 1) {
        setCurrent((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, images.length, onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar for Mobile & Close Trigger */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border/70 bg-card/60 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[11px] font-bold text-blue-500">
                {project?.category || "Project Showcase"}
              </span>
              {project?.clientOrOrg && (
                <span className="text-xs font-semibold text-cyan-500">
                  • {project.clientOrOrg}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full border border-border bg-card/80 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>

          {/* 2-Section Grid: Left Images, Right Detailed Text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden flex-1">
            {/* LEFT SECTION: Screenshots & Image Carousel */}
            <div className="lg:col-span-7 bg-slate-950/95 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60 p-4 sm:p-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px]">
              {/* Main Image Stage */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-black/50 border border-white/10">
                {images.length > 0 ? (
                  <img
                    key={current}
                    src={images[current]}
                    alt={`${title} - Screenshot ${current + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/projects/eprescription-system/thumbnail.png";
                    }}
                    className="max-h-[45vh] lg:max-h-[52vh] w-full object-contain select-none transition-all duration-300"
                  />
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No screenshot available
                  </div>
                )}

                {/* Left/Right Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrent(
                          (prev) => (prev - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                      title="Previous Screenshot (Arrow Left)"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={() =>
                        setCurrent((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                      title="Next Screenshot (Arrow Right)"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter Badge */}
                {images.length > 0 && (
                  <div className="absolute top-2.5 left-2.5 rounded-md bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white/90 border border-white/15 flex items-center gap-1.5 shadow-md">
                    <Images size={12} className="text-blue-400" />
                    <span>
                      {current + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-2 overflow-x-auto py-1 px-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        current === idx
                          ? "border-blue-500 shadow-md shadow-blue-500/30 scale-105"
                          : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SECTION: Detailed Project Text & Metadata */}
            <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-y-auto max-h-[48vh] lg:max-h-full">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-tight">
                    {title}
                  </h3>
                  {project?.subtitle && (
                    <p className="text-xs text-blue-500 font-medium mt-0.5">
                      {project.subtitle}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Project Overview
                  </h4>
                  <p className="text-xs sm:text-[13px] text-muted-foreground/90 leading-relaxed text-justify">
                    {project?.description}
                  </p>
                </div>

                {/* Highlights / Responsibilities */}
                {project?.highlights && project.highlights.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Key Highlights & Contributions
                    </h4>
                    <div className="space-y-2">
                      {project.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-foreground/80 leading-snug"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-blue-500 shrink-0 mt-0.5"
                          />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies Stack */}
                {project?.technologies && project.technologies.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Technologies & Tools
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-card border border-border/80 px-2.5 py-1 text-[11px] font-medium text-foreground/90 shadow-2xs hover:border-blue-500/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons & Confidentiality Note */}
              <div className="mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {project?.isPrivate === 1 ? (
                    <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg font-medium">
                      <Lock size={12} className="text-amber-500 shrink-0" />
                      <span>
                        Private Enterprise Platform (Confidential / NDA)
                      </span>
                    </div>
                  ) : (
                    <>
                      {project?.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          <ExternalLink size={13} />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {project?.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted/70 text-foreground font-semibold text-xs transition-colors"
                        >
                          <FolderGit2 size={13} />
                          <span>Source Code</span>
                        </a>
                      )}
                    </>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-border bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground font-medium text-xs transition-colors cursor-pointer ml-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
