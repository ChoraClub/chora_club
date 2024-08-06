"use client";

import React, { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { Oval } from "react-loader-spinner";
// import { useRouter } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";

// import { getEnsName } from "../ConnectWallet/ENSResolver";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useAccount } from "wagmi";
interface RoomDetails {
  message: string;
  data: {
    roomId: string;
  };
}

type Attendee = {
  attendee_address: string;
  attendee_uid?: string; // Making attendee_uid optional
};

interface TileProps {
  tileIndex: number;
  data: {
    _id: string;
    img: StaticImageData;
    title: string;
    meetingId: string;
    dao_name: string;
    booking_status: string;
    meeting_status: string;
    joined_status: boolean;
    attendees: Attendee[];
    host_address: string;
    slot_time: string;
    description: string;
    session_type: string;
  };
  isEvent: string;
}

const createRandomRoom = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_CREATE_ROOM_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  // console.log("result", result);
  const roomId = await result.data;
  // console.log("roomId", roomId);
  return roomId;
};

function EventTile({ tileIndex, data, isEvent }: TileProps) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isConfirmSlotLoading, setIsConfirmSlotLoading] = useState(false);
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rejectionReason, setRejectionReason] = useState("");
  const { address } = useAccount();

  useEffect(() => {
    setIsPageLoading(false);
    // setIsConfirmSlotLoading(false);
  }, [data, isPageLoading]);

  const formatWalletAddress = (address: any) => {
    if (typeof address !== "string" || address.length <= 10) return address;
    return address.slice(0, 6) + "..." + address.slice(-4);
    // const ensName = getEnsName(address.toLowerCase());
    // return ensName;
  };

  const formatSlotTimeToLocal = (slotTime: any) => {
    const date = new Date(slotTime);
    return date.toLocaleString();
  };

  const confirmSlot = async (id: any, status: any) => {
    // console.log("confirm_Slot clicked");
    // console.log("id:", id);
    // console.log("status:", status);
    setStartLoading(true);
    try {
      setIsConfirmSlotLoading(true);
      let roomId = null;
      let meeting_status = null;
      // if (status === "Approved") {
      //   roomId = await createRandomRoom();
      //   meeting_status = "Upcoming";
      // }
      if (status === "Rejected") {
        meeting_status = "Denied";
      }

      // console.log(meeting_status);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = await JSON.stringify({
        id: id,
        meeting_status: meeting_status,
        booking_status: status,
        meetingId: roomId,
        rejectionReason: rejectionReason,
        title: data.title,
        slot_time: data.slot_time,
        dao_name: data.dao_name,
      });

      const requestOptions = await {
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
        toast(`You ${status} the booking.`);
        setStartLoading(false);
        setTimeout(() => {
          setIsPageLoading(false);
          setIsConfirmSlotLoading(false);
        }, 4000);
        console.log("status updated");
      }
    } catch (error) {
      // setIsConfirmSlotLoading(false);
      console.error(error);
    }
  };
  return (
    <>
      <div
        key={tileIndex}
        className="flex justify-between p-5 rounded-[2rem]"
        style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}>
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
              {data.session_type === "session" ? (
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Session - </span>{" "}
                  <span className="font-semibold">Guest:</span>{" "}
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
            }`}>
            {data.booking_status}
            {/* Approve */}
          </div>

          {isEvent === "Book" ? (
            data.booking_status === "Approved" ? (
              <div className="flex justify-between ">
                {startLoading || isConfirmSlotLoading ? (
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
                  <Tooltip
                    content="Start Session"
                    placement="top"
                    closeDelay={1}
                    showArrow>
                    <span className="cursor-pointer">
                      <FaCirclePlay
                        size={35}
                        color="#004DFF"
                        onClick={() => {
                          setStartLoading(true);
                          router.push(
                            `/meeting/session/${data.meetingId}/lobby`
                          );
                        }}
                      />
                    </span>
                  </Tooltip>
                )}
                <Tooltip
                  content="Reject Session"
                  placement="top"
                  closeDelay={1}
                  showArrow>
                  <span className="cursor-pointer">
                    <FaCircleXmark onClick={onOpen} size={35} color="#b91c1c" />
                  </span>
                </Tooltip>
                {isOpen && (
                  <div className="font-poppins z-[70] fixed inset-0 flex items-center justify-center backdrop-blur-md">
                    <div className="bg-white rounded-[41px] overflow-hidden shadow-lg w-1/2">
                      <div className="relative">
                        <div className="flex flex-col gap-1 text-white bg-[#292929] p-4 py-7">
                          <h2 className="text-lg font-semibold mx-4">
                            Reason for Rejection
                          </h2>
                        </div>
                        <div className="px-8 py-4">
                          <div className="mt-4">
                            <label className="block mb-2 font-semibold">
                              Rejection Reason:
                            </label>
                            <textarea
                              name="rejectionReason"
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                              placeholder="Give a reason for rejecting the session"
                              className="w-full px-4 py-2 border rounded-xl bg-[#D9D9D945]"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end px-8 py-4">
                          <button
                            className="bg-gray-300 text-gray-700 px-8 py-3 font-semibold rounded-full mr-4"
                            onClick={onClose}>
                            Cancel
                          </button>
                          <button
                            className="bg-red-500 text-white px-8 py-3 font-semibold rounded-full"
                            onClick={() => confirmSlot(data._id, "Rejected")}>
                            {startLoading ? (
                              <Oval
                                visible={true}
                                height="20"
                                width="20"
                                color="black"
                                secondaryColor="#cdccff"
                                ariaLabel="oval-loading"
                              />
                            ) : (
                              "Reject"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    showArrow>
                    <span className="cursor-pointer">
                      <FaCircleCheck
                        onClick={() => confirmSlot(data._id, "Approved")}
                        size={28}
                        color="#4d7c0f"
                      />
                    </span>
                  </Tooltip>
                </div>
              )
            ) : null
          ) : isEvent === "Attending" ? (
            data.booking_status === "Approved" && (
              <div
                onClick={() => {
                  setStartLoading(true);
                  router.push(`/meeting/session/${data.meetingId}/lobby`);
                }}
                className="text-center bg-blue-shade-100 rounded-full font-bold text-white py-2 text-xs cursor-pointer">
                {startLoading ? (
                  <div className="flex justify-center items-center">
                    <Oval
                      visible={true}
                      height="20"
                      width="20"
                      color="#fff"
                      secondaryColor="#cdccff"
                      ariaLabel="oval-loading"
                    />
                  </div>
                ) : (
                  "Join"
                )}
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
