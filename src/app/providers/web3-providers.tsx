"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode } from "react";

import {
  getDefaultConfig,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import {
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  uniswapWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

// import { useTheme } from "next-themes";

import { createConfig, WagmiProvider } from "wagmi";
import { optimism, arbitrum } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { publicProvider } from "wagmi/providers/public";

interface RainbowKitProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

const optimismSepolia = {
  id: 11155420,
  name: "Optimism Sepolia",
  network: "Optimism Sepolia testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: {
      http: [
        "https://opt-sepolia.g.alchemy.com/v2/BZr3W1fqQEy2wnrcDQf1z4hiGCOhcHfp",
      ],
    },
    default: {
      http: [
        "https://opt-sepolia.g.alchemy.com/v2/BZr3W1fqQEy2wnrcDQf1z4hiGCOhcHfp",
      ],
    },
  },
  testnet: true,
};

// const { chains, publicClient, webSocketPublicClient } = configureChains(
//   [optimism, arbitrum],
//   [publicProvider()]
// );

const projectId = "c52f63cb512b7b43a8724eae05cb5130";

const wagmiConfig = getDefaultConfig({
  appName: "Chora Club",
  projectId: projectId,
  chains: [optimism, arbitrum],
  ssr: true, // If your dApp uses server side rendering (SSR)
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
      ],
    },
    { groupName: "More", wallets: [rabbyWallet, uniswapWallet] },
  ],
});

const queryClient = new QueryClient();

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to The App",
});

export default function Web3Provider(props: RainbowKitProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RainbowKitSiweNextAuthProvider
            getSiweMessageOptions={getSiweMessageOptions}
          >
            <RainbowKitProvider>{props.children}</RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
