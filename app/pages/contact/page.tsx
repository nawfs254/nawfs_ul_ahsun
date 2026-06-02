import db from "@/lib/db";
import ContactPage from "@/components/contact/ContactPage";

const Page = async () => {
  const profile = await db.getOne("myinfo");

  return <ContactPage data={JSON.parse(JSON.stringify(profile))} />;
};

export default Page;
