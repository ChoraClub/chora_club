import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function PUT(req: NextRequest) {
  try {
    const { address, isEmailVisible } = await req.json();

    if (!address) {
      return NextResponse.json(
        { message: "Address is required" },
        { status: 400 }
      );
    }

    console.log("Received update request:", { address, isEmailVisible });

    console.log("Connecting to MongoDB...");
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("delegates");

    // Find documents matching the address (case-insensitive)
    const documents = await collection
      .find({ address: { $regex: `^${address}$`, $options: "i" } })
      .toArray();

    if (documents.length === 0) {
      return NextResponse.json(
        { message: "No document found with the provided address" },
        { status: 404 }
      );
    }

    // Update the first matching document
    const updateResult = await collection.updateOne(
      { _id: documents[0]._id },
      { $set: { isEmailVisible: isEmailVisible } }
    );

    if (updateResult.modifiedCount === 1) {
      // Fetch the updated document
      const updatedDocument = await collection.findOne({
        _id: documents[0]._id,
      });

      return NextResponse.json(
        {
          message: "Email visibility updated successfully",
          data: updatedDocument,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to update email visibility" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating email visibility:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
