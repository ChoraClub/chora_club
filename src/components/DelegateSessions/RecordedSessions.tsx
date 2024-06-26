import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import search from "@/assets/images/daos/search.png";
import texture1 from "@/assets/images/daos/texture1.png";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import arbcir from "@/assets/images/daos/arbCir.png";
import user from "@/assets/images/daos/user3.png";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import styles from "./RecordedSessions.module.css";
import { Oval } from "react-loader-spinner";
// import { parseISO } from "date-fns";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import user1 from "@/assets/images/user/user1.svg";
import user2 from "@/assets/images/user/user2.svg";
import user3 from "@/assets/images/user/user3.svg";
import user4 from "@/assets/images/user/user4.svg";
import user5 from "@/assets/images/user/user5.svg";
import user6 from "@/assets/images/user/user6.svg";
import user7 from "@/assets/images/user/user7.svg";
import user8 from "@/assets/images/user/user8.svg";
import user9 from "@/assets/images/user/user9.svg";

interface SessionData {
  session: {
    attendees: {
      attendee_address: string;
    }[];
    host_address: string;
  };
  guestInfo: {
    image: string | null;
  };
  hostInfo: {
    image: string | null;
  };
}
import Head from "next/head";
// import { getEnsName, getEnsNameOfUser } from "../ConnectWallet/ENSResolver";
import RecordedSessionsTile from "../utils/RecordedSessionsTile";
import RecordedSessionsSkeletonLoader from "../SkeletonLoader/RecordedSessionsSkeletonLoader";

