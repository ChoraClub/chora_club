import { createWalletClient, createPublicClient, custom } from "viem";
import { optimism, arbitrum } from "viem/chains";
import { useNetwork } from "wagmi";
import { defineChain } from "viem";

declare global {
  interface Window {
    ethereum?: any;
    // Add other properties if needed
  }
}
const optimismSepolia = defineChain({
  id: 11155420,
  name: "OptimismSepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [
        "https://opt-sepolia.g.alchemy.com/v2/BZr3W1fqQEy2wnrcDQf1z4hiGCOhcHfp",
      ],
      webSocket: [
        "wss://opt-sepolia.g.alchemy.com/v2/BZr3W1fqQEy2wnrcDQf1z4hiGCOhcHfp",
      ],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.zora.energy" },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  //     blockCreated: 5882,
  //   },
  // },
});

const WalletAndPublicClient = () => {
  let publicClient: any;
  let walletClient: any;

  const { chain } = useNetwork();
  let chainName: any;
  console.log("the chain", chain.name);
  if (chain?.name === "Optimism") {
    chainName = optimism;
  } else if (chain?.name === "Arbitrum One") {
    chainName = arbitrum;
  } else if (chain?.name === "Optimism Sepolia") {
    chainName = optimismSepolia;
  } else {
    chainName = "";
  }

  if (typeof window !== "undefined" && window.ethereum) {
    // Instantiate public client and wallet client
    publicClient = createPublicClient({
      chain: chainName,
      transport: custom(window.ethereum),
    });

    walletClient = createWalletClient({
      chain: chainName,
      transport: custom(window.ethereum),
    });

    // Now you can use publicClient and walletClient as needed
  } else {
    console.error("window.ethereum is not available");
  }

  return { publicClient, walletClient };
};

export default WalletAndPublicClient;
