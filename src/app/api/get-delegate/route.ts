import { NextRequest, NextResponse } from 'next/server';
import { Client, cacheExchange, fetchExchange, gql } from 'urql';

const client = new Client({
  url: ' https://api.studio.thegraph.com/query/68573/op/v0.0.9',
  exchanges: [cacheExchange, fetchExchange],
});
//previous timestamp 1718081955 ,1721214200
const DELEGATE_QUERY = gql`
  query MyQuery($first: Int!, $skip: Int!) {
  delegateChangeds(
    first:$first,
    skip:$skip,
    orderBy: newBalance,
    orderDirection: desc
  ) {
    newBalance
    toDelegate
    balanceBlockTimestamp
  }
}
`;

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip') || '0', 0);
    // const skip=0;
    console.log("skip",skip)
    const UNIQUE_DELEGATES_COUNT = 20;
    const FETCH_SIZE = 1000; 
    let uniqueDelegates = new Map();
    let hasMore = true;
    let newSkip = skip;
    console.log("newSkip",newSkip)
    let skipCount=0;

    while (uniqueDelegates.size < UNIQUE_DELEGATES_COUNT && hasMore) {
      // const data = await graphQLClient.request(query, { first: FETCH_SIZE, skip });
      const data = await client.query(DELEGATE_QUERY,{first:FETCH_SIZE,skip:newSkip}).toPromise();
      console.log(data)
      const delegateChangeds = data.data.delegateChangeds;

      if (delegateChangeds.length < FETCH_SIZE) {
        hasMore = false;
      }

      for (const change of delegateChangeds) {
        console.log("change",change)
        const { toDelegate, balanceBlockTimestamp, newBalance } = change;
        if (!uniqueDelegates.has(toDelegate) || 
        balanceBlockTimestamp > uniqueDelegates.get(toDelegate).blockTimestamp) {
          uniqueDelegates.set(toDelegate, { balanceBlockTimestamp, newBalance });
        }
         skipCount++;
        if (uniqueDelegates.size >= UNIQUE_DELEGATES_COUNT) {
          break;
        }
      }
      newSkip  += skipCount;
      // hasMore = false;
    }

    const result = Array.from(uniqueDelegates, ([toDelegate, data]) => ({
      toDelegate,
      ...data
    })).slice(0, UNIQUE_DELEGATES_COUNT);
console.log("result",result)
    return NextResponse.json({
        delegates: result,
        nextSkip: newSkip,
        hasMore
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred.' }, { status: 500 });
  }
};
