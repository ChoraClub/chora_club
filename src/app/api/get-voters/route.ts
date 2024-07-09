import { Client, cacheExchange, fetchExchange, gql } from 'urql';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const client = new Client({
  url: 'https://api.studio.thegraph.com/query/68573/v6_proxy/version/latest',
  exchanges: [cacheExchange, fetchExchange],
});

const arb_client = new Client({
  url: 'https://api.studio.thegraph.com/query/68573/arbitrum_proposals/v0.0.4',
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
      transactionHash
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
      transactionHash
    }
  }
`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const proposalId = searchParams.get('proposalId');
  const skip1 = parseInt(searchParams.get('skip1') || '0', 10);
  const skip2 = parseInt(searchParams.get('skip2') || '0', 10);
  const first = parseInt(searchParams.get('first') || '10', 10);
  const dao = searchParams.get('dao');

  if (!proposalId) {
    return NextResponse.json({ error: 'Missing proposalId parameter' }, { status: 400 });
  }

  if (isNaN(skip1) || isNaN(skip2) || isNaN(first)) {
    return NextResponse.json({ error: 'Invalid skip1, skip2, or first parameter' }, { status: 400 });
  }

  try {
    let result;
    if(dao==='optimism'){
     result = await client.query(COMBINED_VOTE_QUERY, { proposalId, skip1, skip2, first }).toPromise();
    }else{
      result =await arb_client.query(COMBINED_VOTE_QUERY, { proposalId, skip1, skip2, first }).toPromise();
    }


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
