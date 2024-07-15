import React from 'react';
import Image from "next/image";
import { dataNotification } from './data';
function Attestations(){
    const flag1Notifications = dataNotification.notifications.flatMap(dayData => 
        dayData.items.filter(item => item.flag === 5)
      );
    return (
        <>
        <div className="rounded-2xl bg-white w-full mt-8" style={{boxShadow: '0 0 18px -7px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}>
        {flag1Notifications.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
              <div className="flex gap-5 ">
                <div className={`size-12 flex items-center justify-center rounded-full`} style={{ backgroundColor: item.color }}>
                  <Image src={item.image} alt="" className="size-8" />
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <h1 className="font-semibold text-sm flex gap-2 items-center">
                    {item.title}{" "}
                    {React.createElement(item.icon, { className: "text-base", style: { color: item.iconColor } })}
                  </h1>
                  <p className="font-normal text-sm text-[#717171]">
                    {item.time}
                  </p>
                </div>
              </div>
              <div className="text-[#717171] text-xs font-normal">
                {item.timeAgo}
              </div>
            </div>
            {index < flag1Notifications.length - 1 && (
              <hr className="border-[#DDDDDD] border-0.5" />
            )}
          </React.Fragment>
        ))}
      </div>
        </>
    )
}
export default Attestations;