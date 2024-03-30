import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

export async function PUT(req: NextRequest, res: NextResponse) {
  const meetingId = req.url.split("update-meeting-status/")[1];
  try {
    // Connect to MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: "chora-club",
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Find all office hours documents
    const officeHours = await collection.findOneAndUpdate(
      { meetingId },
      { $set: { meeting_status: "ongoing" } }
    );

    client.close();

    return NextResponse.json(officeHours, { status: 200 });
  } catch (error) {
    console.error("Error fetching office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
