// Import necessary modules and interfaces
import { MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import { NextResponse, NextRequest } from "next/server";

interface UpdateBookingStatusResponse {
  success: boolean;
  error?: string;
}

export async function PUT(
  req: NextRequest,
  res: NextResponse<UpdateBookingStatusResponse>
) {
  try {
    const { id, meeting_status, booking_status, meetingId } = await req.json();

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
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("meetings");

    // Update the booking status of the meeting with the provided ID
    console.log(`Updating booking status for meeting with ID ${id}...`);
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { meeting_status, booking_status, meetingId } }
    );

    console.log("Meeting booking status updated:", updateResult);

    // Check if the document was successfully updated
    if (updateResult.modifiedCount === 0) {
      throw new Error("No meeting found for the provided ID");
    }

    client.close();
    console.log("MongoDB connection closed");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating meeting booking status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
