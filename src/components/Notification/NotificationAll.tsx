import user from "@/assets/images/daos/user1.png";
import dummy from "@/assets/images/daos/user2.png";
import Image from "next/image";
import {dataNotification} from './data';
import React from "react";

function NotificationAll(){
    return (
        <> 
        
        {/* Today */}
      {dataNotification.notifications.map((dayData,dayIndex)=>(
        <>
        <div className="mt-6 mb-4 font-semibold text-lg text-[#6D6D6D] ml-2 px-2" key={dayIndex}>
          {dayData.day}
        </div>
        <div className="rounded-2xl bg-white w-full" style={{boxShadow: '0 0 18px -7px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}>
          {dayData.items.map((item, itemIndex) => (
            <>
              <div className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                <div className="flex gap-5 ">
                    <div className={`size-12 flex items-center justify-center rounded-full `} style={{ backgroundColor: item.color }}>

                  <Image src={item.image} alt=" " className=" size-8" />
                    </div>
                  <div className="flex flex-col gap-1 justify-center">
                    <h1 className="font-semibold text-sm flex gap-2 items-center">
                      {item.title}{" "} {React.createElement(item.icon, { className: "text-base", style: { color: item.iconColor } })}
                      {/* {React.createElement(item.icon, { className: "text-base", style: { color: item.iconColor } })}{" "} {item.title} */}
                    </h1>
                    <p className="font-normal text-sm text-[#717171]">
                      {item.time}
                    </p>
                  </div>
                </div>
                <div className="text-[#717171] text-xs font-normal">
                  {item.timeAgo}
                </div>              </div>
              {itemIndex < dayData.items.length - 1 && (
                <hr className="border-[#DDDDDD] border-0.5" />
              )}
            </>
          ))}
        </div>
        </>
      ))
      }

        </>
    )
}
export default NotificationAll;