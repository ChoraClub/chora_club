"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import AvailableSessions from "./AvailableSessions";
import RecordedSessions from "./RecordedSessions";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import SidebarMainMobile from "../MainSidebar/SidebarMainMobile";
import Heading from "../ComponentUtils/Heading";

function DelegateSessionsMain() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <div className="">
        <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
          <Heading />
        </div>

        <div className="flex md:gap-12 bg-[#D9D9D945] md:pl-6 lg:pl-14 font-poppins">
          <button
            className={`w-1/2 md:w-auto border-b-2 py-3 md:py-4 px-2 ${
              searchParams.get("active") === "recordedSessions"
                ? " border-blue-shade-200 text-blue-shade-200 font-semibold"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=recordedSessions")}
          >
            <Tooltip
              showArrow
              content={
                <div className="font-poppins">
                  Browse previously recorded sessions.
                </div>
              }
              placement="right"
              className="rounded-md bg-opacity-90 max-w-96"
              closeDelay={1}
            >
              <div className="text-sm md:text-base whitespace-nowrap">
                Recorded
              </div>
            </Tooltip>
          </button>
          <button
            className={`w-1/2 md:w-auto border-b-2 py-3 md:py-4 px-2 ${
              searchParams.get("active") === "availableDelegates"
                ? "text-blue-shade-200 font-semibold border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=availableDelegates")}
          >
            <Tooltip
              showArrow
              content={
                <div className="font-poppins">
                  Explore available delegates by DAO, date, and time to book
                  sessions and unlock Web3 opportunities.
                </div>
              }
              placement="right"
              className="rounded-md bg-opacity-90 max-w-96"
              closeDelay={1}
            >
              <div className="text-sm md:text-base whitespace-nowrap">
                {" "}
                Available Delegates
              </div>
            </Tooltip>
          </button>
        </div>

        {searchParams.get("active") === "recordedSessions" ? (
          <div className="py-6 sm:px-20 md:px-6 lg:px-14">
            <RecordedSessions />
          </div>
        ) : (
          ""
        )}
        {searchParams.get("active") === "availableDelegates" ? (
          <div className="py-6 sm:px-8 md:px-6 lg:px-14 xl:px-14">
            <AvailableSessions />
          </div>
        ) : (
          ""
        )}

        {/* <div className="mt-1">
          <AvailableSessions />
        </div> */}
      </div>
    </>
  );
}

export default DelegateSessionsMain;
