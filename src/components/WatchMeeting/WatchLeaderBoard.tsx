"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import styles from "./WatchSession.module.css";

// Import SVG assets
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

// Import types
import { Holder } from "@/types/LeaderBoardTypes";
import { UserProfileInterface } from "@/types/UserProfileTypes";
import { DynamicAttendeeInterface, SessionInterface } from "@/types/MeetingTypes";

// Define interfaces
interface Attendee extends DynamicAttendeeInterface {
  profileInfo: UserProfileInterface;
}

interface Meeting extends SessionInterface {
  attendees: Attendee[];
  hostProfileInfo: UserProfileInterface;
}

interface LeaderBoardEntry {
  smallEmoji: string;
  text: string;
  img: string;
  name?: string;
  color: string;
  bgColor: string;
  balance?: number;
}

// Main component
const WatchLeaderBoard = ({
  leaderBoardData,
  data,
  collection,
}: {
  leaderBoardData: Holder;
  data: Meeting;
  collection: string;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isBodyOverflowHidden, setIsBodyOverflowHidden] = useState(false);
  const [topEntries, setTopEntries] = useState<LeaderBoardEntry[]>([]);
  const [specialEntries, setSpecialEntries] = useState<LeaderBoardEntry[]>([]);
  const [allEntries, setAllEntries] = useState<LeaderBoardEntry[]>([]);

  useEffect(() => {
    if (leaderBoardData) {
      const top = leaderBoardData.TopTen?.slice(0, 3).map((holder: any, index: number) => ({
        smallEmoji: [emoji1, emoji2, emoji3][index],
        text: `Top #${index + 1}`,
        img: [user1, user2, user3][index],
        name: holder.user ? `${holder.user.slice(0, 6)}...${holder.user.slice(-4)}` : '',
        color: ['#4773F0', '#A573E5', '#1FA1FF'][index],
        bgColor: ['#EAECFF', '#F2E8FF', '#EAF1FF'][index],
        balance: holder.balance
      })) || [];

      const special = [
        leaderBoardData.firstCollector && {
          smallEmoji: emoji4,
          text: 'First Collector',
          img: user4,
          name: leaderBoardData.firstCollector.user 
            ? `${leaderBoardData.firstCollector.user.slice(0, 6)}...${leaderBoardData.firstCollector.user.slice(-4)}`
            : '',
          color: '#FF8A00',
          bgColor: '#FFF4EA',
          balance: leaderBoardData.firstCollector.balance
        },
        leaderBoardData.latestCollector && {
          smallEmoji: emoji5,
          text: 'Latest Collector',
          img: user5,
          name: leaderBoardData.latestCollector.user 
            ? `${leaderBoardData.latestCollector.user.slice(0, 6)}...${leaderBoardData.latestCollector.user.slice(-4)}`
            : '',
          color: '#FF8A00',
          bgColor: '#FFF4EA',
          balance: leaderBoardData.latestCollector.balance
        }
      ].filter(Boolean);

      setTopEntries(top);
      setSpecialEntries(special);

      // Prepare all entries for the popup
      const all = [
        ...(leaderBoardData.TopTen?.map((holder: any, index: number) => ({
          smallEmoji: [emoji1, emoji2, emoji3, emoji4, emoji5][index % 5],
          text: index < 3 ? `Top #${index + 1}` : `#${index + 1}`,
          img: [user1, user2, user3, user4, user5][index % 5],
          name: holder.user ? `${holder.user.slice(0, 6)}...${holder.user.slice(-4)}` : '',
          color: ['#4773F0', '#A573E5', '#1FA1FF', '#FF8A00', '#FF8A00'][index % 5],
          bgColor: ['#EAECFF', '#F2E8FF', '#EAF1FF', '#FFF4EA', '#FFF4EA'][index % 5],
          balance: holder.balance
        })) || []),
        ...special
      ];
      setAllEntries(all);
    }
  }, [leaderBoardData]);

  useEffect(() => {
    document.body.style.overflow = isBodyOverflowHidden ? "hidden" : "auto";
  }, [isBodyOverflowHidden]);

  const handleViewAll = () => {
    setShowPopup(true);
    setIsBodyOverflowHidden(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setIsBodyOverflowHidden(false);
  };

  const renderLeaderBoardEntry = (entry: LeaderBoardEntry) => (
    <div className="grid grid-cols-7 py-3 bg-black-shade-300 rounded-xl items-center w-full">
      <div className="flex items-center ml-4 col-span-3">
        <Image
          src={entry.smallEmoji}
          alt=""
          width={26}
          height={26}
          className="xl:mr-2 mr-1"
        />
        <div
          className={`font-medium 1.7xl:text-sm text-xs`}
          style={{ color: entry.color }}
        >
          {entry.text}
        </div>
      </div>
      <div className="flex items-center col-span-2 -ml-2">
        <Image
          src={entry.img}
          alt=""
          width={39}
          height={39}
          className="xl:mr-2 mr-1 ml-3 xl:ml-0"
        />
        <p className="font-normal 1.7xl:text-base text-sm">{entry.name}</p>
      </div>
      <div
        className={`border rounded-[9px] font-normal text-[13px] py-1 px-6 w-fit h-fit col-span-2 1.7xl:ml-8 ml-3 flex justify-center items-center`}
        style={{
          backgroundColor: entry.bgColor,
          borderColor: entry.color,
          color: entry.color,
        }}
      >
        {entry.balance}x  
      </div>
    </div>
  );

  return (
    <>
      <div className="font-poppins">
        <div className="flex justify-between items-center mb-5">
          <div className="flex">
            <p className="xl:text-base 1.7xl:text-lg font-medium text-blue-shade-100 ml-5">
              🏆LeaderBoard
            </p>
          </div>
          {topEntries.length === 0 && specialEntries.length === 0 ?(<></>):(
            <div
            className="text-[10px] text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100 cursor-pointer hover:bg-blue-shade-600"
            onClick={handleViewAll}
          >
            View All
          </div>
          )}         
        </div>
        <div className="flex flex-col gap-2">
          {topEntries.length === 0 && specialEntries.length === 0 ? (
            <div className="py-3 bg-gray-200 rounded-xl items-center w-full text-center text-gray-500 font-medium">
              Not minted yet
            </div>
          ) : (
            <>
              {topEntries.map((entry, index) => (
                <React.Fragment key={`top-${index}`}>
                  {renderLeaderBoardEntry(entry)}
                </React.Fragment>
              ))}
              {specialEntries.map((entry, index) => (
                <React.Fragment key={`special-${index}`}>
                  {renderLeaderBoardEntry(entry)}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={handleClosePopup}
          ></div>
          <div className="p-7 border z-50 rounded-2xl w-[35vw] h-[80vh] bg-white flex flex-col gap-3">
            <div className="flex justify-between ">
              <p className="text-lg font-medium text-blue-shade-100 ml-5">
                🏆LeaderBoard
              </p>
              <div className="bg-black rounded-full size-6 p-px flex justify-center items-center">
                <IoClose
                  className="cursor-pointer w-6 h-6 text-white"
                  onClick={handleClosePopup}
                />
              </div>
            </div>
            <div className={`flex-grow overflow-y-auto ${styles.scrollbar}`}>
              {allEntries.map((entry, index) => (
                <div key={`all-${index}`} className="mb-2 mr-3">
                  {renderLeaderBoardEntry(entry)}
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