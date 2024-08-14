"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Recorder } from "@huddle01/server-sdk/recorder";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request, res: NextResponse) {
  //   const roomId = req.url;
  const roomId = request.url.split("startRecording/")[1];

  // const roomId = req.query.roomId;
  // const roomId = "czd-virl-alv";
  console.log("from start recording", roomId);
  if (!process.env.NEXT_PUBLIC_PROJECT_ID && !process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }

  const recorder = new Recorder(
    process.env.NEXT_PUBLIC_PROJECT_ID!,
    process.env.NEXT_PUBLIC_API_KEY!
  );

  const token = new AccessToken({
    apiKey: process.env.NEXT_PUBLIC_API_KEY!,
    roomId: roomId as string,
    role: Role.BOT,
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
  });

  const accessToken = await token.toJwt();

  const recording = await recorder.startRecording({
    roomId: roomId as string,
    token: accessToken,
  });

  console.log("recording", recording);
  return NextResponse.json({ status: 200 });
}
