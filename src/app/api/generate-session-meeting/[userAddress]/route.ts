import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

export async function PUT(req: NextRequest, res: NextResponse) {
  console.log("GET req call");
  const user_address = req.url.split("get-session-data/")[1];
  console.log(user_address);
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Find documents based on user_address
    console.log("Finding documents for user:", user_address);
    const documents = await collection.find({ user_address }).toArray();
    console.log("Documents found:", documents);

    client.close();
    console.log("MongoDB connection closed");

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
