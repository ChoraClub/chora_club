import { Client, fetchExchange, gql } from "urql";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const client = new Client({
  url: "https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest",
  exchanges: [fetchExchange],
});

const arb_client = new Client({
  url: "https://api.studio.thegraph.com/query/68573/arbitrum_proposals/v0.0.4",
  exchanges: [fetchExchange],
});

const COMBINED_VOTE_QUERY = gql`
  query CombinedVoteQuery(
    $proposalId: String!
    $blockNumber: String!
    $first: Int!
  ) {
    voteCastWithParams: voteCastWithParams_collection(
      where: { proposalId: $proposalId, blockNumber_gte: $blockNumber }
      first: $first
      orderBy: blockNumber
      orderDirection: asc
    ) {
      voter
      weight
      support
      blockNumber
      blockTimestamp
      transactionHash
      id
      reason
    }
    voteCasts(
      where: { proposalId: $proposalId, blockNumber_gte: $blockNumber }
      orderBy: blockNumber
      orderDirection: asc
      first: $first
    ) {
      voter
      weight
      support
      blockNumber
      blockTimestamp
      transactionHash
      id
      reason
    }
  }
`;
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const proposalId = searchParams.get("proposalId");
  const blockNumber = searchParams.get("blockNumber") || "0";
  const first = parseInt(searchParams.get("first") || "1000", 10);
  const dao = searchParams.get("dao");

  if (!proposalId) {
    return NextResponse.json(
      { error: "Missing proposalId parameter" },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  try {
    let result;
    if (dao === "optimism") {
      result = await client
        .query(COMBINED_VOTE_QUERY, { proposalId, blockNumber, first })
        .toPromise();
    } else {
      result = await arb_client
        .query(COMBINED_VOTE_QUERY, { proposalId, blockNumber, first })
        .toPromise();
    }

    if (result.error) {
      console.error("GraphQL query error:", result.error);
      return NextResponse.json(
        { error: "An error occurred while fetching data" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    return NextResponse.json(
      {
        ...result.data,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}