import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { sendMail, compileBookedSessionTemplate } from "@/libs/mail";

type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
};

// Define the request body type
interface MeetingRequestBody {
  host_address: string;
  attendees: Attendee[];
  slot_time: string;
  meetingId: string;
  meeting_status: boolean;
  joined_status: boolean;
  booking_status: boolean;
  dao_name: string;
  title: string;
  description: string;
  session_type: string;
}

// Define the response body type
interface MeetingResponseBody {
  success: boolean;
  data?: {
    id: string;
    host_address: string;
    attendees: Attendee[];
    slot_time: string;
    meetingId: string;
    meeting_status: boolean;
    joined_status: boolean;
    booking_status: boolean;
    dao_name: string;
    title: string;
    description: string;
    session_type: string;
  } | null;
  error?: string;
}

export async function POST(
  req: NextRequest,
  res: NextApiResponse<MeetingResponseBody>
) {
  const {
    host_address,
    attendees,
    slot_time,
    meetingId,
    meeting_status,
    joined_status,
    booking_status,
    dao_name,
    title,
    description,
    session_type,
  }: MeetingRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Insert the new meeting document
    // console.log("Inserting meeting document...");
    const result = await collection.insertOne({
      host_address,
      attendees,
      slot_time,
      meetingId,
      meeting_status,
      joined_status,
      booking_status,
      dao_name,
      title,
      description,
      session_type,
    });
    // console.log("Meeting document inserted:", result);

    // console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      // console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });

      const delegateCollection = db.collection("delegates");
      const documentsForHostEmail = await delegateCollection
        .find({ address: host_address })
        .toArray();

      for (const document of documentsForHostEmail) {
        const emailId = document.emailId;
        if (emailId && emailId !== "" && emailId !== undefined) {
          try {
            await sendMail({
              to: emailId,
              name: "Chora Club",
              subject: "Session Booked",
              body: compileBookedSessionTemplate(
                "Your session has been Booked.",
                "You can Approve or Reject."
              ),
            });
          } catch (error) {
            console.error("Error sending mail:", error);
          }
        }
      }

      const userAddress = attendees[0].attendee_address;
      const documentsForUserEmail = await delegateCollection
        .find({ address: userAddress })
        .toArray();
      for (const document of documentsForUserEmail) {
        const emailId = document.emailId;
        if (emailId && emailId !== "" && emailId !== undefined) {
          try {
            await sendMail({
              to: emailId,
              name: "Chora Club",
              subject: "Session Booked",
              body: compileBookedSessionTemplate(
                "You have Booked a Session.",
                "Please wait till the delegate approves the meeting."
              ),
            });
          } catch (error) {
            console.error("Error sending mail:", error);
          }
        }
      }

      client.close();
      // console.log("Inserted document retrieved");
      return NextResponse.json(
        { success: true, result: insertedDocument },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
