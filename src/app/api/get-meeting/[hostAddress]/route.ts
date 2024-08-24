import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

type Params = {
  hostAddress: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  const url = new URL(req.url);
  const daoName = url.searchParams.get("dao_name");
  const host_address = context.params.hostAddress;
  console.log("host_address:::", host_address);
  try {
    // Connect to MongoDB
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Find documents based on user_address
    const documents = await collection
      .find({
        host_address: { $regex: new RegExp(`^${host_address}$`, "i") },
        dao_name: daoName,
      })
      .sort({ slot_time: -1 })
      .toArray();

    client.close();

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data in get meeting by host:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, context: { params: Params }) {
  const host_address = context.params.hostAddress;
  console.log("host_address:::", host_address);
  try {
    // Connect to MongoDB
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Get the current time in ISO format
    const currentTimeISO = new Date().toISOString();

    // console.log("currentTimeISO", currentTimeISO);

    let currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() - 30);
    const updatedTimeISO = currentTime.toISOString();
    // console.log("updatedTimeISO", updatedTimeISO);
    // Find documents based on host_address and slot_time
    const documents = await collection
      .find({
        host_address: { $regex: new RegExp(`^${host_address}$`, "i") },
        slot_time: { $gte: updatedTimeISO },
      })
      .toArray();

    client.close();

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data in get meeting by host:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
