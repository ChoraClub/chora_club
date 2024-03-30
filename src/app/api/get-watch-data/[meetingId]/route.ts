import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

type Params = {
  meetingId: string;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  console.log("GET req call");
  const meetingId = context.params.meetingId;
  console.log(meetingId);
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access both collections
    const db = client.db();
    const meetingsCollection = db.collection("meetings");
    const officeHoursCollection = db.collection("office_hours");

    // Find documents in "meetings" collection
    console.log("Finding documents from meetings for user:", meetingId);
    const meetingsDocuments = await meetingsCollection
      .find({ meetingId, meeting_status: "Recorded" })
      .toArray();
    console.log("Meetings documents found:", meetingsDocuments);

    // Find documents in "office_hours" collection
    console.log("Finding documents from office_hours for user:", meetingId);
    const officeHoursDocuments = await officeHoursCollection
      .find({ meetingId, status: "inactive" })
      .toArray();
    console.log("Office Hours documents found:", officeHoursDocuments);

    client.close();
    console.log("MongoDB connection closed");

    // Return the found documents from the collection where data is found
    if (meetingsDocuments.length > 0) {
      return NextResponse.json(
        { success: true, collection: "meetings", data: meetingsDocuments },
        { status: 200 }
      );
    } else if (officeHoursDocuments.length > 0) {
      return NextResponse.json(
        {
          success: true,
          collection: "office_hours",
          data: officeHoursDocuments,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: true, data: null }, // No documents found in either collection
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(
      "Error retrieving data in meeting session data by id:",
      error
    );
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
