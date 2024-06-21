import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const { meetingId, video_uri } = await req.json();

  try {
    // Connect to MongoDB
    const client = await connectDB();
    const db = client.db();

    // Update video_uri in office_hours collection
    const officeHoursCollection = db.collection("office_hours");
    const officeHoursMeeting = await officeHoursCollection.findOneAndUpdate(
      { meetingId },
      { $set: { video_uri, meeting_status: "inactive" } }
    );

    // Update video_uri in the other collection
    const otherCollection = db.collection("meetings");
    const otherMeeting = await otherCollection.findOneAndUpdate(
      { meetingId },
      { $set: { video_uri, meeting_status: "Recorded" } }
    );

    // Close MongoDB client
    await client.close();

    if (!officeHoursMeeting && !otherMeeting) {
      return NextResponse.json(
        { message: "Meeting not found with the given meetingId" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Video URI updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating video URI:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
