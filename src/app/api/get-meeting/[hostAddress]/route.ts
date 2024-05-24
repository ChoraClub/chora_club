import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function GET(req: NextRequest, res: NextResponse) {
  // console.log("GET req call");
  const host_address = req.url.split("get-meeting/")[1];
  // console.log(host_address);
  try {
    // Connect to MongoDB
    // console.log("Connecting to MongoDB...");
    const client = await connectDB();
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Find documents based on user_address
    // console.log("Finding documents for user:", host_address);
    const documents = await collection
      .find({ host_address: { $regex: new RegExp(`^${host_address}$`, "i") } })
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
    console.error("Error retrieving data in get meeting by host:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
