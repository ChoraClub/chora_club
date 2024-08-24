import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { imageCIDs } from "@/config/staticDataUtils";

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
    const meetingsCollection = db.collection("meetings");
    const sessionMeeting = await meetingsCollection.findOneAndUpdate(
      { meetingId },
      {
        $set: {
          video_uri,
          meeting_status: "Recorded",
        },
      }
    );

    if (!officeHoursMeeting && !sessionMeeting) {
      return NextResponse.json(
        { message: "Meeting not found with the given meetingId" },
        { status: 404 }
      );
    }
    // // Call the FastAPI endpoint to process the video URL
    // const response = await axios.post(`${process.env.DESC_GENERATION_BASE_URL}/analyze`, {
    //   url: video_uri,
    // });

    // const { title, description } = response.data;

    // await otherCollection.findOneAndUpdate(
    //   { meetingId },
    //   { $set: { title, description } }
    // );

    // Close MongoDB client
    await client.close();
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
