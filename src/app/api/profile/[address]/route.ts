import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb"; // Define the request body type
interface DelegateRequestBody {
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  emailId: string;
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
    description: string;
    daoName: string;
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
  req: Request,
  res: NextResponse<DelegateResponseBody>
) {
  // console.log("GET req call");
  const { address, daoName }: DelegateRequestBody = await req.json();
  try {
    // Connect to MongoDB
    // console.log("Connecting to MongoDB...");
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("delegates");

    // console.log("this is url", req.url);

    // Extract address from request parameters
    const address = req.url.split("profile/")[1];

    // Find documents based on address
    console.log("Finding documents for address:", address, daoName);
    const documents = await collection
      .find({
        address: { $regex: `^${address}$`, $options: "i" },
        daoName: daoName,
      })
      .toArray();
    // console.log("Documents found:", documents);

    client.close();
    // console.log("MongoDB connection closed");

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data in profile:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
