import type { NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const individualDelegate = searchParams.get("individualDelegate");
    // console.log('individualDelegate', individualDelegate);
    if (!individualDelegate) {
      return new Response("Missing individualDelegate query parameter", {
        status: 400,
      });
    }

    // Connect to MongoDB database
    const client = await connectDB();

     // Access the collection
     const db = client.db("optimism-agora-delegate");
     const collection = db.collection("delegate_info");
     const response = await collection.findOne({ address: individualDelegate });
       client.close();
        return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
