import { connectDB } from "@/config/connectDB";
import { BASE_URL } from "@/config/constants";
import { NextRequest, NextResponse } from "next/server";

async function delegateAttestationOffchain(data: any) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (data.connectedAddress) {
    myHeaders.append("x-wallet-address", data.connectedAddress);
  }

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
  };

  const response = await fetch(
    `${BASE_URL}/api/attest-offchain/`,
    requestOptions
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { roomId, connectedAddress, meetingData } = await req.json();

  try {
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("attestation");

    const data = await collection.findOne({ roomId });

    await client.close();

    if (!data) {
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

    const attestationPromises: any = [];

    if (data.meetingType === "officehours") {
      data.hosts.forEach((host: any) => {
        attestationPromises.push(
          delegateAndSetAttestation(
            host?.metadata?.walletAddress,
            `${roomId}/${token}`,
            3,
            data.startTime,
            data.endTime,
            data.dao_name,
            connectedAddress,
            meetingData
          )
        );
      });
      data.participants.forEach((participant: any) => {
        attestationPromises.push(
          delegateAndSetAttestation(
            participant?.metadata?.walletAddress,
            `${roomId}/${token}`,
            4,
            data.startTime,
            data.endTime,
            data.dao_name,
            connectedAddress,
            meetingData
          )
        );
      });
    } else if (data.meetingType === "session") {
      data.hosts.forEach((host: any) => {
        attestationPromises.push(
          delegateAndSetAttestation(
            host?.metadata?.walletAddress,
            `${roomId}/${token}`,
            1,
            data.startTime,
            data.endTime,
            data.dao_name,
            connectedAddress,
            meetingData
          )
        );
      });
      data.participants.forEach((participant: any) => {
        attestationPromises.push(
          delegateAndSetAttestation(
            participant?.metadata?.walletAddress,
            `${roomId}/${token}`,
            2,
            data.startTime,
            data.endTime,
            data.dao_name,
            connectedAddress,
            meetingData
          )
        );
      });
    }

    await Promise.all(attestationPromises);

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
  daoName: string,
  connectedAddress: string,
  meetingData: any
) {
  return delegateAttestationOffchain({
    recipient,
    meetingId,
    meetingType,
    startTime,
    endTime,
    daoName,
    connectedAddress,
    meetingData,
  });
}
