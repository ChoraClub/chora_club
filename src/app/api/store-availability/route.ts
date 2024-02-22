import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the request body type
interface StoreAvailabilityRequestBody {
  dao_name: string;
  userAddress: string;
  timeSlotSizeMinutes: number;
  allowedDates: string[];
  dateAndRanges: Array<{
    date: string;
    timeRanges: Array<[string, string, string, string]>;
    formattedUTCTime_startTime: string;
    utcTime_startTime: string;
    formattedUTCTime_endTime: string;
    utcTime_endTime: string;
  }>;
}

// Define the response body type
interface StoreAvailabilityResponseBody {
  success: boolean;
  data?: {
    _id: string;
    dao_name: string;
    userAddress: string;
    timeSlotSizeMinutes: number;
    allowedDates: string[];
    dateAndRanges: Array<{
      date: string;
      timeRanges: Array<[string, string, string, string]>;
      formattedUTCTime_startTime: string;
      utcTime_startTime: string;
      formattedUTCTime_endTime: string;
      utcTime_endTime: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  error?: string;
}

export async function POST(
  req: NextRequest,
  res: NextApiResponse<StoreAvailabilityResponseBody>
) {
  const {
    dao_name,
    userAddress,
    timeSlotSizeMinutes,
    allowedDates,
    dateAndRanges,
  }: StoreAvailabilityRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("scheduling");

    // Insert the new availability document
    // console.log("Inserting availability document...");
    const result = await collection.insertOne({
      dao_name,
      userAddress,
      timeSlotSizeMinutes,
      allowedDates,
      dateAndRanges,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // console.log("Availability document inserted:", result);

    client.close();
    // console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      // console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      // console.log("Inserted document retrieved");
      return NextResponse.json({ result: insertedDocument }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing availability:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  res: NextResponse<StoreAvailabilityResponseBody>
) {
  // console.log("GET req call");
  try {
    // Connect to MongoDB
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("scheduling");

    // Extract userAddress from request parameters
    const userAddress = req.body;

    // Find documents based on userAddress
    // console.log("Finding documents for user:", userAddress);
    const documents = await collection.find({ userAddress }).toArray();
    // console.log("Documents found:", documents);

    client.close();
    // console.log("MongoDB connection closed");

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
