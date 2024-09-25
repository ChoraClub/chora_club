"use client";
import React, { useEffect, useRef, useState } from "react";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arb.png";
import Image from "next/image";
import { HiGift } from "react-icons/hi";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import RewardButton from "./RewardButton";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { gql } from "urql";
import { nft_client } from "@/config/staticDataUtils";
import NFTTile from "./NFTTile";
import logo from "@/assets/images/daos/CCLogo2.png";
import { getRelativeTime } from "../../utils/getRelativeTime";
import { getTimestampFromBlock } from "../../utils/getTimestampFromBlock";
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

interface Reward {
  platform: string;
  amount: string;
  value: string;
  logo: any;
}

interface NFT {
  id: number;
  thumbnail: string;
}

interface CustomDropdownProps {
  options: string[];
  onChange?: (option: string) => void;
}
const REWARD_QUERY = gql`
  query MyQuery($address: String!) {
    rewardsPerUsers(where: { address: $address }) {
      address
      amount
      id
      withdrawn
    }
  }
`;

const MINTED_NFTS = gql`
  query MyQuery($address: String!) {
    token1155Holders(
      orderBy: lastUpdatedBlock
      orderDirection: desc
      where: { user: $address }
    ) {
      balance
      user
      lastUpdatedBlock
      tokenAndContract {
        metadata {
          image
          name
          rawJson
        }
        txn {
          network
        }
        address
      }
    }
  }
`;

