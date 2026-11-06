"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePortfolioData } from "@/context/PortfolioContext";
import ComputerMonitor from "../computer/ComputerMonitor";
import ProjectScreen from "../computer/ProjectScreen";
import ProjectSideInfo from "../computer/ProjectSideInfo";
import GalleryModal from "./GalleryModal";
import { ProjectItem } from "@/data/portfolioData";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

interface ProjectsSectionProps {
  activeProjectIndex?: number;
  innerProjectProgress?: number;
  onSelectIndex?: (index: number) => void;
  isDesktopFlightActive?: boolean;
}

export default function ProjectsSection({
  activeProjectIndex = 0,
  innerProjectProgress = 0,
  onSelectIndex,
  isDesktopFlightActive = false,
}: ProjectsSectionProps) {
  const { projects } = usePortfolioData();
  const [selectedGalleryProject, setSelectedGalleryProject] =
    useState<ProjectItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Local state for active index
  const [localIndex, setLocalIndex] = useState(0);

  // Synchronize with flight scroll event
  React.useEffect(() => {
    const handleProjectScroll = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number; progress: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === "number") {
        setLocalIndex(customEvent.detail.index);
      }
    };
    window.addEventListener("portfolio-project-scroll", handleProjectScroll);
    return () =>
      window.removeEventListener("portfolio-project-scroll", handleProjectScroll);
  }, []);

  const showcaseProjects = useMemo(() => {
    return projects && projects.length > 0 ? projects : [];
  }, [projects]);

  const currentIndex = isDesktopFlightActive ? localIndex : activeProjectIndex || localIndex;
  const currentProject = showcaseProjects[currentIndex] || showcaseProjects[0];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active project button into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-project-idx="${currentIndex}"]`
      ) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  const scrollButtons = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSelect = (idx: number) => {
    setLocalIndex(idx);
    if (onSelectIndex) {
      onSelectIndex(idx);
    }

    // Broadcast select event to update monitor screen immediately
    window.dispatchEvent(
      new CustomEvent("portfolio-project-select", {
        detail: { index: idx },
      })
    );
    window.dispatchEvent(
      new CustomEvent("portfolio-project-scroll", {
        detail: { index: idx },
      })
    );

    // If on desktop and #projects is pinned in sticky track, scroll to that project's scroll position
    const sectionEl = document.getElementById("projects");
    if (sectionEl && isDesktopFlightActive) {
      const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
      const scrollableDistance = sectionEl.offsetHeight - window.innerHeight;
      if (scrollableDistance > 0 && showcaseProjects.length > 0) {
        // Map index to progress between 0 and 0.88
        const targetProgress = ((idx + 0.5) / showcaseProjects.length) * 0.88;
        const targetScroll = sectionTop + targetProgress * scrollableDistance;

        if (typeof window !== "undefined" && (window as any).lenis) {
          (window as any).lenis.scrollTo(targetScroll, { duration: 0.8 });
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }
    }
  };

  const openGalleryForProject = (project: ProjectItem) => {
    setSelectedGalleryProject(project);
    setIsGalleryOpen(true);
  };

  const currentUrl = `https://nawfs.dev/work/${currentProject?.id || "eprescription"}`;
  const currentTab = `${currentProject?.title || "Project"} • Preview`;

  return (
    <section
      id="projects"
      style={
        {
          "--projects-track-height": `${Math.max(300, showcaseProjects.length * 65)}vh`,
        } as React.CSSProperties
      }
      className="relative w-full border-t border-border/40 bg-transparent z-30 py-8 lg:py-0 min-h-0 lg:min-h-[var(--projects-track-height,350vh)]"
    >
      {/* Background Ambient Glow Accents safely contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* =========================================================================
          DESKTOP VIEW (>= 1024px): Pinned 350vh Sticky Track for 3D Flying Computer
          ========================================================================= */}
      <div className="hidden lg:flex sticky top-0 h-screen w-full flex-col justify-between z-20 px-6 py-3">
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-between my-auto py-2">
          {/* Section Header */}
          <div className="flex flex-row items-center justify-between gap-2 mb-5 pb-2 border-b border-border/40 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Featured Work
              </div>
              <h2 className="mt-0.5 text-2xl font-extrabold tracking-tight text-foreground">
                Key Enterprise Projects
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-500 text-[10px] font-medium shrink-0">
              <Lock size={10} className="shrink-0 text-amber-500" />
              <span>
                <strong>Confidential NDA:</strong> Direct gallery previews provided.
              </span>
            </div>
          </div>

          {/* 2-Column Showcase Area: Monitor on Left, Info on Right */}
          <div className="grid grid-cols-12 gap-10 items-center flex-1">
            {/* Left: Computer Docking Zone */}
            <div className="col-span-7 flex justify-center items-center w-full min-h-[380px]">
              <div
                id="projects-computer-dock"
                className="w-full max-w-[500px] aspect-[16/10] opacity-0 pointer-events-none"
              />
            </div>

            {/* Right: Project Information Panel */}
            <div className="col-span-5 w-full flex justify-center">
              <div className="w-full max-w-xl p-5 rounded-2xl border border-border/80 bg-card/85 backdrop-blur-xl shadow-xl">
                <ProjectSideInfo
                  project={currentProject}
                  activeIndex={currentIndex}
                  totalProjects={showcaseProjects.length}
                  projects={showcaseProjects}
                  onSelectIndex={handleSelect}
                  onOpenGallery={openGalleryForProject}
                />
              </div>
            </div>
          </div>

          {/* Bottom Project List Switcher Bar (Handles 5, 7, 10+ projects gracefully) */}
          <div className="mt-4 pt-3 border-t border-border/40 w-full shrink-0">
            <div className="flex items-center gap-2 w-full">
              {/* Left Scroll Arrow for > 5 projects */}
              {showcaseProjects.length > 5 && (
                <button
                  onClick={() => scrollButtons("left")}
                  aria-label="Scroll left projects"
                  className="h-9 w-7 shrink-0 rounded-lg border border-border/70 bg-card/80 hover:bg-card hover:border-blue-500/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {/* Scrollable / Flexible Buttons Track */}
              <div
                ref={scrollContainerRef}
                className={`flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none w-full ${
                  showcaseProjects.length <= 5 ? "grid grid-cols-5" : ""
                }`}
              >
                {showcaseProjects.map((p, idx) => {
                  const isActive = currentIndex === idx;
                  return (
                    <button
                      key={p.id || p.title + idx}
                      data-project-idx={idx}
                      onClick={() => handleSelect(idx)}
                      title={`View project: ${p.title}`}
                      className={`group relative flex flex-col p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                        showcaseProjects.length > 5
                          ? "min-w-[190px] xl:min-w-[210px] shrink-0"
                          : "w-full"
                      } ${
                        isActive
                          ? "bg-blue-500/15 border-blue-500/70 shadow-sm shadow-blue-500/25 text-foreground ring-1 ring-blue-500/40"
                          : "bg-card/60 hover:bg-card/90 border-border/60 hover:border-blue-500/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {/* Top row: Project Index & Active Indicator */}
                      <div className="flex items-center justify-between w-full mb-1">
                        <span
                          className={`font-mono text-[10px] font-bold ${
                            isActive
                              ? "text-blue-500 dark:text-cyan-400"
                              : "text-muted-foreground/70 group-hover:text-blue-500"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {isActive ? (
                          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/60 animate-pulse" />
                        ) : (
                          <span className="text-[9px] font-mono text-muted-foreground/30 group-hover:text-blue-500 transition-colors">
                            •
                          </span>
                        )}
                      </div>

                      {/* Project Title */}
                      <span className="text-[11px] font-semibold leading-snug line-clamp-1 truncate w-full">
                        {p.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Scroll Arrow for > 5 projects */}
              {showcaseProjects.length > 5 && (
                <button
                  onClick={() => scrollButtons("right")}
                  aria-label="Scroll right projects"
                  className="h-9 w-7 shrink-0 rounded-lg border border-border/70 bg-card/80 hover:bg-card hover:border-blue-500/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW (< 1024px): Clean, Natural Flow with Desktop Computer & Card
          Never trapped in sticky overflow; works seamlessly at any viewport height!
          ========================================================================= */}
      <div className="lg:hidden max-w-xl mx-auto px-4 py-4 flex flex-col gap-5 z-20">
        {/* Section Header */}
        <div className="flex flex-row items-center justify-between gap-2 pb-3 border-b border-border/40">
          <div>
            <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              Featured Work
            </div>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-foreground">
              Key Enterprise Projects
            </h2>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-500 text-[10px] font-medium shrink-0">
            <Lock size={10} className="shrink-0 text-amber-500" />
            <span className="font-semibold">NDA Enterprise</span>
          </div>
        </div>

        {/* Realistic Desktop Computer Monitor with Project Viewport */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[340px] sm:max-w-[420px]">
            <ComputerMonitor
              activeUrl={currentUrl}
              activeTabTitle={currentTab}
            >
              <div className="relative w-full h-full">
                <ProjectScreen
                  projects={showcaseProjects}
                  activeIndex={localIndex}
                  onOpenGallery={openGalleryForProject}
                />
              </div>
            </ComputerMonitor>
          </div>
        </div>

        {/* Project Selector Named Buttons for Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full">
          {showcaseProjects.map((proj, idx) => {
            const isActive = idx === localIndex;
            return (
              <button
                key={proj.id}
                onClick={() => handleSelect(idx)}
                aria-label={`View project ${idx + 1}: ${proj.title}`}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-left transition-all duration-200 cursor-pointer shrink-0 border text-xs ${
                  isActive
                    ? "bg-blue-500/15 border-blue-500/70 shadow-sm shadow-blue-500/25 text-foreground font-semibold"
                    : "bg-card/60 hover:bg-card/90 border-border/60 text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[10px] text-blue-500 font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate max-w-[150px]">{proj.title}</span>
              </button>
            );
          })}
        </div>

        {/* Project Information Panel */}
        <div className="w-full">
          <div className="w-full p-4 rounded-2xl border border-border/80 bg-card/85 backdrop-blur-xl shadow-xl">
            <ProjectSideInfo
              project={currentProject}
              activeIndex={localIndex}
              totalProjects={showcaseProjects.length}
              projects={showcaseProjects}
              onSelectIndex={handleSelect}
              onOpenGallery={openGalleryForProject}
            />
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <GalleryModal
        open={isGalleryOpen}
        project={selectedGalleryProject}
        onClose={() => setIsGalleryOpen(false)}
      />
    </section>
  );
}
