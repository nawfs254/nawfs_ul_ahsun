"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  const getMerged = (source?: Partial<PortfolioDataType>): PortfolioDataType => ({
    personal: source?.personal || portfolioData.personal,
    projects:
      source?.projects && source.projects.length > 0
        ? source.projects
        : portfolioData.projects,
    experiences:
      source?.experiences && source.experiences.length > 0
        ? source.experiences
        : portfolioData.experiences,
    skills:
      source?.skills && source.skills.length > 0
        ? source.skills
        : portfolioData.skills,
    education:
      source?.education && source.education.length > 0
        ? source.education
        : portfolioData.education,
    services:
      source?.services && source.services.length > 0
        ? source.services
        : portfolioData.services,
    hobbies:
      source?.hobbies && source.hobbies.length > 0
        ? source.hobbies
        : portfolioData.hobbies,
    faqs:
      source?.faqs && source.faqs.length > 0
        ? source.faqs
        : portfolioData.faqs,
  });

  const [data, setData] = useState<PortfolioDataType>(getMerged(initialData));

  // If server passes fresh initialData on navigation/reload, sync it
  useEffect(() => {
    if (initialData) {
      setData(getMerged(initialData));
    }
  }, [initialData]);

  // Client-side hydration sync: fetch live MongoDB data to bypass any CDN or static build cache
  useEffect(() => {
    let isMounted = true;
    fetch("/api/portfolio?data=true")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          setData(getMerged(json.data));
        }
      })
      .catch((err) => {
        console.warn("Client live data fetch warning:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData(): PortfolioDataType {
  const context = useContext(PortfolioContext);
  return context || (portfolioData as PortfolioDataType);
}
