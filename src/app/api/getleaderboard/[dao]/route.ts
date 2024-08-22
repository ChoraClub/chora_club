import type { NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function GET(req: NextRequest) {
  try {
    const dao_name = req.url.split("getleaderboard/")[1];
    const client = await connectDB();
    const db = client.db();
    const meetingsCollection = db.collection("meetings");

    const pipeline = [
      {
        $match: {
          dao_name: dao_name,
          meeting_status: { $eq: "Recorded" },
        },
      },
      {
        $group: {
          _id: "$host_address",
          sessionCount: { $sum: 1 },
          ClaimedNFT: { $sum: "$ClaimeddNFT" },
          NumberofViews: { $sum: "$NumberofViews" },
        },
      },
      {
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "address",
          as: "feedbackData",
        },
      },
      {
        $unwind: {
          path: "$feedbackData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          delegate_address: "$_id",
          sessionCount: 1,
          ClaimedNFT: 1,
          NumberofViews: 1,
          feedbackReceived: { $ifNull: ["$feedbackData.feedbackReceived", []] },
        },
      },
      {
        $unwind: {
          path: "$feedbackReceived",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$feedbackReceived.ratings",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$delegate_address",
          sessionCount: { $first: "$sessionCount" },
          ClaimedNFT: { $first: "$ClaimedNFT" },
          NumberofViews: { $first: "$NumberofViews" },
          ratingCount: {
            $sum: {
              $cond: [
                { $ifNull: ["$feedbackReceived.ratings.ratings", false] },
                1,
                0,
              ],
            },
          },
          ratingSum: {
            $sum: { $ifNull: ["$feedbackReceived.ratings.ratings", 0] },
          },
        },
      },
      {
        $project: {
          delegate_address: "$_id",
          sessionCount: 1,
          ClaimedNFT: 1,
          NumberofViews: 1,
          ratingCount: 1,
          averageRating: {
            $cond: [
              { $eq: ["$ratingCount", 0] },
              0,
              { $divide: ["$ratingSum", "$ratingCount"] },
            ],
          },
        },
      },
      {
        $sort: { sessionCount: -1 },
      },
    ];
    
    const result = await meetingsCollection.aggregate(pipeline).toArray();
    client.close();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
