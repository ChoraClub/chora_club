"use client";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { Address, formatEther, parseEther } from "viem";
import {
  protocolRewardsABI,
  protocolRewardsAddress,
} from "chora-protocol-deployments";

function RewardButton() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [ethToUsdConversionRate, setEthToUsdConversionRate] = useState(0);

  const { data: hash, writeContract, isPending, isError } = useWriteContract();

  const { data: accountBalance, isLoading } = useReadContract({
    abi: protocolRewardsABI,
    address:
      protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
    functionName: "balanceOf",
    args: [address as Address],
  });

  // withdraw amount is half of the balance
  const rewardBalanceInETH: any = Number(
    formatEther(accountBalance || BigInt(0))
  ).toFixed(5);
  const rewardBalanceInUSD: any = (
    rewardBalanceInETH * ethToUsdConversionRate
  ).toFixed(2);

  useEffect(() => {
    const fetchEthToUsdRate = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthToUsdConversionRate(data.ethereum.usd);
        console.log("data.ethereum.usd", data.ethereum.usd);
      } catch (error) {
        console.error("Failed to fetch ETH to USD conversion rate:", error);
      }
    };

    fetchEthToUsdRate();
  }, []);

  const handleClick = useCallback(() => {
    router.push("/claim-rewards");
  }, [router]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 300);
  }, []);

  return (
    <>
      <div className="relative inline-block">
        <div
          ref={hoverRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-xs sm:text-base text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
        >
          {0 < 0 ? (
            <>
              <span className="flex items-center">
                Rewards <span className="">🎁</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center">
                {rewardBalanceInETH} ETH
              </span>
            </>
          )}
        </div>
        {showTooltip && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute z-10 w-72 p-4 mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ease-in-out transform opacity-100 scale-100"
          >
            <div className="text-sm">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Rewards Balance
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {rewardBalanceInETH} ETH
              </p>
              <p className="text-gray-600 mb-4">≈ ${rewardBalanceInUSD} USD</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RewardButton;
