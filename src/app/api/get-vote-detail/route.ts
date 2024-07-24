import type { NextRequest } from "next/server";
import { connectDB } from "@/config/connectDB";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get('proposalId');
    const network = searchParams.get('network');
    const voterAddress = searchParams.get('voterAddress');

    if (!proposalId || !network || !voterAddress) {
        return new Response(JSON.stringify({ error: "Missing required parameters" }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const client = await connectDB();
        const db = client.db();
        const collection = db.collection("Proposals-voter");

        const proposal = await collection.findOne({
            proposalId: proposalId,
            network: network
        });

        if (!proposal) {
            client.close();  
            return new Response(JSON.stringify({ error: "Proposal not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
  
        const voterExists = proposal.voters.some((voter: any) => 
            voter.address.toLowerCase() === voterAddress.toLowerCase()
        );
        console.log("Voter exists:", voterExists);
        client.close();  
        return new Response(JSON.stringify({ 
            voterExists
        }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}