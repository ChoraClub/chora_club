import { createWalletClient, createPublicClient, custom } from "viem";
import { optimism, arbitrum } from "viem/chains";
import { useAccount } from "wagmi";
import { defineChain } from "viem";

declare global {
  interface Window {
    ethereum?: any;
    // Add other properties if needed
  }
}

const WalletAndPublicClient = () => {
  let publicClient: any;
  let walletClient: any;
  let chainName: any;

  const { chain } = useAccount();

  console.log("chain: ", chain?.name);

  if (chain?.name === "OP Mainnet") {
    chainName = optimism;
  } else if (chain?.name === "Arbitrum One") {
    chainName = arbitrum;
  } else {
    chainName = "";
  }

  console.log("chainName in signer: ", chainName);
  if (typeof window !== "undefined" && window.ethereum) {
    // Instantiate public client and wallet client
    publicClient = createPublicClient({
      chain: chainName,
      transport: custom(window.ethereum),
    });
    walletClient = createWalletClient({
      chain: chainName,
      transport: custom(window.ethereum!),
    });

    // Now you can use publicClient and walletClient as needed
  } else {
    console.error("window.ethereum is not available");
  }

  return { publicClient, walletClient };
};

export default WalletAndPublicClient;
