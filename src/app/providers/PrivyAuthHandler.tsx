import { getAccessToken, usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL } from "@/config/constants";

// Helper function to handle referrer storage
const handleReferrerStorage = (referrer: string | null) => {
  if (referrer && typeof window !== 'undefined') {
    sessionStorage.setItem('referrer', referrer);
  }
};

export function PrivyAuthHandler() {
  const { user, ready, getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  const searchParams = useSearchParams();
  const processedWalletRef = useRef<string | null>(null);
  const [referrer, setReferrer] = useState<string | null>(null);

     // Handle referrer on mount and when searchParams change
     useEffect(() => {
      const referrerFromURL = searchParams.get("referrer");
      const storedReferrer = sessionStorage.getItem("referrer");

      // Prioritize URL referrer over stored referrer
      const finalReferrer = referrerFromURL || storedReferrer;

      if (finalReferrer) {
        setReferrer(finalReferrer);
        handleReferrerStorage(finalReferrer);
      }
    }, [searchParams,referrer]);

  useEffect(() => {
    const handleUserLogin = async () => {
      if (!ready || !user) return;

      try {
        // Get Privy access token
        const token = await getAccessToken();
        console.log("19 Front-end token:", token);

        // Get referrer from URL params
        const referrer = searchParams.get("referrer");

        // First, try to find an external wallet (metamask, etc.)
        const externalWallet = wallets.find(
          (wallet) =>
            wallet.address &&
            wallet.connectedAt &&
            wallet.walletClientType !== "privy"
        );

        console.log("32 Externalwallet:", externalWallet);

        // If no external wallet, fall back to Privy wallet
        const activeWallet =
          externalWallet ||
          wallets.find(
            (wallet) =>
              wallet.address &&
              wallet.connectedAt &&
              wallet.walletClientType === "privy"
          );

        console.log("42 active wallet:", activeWallet);

        if (!activeWallet) {
          console.error("No active wallet found");
          return;
        }

        // Check if we've already processed this wallet address
        if (processedWalletRef.current === activeWallet.address) {
          console.log("Wallet already processed:", activeWallet.address);
          return;
        }

        console.log("Selected wallet type:", activeWallet.walletClientType);
        console.log("Selected wallet address:", activeWallet.address);

        // Store the processed wallet address
        processedWalletRef.current = activeWallet.address;

        // Use the active wallet's address
        await createOrVerifyAccount(activeWallet.address, token, referrer);
      } catch (error) {
        console.error("Error handling user login:", error);
      }
    };

    handleUserLogin();
  }, [user, ready, wallets]); // Dependencies remain the same

  return null;
}

async function createOrVerifyAccount(
  walletAddress: string,
  token: string | null,
  referrer: string | null
) {
  try {
    // Ensure wallet address is checksummed
    const normalizedAddress = walletAddress.toLowerCase();

    const response = await fetch(`${BASE_URL}/api/auth/accountcreate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-wallet-address": normalizedAddress,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address: normalizedAddress,
        isEmailVisible: false,
        createdAt: new Date(),
        referrer: referrer,
      }),
    });

    if (response.status === 200) {
      console.log(
        "Account created successfully with address:",
        normalizedAddress
      );
    } else if (response.status === 409) {
      console.log("Account already exists for address:", normalizedAddress);
    } else {
      const errorText = await response.text();
      console.error("Unexpected response:", errorText);
      throw new Error(`Failed to create/verify account: ${errorText}`);
    }
  } catch (error) {
    console.error("Error creating/verifying account:", error);
    throw error;
  }
}
