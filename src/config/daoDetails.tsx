import op_logo from "@/assets/images/daos/op.png";
import arb_logo from "@/assets/images/daos/arbitrum.jpg";

export const dao_details: any = {
  optimism: {
    title: "Optimism",
    dao_name: "optimism",
    chain_name: "Optimism",
    description:
      "Optimism DAO is the heart of the Optimism network, an innovative layer 2 solution for faster, cheaper transactions on Ethereum. Think of it as a community-driven engine, where token holders govern upgrades, fees, and the overall direction of the Optimism ecosystem. With a focus on scaling Ethereum effectively and sustainably, Optimism DAO is building a brighter future for blockchain technology.",
    contract_address: "",
    number_of_delegates: "193k",
    token_name: "OP",
    logo: op_logo,
    // logo: "https://gateway.lighthouse.storage/ipfs/QmXaKNwUxvd4Ksc9R6hd36eBo97e7e7YPDCVuvHwqG4zgQ",
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
  },
  arbitrum: {
    title: "Arbitrum",
    dao_name: "arbitrum",
    chain_name: "Arbitrum One",
    description:
      "The Arbitrum DAO is a Decentralized Autonomous Organization (DAO) built on the Ethereum blockchain. At its core, the Arbitrum DAO is a community-driven governance mechanism that allows $ARB token holders to propose and vote on changes to the organization and the technologies it governs.",
    contract_address: "",
    number_of_delegates: "294k",
    token_name: "ARB",
    logo: arb_logo,
    // logo: "https://gateway.lighthouse.storage/ipfs/QmdP6ZkLq4FF8dcvxBs48chqFiXu7Gr8SgPCqMtfr7VA4L",
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
  },
};
