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
import { CiSearch } from "react-icons/ci";

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
  const [openSearch, setOpenSearch] = useState(false);

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

      if (resultData.success) {
        setMeetingData(resultData.data);
        setSearchMeetingData(resultData.data);
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
        const lowercaseQuery = query.toLowerCase();
        const lowercaseAddress = item.host_address.toLowerCase();
        const lowercaseTitle = item.title.toLowerCase();

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

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (openSearch && !event.target.closest('.search-container')) {
        setOpenSearch(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openSearch]);


  return (
    <>
      <div className="">
        <div className="flex my-4 justify-end md:justify-start items-center gap-2 sm:gap-3 md:gap-4 font-poppins px-4 sm:px-0">
          {/* <div
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="hidden md:flex border-[0.5px] border-black w-1/3 rounded-full"
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
          </div> */}
          <div className={` hidden md:flex items-center rounded-full shadow-lg bg-gray-100 text-black cursor-pointer w-[365px]`}  >
              <CiSearch className={`text-base transition-all duration-700 ease-in-out ml-3`}/>
          <input
             type="text"
             placeholder="Search by title and host address"
             className="w-[100%] pl-2 pr-4 py-2 text-sm bg-transparent outline-none"
             value={searchQuery}
             onChange={(e) => handleSearchChange(e.target.value)}
             onClick={(e) => e.stopPropagation()}
           />
 </div>

          <div className=" md:hidden search-container relative">
          <div className={` md:hidden flex items-center rounded-full shadow-lg bg-gray-100 text-black cursor-pointer ${openSearch? 'w-full': 'w-7 h-7 justify-center'}`} onClick={()=>{setOpenSearch(!openSearch)}} >
              <CiSearch className={`text-base transition-all duration-700 ease-in-out ${
          openSearch ? 'ml-3' : ''
        }`}/>
            {openSearch && (
             <input
             type="text"
             placeholder="Search..."
             className="w-full pl-2 pr-4 py-1 sm:py-1.5 text-sm transition-all duration-700 ease-in-out bg-transparent outline-none"
             value={searchQuery}
             onChange={(e) => handleSearchChange(e.target.value)}
             onClick={(e) => e.stopPropagation()}
           />
            )}
            </div>
            </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <button
              className={` px-3 md:px-5 py-1 sm:py-1.5 rounded-lg text-sm lg:text-base ${
                activeButton === "all"
                  ? "bg-[#8E8E8E] text-white"
                  : "bg-[#F5F5F5] text-[#3E3D3D]"
              }`}
              onClick={() => handleFilters("")}
            >
              All
            </button>
            <button
              className={`flex items-center justify-center size-[26px] sm:size-[29px] md:size-[29px]`}
              onClick={() => handleFilters("optimism")}
            >
              <Image src={oplogo} alt="optimism" className={`size-full ${activeButton === "optimism" ? "opacity-100" : "opacity-50"}`} />
              {/* <span className="hidden md:inline ml-1.5">Optimism</span> */}
            </button>
            <button
              className={`flex items-center justify-center size-[26px] sm:size-[29px] md:size-[29px]`}
              onClick={() => handleFilters("arbitrum")}
            >
              <Image src={arbcir} alt="arbitrum" className={`size-full ${activeButton === "arbitrum" ? "opacity-100" : "opacity-50"}`} />
              {/* <span className="hidden md:inline ml-1.5">Arbitrum</span> */}
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
    </>
  );
}

export default RecordedSessions;
