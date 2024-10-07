// Import necessary modules and interfaces
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";
import { sendMail, compileBookedSessionTemplate } from "@/libs/mail";
import { SOCKET_BASE_URL } from "@/config/constants";
import { io } from "socket.io-client";
import {
  formatSlotDateAndTime,
  getDisplayNameOrAddr,
} from "@/utils/NotificationUtils";

interface UpdateBookingStatusResponse {
  success: boolean;
  error?: string;
}

export async function PUT(
  req: NextRequest,
  res: NextResponse<UpdateBookingStatusResponse>
) {
  try {
    const {
      id,
      meeting_status,
      booking_status,
      meetingId,
      rejectionReason,
      host_address,
      title,
      slot_time,
      dao_name,
      attendee_address,
      attendee_joined_status,
      host_joined_status,
    } = await req.json();

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
      {
        $set: {
          meeting_status,
          booking_status,
          meetingId,
          rejectionReason,
          host_joined_status,
          "attendees.$[elem].attendee_joined_status": attendee_joined_status,
        },
      },
      {
        arrayFilters: [{ "elem.attendee_address": attendee_address }],
      }
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

    const { attendees } = meeting;

    // Assuming attendees is an array and you want the address of the first attendee
    const attendeeAddress =
      attendees.length > 0 ? attendees[0].attendee_address : null;

    console.log("host_address", host_address);
    console.log("attendeeAddress", attendeeAddress);

    if (booking_status === "Rejected") {
      // const localSlotTime = await formatSlotDateAndTime(slot_time);
      const localSlotTime = await formatSlotDateAndTime({
        dateInput: slot_time,
      });
      const hostENSNameOrAddress = await getDisplayNameOrAddr(host_address);
      const notificationToGuest = {
        receiver_address: attendeeAddress,
        content: `The session titled "${title}" on ${dao_name}, scheduled on ${localSlotTime} UTC, has been rejected by the delegate ${hostENSNameOrAddress}.`,
        createdAt: Date.now(),
        read_status: false,
        notification_name: "sessionRejectionForGuest",
        notification_title: "Session Rejected",
        notification_type: "newBooking",
      };

      const notificationCollection = db.collection("notifications");

      const notificationResults = await notificationCollection.insertOne(
        notificationToGuest
      );

      console.log("notificationResults", notificationResults);

      if (notificationResults.acknowledged === true) {
        const insertedNotifications = await notificationCollection
          .find({
            _id: { $in: Object.values(notificationResults.insertedId) },
          })
          .toArray();

        console.log("insertedNotifications", insertedNotifications);
      }

      const dataToSendGuest = {
        ...notificationToGuest,
        _id: notificationResults.insertedId,
      };

      const attendee_address = attendeeAddress;

      console.log("dataToSendGuest", dataToSendGuest);

      const socket = io(`${SOCKET_BASE_URL}`, {
        withCredentials: true,
      });
      socket.on("connect", () => {
        console.log("Connected to WebSocket server from API");
        socket.emit("reject_session", {
          attendee_address,
          dataToSendGuest,
        });
        console.log("Message sent from API to socket server");
        socket.disconnect();
      });

      socket.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
      });

      socket.on("error", (err) => {
        console.error("WebSocket error:", err);
      });
    }

    const delegateCollection = db.collection("delegates");
    const documentsForUserEmail = await delegateCollection
      .find({ address: attendeeAddress })
      .toArray();
    for (const document of documentsForUserEmail) {
      const emailId = document.emailId;
      if (emailId && emailId !== "" && emailId !== undefined) {
        if (booking_status === "Rejected") {
          try {
            await sendMail({
              to: emailId,
              name: "Chora Club",
              subject: "Session Rejected",
              body: `The session you have booked has been rejected by the delegate due to following reason: ${rejectionReason}`,
            });
          } catch (error) {
            console.error("Error sending mail:", error);
          }
        }
      }
    }

    client.close();
    // console.log("MongoDB connection closed");
    console.log("Rejection successful in API");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating meeting booking status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
