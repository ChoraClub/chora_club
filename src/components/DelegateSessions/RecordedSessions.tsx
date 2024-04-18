import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import search from "@/assets/images/daos/search.png";
import texture1 from "@/assets/images/daos/texture1.png";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import styles from "./RecordedSessions.module.css";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/navigation";

function RecordedSessions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<any>([]);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const [displayIFrame, setDisplayIFrame] = useState<number | null>(null);

  // const [progress, setProgress] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const videoRef = useRef<any>(null);

  // const updateProgress = () => {
  //   const currentTime = videoRef.current.currentTime;
  //   const duration = videoRef.current.duration;
  //   const progress = (currentTime / duration) * 100;
  //   setProgress(progress);
  // };

  // useEffect(() => {
  //   const video = videoRef.current;

  //   // if (!video) return;

  //   const handleTimeUpdate = () => {
  //     updateProgress();
  //   };

  //   // Add event listeners for timeupdate and durationchange
  //   video.addEventListener("timeupdate", handleTimeUpdate);
  //   video.addEventListener("durationchange", () => {
  //     setDuration(video.duration);
  //   });

  //   // Remove event listeners on component unmount
  //   return () => {
  //     video.removeEventListener("timeupdate", handleTimeUpdate);
  //     video.removeEventListener("durationchange", () => {});
  //   };
  // }, [videoRef.current]);

  const router = useRouter();

  useEffect(() => {
    const getRecordedMeetings = async () => {
      try {
        const response = await fetch(`/api/get-meeting`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resultData = await response.json();
        // console.log("result data: ", resultData);

        if (Array.isArray(resultData.data)) {
          const filtered: any = resultData.data.filter((session: any) => {
            return session.meeting_status === "Recorded";
          });
          // console.log("filtered profile: ", filtered);
          setMeetingData(filtered);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("error in catch", error);
      }
    };
    getRecordedMeetings();
  }, []);

  useEffect(() => {}, [meetingData]);

  return (
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
              onClick={() => router.push(`/watch/${data.meetingId}`)}
            >
              <div
                className="h-44"
                onMouseEnter={() => setDisplayIFrame(index)}
                onMouseLeave={() => setDisplayIFrame(null)}
              >
                {/* {displayIFrame === index ? ( */}
                <div
                  className={`w-full h-full rounded-t-3xl bg-black object-cover object-center container ${styles.container}`}
                >
                  <video
                    autoPlay
                    src={data.video_uri}
                    // ref={videoRef}
                    // id="video"
                    className="w-full h-[172px] rounded-t-3xl duration-200 ease-in-out aspect-video"
                    preload="auto"
                  ></video>
                  <div className={`${styles.videoTimeline}`}>
                    <div className={`${styles.progressArea}`}>
                      <span>00:00</span>
                      <div className={`${styles.progressBar}`}></div>
                    </div>
                  </div>
                </div>
                {/* ) : (
                // <div className="w-full h-44 rounded-t-3xl bg-black duration-200 ease-in-out">
                //   <VideoJS
                //     options={videoJsOptions}
                //     onReady={handlePlayerReady}
                //   />
                // </div>
                // <div className="w-full h-44 rounded-t-3xl bg-black duration-200 ease-in-out">
                //   <VideoJS
                //     options={videoJsOptions}
                //     onReady={handlePlayerReady}
                //   />
                // </div>
                <Image
                  src={data.image}
                  alt="image"
                  className="rounded-t-3xl object-cover h-full w-full object-center duration-200 ease-in-out"
                />
              )} */}
              </div>
              <div className="px-4 py-2">
                <div className="font-semibold py-1">{data.title}</div>
                <div className="flex text-sm gap-3 py-1">
                  <div className="bg-[#F5F5F5] flex items-center py-1 px-3 rounded-md gap-2">
                    <div>
                      {data.dao_name === "optimism" ? (
                        <Image src={oplogo} alt="image" width={20} />
                      ) : data.dao_name === "arbitrum" ? (
                        <Image src={arblogo} alt="image" width={20} />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="capitalize">{data.dao_name}</div>
                  </div>
                  <div className="bg-[#F5F5F5] py-1 px-3 rounded-md">
                    data.period
                  </div>
                </div>
                <div className="flex items-center gap-2 py-1 ps-3 text-sm">
                  <div>
                    <Image src={oplogo} alt="image" width={20} />
                  </div>
                  <div>
                    {data.host_address.slice(0, 6)}...
                    {data.host_address.slice(-4)}
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
  );
}

export default RecordedSessions;
