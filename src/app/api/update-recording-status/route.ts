import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, meetingType, recordedStatus } = await req.json();
  // const meetingId = req.url.split("update-meeting-status/")[1];

  console.log(
    "meetingId, meetingType, recordedStatus: ",
    meetingId,
    meetingType,
    recordedStatus
  );
  try {
    // Connect to MongoDB database
    const client = await connectDB();

    const collectionName =
      meetingType === "session" ? "meetings" : "office_hours";
    const db = client.db();
    const collection = db.collection(collectionName);

    if (collectionName === "office_hours") {
      const officeHours = await collection.findOneAndUpdate(
        { meetingId },
        { $set: { isMeetingRecorded: recordedStatus } }
      );

      client.close();

      return NextResponse.json(officeHours, { status: 200 });
    } else if (collectionName === "meetings") {
      const sessions = await collection.findOneAndUpdate(
        { meetingId },
        { $set: { isMeetingRecorded: recordedStatus } }
      );

      client.close();

      return NextResponse.json(sessions, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
