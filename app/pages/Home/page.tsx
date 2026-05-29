import HeroSection from "@/components/HeroSection/HeroSection";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import TechStackSection from "@/components/TechStackSection/TechStackSection";
import db from "@/lib/db";
import React from "react";

const page = async () => {
  const myinfo = await db.getOne("myinfo");
  const featuredProjects = await db.get("projects", { featured: true });

  return (
    <div className="">
      <HeroSection profile={myinfo} />
      <TechStackSection techStack={myinfo?.techStack} />
      <FeaturedProjects
        projects={JSON.parse(JSON.stringify(featuredProjects))}
      />
    </div>
  );
};

export default page;
