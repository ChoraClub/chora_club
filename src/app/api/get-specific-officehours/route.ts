import { connectDB } from "@/config/connectDB";
import { NextRequest, NextResponse } from "next/server";

// Define the response body type
interface OfficeHours {
  _id: string;
  host_address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  meeting_status: string;
  dao_name: string;
}

export async function POST(req: NextRequest, res: NextResponse<OfficeHours[]>) {
  try {
    // Extract the dao_name from the request body
    const { dao_name } = await req.json();

    // Validate the dao_name
    if (!dao_name || typeof dao_name !== "string") {
      return NextResponse.json(
        { error: "Invalid chain name parameter" },
        { status: 400 }
      );
    }

    // Connect to MongoDB database
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection<OfficeHours>("office_hours");

    // Find office hours documents based on the provided dao_name
    const officeHours = await collection.find({ dao_name: dao_name }).toArray();

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
export async function GET(req: NextRequest, res: NextResponse<OfficeHours[]>) {
  try {
    // Connect to MongoDB database
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection<OfficeHours>("office_hours");

    // Find all office hours documents
    const officeHours = await collection.find().toArray();

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
