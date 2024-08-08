"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import search from "@/assets/images/daos/search.png";
import { useRouter } from "next-nprogress-bar";
import { ImCross } from "react-icons/im";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { dao_details } from "@/config/daoDetails";
import ExploreDaosSkeletonLoader from "../SkeletonLoader/ExploreDaosSkeletonLoader";

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

  return (
    <div className="pt-6 pl-14 pr-6 min-h-screen">
      <div className="">
        <div className="flex justify-between pe-10">
          <div className="text-blue-shade-200 font-medium text-4xl font-quanty pb-4">
            Explore DAOs
          </div>

          <div>
            <ConnectWalletWithENS />
          </div>
        </div>

        <div
          style={{ background: "rgba(238, 237, 237, 0.36)" }}
          className="flex border-[0.5px] border-black w-fit rounded-full my-3 font-poppins"
        >
          <input
            type="text"
            placeholder="Search DAOs"
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="pl-5 rounded-full outline-none"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          ></input>
          <span className="flex items-center bg-black rounded-full px-6 py-3">
            <Image src={search} alt="search" width={20} height={20} />
          </span>
        </div>

        {isPageLoading ? (
          <ExploreDaosSkeletonLoader />
        ) : (
          <>
            <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 py-8 font-poppins">
              {daoInfo.length > 0 ? (
                daoInfo.map((daos: any, index: any) => (
                  <div
                    key={daos.name}
                    style={{
                      boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)",
                    }}
                    className="px-5 py-7 rounded-2xl cursor-pointer"
                    onClick={() => handleClick(daos.name, daos.img)}
                  >
                    <div className="flex justify-center">
                      <Image
                        src={daos.img}
                        alt="Image not found"
                        width={80}
                        height={80}
                        className="rounded-full"
                      ></Image>
                    </div>
                    <div className="text-center">
                      <div className="py-3">
                        <div className="font-semibold capitalize">
                          {daos.name}
                        </div>
                        <div className="text-sm bg-[#F2F2F2] py-2 rounded-md mt-3">
                          {daos.value} Participants
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pl-3 text-xl font-semibold">
                  No such Dao available
                </div>
              )}
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
                className={`px-5 py-7 rounded-2xl cursor-pointer flex items-center justify-center relative transition-all duration-250 ease-in-out ${
                  isHovered ? "border-2 border-gray-600" : ""
                }`}
              >
                <div className="">
                  <FaCirclePlus
                    size={70}
                    className={
                      isHovered
                        ? "blur-md transition-all duration-250 ease-in-out text-slate-300"
                        : "block transition-all duration-250 ease-in-out text-slate-300"
                    }
                  />
                </div>
                <Link
                  href={`https://app.deform.cc/form/a401a65c-73c0-49cb-8d96-63e36ef36f88`}
                  target="_blank"
                  className={`absolute inset-0 flex items-center justify-center bottom-0  ${
                    isHovered ? "block" : "hidden"
                  }`}
                >
                  <span className="text-xl font-semibold text-slate-800">
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
          className={`flex fixed items-center justify-center bottom-9 rounded-full font-poppins text-sm font-medium left-[34%] w-[32rem] ${
            status ? "" : "hidden"
          }`}
        >
          <div className="py-2 bg-blue-shade-100 text-white rounded-xl px-7 relative">
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
