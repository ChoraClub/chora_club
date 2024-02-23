import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the response body type
interface UpdateOfficeHoursResponse {
  success: boolean;
  error?: string;
}

interface OfficeHours {
  _id: string;
  address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  status: string;
  chain_name: string;
}
export async function PUT(
  req: NextRequest,
  res: NextApiResponse<UpdateOfficeHoursResponse>
) {
  console.log("calling.......");
  const address = req.url.split("update-office-hours/")[1];

  // console.log("address", address);

  try {
    // Connect to your MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Find the last active office hours document with the provided address
    // console.log("Finding last active office hours document...");
    const lastActiveOfficeHours = await collection.findOneAndUpdate(
      { address, status: "active" },
      { $set: { status: "inactive" } },
      { sort: { office_hours_slot: -1 } }
    );

    // console.log(
    //   "Last active office hours document found:",
    //   lastActiveOfficeHours
    // );

    if (!lastActiveOfficeHours) {
      throw new Error("No active office hours found for the provided address");
    }

    // Get the current office hours slot date and add 7 days to it
    const currentSlotDate = new Date(lastActiveOfficeHours.office_hours_slot);
    currentSlotDate.setDate(currentSlotDate.getDate() + 1);

    // Create new document with status set to active, new slot time, title, and description
    // console.log("Creating new office hours document...");
    const createResult = await collection.insertOne({
      address,
      office_hours_slot: currentSlotDate,
      title: lastActiveOfficeHours.title, // Using title from last active office hours
      description: lastActiveOfficeHours.description, // Using description from last active office hours
      chain_name: lastActiveOfficeHours.chain_name,
      status: "active",
    });
    // console.log("New office hours document created:", createResult);

    client.close();
    // console.log("MongoDB connection closed");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating office hours:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse<OfficeHours[]>) {
  try {
    // Extract the address query parameter from the request
    const address = req.url.split("update-office-hours/")[1];

    // Validate the address parameter
    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Invalid address parameter" },
        { status: 400 }
      );
    }

    // Connect to your MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("office_hours");

    // Find active office hours documents for the specified address
    // console.log("Fetching active office hours documents for address:", address);
    const activeOfficeHours = await collection
      .find({ address, status: "active" })
      .toArray();

    // console.log("Active office hours documents found:", activeOfficeHours);

    client.close();
    // console.log("MongoDB connection closed");

    return NextResponse.json(activeOfficeHours, { status: 200 });
  } catch (error) {
    console.error("Error fetching active office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
