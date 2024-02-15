// Import necessary modules and interfaces
import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the response body type
interface OfficeHours {
  _id: string;
  address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  status: string;
  chain_name: string;
  office_hours_status: string;
}

// Define enum for office hours status
enum OfficeHoursStatus {
  Active = "active",
  Inactive = "inactive",
  Ongoing = "ongoing",
}

export async function POST(req: NextRequest, res: NextResponse<OfficeHours[]>) {
  try {
    // Extract the office_hours_status query parameter from the request
    const { office_hours_status } = await req.json();

    // Connect to MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Find office hours documents based on the provided office_hours_status
    console.log(`Fetching ${office_hours_status} office hours documents...`);
    const officeHours = await collection
      .find({ status: office_hours_status })
      .toArray();

    console.log(
      `${office_hours_status} office hours documents found:`,
      officeHours
    );

    client.close();
    console.log("MongoDB connection closed");

    return NextResponse.json(officeHours, { status: 200 });
  } catch (error) {
    console.error(`Error fetching office hours:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
