import { MongoClient, MongoClientOptions } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// Define the response body type
interface OfficeHours {
  _id: string;
  host_address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  meeting_status: string;
  dao_name: string;
  video_uri: string | null;
  meetingId: string;
  attendees: { attendee_address: string }[];
}

export async function POST(req: NextRequest, res: NextResponse<OfficeHours[]>) {
  try {
    // Extract the attendee_address from the query parameters
    const { attendee_address } = await req.json();

    // Validate the attendee_address
    if (!attendee_address || typeof attendee_address !== "string") {
      return NextResponse.json(
        { error: "Invalid attendee address parameter" },
        { status: 400 }
      );
    }

    // Connect to MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: "chora-club",
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection<OfficeHours>("office_hours");

    // Find office hours documents based on the provided attendee_address
    const officeHours = await collection
      .find({
        "attendees.attendee_address": {
          $regex: new RegExp(`^${attendee_address}$`, "i"),
        },
      })
      .toArray();

    client.close();

    return NextResponse.json(officeHours, { status: 200 });
  } catch (error) {
    console.error("Error fetching office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
