import { MongoClient } from "mongodb";

const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local (MONGODB_URI)");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

const defaultClientPromise = {
  then(...args: Parameters<Promise<MongoClient>["then"]>) {
    return getMongoClientPromise().then(...args);
  },
  catch(...args: Parameters<Promise<MongoClient>["catch"]>) {
    return getMongoClientPromise().catch(...args);
  },
  finally(...args: Parameters<Promise<MongoClient>["finally"]>) {
    return getMongoClientPromise().finally(...args);
  },
} as Promise<MongoClient>;

export default defaultClientPromise;
