import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

// interface DelegateRequestBody {
//   address: string;
//   image: string;
//   description: string;
//   daoName: string;
//   isDelegate: boolean;
//   displayName: string;
//   emailId: string;
//   socialHandles: {
//     twitter: string;
//     discord: string;
//     discourse: string;
//     github: string;
//   };
// }
type network_details = {
  dao_name: string;
  network: string;
  discourse: string;
  description: string;
};

interface DelegateRequestBody {
  address: string;
  image: string;
  isDelegate: boolean;
  displayName: string;
  emailId: string;
  isEmailVisible: boolean;
  socialHandles: {
    twitter: string;
    discord: string;
    github: string;
  };
  networks: network_details[];
}

// Define the response body type
// interface DelegateResponseBody {
//   success: boolean;
//   data?: {
//     id: string;
//     address: string;
//     image: string;
//     description: string;
//     daoName: string;
//     isDelegate: boolean;
//     socialHandles: {
//       twitter: string;
//       discord: string;
//       discourse: string;
//       github: string;
//     };
//   } | null;
//   error?: string;
// }

interface DelegateResponseBody {
  success: boolean;
  data?: {
    id: string;
    address: string;
    image: string;
    isDelegate: boolean;
    displayName: string;
    emailId: string;
    isEmailVisible: boolean;
    createdAt:Date;
    socialHandles: {
      twitter: string;
      discord: string;
      github: string;
    };
    networks: network_details[];
  } | null;
  error?: string;
}

export async function GET(
  req: Request,
  res: NextResponse<DelegateResponseBody>
) {
  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("delegates");
    const address = req.url.split("profile/")[1];

    console.log("Finding documents for address:", address);
    const documents = await collection
      .find({
        address: { $regex: `^${address}$`, $options: "i" },
      })
      .toArray();

    const processedDocuments = documents.map((doc) => {
      if (!doc.isEmailVisible) {
        const { emailId, ...restofDoc } = doc;
        return restofDoc;
      } else {
        return doc;
      }
    });

    client.close();

    return NextResponse.json(
      { success: true, data: processedDocuments },
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

export async function POST(
  req: Request,
  res: NextResponse<DelegateResponseBody>
) {
  // console.log("GET req call");
  const { address }: DelegateRequestBody = await req.json();

  try {
    // Connect to MongoDB
    // console.log("Connecting to MongoDB...");
    const client = await connectDB();
    // console.log("Connected to MongoDB");

    // Access the collection
    const db = client.db();
    const collection = db.collection("delegates");

    // console.log("this is url", req.url);

    // Extract address from request parameters
    const address = req.url.split("profile/")[1];

    // Find documents based on address
    console.log("Finding documents for address:", address);
    const documents = await collection
      .find({
        address: { $regex: `^${address}$`, $options: "i" },
        // daoName: daoName,
      })
      .toArray();

    client.close();
    // console.log("MongoDB connection closed");

    console.log("Existing called data retrieve", documents);

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
