import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";

interface VoteData {
  address: string;
  proposalId: string;
  choice: string[];
  votingPower: number;
  network: string;
}

export async function PUT(req: NextRequest) {
  try {
    const voteData: VoteData = await req.json();
    console.log("voteData", voteData);

    // Validate the vote data
    if (!voteData.address || !voteData.proposalId || !voteData.choice || !voteData.network) {
      return NextResponse.json(
        { success: false, error: "Invalid vote data" },
        { status: 400 }
      );
    }

    // Connect to MongoDB database
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection("Proposals-voter");

    // Prepare the voter object
    const voterObject = {
      address: voteData.address,
      choice: voteData.choice,
      votingPower: voteData.votingPower
    };

    const networkName = voteData.network.toLowerCase();
    const daoName = `${networkName}_dao`;

    // Update or insert the document based on proposalId
    const updateResult = await collection.updateOne(
      { proposalId: voteData.proposalId,
        daoName,
        network: voteData.network
       },
      {
        $setOnInsert: {
          daoName,
          proposalId: voteData.proposalId,
          network: voteData.network,
        },
        $addToSet: { // Use $addToSet instead of $push to avoid duplicates
            voters: voterObject
          }
        // $set: {
        //   [`voters.${voteData.address}`]: voterObject
        // }
      },
      { upsert: true }
    );

    if (updateResult.matchedCount === 0 && updateResult.modifiedCount === 0 && updateResult.upsertedCount === 0) {
      client.close();
      return NextResponse.json(
        { success: false, error: "Failed to update or create vote document" },
        { status: 500 }
      );
    }

    client.close();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating vote document:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}