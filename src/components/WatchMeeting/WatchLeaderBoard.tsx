"use Client";
import React, { useState, useEffect } from "react";
import user1 from "@/assets/images/watchmeeting/user1.svg";
import user2 from "@/assets/images/watchmeeting/user2.svg";
import user3 from "@/assets/images/watchmeeting/user3.svg";
import user4 from "@/assets/images/watchmeeting/user4.svg";
import user5 from "@/assets/images/watchmeeting/user5.svg";
import emoji1 from "@/assets/images/watchmeeting/emoji1.svg";
import emoji2 from "@/assets/images/watchmeeting/emoji2.svg";
import emoji3 from "@/assets/images/watchmeeting/emoji3.svg";
import emoji4 from "@/assets/images/watchmeeting/emoji4.svg";
import emoji5 from "@/assets/images/watchmeeting/emoji5.svg";
import Image from "next/image";
import styles from "./WatchSession.module.css";
import { IoClose } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const WatchLeaderBoard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isBodyOverflowHidden, setIsBodyOverflowHidden] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(true);

  const leaderBoard = [
    {
      smallEmoji: emoji1,
      text: "Top #1",
      img: user1,
      name: "Viem",
      color: "#4773F0",
      bgColor: "#EAECFF",
    },
    {
      smallEmoji: emoji2,
      text: "Top #2",
      img: user2,
      name: "Jame",
      color: "#A573E5",
      bgColor: "#F2E8FF",
    },
    {
      smallEmoji: emoji3,
      text: "Top #3",
      img: user3,
      name: "Doe",
      color: "#1FA1FF",
      bgColor: "#EAF1FF",
    },
    {
      smallEmoji: emoji4,
      text: "First Collector",
      img: user4,
      name: "Joe",
      color: "#FF8A00",
      bgColor: "#FFF4EA",
    },
    {
      smallEmoji: emoji5,
      text: "Most Recent",
      img: user5,
      name: "Jane",
      color: "#FF8A00",
      bgColor: "#FFF4EA",
    },
    {
      smallEmoji: emoji1,
      text: "Top #6",
      img: user1,
      name: "Viem",
      color: "#4773F0",
      bgColor: "#EAECFF",
    },
    {
      smallEmoji: emoji1,
      text: "Top #7",
      img: user2,
      name: "Jame",
      color: "#A573E5",
      bgColor: "#F2E8FF",
    },
    {
      smallEmoji: emoji1,
      text: "Top #8",
      img: user3,
      name: "Doe",
      color: "#1FA1FF",
      bgColor: "#EAF1FF",
    },
    {
      smallEmoji: emoji1,
      text: "Top #9",
      img: user4,
      name: "Joe",
      color: "#FF8A00",
      bgColor: "#FFF4EA",
    },
    {
      smallEmoji: emoji1,
      text: "Top #10",
      img: user5,
      name: "Jane",
      color: "#FF8A00",
      bgColor: "#FFF4EA",
    },
  ];

  const handleViewAll = () => {
    setShowPopup(true);
    setIsBodyOverflowHidden(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setIsBodyOverflowHidden(false);
  };
  useEffect(() => {
    document.body.style.overflow = isBodyOverflowHidden ? "hidden" : "auto";
  }, [isBodyOverflowHidden]);

  return (
    <>
      <div className="font-poppins">
        {/* {showComingSoon && (
          <div className="flex items-center w-fit bg-yellow-100 border border-yellow-400 rounded-full px-2 ml-4 mb-3 py-1">
            <p className="text-sm text-yellow-700 mr-2">Coming Soon</p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="text-yellow-700 hover:text-yellow-800"
            >
              <RxCross2 size={12} />
            </button>
          </div>
        )} */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex">
            <p className="xl:text-base 1.7xl:text-lg font-medium text-blue-shade-100 ml-5">
              🏆LeaderBoard
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
          <div
            className="text-[10px] text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100 cursor-pointer hover:bg-blue-shade-600"
            onClick={handleViewAll}
          >
            View All
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {leaderBoard.slice(0, 5).map((data, index) => (
            <div
              key={index}
              className="grid grid-cols-7 py-3 bg-black-shade-300 rounded-xl items-center w-full"
            >
              <div className="flex items-center ml-4 col-span-3">
                <Image
                  src={data.smallEmoji}
                  alt=""
                  width={26}
                  height={26}
                  className="xl:mr-2 mr-1"
                />
                <div
                  className={`font-medium 1.7xl:text-sm text-xs`}
                  style={{ color: data.color }}
                >
                  {data.text}
                </div>
              </div>
              <div className="flex items-center col-span-2 -ml-2">
                <Image
                  src={data.img}
                  alt=""
                  width={39}
                  height={39}
                  className="xl:mr-2 mr-1 ml-3 xl:ml-0"
                />
                <p className="font-normal 1.7xl:text-base text-sm">{data.name}</p>
              </div>
              <div
                className={` border rounded-[9px] font-normal text-[13px] py-1 px-6 w-fit h-fit col-span-2 1.7xl:ml-8 ml-3 flex justify-center items-center`}
                style={{
                  backgroundColor: data.bgColor,
                  borderColor: data.color,
                  color: data.color,
                }}
              >
                3x
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* pop up */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50  overflow-hidden">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={handleClosePopup}
          ></div>
          <div className="p-7 border z-50 rounded-2xl w-[35vw] h-[80vh] bg-white flex flex-col gap-3">
            <div className="flex justify-between ">
              <p className="text-lg font-medium text-blue-shade-100 ml-5">
                🏆LeaderBoard
              </p>
              {/* <Image src={close} alt='' width={24} height={24} className='cursor-pointer' onClick={handleClosePopup}/> */}
              <div className="bg-black rounded-full size-6 p-px flex justify-center items-center">
                <IoClose
                  className="cursor-pointer w-6 h-6 text-white "
                  onClick={handleClosePopup}
                />
              </div>
            </div>
            <div className={`flex-grow overflow-y-auto ${styles.scrollbar}`}>
              {leaderBoard.map((data, index) => (
                <div
                  key={index}
                  className="flex py-3 bg-black-shade-300 rounded-xl items-center mb-2 mr-3"
                >
                  <div
                    className="basis-1/2 font-medium text-sm ml-7"
                    style={{ color: data.color }}
                  >
                    {data.text}
                  </div>
                  <div className="flex basis-1/2 justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Image
                        src={data.img}
                        alt=""
                        width={39}
                        height={39}
                        className=""
                      />
                      <p>{data.name}</p>
                    </div>
                    <div
                      className={` border rounded-[9px] font-normal text-[13px] py-1 px-6 w-fit h-fit col-span-2 mr-3 flex justify-center items-center`}
                      style={{
                        backgroundColor: data.bgColor,
                        borderColor: data.color,
                        color: data.color,
                      }}
                    >
                      3x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchLeaderBoard;
