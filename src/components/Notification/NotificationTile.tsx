import React, { useEffect, useState } from "react";
import { NotificationTileProps } from "./NotificationTypeUtils";
import { useRouter } from "next-nprogress-bar";
import { formatTimestampOrDate } from "@/utils/NotificationUtils";
import {
  getBackgroundColor,
  getIcon,
  handleRedirection,
  markAsRead,
} from "./NotificationActions";
import { useNotificationStudioState } from "@/store/notificationStudioState";
import { BiLinkExternal } from "react-icons/bi";

function NotificationTile({ data, index, length }: NotificationTileProps) {
  const router = useRouter();
  const [readStatus, setReadStatus] = useState<boolean>(data.read_status);
  const [tileData, setTileData] = useState(data);
  const [docId, setDocId] = useState(data?._id);
  const { combinedNotifications } = useNotificationStudioState();

  useEffect(() => {
    setTileData(data);
    setReadStatus(data.read_status);
    setDocId(data?._id);
  }, [data, readStatus, docId]);

  const currentData =
    combinedNotifications.find((n) => n._id === data._id) || data;

  const handleTileRedirection = async () => {
    await handleRedirection(currentData, router, markAsRead);
  };

  // const handleTileRedirection = async () => {
  //   await handleRedirection(tileData, router, markAsRead);
  // };

  const renderTitleContent = () => {
    if (
      tileData.notification_type === "attestation" &&
      tileData.notification_name === "offchain"
    ) {
      return (
        <BiLinkExternal
          size={18}
          className="text-black hover:text-blue-600 transition-colors duration-200"
          onClick={() => console.log(tileData)}
        />
      );
    }

    return <></>;
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
              {renderTitleContent()}
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
