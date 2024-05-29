import React, { useEffect, useRef, useState } from "react";
import user from "@/assets/images/daos/user3.png";
import view from "@/assets/images/daos/view.png";
import Image from "next/image";
import oplogo from "@/assets/images/daos/op.png";
import arblogo from "@/assets/images/daos/arbitrum.jpg";
import time from "@/assets/images/daos/time.png";
import { PiFlagFill } from "react-icons/pi";
import { BiSolidShare } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import VideoJS from "@/components/utils/VideoJs";
import videojs from "video.js";
import { parseISO } from "date-fns";
import ReportOptionModal from "./ReportOptionModal";
import { getEnsName } from "../ConnectWallet/ENSResolver";
import { useRouter } from "next-nprogress-bar";
import "./WatchSession.module.css";
import ShareMediaModal from './ShareMediaModal'

interface ProfileInfo {
  _id: string;
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
  emailId: string;
}
interface Attendee {
  attendee_address: string;
  attendee_uid: string;
  profileInfo: ProfileInfo;
}

interface HostProfileInfo {
  _id: string;
  address: string;
  image: string;
  description: string;
  daoName: string;
  isDelegate: boolean;
  displayName: string;
  socialHandles: {
    twitter: string;
    discord: string;
    discourse: string;
    github: string;
  };
  emailId: string;
}

interface Meeting {
  _id: string;
  slot_time: string;
  office_hours_slot: string; // Assuming this is a date-time string
  title: string;
  description: string;
  video_uri: string;
  meetingId: string;
  attendees: Attendee[];
  uid_host: string;
  dao_name: string;
  host_address: string;
  joined_status: string | null;
  booking_status: string;
  meeting_status:
    | "active"
    | "inactive"
    | "ongoing"
    | "Recorded"
    | "Upcoming"
    | "Ongoing"; // Assuming meeting status can only be active or inactive
  session_type: string;
  hostProfileInfo: HostProfileInfo;
}

