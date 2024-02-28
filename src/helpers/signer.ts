import { createWalletClient, createPublicClient, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism, arbitrum } from "viem/chains";
import { useNetwork } from "wagmi";

declare global {
  interface Window {
    ethereum?: any;
    // Add other properties if needed
  }
}

const WalletAndPublicClient = () => {
  let publicClient: any;
  let walletClient: any;

  const { chain } = useNetwork();
  let chainName: any;

  console.log("Chain", chain);
  console.log("Chain name", chain.name);

  if (chain.name === "Optimism") {
    chainName = optimism;
  } else if (chain.name === "Arbitrum One") {
    chainName = arbitrum;
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
