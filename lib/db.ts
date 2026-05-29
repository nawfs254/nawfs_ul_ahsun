import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "portfolio";

class MongoService {
  private async collection(collectionName: string) {
    const client = await clientPromise;

    return client.db(DB_NAME).collection(collectionName);
  }

  // GET MANY
  async get(collectionName: string, filter: any = {}) {
    const collection = await this.collection(collectionName);

    return collection.find(filter).toArray();
  }

  // GET ONE
  async getOne(collectionName: string, filter: any = {}) {
    const collection = await this.collection(collectionName);

    return collection.findOne(filter);
  }

  // INSERT ONE
  async insertOne(collectionName: string, data: any) {
    const collection = await this.collection(collectionName);

    return collection.insertOne(data);
  }

  // UPDATE BY ID
  async updateById(collectionName: string, id: string, data: any) {
    const collection = await this.collection(collectionName);

    return collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      },
    );
  }

  // UPDATE BY FILTER
  async updateOne(collectionName: string, filter: any, data: any) {
    const collection = await this.collection(collectionName);

    return collection.updateOne(filter, {
      $set: data,
    });
  }

  // DELETE BY ID
  async deleteById(collectionName: string, id: string) {
    const collection = await this.collection(collectionName);

    return collection.deleteOne({
      _id: new ObjectId(id),
    });
  }

  // DELETE BY FILTER
  async deleteOne(collectionName: string, filter: any) {
    const collection = await this.collection(collectionName);

    return collection.deleteOne(filter);
  }
}

const db = new MongoService();

export default db;
