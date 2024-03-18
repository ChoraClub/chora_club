import { NextResponse } from "next/server";
import { Recorder } from "@huddle01/server-sdk/recorder";

interface Recordings {
  url: any;
  id: string;
  recordingUrl: string;
  recordingSize: number;
}

export async function GET(
  request: Request,
  res: NextResponse
): Promise<void | Response> {
  const roomId = request.url.split("stopRecording/")[1];
  console.log("room ID from stop", roomId);

  if (!process.env.NEXT_PUBLIC_PROJECT_ID || !process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  const recorder = new Recorder(
    process.env.NEXT_PUBLIC_PROJECT_ID,
    process.env.NEXT_PUBLIC_API_KEY
  );

  const recording = await recorder.stop({
    roomId: roomId as string,
  });

  console.log("recording", recording);

  const { msg } = recording;

  if (msg === "Stopped") {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const headers: Record<string, string> = {};
          if (process.env.NEXT_PUBLIC_API_KEY) {
            headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY;
          }

          const response = await fetch(
            "https://api.huddle01.com/api/v1/get-recordings",
            {
              headers,
            }
          );
          const data = await response.json();

          const { recordings } = data as { recordings: Recordings[] };

          resolve(
            NextResponse.json(
              { video_uri: recordings[0].recordingUrl },
              { status: 200 }
            )
          );
        } catch (error) {
          reject(error);
        }
      }, 10000); // 5 seconds timeout
    });
  }

  return NextResponse.json({ recording }, { status: 200 });
}
