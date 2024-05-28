import React, { useState } from "react";
import Image from "next/image";
import video from "@/assets/images/daos/thumbnail1.png";
import emojiVideo from "@/assets/images/watchmeeting/emojiVideo.svg";
import copy from "@/assets/images/watchmeeting/copy.svg";
import op from "@/assets/images/daos/op.png";
import arb from "@/assets/images/daos/arbCir.png";
import { RxCross2 } from "react-icons/rx";

const WatchVideoRecommendation = () => {
  const [showComingSoon, setShowComingSoon] = useState(true);

  const videoRecommendations = [
    {
      img: video,
      title: "The Future of Governance: Exploring the Potential of DAOs",
      daoName: "Optimism",
      time: "3 days ago",
      emoji: emojiVideo,
      slotTime: "57:21",
      address: "0x186e505097bfa1f3cf45c2c9d7a79de6632c3cdc",
      logo: op,
    },
    {
      img: video,
      title: "Empowering Communities: The Role of Arbitrum in DAO Development",
      daoName: "Arbitrum",
      time: "7 days ago",
      emoji: emojiVideo,
      slotTime: "01:59:51",
      address: "0x186e505097bfa1f3cf45c2c9d7a79de6632c3cdc",
      logo: arb,
    },
    {
      img: video,
      title: "Optimism Open Forum: Governance, Applications, and Beyond",
      daoName: "Optimism",
      time: "1 month ago",
      emoji: emojiVideo,
      slotTime: "35:56",
      address: "0x186e505097bfa1f3cf45c2c9d7a79de6632c3cdc",
      logo: op,
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex">
          <p className="text-lg font-medium text-blue-shade-100">
            Video Recommendations
          </p>
          {showComingSoon && (
            <div className="flex items-center bg-yellow-100 border border-yellow-400 rounded-full px-2 ml-4">
              <p className="text-sm text-yellow-700 mr-2">Coming Soon</p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="text-yellow-700 hover:text-yellow-800"
              >
                <RxCross2 size={12} />
              </button>
            </div>
          )}
        </div>
        <div className="text-[10px] text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100">
          View All
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-4 font-poppins">
        {videoRecommendations.map((data, index) => (
          <div
            key={index}
            className="border border-black-shade-400 rounded-[30px] relative"
          >
            <div className="">
              <Image
                src={video}
                alt=""
                className="w-full h-40 object-cover rounded-t-[30px] "
              />
            </div>
            <div className=" text-white bg-black w-fit z-index-2 absolute top-[47%] right-2 py-0.5 px-1 rounded-sm opacity-75 text-[10px] font-normal">
              {data.slotTime}
            </div>
            <div className="my-4 mx-6 ">
              <p className="font-semibold text-[13px] text-black">
                {data.title}
              </p>
              <div className="flex gap-2 my-1">
                <div className="flex px-2 py-1 rounded-[5px] bg-black-shade-600 gap-1 w-fit font-medium text-[10px] items-center justify-center">
                  <Image src={data.logo} alt="" width={18} height={18} />
                  {data.daoName}
                </div>
                <div className="font-medium text-[10px] px-2 py-2 rounded-[5px] bg-black-shade-600 w-fit flex items-center justify-center">
                  {data.time}
                </div>
              </div>
              <div className="flex gap-1">
                <Image src={data.emoji} alt="" width={11} height={11} />
                <p className="text-black-shade-500 font-normal text-[8px]">
                  {data.address}
                </p>
                <Image src={copy} alt="" width={9} height={9} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchVideoRecommendation;
