import React from 'react';
import Image, { StaticImageData } from "next/image";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { Tooltip } from "@nextui-org/react";

interface TileProps {
  tileIndex: number;
  data: {
    img: StaticImageData;
    title: string;
    dao: string;
    status: string;
    attendee: string;
    host: string;
    started: string;
    desc: string;
  };
  isEvent: string;
}

function EventTile({ tileIndex, data, isEvent }: TileProps) {
  return (
    <div
      key={tileIndex}
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

        {isEvent === "Book" ? (
          data.status === "Approved" ? (
            <div className="flex justify-end">
              <Tooltip
                content="Start Session"
                placement="top"
                closeDelay={1}
                showArrow
              >
                <span className="cursor-pointer">
                  <FaCirclePlay size={35} color="#004DFF" />
                </span>
              </Tooltip>
            </div>
          ) : data.status === "Pending" ? (
            <div className="flex justify-end gap-2">
              <Tooltip
                content="Approve"
                placement="top"
                closeDelay={1}
                showArrow
              >
                <span className="cursor-pointer">
                  <FaCircleCheck size={28} color="#4d7c0f" />
                </span>
              </Tooltip>

              <Tooltip
                content="Reject"
                placement="top"
                closeDelay={1}
                showArrow
              >
                <span className="cursor-pointer">
                  <FaCircleXmark size={28} color="#b91c1c" />
                </span>
              </Tooltip>
            </div>
          ) : null
        ) : isEvent === "Attending" ? (
          data.status === "Approved" && (
            <div className="text-center bg-blue-shade-100 rounded-full font-bold text-white py-2 text-xs cursor-pointer">
              Join
            </div>
          )
        ): ""}
      </div>
    </div>
  );
}

export default EventTile;
