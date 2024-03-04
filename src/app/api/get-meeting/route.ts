import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Fetch all documents from the collection
    const documents = await collection.find().toArray();

    client.close();

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
