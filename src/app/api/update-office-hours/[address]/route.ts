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
  meetingId: string;
}

const baseUrl = process.env.NEXTAUTH_URL;

export async function PUT(
  req: NextRequest,
  res: NextApiResponse<UpdateOfficeHoursResponse>
) {
  console.log("calling PUT....");
  const address = req.url.split("update-office-hours/")[1];

  try {
    const res = await fetch(`${baseUrl}/api/create-room`, {
      method: "GET",
    });
    const data = await res.json();
    const roomId = data.data; // Extract roomId directly from the response
    console.log("Generated roomId:", roomId);

    // Connect to your MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    const db = client.db();
    const collection = db.collection("office_hours");

    const lastActiveOfficeHours = await collection.findOneAndUpdate(
      { address, status: "active" },
      { $set: { status: "inactive" } },
      { sort: { office_hours_slot: -1 } }
    );

    if (!lastActiveOfficeHours) {
      throw new Error("No active office hours found for the provided address");
    }

    const currentSlotDate = new Date(lastActiveOfficeHours.office_hours_slot);
    currentSlotDate.setDate(currentSlotDate.getDate() + 1);

    const createResult = await collection.insertOne({
      address,
      office_hours_slot: currentSlotDate,
      title: lastActiveOfficeHours.title,
      description: lastActiveOfficeHours.description,
      chain_name: lastActiveOfficeHours.chain_name,
      status: "active",
      meetingId: roomId, // Insert roomId into the document
    });
    console.log("New office hours document created:", createResult);

    client.close();

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
    const address = req.url.split("update-office-hours/")[1];

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Invalid address parameter" },
        { status: 400 }
      );
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    const db = client.db();
    const collection = db.collection("office_hours");

    const activeOfficeHours = await collection
      .find({ address, status: "active" })
      .toArray();

    client.close();

    return NextResponse.json(activeOfficeHours, { status: 200 });
  } catch (error) {
    console.error("Error fetching active office hours:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
