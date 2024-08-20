import React, { useEffect, useState } from "react";
import { fetchEnsAvatar } from "@/utils/ENSUtils";
import Image from "next/image";
import user1 from "@/assets/images/user/user5.svg";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import Link from "next/link";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import LeaderboardSkeleton from "../SkeletonLoader/LeaderboardSkeletonLoader";

interface DelegateData {
  address: string;
  sessionCount: number;
  claimedNFT: number;
  numberOfViews: number;
  ratingCount: number;
  averageRating: number;
  ensName: string;
  ensAvatar: string;
  color: string;
}

function Leaderboard({ props }: { props: string }) {
  const [delegatesData, setDelegatesData] = useState<DelegateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const getRankSymbol = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
  };

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  useEffect(() => {
    const fetchEnsData = async () => {
      const resp = await fetch(`/api/getleaderboard/${props}`);
      const apiData = await resp.json();
      const updatedDelegates: DelegateData[] = await Promise.all(
        apiData.map(async (delegate: any, index: number) => {
          try {
            // const delegateAddress = await fetchEnsAvatar(delegate.address);
            // return {
            //   ...delegate,
            //   ensName:
            //     delegateAddress?.ensName ||
            //     formatWalletAddress(delegate.address),
            //   ensAvatar: delegateAddress?.avatar || "",
            //   color: colors[index % colors.length],
            // };
            const delegateAddress = await fetchEnsAvatar(
              delegate.delegate_address
            );
            return {
              address: delegate.delegate_address,
              sessionCount: delegate.sessionCount,
              claimedNFT: delegate.ClaimedNFT,
              numberOfViews: delegate.NumberofViews,
              ratingCount: delegate.ratingCount,
              averageRating: delegate.averageRating,
              ensName:
                delegateAddress?.ensName ||
                formatWalletAddress(delegate.delegate_address),
              ensAvatar: delegateAddress?.avatar || "",
              color: colors[index % colors.length],
            };
          } catch (error) {
            console.error("Error fetching ENS data:", error);
            // return {
            //   ...delegate,
            //   ensName: formatWalletAddress(delegate.address),
            //   ensAvatar: "",
            //   color: colors[index % colors.length],
            // };
            return {
              address: delegate.delegate_address,
              sessionCount: delegate.sessionCount,
              claimedNFT: delegate.ClaimedNFT,
              numberOfViews: delegate.NumberofViews,
              ratingCount: delegate.ratingCount,
              averageRating: delegate.averageRating,
              ensName: formatWalletAddress(delegate.delegate_address),
              ensAvatar: "",
              color: colors[index % colors.length],
            };
          }
        })
      );
      setDelegatesData(updatedDelegates);
      setIsLoading(false);
    };
    fetchEnsData();
  }, []);

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <>
      <div className="container mx-auto p-4 font-poppins">
        <div className="max-w-5xl flex-grow mx-auto">
          {isLoading
            ? [...Array(5)].map((_, index) => (
                <LeaderboardSkeleton key={index} />
              ))
            : delegatesData.map((delegate: DelegateData, index) => (
                <div
                  className="bg-white hover:bg-gray-50 rounded-lg p-4 mb-4 w-full transition duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                  key={index}
                  style={{
                    boxShadow:
                      "rgb(204, 219, 232) 3px 3px 12px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
                  }}>
                  <div className="flex flex-col justify-between sm:flex-row items-center">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                      <div
                        className={`text-gray-500 font-semibold ${
                          index < 3 ? "text-xl" : "text-sm"
                        }`}>
                        {getRankSymbol(index)}
                      </div>
                      <Image
                        src={delegate.ensAvatar || user1}
                        alt="image"
                        width={20}
                        height={20}
                        className={`h-10 w-10 rounded-full object-cover object-center`}
                      />
                      <div className="flex-grow flex items-center gap-1">
                        <Link
                          href={`/${props}/${delegate.address}?active=info`}
                          className={`font-bold w-fit cursor-pointer hover:text-gray-500 ${delegate.color} bg-opacity-20 px-2 py-1 rounded-full`}>
                          {delegate.ensName}
                        </Link>
                        <Tooltip
                          content="Copy"
                          placement="right"
                          closeDelay={1}
                          showArrow>
                          <span className="cursor-pointer text-sm">
                            <IoCopy
                              onClick={() => handleCopy(delegate.address)}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-end mt-2 sm:mt-0">
                      <div className="text-center mx-2 my-1">
                        <div className={` text-black font-bold px-3 py-1`}>
                          {delegate.claimedNFT}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          NFTs Claimed
                        </div>
                      </div>
                      <div className="text-center mx-2 my-1">
                        <div
                          className={`${delegate.color} bg-opacity-20 text-black font-bold px-3 py-1 rounded-full`}>
                          {delegate.sessionCount}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Sessions
                        </div>
                      </div>
                      <div className="text-center mx-2 my-1">
                        <div className={` text-black font-bold px-3 py-1`}>
                          {delegate.numberOfViews}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Views</div>
                      </div>
                      <div className="text-center flex items-center mx-2 my-1 w-32">
                        <div className="text-black font-bold pl-3 pr-1 py-1">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => {
                              const starValue = index + 1;
                              if (starValue <= delegate.averageRating) {
                                return (
                                  <FaStar
                                    key={index}
                                    className="w-5 h-5 text-yellow-400 drop-shadow-lg"
                                  />
                                );
                              } else if (
                                starValue - 0.5 <=
                                delegate.averageRating
                              ) {
                                return (
                                  <FaStarHalfAlt
                                    key={index}
                                    className="w-5 h-5 text-yellow-400 drop-shadow-lg"
                                  />
                                );
                              } else {
                                return (
                                  <FaStar
                                    key={index}
                                    className="w-5 h-5 text-gray-300"
                                  />
                                );
                              }
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 ml-1">
                          ({delegate.ratingCount})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}
export default Leaderboard;
