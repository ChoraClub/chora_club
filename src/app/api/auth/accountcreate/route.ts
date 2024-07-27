import { connectDB } from "@/config/connectDB";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";

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
  createdAt: Date;
  socialHandles: {
    twitter: string;
    discord: string;
    github: string;
  };
  networks: network_details[];
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  const {
    address,
    image,
    isDelegate,
    displayName,
    emailId,
    isEmailVisible,
    socialHandles,
    createdAt,
    networks,
  }: DelegateRequestBody = await req.json();

  try {
    const client = await connectDB();

    const db = client.db();
    const collection = db.collection("delegates");

    const WalletAddress = req.headers.get("x-wallet-address");

    const documents = await collection
      .find({ address: { $regex: `^${WalletAddress}$`, $options: "i" } })
      .toArray();

    if (documents.length == 0 && WalletAddress) {
      const result = await collection.insertOne({
        address,
        image,
        isDelegate,
        displayName,
        emailId,
        isEmailVisible,
        createdAt,
        socialHandles,
        networks,
      });
      console.log("Delegate document inserted:", result);

      if (result.insertedId) {
        const insertedDocument = await collection.findOne({
          _id: result.insertedId,
        });
        client.close();
        // console.log("Inserted document retrieved");
        return NextResponse.json({ result: insertedDocument }, { status: 200 });
      } else {
        client.close();
        return NextResponse.json(
          { error: "Failed to retrieve inserted document" },
          { status: 500 }
        );
      }
    } else {
      client.close();
      return NextResponse.json({ result: "Already Exist!" }, { status: 409 });
    }
  } catch (error) {
    console.error("Error storing delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
