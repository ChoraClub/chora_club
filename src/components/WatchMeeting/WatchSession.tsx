import React, { useState } from "react";
import user from "@/assets/images/daos/user3.png";
import view from "@/assets/images/daos/view.png";
import Image from "next/image";
import op from "@/assets/images/daos/op.png";
import time from "@/assets/images/daos/time.png";
import { PiFlagFill } from "react-icons/pi";
import { BiSolidShare } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";

interface Attendee {
  attendee_address: string;
  attendee_uid: string;
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
  meeting_status:
    | "active"
    | "inactive"
    | "ongoing"
    | "Recorded"
    | "Upcoming"
    | "Ongoing"; // Assuming meeting status can only be active or inactive
  session_type: string;
}

function WatchSession({
  data,
  collection,
}: {
  data: Meeting;
  collection: string;
}) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="space-y-5 font-poppins pb-10">
      <div>
        <video
          className="w-full h-full rounded-3xl bg-black cursor-pointer"
          src={data.video_uri}
          autoPlay
          controls
        />
      </div>
      <div className="rounded-3xl border border-[#CCCCCC] bg-[#F2F2F2]">
        <div className="px-6 pt-4 pb-4 border-b border-[#CCCCCC]">
          <div className="text-lg font-semibold pb-3">{data.title}</div>
          <div className="flex justify-between text-sm pe-6 pb-4">
            <div className="flex items-center gap-2 ">
              <div>
                <Image
                  src={user}
                  alt="image"
                  width={20}
                  className="rounded-full"
                />
              </div>
              <div className="text-[#292929] font-semibold">
                {data.host_address}
              </div>
              <Link
                href={
                  data.dao_name === "optimism" || "Optimism"
                    ? `https://optimism-sepolia.easscan.org/offchain/attestation/view/${data.uid_host}`
                    : data.dao_name === "arbitrum" || "Arbitrum"
                    ? `https://arbitrum.easscan.org/attestation/view/${data.uid_host}`
                    : ""
                }
                target="_blank"
              >
                <Image src={view} alt="image" width={15} />
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <Image src={op} alt="image" width={20} />
              <div className="text-[#292929] font-semibold capitalize">
                {data.dao_name}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Image src={time} alt="image" width={20} />
              <div className="text-[#1E1E1E]">15 hours ago</div>
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
              className="flex items-center border border-[#8E8E8E] w-fit rounded-md px-3 font-medium py-1 gap-2 cursor-pointer"
              onClick={() => setShowPopup(!showPopup)}
            >
              <div className="text-[#292929] text-sm">Attendee</div>
              <div>
                <IoMdArrowDropdown color="#4F4F4F" />
              </div>
            </div>
            {showPopup && (
              <div className="absolute bg-white border rounded-xl mt-1 py-2">
                {data.attendees.map((attendee, index) => (
                  <div key={index}>
                    <div className="flex items-center text-sm gap-3 px-6  py-[10px]">
                      <div>
                        <Image
                          src={user}
                          alt="image"
                          width={18}
                          className="rounded-full"
                        />
                      </div>
                      <div>{attendee.attendee_address}</div>
                      <Link
                        href={
                          data.dao_name === "optimism" || "Optimism"
                            ? `https://optimism-sepolia.easscan.org/offchain/attestation/view/${attendee.attendee_uid}`
                            : data.dao_name === "arbitrum" || "Arbitrum"
                            ? `https://arbitrum.easscan.org/attestation/view/${attendee.attendee_uid}`
                            : ""
                        }
                        target="_blank"
                      >
                        <Image src={view} alt="image" width={15} />
                      </Link>
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
