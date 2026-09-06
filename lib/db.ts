import clientPromise from "./mongodb";
import { ObjectId, Filter, Document } from "mongodb";
import {
  portfolioData,
  ProjectItem,
  WorkExperienceItem,
  EducationItem,
  SkillItem,
} from "@/data/portfolioData";

export const DB_NAME = process.env.MONGODB_DB || "portfolio";

class MongoService {
  public async getDb() {
    const client = await clientPromise;
    return client.db(DB_NAME);
  }

  public async collection<T extends Document = Document>(collectionName: string) {
    const db = await this.getDb();
    return db.collection<T>(collectionName);
  }

  // GET MANY
  async get<T extends Document = Document>(collectionName: string, filter: Filter<T> = {}): Promise<T[]> {
    const collection = await this.collection<T>(collectionName);
    return (await collection.find(filter).toArray()) as unknown as T[];
  }

  // GET ONE
  async getOne<T extends Document = Document>(collectionName: string, filter: Filter<T> = {}): Promise<T | null> {
    const collection = await this.collection<T>(collectionName);
    return (await collection.findOne(filter)) as unknown as (T | null);
  }

  // INSERT ONE
  async insertOne<T extends Document = Document>(collectionName: string, data: T) {
    const collection = await this.collection<T>(collectionName);
    return collection.insertOne(data as any);
  }

  // UPDATE BY ID
  async updateById(collectionName: string, id: string, data: Record<string, any>) {
    const collection = await this.collection(collectionName);
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  // UPDATE ONE
  async updateOne(collectionName: string, filter: Record<string, any>, data: Record<string, any>, upsert = false) {
    const collection = await this.collection(collectionName);
    return collection.updateOne(filter, { $set: data }, { upsert });
  }

  // DELETE BY ID
  async deleteById(collectionName: string, id: string) {
    const collection = await this.collection(collectionName);
    return collection.deleteOne({
      _id: new ObjectId(id),
    });
  }

  // --- ADMIN AUTHENTICATION HELPERS ---
  async verifyAdmin(username: string, password: string): Promise<boolean> {
    const admin = await this.getOne("admins", { username });
    if (!admin) {
      // Auto-initialize if database was somehow wiped
      if (username === "admin" && password === "4dm1n") {
        await this.updateOne(
          "admins",
          { username: "admin" },
          { username: "admin", password: "4dm1n", role: "admin", updatedAt: new Date() },
          true
        );
        return true;
      }
      return false;
    }
    return admin.password === password;
  }

  async updateAdminPassword(username: string, newPassword: string): Promise<boolean> {
    const collection = await this.collection("admins");
    const result = await collection.updateOne(
      { username },
      { $set: { password: newPassword, updatedAt: new Date() } },
      { upsert: true }
    );
    return result.acknowledged;
  }

  // --- COLLECTION SPECIFIC HELPERS (WITH LOCAL FALLBACK) ---

  async getPersonalInfo() {
    try {
      const doc = await this.getOne("personal_information");
      if (doc) return doc;
    } catch (err) {
      console.warn("MongoDB getPersonalInfo failed, falling back to local data:", err);
    }
    return portfolioData.personal;
  }

  async updatePersonalInfo(data: Record<string, any>) {
    const cleanData = { ...data };
    if (cleanData._id) {
      delete cleanData._id;
    }
    const collection = await this.collection("personal_information");
    return collection.updateOne(
      {},
      { $set: cleanData },
      { upsert: true }
    );
  }

  async getProjects(): Promise<ProjectItem[]> {
    try {
      const items = await this.get("projects");
      if (items && items.length > 0) return items as unknown as ProjectItem[];
    } catch (err) {
      console.warn("MongoDB getProjects failed, falling back to local data:", err);
    }
    return portfolioData.projects;
  }

  async getExperiences(): Promise<WorkExperienceItem[]> {
    try {
      const items = await this.get("experiences");
      if (items && items.length > 0) return items as unknown as WorkExperienceItem[];
    } catch (err) {
      console.warn("MongoDB getExperiences failed, falling back to local data:", err);
    }
    return portfolioData.experiences;
  }

  async getSkills(): Promise<SkillItem[]> {
    try {
      const items = await this.get("skills");
      if (items && items.length > 0) return items as unknown as SkillItem[];
    } catch (err) {
      console.warn("MongoDB getSkills failed, falling back to local data:", err);
    }
    return portfolioData.skills;
  }

  async getEducation(): Promise<EducationItem[]> {
    try {
      const items = await this.get("education");
      if (items && items.length > 0) return items as unknown as EducationItem[];
    } catch (err) {
      console.warn("MongoDB getEducation failed, falling back to local data:", err);
    }
    return portfolioData.education;
  }

  async getServices() {
    try {
      const items = await this.get("services");
      if (items && items.length > 0) return items;
    } catch (err) {
      console.warn("MongoDB getServices failed, falling back to local data:", err);
    }
    return portfolioData.services;
  }

  async getHobbies() {
    try {
      const items = await this.get("hobbies");
      if (items && items.length > 0) return items;
    } catch (err) {
      console.warn("MongoDB getHobbies failed, falling back to local data:", err);
    }
    return portfolioData.hobbies;
  }

  async getFaqs() {
    try {
      const items = await this.get("faqs");
      if (items && items.length > 0) return items;
    } catch (err) {
      console.warn("MongoDB getFaqs failed, falling back to local data:", err);
    }
    return portfolioData.faqs;
  }

  async getAllPortfolioData() {
    const [personal, projects, experiences, skills, education, services, hobbies, faqs] =
      await Promise.all([
        this.getPersonalInfo(),
        this.getProjects(),
        this.getExperiences(),
        this.getSkills(),
        this.getEducation(),
        this.getServices(),
        this.getHobbies(),
        this.getFaqs(),
      ]);

    return {
      personal,
      projects,
      experiences,
      skills,
      education,
      services,
      hobbies,
      faqs,
    };
  }
}

export const db = new MongoService();
export { portfolioData };
export default db;
