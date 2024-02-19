import { MongoClient, MongoClientOptions } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

// Define the request body type
interface DelegateRequestBody {
  address: string;
  image: string;
  description: string;
  daoName:string;
  isDelegate: boolean;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
}

// Define the response body type
interface DelegateResponseBody {
  success: boolean;
  data?: {
    id: string;
    address: string;
    image: string;
    daoName:string;
    description: string;
    isDelegate: boolean;
    socialHandles: {
      twitter: string;
      discord: string;
      discourse: string;
      github: string;
    };
  } | null;
  error?: string;
}

export async function POST(
  req: NextRequest,
  res: NextApiResponse<DelegateResponseBody>
) {
  const {
    address,
    image,
    description,
    daoName,
    isDelegate,
    socialHandles,
  }: DelegateRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("delegates");

    // Insert the new delegate document
    console.log("Inserting delegate document...");
    const result = await collection.insertOne({
      address,
      image,
      description,
      daoName,
      isDelegate,
      socialHandles,
    });
    console.log("Delegate document inserted:", result);

    client.close();
    console.log("MongoDB connection closed");

    if (result.insertedId) {
      // Retrieve the inserted document using the insertedId
      console.log("Retrieving inserted document...");
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      console.log("Inserted document retrieved");
      return NextResponse.json({ result: insertedDocument }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to retrieve inserted document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  res: NextApiResponse<DelegateResponseBody>
) {
  const {
    address,
    image,
    description,
    isDelegate,
    socialHandles,
  }: DelegateRequestBody = await req.json();

  try {
    // Connect to your MongoDB database
    console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("delegates");

    // Update the delegate document
    console.log("Updating delegate document...");
    const result = await collection.updateOne(
      { address },
      {
        $set: {
          image,
          description,
          isDelegate,
          socialHandles,
        },
      }
    );
    console.log("Delegate document updated:", result);

    client.close();
    console.log("MongoDB connection closed");

    if (result.modifiedCount > 0) {
      // If at least one document was modified
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // If no document was modified
      return NextResponse.json(
        { error: "No document found to update" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error updating delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
