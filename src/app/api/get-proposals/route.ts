import { Client, cacheExchange, fetchExchange, gql } from 'urql';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export const revalidate = 0;

const client = new Client({
    url: 'https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest',
    exchanges: [fetchExchange],
});

const GET_PROPOSALS = gql`
  query GetProposals {
    proposalCreated1S(orderDirection: desc, orderBy: blockTimestamp, first: 100) {
      proposalId
      blockTimestamp
      description
      proposer      
    }
    proposalCreated2S(orderDirection: desc, orderBy: blockTimestamp, first: 100) {
      proposalId
      blockTimestamp
      description
      proposer
    }
    proposalCreated3S(orderDirection: desc, orderBy: blockTimestamp, first: 100) {
      proposalId
      blockTimestamp
      description
      proposer
    }
    proposalCreateds(orderDirection: desc, orderBy: blockTimestamp, first: 100) {
      proposalId
      blockTimestamp
      description
      proposer
    }
  }
`;

const GET_PROPOSAL_DESCRIPTIONS = gql`
  query GetProposalDescriptions($proposalId: String!) {
    proposalCreated1S(where: { proposalId: $proposalId }) {
      description
      blockTimestamp
    }
    proposalCreated2S(where: { proposalId: $proposalId }) {
      description
      blockTimestamp
    }
    proposalCreated3S(where: { proposalId: $proposalId }) {
      description
      blockTimestamp
    }
    proposalCreateds(where: { proposalId: $proposalId }) {
      description
      blockTimestamp
    }
  }
`;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const proposalId = searchParams.get('proposalId');

        let result;

        if (proposalId) {
            // Fetch specific proposal
            result = await client.query(GET_PROPOSAL_DESCRIPTIONS, { proposalId }).toPromise();
        } else {
            // Fetch all proposals
            result = await client.query(GET_PROPOSALS, {}).toPromise();
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