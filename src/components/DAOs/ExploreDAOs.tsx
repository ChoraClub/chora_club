"use client";

import React, { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import search from "@/assets/images/daos/search.png";
import { useRouter } from "next-nprogress-bar";
import { ImCross } from "react-icons/im";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { dao_details } from "@/config/daoDetails";
import ExploreDaosSkeletonLoader from "../SkeletonLoader/ExploreDaosSkeletonLoader";
import { CiSearch } from "react-icons/ci";
import SidebarMainMobile from "../MainSidebar/SidebarMainMobile";
import RewardButton from "../ClaimReward/RewardButton";
import { useSearchParams } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Heading from "../ComponentUtils/Heading";
import { useConnection } from "@/app/hooks/useConnection";
import { useAccount } from "wagmi";

function ExploreDAOs() {
  const dao_info = Object.keys(dao_details).map((key) => {
    const dao = dao_details[key];
    return {
      name: dao.title,
      value: dao.number_of_delegates,
      img: dao.logo,
    };
  });

  const [daoInfo, setDaoInfo] = useState(dao_info);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(true);
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(true);
  // const [isPageLoading, setIsPageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const searchParams = useSearchParams();
  const { openConnectModal } = useConnectModal();
  const { isConnected, isLoading, isSessionLoading, isPageLoading, isReady } =
    useConnection();

  useEffect(() => {
    const storedStatus = sessionStorage.getItem("notificationStatus");
    setShowNotification(storedStatus !== "closed");
    // setIsPageLoading(false);
  }, []);

  const handleCloseNotification = () => {
    sessionStorage.setItem("notificationStatus", "closed");
    setShowNotification(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const filtered = dao_info.filter((item) =>
      item.name.toLowerCase().startsWith(query.toLowerCase())
    );
    setDaoInfo(filtered);
  };

  const handleClick = (name: string, img: StaticImageData) => {
    const formatted = name.toLowerCase();
    const localData = JSON.parse(localStorage.getItem("visitedDao") || "{}");
    localStorage.setItem(
      "visitedDao",
      JSON.stringify({ ...localData, [formatted]: [formatted, img] })
    );
    router.push(`/${formatted}?active=about`);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (openSearch && !event.target.closest(".search-container")) {
        setOpenSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSearch]);

  useEffect(() => {
    if (searchParams.get("referrer") && openConnectModal) {
      openConnectModal();
    }
  }, [searchParams]);

  return (
    <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14 min-h-screen">
      <div className="relative">
        <Heading />

        <div
          className={`flex items-center rounded-full shadow-lg bg-gray-100 text-black cursor-pointer w-[300px] xs:w-[365px]`}
        >
          <CiSearch
            className={`text-base transition-all duration-700 ease-in-out ml-3`}
          />
          <input
            type="text"
            placeholder="Search DAOs"
            className="w-[100%] pl-2 pr-4 py-1.5 font-poppins md:py-2 text-sm bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {isPageLoading ? (
          <ExploreDaosSkeletonLoader />
        ) : (
          <>
            <div className="flex flex-wrap justify-center md:justify-normal gap-4 md:gap-6 lg:gap-8 py-8 font-poppins">
              {daoInfo.length > 0 ? (
                daoInfo.map((daos: any, index: any) => (
                  <div
                    key={daos.name}
                    style={{
                      boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                    }}
                    className="w-[calc(100%-2rem)] max-w-[280px]  sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] 2xl:w-[calc(20%-1rem)] px-4 py-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105"
                    onClick={() => handleClick(daos.name, daos.img)}
                  >
                    <div className="flex justify-center mb-4 transition-transform duration-300 ease-in-out hover:scale-110">
                      <Image
                        src={daos.img}
                        alt="Image not found"
                        width={300}
                        height={300}
                        className="rounded-full w-16 h-16 md:w-20 md:h-20"
                        quality={100}
                        loading={`lazy`}
                      ></Image>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold capitalize text-sm md:text-base mb-2">
                        {daos.name}
                      </div>
                      <div className="text-xs md:text-sm bg-[#F2F2F2] py-2 px-3 rounded-md ">
                        {daos.value} Participants
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center text-xl font-semibold">
                  No such Dao available
                </div>
              )}
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
                className={`w-[calc(100%-2rem)] max-w-[280px] sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] 2xl:w-[calc(20%-1rem)] px-4 py-6 rounded-2xl cursor-pointer flex items-center justify-center relative transition-all duration-250 ease-in-out h-[188px] md:h-[220px] ${
                  isHovered ? "border-2 border-gray-600" : ""
                }`}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <FaCirclePlus
                    size={50}
                    className={`md:text-[70px]
                      ${
                        isHovered
                          ? "blur-md transition-all duration-250 ease-in-out text-slate-300"
                          : "block transition-all duration-250 ease-in-out text-slate-300"
                      }`}
                  />
                </div>
                <Link
                  href={`https://app.deform.cc/form/a401a65c-73c0-49cb-8d96-63e36ef36f88`}
                  target="_blank"
                  className={`absolute inset-0 flex items-center justify-center   ${
                    isHovered ? "block" : "hidden"
                  }`}
                >
                  <span className="text-lg md:text-xl font-semibold text-slate-800 px-2 text-center">
                    Add your DAO
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExploreDAOs;
