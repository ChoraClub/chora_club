import { NextRequest, NextResponse } from 'next/server';
import { Client, cacheExchange, fetchExchange, gql } from 'urql';
export const revalidate = 0;

const client = new Client({
  url: 'https://api.studio.thegraph.com/query/68573/arbitrum_proposals/v0.0.4',
  exchanges: [cacheExchange, fetchExchange],
});

const GET_PROPOSALS_QUEUE_INFO = gql`
query MyQuery {
  proposalQueueds(orderBy: blockTimestamp, orderDirection: desc) {
    eta
    blockTimestamp
    proposalId
  }
}`;
const GET_PROPOSAL = gql`
query MyQuery($proposalId: String!) {
  proposalCreateds(where: { proposalId: $proposalId }) {
    blockTimestamp
    description
    proposalId
    proposer
  }
}`;

export async function GET(req: NextRequest) {
  try {
      const { searchParams } = new URL(req.url);
      const proposalId = searchParams.get('proposalId');

      let result;

      if (proposalId) {
          // Fetch specific proposal
          result = await client.query(GET_PROPOSAL, { proposalId }).toPromise();
      } else {
          // Fetch all proposals in queue
          result = await client.query(GET_PROPOSALS_QUEUE_INFO, {}).toPromise();
      }

      if (result.error) {
          console.error('GraphQL query error:', result.error);
          return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
      }

      return NextResponse.json(result);
  } catch (error) {
      console.error('Unexpected error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
