import React, { useEffect, useState } from "react";
import { fetchEnsAvatar } from "@/utils/ENSUtils";
import Image from "next/image";
import user1 from "@/assets/images/user/user5.svg";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

interface DelegateData {
  address: string;
  sessions: number;
  nfts: number;
  views: number;
  ensName: string;
  ensAvatar: string;
  color: string;
  rating: number;
}

function Leaderboard({ props }: { props: string }) {
  const [delegatesData, setDelegatesData] = useState<DelegateData[]>([]);

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

  const delegates = [
    {
      address: "0xBb4c2baB6B2de45F9CC7Ab41087b730Eaa4adE31",
      sessions: 10,
      nfts: 5,
      views: 100,
      rating: 3,
    },
    {
      address: "0xc622420AD9dE8E595694413F24731Dd877eb84E1",
      sessions: 15,
      nfts: 8,
      views: 150,
      rating: 1,
    },
    {
      address: "0xa2d590fee197c0b614fe7c3e10303327f38c0dc3",
      sessions: 25,
      nfts: 82,
      views: 250,
      rating: 3,
    },
    {
      address: "0x1b686ee8e31c5959d9f5bbd8122a58682788eead",
      sessions: 16,
      nfts: 10,
      views: 130,
      rating: 2,
    },
    {
      address: "0x5b191f5a2b4a867c4ed71858daccc51fc59c69c0",
      sessions: 75,
      nfts: 18,
      views: 550,
      rating: 4,
    },
    {
      address: "0x1b686ee8e31c5959d9f5bbd8122a58682788eead",
      sessions: 16,
      nfts: 10,
      views: 130,
      rating: 3,
    },
    {
      address: "0x5b191f5a2b4a867c4ed71858daccc51fc59c69c0",
      sessions: 75,
      nfts: 18,
      views: 550,
      rating: 5,
    },
  ];

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
      const updatedDelegates: DelegateData[] = await Promise.all(
        delegates.map(async (delegate, index) => {
          try {
            const delegateAddress = await fetchEnsAvatar(delegate.address);
            return {
              ...delegate,
              ensName:
                delegateAddress?.ensName ||
                formatWalletAddress(delegate.address),
              ensAvatar: delegateAddress?.avatar || "",
              color: colors[index % colors.length],
            };
          } catch (error) {
            console.error("Error fetching ENS data:", error);
            return {
              ...delegate,
              ensName: formatWalletAddress(delegate.address),
              ensAvatar: "",
              color: colors[index % colors.length],
            };
          }
        })
      );
      setDelegatesData(updatedDelegates);
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
        <div className=" flex flex-col items-center max-w-5xl mx-auto">
          {delegatesData.map((delegate: DelegateData, index) => (
            <div
              className="bg-white hover:bg-gray-50 rounded-lg p-4 mb-4 w-full transition duration-300 ease-in-out hover:shadow-lg hover:scale-105"
              key={index}
              style={{
                boxShadow:
                  "rgb(204, 219, 232) 3px 3px 12px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
              }}
            >
              <div className="flex flex-col justify-between sm:flex-row items-center">
                <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                  <div
                    className={`text-gray-500 font-semibold ${
                      index < 3 ? "text-xl" : "text-sm"
                    }`}
                  >
                    {getRankSymbol(index)}
                  </div>
                  <Image
                    src={delegate.ensAvatar || user1}
                    alt="image"
                    width={20}
                    height={20}
                    className="h-10 w-10 rounded-full object-cover object-center"
                  />
                  <div className="flex-grow flex items-center gap-1">
                    <Link
                      href={`/${props}/${delegate.address}?active=info`}
                      className={`font-bold w-fit cursor-pointer hover:text-blue-shade-100 ${delegate.color} bg-opacity-20 px-2 py-1 rounded-full`}
                    >
                      {delegate.ensName}
                    </Link>
                    <Tooltip
                            content="Copy"
                            placement="right"
                            closeDelay={1}
                            showArrow
                          >
                    <span className="cursor-pointer text-sm">
                      <IoCopy onClick={() => handleCopy(delegate.address)} />
                    </span>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-end mt-2 sm:mt-0">
                  <div className="text-center mx-2 my-1">
                    <div className={` text-black font-bold px-3 py-1`}>
                      {delegate.nfts}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      NFTs Claimed
                    </div>
                  </div>
                  <div className="text-center mx-2 my-1">
                    <div
                      className={`${delegate.color} bg-opacity-20 text-black font-bold px-3 py-1 rounded-full`}
                    >
                      {delegate.sessions}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Sessions</div>
                  </div>
                  <div className="text-center mx-2 my-1">
                    <div className={` text-black font-bold px-3 py-1`}>
                      {delegate.views}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Views</div>
                  </div>
                  <div className="text-center flex items-center mr-2 ml-6 my-1">
                    <div className="text-black font-bold pl-3 pr-1 py-1">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`w-5 h-5 ${
                              index < delegate.rating
                                ? "text-yellow-400 drop-shadow-lg"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">({delegate.rating})</div>
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
