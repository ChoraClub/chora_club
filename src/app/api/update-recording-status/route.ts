import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, meetingType, recordedStatus, meetingStatus, nft_image } =
    await req.json();

  console.log(
    "meetingId, meetingType, recordedStatus: ",
    meetingId,
    meetingType,
    recordedStatus,
    meetingStatus
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
        {
          $set: {
            isMeetingRecorded: recordedStatus,
          },
        },
        { returnDocument: "after" }
      );

      client.close();

      return NextResponse.json(officeHours, { status: 200 });
    } else if (collectionName === "meetings") {
      const sessions = await collection.findOneAndUpdate(
        { meetingId },
        {
          $set: {
            isMeetingRecorded: recordedStatus,
            meeting_status: meetingStatus,
            nft_image: nft_image,
          },
        },
        { returnDocument: "after" }
      );

      if (sessions) {
        console.log("sessions: ", sessions);
        const updatedDocument = sessions;
        const { host_address, attendees } = updatedDocument;

        // Update the delegate collection to increase sessionRecords.hostedRecords.totalMeetings count
        const delegateCollection = db.collection("delegates");
        const delegateUpdateResult = await delegateCollection.findOneAndUpdate(
          { address: host_address },
          {
            $inc: { "meetingRecords.sessionHosted.totalHostedMeetings": 1 },
          },
          { returnDocument: "after", upsert: true } // Ensures the document is created if it doesn't exist
        );

        const attendeeUpdates = attendees.map(async (attendee: any) => {
          const { attendee_address } = attendee;
          return await delegateCollection.findOneAndUpdate(
            { address: attendee_address },
            {
              $inc: {
                "meetingRecords.sessionAttended.totalAttendedMeetings": 1,
              },
              // $setOnInsert: {
              //   "meetingRecords.sessionAttended.offchainCount": 0,
              //   "meetingRecords.sessionAttended.onchainCount": 0,
              //   "meetingRecords.hostedRecords.offchainCount": 0,
              //   "meetingRecords.hostedRecords.onchainCount": 0,
              //   "meetingRecords.hostedRecords.totalMeetings": 0,
              // },
            },
            { returnDocument: "after", upsert: true }
          );
        });

        const updatedAttendees = await Promise.all(attendeeUpdates);
      }

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
