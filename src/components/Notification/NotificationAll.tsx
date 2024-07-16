import React from "react";
import { dataNotification } from "./data";
import NotificationTile from "./NotificationTile";

function NotificationAll() {
  return (
    <>
      {dataNotification.notifications.map((dayData, dayIndex) => (
        <React.Fragment key={dayIndex}>
          <div className="mt-6 mb-4 font-semibold text-lg text-[#6D6D6D] ml-2 px-2">
            {dayData.day}
          </div>
          <div
            className="rounded-2xl bg-white w-full"
            style={{
              boxShadow:
                "0 0 18px -7px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {dayData.items.map((item, itemIndex) => (
              <NotificationTile
                key={itemIndex}
                data={item}
                index={itemIndex}
                length={dayData.items.length}
              />
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}

export default NotificationAll;
