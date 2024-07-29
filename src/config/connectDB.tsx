import { MongoClient, MongoClientOptions } from "mongodb";
import { DB_NAME } from "@/config/constants";

export async function connectDB() {
  const client = await MongoClient.connect(process.env.MONGODB_URI!, {
    dbName: DB_NAME,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // serverSelectionTimeoutMS: 30000,
    // socketTimeoutMS: 45000,
  } as MongoClientOptions);

  return client;
}
