"use client";

// import { ThemeProvider } from "next-themes";
import Web3Providers from "./web3-providers";

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProviders({ children }: RootProviderProps) {
  return (
    // <ThemeProvider attribute="class">
    <Web3Providers>{children}</Web3Providers>
    // </ThemeProvider>
  );
}
