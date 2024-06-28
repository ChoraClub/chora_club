import { Client, cacheExchange, fetchExchange, gql } from 'urql';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const client = new Client({
  url: 'https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest',
  exchanges: [cacheExchange, fetchExchange],
});

const GET_CANCELED_PROPOSALS = gql`
  query GetCanceledProposals($first: Int!, $skip: Int!) {
    proposalCanceleds(orderBy: blockTimestamp, orderDirection: desc, first: $first, skip: $skip) {
      proposalId
      blockTimestamp
    }
  }
`;

async function fetchAllProposals(first: number, skip: number, accumulatedResults: any[] = []): Promise<any[]> {
  const result = await client.query(GET_CANCELED_PROPOSALS, { first, skip }).toPromise();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const newResults = result.data.proposalCanceleds;
  accumulatedResults.push(...newResults);

  // If no new results are returned, we have fetched all data
  if (newResults.length === 0) {
    return accumulatedResults;
  }

  // Otherwise, continue fetching
  return fetchAllProposals(first, skip + first, accumulatedResults);
}

export async function GET(req: NextRequest) {
  try {
    const first = 100; // You can adjust this value based on the API's limit
    const skip = 0;

    const allProposals = await fetchAllProposals(first, skip);

    return NextResponse.json(allProposals);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
