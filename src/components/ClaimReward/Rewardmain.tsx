"use client";
import React, { useEffect, useRef, useState } from "react";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbCir.png";
import Image from "next/image";
import { HiGift } from "react-icons/hi";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import RewardButton from "./RewardButton";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { gql } from 'urql';
import { useAccount } from "wagmi";
import { nft_client } from "@/config/staticDataUtils";
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
  rewardsPerUsers(where: {address: $address}) {
    address
    amount
    id
    withdrawn
  }
}`

const MINTED_NFTS =gql`
query MyQuery($address: String!) {
  token1155Holders(where: {user: $address}) {
    balance
    user
    tokenAndContract {
      metadata {
        image
        name
        animationUrl
      }
      address
    }
  }
}`;

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
    const handleClickOutside = (event:MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
              onClick={() => handleSelect(option)}onKeyDown={(e) => {
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
  const [totalRewards, setTotalRewards] = useState<any>({ amount: "0.0 ETH", value: "$0.0" });
  // const totalRewards = { amount: "0.0 ETH", value: "$0.0" };
  const {address} = useAccount();
  console.log(address)
  const [claimableRewards,setClaimableRewards] = useState<Reward[]>([]);
  // let claimableRewards: Reward[] = [
  //   { platform: "Optimism", amount: "0.0 ETH", value: "$0.0", logo: oplogo },
  //   { platform: "Arbitrum", amount: "0.0 ETH", value: "$0.0", logo: arblogo },
  // ];
const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  // const mintedNFTs: NFT[] = [
    // { id: 1, thumbnail: "path/to/thumbnail1.jpg" },
    // { id: 2, thumbnail: "path/to/thumbnail2.jpg" },
  // ];

  const nonZeroRewards = claimableRewards.filter(
    (reward) => parseFloat(reward.amount) > 0
  );

  const handleSelectChange = (selectedOption:string) => {
    console.log(`Selected chain: ${selectedOption}`);
    // Add your logic here to handle the change
  };

  const fetchReward = async () => {
    const data = await nft_client.query(REWARD_QUERY, {address: "0x3013bb4e03a7b81106d69c10710eae148c8410e1"}).toPromise();
    const total = data?.data.rewardsPerUsers?.map((reward: any) => ({
      amount : reward.amount/10**18,
      value : `$${parseFloat(reward.amount).toFixed(2)}`
    })) || [];
    setTotalRewards(total[0]);
    console.log("total reward",total);
    const Rewards= data?.data.rewardsPerUsers?.map((reward: any) => ({
      platform: reward.id,  // Use the ID or some other property for platform
      amount: ((reward.amount-reward.withdrawn)/10**18),
      value: `$${parseFloat(reward.amount).toFixed(2)}`,
      logo: reward.id.includes("op") ? oplogo : arblogo,  // Example condition to set logo
    })) || [];
    setClaimableRewards(Rewards);
    console.log(claimableRewards);
  };
  useEffect(() => {
    fetchReward();
    fetchNFTs();
  }, []);


  const fetchNFTs = async () => {
    const result = await nft_client.query(MINTED_NFTS, {address: "0x3013bb4e03a7b81106d69c10710eae148c8410e1"}).toPromise();
    const nfts = result?.data.token1155Holders?.map((nft: any) => ({
      id: nft.tokenAndContract.metadata.name,
      thumbnail: nft.tokenAndContract.metadata.image,
      balance : nft.balance
    })) || [];
    console.log("minted nfts",nfts);
    setMintedNFTs(nfts);
  };
  return (
    <>
    <div className="w-full flex justify-end pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
    <div className="flex gap-1 xs:gap-2 items-center">
        <RewardButton />
        <ConnectWalletWithENS />
      </div>
    </div>
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="mr-1">🎁</span>
            Total Rewards
            {showComingSoon && (
              <div className="flex items-center bg-yellow-100 border border-yellow-400 rounded-full px-2 ml-4">
                <p className="text-sm text-yellow-700 mr-2">Coming Soon</p>
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="text-yellow-700 hover:text-yellow-800"
                >
                  <RxCross2 size={12} />
                </button>
              </div>
            )}
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
            <span className="text-2xl font-bold">{totalRewards.amount} ETH</span>
            <span className="text-gray-500">({totalRewards.value.slice(0,3)})</span>
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
                    <span>{reward.platform.slice(0,6)}...{reward.platform.slice(-4)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-semibold">{reward.amount} ETH</div>
                      <div className="text-sm text-gray-500">
                        {reward.value}
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 group">
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
            options={["Optimism", "Arbitrum"]}
            onChange={handleSelectChange}
          />
        </div>
        {mintedNFTs.length > 0 ? (
          <>
             <RecordedSessionsTile
              meetingData={mintedNFTs.map(nft => ({
                meetingId: nft.id,
                thumbnail_image: nft.thumbnail,
                title: `NFT ${nft.id}`,
                // Add other required properties for RecordedSessionsTile
              }))}
              gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            /></>
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
    </>
  );
}

export default RewardsMain;
