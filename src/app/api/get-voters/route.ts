import { Client, cacheExchange, fetchExchange, gql } from 'urql';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const client = new Client({
  url: 'https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest',
  exchanges: [cacheExchange, fetchExchange],
});

const COMBINED_VOTE_QUERY = gql`
  query CombinedVoteQuery($proposalId: String!, $skip1: Int!, $skip2: Int!, $first: Int!) {
    voteCastWithParams: voteCastWithParams_collection(
      where: { proposalId: $proposalId }
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
      skip: $skip1
    ) {
      voter
      weight
      support
      blockTimestamp
    }
    voteCasts(
      where: { proposalId: $proposalId }
      orderBy: blockTimestamp
      orderDirection: desc
      skip: $skip2
      first: $first
    ) {
      voter
      weight
      support
      blockTimestamp
    }
  }
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
//   console.log('searchParams:', searchParams.get('proposalId'));
  const proposalId = searchParams.get('proposalId');
  const skip1 = parseInt(searchParams.get('skip1') || '0', 10);
  const skip2 = parseInt(searchParams.get('skip2') || '0', 10);
  const first = parseInt(searchParams.get('first') || '10', 10);

  console.log('proposalId:', proposalId);
  console.log('skip1:', skip1);
  console.log('skip2:', skip2);
  console.log('first:', first);

  if (!proposalId) {
    return NextResponse.json({ error: 'Missing proposalId parameter' }, { status: 400 });
  }

  if (isNaN(skip1) || isNaN(skip2) || isNaN(first)) {
    return NextResponse.json({ error: 'Invalid skip1, skip2, or first parameter' }, { status: 400 });
  }

  try {
    const result = await client.query(COMBINED_VOTE_QUERY, { proposalId, skip1, skip2, first }).toPromise();
  

    // Log the raw data returned from the query

    if (result.error) {
      console.error('GraphQL query error:', result.error);
      return NextResponse.json({ error: 'An error occurred while fetching data' }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
