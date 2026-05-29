import HeroSection from "@/components/HeroSection/HeroSection";
import TechStackSection from "@/components/TechStackSection/TechStackSection";
import db from "@/lib/db";
import React from "react";

const page = async () => {
  const myinfo = await db.getOne("myinfo");
  console.log(myinfo);

  return (
    <div className="">
      <HeroSection profile={myinfo} />
      <TechStackSection techStack={myinfo?.techStack} />
    </div>
  );
};

export default page;
