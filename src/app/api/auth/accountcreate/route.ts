import { connectDB } from "@/config/connectDB";
import { NextApiResponse } from "next";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  address: string;
}

interface DelegateRequestBody {
  address: string;
  isEmailVisible: boolean;
  createdAt: Date;
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  let client;
  try {
    // JWT verification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    let UserAddress;
    try {
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET!
      ) as JwtPayload;
      // console.log("Decoded", decoded);
      UserAddress = decoded.address;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { address, isEmailVisible, createdAt }: DelegateRequestBody =
      await req.json();

    client = await connectDB();
    const db = client.db();
    const collection = db.collection("delegates");

    const WalletAddress = req.headers.get("x-wallet-address");

    if (!WalletAddress || UserAddress !== WalletAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingDocument = await collection.findOne({
      address: { $regex: `^${WalletAddress}$`, $options: "i" },
    });

    if (existingDocument) {
      return NextResponse.json({ result: "Already Exists!" }, { status: 409 });
    }

    const newDocument = {
      address,
      isEmailVisible,
      createdAt,
      image: null,
      isDelegate: null,
      displayName: null,
      emailId: null,
      socialHandles: null,
      networks: null,
    };

    const result = await collection.insertOne(newDocument);

    if (result.insertedId) {
      const insertedDocument = await collection.findOne({
        _id: result.insertedId,
      });
      return NextResponse.json({ result: insertedDocument }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Failed to insert document" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error storing delegate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}