import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "portfolio";

class MongoService {
  private async collection(collectionName: string) {
    const client = await clientPromise;
    return client.db(DB_NAME).collection(collectionName);
  }

  async get(collectionName: string, filter = {}) {
    const collection = await this.collection(collectionName);

    return await collection.find(filter).toArray();
  }

  async getOne(collectionName: string, filter = {}) {
    const collection = await this.collection(collectionName);

    return await collection.findOne(filter);
  }

  async post(collectionName: string, body: any) {
    const collection = await this.collection(collectionName);

    return await collection.insertOne(body);
  }

  async put(collectionName: string, id: string, body: any) {
    const collection = await this.collection(collectionName);

    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body },
    );
  }

  async delete(collectionName: string, id: string) {
    const collection = await this.collection(collectionName);

    return await collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}

const db = new MongoService();

export default db;
