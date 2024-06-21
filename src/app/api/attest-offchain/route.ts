// attestOffchain.tsx
import { NextResponse, NextRequest } from "next/server";
import {
  SchemaEncoder,
  EAS,
  createOffchainURL,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { stringToBytes, bytesToHex } from "viem";
import axios from "axios";
import { connectDB } from "@/config/connectDB";
import {
  ATTESTATION_ARB_URL,
  ATTESTATION_OP_URL,
  BASE_URL,
  OFFCHAIN_ARB_ATTESTATION_BASE_URL,
  OFFCHAIN_OP_ATTESTATION_BASE_URL,
  SCHEMA_ID,
} from "@/config/constants";
interface MeetingRequestBody {
  host_address: string;
  user_address: string;
  slot_time: string;
  meetingId: string;
  meeting_status: boolean;
  joined_status: boolean;
  booking_status: boolean;
  dao_name: string;
  title: string;
  description: string;
  uid_host: string;
  uid_user: string;
}

interface AttestOffchainRequestBody {
  recipient: string;
  meetingId: string;
  meetingType: number;
  startTime: number;
  endTime: number;
  daoName: string;
}

interface MyError {
  message: string;
  code?: number; // Optionally, you can include a code for specific error types
}

// const allowedOrigin = "http://localhost:3000";
const allowedOrigin = BASE_URL;

// const url = process.env.NEXT_PUBLIC_ATTESTATION_URL;
// // Set up your ethers provider and signer
// const provider = new ethers.JsonRpcProvider(url, undefined, {
//   staticNetwork: true,
// });
// const privateKey = process.env.PVT_KEY ?? "";
// const signer = new ethers.Wallet(privateKey, provider);
// const eas = new EAS("0x4200000000000000000000000000000000000021");
// eas.connect(signer);

export async function POST(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get("Origin");
  // if (origin !== allowedOrigin) {
  //   return NextResponse.json(
  //     { success: false, error: "Unauthorized access" },
  //     { status: 403 }
  //   );
  // }
  console.log("log1");
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const requestData = (await req.json()) as AttestOffchainRequestBody;
  // Your validation logic here

  try {
    console.log("log2");

    const atstUrl =
      requestData.daoName === "optimism"
        ? ATTESTATION_OP_URL
        : requestData.daoName === "arbitrum"
        ? ATTESTATION_ARB_URL
        : "";
    console.log("atstUrl", atstUrl);
    // Set up your ethers provider and signer
    const provider = new ethers.JsonRpcProvider(atstUrl, undefined, {
      staticNetwork: true,
    });
    const privateKey = process.env.PVT_KEY ?? "";
    const signer = new ethers.Wallet(privateKey, provider);
    console.log("signer", signer);

    const EASContractAddress =
      requestData.daoName === "optimism"
        ? "0x4200000000000000000000000000000000000021"
        : requestData.daoName === "arbitrum"
        ? "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458"
        : "";
    const eas = new EAS(EASContractAddress);

    eas.connect(signer);
    console.log("Connected");
    // Your initialization code remains the same
    const offchain = await eas.getOffchain();
    console.log(offchain);
    const schemaEncoder = new SchemaEncoder(
      "bytes32 MeetingId,uint8 MeetingType,uint32 StartTime,uint32 EndTime"
    );

    console.log(schemaEncoder);

    const encodedData = schemaEncoder.encodeData([
      {
        name: "MeetingId",
        value: bytesToHex(stringToBytes(requestData.meetingId), { size: 32 }),
        type: "bytes32",
      },
      { name: "MeetingType", value: requestData.meetingType, type: "uint8" },
      { name: "StartTime", value: requestData.startTime, type: "uint32" },
      { name: "EndTime", value: requestData.endTime, type: "uint32" },
    ]);

    console.log(encodedData);

    const expirationTime = BigInt(0);
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    console.log(expirationTime);
    console.log(currentTime);

    console.log("---------");
    console.log(typeof currentTime);
    console.log("---------");

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        schema: SCHEMA_ID,
        recipient: requestData.recipient,
        time: currentTime,
        expirationTime: expirationTime,
        revocable: false,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      signer
    );

    const pkg = {
      sig: offchainAttestation,
      signer: await signer.getAddress(),
    };

    let baseUrl = "";

    if (requestData.daoName === "optimism") {
      baseUrl = OFFCHAIN_OP_ATTESTATION_BASE_URL;
    } else if (requestData.daoName) {
      baseUrl = OFFCHAIN_ARB_ATTESTATION_BASE_URL;
    }
    const url = baseUrl + createOffchainURL(pkg);

    const data = {
      filename: `eas.txt`,
      textJson: JSON.stringify(pkg),
    };

    console.log("base url: ", baseUrl);

    let uploadstatus = false;
    console.log("data: ", data);
    try {
      const response = await axios.post(`${baseUrl}/offchain/store`, data);
      if (response.data) {
        uploadstatus = true;
      }
      console.log("response data", response.data);
      console.log(
        "requestData.meetingId.split",
        requestData.meetingId.split("/")[0]
      );

      if (requestData.meetingType === 1) {
        const client = await connectDB();

        const db = client.db();
        const collection = db.collection("meetings");
        console.log("in meeting type 1");
        await collection.findOneAndUpdate(
          { meetingId: requestData.meetingId.split("/")[0] },
          {
            $set: {
              uid_host: response.data.offchainAttestationId,
            },
          }
        );

        client.close();
      } else if (requestData.meetingType === 2) {
        const client = await connectDB();

        const db = client.db();
        const collection = db.collection("meetings");
        console.log("meeting type 2");
        await collection.findOneAndUpdate(
          {
            meetingId: requestData.meetingId.split("/")[0],
            "attendees.attendee_address": requestData.recipient,
          },
          {
            $set: {
              "attendees.$.attendee_uid": response.data.offchainAttestationId,
            },
          }
        );

        client.close();
      } else if (requestData.meetingType === 3) {
        const client = await connectDB();

        const db = client.db();
        const collection = db.collection("office_hours");

        await collection.findOneAndUpdate(
          { meetingId: requestData.meetingId.split("/")[0] },
          {
            $set: {
              uid_host: response.data.offchainAttestationId,
            },
          }
        );

        client.close();
      } else if (requestData.meetingType === 4) {
        const client = await connectDB();

        const db = client.db();
        const collection = db.collection("office_hours");

        await collection.findOneAndUpdate(
          {
            meetingId: requestData.meetingId.split("/")[0],
            "attendees.attendee_address": requestData.recipient,
          },
          {
            $set: {
              "attendees.$.attendee_uid": response.data.offchainAttestationId,
            },
          }
        );

        client.close();
      }
    } catch (error) {
      console.error("Error submitting signed attestation: ", error);

      return NextResponse.json(
        { success: true, offchainAttestation, url, uploadstatus },
        { status: 200 }
      );
    }

    // Rest of your code remains the same

    return NextResponse.json(
      { success: true, offchainAttestation, url, uploadstatus },
      { status: 200 }
    );
  } catch (error: unknown) {
    const err = error as MyError; // Cast error to your custom error interface

    console.error("Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
