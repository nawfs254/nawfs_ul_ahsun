import db from "@/lib/db";
import AboutPage from "@/components/about/AboutPage";

const Page = async () => {
  const profile = await db.getOne("myinfo");

  return <AboutPage data={JSON.parse(JSON.stringify(profile))} />;
};

export default Page;
