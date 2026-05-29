import ExperiencePage from "@/components/experience/ExperiencePage";
import db from "@/lib/db";

export default async function Page() {
  const data = await db.getOne("myinfo");

  return <ExperiencePage data={JSON.parse(JSON.stringify(data))} />;
}
