import React, { useEffect, useState } from "react";
import Image from "next/image";
import user1 from "../../assets/images/notifications/user1.svg";
import { NotificationTileProps } from "./NotificationTypeUtils";

function NotificationTile({ data, index, length }: NotificationTileProps) {
  const [readStatus, setReadStatus] = useState<boolean>();
  useEffect(() => {
    console.log("data::", data);
    console.log("read status", data.read_status);
    setReadStatus(data.read_status);
  }, [data, readStatus]);
  return (
    <>
      <div
        className={`flex justify-between items-center rounded-md p-5 cursor-pointer hover:bg-gray-50 bg-gray-200 
            ${readStatus === true ? `bg-white` : ``}`}
      >
        <div className="flex gap-5">
          <div className="flex items-center justify-center rounded-full bg-[#FFD3DE] h-14 w-14">
            <Image src={user1} alt="" className="object-cover" />
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <h1 className="font-semibold text-sm flex gap-2 items-center">
              {data.notification_title}
            </h1>
            <p className="font-normal text-sm text-[#717171]">{data.content}</p>
          </div>
        </div>
        <div
          className={`text-[#3e3e3e] text-xs font-normal ${
            readStatus === true ? `text-[#717171]` : `text-[#000000] font-bold`
          }`}
        >
          {new Date(data.createdAt).toLocaleString()}
        </div>
      </div>
      {index < length - 1 && <hr className="border-[#DDDDDD] border-0.5" />}
    </>
  );
}

export default NotificationTile;
