import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the request body type
interface OfficeHoursRequestBody {
  address: string;
  office_hours_slot: string;
  title: string;
  description: string;
  status: string;
  chain_name: string;
  video_uri: string;
  meetingId: string;
}

// Define the response body type
interface OfficeHoursResponseBody {
  success: boolean;
  data?: {
    id: string;
    address: string;
    office_hours_slot: string;
    title: string;
    description: string;
    chain_name: string;
    status: string;
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
    address,
    office_hours_slot,
    title,
    description,
    status,
    chain_name,
    video_uri,
    meetingId,
  }: OfficeHoursRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Insert the new office hours document
    console.log("Inserting office hours document...");
    const result = await collection.insertOne({
      address,
      office_hours_slot,
      title,
      description,
      status,
      chain_name,
      video_uri,
      meetingId,
    });
    console.log("Office hours document inserted:", result);

    client.close();
    console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      console.log("Inserted document retrieved");
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
