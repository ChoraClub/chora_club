import { connectDB } from "@/config/connectDB";
import { NextResponse, NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/config/constants";

export async function POST(req: NextRequest) {
  const { id, markAll, receiver_address } = await req.json();

  if (!receiver_address) {
    return NextResponse.json(
      { error: "Receiver address is required" },
      { status: 400 }
    );
  }

  try {
    const client = await connectDB();
    const db = client.db();
    const notificationCollection = db.collection("notifications");

    if (markAll) {
      // Mark all notifications for the receiver_address as read
      await notificationCollection.updateMany(
        { receiver_address, read_status: false },
        { $set: { read_status: true } }
      );
    } else if (id) {
      // Mark a single notification for the receiver_address as read
      await notificationCollection.updateOne(
        { _id: ObjectId.createFromHexString(id), receiver_address },
        { $set: { read_status: true } }
      );
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Initialize the WebSocket connection
    const socket = io(`${SOCKET_BASE_URL}`, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server from API");
      // Send a message or notification update if necessary
      socket.emit("notification-updated", { id, markAll, receiver_address });
      console.log("Message sent from API to socket server");
      socket.disconnect();
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    socket.on("error", (err) => {
      console.error("WebSocket error:", err);
    });

    client.close();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
