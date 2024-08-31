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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    const storedStatus = sessionStorage.getItem("notificationStatus");
    setShowNotification(storedStatus !== "closed");
    setIsPageLoading(false);
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

  return (
    <div className="pt-4 sm:pt-6 px-4 md:px-6 lg:px-14 min-h-screen">
      <div className="relative">
        <div className="flex flex-row justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="lg:hidden">
              <SidebarMainMobile />
            </div>
            <div className="text-blue-shade-200 font-medium text-3xl md:text-4xl font-quanty ">
              Explore DAOs
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <RewardButton />
            <ConnectWalletWithENS />
          </div>
          {/* <ConnectWalletWithENS /> */}
        </div>

        {/* <div
          className="md:flex justify-start items-center border-[0.5px] bg-[#f5f5f5] border-black rounded-full w-fit max-w-sm md:max-w-full hidden my-3 font-poppins"
        >
          <input
            type="text"
            placeholder="Search DAOs"
            className="pl-5 pr-2 bg-[#f5f5f5]  rounded-full outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-4 sm:px-6 py-2 sm:py-3">
            <Image src={search} alt="search" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5"  />
          </span>
        </div> */}
        <div
          className={`flex items-center rounded-full shadow-lg bg-gray-100 text-black cursor-pointer w-[365px]`}
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
                    className="w-[calc(100%-2rem)] max-w-[280px]  sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] 2xl:w-[calc(20%-1rem)] px-4 py-6 rounded-2xl cursor-pointer flex flex-col items-center justify-center"
                    onClick={() => handleClick(daos.name, daos.img)}
                  >
                    <div className="flex justify-center mb-4">
                      <Image
                        src={daos.img}
                        alt="Image not found"
                        width={60}
                        height={60}
                        className="rounded-full w-16 h-16 md:w-20 md:h-20"
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
      {showNotification && !isPageLoading && (
        <div
          className={` fixed bottom-10 left-10 sm:left-[10%] sm:right-[10%] md:left-[20%] md:right-[20%] lg:left-[30%] lg:right-[30%] ${
            status ? "" : "hidden"
          }`}
        >
          <div className="py-2 bg-blue-shade-100 text-white rounded-xl px-4 sm:px-7 relative text-xs sm:text-sm font-poppins font-medium">
            To ensure optimal user experience, please note that our site is
            designed to be responsive on desktop devices.
            <div
              className="bg-gray-50 hover:bg-gray-100 p-[5px] rounded-full cursor-pointer absolute top-[6px] right-[6px]"
              onClick={handleCloseNotification}
            >
              <ImCross color="#111" size={7} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExploreDAOs;
