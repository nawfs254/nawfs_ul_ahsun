import React from "react";
import db from "@/lib/db";
import { PortfolioProvider } from "@/context/PortfolioContext";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollNavigationDots from "@/components/ScrollNavigationDots";
import HeroSection from "@/components/herosection/HeroSection";
import AboutSection from "@/components/about/AboutSection";
import ExperienceSection from "@/components/experience/ExperienceSection";
import SkillsSection from "@/components/techstacksection/SkillsSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import EducationSection from "@/components/education/EducationSection";
import ContactSection from "@/components/contact/ContactSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Nawfs Ul Ahsun | Web Developer & Software Engineer",
  description:
    "Personal portfolio of Nawfs Ul Ahsun - Junior Software Engineer at Orange Solutions LTD (United Group). Specialized in React, Next.js, Enterprise ERP Systems, and Healthcare Solutions.",
};

export default async function Page() {
  const initialData = await db.getAllPortfolioData();

  return (
    <PortfolioProvider initialData={initialData as any}>
      <div className="relative w-full flex flex-col">
        {/* Top Scroll Indicator */}
        <ScrollProgressBar />

        {/* Floating Vertical Section Navigation Dots */}
        <ScrollNavigationDots />

        {/* 1. Hero Section (#home) */}
        <HeroSection />

        {/* 2. About Me Section (#about) */}
        <AboutSection />

        {/* 3. Professional Experience Section (#experience) */}
        <ExperienceSection />

        {/* 4. Technical Skills & Tools (#skills) */}
        <SkillsSection />

        {/* 5. Enterprise Projects & Gallery (#projects) */}
        <ProjectsSection />

        {/* 6. Academic Credentials (#education) */}
        <EducationSection />

        {/* 7. Contact Section (#contact) */}
        <ContactSection />
      </div>
    </PortfolioProvider>
  );
}
