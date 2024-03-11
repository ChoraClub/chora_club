"use client";

import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AvailableSessions from "./AvailableSessions";
import RecordedSessions from "./RecordedSessions";

function DelegateSessionsMain() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <div className="pt-6 px-6">
        <div className="flex justify-between pe-10">
          <div className="font-quanty font-medium text-4xl text-blue-shade-200 pb-4">
            Available Delegates
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>
        <div className="font-poppins mt-2">
          Welcome to our Available Delegates page, where you can easily find
          available delegates to conduct sessions. Utilize our intuitive filters
          to streamline your search process. Choose your desired DAO, select a
          date, and specify the time to narrow down the list of available
          delegates. Start your journey today by booking a session and unlock
          the boundless opportunities waiting for you in the world of Web3.
        </div>

        <div className="mt-1">
          <AvailableSessions />
        </div>
      </div>
    </>
  );
}

export default DelegateSessionsMain;
