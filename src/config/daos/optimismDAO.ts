import op_logo from "@/assets/images/daos/op.png";

export const optimism = {
  title: "Optimism",
  dao_name: "optimism",
  chain_name: "Optimism",
  description:
    "Optimism DAO is the heart of the Optimism network, an innovative layer 2 solution for faster, cheaper transactions on Ethereum. Think of it as a community-driven engine, where token holders govern upgrades, fees, and the overall direction of the Optimism ecosystem. With a focus on scaling Ethereum effectively and sustainably, Optimism DAO is building a brighter future for blockchain technology.",
  contract_address: "",
  number_of_delegates: "201k",
  token_name: "OP",
  logo: op_logo,
  links: {
    forum: "https://gov.optimism.io/",
    website: "https://www.optimism.io/",
    docs: "https://community.optimism.io/",
    block_explorer: "https://optimistic.etherscan.io/",
    twitter_profile: "https://twitter.com/Optimism",
    governance_twitter_profile: "https://twitter.com/OptimismGov",
  },
  api_links: {
    subgraph: {
      past_votes:
        "https://api.thegraph.com/subgraphs/name/show-karma/dao-onchain-voting-optimism",
    },
    delegates_list: "delegates_list_url",
  },
};
