import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, host_address, title, description, thumbnail_image } =
    await req.json();
  // const meetingId = req.url.split("update-meeting-status/")[1];
  console.log(
    "data of put api: ",
    meetingId,
    host_address,
    title,
    description,
    thumbnail_image
  );
  try {
    // Connect to MongoDB database
    const client = await connectDB();

    const db = client.db();
    const collection = db.collection("meetings");

    const sessions = await collection.findOneAndUpdate(
      { meetingId, host_address },
      {
        $set: {
          title: title,
          description: description,
          thumbnail_image: thumbnail_image,
        },
      }
    );

    client.close();

    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
