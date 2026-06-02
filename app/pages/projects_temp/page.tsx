import db from "@/lib/db";
import ProjectsPage from "@/components/projects/ProjectsPage";

export default async function Page() {
  const projects = await db.get("projects");

  return <ProjectsPage projects={JSON.parse(JSON.stringify(projects))} />;
}