function RecordedSessions() {
  // const parseISO = dateFns;
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<any>([]);
  const [karmaImage, setKarmaImage] = useState<any>();
  const [displayIFrame, setDisplayIFrame] = useState<number | null>(null);
  const router = useRouter();
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null); // Track which video is hovered
  const videoRefs = useRef<any>([]);
  const [videoDurations, setVideoDurations] = useState<any>({});
  const [searchMeetingData, setSearchMeetingData] = useState<any>([]);
  const [activeButton, setActiveButton] = useState("all");


  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  useEffect(() => {
    const getRecordedMeetings = async () => {
      try {
        const response = await fetch(`/api/get-recorded-meetings`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resultData = await response.json();
        // console.log("result data: ", resultData);

        if (resultData.success) {
          console.log("result data: ", resultData.data);
          setMeetingData(resultData.data);
          setSearchMeetingData(resultData.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("error in catch", error);
      }
    };
    getRecordedMeetings();
  }, []);

  // const formatTimeAgo = (utcTime: string): string => {
  //   const parsedTime = parseISO(utcTime);
  //   const currentTime = new Date();
  //   const differenceInSeconds = Math.abs(
  //     (parsedTime.getTime() - currentTime.getTime()) / 1000
  //   );

  //   if (differenceInSeconds < 60) {
  //     return "Just now";
  //   } else if (differenceInSeconds < 3600) {
  //     const minutes = Math.round(differenceInSeconds / 60);
  //     return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  //   } else if (differenceInSeconds < 86400) {
  //     const hours = Math.round(differenceInSeconds / 3600);
  //     return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  //   } else if (differenceInSeconds < 604800) {
  //     const days = Math.round(differenceInSeconds / 86400);
  //     return `${days} day${days === 1 ? "" : "s"} ago`;
  //   } else if (differenceInSeconds < 31536000) {
  //     const weeks = Math.round(differenceInSeconds / 604800);
  //     return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  //   } else {
  //     const years = Math.round(differenceInSeconds / 31536000);
  //     return `${years} year${years === 1 ? "" : "s"} ago`;
  //   }
  // };

  // const handleTimeUpdate = (video: HTMLVideoElement, index: number) => {
  //   const duration = video.duration;
  //   const currentTime = video.currentTime;
  //   const progressBar = document.querySelectorAll(".progress-bar")[index];

  //   if (progressBar) {
  //     const progressDiv = progressBar as HTMLDivElement;
  //     const percentage = (currentTime / duration) * 100;
  //     console.log("percentage: ", percentage);
  //     progressDiv.style.width = `${percentage}%`;
  //   }
  // };

  // useEffect(() => {
  //   if (hoveredVideo !== null && videoRefs.current[hoveredVideo]) {
  //     const videoElement = videoRefs.current[hoveredVideo];
  //     const progressBar = document.getElementById(
  //       `progressBar-${hoveredVideo}`
  //     );

  //     const handleTimeUpdate = (e: any) => {
  //       const { currentTime, duration } = e.target;
  //       const progressPercentage = (currentTime / duration) * 100;

  //       if (progressBar) {
  //         progressBar.style.width = `${progressPercentage}%`;
  //       }
  //     };

  //     videoElement.addEventListener("timeupdate", handleTimeUpdate);

  //     // Clean up the event listener when the component unmounts or video changes
  //     return () => {
  //       videoElement.removeEventListener("timeupdate", handleTimeUpdate);
  //     };
  //   }
  // }, [hoveredVideo]);

  // const handleLoadedMetadata = (index: any, e: any) => {
  //   const duration = e.target.duration;
  //   setVideoDurations((prev: any) => ({ ...prev, [index]: duration })); // Store the duration
  // };

  // const formatVideoDuration = (duration: any) => {
  //   const hours = Math.floor(duration / 3600);
  //   const minutes = Math.floor((duration % 3600) / 60);
  //   const seconds = Math.floor(duration % 60);

  //   const formattedDuration =
  //     (hours > 0 ? `${hours}:` : "") +
  //     `${minutes.toString().padStart(2, "0")}:` +
  //     `${seconds.toString().padStart(2, "0")}`;

  //   return formattedDuration;
  // };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = searchMeetingData.filter((item: any) => {
        // Convert both query and userAddress to lowercase for case-insensitive matching
        const lowercaseQuery = query.toLowerCase();
        const lowercaseAddress = item.host_address.toLowerCase();
        const lowercaseTitle = item.title.toLowerCase();

        // Check if the lowercase userAddress includes the lowercase query
        return (
          lowercaseAddress.includes(lowercaseQuery) ||
          lowercaseTitle.includes(lowercaseQuery)
        );
      });

      setMeetingData(filtered);
    } else {
      setMeetingData(searchMeetingData);
    }
  };

  const handleFilters = (params: string) => {
    if (params) {
      setActiveButton(params);
      const filtered = searchMeetingData.filter((item: any) => {
        return item.dao_name.includes(params);
      });

      setMeetingData(filtered);
    } else {
      setActiveButton("all");
      setMeetingData(searchMeetingData);
    }
  };

  
  return (
    <>
      <div className="pe-10">
        <div className="flex my-4 items-center gap-4 font-poppins">
          <div
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="flex border-[0.5px] border-black w-1/3 rounded-full"
          >
            <input
              type="text"
              placeholder="Search by title and host address"
              style={{ background: "rgba(238, 237, 237, 0.36)" }}
              className="pl-5 rounded-full outline-none w-full"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            ></input>
            <span className="flex items-center bg-black rounded-full px-5 py-2">
              <Image src={search} alt="search" width={20} />
            </span>
          </div>
          <div className="flex space-x-4">
            <button
              className={`border border-[#CCCCCC] px-6 py-1 rounded-lg text-lg ${
                activeButton === "all"
                  ? "bg-[#8E8E8E] text-white"
                  : "bg-[#F5F5F5] text-[#3E3D3D]"
              }`}
              onClick={() => handleFilters("")}
            >
              All
            </button>
            <button
              className={`border border-[#CCCCCC] px-4 py-1  rounded-lg text-lg flex items-center gap-1.5 ${
                activeButton === "optimism"
                  ? "bg-[#8E8E8E] text-white"
                  : "bg-[#F5F5F5] text-[#3E3D3D]"
              }`}
              onClick={() => handleFilters("optimism")}
            >
              <Image src={oplogo} alt="optimism" width={23} className="" />
              Optimism
            </button>
            <button
              className={`border border-[#CCCCCC] px-4 py-1 rounded-lg text-lg flex items-center gap-1.5 ${
                activeButton === "arbitrum"
                  ? "bg-[#8E8E8E] text-white"
                  : "bg-[#F5F5F5] text-[#3E3D3D]"
              }`}
              onClick={() => handleFilters("arbitrum")}
            >
              <Image src={arbcir} alt="arbitrum" width={23} className="" />
              Arbitrum
            </button>
          </div>
        </div>

        {isLoading ? (
          <RecordedSessionsSkeletonLoader/>
        ) :
         meetingData && meetingData.length > 0 ? (
         
          <RecordedSessionsTile meetingData={meetingData}/>
        ) : (
          <div className="flex flex-col justify-center items-center pt-10">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              Oops, no such result available!
            </div>
          </div>
        )}
      </div>
      <Toaster
        toastOptions={{
          style: {
            fontSize: "14px",
            backgroundColor: "#3E3D3D",
            color: "#fff",
            boxShadow: "none",
            borderRadius: "50px",
            padding: "3px 5px",
          },
        }}
      />
    </>
  );
}


export default RecordedSessions;  