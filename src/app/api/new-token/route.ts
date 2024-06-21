import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const createToken = async (
  roomId: string,
  role: string,
  displayName: string,
  address: string | null // Updated type to accept string or null
) => {
  const accessToken = new AccessToken({
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    roomId: roomId as string,
    role: role,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    options: {
      metadata: {
        displayName: displayName,
        walletAddress: address,
      },
    },
  });

  const token = await accessToken.toJwt();

  return token;
};

export async function POST(req: NextRequest) {
  const { roomId, role, displayName, address } = await req.json();

  console.log(roomId, role, displayName, address);

  if (!roomId) {
    return new Response("Missing roomId", { status: 400 });
  }

  if (!role) {
    return new Response("Missing role", { status: 400 });
  }

  if (!displayName) {
    return new Response("Missing displayName", { status: 400 });
  }

  let token: string;

  try {
    const response = await fetch(
      `https://api.huddle01.com/api/v1/live-meeting/preview-peers?roomId=${roomId}`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    const { previewPeers } = data;

    token = await createToken(
      roomId,
      previewPeers.length > 0 ? Role.GUEST : Role.HOST,
      displayName,
      address
    );
  } catch (error) {
    token = await createToken(roomId, Role.HOST, displayName, address);
  }

  return new Response(token, { status: 200 });
}
