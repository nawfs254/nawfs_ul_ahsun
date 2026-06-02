import HeroSection from "@/components/herosection/HeroSection";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TechStackSection from "@/components/techstacksection/TechStackSection";
import db from "@/lib/db";

const HomePage = async () => {
  const myinfo = await db.getOne("myinfo");

  const projects = await db.get("projects");

  const featuredProjects = projects.filter((project: any) => project.featured);

  const getExperienceYears = () => {
    if (!myinfo?.workExp?.length) {
      return "0+";
    }

    const startDates = myinfo.workExp
      .map((exp: any) => exp.timeline?.from)
      .filter(Boolean);

    if (!startDates.length) {
      return "0+";
    }

    const earliestDate = new Date(startDates.sort()[0]);

    const years =
      (Date.now() - earliestDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    return `${Math.max(1, Math.floor(years))}+`;
  };

  const profile = {
    ...myinfo,

    stats: [
      {
        value: getExperienceYears(),
        label: "Years Exp.",
      },

      {
        value: `${projects.length}+`,
        label: "Projects",
      },

      {
        value: `${myinfo?.techStack?.length || 0}+`,
        label: "Tech Stack",
      },
    ],
  };

  return (
    <div>
      <HeroSection profile={profile} />

      <TechStackSection techStack={myinfo?.techStack} />

      <FeaturedProjects projects={featuredProjects} />
    </div>
  );
};

export default HomePage;
