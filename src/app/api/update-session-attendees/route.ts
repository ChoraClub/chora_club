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
  attendees: Attendee[]; // Array of attendees
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, attendees }: AddAttendeeRequestBody = await req.json();

  try {
    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("meetings");

    console.log("Fetching session document by meeting ID...");
    const existingDocument = await collection.findOne({
      meetingId: meetingId,
    });

    if (!existingDocument) {
      client.close();
      console.log("MongoDB connection closed");
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    console.log("Checking for existing attendees...");
    const existingAttendees = existingDocument.attendees || [];

    const uniqueAttendees = attendees.filter((newAttendee) => {
      return (
        newAttendee.attendee_address !== existingDocument.host_address &&
        !existingAttendees.some((existingAttendee: any) => {
          return (
            existingAttendee.attendee_address === newAttendee.attendee_address
          );
        })
      );
    });

    console.log("Adding unique attendees...");
    if (uniqueAttendees.length > 0) {
      const updatedDocument = await collection.updateOne(
        { meetingId },
        {
          /* @ts-ignore */
          $push: {
            attendees: {
              $each: uniqueAttendees,
            },
          },
        }
      );

      if (updatedDocument.modifiedCount !== 1) {
        return NextResponse.json(
          { success: false, error: "Failed to update document" },
          { status: 500 }
        );
      }
    } else {
      console.log("No unique attendees to add");
    }

    // console.log("Updating session document with attendees...");
    // const updatedDocument = await collection.updateOne(
    //   { meetingId },
    //   { $push: { attendees: { $each: attendees } } } // Use $push operator to add attendees to the array
    // );

    client.close();
    console.log("MongoDB connection closed");

    // if (updatedDocument.modifiedCount !== 1) {
    //   return NextResponse.json(
    //     { success: false, error: "Failed to update document" },
    //     { status: 500 }
    //   );
    // }

    // Fetch the updated document after the update
    const updatedDocumentData = await collection.findOne({ meetingId });

    return NextResponse.json(
      { success: true, data: updatedDocumentData },
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
