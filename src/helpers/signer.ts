import { createWalletClient, createPublicClient, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";

declare global {
  interface Window {
    ethereum?: any;
    // Add other properties if needed
  }
}

let publicClient;
let walletClient;

if (typeof window !== "undefined" && window.ethereum) {
  // Instantiate public client and wallet client
  publicClient = createPublicClient({
    chain: optimism,
    transport: custom(window.ethereum),
  });

  walletClient = createWalletClient({
    chain: optimism,
    transport: custom(window.ethereum),
  });

  // Now you can use publicClient and walletClient as needed
} else {
  console.error("window.ethereum is not available");
}

export { publicClient, walletClient };
