import React from "react";
import NotificationTile from "./NotificationTile";
import { NotificationProps } from "./NotificationTypeUtils";

function Followers({ notifications }: NotificationProps) {
  return (
    <div
      className="rounded-2xl bg-white w-full mt-8"
      style={{
        boxShadow:
          "0 0 18px -7px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {notifications.map((item, index) => (
        <NotificationTile
          key={index}
          data={item}
          index={index}
          length={notifications.length}
        />
      ))}
    </div>
  );
}

export default Followers;
