import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { RateLimiter } from "limiter";
import { createHash } from "crypto";

const limiters = new Map<string, RateLimiter>();

export async function PUT(req: NextRequest, res: NextResponse) {
  const { meetingId, clientToken } = await req.json();

  // Create a unique identifier based on clientToken and userAgent
  const identifier = createHash("sha256").update(clientToken).digest("hex");

  console.log("line 16", identifier);

  // Get or create a rate limiter for this client
  let limiter = limiters.get(identifier);
  if (!limiter) {
    limiter = new RateLimiter({ tokensPerInterval: 5, interval: "minute" });
    limiters.set(identifier, limiter);
  }

  const hasToken = await limiter.removeTokens(1);
  console.log("Tokens remaining:", hasToken);

  if (hasToken < 1) {
    console.log("Rate limit exceeded. Tokens:", hasToken);
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  } else {
    return NextResponse.json(
      { success: true, message: "Allow to call." },
      { status: 200 }
    );
  }

  // try {
  //   client = await connectDB();
  //   const db = client.db();
  //   const collection = db.collection("meetings");
  //   const { meetingId } = await req.json();

  //   // Use findOneAndUpdate with an aggregation pipeline
  //   const result = await collection.findOneAndUpdate(
  //     { meetingId: meetingId, meeting_status: "Recorded" },
  //     [
  //       {
  //         $set: {
  //           views: {
  //             $cond: {
  //               if: { $isNumber: "$views" },
  //               then: { $add: ["$views", 1] },
  //               else: 1,
  //             },
  //           },
  //         },
  //       },
  //     ],
  //     { returnDocument: "after", upsert: false }
  //   );

  //   if (result == null) {
  //     return NextResponse.json(
  //       { success: true, data: "Meeting status is not valid!" },
  //       { status: 200 }
  //     );
  //   }

  //   return NextResponse.json(
  //     { success: true, data: "View count succesfully." },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   console.error("Error updating meeting views:", error);
  //   return NextResponse.json(
  //     { success: false, error: "Internal Server Error" },
  //     { status: 500 }
  //   );
  // } finally {
  //   client?.close();
  // }
}
