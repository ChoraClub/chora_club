import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function POST(req: NextRequest, res: NextResponse) {
  const { address, dao_name } = await req.json();

  //   console.log("address", address);
  //   console.log("dao_name", dao_name);

  try {
    const client = await connectDB();

    try {
      const db = client.db();
      const meetingsCollection = db.collection("meetings");
      const attestationsCollection = db.collection("attestation");

      const hostedMeetings = await meetingsCollection
        .find({
          dao_name,
          host_address: address,
          meeting_status: "Recorded",
        })
        .sort({ slot_time: -1 })
        .toArray();

      const mergedHostedMeetings = await Promise.all(
        hostedMeetings.map(async (meeting) => {
          const { meetingId } = meeting;

          // Find documents in the "attestation" collection with matching roomId
          const attestations = await attestationsCollection
            .find({ roomId: meetingId })
            .toArray();

          // Merge attestation documents into the meeting document
          const mergedMeeting = {
            ...meeting,
            attestations,
          };

          return mergedMeeting;
        })
      );

      const attendedMeetings = await meetingsCollection
        .find({
          dao_name,
          meeting_status: "Recorded",
          "attendees.attendee_address": address,
        })
        .sort({ slot_time: -1 })
        .toArray();

      const mergedAttendedMeetings = await Promise.all(
        attendedMeetings.map(async (meeting) => {
          const { meetingId } = meeting;

          // Find documents in the "attestation" collection with matching roomId
          const attestations = await attestationsCollection
            .find({ roomId: meetingId })
            .toArray();

          // Merge attestation documents into the meeting document
          const mergedMeeting = {
            ...meeting,
            attestations,
          };

          return mergedMeeting;
        })
      );

      return NextResponse.json(
        {
          success: true,
          hostedMeetings: mergedHostedMeetings,
          attendedMeetings: mergedAttendedMeetings,
        },
        { status: 200 }
      );
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
