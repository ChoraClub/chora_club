import { MongoClient, MongoClientOptions } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// Define the response body type
interface OfficeHours {
  _id: string;
  address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  status: string;
  chain_name: string;
}

export async function POST(req: NextRequest, res: NextResponse<OfficeHours[]>) {
  try {
    // Extract the chain_name from the request body
    const { chain_name } = await req.json();

    // Validate the chain_name
    if (!chain_name || typeof chain_name !== "string") {
      return NextResponse.json(
        { error: "Invalid chain name parameter" },
        { status: 400 }
      );
    }

    // Connect to MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: "chora-club",
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    const collection = db.collection<OfficeHours>("office_hours");

    // Find office hours documents based on the provided chain_name
    const officeHours = await collection.find({ chain_name }).toArray();

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
