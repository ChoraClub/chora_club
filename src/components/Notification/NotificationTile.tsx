import React from "react";
import Image from "next/image";

interface NotificationTileProps {
  data: {
    image: string;
    title: string;
    time: string;
    timeAgo: string;
    icon: React.ElementType;
    color: string;
    iconColor: string;
  };
  index: number;
  length: number;
}

const NotificationTile: React.FC<NotificationTileProps> = ({
  data,
  index,
  length,
}) => {
  return (
    <>
      <div className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
        <div className="flex gap-5">
          <div
            className={`size-12 flex items-center justify-center rounded-full`}
            style={{ backgroundColor: data.color }}
          >
            <Image src={data.image} alt="" className="size-8" />
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <h1 className="font-semibold text-sm flex gap-2 items-center">
              {data.title}{" "}
              {React.createElement(data.icon, {
                className: "text-base",
                style: { color: data.iconColor },
              })}
            </h1>
            <p className="font-normal text-sm text-[#717171]">{data.time}</p>
          </div>
        </div>
        <div className="text-[#717171] text-xs font-normal">{data.timeAgo}</div>
      </div>
      {index < length - 1 && <hr className="border-[#DDDDDD] border-0.5" />}
    </>
  );
};

export default NotificationTile;
