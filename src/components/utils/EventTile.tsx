"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}
interface TileProps {
  tileIndex: number;
  data: {
    _id: string;
    img: StaticImageData;
    title: string;
    meetingId: string;
    dao_name: string;
    booking_status: string;
    user_address: string;
    host_address: string;
    slot_time: string;
    description: string;
  };
  isEvent: string;
}

const createRandomRoom = async () => {
  const res = await fetch("https://iriko.huddle01.media/api/v1/create-room", {
    method: "POST",
    body: JSON.stringify({
      title: "Test Room",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
    },
    cache: "no-store",
  });
  const data: RoomDetails = await res.json();
  const { roomId } = data.data;
  return roomId;
};

function EventTile({ tileIndex, data, isEvent }: TileProps) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isConfirmSlotLoading, setIsConfirmSlotLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsPageLoading(false);
    setIsConfirmSlotLoading(false);
  }, [data, isPageLoading]);

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const formatSlotTimeToLocal = (slotTime: any) => {
    const date = new Date(slotTime);
    return date.toLocaleString();
  };

  const confirmSlot = async (id: any, status: any) => {
    console.log("confirmSlot clicked");
    console.log("id:", id);
    console.log("status:", status);
    try {
      setIsConfirmSlotLoading(true);
      let roomId = null;
      let meeting_status = null;
      if (status === "Approved") {
        roomId = await createRandomRoom();
        meeting_status = "Upcoming";
      }
      if (status === "Rejected") {
        meeting_status = "Denied";
      }

      console.log(meeting_status);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = await JSON.stringify({
        id: id,
        meeting_status: meeting_status,
        booking_status: status,
        meetingId: roomId,
      });

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch(
        "/api/book-slot/update-slot/",
        requestOptions
      );
      const result = await response.json();
      if (result.success) {
        setTimeout(() => {
          toast(`You ${status} the booking.`);
          setIsConfirmSlotLoading(false);
          setIsPageLoading(false);
        }, 1000);
        console.log("status updated");
      }
    } catch (error) {
      setIsConfirmSlotLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <div
        key={tileIndex}
        className="flex justify-between p-5 rounded-[2rem]"
        style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
      >
        <div className="flex">
          <Image
            src={data.img || text1}
            alt="image"
            className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
          />

          <div className="ps-6 pe-8 py-1">
            <div className="font-semibold text-blue-shade-200 text-lg">
              {data.title}
            </div>

            <div className="flex py-2">
              <div className="capitalize bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold">
                {data.dao_name}
              </div>
            </div>

            <div className="pt-1 pe-10">
              <hr />
            </div>

            <div className="flex gap-x-16 text-sm py-3">
              <div className="text-[#3E3D3D]">
                <span className="font-semibold">Attendee:</span>{" "}
                {formatWalletAddress(data.user_address)}
              </div>
              <div className="text-[#3E3D3D]">
                <span className="font-semibold">Host:</span>{" "}
                {formatWalletAddress(data.host_address)}
              </div>
              <div className="text-[#3E3D3D]">
                <span className="font-semibold">Session Time:</span>{" "}
                {formatSlotTimeToLocal(data.slot_time)}
              </div>
            </div>

            <div className="text-[#1E1E1E] text-sm">{data.description}</div>
          </div>
        </div>

        <div className={`flex flex-col justify-between text-xs py-2`}>
          <div
            className={`rounded-md px-3 py-1 ${
              data.booking_status === "Approved"
                ? "border border-lime-600 text-lime-600"
                : data.booking_status === "Rejected"
                ? "border border-red-600 text-red-600"
                : "border border-yellow-500 text-yellow-500"
            }`}
          >
            {data.booking_status}
          </div>

          {isEvent === "Book" ? (
            data.booking_status === "Approved" ? (
              <div className="flex justify-end">
                <Tooltip
                  content="Start Session"
                  placement="top"
                  closeDelay={1}
                  showArrow
                >
                  <span className="cursor-pointer">
                    <FaCirclePlay
                      size={35}
                      color="#004DFF"
                      onClick={() =>
                        router.push(`/meeting/session/${data.meetingId}`)
                      }
                    />
                  </span>
                </Tooltip>
              </div>
            ) : data.booking_status === "Pending" ? (
              isConfirmSlotLoading ? (
                <div className="flex items-center justify-center">
                  <Oval
                    visible={true}
                    height="30"
                    width="30"
                    color="#0500FF"
                    secondaryColor="#cdccff"
                    ariaLabel="oval-loading"
                  />
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Tooltip
                    content="Approve"
                    placement="top"
                    closeDelay={1}
                    showArrow
                  >
                    <span className="cursor-pointer">
                      <FaCircleCheck
                        onClick={() => confirmSlot(data._id, "Approved")}
                        size={28}
                        color="#4d7c0f"
                      />
                    </span>
                  </Tooltip>

                  <Tooltip
                    content="Reject"
                    placement="top"
                    closeDelay={1}
                    showArrow
                  >
                    <span className="cursor-pointer">
                      <FaCircleXmark
                        onClick={() => confirmSlot(data._id, "Rejected")}
                        size={28}
                        color="#b91c1c"
                      />
                    </span>
                  </Tooltip>
                </div>
              )
            ) : null
          ) : isEvent === "Attending" ? (
            data.booking_status === "Approved" && (
              <div className="text-center bg-blue-shade-100 rounded-full font-bold text-white py-2 text-xs cursor-pointer">
                Join
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default EventTile;
