// Import necessary modules and interfaces
import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the response body type
interface OfficeHours {
  _id: string;
  address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  status: string;
  chain_name: string;
  video_uri: string;
  meetingId: string;
}

export async function POST(
  req: NextRequest,
  res: NextResponse<OfficeHours | { error: string }>
) {
  try {
    // Extract the meetingId parameter from the request query
    const { meetingId } = await req.json();

    // Connect to MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Find the office hours document based on the provided meetingId
    const officeHours = await collection.findOne({ meetingId: meetingId });

    // Close MongoDB connection
    client.close();

    if (officeHours) {
      return NextResponse.json(officeHours.address, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Office hours document not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(`Error fetching office hours:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
