import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function PUT(req: NextRequest, res: NextResponse) {
  const {
    meetingId,
    host_address,
    title,
    description,
    thumbnail_image,
    deployedContractAddress,
  } = await req.json();

  console.log(
    "data of put api: ",
    meetingId,
    host_address,
    title,
    description,
    thumbnail_image,
    deployedContractAddress
  );

  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("meetings");

    // Prepare the update object
    const updateObject: { [key: string]: any } = {};

    // Only add fields to the update object if they are provided
    if (title !== undefined) updateObject.title = title;
    if (description !== undefined) updateObject.description = description;
    if (thumbnail_image !== undefined)
      updateObject.thumbnail_image = thumbnail_image;
    if (deployedContractAddress !== undefined)
      updateObject.deployedContractAddress = deployedContractAddress;

    const sessions = await collection.findOneAndUpdate(
      { meetingId, host_address },
      { $set: updateObject },
      { returnDocument: "after" } // Return the updated document
    );

    client.close();
    console.log("Sessions Updated successfully!!!");
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    console.error("Error updating sessions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
