import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function GET(req: NextRequest, res: NextResponse) {
  const meetingId = req.url.split("meeting-officehours-data/")[1];
  try {
    // Connect to MongoDB database
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Find all office hours documents
    const officeHours = await collection.find({ meetingId }).toArray();

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
