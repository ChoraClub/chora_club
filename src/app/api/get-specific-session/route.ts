// Import necessary modules and interfaces
import { connectDB } from "@/config/connectDB";
import { SessionInterface } from "@/types/MeetingTypes";
import { NextResponse, NextRequest } from "next/server";

// Define the response body type

export async function POST(req: NextRequest, res: NextResponse<SessionInterface[]>) {
  try {
    const { dao_name, host_address } = await req.json();

    // Connect to MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await connectDB();
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    const SessionData = await collection
      .find({ dao_name: dao_name, host_address: host_address })
      .toArray();

    client.close();
    // console.log("MongoDB connection closed");

    return NextResponse.json(SessionData, { status: 200 });
  } catch (error) {
    console.error(`Error fetching Session Data:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
