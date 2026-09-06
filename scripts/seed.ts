import { MongoClient } from "mongodb";
import { portfolioData } from "../data/portfolioData";
import * as fs from "fs";
import * as path from "path";

// Load .env.local if not already in process.env
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define MONGODB_URI in your environment or .env.local");
}
const dbName = process.env.MONGODB_DB || "portfolio";

async function seedAll() {
  console.log(`Connecting to MongoDB Atlas...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(`Connected successfully! Target database: "${dbName}"\n`);
    const db = client.db(dbName);

    // 1. personal_information
    console.log(`1. Seeding "personal_information"...`);
    const personalCol = db.collection("personal_information");
    await personalCol.deleteMany({});
    await personalCol.insertOne({
      ...portfolioData.personal,
      updatedAt: new Date(),
    });
    console.log(`   ✓ 1 document inserted into "personal_information".`);

    // 2. projects
    console.log(`2. Seeding "projects"...`);
    const projectsCol = db.collection("projects");
    await projectsCol.deleteMany({});
    if (portfolioData.projects?.length > 0) {
      await projectsCol.insertMany(portfolioData.projects.map((p, idx) => ({ ...p, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.projects.length} documents inserted into "projects".`);
    }

    // 3. experiences
    console.log(`3. Seeding "experiences"...`);
    const expCol = db.collection("experiences");
    await expCol.deleteMany({});
    if (portfolioData.experiences?.length > 0) {
      await expCol.insertMany(portfolioData.experiences.map((e, idx) => ({ ...e, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.experiences.length} documents inserted into "experiences".`);
    }

    // 4. skills
    console.log(`4. Seeding "skills"...`);
    const skillsCol = db.collection("skills");
    await skillsCol.deleteMany({});
    if (portfolioData.skills?.length > 0) {
      await skillsCol.insertMany(portfolioData.skills.map((s, idx) => ({ ...s, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.skills.length} documents inserted into "skills".`);
    }

    // 5. education
    console.log(`5. Seeding "education"...`);
    const eduCol = db.collection("education");
    await eduCol.deleteMany({});
    if (portfolioData.education?.length > 0) {
      await eduCol.insertMany(portfolioData.education.map((ed, idx) => ({ ...ed, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.education.length} documents inserted into "education".`);
    }

    // 6. services
    console.log(`6. Seeding "services"...`);
    const servicesCol = db.collection("services");
    await servicesCol.deleteMany({});
    if (portfolioData.services?.length > 0) {
      await servicesCol.insertMany(portfolioData.services.map((s, idx) => ({ ...s, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.services.length} documents inserted into "services".`);
    }

    // 7. hobbies
    console.log(`7. Seeding "hobbies"...`);
    const hobbiesCol = db.collection("hobbies");
    await hobbiesCol.deleteMany({});
    if (portfolioData.hobbies?.length > 0) {
      await hobbiesCol.insertMany(portfolioData.hobbies.map((h, idx) => ({ ...h, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.hobbies.length} documents inserted into "hobbies".`);
    }

    // 8. faqs
    console.log(`8. Seeding "faqs"...`);
    const faqsCol = db.collection("faqs");
    await faqsCol.deleteMany({});
    if (portfolioData.faqs?.length > 0) {
      await faqsCol.insertMany(portfolioData.faqs.map((f, idx) => ({ ...f, order: idx + 1 })));
      console.log(`   ✓ ${portfolioData.faqs.length} documents inserted into "faqs".`);
    }

    // 9. admins (Single-user admin credentials)
    console.log(`9. Seeding "admins" collection...`);
    const adminsCol = db.collection("admins");
    await adminsCol.updateOne(
      { username: "admin" },
      {
        $set: {
          username: "admin",
          password: "4dm1n",
          role: "admin",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log(`   ✓ Admin user "admin" initialized in "admins" collection.`);

    // Summary Verification
    console.log(`\n======================================================`);
    console.log(`MongoDB Database "${dbName}" - All Collections Seeded:`);
    console.log(`======================================================`);
    const collections = await db.listCollections().toArray();
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(` • Collection "${c.name}": ${count} document(s)`);
    }
    console.log(`======================================================\n`);
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedAll();
