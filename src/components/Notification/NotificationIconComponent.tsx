import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { Badge, Spinner } from "@nextui-org/react";
import { useRouter } from "next-nprogress-bar";
import { useSocket } from "@/app/hooks/useSocket";
import { useAccount } from "wagmi";
import { Notification } from "./NotificationTypeUtils";
import { formatTimestampOrDate } from "@/utils/NotificationUtils";
import styles from "./NotificationIconComponent.module.css";
import style from "@/components/MainSidebar/sidebar.module.css";
import {
  getBackgroundColor,
  getIcon,
  handleRedirection,
  markAsRead,
} from "./NotificationActions";
import { useNotificationStudioState } from "@/store/notificationStudioState";
import { useSession } from "next-auth/react";
import { fetchApi } from "@/utils/api";

function NotificationIconComponent() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const hoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socket = useSocket();
  const { address } = useAccount();
  const [socketId, setSocketId] = useState<string | null>(null);
  const [isAPILoading, setIsAPILoading] = useState<boolean>();
  const { data: session } = useSession();
  const {
    notifications,
    newNotifications,
    canFetch,
    combinedNotifications,
    addNotification,
    setNotifications,
    setHasAnyUnreadNotification,
    hasAnyUnreadNotification,
    updateCombinedNotifications,
    setCanFetch,
  } = useNotificationStudioState();

  const lastFetchTime = useRef<number>(0);
  const cacheDuration = 60000; // 1 minute cache

  useEffect(() => {
    setCanFetch(!!address && !!session);
  }, [address, session, setCanFetch]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, 300);
  }, []);

  const fetchNotificationsIfNeeded = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchTime.current > cacheDuration) {
      setIsAPILoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        if (address) {
          myHeaders.append("x-wallet-address", address);
        }

        const raw = JSON.stringify({ address });

        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: raw,
        };
        const response = await fetchApi("/notifications", requestOptions);
        const result = await response.json();
        if (result.success && result?.data) {
          const notificationsData = result.data.map((notification: any) => ({
            _id: notification._id,
            receiver_address: notification.receiver_address,
            content: notification.content,
            createdAt: notification.createdAt,
            read_status: notification.read_status,
            notification_name: notification.notification_name,
            notification_type: notification.notification_type,
            notification_title: notification.notification_title,
          }));

          const sortedNotifications = await notificationsData.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setNotifications(sortedNotifications);
          updateCombinedNotifications();
          setHasAnyUnreadNotification(
            notificationsData.some((n: any) => !n.read_status)
          );
          lastFetchTime.current = now;
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsAPILoading(false);
      }
    }
  }, [address, setNotifications, setHasAnyUnreadNotification]);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovering(true);
    fetchNotificationsIfNeeded();
  }, [fetchNotificationsIfNeeded]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => setSocketId(socket.id));
      socket.on("disconnect", () => setSocketId(null));

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && address && socketId) {
      socket.emit("register_host", { hostAddress: address, socketId });

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
          additionalData: message?.additionalData,
        };
        addNotification(notificationData);
        updateCombinedNotifications();
      });
    }

    return () => {
      if (socket) {
        socket.off("new_notification");
      }
    };
  }, [
    socket,
    address,
    socketId,
    addNotification,
    hasAnyUnreadNotification,
    updateCombinedNotifications,
  ]);

  const handleMarkAndRedirection = async ({ data }: { data: Notification }) => {
    await handleRedirection(data, router, markAsRead);
    updateCombinedNotifications();

    setNotifications((prev: Notification[]) =>
      prev.map((n: Notification) =>
        n._id === data._id ? { ...n, read_status: true } : n
      )
    );

    setHasAnyUnreadNotification(
      combinedNotifications.some((n: Notification) => !n.read_status)
    );
  };

  const renderContent = () => {
    if (isAPILoading) {
      return (
        <div className="flex justify-center items-center p-4">
          <Spinner color="primary" />
        </div>
      );
    }

    if (!canFetch) {
      return (
        <div className="flex justify-center items-center p-4">
          <p className="text-sm text-gray-500">
            Please connect your wallet and sign in to view notifications.
          </p>
        </div>
      );
    }

    if (combinedNotifications.length > 0) {
      return combinedNotifications.slice(0, 3).map((data, index) => (
        <React.Fragment key={data._id || index}>
          <div
            className={`flex items-center p-4 justify-between cursor-pointer ${
              data.read_status
                ? "bg-white text-gray-500"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleMarkAndRedirection({ data })}
          >
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
                <p
                  className={`text-xs font-semibold mb-1 line-clamp-1 ${
                    data.read_status ? "text-gray-500" : "text-black"
                  }`}
                >
                  {data.notification_title}
                </p>
                <p
                  className={`text-xs line-clamp-2 ${
                    data.read_status ? "text-gray-500" : "text-[#414141]"
                  }`}
                >
                  {data.content}
                </p>
              </div>
            </div>
            <div
              className={`text-xs min-w-12 font-semibold flex items-center justify-center ${
                data.read_status ? "text-gray-500 font-normal" : "text-black"
              }`}
            >
              {formatTimestampOrDate(data.createdAt)}
            </div>
          </div>
          {index < 2 && <hr className="border-[#DDDDDD] border-0.5" />}
        </React.Fragment>
      ));
    }

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 text-xs">
          No new notifications at the moment.
        </p>
      </div>
    );
  };

  return (
    <div
      ref={hoverRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Badge
        isInvisible={!hasAnyUnreadNotification}
        content={""}
        color="danger"
        shape="circle"
        className={hasAnyUnreadNotification ? styles.pulseBadge : ""}
      >
        <div
          className={`cursor-pointer xl:w-11 xl:h-11 2xl:w-12 2xl:h-12 2.5xl:w-14 2.5xl:h-14 bg-white rounded-full flex justify-center items-center w-10 h-10 ${style.icon3d} ${style.whiteBg}`}
          onClick={() => router.push(`/notifications?active=all`)}
        >
          <IoMdNotifications className="size-6 text-blue-shade-200" />
        </div>
      </Badge>

      {isHovering && (
        <div
          className="absolute left-20 bottom-4 xl:left-24 bg-white rounded-2xl shadow-lg border border-[#C3D3FF] w-96 font-poppins z-50 h-[19rem]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-full flex justify-between flex-col">
            <div className="rounded-t-2xl overflow-hidden">
              {renderContent()}
            </div>
            <div className="">
              <hr className="border-[#DDDDDD] border-0.5" />
              <div className="flex justify-center p-4">
                <button
                  className="text-xs text-blue-shade-100 hover:text-blue-shade-200"
                  onClick={() => router.push(`/notifications?active=all`)}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationIconComponent;
