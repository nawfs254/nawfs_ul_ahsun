"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolioData } from "@/context/PortfolioContext";
import DynamicIcon from "../DynamicIcon";
import ComputerMonitor from "./ComputerMonitor";
import ComputerHeroScreen from "./ComputerHeroScreen";
import ProjectScreen from "./ProjectScreen";
import ProjectSideInfo from "./ProjectSideInfo";
import GalleryModal from "../projects/GalleryModal";
import { ProjectItem } from "@/data/portfolioData";
import {
  ArrowRight,
  ChevronDown,
  Download,
  FileText,
  Mail,
} from "lucide-react";

export default function ComputerShowcase() {
  const { personal, projects } = usePortfolioData();
  const [selectedGalleryProject, setSelectedGalleryProject] =
    useState<ProjectItem | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Active project index for synchronized transitions
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Internal project scroll progress for webpage preview scrolling
  const [innerProjectProgress, setInnerProjectProgress] = useState(0);

  // Responsive state for mobile vs desktop
  const [isMobile, setIsMobile] = useState(false);

  // DOM Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const computer3dWrapRef = useRef<HTMLDivElement>(null);
  const heroScreenRef = useRef<HTMLDivElement>(null);
  const projectScreenWrapRef = useRef<HTMLDivElement>(null);
  const projectsRightPanelRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

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

  // GSAP ScrollTrigger Choreography (Reference-Inspired)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
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
          end: "+=3800", // Smooth scroll distance for cinematic pacing
          pin: pinWrapperRef.current,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            // =================================================================
            // SYNCHRONIZED PROJECT TRANSITIONS (Progress 0.28 to 0.88)
            // =================================================================
            if (progress >= 0.26 && progress <= 0.88 && showcaseProjects.length > 0) {
              const projectSegment = (progress - 0.26) / (0.88 - 0.26);
              const floatIndex = projectSegment * showcaseProjects.length;
              const newIndex = Math.min(
                showcaseProjects.length - 1,
                Math.floor(floatIndex)
              );

              // Sub-progress within current project for webpage preview scrolling
              const subProgress = floatIndex - Math.floor(floatIndex);
              setInnerProjectProgress(subProgress);

              if (newIndex !== activeIndexRef.current) {
                activeIndexRef.current = newIndex;
                setActiveProjectIndex(newIndex);
              }
            } else if (progress < 0.26 && activeIndexRef.current !== 0) {
              activeIndexRef.current = 0;
              setActiveProjectIndex(0);
              setInnerProjectProgress(0);
            }
          },
        },
      });

      // =======================================================================
      // STAGE ONE -> TWO: HERO EXITS, COMPUTER TRAVELS FROM RIGHT TO LEFT
      // =======================================================================

      // 1. Hero Left Text translates away and fades out
      tl.to(
        heroLeftRef.current,
        {
          opacity: 0,
          x: -80,
          y: -30,
          ease: "power2.inOut",
          duration: 1.6,
        },
        0
      );

      // 2. Scroll Down Indicator fades out
      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
        },
        0
      );

      // 3. PERSISTENT COMPUTER 3D MOVEMENT:
      // Travels from Hero Right position across and down to the LEFT SIDE of the screen!
      tl.fromTo(
        computer3dWrapRef.current,
        {
          xPercent: 32, // Right side of hero
          yPercent: 0,
          scale: 0.86,
          rotateY: -10,
          rotateX: 4,
          rotateZ: -1,
        },
        {
          xPercent: -24, // Moves to LEFT SIDE for the Projects Showcase layout!
          yPercent: 0,
          scale: 1.06, // Enlarges to primary visual anchor
          rotateY: 0,
          rotateX: 0,
          rotateZ: 0,
          ease: "power2.inOut",
          duration: 2.2,
        },
        0
      );

      // 4. Cross-fade inside screen: Hero Profile Visual fades, Project Screen appears
      tl.to(
        heroScreenRef.current,
        {
          opacity: 0,
          scale: 0.95,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.8
      );

      tl.fromTo(
        projectScreenWrapRef.current,
        {
          opacity: 0,
          scale: 1.05,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.inOut",
        },
        1.2
      );

      // =======================================================================
      // STAGE THREE: RIGHT PANEL GLIDES IN ON THE RIGHT SIDE
      // =======================================================================
      tl.fromTo(
        projectsRightPanelRef.current,
        {
          opacity: 0,
          x: 80,
          scale: 0.96,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.6,
          ease: "power2.out",
        },
        1.3
      );

      // =======================================================================
      // STAGE FOUR: PINNED PROJECTS SHOWCASE
      // =======================================================================
      // Computer stays fixed on the left while projects scrub through
      tl.to(
        computer3dWrapRef.current,
        {
          yPercent: -1,
          ease: "none",
          duration: 5.0,
        },
        2.0
      );

      // =======================================================================
      // STAGE FIVE: EXIT ANIMATION
      // =======================================================================
      tl.to(
        projectsRightPanelRef.current,
        {
          opacity: 0,
          x: 60,
          duration: 1.2,
          ease: "power2.in",
        },
        7.0
      );

      tl.to(
        computer3dWrapRef.current,
        {
          opacity: 0,
          scale: 0.88,
          yPercent: 25,
          rotateX: -4,
          duration: 1.5,
          ease: "power2.in",
        },
        7.2
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleResume = () => {
    window.open(personal.cvPdfUrl, "_blank");
  };

  const openGalleryForProject = (project: ProjectItem) => {
    setSelectedGalleryProject(project);
    setIsGalleryOpen(true);
  };

  const currentProject =
    showcaseProjects[activeProjectIndex] || showcaseProjects[0];

  const currentUrl =
    activeProjectIndex === 0 && !isMobile
      ? "https://nawfs.dev/overview"
      : `https://nawfs.dev/work/${currentProject?.id || "eprescription"}`;

  const currentTab =
    activeProjectIndex === 0 && !isMobile
      ? `${personal.name} • Overview`
      : `${currentProject?.title || "Project"} • Preview`;

  // ===========================================================================
  // MOBILE / TABLET ADAPTIVE PRESENTATION (< 1024px)
  // ===========================================================================
  if (isMobile) {
    return (
      <>
        {/* Mobile Hero Section with Desktop Monitor on top */}
        <section
          id="home"
          className="relative min-h-screen flex flex-col justify-center items-center py-12 px-5 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>{personal.hiringStatus}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">{personal.location}</span>
            </div>

            {/* Name & Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  {personal.name}
                </span>
              </h1>
              <h2 className="mt-2 text-base sm:text-lg font-semibold text-foreground/80 flex items-center justify-center gap-2">
                <span>{personal.title}</span>
                <span className="text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  Orange Solutions LTD
                </span>
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md">
              {personal.tagline}
            </p>

            {/* 3D Desktop Computer in Hero View */}
            <div className="w-full max-w-md my-2">
              <ComputerMonitor
                activeUrl="https://nawfs.dev/overview"
                activeTabTitle={`${personal.name} • Overview`}
              >
                <ComputerHeroScreen />
              </ComputerMonitor>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => scrollToSection("projects")}
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/25"
              >
                <span>Explore Projects</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card/80 text-foreground font-medium text-xs sm:text-sm"
              >
                <Mail size={14} className="text-blue-500" />
                <span>Contact Me</span>
              </button>

              <button
                onClick={handleResume}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card/80 text-foreground font-medium text-xs sm:text-sm"
              >
                <FileText size={14} className="text-cyan-500" />
                <span>View CV</span>
                <Download size={12} className="opacity-70" />
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {personal.socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-blue-500"
                >
                  <DynamicIcon
                    iconLibrary={link.iconLibrary}
                    icon={link.icon}
                    className="text-sm"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Mobile Projects Section (Monitor with Stacked Details) */}
        <section
          id="projects"
          className="relative py-14 px-5 border-t border-border/50 bg-background"
        >
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Featured Work
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Key Enterprise Projects
              </h2>
              <p className="text-xs text-muted-foreground">
                Healthcare ERP, Hospital Management, and Enterprise Frameworks.
              </p>
            </div>

            {/* Desktop Computer Monitor in Projects */}
            <div className="w-full">
              <ComputerMonitor
                activeUrl={currentUrl}
                activeTabTitle={currentTab}
              >
                <ProjectScreen
                  projects={showcaseProjects}
                  activeIndex={activeProjectIndex}
                  projectProgress={0}
                  onOpenGallery={openGalleryForProject}
                />
              </ComputerMonitor>
            </div>

            {/* Stacked Project Details */}
            <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-md">
              <ProjectSideInfo
                project={currentProject}
                activeIndex={activeProjectIndex}
                totalProjects={showcaseProjects.length}
                projects={showcaseProjects}
                onSelectIndex={setActiveProjectIndex}
                onOpenGallery={openGalleryForProject}
              />
            </div>
          </div>
        </section>

        {/* Full Gallery Modal */}
        <GalleryModal
          open={isGalleryOpen}
          project={selectedGalleryProject}
          onClose={() => setIsGalleryOpen(false)}
        />
      </>
    );
  }

  // ===========================================================================
  // DESKTOP: FULL REFERENCE-INSPIRED SCROLL-DRIVEN DEVICE MOVEMENT
  // ===========================================================================
  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background"
    >
      {/* Anchors for smooth navigation */}
      <div
        id="home"
        className="absolute top-0 left-0 w-full h-1 pointer-events-none"
      />
      <div
        id="projects"
        className="absolute top-[1300px] left-0 w-full h-1 pointer-events-none"
      />

      {/* PINNED VIEWPORT CONTAINER */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center select-none"
        style={{ perspective: "1400px" }}
      >
        {/* Background Ambient Glow Accents */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* =================================================================== */}
        {/* LAYER A: HERO SECTION CONTENT (Left Column of Initial Screen) */}
        {/* =================================================================== */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-8 w-full flex items-center pointer-events-none z-10">
          <div className="grid lg:grid-cols-12 gap-8 w-full items-center">
            {/* Left Column: Intro & Info */}
            <div
              ref={heroLeftRef}
              className="lg:col-span-7 flex flex-col items-start pointer-events-auto"
            >
              {/* Availability Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400 backdrop-blur-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>{personal.hiringStatus}</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-muted-foreground">{personal.location}</span>
              </div>

              {/* Main Greeting & Name */}
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.18]">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  {personal.name}
                </span>
              </h1>

              {/* Subtitle / Role */}
              <h2 className="mt-2 text-lg sm:text-xl font-semibold text-foreground/80 flex flex-wrap items-center gap-2">
                <span>{personal.title}</span>
                <span className="text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  Orange Solutions LTD
                </span>
              </h2>

              {/* Short Objective & Description */}
              <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed max-w-xl">
                {personal.tagline}
              </p>

              <p className="mt-2 text-xs sm:text-sm text-muted-foreground/80 max-w-xl italic">
                &ldquo;{personal.objective}&rdquo;
              </p>

              {/* Action CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => scrollToSection("projects")}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm cursor-pointer"
                >
                  <span>Explore Projects</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted/70 text-foreground font-medium transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
                >
                  <Mail size={15} className="text-blue-500" />
                  <span>Contact Me</span>
                </button>

                <button
                  onClick={handleResume}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted/70 text-foreground font-medium transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
                >
                  <FileText size={15} className="text-cyan-500" />
                  <span>View CV</span>
                  <Download size={13} className="opacity-70" />
                </button>
              </div>

              {/* Social Icons & Connectivity */}
              <div className="mt-6 flex items-center gap-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mr-1">
                  Find me on:
                </span>
                {personal.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.name}
                    className="h-8 w-8 rounded-lg border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10 hover:-translate-y-0.5 transition-all duration-200 shadow-xs cursor-pointer"
                  >
                    <DynamicIcon
                      iconLibrary={link.iconLibrary}
                      icon={link.icon}
                      className="text-sm"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer for Right Column (where computer initially sits) */}
            <div className="lg:col-span-5 h-96 pointer-events-none" />
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER B: THE PERSISTENT 3D DESKTOP COMPUTER (Central Anchor) */}
        {/* =================================================================== */}
        {/* 
          This single, persistent computer element travels from the right 
          of the Hero section to the LEFT SIDE of the Projects Showcase!
        */}
        <div
          ref={computer3dWrapRef}
          className="relative z-30 pointer-events-auto w-[520px] sm:w-[620px] md:w-[700px] lg:w-[760px] xl:w-[820px] max-w-[55vw] transition-transform duration-75 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <ComputerMonitor
            activeUrl={currentUrl}
            activeTabTitle={currentTab}
          >
            {/* View A: Hero Profile Screen */}
            <div
              ref={heroScreenRef}
              className="absolute inset-0 w-full h-full z-10"
            >
              <ComputerHeroScreen />
            </div>

            {/* View B: Projects Live Preview Screen */}
            <div
              ref={projectScreenWrapRef}
              className="absolute inset-0 w-full h-full z-20 opacity-0"
            >
              <ProjectScreen
                projects={showcaseProjects}
                activeIndex={activeProjectIndex}
                projectProgress={innerProjectProgress}
                onOpenGallery={openGalleryForProject}
              />
            </div>
          </ComputerMonitor>
        </div>

        {/* =================================================================== */}
        {/* LAYER C: PROJECTS RIGHT-SIDE INFORMATION PANEL (Reference Layout) */}
        {/* =================================================================== */}
        {/* 
          Fixed on the RIGHT SIDE during Stage 3 & 4 while the computer 
          monitor is pinned on the LEFT SIDE.
        */}
        <div
          ref={projectsRightPanelRef}
          className="absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-[420px] lg:w-[480px] xl:w-[520px] max-w-[42vw] z-30 pointer-events-auto opacity-0"
        >
          <div className="p-6 xl:p-8 rounded-3xl border border-white/10 bg-slate-950/85 backdrop-blur-2xl shadow-2xl">
            <ProjectSideInfo
              project={currentProject}
              activeIndex={activeProjectIndex}
              totalProjects={showcaseProjects.length}
              projects={showcaseProjects}
              onSelectIndex={setActiveProjectIndex}
              onOpenGallery={openGalleryForProject}
            />
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER D: SCROLL DOWN INDICATOR (Visible initially, fades on scroll) */}
        {/* =================================================================== */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer group z-20 select-none pointer-events-auto"
          onClick={() => scrollToSection("projects")}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground group-hover:text-blue-400 transition-colors mb-1">
            Scroll To Explore
          </span>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-5 h-7.5 rounded-full border-2 border-muted-foreground/40 group-hover:border-blue-500/80 transition-colors flex justify-center p-1 bg-background/60 backdrop-blur-xs">
              <div className="w-1 h-2 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50 animate-bounce" />
            </div>
            <div className="text-muted-foreground/60 group-hover:text-blue-400 transition-colors -mt-0.5">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      <GalleryModal
        open={isGalleryOpen}
        project={selectedGalleryProject}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
