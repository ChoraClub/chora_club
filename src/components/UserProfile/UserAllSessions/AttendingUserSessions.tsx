"use client";

import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import { Tooltip } from "@nextui-org/react";
import EventTile from "../../utils/EventTile";
import { useAccount, useNetwork } from "wagmi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Oval } from "react-loader-spinner";

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
  meeting_status: "Upcoming" | "Recorded" | "Denied";
  slot_time: string;
  title: string;
  attendees: Attendee[];
  _id: string;
}

function AttendingUserSessions() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const [sessionDetails, setSessionDetails] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { chain, chains } = useNetwork();
  let dao_name = "";

  const getUserMeetingData = async () => {
    if (chain?.name === "Optimism") {
      dao_name = "optimism";
    } else if (chain?.name === "Arbitrum One") {
      dao_name = "arbitrum";
    }
    try {
      const response = await fetch(`/api/get-session-data/${address}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dao_name: dao_name,
        }),
      });

      const result = await response.json();
      // console.log("result in get session data", result);

      if (result.success) {
        // setSessionDetails(result.data);
        const resultData = await result.data;
        // console.log("resultData", resultData);
        setPageLoading(true);
        if (Array.isArray(resultData)) {
          let filteredData: any = resultData;
          if (searchParams.get("session") === "attending") {
            filteredData = resultData.filter((session: Session) => {
              return session.meeting_status === "Upcoming" &&
                session.attendees?.some(
                  (attendee) => attendee.attendee_address === address
                ) &&
                chain?.name === "Optimism"
                ? session.dao_name === "optimism"
                : chain?.name === "Arbitrum One"
                ? session.dao_name === "arbitrum"
                : "";
            });
          }
          console.log("filtered", filteredData);
          setSessionDetails(filteredData);
          setPageLoading(false);
        }
      }

      // if (result.success) {
      //   let filteredData: any = result.data;
      //   filteredData = result.data.filter((session: any) => {
      //     return chain?.name === "Optimism"
      //       ? session.dao_name === "optimism"
      //       : chain?.name === "Arbitrum One"
      //       ? session.dao_name === "arbitrum"
      //       : "";
      //   });
      //   setSessionDetails(filteredData);
      //   setPageLoading(false);
      // } else {
      //   setPageLoading(false);
      // }
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
        <div className="flex items-center justify-center">
          <Oval
            visible={true}
            height="40"
            width="40"
            color="#0500FF"
            secondaryColor="#cdccff"
            ariaLabel="oval-loading"
          />
        </div>
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
