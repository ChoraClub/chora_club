import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";

// Define the type for an individual attendee
type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
};

// Define the request body type for adding attendees
interface AddAttendeeRequestBody {
  meetingId: string;
  meetingType: number;
  uidOnchain: string;
  address: string;
  attendees: Attendee[]; // Array of attendees
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const {
    meetingId,
    meetingType,
    uidOnchain,
    address,
  }: AddAttendeeRequestBody = await req.json();

  try {
    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("meetings");

    console.log("Fetching session document by meeting ID...");
    let existingDocument: any;

    if (meetingType === 1) {
      existingDocument = await collection.findOneAndUpdate(
        {
          meetingId: meetingId,
          host_address: address,
        },
        { $set: { onchain_host_uid: uidOnchain } }
      );
    } else if (meetingType === 2) {
      existingDocument = await collection.findOneAndUpdate(
        {
          meetingId: meetingId,
          "attendees.attendee_address": address,
        },
        { $set: { "attendees.$.onchain_attendee_uid": uidOnchain } }
      );
    }

    return NextResponse.json(
      { success: true, data: existingDocument },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating office hours:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
