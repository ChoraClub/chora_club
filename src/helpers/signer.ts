import { createWalletClient, createPublicClient, custom } from "viem";
import { optimism, arbitrum } from "viem/chains";
// import { useNetwork } from "wagmi";
import { useAccount } from "wagmi";

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
        "https://opt-sepolia.g.alchemy.com/v2/WRQwCsk2ip0sMcZ7zJYQKgyQfWj1qm61",
      ],
      webSocket: [
        "wss://opt-sepolia.g.alchemy.com/v2/WRQwCsk2ip0sMcZ7zJYQKgyQfWj1qm61",
      ],
    },
    public: {
      http: [
        "https://opt-sepolia.g.alchemy.com/v2/WRQwCsk2ip0sMcZ7zJYQKgyQfWj1qm61",
      ],
      webSocket: [
        "wss://opt-sepolia.g.alchemy.com/v2/WRQwCsk2ip0sMcZ7zJYQKgyQfWj1qm61",
      ],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.zora.energy" },
  },
  network: "",
});

const WalletAndPublicClient = () => {
  let publicClient: any;
  let walletClient: any;

  const { chain } = useAccount();
  let chainName: any;
  console.log("the chain", chain?.name);
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
