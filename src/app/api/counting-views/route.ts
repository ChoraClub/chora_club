import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import { RateLimiter } from "limiter";
import { createHash } from "crypto";

const limiters = new Map<string, RateLimiter>();

export async function PUT(req: NextRequest, res: NextResponse) {
  let client;

  try {
    // Parse the request body once
    const { clientToken, meetingId } = await req.json();

    // Create a unique identifier based on clientToken
    const identifier = createHash("sha256").update(clientToken).digest("hex");

    // Get or create a rate limiter for this client
    let limiter = limiters.get(identifier);
    if (!limiter) {
      limiter = new RateLimiter({ tokensPerInterval: 50, interval: "minute" });
      limiters.set(identifier, limiter);
    }

    const hasToken = await limiter.removeTokens(1);
    if (hasToken < 1) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    client = await connectDB();
    const db = client.db();
    const collection = db.collection("meetings");

    // Use findOneAndUpdate with an aggregation pipeline
    const result = await collection.findOneAndUpdate(
      { meetingId: meetingId, meeting_status: "Recorded" },
      [
        {
          $set: {
            views: {
              $cond: {
                if: { $isNumber: "$views" },
                then: { $add: ["$views", 1] },
                else: 1,
              },
            },
          },
        },
      ],
      { returnDocument: "after", upsert: false }
    );

    if (result == null) {
      return NextResponse.json(
        { success: true, data: "Meeting status is not valid!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, data: "View count updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating meeting views:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    client?.close();
  }
}
