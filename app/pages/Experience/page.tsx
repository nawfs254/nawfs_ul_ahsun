import ExperiencePage from "@/components/experience/ExperiencePage";
import db from "@/lib/db";

export default async function Page() {
  const data = await db.getOne("myinfo");
  const projects = await db.get("projects");

  const getExperienceYears = () => {
    if (!data?.workExp?.length) return 0;

    const dates = data.workExp
      .map((item: any) => item.timeline?.from)
      .filter(Boolean);

    if (!dates.length) return 0;

    const earliest = new Date(dates.sort()[0]);

    const years =
      (Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    return Math.max(1, Math.floor(years));
  };

  const experienceData = {
    ...data,

    stats: {
      experienceYears: `${getExperienceYears()}+`,

      projectsDelivered: `${projects.length}+`,

      erpModulesBuilt: `${
        projects?.filter((project: any) =>
          project.category?.toLowerCase().includes("erp"),
        ).length || 0
      }+`,

      technologies: data?.techStack?.length || 0,
    },
  };

  return <ExperiencePage data={experienceData} />;

  // return <ExperiencePage data={JSON.parse(JSON.stringify(data))} />;
}
