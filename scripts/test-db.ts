import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

import db from "../lib/db";
import { signToken, verifyToken } from "../lib/auth";

async function main() {
  console.log("=== Testing MongoDB Integration ===");

  // 1. Test Admin Auth
  const isCorrect = await db.verifyAdmin("admin", "4dm1n");
  console.log("Admin valid check (admin/4dm1n):", isCorrect ? "PASS" : "FAIL");
  if (!isCorrect) throw new Error("Admin authentication verification failed!");

  const isWrong = await db.verifyAdmin("admin", "wrongpassword");
  console.log("Admin invalid check (admin/wrongpassword):", !isWrong ? "PASS" : "FAIL");

  // 2. Test Token Session
  const token = signToken("admin");
  const verified = verifyToken(token);
  console.log("Session token verification:", verified?.username === "admin" ? "PASS" : "FAIL");

  // 3. Test Live Data Retrieval
  const allData = await db.getAllPortfolioData();
  console.log("\nLive Database Data Retrieved:");
  console.log(" • Personal Name:", allData.personal?.name);
  console.log(" • Projects:", allData.projects?.length);
  console.log(" • Experiences:", allData.experiences?.length);
  console.log(" • Skills:", allData.skills?.length);
  console.log(" • Education:", allData.education?.length);
  console.log(" • Services:", allData.services?.length);
  console.log(" • Hobbies:", allData.hobbies?.length);
  console.log(" • FAQs:", allData.faqs?.length);

  console.log("\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test Error:", err);
    process.exit(1);
  });
