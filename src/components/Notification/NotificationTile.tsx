import React, { useEffect, useState } from "react";
import Image from "next/image";
import user1 from "../../assets/images/notifications/user1.svg";
import { NotificationTileProps } from "./NotificationTypeUtils";
import { BASE_URL } from "@/config/constants";
import { useRouter } from "next-nprogress-bar";
import { FaClock } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { PiVideoFill } from "react-icons/pi";
import { FaUserCheck } from "react-icons/fa6";
import { GiChaingun } from "react-icons/gi";
import { formatTimestampOrDate } from "@/utils/NotificationUtils";
import {
  getBackgroundColor,
  getIcon,
  handleRedirection,
  markAsRead,
} from "./NotificationActions";

function NotificationTile({ data, index, length }: NotificationTileProps) {
  const router = useRouter();
  const [readStatus, setReadStatus] = useState<boolean>(data.read_status);
  const [tileData, setTileData] = useState(data);
  const [docId, setDocId] = useState(data?._id);

  useEffect(() => {
    setTileData(data);
    setReadStatus(data.read_status);
    setDocId(data?._id);
  }, [data, readStatus, docId]);

  const handleTileRedirection = async () => {
    await handleRedirection(tileData, router, markAsRead);
  };
  return (
    <>
      <div
        className={`flex justify-between items-center rounded-md p-5 cursor-pointer hover:scale-[100.3%]
          hover:shadow-md
          bg-gray-200 text-black ${readStatus ? "bg-white text-gray-500" : ""}`}
        onClick={handleTileRedirection}
      >
        <div className="flex gap-5">
          <div
            className="flex items-center justify-center rounded-full h-14 w-14 min-w-14"
            style={{ backgroundColor: getBackgroundColor(tileData) }}
          >
            {getIcon(tileData)}
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <h1
              className={`font-semibold text-sm flex gap-2 items-center text-black ${
                readStatus ? "text-gray-500" : ""
              }`}
            >
              {data.notification_title}
            </h1>
            <p
              className={`font-normal text-sm text-[#414141] ${
                readStatus ? "text-gray-500" : ""
              }`}
            >
              {data.content}
            </p>
          </div>
        </div>
        <div
          className={`text-xs text-black font-semibold min-w-24 flex items-center justify-center ${
            readStatus ? "text-gray-500 font-normal" : ""
          }`}
        >
          {formatTimestampOrDate(data.createdAt)}
        </div>
      </div>
      {index < length - 1 && (
        <hr className="border-[#DDDDDD] border-0.5 mx-2" />
      )}
    </>
  );
}

export default NotificationTile;
