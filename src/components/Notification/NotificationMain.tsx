"use client";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import NotificationAll from "./NotificationAll";
import SessionBookings from "./SessionBookings";
import RecordedSessions from "./RecordedSessions";
import Followers from "./Followers";
import Attestation from "./Attestation";
import ConnectWalletWithENS from "../ConnectWallet/ConnectWalletWithENS";
import { Notification } from "./NotificationTypeUtils";
import { useAccount } from "wagmi";
import { useSocket } from "@/app/hooks/useSocket";
import { PiEnvelopeOpen } from "react-icons/pi";
import { useSession } from "next-auth/react";
import { MagnifyingGlass } from "react-loader-spinner";
import { Session } from "next-auth";
import toast from "react-hot-toast";

// Custom hook for notifications
const useNotifications = ({
  address,
  session,
}: {
  address: string | undefined;
  session: Session | null;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({ address });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch("/api/notifications", requestOptions);
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setNotifications(result.data);
      } else {
        console.error("Fetched data is not an array:", result);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, session]);

  const canFetch = !!address && !!session;

  useEffect(() => {
    if (canFetch) {
      fetchNotifications();
    }
  }, [fetchNotifications, canFetch]);

  return {
    notifications,
    setNotifications,
    isLoading,
    fetchNotifications,
    canFetch,
  };
};

function NotificationMain() {
  const { data: session } = useSession();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const socket = useSocket();
  const {
    notifications,
    setNotifications,
    isLoading,
    fetchNotifications,
    canFetch,
  } = useNotifications({ address, session });
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Mark all as read");
  const [markAllReadCalling, setMarkAllReadCalling] = useState<boolean>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsPageLoading(false);
  }, [isPageLoading]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setSocketId(socket.id);
      });

      socket.on("disconnect", () => {
        setSocketId(null);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket && session && socketId && address) {
      const handleNewNotification = (message: Notification) => {
        const notificationData: Notification = {
          ...message,
          createdAt: Date.now(),
          read_status: false,
        };
        setNewNotifications((prev) => [...prev, notificationData]);
      };

      socket.on("connect", () => {
        socket.emit("register_host", {
          hostAddress: address,
          socketId: socket.id,
        });
      });

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    }
  }, [socket, address, socketId]);

  const combinedNotifications = React.useMemo(
    () =>
      [...notifications, ...newNotifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notifications, newNotifications]
  );

  const filteredNotifications = React.useMemo(() => {
    const type = searchParams.get("active");
    if (type === "all" || !type) return combinedNotifications;
    const typeMap = {
      sessionBookings: "newBooking",
      recordedSessions: "recordedSession",
      followers: "newFollower",
      attestations: "attestation",
    };
    return combinedNotifications.filter(
      (item) => item.notification_type === typeMap[type as keyof typeof typeMap]
    );
  }, [combinedNotifications, searchParams]);

  const markAllAsRead = async () => {
    if (!address || !session) return;

    const hasUnreadNotifications = [...notifications, ...newNotifications].some(
      (notification) => notification.read_status === false
    );

    if (!hasUnreadNotifications) {
      toast("No unread notifications");
      return;
    }

    setButtonText("Marking...");
    setMarkAllReadCalling(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        markAll: true,
        receiver_address: address,
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetch(
        "/api/notifications/mark-as-read",
        requestOptions
      );
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_status: true }))
        );
        setNewNotifications((prev) =>
          prev.map((n) => ({ ...n, read_status: true }))
        );
        setButtonText("Marked!");
        setTimeout(() => setButtonText("Mark all as read"), 2000);
        toast.success("All notifications marked as read");
      } else {
        console.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Error marking all as read");
    } finally {
      setMarkAllReadCalling(false);
    }
  };

  const handleTabClick = (tab: string) => {
    if (
      tab === "recordedSessions" ||
      tab === "followers" ||
      tab === "attestations"
    ) {
      toast("Coming Soon 🚀");
    } else {
      router.push(`${path}?active=${tab}`);
    }
  };

  const renderContent = () => {
    if (isPageLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      );
    }

    if (!canFetch) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">
            Please connect your wallet and sign in to view notifications.
          </p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <MagnifyingGlass
            color={"#123abc"}
            visible={isLoading}
            height="80"
            width="80"
          />
        </div>
      );
    }

    const activeTab = searchParams.get("active") || "all";

    if (filteredNotifications.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">No new notifications.</p>
        </div>
      );
    }

    const components = {
      all: NotificationAll,
      sessionBookings: SessionBookings,
      // recordedSessions: RecordedSessions,
      // followers: Followers,
      // attestations: Attestation,
    };
    const Component =
      components[activeTab as keyof typeof components] || NotificationAll;
    return <Component notifications={filteredNotifications} />;
  };

  return (
    <div className="font-poppins mb-12">
      <div className="flex items-center justify-between 1.7xl:pe-10 lg:pe-3 pe-2">
        <div className="font-semibold text-4xl text-blue-shade-100 pb-8 pt-9 px-16">
          Notifications
        </div>
        <ConnectWalletWithENS />
      </div>
      <div className="flex bg-[#D9D9D945]">
        <div className="flex gap-12 pl-16">
          {[
            "all",
            "sessionBookings",
            "recordedSessions",
            "followers",
            "attestations",
          ].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-2 outline-none ${
                searchParams.get("active") === tab
                  ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                  : "border-transparent"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() +
                tab
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
            </button>
          ))}
        </div>
        <div className="ml-auto pe-16">
          <button
            className="my-4 py-2 px-4 border w-52 border-blue-shade-100 text-blue-shade-100 rounded-xl flex items-center shadow-md hover:bg-blue-shade-100 hover:text-white transition duration-300 ease-in-out font-bold"
            onClick={markAllAsRead}
            disabled={markAllReadCalling}
          >
            <PiEnvelopeOpen className="mr-2" size={20} />
            {buttonText}
          </button>
        </div>
      </div>
      <div className="px-16">{renderContent()}</div>
    </div>
  );
}

export default NotificationMain;
