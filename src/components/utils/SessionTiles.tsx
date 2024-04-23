import React, { useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Oval } from "react-loader-spinner";
import text2 from "@/assets/images/daos/texture2.png";
import IndividualSessionTileModal from "./IndividualSessionTileModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
};
// interface SessionTileProps {
//   tileIndex?: number;
//   data?: {
//     _id: string;
//     img: StaticImageData;
//     title: string;
//     meetingId: string;
//     dao_name: string;
//     booking_status: string;
//     meeting_status: boolean;
//     joined_status: boolean;
//     attendees: Attendee[];
//     host_address: string;
//     slot_time: string;
//     description: string;
//     session_type: string;
//   };
//   isEvent: string;
// }

// interface TileProps {
//   sessionDetails: any;
//   dataLoading: boolean;
//   isEvent: string;
//   isOfficeHour: boolean;
//   // query: string;
// }

interface SessionData {
  _id: string;
  img: StaticImageData;
  title: string;
  meetingId: string;
  dao_name: string;
  booking_status: string;
  meeting_status: boolean;
  joined_status: boolean;
  attendees: Attendee[];
  host_address: string;
  slot_time: string;
  description: string;
  session_type: string;
}

interface SessionTileProps {
  tileIndex?: number;
  isEvent: string;
  sessionDetails: SessionData[]; // Updated to include sessionDetails with proper type
  dataLoading: boolean;
  isOfficeHour: boolean;
}

// interface TileProps {
//   tileIndex?: number;
//   data?: {
//     _id: string;
//     img: StaticImageData;
//     title: string;
//     meetingId: string;
//     dao_name: string;
//     booking_status: string;
//     meeting_status: boolean;
//     joined_status: boolean;
//     attendees: Attendee[];
//     host_address: string;
//     slot_time: string;
//     description: string;
//     session_type: string;
//   };
//   isEvent: string;
//   sessionDetails: any;
//   dataLoading: boolean;
//   isOfficeHour: boolean;
//   // query: string;
// }

function SessionTile({
  sessionDetails,
  dataLoading,
  isEvent,
  isOfficeHour,
}: // query,
SessionTileProps) {
  const router = useRouter();
  const path = usePathname();
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(
    null
  );

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  };
  const formatSlotTimeToLocal = (slotTime: any) => {
    const date = new Date(slotTime);
    return date.toLocaleString();
  };

  const openModal = (index: number) => {
    setSelectedTileIndex(index);
  };

  const closeModal = () => {
    setSelectedTileIndex(null);
  };

  const [pageLoading, setPageLoading] = useState(true);

  return (
    <div className="space-y-6">
      {sessionDetails.length > 0 ? (
        sessionDetails.map((data: SessionData, index: any) => (
          <div
            key={index}
            className="flex p-5 rounded-[2rem] cursor-pointer"
            style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
            // onClick={() => openModal(index)}
            onClick={() => router.push(`/watch/${data.meetingId}`)}
          >
            <Image
              src={text2}
              alt="image"
              className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
            />

            <div className="ps-6 pe-12 py-1">
              <div className="font-semibold text-blue-shade-200 text-xl">
                {data.title}
              </div>

              <div className="flex space-x-4 py-2">
                <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold capitalize">
                  {data.dao_name}
                </div>
                {/* <div className="border border-[#1E1E1E] rounded-md text-[#1E1E1E] text-xs px-5 py-1 font-medium">
                    {data.participant} Participants
                  </div> */}
              </div>

              <div className="pt-2 pe-10">
                <hr />
              </div>

              <div className="flex gap-x-16 text-sm py-3">
                {data.session_type === "session" ? (
                  <div className="text-[#3E3D3D]">
                    <span className="font-semibold">Session - </span>{" "}
                    <span className="font-semibold">Attendee:</span>{" "}
                    {formatWalletAddress(data.attendees[0].attendee_address)}
                  </div>
                ) : (
                  <div className="text-[#3E3D3D]">
                    <span className="font-semibold">Instant Meet</span>{" "}
                  </div>
                )}
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Host:</span>{" "}
                  {formatWalletAddress(data.host_address)}
                </div>
                <div className="text-[#3E3D3D]">
                  {isEvent === "Upcoming" ? (
                    <span className="font-semibold">Starts at: </span>
                  ) : isEvent === "Recorded" ? (
                    <span className="font-semibold">Started at: </span>
                  ) : null}
                  {formatSlotTimeToLocal(data.slot_time)}
                </div>
              </div>

              <div className="text-[#1E1E1E] text-sm">{data.description}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center">
          <div className="text-5xl">☹️</div>{" "}
          <div className="pt-4 font-semibold text-lg">
            Oops, no such result available!
          </div>
        </div>
      )}

      {/* {selectedTileIndex !== null && isEvent === "Recorded" ? (
        <IndividualSessionTileModal
          title={sessionDetails[selectedTileIndex].title}
          description={sessionDetails[selectedTileIndex].description}
          videoUrl={sessionDetails[selectedTileIndex].videoUrl || ""}
          date={sessionDetails[selectedTileIndex].slot_time}
          host={sessionDetails[selectedTileIndex].host_address}
          attendees={sessionDetails[selectedTileIndex].attendees}
          dao={sessionDetails[selectedTileIndex].dao_name}
          host_attestation={sessionDetails[selectedTileIndex].uid_host}
          // attendee_attestation={sessionDetails[selectedTileIndex].uid_attendee}
          onClose={closeModal}
        />
      ) : null} */}
    </div>
  );
}

export default SessionTile;
