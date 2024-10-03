"use client";
import React, { useEffect, useState } from "react";
import RewardButton from "./RewardButton";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import ConnectYourWallet from "../ComponentUtils/ConnectYourWallet";
import { useConnection } from "@/app/hooks/useConnection";
import TotalRewards from "./TotalRewards";
import MintedNFTs from "./MintedNFTs";
import { TailSpin, Rings, Triangle } from "react-loader-spinner";

function RewardsMain() {
  const { isConnected, isPageLoading, isSessionLoading, isReady } =
    useConnection();
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");

  useEffect(() => {
    const messages = [
      "Loading your rewards...",
      "Fetching latest data...",
      "Preparing your dashboard...",
      "Almost there...",
    ];
    let index = 0;
    const intervalId = setInterval(() => {
      setLoadingMessage(messages[index]);
      index = (index + 1) % messages.length;
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="flex space-x-8 mb-8">
        {/* <TailSpin
          visible={true}
          height="40"
          width="40"
          color="#0356fc"
          ariaLabel="tail-spin-loading"
        />
        <Rings
          visible={true}
          height="40"
          width="40"
          color="#0356fc"
          ariaLabel="rings-loading"
        /> */}
        <Triangle
          visible={true}
          height="40"
          width="40"
          color="#0356fc"
          ariaLabel="triangle-loading"
        />
      </div>
      <p className="text-lg font-semibold text-blue-800 animate-pulse">
        {loadingMessage}
      </p>
    </div>
  );

  const renderContent = () => {
    if (isPageLoading || isSessionLoading) {
      return renderLoader();
    }

    if (!isConnected) {
      return <ConnectYourWallet />;
    }

    if (isReady) {
      return (
        <>
          <div className="min-h-screen h-fit bg-gradient-to-b from-blue-50 to-blue-100">
            <div className="w-full flex justify-end pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
              <div className="flex gap-1 xs:gap-2 items-center">
                <RewardButton />
                <ConnectWalletWithENS />
              </div>
            </div>
            <div className="max-w-6xl mx-auto p-6 space-y-8 font-poppins">
              <TotalRewards />
              <MintedNFTs />
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="text-black">Something went wrong. Please try again.</div>
    );
  };

  return <>{renderContent()}</>;
}

export default RewardsMain;
