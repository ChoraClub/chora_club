import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Badge } from "@nextui-org/react";
import dummy from "@/assets/images/daos/user2.png";
import { useRouter } from "next-nprogress-bar";
import { useSocket } from "@/app/hooks/useSocket";
import { useAccount } from "wagmi";
import { Notification } from "./NotificationTypeUtils";
import toast from "react-hot-toast";
import { FaClock } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { PiVideoFill } from "react-icons/pi";
import { FaUserCheck } from "react-icons/fa6";
import { GiChaingun } from "react-icons/gi";
import { formatTimestampOrDate } from "@/utils/FormatTimestampUtils";
import styles from "./NotificationIconComponent.module.css";
import { getBackgroundColor, getIcon } from "./NotificationActions";

function NotificationIconComponent() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socket = useSocket();
  const { address } = useAccount();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300); // 300ms delay before hiding
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        address: address,
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch("/api/notifications", requestOptions);
      const result = await response.json();
      console.log("result", result);
      if (result.success && result.data) {
        const notificationsData = result.data.map((notification: any) => ({
          _id: notification?._id,
          receiver_address: notification.receiver_address,
          content: notification.content,
          createdAt: notification.createdAt,
          read_status: notification.read_status,
          notification_name: notification.notification_name,
          notification_type: notification.notification_type,
          notification_title: notification.notification_title,
        }));
        setNotifications(notificationsData);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [address]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 3000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (socket) {
      // Capture the socket ID when the socket connects
      socket.on("connect", () => {
        setSocketId(socket.id);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        setSocketId(null);
      });
    }
  }, [socket]);

  useEffect(() => {
    const hostAddress = address;
    if (socket && address && socketId) {
      socket.emit("register_host", { hostAddress, socketId });

      socket.on("new_notification", (message: Notification) => {
        const notificationData: Notification = {
          receiver_address: message.receiver_address,
          content: message.content,
          createdAt: message.createdAt,
          read_status: false,
          notification_name: message.notification_name,
          notification_type: message.notification_type,
          notification_title: message.notification_title,
        };
        setNewNotifications((prevNotifications: any) => [
          ...prevNotifications,
          notificationData,
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
      }
    };
  }, [socket, address, socketId]);

  useEffect(() => {
    const hostAddress = address;
    if (socket && address && socketId) {
      socket.emit("register_host", { hostAddress, socketId });

      socket.on("new_notification", (message: Notification) => {
        const notificationData: Notification = {
          _id: message?._id,
          receiver_address: message.receiver_address,
          content: message.content,
          createdAt: Date.now(),
          read_status: false,
          notification_name: message.notification_name,
          notification_type: message.notification_type,
          notification_title: message.notification_title,
        };
        setNewNotifications((prevNotifications: any) => [
          ...prevNotifications,
          notificationData,
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
      }
    };
  }, [socket, address, socketId]);

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read_status
  );

  // const combinedNotifications = [...notifications, ...newNotifications].sort(
  //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  // );
  const combinedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <div
        className=""
        ref={hoverRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Badge
          isInvisible={!hasUnreadNotifications}
          content={""}
          color="danger"
          shape="circle"
          // placement="top-right"
          className={hasUnreadNotifications ? styles.pulseBadge : ""}
        >
          <div
            className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 bg-white rounded-full flex justify-center items-center w-10 h-10`}
            onClick={() => router.push(`/notifications?active=all`)}
          >
            <IoMdNotifications className="size-6 text-blue-shade-200" />
          </div>
        </Badge>

        {isHovering && (
          <div
            className="absolute left-20 bottom-4 xl:left-24 bg-white rounded-2xl shadow-lg border border-[#C3D3FF] w-96 font-poppins z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {combinedNotifications.length > 0 ? (
              combinedNotifications.slice(0, 3).map((data, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center p-4 justify-between">
                    <div className="flex gap-3">
                      <span
                        className="flex items-center justify-center rounded-full h-10 w-10 min-w-10"
                        style={{
                          backgroundColor: getBackgroundColor(data),
                        }}
                      >
                        {getIcon(data)}
                      </span>
                      <div>
                        <p className="text-xs font-semibold cursor-default mb-1 line-clamp-1">
                          {data.notification_title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {data.content}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 min-w-12 flex items-center justify-center">
                      {formatTimestampOrDate(data.createdAt)}
                    </div>
                  </div>
                  {/* {index < combinedNotifications.slice(0, 3).length - 1 && ( */}
                  <hr className="border-[#DDDDDD] border-0.5" />
                  {/* )} */}
                </React.Fragment>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 text-xs">
                  No new notifications at the moment.
                </p>
              </div>
            )}
            <div className="flex justify-center p-4">
              <button
                className="text-xs text-blue-shade-100 hover:text-blue-shade-200"
                onClick={() => router.push(`/notifications?active=all`)}
              >
                View All Notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NotificationIconComponent;
