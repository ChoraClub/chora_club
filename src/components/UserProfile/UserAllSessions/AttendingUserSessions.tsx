"use client";

import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import EventTile from "../../ComponentUtils/EventTile";
import { useAccount, useNetwork } from "wagmi";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Oval } from "react-loader-spinner";
import SessionTileSkeletonLoader from "@/components/SkeletonLoader/SessionTileSkeletonLoader";

type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
};

interface Session {
  booking_status: string;
  dao_name: string;
  description: string;
  host_address: string;
  joined_status: string;
  meetingId: string;
  meeting_status: "Upcoming" | "Recorded" | "Denied" | "";
  slot_time: string;
  title: string;
  attendees: Attendee[];
  _id: string;
}

function AttendingUserSessions({ daoName }: { daoName: string }) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const [sessionDetails, setSessionDetails] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const getUserMeetingData = async () => {
    try {
      const response = await fetch(`/api/get-session-data/${address}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dao_name: daoName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPageLoading(true);
        const resultData = await result.attending;
        console.log("resultData in attending", resultData);
        setSessionDetails(resultData);
        setPageLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  useEffect(() => {
    getUserMeetingData();
  }, [searchParams.get("session")]);

  return (
    <div className="space-y-6">
      {pageLoading ? (
        <SessionTileSkeletonLoader />
      ) : sessionDetails.length > 0 ? (
        sessionDetails.map((data, index) => (
          <EventTile
            key={index}
            tileIndex={index}
            data={data}
            isEvent="Attending"
          />
        ))
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="text-5xl">☹️</div>{" "}
          <div className="pt-4 font-semibold text-lg">
            Oops, no such result available!
          </div>
        </div>
      )}
    </div>
  );
}
export default AttendingUserSessions;
