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
      <div className="p-6">
        <div className="flex justify-between pe-10">
          <div className="font-quanty font-medium text-4xl text-blue-shade-200 pb-4">
            Delegate Sessions
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>

        <div className="pr-32 pt-4 font-poppins">
          <div className="flex gap-16 border-1 border-[#7C7C7C] pl-6 rounded-xl">
            <button
              className={`py-2  ${
                searchParams.get("sessions") === "available"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() => router.push(path + "?sessions=available")}
            >
              Available
            </button>
            <button
              className={`py-2 ${
                searchParams.get("sessions") === "recorded"
                  ? "text-[#3E3D3D] font-bold"
                  : "text-[#7C7C7C]"
              }`}
              onClick={() => router.push(path + "?sessions=recorded")}
            >
              Recorded
            </button>
          </div>
        </div>

        <div className="mt-1">
          {searchParams.get("sessions") === "available" && (
            <AvailableSessions />
          )}
          {searchParams.get("sessions") === "recorded" && <RecordedSessions />}
        </div>
      </div>
    </>
  );
}

export default DelegateSessionsMain;
