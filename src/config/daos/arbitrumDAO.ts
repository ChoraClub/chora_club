import arb_logo from "@/assets/images/daos/arbitrum.jpg";

export const arbitrum = {
  title: "Arbitrum",
  dao_name: "arbitrum",
  chain_name: "Arbitrum One",
  description:
    "The Arbitrum DAO is a Decentralized Autonomous Organization (DAO) built on the Ethereum blockchain. At its core, the Arbitrum DAO is a community-driven governance mechanism that allows $ARB token holders to propose and vote on changes to the organization and the technologies it governs.",
  contract_address: "",
  number_of_delegates: "312k",
  token_name: "ARB",
  logo: arb_logo,
  links: {
    forum: "https://forum.arbitrum.foundation/",
    foundation_link: "https://arbitrum.foundation/",
    website: "https://arbitrum.io/",
    docs: "https://docs.arbitrum.io/welcome/get-started",
    block_explorer: "https://arbiscan.io/",
    twitter_profile: "https://twitter.com/arbitrum",
    governance_twitter_profile: "https://twitter.com/DAO_Arbitrum",
  },
  api_links: {
    subgraph: {
      past_votes:
        "https://api.thegraph.com/subgraphs/name/show-karma/onchain-voting-arbitrum",
    },
    delegates_list: "delegates_list_url",
  },
};
