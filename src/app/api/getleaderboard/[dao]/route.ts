import type { NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";
import { nft_client } from "@/config/staticDataUtils";
const GET_CLAIMED_NFTS = `
  query GetClaimedNFTs($addresses: [String!]!) {
    token1155Holders(where: {user_in: $addresses}) {
      user
      balance
    }
  }
`;
async function getClaimedNFTs(addresses: string[]): Promise<Record<string, number>> {
  const result = await nft_client.query(GET_CLAIMED_NFTS, { addresses }).toPromise();
  if (result.error) {
    throw new Error(`GraphQL query failed: ${result.error.message}`);
  }
  return result.data.token1155Holders.reduce((acc: Record<string, number>, holder: { user: string, balance: string }) => {
    acc[holder.user.toLowerCase()] = parseInt(holder.balance, 10);
    return acc;
  }, {});
}
// Function to calculate CC_SCORE
function calculateCCScore(data: any[]) {
  let MinSessionCount = Infinity,
    MaxSessionCount = -Infinity;
  // let MinNFT = Infinity,
  //   MaxNFT = -Infinity;
  let MinViews = Infinity,
    MaxViews = -Infinity;
  let MinRating = Infinity,
    MaxRating = -Infinity;

  // Single pass for min/max calculation
  data.forEach((item) => {
    MinSessionCount = Math.min(MinSessionCount, item.sessionCount);
    MaxSessionCount = Math.max(MaxSessionCount, item.sessionCount);

    // MinNFT = Math.min(MinNFT, item.ClaimedNFT);
    // MaxNFT = Math.max(MaxNFT, item.ClaimedNFT);

    MinViews = Math.min(MinViews, item.totalViews);
    MaxViews = Math.max(MaxViews, item.totalViews);

    MinRating = Math.min(MinRating, item.averageRating);
    MaxRating = Math.max(MaxRating, item.averageRating);
  });

  // Define weights
  const SESSION_TAKEN_WEIGHT = 0.4;
  // const NFT_CLAIMED_WEIGHT = 0.3;
  const VIEWS_SESSION_WEIGHT = 0.3;
  const RATING_WEIGHT = 0.3;

  // Process records and calculate scores
  return data.map((item) => {
    // Normalize values with checks to handle identical min and max\\
    let normalizedSessions =
      MaxSessionCount === MinSessionCount
        ? 0
        : (item.sessionCount - MinSessionCount) /
          (MaxSessionCount - MinSessionCount);
    // let normalizedNFT =
    //   MaxNFT === MinNFT ? 0 : (item.ClaimedNFT - MinNFT) / (MaxNFT - MinNFT);
    let normalizeViews =
      MaxViews === MinViews
        ? 0
        : (item.totalViews - MinViews) / (MaxViews - MinViews);
    let normalizedRatings =
      MaxRating === MinRating
        ? 0
        : (item.averageRating - MinRating) / (MaxRating - MinRating);

    // Round to 3 decimal places
    normalizedSessions = Math.round(normalizedSessions * 1000) / 1000;
    // normalizedNFT = Math.round(normalizedNFT * 1000) / 1000;
    normalizeViews = Math.round(normalizeViews * 1000) / 1000;
    normalizedRatings = Math.round(normalizedRatings * 1000) / 1000;

    // Calculate the final score
    let SCORE =
      SESSION_TAKEN_WEIGHT * normalizedSessions +
      VIEWS_SESSION_WEIGHT * normalizeViews +
      RATING_WEIGHT * normalizedRatings;

    // Store the SCORE in the object
    let sc = Math.round(SCORE * 1000) / 1000;
    return { ...item, CC_SCORE: Math.ceil(sc * 100) };
  });
}


export async function GET(req: NextRequest) {
  let client;
  try {
    const dao_name = req.url.split("getleaderboard/")[1];
    client = await connectDB();
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
          totalViews: { $sum: "$views" }, // Add this line to sum up the views
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
          totalViews: 1, // Include totalViews in the projection
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
          totalViews: { $first: "$totalViews" }, // Include totalViews
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
          // ClaimedNFT: 1,
          totalViews: 1, // Include totalViews in the final projection
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

    let result = await meetingsCollection.aggregate(pipeline).toArray();
      // Fetch ClaimedNFT data from subgraph
      const addresses = result.map(item => item.delegate_address);
      const claimedNFTs = await getClaimedNFTs(addresses);

       // Merge ClaimedNFT data with the result
    result = result.map(item => ({
      ...item,
      ClaimedNFT: claimedNFTs[item.delegate_address.toLowerCase()] || 0
    }));

    result = calculateCCScore(result);
    // console.log(result);

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
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing MongoDB client:", closeError);
      }
    }
  }
}
