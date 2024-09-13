import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import styles from "./RecordedSessionsTile.module.css";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import Image, { StaticImageData } from "next/image";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";
import user1 from "@/assets/images/user/user1.svg";
import user2 from "@/assets/images/user/user2.svg";
import posterImage from "@/assets/images/daos/thumbnail1.png";
import { getEnsName } from "@/utils/ENSUtils";
import logo from "@/assets/images/daos/CCLogo.png";
import ClaimButton from "./ClaimButton";
import EditButton from "./EditButton";
import { useAccount } from "wagmi";
import Link from "next/link";
import { LuDot } from "react-icons/lu";
import { BiLinkExternal } from "react-icons/bi";
import buttonStyles from "./Button.module.css";

interface meeting {
  meetingData: any;
  showClaimButton?: boolean;
  session?: string;
  gridCols?: string;
}

type DaoName = "optimism" | "arbitrum";
const daoLogos: Record<DaoName, StaticImageData> = {
  optimism: oplogo,
  arbitrum: arblogo,
};
const getDaoLogo = (daoName: string): StaticImageData => {
  const normalizedName = daoName.toLowerCase() as DaoName;
  return daoLogos[normalizedName] || arblogo;
};

function RecordedSessionsTile({
  meetingData,
  showClaimButton,
  session,
  gridCols = "2xl:grid-cols-4",
}: meeting) {
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const videoRefs = useRef<any>([]);
  const [videoDurations, setVideoDurations] = useState<any>({});
  const router = useRouter();
  const { address } = useAccount();
  // const address = "0xc622420AD9dE8E595694413F24731Dd877eb84E1";
  const [ensHostNames, setEnsHostNames] = useState<any>({});
  const [ensGuestNames, setEnsGuestNames] = useState<any>({});
  const [loadingHostNames, setLoadingHostNames] = useState<boolean>(true);
  const [loadingGuestNames, setLoadingGuestNames] = useState<boolean>(true);
  const [updatedSessionDetails, setUpdatedSessionDetails] = useState<any[]>([]);

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };
  function formatViews(views: number): string {
    // Handle negative numbers or NaN
    if (isNaN(views) || views < 0) {
      return "0";
    }

    // For millions (e.g., 1.25M)
    if (views >= 1000000) {
      const millionViews = views / 1000000;
      return (
        millionViews.toFixed(millionViews >= 10 ? 0 : 1).replace(/\.0$/, "") +
        "M"
      );
    }
    // For thousands (e.g., 1.2k, 12k)
    if (views >= 1000) {
      const thousandViews = views / 1000;
      return (
        thousandViews.toFixed(thousandViews >= 10 ? 0 : 1).replace(/\.0$/, "") +
        "k"
      );
    }
    // For less than 1000 views, return as is
    return Math.floor(views).toString();
  }

  const formatTimeAgo = (utcTime: string): string => {
    const parsedTime = new Date(utcTime);
    const currentTime = new Date();
    const differenceInSeconds = Math.abs(
      (currentTime.getTime() - parsedTime.getTime()) / 1000
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

  const daoLogos = {
    optimism: oplogo,
    arbitrum: arblogo,
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

  useEffect(() => {
    const fetchEnsNames = async () => {
      const ensNamesMap: any = {};
      for (const data of meetingData) {
        const ensNames = await getEnsName(data.host_address.toLowerCase());
        const ensName = ensNames?.ensNameOrAddress;
        if (ensName) {
          ensNamesMap[data.host_address] = ensName;
        }
      }
      setEnsHostNames(ensNamesMap);
      setLoadingHostNames(false);
    };

    if (meetingData.length > 0) {
      fetchEnsNames();
    }
  }, [meetingData]);

  useEffect(() => {
    const fetchEnsNames = async () => {
      const ensNamesMap: any = {};
      for (const data of meetingData) {
        const ensNames = await getEnsName(
          data.attendees[0]?.attendee_address.toLowerCase()
        );
        const ensName = ensNames?.ensNameOrAddress;
        if (ensName) {
          ensNamesMap[data.attendees[0]?.attendee_address] = ensName;
        }
      }
      setEnsGuestNames(ensNamesMap);
      setLoadingGuestNames(false);
    };

    if (meetingData.length > 0) {
      fetchEnsNames();
    }
  }, [meetingData]);

  const updateSessionData = (updatedData: any, index: number) => {
    setUpdatedSessionDetails((prevDetails) => {
      const newDetails = [...prevDetails];
      newDetails[index] = updatedData;
      return newDetails;
    });
  };

  return (
    <>
      <div
        className={`grid min-[475px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} sm:gap-10 py-8 font-poppins`}
      >
        {meetingData.map((data: any, index: number) => (
          <div
            key={index}
            className="border border-[#D9D9D9] sm:rounded-3xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(`/watch/${data.meetingId}`);
            }}
            onMouseEnter={() => setHoveredVideo(index)}
            onMouseLeave={() => setHoveredVideo(null)}
          >
            <div
              className={`w-full h-44 sm:rounded-t-3xl bg-black object-cover object-center relative `}
            >
              {hoveredVideo === index ? (
                <div className="relative">
                  <video
                    ref={(el: any) => (videoRefs.current[index] = el)}
                    autoPlay
                    loop
                    muted
                    onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                    src={data.video_uri}
                    className="w-full h-44 rounded-t-3xl object-cover"
                  ></video>
                  <div className={styles.videoTimeline}>
                    <div className={styles.progressArea}>
                      <div
                        id={`progressBar-${index}`}
                        className={styles.progressBar}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  poster={`https://gateway.lighthouse.storage/ipfs/${
                    updatedSessionDetails[index]?.thumbnail_image
                      ? updatedSessionDetails[index].thumbnail_image
                      : data.thumbnail_image
                  }`}
                  ref={(el: any) => (videoRefs.current[index] = el)}
                  loop
                  muted
                  onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                  src={data.video_uri}
                  className="w-full h-44 rounded-t-3xl object-cover"
                ></video>
              )}
              <div className="absolute right-2 bottom-2 text-white text-xs bg-white px-1 bg-opacity-30 rounded-sm">
                {formatVideoDuration(videoDurations[index] || 0)}
              </div>
              <div className="absolute top-2 right-2 bg-black rounded-full">
                <Image src={logo} alt="image" width={24} />
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="px-4 pb-2 sm:py-2">
                <div
                  className={`text-sm sm:text-base font-semibold py-1 ${styles.truncate}`}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                >
                  {updatedSessionDetails[index]?.title || data.title}
                </div>
                <div className="flex items-center text-sm gap-0.5 sm:gap-1 py-1">
                  <div className=" flex items-center ">
                    <div>
                      <Image
                        src={getDaoLogo(data.dao_name)}
                        alt="image"
                        width={20}
                        height={20}
                        className="rounded-full size-4 sm:size-6"
                      />
                    </div>
                    {/* <div className="capitalize">
                      
                    </div> */}
                    {/* <div className="capitalize hidden sm:flex">{data.dao_name}</div> */}
                  </div>
                  <LuDot />
                  <div className="text-xs sm:text-sm capitalize">
                    {formatViews(data?.views ?? 0)} views
                  </div>
                  <LuDot />
                  <div className=" text-xs sm:text-sm">
                    {formatTimeAgo(data.slot_time)}
                  </div>
                </div>
                <div className="">
                  <div className="flex items-center gap-2 py-1  text-xs sm:text-sm">
                    <div>
                      <Image
                        src={
                          data.hostInfo?.image
                            ? `https://gateway.lighthouse.storage/ipfs/${data.hostInfo.image}`
                            : user1
                        }
                        alt="image"
                        width={20}
                        height={20}
                        className="rounded-full size-4 sm:size-5"
                      />
                    </div>
                    <div>
                      <span className="font-medium">Host: </span>
                      <Link
                        href={`/${data.dao_name}/${data.host_address}?active=info`}
                        onClick={(event: any) => {
                          event.stopPropagation();
                        }}
                        className="cursor-pointer hover:text-blue-shade-200 ml-1"
                      >
                        {loadingHostNames
                          ? data.host_address.slice(0, 4) +
                            "..." +
                            data.host_address.slice(-4)
                          : ensHostNames[data.host_address]}
                      </Link>
                    </div>
                    <div>
                      <Tooltip
                        content="Copy"
                        placement="right"
                        closeDelay={1}
                        showArrow
                      >
                        <span className="cursor-pointer text-xs sm:text-sm">
                          <IoCopy
                            onClick={(event) => {
                              event.stopPropagation();
                              handleCopy(data.host_address);
                            }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                  {data.attendees[0]?.attendee_address ? (
                    <div className="hidden sm:flex items-center gap-2 py-1 text-sm">
                      <div className="">
                        <Image
                          src={
                            data.guestInfo?.image
                              ? `https://gateway.lighthouse.storage/ipfs/${data.attendees[0]?.guestInfo.image}`
                              : user2
                          }
                          alt="image"
                          width={20}
                          height={20}
                          className="h-5 w-5 rounded-full object-cover object-center"
                        />
                      </div>
                      <div className="">
                        <span className="font-medium">Guest: </span>
                        <span>
                          {loadingGuestNames
                            ? data.attendees[0]?.attendee_address.slice(0, 4) +
                              "..." +
                              data.attendees[0]?.attendee_address.slice(-4)
                            : ensGuestNames[
                                data.attendees[0]?.attendee_address
                              ]}
                        </span>
                      </div>
                      <div className="">
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
                                handleCopy(data.attendees[0]?.attendee_address);
                              }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="px-4 pb-2 flex justify-center space-x-2">
                {session === "hosted" && data.uid_host && (
                  <div className="flex gap-2 w-full">
                    <Link
                      href={
                        data.uid_host
                          ? data.dao_name === ("optimism" || "Optimism")
                            ? `https://optimism.easscan.org/offchain/attestation/view/${data.uid_host}`
                            : data.dao_name === ("arbitrum" || "Arbitrum")
                            ? `https://arbitrum.easscan.org/offchain/attestation/view/${data.uid_host}`
                            : ""
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={`${buttonStyles.button} w-full gap-1`}
                    >
                      Offchain{" "}
                      <BiLinkExternal
                        size={20}
                        className="text-white hover:text-blue-600 transition-colors duration-200"
                        title="Open link in new tab"
                      />
                    </Link>
                    <ClaimButton
                      meetingId={data.meetingId}
                      meetingType={data.session_type === "session" ? 2 : 1}
                      startTime={data.attestations[0]?.startTime}
                      endTime={data.attestations[0]?.endTime}
                      dao={data.dao_name}
                      address={address || ""}
                      onChainId={
                        session === "hosted" ? data.onchain_host_uid : ""
                      }
                    />
                  </div>
                )}
                {session === "attended" &&
                  data.attendees.some(
                    (attendee: any) =>
                      attendee.attendee_address === address &&
                      attendee.attendee_uid
                  ) && (
                    <div className="flex gap-2 w-full">
                      {(() => {
                        const matchingAttendee = data.attendees.find(
                          (attendee: any) =>
                            attendee.attendee_address === address
                        );
                        const attendeeUid = matchingAttendee?.attendee_uid;

                        let href = "#";
                        if (attendeeUid) {
                          if (data.dao_name.toLowerCase() === "optimism") {
                            href = `https://optimism.easscan.org/offchain/attestation/view/${attendeeUid}`;
                          } else if (
                            data.dao_name.toLowerCase() === "arbitrum"
                          ) {
                            href = `https://arbitrum.easscan.org/offchain/attestation/view/${attendeeUid}`;
                          }
                        }

                        return (
                          <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className={`${buttonStyles.button} w-full gap-1`}
                          >
                            Offchain{" "}
                            <BiLinkExternal
                              size={20}
                              className="text-white hover:text-blue-600 transition-colors duration-200"
                              title="Open link in new tab"
                            />
                          </Link>
                        );
                      })()}
                      <ClaimButton
                        meetingId={data.meetingId}
                        meetingType={data.session_type === "session" ? 2 : 1}
                        startTime={data.attestations[0]?.startTime}
                        endTime={data.attestations[0]?.endTime}
                        dao={data.dao_name}
                        address={address || ""}
                        onChainId={
                          session === "attended"
                            ? data.attendees.find(
                                (attendee: any) =>
                                  attendee.attendee_address === address
                              )?.onchain_attendee_uid
                            : ""
                        }
                      />
                    </div>
                  )}
                {session === "hosted" && (
                  <div
                    className={`flex justify-end ${
                      data.uid_host ? "" : "w-full"
                    } `}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <EditButton
                      sessionData={data}
                      updateSessionData={updateSessionData}
                      index={index}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default RecordedSessionsTile;
