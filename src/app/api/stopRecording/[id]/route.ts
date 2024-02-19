// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from "next/server";
import { Recorder } from "@huddle01/server-sdk/recorder";

interface Recordings {
  id: string;
  recordingUrl: string;
  recordingSize: number;
}

export async function GET(request: Request, res: NextResponse) {
  const roomId = request.url.split("stopRecording/")[1];
  console.log("room ID from stop", roomId);

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

  const recording = await recorder.stop({
    roomId: roomId as string,
  });

  console.log("recording", recording);

  const { msg } = recording;

  if (msg === "Stopped") {
    const response = await fetch(
      "https://api.huddle01.com/api/v1/get-recordings",
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
      }
    );
    const data = await response.json();

    const { recordings } = data as { recordings: Recordings[] };

    return NextResponse.json({ recording: recordings[0] }, { status: 200 });
  }

  return NextResponse.json({ recording }, { status: 200 });
}
