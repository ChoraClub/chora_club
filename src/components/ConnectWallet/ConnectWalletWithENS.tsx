"use client";
import React, { useEffect, useState } from "react";
import { fetchEnsNameAndAvatar, fetchEnsName } from "@/utils/ENSUtils";
import { BiSolidWallet } from "react-icons/bi";
import Image from "next/image";
import user2 from "@/assets/images/user/user2.svg";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { shorten } from "@/utils/helper";
import { Button } from "@nextui-org/react";
import OPLogo from "@/assets/images/daos/op.png";
import ArbLogo from "@/assets/images/daos/arb.png";
import ChainSwitcherHeader from "./ChainSwitcherHeader";


function ConnectWalletWithENS() {
  const [displayAddress, setDisplayAddress] = useState<string>("");
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [chainIcon, setChainIcon] = useState<string | null>(null);
  const { address, isConnected, isConnecting, isDisconnected, chain } =
    useAccount();
  const chainId = useChainId();
  const { chains, error: switchNetworkError, switchChain } = useSwitchChain();
  const [walletAddress2, setWalletAddress] = useState<string | null>(null);

  const { ready, authenticated, login, logout, user } = usePrivy();

  const { wallets } = useWallets();
  const activeWallet = wallets[0]; // Primary wallet
  // console.log("Line 26:", address);
  // console.log("Line 29:", chainId);
  // console.log('Is authenticated:',authenticated);
  // console.log("Line number 24:", activeWallet);
  // const walletAddress = activeWallet?.address;
  // console.log("Line number 25:", walletAddress);

 
  useEffect(() => {
    // If external wallet (wagmi) is connected, use its address
    if (isConnected && address) {
      setWalletAddress(address);  // External wallet address
    } else if (authenticated && user?.wallet?.address) {
      // If authenticated with Privy and no external wallet, use embedded wallet address
      setWalletAddress(user.wallet.address);  // Embedded wallet address
    }
  }, [authenticated, user, isConnected, address]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (walletAddress2 && authenticated) {
        try {
          // Fetch user profile from your API
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          myHeaders.append("x-wallet-address", walletAddress2 ? walletAddress2 : "");
          setDisplayAddress(address ? address : "");

          const raw = JSON.stringify({ address: address });

          const requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          const res = await fetch(`/api/profile/${walletAddress2}`, requestOptions);
          const dbResponse = await res.json();
          console.log("line number 48:", dbResponse);

          if (dbResponse.data.length > 0) {
            const profileImage = dbResponse.data[0]?.image;
            setUserProfileImage(
              profileImage
                ? `https://gateway.lighthouse.storage/ipfs/${profileImage}`
                : null
            );
          }

          // Fetch ENS data
          const ensData = await fetchEnsNameAndAvatar(walletAddress2);
          setEnsAvatar(ensData?.avatar || null);

          // Get ENS name
          const displayName = await fetchEnsName(walletAddress2);
          console.log("Line number 64:", displayName);
          setDisplayAddress(displayName?.ensNameOrAddress || walletAddress2);
          console.log("Line number 66:", displayAddress);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, [walletAddress2, authenticated]);

  const getDisplayImage = () => {
    if (ensAvatar) {
      return ensAvatar;
    } else if (userProfileImage) {
      return userProfileImage;
    } else {
      return user2;
    }
  };

  const handleChainSwitch = async () => {
    if (activeWallet?.switchChain) {
      try {
        // You can customize which chain to switch to
        await activeWallet.switchChain(1); // Switch to Ethereum mainnet
      } catch (error) {
        console.error("Failed to switch chain:", error);
      }
    }
  };

  if (!ready) {
    return null; // or loading spinner
  }

  return (
    <div className="wallet">
      {!authenticated && !address ? (
        <button
          onClick={login}
          type="button"
          className="flex items-center justify-center text-white bg-blue-shade-200 hover:bg-blue-shade-100 border border-white rounded-full p-2 md:px-5 md:py-4 text-xs md:text-sm font-bold transition-transform transform hover:scale-105"
        >
          <BiSolidWallet className="block md:hidden size-5" />
          <span className="hidden md:block">Connect Wallet</span>
        </button>
      ) : (
        <>
          <ChainSwitcherHeader
            address={walletAddress2?walletAddress2:''}
            currentChainId={chain?.id}
            switchChain={switchChain}
            disconnect={logout}
            ensAvatar={ensAvatar}
          />

          {/* Mobile View */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={login}
              type="button"
              className="flex items-center size-[30px] rounded-full justify-center border-2 border-black font-bold text-black shadow-sm transition-transform transform hover:scale-105 text-xs"
            >
              <Image
                src={getDisplayImage()}
                alt="User Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ConnectWalletWithENS;
