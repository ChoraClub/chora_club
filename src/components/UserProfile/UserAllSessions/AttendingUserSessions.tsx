import React, { useState } from "react";
import text1 from "@/assets/images/daos/texture1.png";
import text2 from "@/assets/images/daos/texture2.png";
import Image from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";

function AttendingUserSessions() {
  const details = [
    {
      img: text1,
      title: "Optimism Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      status: "Approved",
      attendee: "olimpio.eth",
      host: "lindaxie.eth",
      started: "18/09/2023 03:15 PM EST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      status: "Pending",
      attendee: "olimpio.eth",
      host: "hexagon.eth",
      started: "20/09/2023 04:15 PM EST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
    {
      img: text2,
      title: "Open Forum: Governance, Applications, and Beyond",
      dao: "Optimism",
      status: "Rejected",
      attendee: "olimpio.eth",
      host: "hexagon.eth",
      started: "21/09/2023 03:15 PM EST",
      desc: "Join the conversation about the future of Optimism. Discuss governance proposals, dApp adoption, and technical developments.",
    },
  ];

  const [sessionDetails, setSessionDetails] = useState(details);

  return (
    <div className="space-y-6">
      {sessionDetails.length > 0 ? (
        sessionDetails.map((data, index) => (
          <div
            key={index}
            className="flex p-5 rounded-[2rem]"
            style={{ boxShadow: "0px 4px 26.7px 0px rgba(0, 0, 0, 0.10)" }}
          >
            <Image
              src={data.img}
              alt="image"
              className="w-44 h-44 rounded-3xl border border-[#D9D9D9]"
            />

            <div className="ps-6 pe-8 py-1">
              <div className="font-semibold text-blue-shade-200 text-lg">
                {data.title}
              </div>

              <div className="flex py-2">
                <div className="bg-[#1E1E1E] border border-[#1E1E1E] text-white rounded-md text-xs px-5 py-1 font-semibold">
                  {data.dao}
                </div>
              </div>

              <div className="pt-1 pe-10">
                <hr />
              </div>

              <div className="flex gap-x-16 text-sm py-3">
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Attendee:</span>{" "}
                  {data.attendee}
                </div>
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Host:</span> {data.host}
                </div>
                <div className="text-[#3E3D3D]">
                  <span className="font-semibold">Started at:</span>{" "}
                  {data.started}
                </div>
              </div>

              <div className="text-[#1E1E1E] text-sm">{data.desc}</div>
            </div>

            <div className={`flex flex-col justify-between text-xs py-2`}>
              <div
                className={`rounded-md px-3 py-1 ${
                  data.status === "Approved"
                    ? "border border-lime-600 text-lime-600"
                    : data.status === "Rejected"
                    ? "border border-red-600 text-red-600"
                    : "border border-yellow-500 text-yellow-500"
                }`}
              >
                {data.status}
              </div>

              {data.status === "Approved" ? (
                <div className="text-center bg-blue-shade-100 rounded-full font-bold text-white py-2 text-xs cursor-pointer">
                  Join
                </div>
                
              ) : (
                <></>
              )}
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
    </div>
  );
}

export default AttendingUserSessions;
