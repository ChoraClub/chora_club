import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import search from "@/assets/images/daos/search.png";
import texture1 from "@/assets/images/daos/texture1.png";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import user from "@/assets/images/daos/user3.png";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import styles from "./RecordedSessions.module.css";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
// const { parseISO } = require("date-fns");
import Head from "next/head";

function RecordedSessions() {
  // const parseISO = dateFns;
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<any>([]);
  const [karmaImage, setKarmaImage] = useState<any>();

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const [displayIFrame, setDisplayIFrame] = useState<number | null>(null);

  const router = useRouter();
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null); // Track which video is hovered
  const videoRefs = useRef<any>([]);
  const [videoDurations, setVideoDurations] = useState<any>({});

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
          // console.log("result data: ", resultData.data);
          setMeetingData(resultData.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("error in catch", error);
      }
    };
    getRecordedMeetings();
  }, [meetingData]);

  const formatTimeAgo = (utcTime: string): string => {
    const parsedTime = parseISO(utcTime);
    const currentTime = new Date();
    const differenceInSeconds = Math.abs(
      (parsedTime.getTime() - currentTime.getTime()) / 1000
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.round(differenceInSeconds / 60);
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.round(differenceInSeconds / 3600);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 604800) {
      const days = Math.round(differenceInSeconds / 86400);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    } else if (differenceInSeconds < 31536000) {
      const weeks = Math.round(differenceInSeconds / 604800);
      return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
    } else {
      const years = Math.round(differenceInSeconds / 31536000);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  };

  const handleTimeUpdate = (video: HTMLVideoElement, index: number) => {
    const duration = video.duration;
    const currentTime = video.currentTime;
    const progressBar = document.querySelectorAll(".progress-bar")[index];

    if (progressBar) {
      const progressDiv = progressBar as HTMLDivElement;
      const percentage = (currentTime / duration) * 100;
      console.log("percentage: ", percentage);
      progressDiv.style.width = `${percentage}%`;
    }
  };

  useEffect(() => {
    if (hoveredVideo !== null && videoRefs.current[hoveredVideo]) {
      const videoElement = videoRefs.current[hoveredVideo];
      const progressBar = document.getElementById(
        `progressBar-${hoveredVideo}`
      );

      const handleTimeUpdate = (e: any) => {
        const { currentTime, duration } = e.target;
        const progressPercentage = (currentTime / duration) * 100;

        if (progressBar) {
          progressBar.style.width = `${progressPercentage}%`;
        }
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      // Clean up the event listener when the component unmounts or video changes
      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [hoveredVideo]);

  const handleLoadedMetadata = (index: any, e: any) => {
    const duration = e.target.duration;
    setVideoDurations((prev: any) => ({ ...prev, [index]: duration })); // Store the duration
  };

  const formatVideoDuration = (duration: any) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const formattedDuration =
      (hours > 0 ? `${hours}:` : "") +
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}`;

    return formattedDuration;
  };

  return (
    <>
      <div className="pe-10">
        <div className="flex my-4 items-center gap-4 font-poppins">
          <div
            style={{ background: "rgba(238, 237, 237, 0.36)" }}
            className="flex border-[0.5px] border-black w-fit rounded-full"
          >
            <input
              type="text"
              placeholder="Search"
              style={{ background: "rgba(238, 237, 237, 0.36)" }}
              className="pl-5 rounded-full outline-none"
              value={searchQuery}
              // onChange={(e) => handleSearchChange(e.target.value)}
            ></input>
            <span className="flex items-center bg-black rounded-full px-5 py-2">
              <Image src={search} alt="search" width={20} />
            </span>
          </div>
          <div className="space-x-4">
            <button className="border border-[#CCCCCC] px-6 py-1 bg-[#8E8E8E] rounded-lg text-lg text-white">
              All
            </button>
            <button className="border border-[#CCCCCC] px-6 py-1 bg-[#F5F5F5] rounded-lg text-lg text-[#3E3D3D]">
              Optimism
            </button>
            <button className="border border-[#CCCCCC] px-6 py-1 bg-[#F5F5F5] rounded-lg text-lg text-[#3E3D3D]">
              Arbitrum
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center m-6">
            <Oval
              visible={true}
              height="40"
              width="40"
              color="#0500FF"
              secondaryColor="#cdccff"
              ariaLabel="oval-loading"
            />
          </div>
        ) : (
          <div className="grid min-[475px]:grid-cols- md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 py-8 font-poppins">
            {meetingData.map((data: any, index: number) => (
              <div
                key={index}
                className="border border-[#D9D9D9] rounded-3xl cursor-pointer"
                onClick={() => router.push(`/watch/${data.session.meetingId}`)}
                onMouseEnter={() => setHoveredVideo(index)}
                onMouseLeave={() => setHoveredVideo(null)}
              >
                <div
                  className={`w-full h-44 rounded-t-3xl bg-black object-cover object-center ${styles.container}`}
                >
                  {hoveredVideo === index ? (
                    <div className="relative">
                      <video
                        ref={(el: any) => (videoRefs.current[index] = el)}
                        autoPlay
                        loop
                        onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                        src={data.session.video_uri}
                        className="w-full h-44 rounded-t-3xl"
                      ></video>
                      <div className={styles.videoTimeline}>
                        <div className={styles.progressArea}>
                          <div
                            id={`progressBar-${index}`}
                            className={styles.progressBar}
                          ></div>
                        </div>
                        <div className="absolute right-1 bottom-3 text-white text-xs bg-white px-1 bg-opacity-30 rounded-sm">
                          {formatVideoDuration(videoDurations[index] || 0)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={texture1}
                      alt="video-thumbnail"
                      className="w-full h-44 rounded-t-3xl object-cover"
                    />
                  )}
                </div>
                <div className="px-4 py-2">
                  <div className="font-semibold py-1">{data.session.title}</div>
                  <div className="flex text-sm gap-3 py-1">
                    <div className="bg-[#F5F5F5] flex items-center py-1 px-3 rounded-md gap-2">
                      <div>
                        {data.session.dao_name === "optimism" ? (
                          <Image
                            src={oplogo}
                            alt="image"
                            width={20}
                            className="rounded-full"
                          />
                        ) : data.session.dao_name === "arbitrum" ? (
                          <Image
                            src={arblogo}
                            alt="image"
                            width={20}
                            className="rounded-full"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="capitalize">{data.session.dao_name}</div>
                    </div>
                    <div className="bg-[#F5F5F5] py-1 px-3 rounded-md">
                      {formatTimeAgo(data.session.slot_time)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-1 ps-3 text-sm">
                    <div>
                      <Image
                        src={
                          data.userInfo?.image
                            ? `https://gateway.lighthouse.storage/ipfs/${data.userInfo.image}`
                            : user
                        }
                        alt="image"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      {data.session.host_address.slice(0, 6)}...
                      {data.session.host_address.slice(-4)}
                    </div>
                    <div>
                      <Tooltip
                        content="Copy"
                        placement="right"
                        closeDelay={1}
                        showArrow
                      >
                        <span className="cursor-pointer text-sm">
                          <IoCopy
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCopy(data.address);
                            }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default RecordedSessions;
