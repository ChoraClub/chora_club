"use client";

import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import EventTile from "../../ComponentUtils/EventTile";
import { useAccount } from "wagmi";
import ErrorDisplay from "@/components/ComponentUtils/ErrorDisplay";
import RecordedSessionsSkeletonLoader from "@/components/SkeletonLoader/RecordedSessionsSkeletonLoader";
import { SessionInterface } from "@/types/MeetingTypes";

function BookedUserSessions({ daoName }: { daoName: string }) {
  const { address } = useAccount();
  // const address = "0xB351a70dD6E5282A8c84edCbCd5A955469b9b032";
  const [sessionDetails, setSessionDetails] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    getMeetingData();
    window.location.reload();
  };

  const getMeetingData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        address: address,
      });

      const requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        // body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        `/api/get-meeting/${address}?dao_name=${daoName}`,
        requestOptions
      );
      const result = await response.json();
      // console.log("result in get meeting", result);
      let filteredData: any = result.data;
      if (result.success) {
        const currentTime = new Date();
        const currentSlot = new Date(currentTime.getTime() - 60 * 60 * 1000);

        filteredData = result.data.filter(
          (session: SessionInterface) =>
            session.dao_name === daoName &&
            session.meeting_status !== "Recorded"
        );

        setSessionDetails(filteredData);
        setPageLoading(false);
      } else {
        setPageLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
      setError("Unable to load sessions. Please try again in a few moments.");
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getMeetingData();
  }, [address]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {pageLoading ? (
          <RecordedSessionsSkeletonLoader />
        ) : sessionDetails.length > 0 ? (
          <div
            className={`grid min-[475px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 py-8 font-poppins`}
          >
            {sessionDetails.map((data, index) => (
              <EventTile
                key={index}
                tileIndex={index}
                data={data}
                isEvent="Book"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookedUserSessions;
