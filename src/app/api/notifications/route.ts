// api/fetch-notifications.ts
import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  const client = await connectDB();
  try {
    const db = client.db();
    const collection = db.collection("notifications");

    const notifications = await collection
      .find({ receiver_address: address })
      .toArray();
    if (notifications.length > 0) {
      return NextResponse.json(
        { success: true, data: notifications },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, data: [] },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
