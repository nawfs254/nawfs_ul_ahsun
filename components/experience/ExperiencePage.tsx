"use client";

import EducationSection from "./EducationSection";
import ExperienceHero from "./ExperienceHero";
import ExperienceTimeline from "./ExperienceTimeline";
import SkillsSection from "./SkillsSection";
import StatsSection from "./StatsSection";

export default function ExperiencePage({ data }: { data: any }) {
  return (
    <section className="mx-auto max-w-7xl py-10">
      <ExperienceHero data={data} />

      <StatsSection stats={data.stats} />

      <ExperienceTimeline experiences={data.workExp} />

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <EducationSection
          education={data.education}
          certifications={data.certifications}
        />

        <SkillsSection skills={data.techStack} />
      </div>
    </section>
  );
}
