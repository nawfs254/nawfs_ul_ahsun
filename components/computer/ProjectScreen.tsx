"use client";

import React from "react";
import { ProjectItem } from "@/data/portfolioData";
import ProjectSlide from "./ProjectSlide";

interface ProjectScreenProps {
  projects: ProjectItem[];
  activeIndex: number;
  projectProgress?: number;
  onOpenGallery?: (project: ProjectItem) => void;
}

export default function ProjectScreen({
  projects,
  activeIndex,
  projectProgress = 0,
  onOpenGallery,
}: ProjectScreenProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Vertical Slider Track containing all project slides */}
      <div
        className="w-full h-full transition-transform duration-500 ease-out will-change-transform flex flex-col"
        style={{
          transform: `translate3d(0, -${activeIndex * 100}%, 0)`,
        }}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;

          return (
            <div key={project.id} className="w-full h-full shrink-0 relative">
              <ProjectSlide
                project={project}
                isActive={isActive}
                onOpenGallery={onOpenGallery}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
