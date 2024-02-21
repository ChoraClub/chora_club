// Import necessary modules and interfaces
import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the response body type
interface Session {
  booking_status: string;
  dao_name: string;
  description: string;
  host_address: string;
  joined_status: string;
  meetingId: string;
  meeting_status: string;
  slot_time: string;
  title: string;
  user_address: string;
  _id: string;
}

export async function POST(req: NextRequest, res: NextResponse<Session[]>) {
  try {
    const { dao_name, host_address } = await req.json();

    // Connect to MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    const SessionData = await collection
      .find({ dao_name: dao_name, host_address: host_address })
      .toArray();

    client.close();
    console.log("MongoDB connection closed");

    return NextResponse.json(SessionData, { status: 200 });
  } catch (error) {
    console.error(`Error fetching Session Data:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
