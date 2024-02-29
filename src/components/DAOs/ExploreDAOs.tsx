"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import search from "@/assets/images/daos/search.png";
import op_logo from "@/assets/images/daos/op.png";
import arb_logo from "@/assets/images/daos/arbitrum.jpg";
import { useRouter } from "next/navigation";
import { ImCross } from "react-icons/im";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function ExploreDAOs() {
  const dao_info = [
    { name: "Optimism", value: "193K", img: op_logo },
    { name: "Arbitrum", value: "294k", img: arb_logo },
  ];

  const [daoInfo, setDaoInfo] = useState(dao_info);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(true);

  const router = useRouter();
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const storedStatus = sessionStorage.getItem("notificationStatus");
    setShowNotification(storedStatus !== "closed");
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
    router.push(`/${formatted}?active=delegatesList`);
  };

  const handleClose = () => {
    setStatus(false);
    localStorage.setItem("hasSeenNotification", "true");
  };

  return (
    <div className="p-6">
      {showNotification && (
        <div
          className={`flex absolute items-center justify-center bottom-9 rounded-full font-poppins text-sm font-medium left-[34%] w-[32rem] ${
            status ? "" : "hidden"
          }`}
        >
          <div className="py-2 bg-blue-shade-100 text-white rounded-full px-7">
            To ensure optimal user experience, please note that our site is
            designed to be responsive on desktop devices.
          </div>
          <div
            className="bg-red-600 hover:bg-red-700 p-2 rounded-full cursor-pointer ml-3"
            onClick={handleCloseNotification}
          >
            <ImCross color="#fff" size={10} />
          </div>
        </div>
      )}

      <div className="">
        <div className="flex justify-between pe-10">
          <div className="text-blue-shade-200 font-medium text-4xl font-quanty pb-4">
            Explore DAOs
          </div>
          <div>
            <ConnectButton />
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
            <Image src={search} alt="search" width={20} />
          </span>
        </div>

        <div className="grid min-[475px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10 py-8 font-poppins">
          {daoInfo.length > 0 ? (
            daoInfo.map((daos, index) => (
              <div
                key={daos.name}
                style={{ boxShadow: "0px 4px 50.8px 0px rgba(0, 0, 0, 0.11)" }}
                className="px-5 py-7 rounded-2xl cursor-pointer"
                onClick={() => handleClick(daos.name, daos.img)}
              >
                <div className="flex justify-center">
                  <Image
                    src={daos.img}
                    alt="Image not found"
                    width={80}
                    className="rounded-full"
                  ></Image>
                </div>
                <div className="text-center">
                  <div className="py-3">
                    <div className="font-semibold">{daos.name}</div>
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
        </div>
      </div>
    </div>
  );
}

export default ExploreDAOs;
