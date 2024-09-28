import { NextRequest, NextResponse } from "next/server";
import { Client, cacheExchange, fetchExchange, gql } from "urql";
export const revalidate = 0;

const op_client = new Client({
  url: " https://api.studio.thegraph.com/query/68573/op/v0.0.9",
  exchanges: [cacheExchange, fetchExchange],
});
const arb_client = new Client({
  url: "https://api.studio.thegraph.com/query/68573/arb_token/v0.0.3",
  exchanges: [cacheExchange, fetchExchange],
});
const DELEGATE_QUERY = gql`
  query MyQuery($first: Int!, $skip: Int!) {
    delegates(
      orderBy: latestBalance
      orderDirection: desc
      first: $first
      skip: $skip
    ) {
      latestBalance
      id
      blockTimestamp
    }
  }
`;
export const GET = async (req: NextRequest) => {
  try {
    // Fetch the current block number from the Optimism network
    const { searchParams } = new URL(req.url);
    const dao = searchParams.get("dao");
    const skip = parseInt(searchParams.get("skip") || "0", 0);
    const UNIQUE_DELEGATES_COUNT = 20;
    const FETCH_SIZE = 1000;
    let uniqueDelegates = new Map();
    let hasMore = true;
    let newSkip = skip;

    let skipCount = 0;
    while (uniqueDelegates.size < UNIQUE_DELEGATES_COUNT && hasMore) {
      let data;
      if (dao === "optimism") {
        data = await op_client
          .query(DELEGATE_QUERY, { first: FETCH_SIZE, skip: newSkip })
          .toPromise();
      } else {
        data = await arb_client
          .query(DELEGATE_QUERY, { first: FETCH_SIZE, skip: newSkip })
          .toPromise();
      }
      const delegateChangeds = data.data.delegates;

      if (delegateChangeds.length < FETCH_SIZE) {
        hasMore = false;
      }

      for (const change of delegateChangeds) {
        const { id, blockTimestamp, latestBalance } = change;
        if (
          !uniqueDelegates.has(id) ||
          blockTimestamp > uniqueDelegates.get(id).blockTimestamp
        ) {
          uniqueDelegates.set(id, { blockTimestamp, latestBalance });
        }
        skipCount++;
        if (uniqueDelegates.size >= UNIQUE_DELEGATES_COUNT) {
          break;
        }
      }
      newSkip += skipCount;
    }
    // Define the wrong address you want to remove
    const wrongAddress = "0x00000000000000000000000000000000000a4b86";

    // Filter out the wrong address from the uniqueDelegates map
    uniqueDelegates.delete(wrongAddress);
    const result = Array.from(uniqueDelegates, ([delegate, data]) => ({
      delegate,
      ...data,
    })).slice(0, UNIQUE_DELEGATES_COUNT);
    console.log("result", result);
    return NextResponse.json({
      delegates: result,
      nextSkip: newSkip,
      hasMore,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred." }, { status: 500 });
  }
};
