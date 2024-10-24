import React, { useEffect, useState } from "react";
import { fetchEnsNameAndAvatar } from "@/utils/ENSUtils";
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
import first from "@/assets/images/Leaderboard/first.svg";
import second from "@/assets/images/Leaderboard/second.svg";
import third from "@/assets/images/Leaderboard/third.svg";
interface DelegateData {
  address: string;
  sessionCount: number;
  claimedNFT: number;
  TotalViews: number;
  ratingCount: number;
  averageRating: number;
  Score: any;
  ensName: string;
  ensAvatar: string;
  color: string;
  textColor: string;
}

function Leaderboard({ props }: { props: string }) {
  const [delegatesData, setDelegatesData] = useState<DelegateData[]>([]);
  const [allDelegatesData, setAllDelegatesData] = useState<DelegateData[]>([]);
  const [displayedDelegates, setDisplayedDelegates] = useState<DelegateData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Delegates");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };
  function formatViews(views: number): string {
    // Handle negative numbers or NaN
    if (isNaN(views) || views < 0) {
      return "0";
    }

    // For millions (e.g., 1.25M)
    if (views >= 1000000) {
      const millionViews = views / 1000000;
      return (
        millionViews.toFixed(millionViews >= 10 ? 0 : 1).replace(/\.0$/, "") +
        "M"
      );
    }
    // For thousands (e.g., 1.2k, 12k)
    if (views >= 1000) {
      const thousandViews = views / 1000;
      return (
        thousandViews.toFixed(thousandViews >= 10 ? 0 : 1).replace(/\.0$/, "") +
        "k"
      );
    }
    // For less than 1000 views, return as is
    return Math.floor(views).toString();
  }
  const getRankSymbol = (
    delegate: DelegateData,
    sortedData: DelegateData[]
  ) => {
    const rank =
      sortedData.findIndex((d) => d.address === delegate.address) + 1;
    switch (rank) {
      case 1:
        return <Image src={first} alt="first" width={67} height={67} />;
      case 2:
        return <Image src={second} alt="second" width={67} height={67} />;
      case 3:
        return <Image src={third} alt="third" width={67} height={67} />;
      default:
        return `#${rank}`;
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
            const delegateAddress = await fetchEnsNameAndAvatar(
              delegate.delegate_address
            );
            return {
              address: delegate.delegate_address.toLowerCase(),
              sessionCount: delegate.sessionCount,
              claimedNFT: delegate.ClaimedNFT,
              TotalViews: delegate.totalViews,
              ratingCount: delegate.ratingCount,
              averageRating: delegate.averageRating,
              Score: delegate.CC_SCORE,
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
              address: delegate.delegate_address.toLowerCase(),
              sessionCount: delegate.sessionCount,
              claimedNFT: delegate.ClaimedNFT,
              TotalViews: delegate.totalViews,
              ratingCount: delegate.ratingCount,
              averageRating: delegate.averageRating,
              Score: delegate.CC_SCORE,
              ensName: formatWalletAddress(
                delegate.delegate_address.toLowerCase()
              ),
              ensAvatar: "",
              color: colors[index % colors.length],
              textColor: textColors[index % textColors.length],
            };
          }
        })
      );
      setDelegatesData(updatedDelegates);
      setAllDelegatesData(updatedDelegates);
      setTotalPages(Math.ceil(updatedDelegates.length / ITEMS_PER_PAGE));
      setIsLoading(false);
    };
    fetchEnsData();
  }, []);
  useEffect(() => {
    const filteredData = allDelegatesData.filter((delegate) =>
      delegate.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
      if (sortBy === "NFTs Claimed") return b.claimedNFT - a.claimedNFT;
      if (sortBy === "No. of Sessions") return b.sessionCount - a.sessionCount;
      if (sortBy === "No. of Views") return b.TotalViews - a.TotalViews;
      return b.Score - a.Score; // Default: Chora Club Score
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedDelegates(sortedData.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(sortedData.length / ITEMS_PER_PAGE));
  }, [allDelegatesData, searchTerm, sortBy, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <>
      <div className="container mx-auto xs:p-4 font-poppins">
        <div className="max-w-5xl flex flex-grow mx-auto justify-between items-center mb-4">
          <div className="font-semibold text-[22px] hidden lg:block">Leaderboard</div>
          <div className="flex flex-col xs:flex-row xs:justify-end gap-2 xs:gap-4 w-full items-center">
            <div className="relative w-full xm:w-auto">
              <input
                type="text"
                placeholder="Search by Address"
                className="pl-10 pr-4 w-full py-2 rounded-lg text-xs bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <CiSearch className="h-4 w-4 text-black absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="relative w-full xm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => {
                  e.preventDefault();
                  setSortBy(e.target.value);
                }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setIsDropdownOpen(false)}
                className="appearance-none bg-gray-100 cursor-pointer rounded-lg pl-6 pr-12 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-full focus:border-transparent"
              >
                <option value="Delegates">Chora Club Score</option>
                <option value="NFTs Claimed">NFTs Claimed</option>
                <option value="No. of Sessions">No. of Sessions</option>
                <option value="No. of Views">No. of Views</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div
                  className={`transform transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <FaChevronDown className="h-4 w-4 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl flex-grow mx-auto">
          {isLoading ? (
            [...Array(5)].map((_, index) => <LeaderboardSkeleton key={index} />)
          ) : (
            <div className="max-w-5xl">
              {/* Header Row */}
              <div className="hidden 1.7lg:block rounded-lg max-w-5xl">
                <div className="flex justify-between items-center px-4 py-3">
                  <div className="flex items-center space-x-5">
                    <div className="text-gray-600 w-[80px] text-center">
                      Rank
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between w-[660px]">
                    {[
                      {
                        label: "NFTs Claimed",
                        tooltip:
                          "Number of NFTs collected from hosted sessions.",
                        align: "left",
                      },
                      {
                        label: "Sessions",
                        tooltip: "Total sessions conducted.",
                      },
                      {
                        label: "Views",
                        tooltip: "Total views across all hosted sessions.",
                      },
                      {
                        label: "Ratings",
                        tooltip: "Average rating of the sessions.",
                      },
                      {
                        label: "CC Score",
                        tooltip:
                          "Overall score based on NFTs, views, ratings, and sessions.",
                        align: "right",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`relative mx-2 w-[110px] text-gray-600 flex flex-col justify-center ${
                          item.align === "left"
                            ? "text-left justify-self-start ml-3"
                            : item.align === "right"
                            ? "text-right items-end"
                            : "text-center"
                        }`}
                        onMouseEnter={() =>
                          setHoveredTitle(item.label.toLowerCase())
                        }
                        onMouseLeave={() => setHoveredTitle("")}
                      >
                        <span>{item.label}</span>
                        {hoveredTitle === item.label.toLowerCase() && (
                          <div className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs rounded p-2 w-64">
                            {item.tooltip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delegate Rows */}
              {displayedDelegates.map((delegate: DelegateData, index) => (
                <div
                  className="bg-white hover:bg-gray-50 rounded-lg mb-4 w-full transition duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]"
                  key={index}
                  style={{
                    boxShadow:
                      "rgb(204, 219, 232) 3px 3px 12px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset",
                  }}
                >
                  <div className="flex flex-col 1.7lg:flex-row justify-between 1.7lg:items-center items-start">
                    <div className="flex items-center space-x-2 xs:space-x-5 mb-2 xs:mb-3 sm:mb-0">
                      <div
                        className={`text-[#3E3D3D] font-semibold ml-2 xs:ml-5 flex justify-center items-center size-[56px] xs:size-[67px] ${
                          getRankSymbol(delegate, allDelegatesData) === "#1" ||
                          getRankSymbol(delegate, allDelegatesData) === "#2" ||
                          getRankSymbol(delegate, allDelegatesData) === "#3"
                            ? ""
                            : "text-2xl"
                        }`}
                      >
                        {getRankSymbol(delegate, allDelegatesData)}
                      </div>
                      <div className="h-[86px] xs:h-[105px] border-[0.1px] border-[#D5D4DF]"></div>
                      <Image
                        src={delegate.ensAvatar || user1}
                        alt="image"
                        width={20}
                        height={20}
                        className="size-8 xs:size-11 rounded-full object-cover object-center"
                      />
                      <div className="min-w-[140px] xs:min-w-[160px] flex justify-start">
                        <div
                          className={`flex-grow flex items-center justify-center gap-1.5 px-2 xs:px-4 py-1.5 rounded-full ${delegate.color} bg-opacity-20`}
                        >
                          <Link
                            href={`/${props}/${delegate.address}?active=info`}
                            className="font-semibold cursor-pointer text-sm xs:text-base hover:underline"
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
                    <div className="hidden 1.7lg:flex flex-wrap justify-between w-[660px] mt-2 sm:mt-0">
                      <div className="text-center my-1 w-[100px]">
                        <div
                          className={`${delegate.textColor} font-bold text-lg`}
                        >
                          {delegate.claimedNFT}
                        </div>
                      </div>
                      <div className="text-center mx-3 my-1 w-[110px]">
                        <div
                          className={`${delegate.textColor} font-bold text-lg`}
                        >
                          {formatViews(delegate.sessionCount)}
                        </div>
                      </div>
                      <div className="text-center mx-3 my-1 w-[110px]">
                        <div
                          className={`${delegate.textColor} font-bold text-lg`}
                        >
                          {formatViews(delegate.TotalViews)}
                        </div>
                      </div>
                      <div className="text-center mx-3 my-1 w-[110px] flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, starIndex) => {
                            const starValue = starIndex + 1;
                            if (starValue <= delegate.averageRating) {
                              return (
                                <FaStar
                                  key={starIndex}
                                  className="w-5 h-5 text-yellow-400 drop-shadow-lg"
                                />
                              );
                            } else if (
                              starValue - 0.5 <=
                              delegate.averageRating
                            ) {
                              return (
                                <FaStarHalfAlt
                                  key={starIndex}
                                  className="w-5 h-5 text-yellow-400 drop-shadow-lg"
                                />
                              );
                            } else {
                              return (
                                <FaRegStar
                                  key={starIndex}
                                  className="w-5 h-5 text-gray-300 font-semibold"
                                />
                              );
                            }
                          })}
                        </div>
                        <div className="text-xs text-gray-300 font-semibold">
                          ({formatViews(delegate.ratingCount)})
                        </div>
                      </div>
                      <div className="text-center mx-3 my-1 w-[110px]">
                        <div
                          className={`${delegate.textColor} font-bold text-lg`}
                        >
                          {delegate.Score}
                        </div>
                      </div>
                    </div>
                    <div className="flex 1.7lg:hidden flex-wrap gap-2 p-4 w-full">
                      <div className="grid grid-cols-2 gap-3 w-full">
                        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                          <p className="text-gray-500 text-sm mb-1">
                            NFTs Claimed
                          </p>
                          <p
                            className={`${delegate.textColor} text-xl font-bold`}
                          >
                            {delegate.claimedNFT}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                          <p className="text-gray-500 text-sm mb-1">Sessions</p>
                          <p
                            className={`${delegate.textColor} text-xl font-bold`}
                          >
                            {delegate.sessionCount}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                          <p className="text-gray-500 text-sm mb-1">Views</p>
                          <p
                            className={`${delegate.textColor} text-xl font-bold`}
                          >
                            {delegate.TotalViews}
                          </p>
                        </div>

                        

                      <div className="bg-gray-50 rounded-xl p-4 mt-2 shadow-sm">
                        <p className="text-gray-500 text-sm mb-2">Ratings</p>
                        <div className="flex items-center gap-1 xs:gap-3">
                          <div className="flex gap-0.5 0.5xs:gap-1">
                            {[...Array(5)].map((_, starIndex) => {
                              const starValue = starIndex + 1;
                              if (starValue <= delegate.averageRating) {
                                return (
                                  <FaStar
                                    key={starIndex}
                                    className="size-3 0.5xs:size-4 xs:size-5 text-yellow-400 drop-shadow-sm"
                                  />
                                );
                              } else if (
                                starValue - 0.5 <=
                                delegate.averageRating
                              ) {
                                return (
                                  <FaStarHalfAlt
                                    key={starIndex}
                                    className="size-3 0.5xs:size-4 xs:size-5 text-yellow-400 drop-shadow-sm"
                                  />
                                );
                              } else {
                                return (
                                  <FaRegStar
                                    key={starIndex}
                                    className="size-3 0.5xs:size-4 xs:size-5 text-gray-300"
                                  />
                                );
                              }
                            })}
                          </div>
                          <span className="text-xs xs:text-sm text-gray-400">
                            ({delegate.averageRating.toFixed(1)})
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl col-span-2 p-4 shadow-sm">
                          <p className="text-gray-500 text-sm mb-1">CC Score</p>
                          <p
                            className={`${delegate.textColor} text-xl font-bold`}
                          >
                            {delegate.Score}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 0.5xs:px-4 0.5xs:py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 0.5xs:px-4 0.5xs:py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Leaderboard;
