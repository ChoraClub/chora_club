import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import search from "@/assets/images/daos/search.png";
import texture1 from "@/assets/images/daos/texture1.png";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import arbcir from "@/assets/images/daos/arbCir.png";
import toast, { Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import { useRouter } from "next-nprogress-bar";
import RecordedSessionsTile from "../ComponentUtils/RecordedSessionsTile";
import RecordedSessionsSkeletonLoader from "../SkeletonLoader/RecordedSessionsSkeletonLoader";
import ErrorDisplay from "../ComponentUtils/ErrorDisplay";
import { TimeoutError } from "viem";

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
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    getRecordedMeetings();
    window.location.reload();
  };

  const getRecordedMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/get-recorded-meetings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultData = await response.json();
      // console.log("result data: ", resultData);

      if (resultData.success) {
        console.log("result data: ", resultData.data);
        setMeetingData(resultData.data);
        setSearchMeetingData(resultData.data);
        // setIsLoading(false);
      } else {
        throw new Error(resultData.message || "Failed to fetch meeting data");
      }
    } catch (error) {
      console.log("error in catch", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError("Please check your internet connection and try again.");
      } else if (error instanceof TimeoutError) {
        setError(
          "The request is taking longer than expected. Please try again."
        );
      } else if (error instanceof SyntaxError) {
        setError(
          "We're having trouble processing the data. Please try again later."
        );
      } else {
        setError(
          "Unable to load recorded meetings. Please try again in a few moments."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecordedMeetings();
  }, []);

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

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

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
          <RecordedSessionsSkeletonLoader />
        ) : meetingData && meetingData.length > 0 ? (
          <RecordedSessionsTile meetingData={meetingData} />
        ) : (
          <div className="flex flex-col justify-center items-center pt-10">
            <div className="text-5xl">☹️</div>{" "}
            <div className="pt-4 font-semibold text-lg">
              {searchQuery
                ? `No search results found for "${searchQuery}"`
                : "Oops, no such result available!"}
            </div>
          </div>
        )}
      </div>
      {/* <Toaster
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
      /> */}
    </>
  );
}

export default RecordedSessions;
