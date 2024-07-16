import React from "react";
import { dataNotification } from "./data";
import NotificationTile from "./NotificationTile";

function RecordedSessions() {
  const flag1Notifications = dataNotification.notifications.flatMap((dayData) =>
    dayData.items.filter((item) => item.flag === 3)
  );

  return (
    <div
      className="rounded-2xl bg-white w-full mt-8"
      style={{
        boxShadow:
          "0 0 18px -7px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {flag1Notifications.map((item, index) => (
        <NotificationTile
          key={index}
          data={item}
          index={index}
          length={flag1Notifications.length}
        />
      ))}
    </div>
  );
}

export default RecordedSessions;
