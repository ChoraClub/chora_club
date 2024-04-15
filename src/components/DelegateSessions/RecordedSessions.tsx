import Image from "next/image";
import React, { useEffect, useState } from "react";
import search from "@/assets/images/daos/search.png";
import texture1 from "@/assets/images/daos/texture1.png";
import oplogo from "@/assets/images/daos/op.png";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";

function RecordedSessions() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const [displayIFrame, setDisplayIFrame] = useState<number | null>(null);

  const block = [
    {
      image: texture1,
      title: "Building Resilient Communities: Governance in the Age of DAOs",
      dao: "Optimism",
      period: "5 months ago",
      address: "0x4466B37DF22A4fb3c8e79c0272652508C6Ba3c11",
    },
    {
      image: texture1,
      title: "Building Resilient Communities: Governance in the Age of DAOs",
      dao: "Optimism",
      period: "5 months ago",
      address: "0x4466B37DF22A4fb3c8e79c0272652508C6Ba3c11",
    },
    {
      image: texture1,
      title: "Building Resilient Communities: Governance in the Age of DAOs",
      dao: "Optimism",
      period: "5 months ago",
      address: "0x4466B37DF22A4fb3c8e79c0272652508C6Ba3c11",
    },
    {
      image: texture1,
      title: "Building Resilient Communities: Governance in the Age of DAOs",
      dao: "Optimism",
      period: "5 months ago",
      address: "0x4466B37DF22A4fb3c8e79c0272652508C6Ba3c11",
    },
  ];

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

      <div className="grid min-[475px]:grid-cols- md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 py-8 font-poppins">
        {block.map((data, index) => (
          <div key={index} className="border border-[#D9D9D9] rounded-3xl">
            <div
              className="h-44"
              onMouseEnter={() => setDisplayIFrame(index)}
              onMouseLeave={() => setDisplayIFrame(null)}
            >
              {displayIFrame === index ? (
                <video
                  className="w-full h-full rounded-t-3xl bg-black"
                  src="https://huddle01.s3.amazonaws.com/recording/ucm-ecne-was/1712221020292.mp4"
                  autoPlay
                />
              ) : (
                <Image
                  src={data.image}
                  alt="image"
                  className="rounded-t-3xl object-cover h-full w-full object-center"
                />
              )}
            </div>
            <div className="px-4 py-2">
              <div className="font-semibold py-1">{data.title}</div>
              <div className="flex text-sm gap-3 py-1">
                <div className="bg-[#F5F5F5] flex items-center py-1 px-3 rounded-md gap-2">
                  <div>
                    <Image src={oplogo} alt="image" width={20} />
                  </div>
                  <div>{data.dao}</div>
                </div>
                <div className="bg-[#F5F5F5] py-1 px-3 rounded-md">
                  {data.period}
                </div>
              </div>
              <div className="flex items-center gap-2 py-1 ps-3">
                <div>
                  <Image src={oplogo} alt="image" width={20} />
                </div>
                <div>
                  {data.address.slice(0, 6)}...{data.address.slice(-4)}
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
    </div>
  );
}

export default RecordedSessions;
