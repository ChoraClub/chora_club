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
import {
  DynamicAttendeeInterface,
  SessionInterface,
} from "@/types/MeetingTypes";
import { fetchEnsNameAndAvatar } from "@/utils/ENSUtils";

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
      const fetchEnsDetails = async () => {
        const top = await Promise.all(
          leaderBoardData.TopTen?.slice(0, 3).map(
            async (holder: any, index: number) => {
              const ensDetails = await fetchEnsNameAndAvatar(holder.user);
              return {
                smallEmoji: [emoji1, emoji2, emoji3][index],
                text: `Top #${index + 1}`,
                img: ensDetails?.avatar || [user1, user2, user3][index],
                name:
                  ensDetails?.ensName ||
                  `${holder.user.slice(0, 6)}...${holder.user.slice(-4)}`,
                color: ["#4773F0", "#A573E5", "#1FA1FF"][index],
                bgColor: ["#EAECFF", "#F2E8FF", "#EAF1FF"][index],
                balance: holder.balance,
              };
            }
          ) || []
        );

        setTopEntries(top);

        const special = await Promise.all([
          leaderBoardData.firstCollector &&
            fetchEnsNameAndAvatar(leaderBoardData.firstCollector.user),
          leaderBoardData.latestCollector &&
            fetchEnsNameAndAvatar(leaderBoardData.latestCollector.user),
        ]);

        const specialEntries = [
          leaderBoardData.firstCollector && {
            smallEmoji: emoji4,
            text: "First Collector",
            img: special[0]?.avatar || user4,
            name:
              special[0]?.ensName ||
              `${leaderBoardData.firstCollector.user.slice(
                0,
                6
              )}...${leaderBoardData.firstCollector.user.slice(-4)}`,
            color: "#FF8A00",
            bgColor: "#FFF4EA",
            balance: leaderBoardData.firstCollector.balance,
          },
          leaderBoardData.latestCollector && {
            smallEmoji: emoji5,
            text: "Latest Collector",
            img: special[1]?.avatar || user5,
            name:
              special[1]?.ensName ||
              `${leaderBoardData.latestCollector.user.slice(
                0,
                6
              )}...${leaderBoardData.latestCollector.user.slice(-4)}`,
            color: "#FF8A00",
            bgColor: "#FFF4EA",
            balance: leaderBoardData.latestCollector.balance,
          },
        ].filter(Boolean);

        setSpecialEntries(specialEntries);

        // Prepare all entries for the popup
        const all = await Promise.all(
          leaderBoardData.TopTen?.map(async (holder: any, index: number) => {
            const ensDetails = await fetchEnsNameAndAvatar(holder.user);
            return {
              smallEmoji: [emoji1, emoji2, emoji3, emoji4, emoji5][index % 5],
              text: index < 3 ? `Top #${index + 1}` : `#${index + 1}`,
              img:
                ensDetails?.avatar ||
                [user1, user2, user3, user4, user5][index % 5],
              name:
                ensDetails?.ensName ||
                `${holder.user.slice(0, 6)}...${holder.user.slice(-4)}`,
              color: ["#4773F0", "#A573E5", "#1FA1FF", "#FF8A00", "#FF8A00"][
                index % 5
              ],
              bgColor: ["#EAECFF", "#F2E8FF", "#EAF1FF", "#FFF4EA", "#FFF4EA"][
                index % 5
              ],
              balance: holder.balance,
            };
          }) || []
        );

        setAllEntries([...all, ...specialEntries]);
      };

      fetchEnsDetails();
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
    <div className="grid grid-cols-12 py-2 sm:py-3 bg-black-shade-300 rounded-xl items-center w-full px-2 sm:px-4">
      <div className="flex items-center col-span-5 sm:col-span-4 lg:col-span-5">
        <Image
          src={entry.smallEmoji}
          alt=""
          width={26}
          height={26}
          className="w-4 h-4 sm:w-6 sm:h-6 sm:mr-2 mr-1"
        />
        <div
          className={`font-medium sm:text-sm text-xs truncate`}
          style={{ color: entry.color }}
        >
          {entry.text}
        </div>
      </div>
      <div className="flex items-center col-span-4 sm:col-span-5 lg:col-span-4">
        <Image
          src={entry.img}
          alt=""
          width={39}
          height={39}
          className="w-6 h-6 sm:w-8 sm:h-8 sm:mr-2 mr-1"
        />
        <p className="font-normal sm:text-sm text-xs truncate">{entry.name}</p>
      </div>
      <div
        className={` col-span-3 sm:col-span-3 lg:col-span-3 flex justify-end sm:justify-center`}
        style={{
          borderColor: entry.color,
          color: entry.color,
        }}
      >
        <div className="border rounded-lg text-xs sm:text-sm py-1 px-2 sm:px-4" style={{backgroundColor: entry.bgColor,}}>
          {entry.balance}x
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="font-poppins  w-full">
        <div className="flex justify-between items-center mb-3 sm:mb-5 px-2 sm:px-4">
          <div className="flex">
          <p className="text-sm sm:text-base lg:text-lg font-medium text-blue-shade-100">
            🏆LeaderBoard
          </p>
          </div>
          {topEntries.length === 0 && specialEntries.length === 0 ? (
            <></>
          ) : (
            <button
            className="text-[10px] sm:text-xs text-blue-shade-100 bg-blue-shade-700 rounded py-1 px-2 border border-blue-shade-100 hover:bg-blue-shade-600 transition-colors"
            onClick={handleViewAll}
          >
            View All
          </button>
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

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 backdrop-blur-md"
            onClick={handleClosePopup}
          />
          <div className="relative bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] xl:max-w-[35vw] h-[80vh] flex flex-col">
            {/* Popup Header */}
            <div className="flex justify-between items-center p-4 sm:p-6">
              <p className="text-base sm:text-lg font-medium text-blue-shade-100">
                🏆LeaderBoard
              </p>
              <button
                className="bg-black rounded-full p-1 flex items-center justify-center"
                onClick={handleClosePopup}
              >
                <IoClose className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {/* Popup Content */}
            <div className="flex-grow overflow-y-auto p-2 sm:p-4">
              <div className="space-y-2">
                {allEntries.map((entry, index) => (
                  <div key={`all-${index}`}>
                    {renderLeaderBoardEntry(entry)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WatchLeaderBoard;
