import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Badge } from "@nextui-org/react";
import dummy from "@/assets/images/daos/user2.png";
import { useRouter } from "next-nprogress-bar";
import { useSocket } from "@/app/hooks/useSocket";
import { useAccount } from "wagmi";

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
          content: notification.content,
          createdAt: notification.createdAt,
          read: notification.read_status,
          title: notification.notification_name,
          type: notification.notification_type,
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

    const interval = setInterval(fetchNotifications, 5000);

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

  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read
  );

  return (
    <>
      <div
        className="relative"
        ref={hoverRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Badge
          isInvisible={!hasUnreadNotifications}
          content={""}
          color="danger"
          shape="circle"
          placement="top-right"
        >
          <div
            className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 bg-white rounded-full flex justify-center items-center w-10 h-10`}
            onClick={() => router.push(`/notifications?active=all`)}
          >
            <IoMdNotifications className="size-6 text-blue-shade-200" />
          </div>
        </Badge>

        {/* {isHovering && (
          <div
            className="absolute left-16 -top-14 xl:left-20  bg-white rounded-2xl shadow-lg border border-[#C3D3FF] w-96 font-poppins z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {Array.from({ length: 3 }).map((_, index, array) => (
              <>
                <div className="flex items-center p-4 justify-between">
                  <div className="flex ">
                    <Image src={dummy} alt="" className="size-8 mr-3" />
                    <div>
                      <p className="text-xs font-semibold hover:text-blue-shade-100 cursor-pointer mb-1">
                        chain-1.eth booked your session
                      </p>
                      <p className="text-xs text-gray-500">
                        on November 2, 2024 at 5:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                {index < array.length - 1 && (
                  <hr className="border-[#DDDDDD] border-0.5" />
                )}
              </>
            ))}
          </div>
        )} */}
      </div>
    </>
  );
}

export default NotificationIconComponent;
