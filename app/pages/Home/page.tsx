import db from "@/lib/db";
import React from "react";

const page = async () => {
  const myinfo = await db.getOne("myinfo");
  console.log(myinfo);

  return <div>page</div>;
};

export default page;
