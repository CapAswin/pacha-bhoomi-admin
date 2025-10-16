import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the client is not recreated on every reload
  // @ts-expect-error - create global var for dev hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    // @ts-expect-error - assign promise to global so it persists across module reloads
    global._mongoClientPromise = client.connect();
  }
  // @ts-expect-error - read persisted client promise
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
