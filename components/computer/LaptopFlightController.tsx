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

export default function LaptopFlightController() {
  const { personal, projects } = usePortfolioData();
  const laptopRef = useRef<HTMLDivElement>(null);
  const heroScreenRef = useRef<HTMLDivElement>(null);
  const projectScreenRef = useRef<HTMLDivElement>(null);
  const activeIdxRef = useRef(0);
  const isProjectsActiveRef = useRef(false);

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedGalleryProject, setSelectedGalleryProject] =
    useState<ProjectItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isProjectsActive, setIsProjectsActive] = useState(false);

  const showcaseProjects = useMemo(() => {
    return projects && projects.length > 0 ? projects : [];
  }, [projects]);

  const currentProject = showcaseProjects[activeIdx] || showcaseProjects[0];
  const activeUrl = isProjectsActive
    ? `https://nawfs.dev/work/${currentProject?.id || "project"}`
    : "https://nawfs.dev/overview";
  const activeTabTitle = isProjectsActive
    ? `${currentProject?.title || "Project"} • Preview`
    : `${personal.name} • Overview`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Flight choreography is dedicated to desktop screens (>= 1024px)
    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isDesktop || prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const laptopEl = laptopRef.current;
    const heroScreenEl = heroScreenRef.current;
    const projectScreenEl = projectScreenRef.current;
    const masterLayer = document.getElementById("master-laptop-layer");
    const heroSlot = document.getElementById("hero-laptop-slot");
    const projectDock = document.getElementById("projects-computer-dock");
    const projectsSection = document.getElementById("projects");
    const homeSection = document.getElementById("home");

    if (!laptopEl || !heroSlot || !projectDock || !projectsSection || !homeSection) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Calculate absolute unscrolled slot coordinates and desktop scales
      const getCoordinates = () => {
        const heroRect = heroSlot.getBoundingClientRect();
        const initialX = heroRect.left + heroRect.width / 2;
        const initialY = heroRect.top + window.scrollY + heroRect.height / 2;

        const dockRect = projectDock.getBoundingClientRect();
        const dockX = dockRect.left + dockRect.width / 2;
        const dockY = window.innerHeight * 0.55;

        return {
          initialX,
          initialY,
          dockX,
          dockY,
          heroScale: 1.0,
          flightScale: 0.40,
          dockScale: 0.85,
        };
      };

      const coords = getCoordinates();

      // Set initial starting position in Hero Section
      gsap.set(laptopEl, {
        x: coords.initialX,
        y: coords.initialY,
        xPercent: -50,
        yPercent: -50,
        scale: coords.heroScale,
        rotateY: -8,
        rotateX: 3,
        rotateZ: 0,
        opacity: 1,
        display: "block",
        transformOrigin: "center center",
      });

      // Keep master layer strictly at z-10 during flight behind z-30 content cards
      if (masterLayer) masterLayer.style.zIndex = "10";

      // -----------------------------------------------------------------------
      // TIMELINE 1: FLIGHT FROM HERO THROUGH ABOUT, EXPERIENCE, SKILLS TO PROJECTS
      // (Floats smoothly backward behind content cards so all text remains visible)
      // -----------------------------------------------------------------------
      const flightTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          endTrigger: "#projects",
          end: "top top",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;

            // Cross-fade screen content cleanly as it approaches Projects section
            const shouldBeActive = p > 0.88;
            if (shouldBeActive !== isProjectsActiveRef.current) {
              isProjectsActiveRef.current = shouldBeActive;
              setIsProjectsActive(shouldBeActive);
              if (heroScreenEl) heroScreenEl.style.opacity = shouldBeActive ? "0" : "1";
              if (projectScreenEl) {
                projectScreenEl.style.opacity = shouldBeActive ? "1" : "0";
                projectScreenEl.style.pointerEvents = shouldBeActive ? "auto" : "none";
              }
            }
          },
        },
      });

      // Stage 1: (Hero -> About) Zooms backwards into the depth plane behind About cards
      flightTimeline.fromTo(
        laptopEl,
        {
          x: coords.initialX,
          y: coords.initialY,
          scale: coords.heroScale,
          rotateY: -8,
          rotateX: 3,
          rotateZ: 0,
          opacity: 1,
        },
        {
          x: coords.initialX + 35,
          y: coords.initialY - 25,
          scale: coords.flightScale * 0.95,
          rotateY: -16,
          rotateX: 6,
          rotateZ: -2.5,
          opacity: 0.75,
          ease: "power1.inOut",
          duration: 1.2,
        },
        0
      );

      // Stage 2: (About -> Experience) Waves gently in the background plane behind Experience cards
      flightTimeline.to(
        laptopEl,
        {
          x: coords.initialX - (coords.initialX - coords.dockX) * 0.45,
          y: coords.initialY + 40,
          scale: coords.flightScale * 0.92,
          rotateY: 12,
          rotateX: -4,
          rotateZ: 2,
          opacity: 0.75,
          ease: "power1.inOut",
          duration: 1.4,
        },
        1.2
      );

      // Stage 3: (Experience -> Skills) Continues wave toward the left side behind Skills cards
      flightTimeline.to(
        laptopEl,
        {
          x: coords.dockX + 55,
          y: coords.dockY - 15,
          scale: coords.flightScale * 1.15,
          rotateY: -5,
          rotateX: 2,
          rotateZ: -1,
          opacity: 0.88,
          ease: "power1.inOut",
          duration: 1.0,
        },
        2.6
      );

      // Stage 4: (Skills -> Projects) Swoops smoothly forward from depth into the Projects dock
      flightTimeline.to(
        laptopEl,
        {
          x: coords.dockX,
          y: coords.dockY,
          scale: coords.dockScale,
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.9,
        },
        3.6
      );

      // -----------------------------------------------------------------------
      // TIMELINE 2: STICKY PROJECTS SHOWCASE & SCROLL-DRIVEN PROJECT TRANSITIONS
      // -----------------------------------------------------------------------
      const projectsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#projects",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onEnter: () => {
            setIsProjectsActive(true);
            isProjectsActiveRef.current = true;
            if (masterLayer) masterLayer.style.zIndex = "30";
            if (heroScreenEl) heroScreenEl.style.opacity = "0";
            if (projectScreenEl) {
              projectScreenEl.style.opacity = "1";
              projectScreenEl.style.pointerEvents = "auto";
            }
          },
          onLeaveBack: () => {
            // When scrolling back up into Skills
            setIsProjectsActive(false);
            isProjectsActiveRef.current = false;
            if (masterLayer) masterLayer.style.zIndex = "10";
            if (heroScreenEl) heroScreenEl.style.opacity = "1";
            if (projectScreenEl) {
              projectScreenEl.style.opacity = "0";
              projectScreenEl.style.pointerEvents = "none";
            }
          },
          onUpdate: (self) => {
            const progress = self.progress;

            // Map progress to active project index
            if (showcaseProjects.length > 0) {
              const projectProgress = Math.min(1, progress / 0.88);
              const floatIndex = projectProgress * showcaseProjects.length;
              const newIndex = Math.min(
                showcaseProjects.length - 1,
                Math.floor(floatIndex)
              );

              if (newIndex !== activeIdxRef.current) {
                activeIdxRef.current = newIndex;
                setActiveIdx(newIndex);
                window.dispatchEvent(
                  new CustomEvent("portfolio-project-scroll", {
                    detail: { index: newIndex },
                  })
                );
              }
            }
          },
        },
      });

      // Held in place from 0 to 0.88, then smoothly tweens out into Education from 0.88 to 1.0
      projectsTimeline
        .to({}, { duration: 0.88 })
        .to(
          laptopEl,
          {
            opacity: 0,
            scale: coords.dockScale * 0.65,
            y: coords.dockY + 45,
            ease: "power2.in",
            duration: 0.12,
            onStart: () => {
              if (masterLayer) masterLayer.style.zIndex = "10";
            },
          },
          0.88
        );

      // Hide laptop completely once deep in education or contact
      ScrollTrigger.create({
        trigger: "#education",
        start: "top center",
        onEnter: () => {
          laptopEl.style.display = "none";
          if (masterLayer) masterLayer.style.zIndex = "10";
        },
        onLeaveBack: () => {
          laptopEl.style.display = "block";
          if (masterLayer) masterLayer.style.zIndex = "30";
        },
      });
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    const handleProjectSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === "number") {
        activeIdxRef.current = customEvent.detail.index;
        setActiveIdx(customEvent.detail.index);
      }
    };
    window.addEventListener("portfolio-project-select", handleProjectSelect);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("portfolio-project-select", handleProjectSelect);
      ctx.revert();
    };
  }, [personal, showcaseProjects]);

  const handleOpenGallery = (project: ProjectItem) => {
    setSelectedGalleryProject(project);
    setIsGalleryOpen(true);
  };

  return (
    <>
      {/* Master 3D Computer Layer: Fixed viewport overlay on desktop screens (>= 1024px) */}
      <div
        id="master-laptop-layer"
        className="fixed inset-0 pointer-events-none hidden lg:block overflow-hidden transition-opacity duration-200"
        style={{ zIndex: 10 }}
      >
        <div
          ref={laptopRef}
          id="flying-laptop"
          className="absolute pointer-events-auto will-change-transform"
          style={{
            width: "500px",
            left: "0px",
            top: "0px",
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          <ComputerMonitor
            activeUrl={activeUrl}
            activeTabTitle={activeTabTitle}
          >
            {/* View A: Hero Profile Screen */}
            <div
              ref={heroScreenRef}
              id="hero-screen-view"
              className="absolute inset-0 w-full h-full z-10 transition-opacity duration-300"
            >
              <ComputerHeroScreen />
            </div>

            {/* View B: Projects Live Preview Screen */}
            <div
              ref={projectScreenRef}
              id="project-screen-view"
              className="absolute inset-0 w-full h-full z-20 opacity-0 transition-opacity duration-300 pointer-events-none"
            >
              <ProjectScreen
                projects={showcaseProjects}
                activeIndex={activeIdx}
                onOpenGallery={handleOpenGallery}
              />
            </div>
          </ComputerMonitor>
        </div>
      </div>

      {/* Gallery Modal for Desktop Computer View */}
      <GalleryModal
        open={isGalleryOpen}
        project={selectedGalleryProject}
        onClose={() => setIsGalleryOpen(false)}
      />
    </>
  );
}