function WatchSession({
  data,
  collection,
}: {
  data: Meeting;
  collection: string;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [ensHostName, setEnsHostName] = useState<string | null>(null);
  const [shareModal,setShareModal]=useState(false);
  const router = useRouter();

  const handleShareClose =()=>{
    setShareModal(false);
  }

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [data.description, isExpanded]);

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

  const handleModalClose = () => {
    console.log("Popup Closed");
    setModalOpen(false);
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const getLineCount = (text: string) => {
    const lines = text.split("\n");
    return lines.length;
  };

  // const getLineCount = (text: string) => {
  //   if (typeof text !== 'string') {
  //     return 0;
  //   }

  //   const lines = text.split('\n');
  //   let lineCount = 0;

  //   for (let line of lines) {
  //     line = line.trim();
  //     if (line.length > 0) {
  //       lineCount++;
  //     }
  //   }

  //   return lineCount;
  // };
  useEffect(() => {
    const fetchEnsName = async () => {
      const name = await getEnsName(data.host_address.toLowerCase());
      setEnsHostName(name);
    };

    fetchEnsName();
  }, [data.host_address]);

  return (
    <div className="">
      <div className="rounded-3xl border border-[#CCCCCC] bg-[#F2F2F2]">
        <div
          className={`px-6 pt-4 pb-4 ${
            data.description.length > 0 ? "border-b" : ""
          }  border-[#CCCCCC]`}
        >
          <div className="text-lg font-semibold pb-3">{data.title}</div>
          <div className="flex justify-between text-sm pe-4 pb-4">
            <div className="flex gap-6">
              <div className="flex items-center gap-2 ">
                <div>
                  <Image
                    src={
                      data.hostProfileInfo?.image
                        ? `https://gateway.lighthouse.storage/ipfs/${data.hostProfileInfo.image}`
                        : user
                    }
                    alt="image"
                    width={20}
                    height={20}
                    className="rounded-full"
                    priority
                  />
                </div>
                <div
                  className="text-[#292929] font-semibold"
                  // onClick={() => router.push(`${process.env.NEXTAUTH_URL}/${data.dao_name}/${data.host_address}?active=info`)}
                >
                  {ensHostName}
                </div>
                <Link
                  href={
                    data.dao_name === ("optimism" || "Optimism")
                      ? `https://optimism.easscan.org/offchain/attestation/view/${data.uid_host}`
                      : data.dao_name === ("arbitrum" || "Arbitrum")
                      ? `https://arbitrum.easscan.org/offchain/attestation/view/${data.uid_host}`
                      : ""
                  }
                  target="_blank"
                >
                  <Image src={view} alt="image" width={15} priority />
                </Link>
              </div>

              <div className="flex items-center gap-1">
                {data.dao_name === "optimism" ? (
                  <Image
                    src={oplogo}
                    alt="image"
                    width={20}
                    className="rounded-full"
                  />
                ) : data.dao_name === "arbitrum" ? (
                  <Image
                    src={arblogo}
                    alt="image"
                    width={20}
                    className="rounded-full"
                  />
                ) : (
                  ""
                )}
                <div className="text-[#292929] font-semibold capitalize">
                  {data.dao_name}
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-1">
                <Image src={time} alt="image" width={20} priority />
                <div className="text-[#1E1E1E]">
                  {formatTimeAgo(data.slot_time)}
                </div>
              </div>
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => setModalOpen(true)}
              >
                <div>
                  <PiFlagFill color="#FF0000" size={20} />
                </div>
                <div className="text-[#FF0000]">Report</div>
              </div>
              <div className="flex items-center gap-1 cursor-pointer" onClick={()=>setShareModal(true)}>
                <div className="scale-x-[-1]">
                  <BiSolidShare size={20} />
                </div>
                <div className="text-[#1E1E1E]">Share</div>
              </div>
            </div>
          </div>

          <div>
            <div
              className="flex items-center border border-[#8E8E8E] bg-white w-fit rounded-md px-3 font-medium py-1 gap-2 cursor-pointer"
              onClick={() => setShowPopup(!showPopup)}
            >
              <div className="text-[#292929] text-sm">Guest</div>
              <div
                className={
                  showPopup
                    ? "rotate-180 duration-200 ease-in-out"
                    : "duration-200 ease-in-out"
                }
              >
                <IoMdArrowDropdown color="#4F4F4F" />
              </div>
            </div>
            {showPopup && (
              <div
                className="absolute bg-white rounded-xl mt-1 py-2 duration-200 ease-in-out"
                style={{ boxShadow: "0px 4px 9.1px 0px rgba(0,0,0,0.04)" }}
              >
                {data.attendees.map((attendee, index) => (
                  <div key={index}>
                    <div className="flex items-center text-sm gap-3 px-6  py-[10px]">
                      <div>
                        <Image
                          src={
                            attendee.profileInfo?.image
                              ? `https://gateway.lighthouse.storage/ipfs/${attendee.profileInfo.image}`
                              : user
                          }
                          alt="image"
                          width={18}
                          height={18}
                          className="rounded-full"
                          priority
                        />
                      </div>
                      <div>
                        {attendee.attendee_address.slice(0, 8) +
                          "........." +
                          attendee.attendee_address.slice(-6)}{" "}
                      </div>
                      {attendee.attendee_uid ? (
                        <Link
                          href={
                            data.dao_name === ("optimism" || "Optimism")
                              ? `https://optimism.easscan.org/offchain/attestation/view/${attendee.attendee_uid}`
                              : data.dao_name === ("arbitrum" || "Arbitrum")
                              ? `https://arbitrum.easscan.org/offchain/attestation/view/${attendee.attendee_uid}`
                              : ""
                          }
                          target="_blank"
                        >
                          <Image src={view} alt="image" width={15} priority />
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                    {index !== data.attendees.length - 1 && (
                      <div className="border border-[#D9D9D9]"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* {data.description.length > 0 && (
        <div className={`px-6 pt-4 pb-4 rounded-b-3xl bg-white text-[#1E1E1E]`}>
          <>
          <div
            className={`${
              isExpanded ? "max-h-full" : "max-h-24 line-clamp-3"
            } transition-[max-height] duration-500 ease-in-out `}
      >
            {data.description}
          </div>
          {getLineCount(data.description) > 3 && (
          <button
            className="text-sm text-blue-shade-200 mt-2"
            onClick={toggleExpansion}
          >
            {isExpanded ? "View Less" : "View More"}
          </button>
          )}
          </>
        </div>
        )} */}

        {data.description.length > 0 && (
          <div
            className={`px-6 pt-4 pb-4 rounded-b-3xl bg-white text-[#1E1E1E]`}
          >
            <>
              <div
                ref={contentRef}
                className={`max-h-full transition-max-height duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-full" : "max-h-24 line-clamp-3"
                }`}
                style={{
                  maxHeight: isExpanded ? `${contentHeight}px` : "6rem",
                }}
              >
                <div className="overflow-hidden">{data.description}</div>
              </div>
              {getLineCount(data.description) > 3 && (
                <button
                  className="text-sm text-blue-shade-200 mt-2"
                  onClick={toggleExpansion}
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>
              )}
            </>
          </div>
        )}
      </div>
      {modalOpen && (
        <ReportOptionModal isOpen={modalOpen} onClose={handleModalClose} />
      )}

      {shareModal && (
        <ShareMediaModal isOpen={shareModal} onClose={handleShareClose}/>
      )}
    </div>
  );
}

export default WatchSession;
