"use client";

import React, { useState, useEffect } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import EventTile from "../../utils/EventTile";
import { useAccount } from "wagmi";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";

function BookedUserSessions() {
  const { address } = useAccount();
  const [sessionDetails, setSessionDetails] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const getMeetingData = async () => {
    try {
      const response = await fetch(`/api/get-meeting/${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("result in get meeting", result);
      if (result.success) {
        setSessionDetails(result.data);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  useEffect(() => {
    getMeetingData();
    setPageLoading(false);
  }, [address, sessionDetails]);

  return (
    <>
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
              isEvent="Book"
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
    </>
  );
}

export default BookedUserSessions;
