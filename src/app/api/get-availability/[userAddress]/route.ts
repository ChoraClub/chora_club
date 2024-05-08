import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

export async function GET(request: NextRequest, res: NextResponse) {
  // console.log("POST req call");
  const userAddress = request.url.split("get-availability/")[1];
  // console.log(userAddress);
  try {
    // Connect to MongoDB
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("scheduling");

    // Find documents based on userAddress
    // console.log("Finding documents for user:", userAddress);
    const documents = await collection
      .find({
        userAddress: { $regex: new RegExp(`^${userAddress}$`, "i") },
      })
      .toArray();
    // console.log("Documents found:", documents);

    client.close();
    // console.log("MongoDB connection closed");

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data get availability by user:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
