import { NextRequest, NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from "mongodb";

interface Links {
  forum: string;
  foundation_link: string;
  website: string;
  docs: string;
  block_explorer: string;
  twitter_profile: string;
  governance_twitter_profile: string;
}

interface ApiLinks {
  subgraph: {
    past_votes: string;
  };
  delegates_list: string;
}

interface DAOData {
  _id: {
    $oid: string;
  };
  dao_name: string;
  chain_name: string;
  description: string;
  contract_address: string;
  number_of_delegates: string;
  token_name: string;
  logo: string;
  links: Links;
  api_links: ApiLinks;
}

export async function GET(req: NextRequest, res: NextResponse<DAOData>) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI!, {
      dbName: `chora-club`,
    } as MongoClientOptions);

    // Access the collection
    const db = client.db();
    // console.log("connected");

    const collection = db.collection("dao_details");

    const documents = await collection.find().toArray();

    client.close();

    // Return the found documents
    return NextResponse.json(
      { success: true, data: documents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving data in dao details:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
