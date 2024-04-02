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
  host_address: string;
  office_hours_slot: Date;
  title: string;
  description: string;
  meeting_status: string;
  dao_name: string;
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
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Test Room",
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        cache: "no-store",
      }
    );

    // if (!response.ok) {
    //   throw new Error("Failed to fetch");
    // }

    const result = await response.json();
    // console.log(result);
    const { roomId } = await result.data;

    // Connect to your MongoDB database
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    const db = client.db();
    const collection = db.collection("office_hours");

    const lastActiveOfficeHours = await collection.findOneAndUpdate(
      { host_address: address, meeting_status: "ongoing" },
      { $set: { meeting_status: "inactive" } },
      { sort: { office_hours_slot: -1 } }
    );

    console.log("lastActiveOfficeHours", lastActiveOfficeHours);

    if (!lastActiveOfficeHours) {
      throw new Error("No active office hours found for the provided address");
    }

    const currentSlotDate = new Date(lastActiveOfficeHours.office_hours_slot);
    currentSlotDate.setDate(currentSlotDate.getDate() + 1);

    const createResult = await collection.insertOne({
      host_address: address,
      office_hours_slot: currentSlotDate,
      title: lastActiveOfficeHours.title,
      description: lastActiveOfficeHours.description,
      dao_name: lastActiveOfficeHours.dao_name,
      meeting_status: "active",
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
      .find({ host_address: address, meeting_status: "active" })
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
