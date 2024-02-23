import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the response body type
interface UpdateOfficeHoursResponse {
  success: boolean;
  error?: string;
}
interface DeleteOfficeHoursResponse {
  success: boolean;
  error?: string;
}

export async function PUT(
  req: Request,
  res: NextResponse<UpdateOfficeHoursResponse>
) {
  // console.log("calling.......");
  const address = req.url.split("edit-office-hours/")[1];
  // console.log(address);
  const { title, description, office_hours_slot, status } = await req.json();

  //   // Validate request body
  //   if (!title || !description || !startTime) {
  //     return NextResponse.json(
  //       { success: false, error: "Invalid request body" },
  //       { status: 400 }
  //     );
  //   }

  console.log("address", address);

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

    // Find the office hours document to update
    // console.log("Finding office hours document to update...");
    const officeHoursToUpdate = await collection.find({
      address,
      status: "active",
    });
    // console.log("office hour to update", officeHoursToUpdate);

    if (!officeHoursToUpdate) {
      return NextResponse.json(
        { success: false, error: "Office hours not found" },
        { status: 404 }
      );
    }

    // Update the office hours document
    // console.log("Updating office hours document...");
    await collection.updateMany(
      { address, status: "active" },
      {
        $set: {
          title,
          description,
          office_hours_slot,
        },
      }
    );

    client.close();
    // console.log("MongoDB connection closed");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating office hours:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: NextRequest,
  res: NextApiResponse<DeleteOfficeHoursResponse>
) {
  try {
    // Extract the address query parameter from the request
    const address = req.url.split("edit-office-hours/")[1];

    // Validate the address parameter
    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Invalid address parameter" },
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
    const collection = db.collection("office_hours");

    // Find and delete the office hours document with the provided address
    console.log("Deleting office hours document...");
    const deleteResult = await collection.deleteOne({
      address,
      status: "active",
    });
    console.log("Office hours document deleted:", deleteResult);

    // Check if the document was successfully deleted
    if (deleteResult.deletedCount === 0) {
      throw new Error("No office hours found for the provided address");
    }

    client.close();
    console.log("MongoDB connection closed");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting office hours:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
