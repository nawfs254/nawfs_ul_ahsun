"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioData } from "@/context/PortfolioContext";
import ComputerMonitor from "./ComputerMonitor";
import ProjectScreen from "./ProjectScreen";
import ProjectShowcaseDetails from "./ProjectShowcaseDetails";
import GalleryModal from "../projects/GalleryModal";
import { ProjectItem } from "@/data/portfolioData";
import { Lock } from "lucide-react";

export default function ComputerProjectShowcase() {
  const { projects } = usePortfolioData();
  const [selectedGalleryProject, setSelectedGalleryProject] =
    useState<ProjectItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Active project index for details panel
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Responsive state for mobile vs desktop
  const [isMobile, setIsMobile] = useState(false);

  // DOM Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const computer3dWrapRef = useRef<HTMLDivElement>(null);
  const projectsDetailsRef = useRef<HTMLDivElement>(null);

  // 5 Key Enterprise Projects for the Showcase
  const showcaseProjects = useMemo(() => {
    return projects && projects.length > 0 ? projects.slice(0, 5) : [];
  }, [projects]);

  // Preload project images to avoid blank flashes
  useEffect(() => {
    if (typeof window !== "undefined" && showcaseProjects.length > 0) {
      showcaseProjects.forEach((proj) => {
        if (proj.image) {
          const img = new Image();
          img.src = proj.image;
        }
        if (proj.images) {
          proj.images.slice(0, 3).forEach((src) => {
            const img = new Image();
            img.src = src;
          });
        }
      });
    }
  }, [showcaseProjects]);

  // Handle Resize and Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP ScrollTrigger Pinning and Scrubbing
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isMobile || prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2800", // 2800px scrub distance
          pin: pinWrapperRef.current,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            // Map progress across the 5 projects (from 0.05 to 0.95)
            if (showcaseProjects.length > 0) {
              const clamped = Math.max(0, Math.min(1, (progress - 0.05) / 0.9));
              const newIndex = Math.min(
                showcaseProjects.length - 1,
                Math.floor(clamped * showcaseProjects.length),
              );
              if (newIndex !== activeIndexRef.current) {
                activeIndexRef.current = newIndex;
                setActiveProjectIndex(newIndex);
              }
            }
          },
        },
      });

      // Subtle scale and 3D entrance of the computer when arriving
      tl.fromTo(
        computer3dWrapRef.current,
        {
          scale: 0.92,
          y: 30,
          rotateX: 4,
        },
        {
          scale: 1.08,
          y: 0,
          rotateX: 0,
          ease: "power2.out",
          duration: 1.2,
        },
        0,
      );

      // Computer stays steady and centered during the project journey
      tl.to(
        computer3dWrapRef.current,
        {
          yPercent: -2,
          ease: "none",
          duration: 4.0,
        },
        1.2,
      );

      // Smooth release / exit at the end of the projects showcase
      tl.to(
        [computer3dWrapRef.current, projectsDetailsRef.current],
        {
          opacity: 0.8,
          scale: 0.95,
          yPercent: 10,
          duration: 1.0,
          ease: "power2.in",
        },
        5.2,
      );
    }, containerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [isMobile, showcaseProjects.length]);

  const openGalleryForProject = (project: ProjectItem) => {
    setSelectedGalleryProject(project);
    setIsGalleryOpen(true);
  };

  const currentProject =
    showcaseProjects[activeProjectIndex] || showcaseProjects[0];

  const currentUrl = `https://nawfs.dev/work/${currentProject?.id || "eprescription"}`;
  const currentTab = `${currentProject?.title || "Project"} • Preview`;

  // ===========================================================================
  // MOBILE VIEW (< 1024px)
  // ===========================================================================
  if (isMobile) {
    return (
      <section
        id="projects"
        className="relative py-14 px-5 border-t border-border/50 bg-background"
      >
        <div className="max-w-xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Featured Work
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Key Enterprise Projects
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Production-tested healthcare ERP modules, hospital workflow
              platforms, and enterprise R&D frameworks.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-500 text-[11px] font-medium text-left">
              <Lock size={12} className="shrink-0 text-amber-500" />
              <span>
                <strong>Confidential NDA:</strong> Enterprise platforms have
                protected source code & databases. Direct gallery previews
                provided.
              </span>
            </div>
          </div>

          {/* Computer Monitor Displaying Projects */}
          <div className="w-full">
            <ComputerMonitor activeUrl={currentUrl} activeTabTitle={currentTab}>
              <ProjectScreen
                projects={showcaseProjects}
                activeIndex={activeProjectIndex}
                projectProgress={0}
                onOpenGallery={openGalleryForProject}
              />
            </ComputerMonitor>
          </div>

          {/* Project Details Panel */}
          <ProjectShowcaseDetails
            projects={showcaseProjects}
            activeIndex={activeProjectIndex}
            onSelectIndex={setActiveProjectIndex}
            onOpenGallery={openGalleryForProject}
          />
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

  // ===========================================================================
  // DESKTOP VIEW: SCROLL-PINNED 3D COMPUTER SHOWCASE
  // ===========================================================================
  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full border-t border-border/50 bg-background"
    >
      {/* PINNED VIEWPORT */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center py-6 px-6 select-none"
        style={{ perspective: "1400px" }}
      >
        {/* Background Ambient Glow Accents */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative max-w-3xl text-center px-4 z-20 shrink-0">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Featured Work
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Key Enterprise Projects
          </h2>
          <p className="mt-1 text-muted-foreground text-xs sm:text-sm">
            Scroll to explore live enterprise web applications inside the
            workstation monitor.
          </p>
        </div>

        {/* The 3D Desktop Computer Monitor (Pinned Centerpiece) */}
        <div
          ref={computer3dWrapRef}
          className="relative z-30 pointer-events-auto w-[620px] md:w-[720px] lg:w-[820px] max-w-[90vw] my-auto transition-transform duration-75 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <ComputerMonitor activeUrl={currentUrl} activeTabTitle={currentTab}>
            <ProjectScreen
              projects={showcaseProjects}
              activeIndex={activeProjectIndex}
              projectProgress={0}
              onOpenGallery={openGalleryForProject}
            />
          </ComputerMonitor>
        </div>

        {/* Project Details Card */}
        <div
          ref={projectsDetailsRef}
          className="relative w-full max-w-4xl z-30 pointer-events-auto shrink-0 pb-2"
        >
          <ProjectShowcaseDetails
            projects={showcaseProjects}
            activeIndex={activeProjectIndex}
            onSelectIndex={setActiveProjectIndex}
            onOpenGallery={openGalleryForProject}
          />
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
