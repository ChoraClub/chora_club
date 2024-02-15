import { createWalletClient, createPublicClient, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";

export const publicClient = createPublicClient({
  chain: optimism,
  transport: custom(window.ethereum!),
});

export const walletClient = createWalletClient({
  chain: optimism,
  transport: custom(window.ethereum!),
});
