"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioData } from "@/context/PortfolioContext";
import ComputerMonitor from "./ComputerMonitor";
import ComputerHeroScreen from "./ComputerHeroScreen";
import ProjectScreen from "./ProjectScreen";
import GalleryModal from "../projects/GalleryModal";
import { ProjectItem } from "@/data/portfolioData";

interface FlightComputerProps {
  onProjectIndexChange?: (index: number) => void;
  onFlightActiveChange?: (active: boolean) => void;
}

export default function FlightComputer({
  onProjectIndexChange,
  onFlightActiveChange,
}: FlightComputerProps) {
  const { projects } = usePortfolioData();
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [innerProjectProgress, setInnerProjectProgress] = useState(0);

  const [selectedGalleryProject, setSelectedGalleryProject] =
    useState<ProjectItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

  // DOM Refs
  const flightContainerRef = useRef<HTMLDivElement>(null);
  const computerWrapRef = useRef<HTMLDivElement>(null);
  const heroScreenRef = useRef<HTMLDivElement>(null);
  const projectScreenWrapRef = useRef<HTMLDivElement>(null);

  const showcaseProjects = useMemo(() => {
    return projects && projects.length > 0 ? projects.slice(0, 5) : [];
  }, [projects]);

  // Preload project screenshots
  useEffect(() => {
    if (typeof window !== "undefined" && showcaseProjects.length > 0) {
      showcaseProjects.forEach((p) => {
        if (p.image) {
          const img = new Image();
          img.src = p.image;
        }
        if (p.images) {
          p.images.slice(0, 3).forEach((s) => {
            const img = new Image();
            img.src = s;
          });
        }
      });
    }
  }, [showcaseProjects]);

  // Check desktop vs mobile
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (onFlightActiveChange) {
        onFlightActiveChange(desktop);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onFlightActiveChange]);

  // GSAP Flight & Docking Choreography
  useEffect(() => {
    if (typeof window === "undefined" || !isDesktop) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // -----------------------------------------------------------------------
      // TIMELINE 1: FLIGHT FROM HERO THROUGH ABOUT, EXPERIENCE, SKILLS TO PROJECTS
      // -----------------------------------------------------------------------
      // Starts at Hero top, ends when Projects section enters the viewport
      const flightTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          endTrigger: "#projects",
          end: "top top",
          scrub: 1.2,
          onUpdate: (self) => {
            const progress = self.progress;

            // When progress is near 1.0 (approaching Projects), switch screen to Project 1
            if (progress > 0.8) {
              if (heroScreenRef.current) heroScreenRef.current.style.opacity = "0";
              if (projectScreenWrapRef.current) projectScreenWrapRef.current.style.opacity = "1";
            } else {
              if (heroScreenRef.current) heroScreenRef.current.style.opacity = "1";
              if (projectScreenWrapRef.current) projectScreenWrapRef.current.style.opacity = "0";
            }
          },
        },
      });

      // Part 1: Start at Hero Right -> Zoom out and slide from right towards left
      flightTimeline.fromTo(
        computerWrapRef.current,
        {
          xPercent: 28, // Hero right side
          yPercent: 0,
          scale: 0.95,
          rotateY: -10,
          rotateX: 4,
          opacity: 1,
        },
        {
          xPercent: -15, // slides towards left
          yPercent: 8,
          scale: 0.44, // keeps zooming out!
          rotateY: 10,
          rotateX: 6,
          ease: "power1.inOut",
          duration: 3,
        },
        0
      );

      // Part 2: Approaching Projects -> Gets bigger and docks into Left side of Projects!
      flightTimeline.to(
        computerWrapRef.current,
        {
          xPercent: -22, // Docks into the left side of Projects section
          yPercent: 0,
          scale: 1.06, // Gets bigger near projects!
          rotateY: 0,
          rotateX: 0,
          ease: "power2.out",
          duration: 2.5,
        },
        3
      );

      // -----------------------------------------------------------------------
      // TIMELINE 2: PINNED PROJECTS SHOWCASE & VERTICAL PROJECT SCROLLING
      // -----------------------------------------------------------------------
      ScrollTrigger.create({
        trigger: "#projects",
        start: "top top",
        end: "+=2800", // Pinned scroll distance through projects
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Compute active project index across showcase projects
          if (showcaseProjects.length > 0) {
            const floatIdx = progress * showcaseProjects.length;
            const newIdx = Math.min(
              showcaseProjects.length - 1,
              Math.floor(floatIdx)
            );

            // Sub-progress within current project for webpage preview scrolling
            const sub = floatIdx - Math.floor(floatIdx);
            setInnerProjectProgress(sub);

            if (newIdx !== activeIndexRef.current) {
              activeIndexRef.current = newIdx;
              setActiveProjectIndex(newIdx);
              if (onProjectIndexChange) {
                onProjectIndexChange(newIdx);
              }
            }
          }

          // At the very end of projects, smoothly fade out flight computer
          if (progress >= 0.96) {
            if (computerWrapRef.current) {
              const exitAmt = (progress - 0.96) / 0.04;
              computerWrapRef.current.style.opacity = `${1 - exitAmt}`;
              computerWrapRef.current.style.transform = `translate3d(-22%, ${exitAmt * 40}px, 0) scale(${1.06 - exitAmt * 0.2})`;
            }
          } else if (progress > 0.01 && progress < 0.96) {
            if (computerWrapRef.current) {
              computerWrapRef.current.style.opacity = "1";
            }
          }
        },
      });

      // Timeline 3: Hide completely when scrolled past Education & Contact
      ScrollTrigger.create({
        trigger: "#education",
        start: "top center",
        onEnter: () => {
          if (computerWrapRef.current) computerWrapRef.current.style.display = "none";
        },
        onLeaveBack: () => {
          if (computerWrapRef.current) computerWrapRef.current.style.display = "block";
        },
      });
    }, flightContainerRef);

    const handleWindowResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      ctx.revert();
    };
  }, [isDesktop, showcaseProjects.length, onProjectIndexChange]);

  if (!isDesktop) return null;

  const currentProject =
    showcaseProjects[activeProjectIndex] || showcaseProjects[0];

  const currentUrl =
    activeProjectIndex === 0
      ? "https://nawfs.dev/work/eprescription-healthcare"
      : `https://nawfs.dev/work/${currentProject?.id || "projects"}`;

  const currentTab = `${currentProject?.title || "Project"} • Preview`;

  return (
    <>
      {/* Fixed Flight Overlay (Desktop Only) */}
      <div
        ref={flightContainerRef}
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center select-none"
        style={{ perspective: "1400px" }}
      >
        {/* Persistent 3D Desktop Computer */}
        <div
          ref={computerWrapRef}
          className="relative pointer-events-auto w-[560px] md:w-[660px] lg:w-[740px] xl:w-[800px] max-w-[55vw] transition-transform duration-75 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <ComputerMonitor
            activeUrl={currentUrl}
            activeTabTitle={currentTab}
          >
            {/* Screen View A: Hero Profile Screen */}
            <div
              ref={heroScreenRef}
              className="absolute inset-0 w-full h-full z-10 transition-opacity duration-500"
            >
              <ComputerHeroScreen />
            </div>

            {/* Screen View B: Projects Vertical Scrolling Screen */}
            <div
              ref={projectScreenWrapRef}
              className="absolute inset-0 w-full h-full z-20 opacity-0 transition-opacity duration-500"
            >
              <ProjectScreen
                projects={showcaseProjects}
                activeIndex={activeProjectIndex}
                projectProgress={innerProjectProgress}
                onOpenGallery={(proj) => {
                  setSelectedGalleryProject(proj);
                  setIsGalleryOpen(true);
                }}
              />
            </div>
          </ComputerMonitor>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <GalleryModal
        open={isGalleryOpen}
        project={selectedGalleryProject}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
}
