import { connectDB } from "@/config/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the request body type
interface OfficeHoursRequestBody {
  host_address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  meeting_status: string;
  dao_name: string;
  video_uri: string;
  meetingId: string;
}

// Define the response body type
interface OfficeHoursResponseBody {
  success: boolean;
  data?: {
    id: string;
    host_address: string;
    office_hours_slot: string;
    title: string;
    description: string;
    dao_name: string;
    meeting_status: string;
    video_uri: string;
    meetingId: string;
  } | null;
  error?: string;
}

export async function POST(
  req: NextRequest,
  res: NextApiResponse<OfficeHoursResponseBody>
) {
  const {
    host_address,
    office_hours_slot,
    title,
    description,
    meeting_status,
    dao_name,
    video_uri,
    meetingId,
  }: OfficeHoursRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await connectDB();
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Insert the new office hours document
    // console.log("Inserting office hours document...");
    const result = await collection.insertOne({
      host_address,
      office_hours_slot,
      title,
      description,
      meeting_status,
      dao_name,
      video_uri,
      meetingId,
    });
    // console.log("Office hours document inserted:", result);

    client.close();
    // console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      // console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      // console.log("Inserted document retrieved");
      return NextResponse.json({ result: insertedDocument }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
