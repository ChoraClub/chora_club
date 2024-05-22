import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    // Access the collections
    const db = client.db();
    const meetingsCollection = db.collection("meetings");
    const delegatesCollection = db.collection("delegates");

    // Fetch all documents from the meetings collection
    const meetings = await meetingsCollection
      .find({ meeting_status: "Recorded" })
      .toArray();

    // Iterate through each meeting document
    const mergedData = await Promise.all(
      meetings.map(async (session) => {
        // Extract address and dao_name from the meeting
        const { host_address, dao_name } = session;

        // Query delegates collection based on address and dao_name
        const userInfo = await delegatesCollection.findOne({
          address: host_address,
          daoName: dao_name,
        });

        // Return merged data
        return { session, userInfo };
      })
    );

    client.close();

    // Return the merged data
    return NextResponse.json(
      { success: true, data: mergedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
