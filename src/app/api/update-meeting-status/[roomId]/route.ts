import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { SOCKET_BASE_URL } from "@/config/constants";
import { io } from "socket.io-client";
import { getDisplayNameOrAddr } from "@/utils/NotificationUtils";

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, meetingType, additionalData } = await req.json();
  console.log("additionalData::", additionalData);

  const {
    daoName,
    sessionType,
    callerAddress,
    hostAddress,
    attendeeAddress,
    hostJoinedStatus,
    attendeeJoinedStatus,
    meetingData,
  } = await additionalData;

  console.log(
    daoName,
    sessionType,
    callerAddress,
    hostAddress,
    attendeeAddress,
    hostJoinedStatus,
    attendeeJoinedStatus,
    meetingData
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
        { $set: { meeting_status: "ongoing" } }
      );

      client.close();

      return NextResponse.json(officeHours, { status: 200 });
    } else if (collectionName === "meetings") {
      if (sessionType === "session") {
        console.log("inside type session");
        const userENSNameOrAddress = await getDisplayNameOrAddr(
          attendeeAddress
        );
        const hostENSNameOrAddress = await getDisplayNameOrAddr(hostAddress);
        if (callerAddress === hostAddress) {
          const sessions = await collection.findOneAndUpdate(
            { meetingId },
            {
              $set: {
                meeting_status: "Ongoing",
                host_joined_status: "Joined",
              },
            },
            {
              returnDocument: "after",
            }
          );
          console.log("sessions::", sessions);
          if (hostJoinedStatus === "Pending") {
            const notificationToGuest = {
              receiver_address: attendeeAddress,
              content: `Your session on ${meetingData.dao_name} titled "${meetingData.title}" has been started by the host ${hostENSNameOrAddress}.`,
              createdAt: Date.now(),
              read_status: false,
              notification_name: "sessionStartedByHost",
              notification_title: "Session Started",
              notification_type: "newBooking",
              additionalData: meetingData,
            };

            const notificationCollection = db.collection("notifications");

            const notificationResults = await notificationCollection.insertMany(
              [notificationToGuest]
            );

            console.log("notificationResults", notificationResults);

            if (notificationResults.insertedCount === 2) {
              const insertedNotifications = await notificationCollection
                .find({
                  _id: { $in: Object.values(notificationResults.insertedIds) },
                })
                .toArray();

              console.log("insertedNotifications", insertedNotifications);
            }

            const dataToSendGuest = {
              ...notificationToGuest,
              _id: notificationResults.insertedIds[1],
            };

            console.log("dataToSendGuest", dataToSendGuest);

            const socket = io(`${SOCKET_BASE_URL}`, {
              withCredentials: true,
            });
            socket.on("connect", () => {
              console.log("Connected to WebSocket server from API");
              socket.emit("session_started", {
                attendeeAddress,
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
          client.close();
          return NextResponse.json(sessions, { status: 200 });
        } else if (callerAddress === attendeeAddress) {
          const sessions = await collection.findOneAndUpdate(
            { meetingId },
            {
              $set: {
                // meeting_status: "Ongoing",
                "attendees.$[elem].attendee_joined_status": "Joined",
              },
            },
            {
              arrayFilters: [{ "elem.attendee_address": attendeeAddress }],
              returnDocument: "after",
            }
          );
          console.log("sessions::", sessions);
          if (attendeeJoinedStatus === "Pending") {
            const notificationToHost = {
              receiver_address: hostAddress,
              content: `Your session on ${meetingData.dao_name} titled "${meetingData.title}" has been started by the attendee ${userENSNameOrAddress}.`,
              createdAt: Date.now(),
              read_status: false,
              notification_name: "sessionStartedByGuest",
              notification_title: "Session Started",
              notification_type: "newBooking",
              additionalData: meetingData,
            };

            const notificationCollection = db.collection("notifications");

            const notificationResults = await notificationCollection.insertMany(
              [notificationToHost]
            );

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

            console.log("dataToSendHost", dataToSendHost);
            const socket = io(`${SOCKET_BASE_URL}`, {
              withCredentials: true,
            });
            socket.on("connect", () => {
              console.log("Connected to WebSocket server from API");
              socket.emit("session_started_by_guest", {
                hostAddress,
                dataToSendHost,
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
          client.close();
          return NextResponse.json(sessions, { status: 200 });
        }
      } else if (sessionType === "instant-meet") {
        console.log("inside type instant-meet");
        const sessions = await collection.findOneAndUpdate(
          { meetingId },
          {
            $set: {
              meeting_status: "Ongoing",
              host_joined_status: hostJoinedStatus,
            },
          },
          { returnDocument: "after" }
        );
        console.log("sessions::", sessions);
        client.close();
        return NextResponse.json(sessions, { status: 200 });
      }
    }
  } catch (error) {
    console.error("Error fetching office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
