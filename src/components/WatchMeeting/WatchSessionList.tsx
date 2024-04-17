import Image from "next/image";
import React from "react";
import thumbnail from "@/assets/images/daos/thumbnail1.png";
import op from "@/assets/images/daos/op.png";
import { Tooltip } from "@nextui-org/react";
import { IoCopy } from "react-icons/io5";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

function WatchSessionList() {
  const handleCopy = (addr: string) => {
    copy(addr);
    toast("Address Copied");
  };

  const block = [
    {
      image: thumbnail,
      title: "Building Resilient Communities: Governance in the Age of DAOs",
      dao: "optimism",
      period: "5 months ago",
      address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    },
    {
      image: thumbnail,
      title: "Navigating the Future: Optimism and the Rise of DAOs",
      dao: "optimism",
      period: "5 months ago",
      address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    },
    {
      image: thumbnail,
      title: "The Future of Governance: Exploring the Potential of DAOs",
      dao: "optimism",
      period: "5 months ago",
      address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    },
    {
      image: thumbnail,
      title: "Building Resilient Communities: Governance in the Age of DAOs",
      dao: "optimism",
      period: "5 months ago",
      address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    },
    {
      image: thumbnail,
      title: "Navigating the Future: Optimism and the Rise of DAOs",
      dao: "optimism",
      period: "5 months ago",
      address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    },
    {
      image: thumbnail,
      title: "The Future of Governance: Exploring the Potential of DAOs",
      dao: "optimism",
      period: "5 months ago",
      address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    },
    // {
    //   image: thumbnail,
    //   title: "Building Resilient Communities: Governance in the Age of DAOs",
    //   dao: "optimism",
    //   period: "5 months ago",
    //   address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    // },
    // {
    //   image: thumbnail,
    //   title: "Navigating the Future: Optimism and the Rise of DAOs",
    //   dao: "optimism",
    //   period: "5 months ago",
    //   address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    // },
    // {
    //   image: thumbnail,
    //   title: "The Future of Governance: Exploring the Potential of DAOs",
    //   dao: "optimism",
    //   period: "5 months ago",
    //   address: "0x3013bb4E03a7B81106D69C10710EaE148C8410E1",
    // },
  ];

  return (
    <div className="font-poppins pe-6 pb-4">
      {block.map((data) => (
        <div className="grid grid-cols-3 items-center gap-3 border border-[#D9D9D9] rounded-xl mb-3">
          <div className="h-28 grid-cols-1">
            <Image
              src={data.image}
              alt="image"
              width={220}
              className="rounded-xl object-cover h-full w-full"
            />
          </div>
          <div className="grid col-span-2">
            <div className="font-semibold text-sm">{data.title}</div>

            <div className="flex text-xs font-medium gap-3 py-1">
              <div className="bg-[#F5F5F5] flex items-center py-1 px-3 rounded-md gap-2">
                <div>
                  <Image src={op} alt="image" width={20} />
                </div>
                <div className="capitalize">{data.dao}</div>
              </div>
              <div className="bg-[#F5F5F5] py-1 px-3 rounded-md">
                {data.period}
              </div>
            </div>

            <div className="flex items-center gap-2 py-1 ps-3 text-xs">
              <div>
                <Image src={op} alt="image" width={20} />
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
  );
}

export default WatchSessionList;
