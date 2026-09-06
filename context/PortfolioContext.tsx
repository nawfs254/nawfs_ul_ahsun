"use client";

import React, { createContext, useContext } from "react";
import {
  portfolioData,
  ProjectItem,
  WorkExperienceItem,
  EducationItem,
  SkillItem,
} from "@/data/portfolioData";

export interface PortfolioDataType {
  personal: typeof portfolioData.personal;
  projects: ProjectItem[];
  experiences: WorkExperienceItem[];
  skills: SkillItem[];
  education: EducationItem[];
  services: typeof portfolioData.services;
  hobbies: typeof portfolioData.hobbies;
  faqs: typeof portfolioData.faqs;
}

const PortfolioContext = createContext<PortfolioDataType>(
  portfolioData as PortfolioDataType
);

export function PortfolioProvider({
  initialData,
  children,
}: {
  initialData?: Partial<PortfolioDataType>;
  children: React.ReactNode;
}) {
  const mergedData: PortfolioDataType = {
    personal: initialData?.personal || portfolioData.personal,
    projects:
      initialData?.projects && initialData.projects.length > 0
        ? initialData.projects
        : portfolioData.projects,
    experiences:
      initialData?.experiences && initialData.experiences.length > 0
        ? initialData.experiences
        : portfolioData.experiences,
    skills:
      initialData?.skills && initialData.skills.length > 0
        ? initialData.skills
        : portfolioData.skills,
    education:
      initialData?.education && initialData.education.length > 0
        ? initialData.education
        : portfolioData.education,
    services:
      initialData?.services && initialData.services.length > 0
        ? initialData.services
        : portfolioData.services,
    hobbies:
      initialData?.hobbies && initialData.hobbies.length > 0
        ? initialData.hobbies
        : portfolioData.hobbies,
    faqs:
      initialData?.faqs && initialData.faqs.length > 0
        ? initialData.faqs
        : portfolioData.faqs,
  };

  return (
    <PortfolioContext.Provider value={mergedData}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData(): PortfolioDataType {
  const context = useContext(PortfolioContext);
  return context || (portfolioData as PortfolioDataType);
}
