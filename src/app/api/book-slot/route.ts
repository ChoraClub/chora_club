import { connectDB } from "@/config/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import { sendMail, compileBookedSessionTemplate } from "@/libs/mail";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/config/constants";
import { getEnsName } from "@/utils/ENSUtils";
import { truncateAddress } from "@/utils/text";
import {
  formatSlotDateAndTime,
  getDisplayNameOrAddr,
} from "@/utils/NotificationUtils";
import { imageCIDs } from "@/config/staticDataUtils";

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
  meeting_status: string;
  joined_status: boolean;
  booking_status: string;
  dao_name: string;
  title: string;
  description: string;
  thumbnail_image: string;
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
    meeting_status: string;
    joined_status: boolean;
    booking_status: string;
    dao_name: string;
    title: string;
    description: string;
    thumbnail_image: string;
    session_type: string;
  } | null;
  error?: string;
}

function getRandomElementFromArray(arr: any[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
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
    thumbnail_image,
    session_type,
  }: MeetingRequestBody = await req.json();

  try {
    const client = await connectDB();

    const db = client.db();
    const collection = db.collection("meetings");

    const randomImage = getRandomElementFromArray(imageCIDs);

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
      thumbnail_image : randomImage,
      session_type,
    });

    if (result.insertedId) {
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });

      const delegateCollection = db.collection("delegates");
      const documentsForHostEmail = await delegateCollection
        .find({ address: host_address })
        .toArray();

      // const slotDate = new Date(slot_time);
      // const options: any = {
      //   weekday: "long",
      //   year: "numeric",
      //   month: "long",
      //   day: "numeric",
      //   hour: "numeric",
      //   minute: "numeric",
      //   hour12: true,
      // };
      // const localSlotTime = slotDate.toLocaleString("en-US", options);

      // const localSlotTime = await formatSlotDateAndTime(slot_time);
      const localSlotTime = await formatSlotDateAndTime({
        dateInput: slot_time,
      });

      if (session_type === "session") {
        const guestAddress = attendees[0].attendee_address;
        // const ensNameOrUserAddress = await getEnsName(guestAddress);
        // let userENSNameOrAddress = ensNameOrUserAddress?.ensNameOrAddress;
        // if (userENSNameOrAddress === undefined) {
        //   userENSNameOrAddress = truncateAddress(guestAddress);
        // }
        const userENSNameOrAddress = await getDisplayNameOrAddr(guestAddress);
        // const ensNameOrHostAddress = await getEnsName(host_address);
        // let hostENSNameOrAddress = ensNameOrHostAddress?.ensNameOrAddress;
        // if (hostENSNameOrAddress === undefined) {
        //   hostENSNameOrAddress = truncateAddress(userAddress);
        // }
        const hostENSNameOrAddress = await getDisplayNameOrAddr(host_address);
        const notificationToHost = {
          receiver_address: host_address,
          content: `Great news! 🎉 ${userENSNameOrAddress} has just booked a session with you on ${dao_name}. The session is scheduled on ${localSlotTime} and will focus on ${title}.`,
          createdAt: Date.now(),
          read_status: false,
          notification_name: "newBookingForHost",
          notification_title: "Session Booking",
          notification_type: "newBooking",
        };

        const notificationToGuest = {
          receiver_address: guestAddress,
          content: `Congratulations! 🎉 Your session on ${dao_name} titled "${title}" has been successfully booked with ${hostENSNameOrAddress}. The session will take place on ${localSlotTime}.`,
          createdAt: Date.now(),
          read_status: false,
          notification_name: "newBookingForGuest",
          notification_title: "Session Booking",
          notification_type: "newBooking",
        };

        const notificationCollection = db.collection("notifications");

        const notificationResults = await notificationCollection.insertMany([
          notificationToHost,
          notificationToGuest,
        ]);

        console.log("notificationResults", notificationResults);

        if (notificationResults.insertedCount === 2) {
          const insertedNotifications = await notificationCollection
            .find({
              _id: { $in: Object.values(notificationResults.insertedIds) },
            })
            .toArray();

          console.log("insertedNotifications", insertedNotifications);
        }
        const dataToSendHost = {
          ...notificationToHost,
          _id: notificationResults.insertedIds[0],
        };
        const dataToSendGuest = {
          ...notificationToGuest,
          _id: notificationResults.insertedIds[1],
        };

        const attendee_address = guestAddress;

        console.log("dataToSendHost", dataToSendHost);
        console.log("dataToSendGuest", dataToSendGuest);

        const socket = io(`${SOCKET_BASE_URL}`, {
          withCredentials: true,
        });
        socket.on("connect", () => {
          console.log("Connected to WebSocket server from API");
          socket.emit("new_session", {
            host_address,
            dataToSendHost,
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
                  notificationToHost.content
                ),
              });
            } catch (error) {
              console.error("Error sending mail:", error);
            }
          }
        }
        // }

        // if (session_type === "session") {

        const documentsForUserEmail = await delegateCollection
          .find({ address: guestAddress })
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
                  "🎉 Hooray! Your session is officially booked! ",
                  notificationToGuest.content
                ),
              });
            } catch (error) {
              console.error("Error sending mail:", error);
            }
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
      client.close();
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
