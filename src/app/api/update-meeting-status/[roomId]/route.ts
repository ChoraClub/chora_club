import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, meetingType } = await req.json();
  // const meetingId = req.url.split("update-meeting-status/")[1];
  try {
    // Connect to MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: "chora-club",
    } as MongoClientOptions);

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
      const sessions = await collection.findOneAndUpdate(
        { meetingId },
        { $set: { meeting_status: "Ongoing" } }
      );

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