function CustomDropdown({ options, onChange }: CustomDropdownProps) {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="rounded-full py-2 px-4 outline-none cursor-pointer bg-white shadow-md flex justify-between items-center transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0} // Makes the div focusable for better accessibility
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
          }
        }}
      >
        {selectedOption}
        <svg
          className={`ml-2 w-4 h-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              className={`py-2 px-4 cursor-pointer transition-all duration-200 ${
                selectedOption === option
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(option);
                }
              }}
              tabIndex={0} // Makes each option focusable
              role="option" // Helps screen readers understand that these are options
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RewardsMain() {
  const [showComingSoon, setShowComingSoon] = useState(true);
  const [totalRewards, setTotalRewards] = useState<any>({
    amount: "0.0",
    value: "$0.0",
  });
  const { address } = useAccount();
  const chainId = useChainId();
  const [claimableRewards, setClaimableRewards] = useState<Reward[]>([]);
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [ethToUsdConversionRate, setEthToUsdConversionRate] = useState(0);

  const nonZeroRewards = claimableRewards.filter(
    (reward) => parseFloat(reward.amount) > 0
  );

  const fetchReward = async () => {
    const data = await nft_client
      .query(REWARD_QUERY, { address: address })
      .toPromise();
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const coingeckoData = await response.json();
    // console.log("here data is ", data, coingeckoData.ethereum.usd);
    setEthToUsdConversionRate(coingeckoData.ethereum.usd);
    if (data.data.rewardsPerUsers.length < 1) {
      setTotalRewards({ amount: "0.0 ", value: "$0.0" });
      return;
    }
    const total =
      data?.data.rewardsPerUsers?.map((reward: any) => ({
        amount: (reward.amount / 10 ** 18).toFixed(5),
        value: `$${(
          (reward.amount * coingeckoData.ethereum.usd) /
          10 ** 18
        ).toFixed(2)}`,
      })) || [];
    setTotalRewards(total[0]);
    // console.log("total reward", total)
    const Rewards =
      data?.data.rewardsPerUsers?.map((reward: any) => ({
        platform: reward.id, // Use the ID or some other property for platform
        amount: ((reward.amount - reward.withdrawn) / 10 ** 18).toFixed(5),
        value: `$${(
          (reward.amount * coingeckoData.ethereum.usd) /
          10 ** 18
        ).toFixed(2)}`,
        logo: reward.id.includes("op") ? oplogo : arblogo, // Example condition to set logo
      })) || [];
    setClaimableRewards(Rewards);
    // console.log(claimableRewards);
  };
  useEffect(() => {
    if (address) {
      fetchReward();
      fetchNFTs();
    }
  }, [address]);

  const fetchNFTs = async () => {
    try {
      // Query the NFT data
      const result = await nft_client
        .query(MINTED_NFTS, { address: address })
        .toPromise();
      // console.log("result", result);

      const nfts = await Promise.all(
        result?.data.token1155Holders?.map(async (nft: any) => {
          // Check if tokenAndContract and metadata exist and are not null
          if (!nft?.tokenAndContract?.metadata?.rawJson) {
            console.warn("Missing metadata for NFT:", nft);
            return null; // Skip this NFT if metadata or rawJson is missing
          }

          const jsondata = JSON.parse(nft.tokenAndContract.metadata.rawJson);

          // Get timestamp from block number
          const timestamp = await getTimestampFromBlock(nft.lastUpdatedBlock);

          return {
            id: nft.tokenAndContract.metadata.name || "Unknown",
            thumbnail: nft.tokenAndContract.metadata.image || "",
            balance: nft.balance,
            contract: nft.tokenAndContract.address,
            network: nft.tokenAndContract.txn.network,
            // Get the relative time using the fetched timestamp
            time: getRelativeTime(timestamp),
            host: jsondata?.attributes?.[0]?.value,
          };
        }) || []
      );

      // Filter out any null results in case of missing data
      const validNfts = nfts.filter((nft) => nft !== null);

      // Set the processed NFTs into state
      setMintedNFTs(validNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const { data: hash, writeContract, isPending, isError } = useWriteContract();

  const { data: accountBalance, isLoading } = useReadContract({
    abi: protocolRewardsABI,
    address:
      protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
    functionName: "balanceOf",
    args: [address as Address],
  });

  const recipient = address;
  const withdrawAmount = BigInt(accountBalance || 0) / BigInt(2);

  // withdraw amount is half of the balance
  const rewardBalanceInETH: any = Number(
    formatEther(accountBalance || BigInt(0))
  ).toFixed(5);
  const rewardBalanceInUSD: any = (
    rewardBalanceInETH * ethToUsdConversionRate
  ).toFixed(2);

  const handleSelectChange = (selectedOption: string) => {
    // console.log(`Selected chain: ${selectedOption}`);
    // Add your logic here to handle the change
  };

  async function submit() {
    // write to the withdraw function on the ProtocolRewards contract
    if (!recipient) {
      console.error("Recipient address is undefined.");
      return;
    }
    writeContract({
      abi: protocolRewardsABI,
      address:
        protocolRewardsAddress[chainId as keyof typeof protocolRewardsAddress],
      functionName: "withdraw",
      args: [recipient!, withdrawAmount],
    });
  }

  return (
    <>
      <div className="w-full flex justify-end pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
        <div className="flex gap-1 xs:gap-2 items-center">
          <RewardButton />
          <ConnectWalletWithENS />
        </div>
      </div>
      {!address ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50">
          <div className="p-10 bg-white rounded-3xl shadow-xl text-center max-w-md transform transition duration-300 hover:scale-105">
            <div className="flex items-center justify-center mb-5">
              <Image src={logo} alt="image" width={100} />
            </div>
            <h2 className="font-bold text-3xl text-gray-900 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-700 mb-8">
              To continue, please connect your wallet to show rewards.
            </p>
            <div className="flex items-center justify-center">
              <ConnectWalletWithENS />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-6 space-y-8 font-poppins">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-1">🎁</span>
                Total Rewards
              </h2>

              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-2xl font-bold">
                  {totalRewards?.amount} ETH
                </span>
                <span className="text-gray-500">
                  (≈ {totalRewards?.value} USD)
                </span>
              </div>
            </div>

            <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Claim Rewards</h2>
              {nonZeroRewards.length > 0 ? (
                <div className="space-y-4">
                  {nonZeroRewards.map((reward, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Image src={reward.logo} alt="logo" />
                        </div>
                        <span>
                          {reward.platform.slice(0, 6)}...
                          {reward.platform.slice(-4)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-semibold">
                            {reward.amount} ETH
                          </div>
                          <div className="text-sm text-gray-500">
                            ≈ ${rewardBalanceInUSD} USD
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 group"
                          onClick={submit}
                        >
                          <span>Claim</span>
                          <HiGift
                            size={16}
                            className="transform group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>No rewards available to claim at the moment.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="#"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              Learn more about Referral Rewards
            </Link>
          </div>

          <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Minted NFTs</h2>
              <CustomDropdown
                options={["Optimism", "Arbitrum", "arbitrum-sepolia"]}
                onChange={handleSelectChange}
              />
            </div>
            {mintedNFTs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-10 py-8 font-poppins">
                  {mintedNFTs.map((nft) => (
                    <NFTTile
                      key={nft.id}
                      nft={{
                        id: nft.id,
                        thumbnail: nft.thumbnail, // Ensure correct property
                        contract: nft.contract,
                        network: nft.network,
                        time: nft.time,
                        host: nft.host,
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {/* <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg> */}
                <p>No NFTs minted yet. Start creating your collection!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default RewardsMain;
