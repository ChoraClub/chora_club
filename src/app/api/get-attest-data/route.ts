import { connectDB } from "@/config/connectDB";
import { BASE_URL } from "@/config/constants";
import { NextRequest, NextResponse } from "next/server";

async function delegateAttestationOffchain(data: any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const baseUrl = BASE_URL;
  const raw = JSON.stringify(data);
  console.log("raw", raw);
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      `${baseUrl}/api/attest-offchain/`,
      requestOptions
    );
    console.log("Response from attestation endpoint:", response);
    return response.json();
  } catch (error) {
    console.error("Error fetching from attestation endpoint:", error);
    throw error;
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { roomId } = await req.json();

  console.log("Incoming request with roomId:", roomId);

  try {
    // Connect to MongoDB
    const client = await connectDB();
    console.log("Connected to MongoDB");

    const db = client.db();
    const collection = db.collection("attestation");

    // Find data based on roomId
    const data = await collection.findOne({ roomId });
    console.log("Retrieved data from MongoDB:", data);

    // Close MongoDB client
    await client.close();
    console.log("Closed MongoDB client");

    if (!data) {
      console.log("Data not found for the given roomId");
      return NextResponse.json(
        { message: "Data not found for the given roomId" },
        { status: 404 }
      );
    }

    let token = "";

    if (data.dao_name === "optimism") {
      token = "OP";
    } else if (data.dao_name === "arbitrum") {
      token = "ARB";
    }

    // Delegate attestation on-chain based on meetingType
    if (data.meetingType === "officehours") {
      console.log("Meeting type: officehours");
      // For office hours, delegate attestation to hosts (meetingType 3) and participants (meetingType 4)
      await delegateAndSetAttestation(
        data.hosts[0].walletAddress,
        `${roomId}/${token}`,
        3,
        data.startTime,
        data.endTime,
        data.dao_name
      );
      for (const participant of data.participants) {
        await delegateAndSetAttestation(
          participant.walletAddress,
          `${roomId}/${token}`,
          4,
          data.startTime,
          data.endTime,
          data.dao_name
        );
      }
    } else if (data.meetingType === "session") {
      console.log("Meeting type: session: ", data);
      // For sessions, delegate attestation to hosts (meetingType 1) and participants (meetingType 2)
      await delegateAndSetAttestation(
        data.hosts[0].walletAddress,
        `${roomId}/${token}`,
        1,
        data.startTime,
        data.endTime,
        data.dao_name
      );
      for (const participant of data.participants) {
        await delegateAndSetAttestation(
          participant.walletAddress,
          `${roomId}/${token}`,
          2,
          data.startTime,
          data.endTime,
          data.dao_name
        );
      }
    }

    // Update attestation status to "attested"
    // await collection.updateOne(
    //   { roomId },
    //   { $set: { attestation: "attested" } }
    // );
    // console.log("Updated attestation status to 'attested'");

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function delegateAndSetAttestation(
  recipient: string,
  meetingId: string,
  meetingType: number,
  startTime: number,
  endTime: number,
  daoName: string
) {
  await delegateAttestationOffchain({
    recipient,
    meetingId,
    meetingType,
    startTime,
    endTime,
    daoName,
  });
}
