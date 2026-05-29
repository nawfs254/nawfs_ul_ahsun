import AboutInfo from "./AboutInfo";
import SkillsProgress from "./SkillsProgress";
import ServicesSection from "./ServicesSection";
import TimelineSection from "./TimelineSection";

export default function AboutPage({ data }: { data: any }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <AboutInfo data={data} />

      <div className="mt-20 grid gap-10 lg:grid-cols-2">
        <SkillsProgress skills={data.techStack} />

        <ServicesSection services={data.offeredServices} />
      </div>

      <TimelineSection workExp={data.workExp} education={data.education} />
    </div>
  );
}
