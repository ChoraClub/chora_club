import React, { useState } from "react";
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

  return (
    <div className="">
      <div className="rounded-3xl border border-[#CCCCCC] bg-[#F2F2F2]">
        <div className="px-6 pt-4 pb-4 border-b border-[#CCCCCC]">
          <div className="text-lg font-semibold pb-3">{data.title}</div>
          <div className="flex justify-between text-sm pe-4 pb-4">
            <div className="flex items-center gap-2 ">
              <div>
                <Image
                  src={`https://gateway.lighthouse.storage/ipfs/${data.hostProfileInfo.image}`}
                  alt="image"
                  width={20}
                  height={20}
                  className="rounded-full"
                  priority
                />
              </div>
              <div className="text-[#292929] font-semibold">
                {data.host_address}
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
                <Image src={oplogo} alt="image" width={20} />
              ) : data.dao_name === "arbitrum" ? (
                <Image src={arblogo} alt="image" width={20} />
              ) : (
                ""
              )}
              <div className="text-[#292929] font-semibold capitalize">
                {data.dao_name}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Image src={time} alt="image" width={20} priority />
              <div className="text-[#1E1E1E]">
                {formatTimeAgo(data.slot_time)}
              </div>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <div>
                <PiFlagFill color="#FF0000" size={20} />
              </div>
              <div className="text-[#FF0000]">Report</div>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <div className="scale-x-[-1]">
                <BiSolidShare size={20} />
              </div>
              <div className="text-[#1E1E1E]">Share</div>
            </div>
          </div>

          <div>
            <div
              className="flex items-center border border-[#8E8E8E] bg-white w-fit rounded-md px-3 font-medium py-1 gap-2 cursor-pointer"
              onClick={() => setShowPopup(!showPopup)}
            >
              <div className="text-[#292929] text-sm">Attendee</div>
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
                            `https://gateway.lighthouse.storage/ipfs/${attendee.profileInfo.image}` ||
                            user
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

        <div className="px-6 pt-4 pb-4 rounded-b-3xl bg-white text-[#1E1E1E]">
          {data.description}
        </div>
      </div>
    </div>
  );
}

export default WatchSession;
