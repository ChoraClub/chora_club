import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function POST(req: NextRequest, res: NextResponse) {
  const { roomId, meetingType } = await req.json(); // Assuming the request body contains the roomId and meetingType

  console.log("roomId", roomId);
  console.log("meetingType", meetingType);

  // Check if roomId is null or undefined
  if (roomId === null || roomId === "undefined") {
    return NextResponse.json(
      { success: false, message: "Room ID is required" },
      { status: 404 }
    );
  }

  let client;

  try {
    // Connect to MongoDB
    client = await connectDB();
    // Access the appropriate collection based on meetingType
    const collectionName =
      meetingType === "session" ? "meetings" : "office_hours";
    const db = client.db();
    const collection = db.collection(collectionName);

    // Find document based on roomId
    const meeting = await collection.findOne({ meetingId: roomId });

    // Check if meeting exists
    if (!meeting) {
      // Meeting does not exist
      return NextResponse.json(
        { success: true, message: "Meeting does not exist" },
        { status: 200 }
      );
    } else {
      console.log("meeting data:", meeting);
      // Meeting exists
      const statusField =
        meetingType === "session" ? "meeting_status" : "meeting_status";

      if (
        meeting[statusField] === "active" ||
        meeting[statusField] === "Upcoming"
      ) {
        // Meeting is upcoming
        return NextResponse.json(
          { success: true, message: "Meeting is upcoming", data: meeting },
          { status: 200 }
        );
      } else if (
        meeting[statusField] === "inactive" ||
        meeting[statusField] === "Recorded" ||
        meeting[statusField] === "Finished"
      ) {
        // Meeting has ended
        return NextResponse.json(
          { success: true, message: "Meeting has ended", data: meeting },
          { status: 200 }
        );
      } else if (
        meeting[statusField] === "ongoing" ||
        meeting[statusField] === "Ongoing"
      ) {
        // Meeting is ongoing
        return NextResponse.json(
          { success: true, message: "Meeting is ongoing", data: meeting },
          { status: 200 }
        );
      } else if (meeting[statusField] === "Denied") {
        // Meeting is Denied
        return NextResponse.json(
          { success: true, message: "Meeting has been denied", data: meeting },
          { status: 200 }
        );
      } else {
        // Meeting status is unrecognized
        return NextResponse.json(
          {
            success: false,
            message: "Meeting status is invalid",
            data: meeting,
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error checking meeting status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    // Close the MongoDB client
    if (client) {
      await client.close();
    }
  }
}
