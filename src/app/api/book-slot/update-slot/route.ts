// Import necessary modules and interfaces
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";
import { sendMail, compileBookedSessionTemplate } from "@/libs/mail";
import { connectDB } from "@/config/connectDB";

interface UpdateBookingStatusResponse {
  success: boolean;
  error?: string;
}

export async function PUT(
  req: NextRequest,
  res: NextResponse<UpdateBookingStatusResponse>
) {
  try {
    const { id, meeting_status, booking_status, meetingId } = await req.json();

    // Validate the ID and booking_status
    if (
      !id ||
      !booking_status ||
      typeof id !== "string" ||
      typeof booking_status !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid ID or booking status" },
        { status: 400 }
      );
    }

    // Connect to MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await connectDB();
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Update the booking status of the meeting with the provided ID
    // console.log(`Updating booking status for meeting with ID ${id}...`);
    console.log("meeting_status", meeting_status);
    console.log("booking_status", booking_status);
    console.log("meetingId", meetingId);
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { meeting_status, booking_status, meetingId } }
    );

    console.log("Meeting booking status updated:", updateResult);

    // Check if the document was successfully updated
    if (updateResult.modifiedCount === 0) {
      throw new Error("No meeting found for the provided ID");
    }
    const meeting = await collection.findOne({ _id: new ObjectId(id) });

    if (!meeting) {
      throw new Error("Meeting not found after update");
    }

    const { host_address, attendees } = meeting;

    // Assuming attendees is an array and you want the address of the first attendee
    const attendeeAddress =
      attendees.length > 0 ? attendees[0].attendee_address : null;

    console.log("host_address", host_address);
    console.log("attendeeAddress", attendeeAddress);

    const delegateCollection = db.collection("delegates");
    const documentsForUserEmail = await delegateCollection
      .find({ address: attendeeAddress })
      .toArray();
    for (const document of documentsForUserEmail) {
      const emailId = document.emailId;
      if (emailId && emailId !== "" && emailId !== undefined) {
        if (booking_status === "Approved") {
          try {
            await sendMail({
              to: emailId,
              name: "Chora Club",
              subject: "Session Booked",
              body: compileBookedSessionTemplate(
                "Your Session has been Approved.",
                "The Session you have booked has been approved by the delegate."
              ),
            });
          } catch (error) {
            console.error("Error sending mail:", error);
          }
        } else if (booking_status === "Rejected") {
          try {
            await sendMail({
              to: emailId,
              name: "Chora Club",
              subject: "Session Rejected",
              body: "The session you have booked has been rejected by the delegate.",
            });
          } catch (error) {
            console.error("Error sending mail:", error);
          }
        }
      }
    }

    client.close();
    // console.log("MongoDB connection closed");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating meeting booking status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
