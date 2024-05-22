import { connectDB } from "@/config/connectDB";
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
  res: NextResponse<StoreAvailabilityResponseBody>
) {
  const {
    dao_name,
    userAddress,
    timeSlotSizeMinutes,
    allowedDates,
    dateAndRanges,
  }: StoreAvailabilityRequestBody = await req.json();

  try {
    // Connect to MongoDB
    const client = await connectDB();

    // Access the collection
    const db = client.db();
    const collection = db.collection("scheduling");

    // Check if a document with the same dao_name, userAddress, and timeSlotSizeMinutes exists
    const existingDocument = await collection.findOne({
      dao_name,
      userAddress,
      timeSlotSizeMinutes,
    });

    if (existingDocument) {
      // Update the existing document by pushing new allowedDates and dateAndRanges
      await collection.updateOne(
        {
          _id: existingDocument._id,
        },
        {
          /* @ts-ignore */
          $push: {
            allowedDates: { $each: allowedDates },
            dateAndRanges: { $each: dateAndRanges },
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );

      // Retrieve the updated document
      const updatedDocument = await collection.findOne({
        _id: existingDocument._id,
      });

      client.close();

      return NextResponse.json(
        { success: true, data: updatedDocument },
        { status: 200 }
      );
    } else {
      // Insert new data
      const result = await collection.insertOne({
        dao_name,
        userAddress,
        timeSlotSizeMinutes,
        allowedDates,
        dateAndRanges,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      client.close();

      if (result.insertedId) {
        // Retrieve the inserted document using the insertedId
        const insertedDocument = await collection.findOne({
          _id: result.insertedId,
        });

        return NextResponse.json(
          { success: true, data: insertedDocument },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: "Failed to retrieve inserted document" },
          { status: 500 }
        );
      }
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
    const client = await connectDB();
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
    console.error("Error retrieving data in store availability:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
