import { cacheExchange, createClient, fetchExchange, gql } from "urql";

export const arb_client = createClient({
  url: "https://api.studio.thegraph.com/query/477/arbitrum/v0.0.2 ",
  exchanges: [cacheExchange, fetchExchange],
});

export const op_client = createClient({
  url: "https://api.studio.thegraph.com/query/68573/op/v0.0.1",
  exchanges: [cacheExchange, fetchExchange],
});

export const DELEGATE_CHANGED_QUERY = gql`
  query MyQuery($delegator: String!) {
    delegateChangeds(
      orderBy: blockTimestamp
      orderDirection: desc
      where: { delegator: $delegator }
      first: 1
    ) {
      toDelegate
    }
  }
`;

export const GET_LATEST_DELEGATE_VOTES_CHANGED = gql`
  query MyQuery($delegate: String!) {
    delegateVotesChangeds(
      first: 1
      orderBy: blockTimestamp
      orderDirection: desc
      where: { delegate: $delegate }
    ) {
      newBalance
    }
  }
`;

export const opBlock = [
  {
    title: "Forum",
    link: "https://gov.optimism.io/",
  },
  {
    title: "Website",
    link: "https://optimism.io/",
  },
  {
    title: "Block Explorer",
    link: "https://optimistic.etherscan.io/",
  },
  {
    title: "Optimism Twitter Profile",
    link: "https://twitter.com/Optimism",
  },
  {
    title: "Optimism DAO Twitter Profile",
    link: "https://twitter.com/OptimismGov",
  },
];

export const arbBlock = [
  {
    title: "Forum",
    link: "https://forum.arbitrum.foundation",
  },
  {
    title: "Website",
    link: "https://arbitrum.io",
  },
  {
    title: "Arbitrum Foundation Website",
    link: "https://arbitrum.foundation",
  },
  {
    title: "Block Explorer",
    link: "https://arbiscan.io",
  },
  {
    title: "Arbitrum Twitter Profile",
    link: "https://twitter.com/arbitrum",
  },
  {
    title: "Arbitrum DAO Twitter Profile",
    link: "https://twitter.com/DAO_Arbitrum",
  },
];

export const IMAGE_URL =
  "https://gateway.lighthouse.storage/ipfs/QmZRLHd4CwA8btpa2WhbDHju46rnKbYGUFyzojAFXkhbt1";

export const imageCIDs = [
  "QmdzRg9pkRGjjLbQANmHCF6CpKJQNPJkKB3GG1sFp12BHK",
  "QmXcCZ64WqgWnDJpVFpv6j9s9LMmoTAvxMrW7YBdJrT15m",
  "QmeBqBgRTeyyCy2aNcXEQ58RWJgrd4G2kkZqLCkn3YhCFH",
  "QmWXUWAEuCJ5v2iV5e5Dba6ngXPDdPiUVmzwT7yU4gqD5G",
  "QmYo6T2hNYPMu3DbR8VSnykDaMQDd2X73pwVJwezthQts7",
  "QmRM7FXy7S4EFtj9mZYrEbQFb2WSaCJBrV8uX1BqHf5N5M",
  "QmfRpe1iT5tA6NZV7jtvWAkRmCN8F1R8xsPEeANQz93tZq",
  "QmdKbf84HjAwFVadmQmDQE2kno5vKUgyzk3WZqfJjg9Sst",
  "QmbhbMVCPB8JLEPyEZ7q3deFzW4ZdT5h54BLM9f7Y38Nm5",
  "QmZWzUhBwKhqZLhvLiXavHyWs17Hk9FTDrKgqPm6CFA92X",
  "QmUimhCd2v4LAAzxPdrB3eBsria3nx3VkZVKXPaiRhwmnB",
  "QmRWRwVXXCdCjei6bxeLnj1Y6T1ZdFnUubbmV2TZhmg6bf",
  "bafybeifibkaukchhgopxsvtbqdnea6mpctkqr4zpyuu7cleshbz4thsh5q",
  "bafybeigxaftv5kp66wldzo5u5jt35dn2f5tl6nmj4udfnrq6o3rkhxbxzu",
  "bafybeigcqoa64uwck5kz7roznm7l7p7pdjial4cohwlojkbkew6csase64",
  "bafybeia2fttmz6n6hdkktve6m52ngvu322pc2wz62j6d2rbopveyrvpmju",
  "bafkreieilkzfdlwha7bbmpllzcglsowywmxirausg4eydxhaabiowys5dm",
  "bafybeia2jlo6dxlaxgheo43gcizwnpk5oo7zep4srusbos6ujl3og4puvi",
];
