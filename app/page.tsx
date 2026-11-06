import React from "react";
import db from "@/lib/db";
import { PortfolioProvider } from "@/context/PortfolioContext";
import ScrollNavigationDots from "@/components/ScrollNavigationDots";
import SmoothScrollProvider from "@/components/computer/SmoothScrollProvider";
import HeroSection from "@/components/herosection/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import ExperienceSection from "@/components/experience/ExperienceSection";
import SkillsSection from "@/components/techstacksection/SkillsSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import EducationSection from "@/components/education/EducationSection";
import ContactSection from "@/components/contact/ContactSection";
import LaptopFlightController from "@/components/computer/LaptopFlightController";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Nawfs Ul Ahsun | Web Developer & Software Engineer",
  description:
    "Personal portfolio of Nawfs Ul Ahsun - Junior Software Engineer at Orange Solutions LTD (United Group). Specialized in React, Next.js, Enterprise ERP Systems, and Healthcare Solutions.",
};

export default async function Page() {
  const rawData = await db.getAllPortfolioData();
  const initialData = JSON.parse(JSON.stringify(rawData));

  return (
    <PortfolioProvider initialData={initialData as any}>
      <SmoothScrollProvider>
        <div className="relative w-full flex flex-col">
          {/* Floating Vertical Section Navigation Dots */}
          <ScrollNavigationDots />

          {/* 1. Hero Section (#home) with 3D Laptop */}
          <HeroSection />

          {/* 2. About Me Section (#about) */}
          <AboutSection />

          {/* 3. Professional Experience Section (#experience) */}
          <ExperienceSection />

          {/* 4. Technical Skills & Tools (#skills) */}
          <SkillsSection />

          {/* 5. Enterprise Projects Section (#projects) */}
          <ProjectsSection isDesktopFlightActive={true} />

          {/* 6. Academic Credentials (#education) */}
          <EducationSection />

          {/* 7. Contact Section (#contact) */}
          <ContactSection />

          {/* Master Laptop Flight Controller (Zoom out & slide right-to-left -> Enlarge near Projects -> Vertical scroll inside laptop -> Exit) */}
          <LaptopFlightController />
        </div>
      </SmoothScrollProvider>
    </PortfolioProvider>
  );
}
