"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AvailableSessions from "./AvailableSessions";
import RecordedSessions from "./RecordedSessions";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";

function DelegateSessionsMain() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <div className="pt-6 pl-14 pr-6">
        <div className="flex justify-between pe-10">
          <div className="flex font-quanty font-medium text-4xl text-blue-shade-200 pb-4 items-center">
            <div>
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
                <div> Available Delegates</div>
              </Tooltip>
            </div>
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>

        <div className="mt-1">
          <AvailableSessions />
        </div>
      </div>
    </>
  );
}

export default DelegateSessionsMain;
