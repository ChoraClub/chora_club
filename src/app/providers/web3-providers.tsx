"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ReactNode } from "react";

import {
  getDefaultWallets,
  RainbowKitProvider,
  WalletList,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { SessionProvider } from "next-auth/react";
import { rabbyWallet, uniswapWallet } from "@rainbow-me/rainbowkit/wallets";

// import { useTheme } from "next-themes";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

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

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimism, arbitrum],
  [publicProvider()]
);

const projectId = "c52f63cb512b7b43a8724eae05cb5130";

const { wallets } = getDefaultWallets({
  appName: "Chora Club",
  projectId: projectId,
  chains,
});

// const connectors = [...defaultConnectors()];
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Others",
    wallets: [
      rabbyWallet({ chains, projectId: projectId }),
      uniswapWallet({ chains, projectId: projectId }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to The App",
});

export default function Web3Provider(props: RainbowKitProviderProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <SessionProvider>
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
          <RainbowKitProvider chains={chains}>
            {props.children}
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
