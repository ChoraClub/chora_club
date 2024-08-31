"use client"
import React, { useState } from 'react';
import RecordedSessionsTile from '../ComponentUtils/RecordedSessionsTile';
import oplogo from "@/assets/images/daos/op.png"
import arblogo from "@/assets/images/daos/arbCir.png"
import Image from "next/image"
import { HiGift } from "react-icons/hi";
import Link from 'next/link';

interface Reward {
  platform: string;
  amount: string;
  value: string;
  logo:any;
}

interface NFT {
  id: number;
  thumbnail: string;
}

function RewardsMain() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const totalRewards = { amount: "0.002 ETH", value: "$5.49" };
  const claimableRewards: Reward[] = [
    { platform: "Optimism", amount: "0.001 ETH", value: "$2.70", logo:oplogo },
    { platform: "Arbitrum", amount: "0.002 ETH", value: "$0.00", logo:arblogo },
  ];
  const mintedNFTs: NFT[] = [
    // { id: 1, thumbnail: "path/to/thumbnail1.jpg" },
    // { id: 2, thumbnail: "path/to/thumbnail2.jpg" },
  ];

  const nonZeroRewards = claimableRewards.filter(reward => parseFloat(reward.amount) > 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {/* <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg> */}
            <span className="mr-1">🎁</span>
            Total Rewards
          </h2>
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-2xl font-bold">{totalRewards.amount}</span>
            <span className="text-gray-500">({totalRewards.value})</span>
          </div>
        </div>

        <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Claim Rewards</h2>
          {nonZeroRewards.length > 0 ? (
            <div className="space-y-4">
              {nonZeroRewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center space-x-2">
                    <div className='w-8 h-8 flex items-center justify-center'>
                        <Image src={reward.logo} alt="logo" />
                    </div>
                    <span>{reward.platform}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-semibold">{reward.amount}</div>
                      <div className="text-sm text-gray-500">{reward.value}</div>
                    </div>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 group">
                    <span>Claim</span>
                    {/* <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" /> */}
                    <HiGift size={16} className="transform group-hover:translate-x-1 transition-transform duration-300"/>
                  </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No rewards available to claim at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
          Learn more about Referral Rewards
        </Link>
      </div>

      <div className="bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-lg shadow-md p-6">
        <div className='flex justify-between'>
        <h2 className="text-xl font-semibold mb-4">Minted NFTs</h2>
        <select
            className="rounded-full py-2 px-4 outline-none cursor-pointer bg-white shadow-md"
            // onChange={handleSelectChange}
          >
            <option>Optimism</option>
            <option>Arbitrum</option>
          </select>
          </div>
        {mintedNFTs.length > 0 ? (
            <></>
        //   <RecordedSessionsTile
        //     meetingData={mintedNFTs.map(nft => ({
        //       meetingId: nft.id,
        //       thumbnail_image: nft.thumbnail,
        //       title: `NFT ${nft.id}`,
        //       // Add other required properties for RecordedSessionsTile
        //     }))}
        //     gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        //   />
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
  );
}

export default RewardsMain;