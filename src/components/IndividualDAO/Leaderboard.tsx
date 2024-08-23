import React, { useEffect, useState } from "react";
import { fetchEnsAvatar } from "@/utils/ENSUtils";
import Image from "next/image";
import user1 from "@/assets/images/user/user5.svg";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import LeaderboardSkeleton from "../SkeletonLoader/LeaderboardSkeletonLoader";
import first from "@/assets/images/Leaderboard/first.svg"
import second from "@/assets/images/Leaderboard/second.svg"
import third from "@/assets/images/Leaderboard/third.svg"

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
  textColor: string;
}

function Leaderboard({ props }: { props: string }) {
  const [delegatesData, setDelegatesData] = useState<DelegateData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('Delegates');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const getRankSymbol = (index: number) => {
    switch (index) {
      case 0:
        return <Image src={first} alt="first" width={67} height={67}></Image>;
      case 1:
        return <Image src={second} alt="second" width={67} height={67}></Image>;
      case 2:
        return <Image src={third} alt="third" width={67} height={67}></Image>;
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

  const textColors = [
    "text-red-400",
    "text-blue-400",
    "text-green-400",
    "text-yellow-400",
    "text-purple-400",
    "text-pink-400",
    "text-indigo-400",
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
              textColor: textColors[index % textColors.length],
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
              textColor: textColors[index % textColors.length],
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
        <div className="max-w-5xl flex flex-grow mx-auto justify-between items-center mb-4">
          <div className="font-semibold text-[22px]">Leaderboard</div>
          <div className="flex justify-end gap-4 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg text-xs bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CiSearch className="h-4 w-4 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => 
              {e.preventDefault();
              setSortBy(e.target.value)}}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setIsDropdownOpen(false)}
            className="appearance-none bg-gray-100 cursor-pointer rounded-lg pl-6 pr-12 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Delegates">Choraclub Score</option>
            <option value="User">NFTs Claimed</option>
            <option value="Delegates">No. of Sessions</option>
            <option value="Delegates">No. of Views</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
    <FaChevronDown className="h-4 w-4 text-black" />
  </div>
  </div>
        </div>
      </div>
        </div>
        <div className="max-w-5xl flex-grow mx-auto">
          {isLoading
            ? [...Array(5)].map((_, index) => (
                <LeaderboardSkeleton key={index} />
              ))
            : delegatesData.map((delegate: DelegateData, index) => (
                <div
                  className="bg-white hover:bg-gray-50 rounded-lg mb-4 w-full transition duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                  key={index}
                  style={{
                    boxShadow:
                      "rgb(204, 219, 232) 3px 3px 12px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
                  }}
                >
                  <div className="flex flex-col justify-between sm:flex-row items-center">
                    <div className="flex items-center space-x-5 mb-3 sm:mb-0">
                      <div
                        className={`text-[#3E3D3D] font-semibold ml-5 flex justify-center items-center size-[67px] ${
                          index < 3 ? "" : "text-2xl"
                        }`}
                      >
                        {getRankSymbol(index)}
                      </div>
                      <div className="h-[105px] border-[0.1px] border-[#D5D4DF]"></div>
                      <Image
                        src={delegate.ensAvatar || user1}
                        alt="image"
                        width={20}
                        height={20}
                        className={`h-11 w-11 rounded-full object-cover object-center`}
                      />
                      <div className="min-w-[180px] flex justify-start">
                      <div className={`flex-grow flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full ${delegate.color} bg-opacity-20`}>
                        <Link
                          href={`/${props}/${delegate.address}?active=info`}
                          className={`font-semibold cursor-pointer hover:underline`}
                        >
                          {delegate.ensName}
                        </Link>
                        <Tooltip
                          content="Copy"
                          placement="right"
                          closeDelay={1}
                          showArrow
                        >
                          <span className="cursor-pointer text-xs">
                            <IoCopy
                              onClick={() => handleCopy(delegate.address)}
                            />
                          </span>
                        </Tooltip>
                      </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end sm:justify-end mt-2 sm:mt-0">
                      <div className="text-center mx-3 my-1">
                        <div className={`${delegate.textColor} font-bold text-lg px-3 py-1`}>
                          {delegate.claimedNFT}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          NFTs Claimed
                        </div>
                      </div>
                      <div className="text-center mx-3 my-1">
                        <div
                          className={`${delegate.textColor} font-bold text-lg px-3 py-1 rounded-full`}
                        >
                          {delegate.sessionCount}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Sessions
                        </div>
                      </div>
                      <div className="text-center mx-3 my-1">
                        <div className={` ${delegate.textColor} text-lg font-bold px-3 py-1`}>
                          {delegate.numberOfViews}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Views</div>
                      </div>
                    </div>
                    <div className="text-center flex items-center mr-11 w-32">
                        <div className="text-black font-bold pl-3 pr-1 py-1">
                          <div className="flex gap-1">
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
                                  <FaRegStar
                                    key={index}
                                    className="w-5 h-5 text-gray-300 font-semibold"
                                  />
                                );
                              }
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 font-semibold">
                          ({delegate.ratingCount})
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
