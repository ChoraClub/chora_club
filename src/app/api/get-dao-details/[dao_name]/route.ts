import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

type Params = {
  dao_name: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const dao_name = context.params.dao_name;
  console.log(dao_name);
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access both collections
    const db = client.db();
    const collection = db.collection("dao_details");

    const documents = await collection.find({ dao_name }).toArray();

    client.close();

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error retrieving data in meeting session data by id:",
      error
    );
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
