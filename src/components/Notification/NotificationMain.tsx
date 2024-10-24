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
import { useNotificationStudioState } from "@/store/notificationStudioState";
import MobileResponsiveMessage from "../MobileResponsiveMessage/MobileResponsiveMessage";
import Heading from "../ComponentUtils/Heading";
import NotificationSkeletonLoader from '../SkeletonLoader/NotificationSkeletonLoader';
import { fetchApi } from "@/utils/api";

function NotificationMain() {
  const { data: session } = useSession();
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const socket = useSocket();
  const {
    notifications,
    newNotifications,
    combinedNotifications,
    canFetch,
    hasAnyUnreadNotification,
    setNotifications,
    setNewNotifications,
    addNotification,
    updateCombinedNotifications,
    markAllAsRead,
    setCanFetch,
    setHasAnyUnreadNotification,
  } = useNotificationStudioState();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Mark all as read");
  const [markAllReadCalling, setMarkAllReadCalling] = useState<boolean>(false);
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
    // Set canFetch based on address and session
    setCanFetch(!!address && !!session);
  }, [address, session, setCanFetch]);

  const fetchNotifications = useCallback(async () => {
    if (!canFetch) return;
    setIsLoading(true);
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
      if (Array.isArray(result.data)) {
        setNotifications(result.data);
        updateCombinedNotifications();
      } else {
        console.error("Fetched data is not an array:", result);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, canFetch, setNotifications, updateCombinedNotifications]);

  useEffect(() => {
    if (canFetch) {
      fetchNotifications();
    }
  }, [fetchNotifications, canFetch]);

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

  const handleMarkAllAsRead = async () => {
    if (!address || !session) return;

    const hasUnreadNotifications = combinedNotifications.some(
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
      if (address) {
        myHeaders.append("x-wallet-address", address);
      }

      const raw = JSON.stringify({
        markAll: true,
        receiver_address: address,
      });

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      const response = await fetchApi(
        "/notifications/mark-as-read",
        requestOptions
      );
      if (response.ok) {
        markAllAsRead();
        updateCombinedNotifications();
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
      return <NotificationSkeletonLoader />;
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
      recordedSessions: RecordedSessions,
      followers: Followers,
      attestations: Attestation,
    };
    const Component =
      components[activeTab as keyof typeof components] || NotificationAll;
    return <Component notifications={filteredNotifications} />;
  };

  return (
<>
{/* For Mobile Screen */}
<MobileResponsiveMessage/>

{/* For Desktop Screen  */}
    <div className="hidden md:block font-poppins mb-12">
        <div className="pt-2 xs:pt-4 sm:pt-6 px-4 md:px-6 lg:px-14">
          <Heading/>
        </div>
      <div className="flex bg-[#D9D9D945]">
        <div className="flex gap-12 pl-16">
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "all"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=all")}
          >
            All
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "sessionBookings"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=sessionBookings")}
          >
            Meetings
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "recordedSessions"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            // onClick={() => router.push(path + "?active=recordedSessions")}
            onClick={() => toast("Coming Soon 🚀")}
          >
            Recorded Sessions
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "followers"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            // onClick={() => router.push(path + "?active=followers")}
            onClick={() => toast("Coming Soon 🚀")}
          >
            Followers
          </button>
          <button
            className={`py-4 px-2 outline-none ${
              searchParams.get("active") === "attestations"
                ? "text-blue-shade-200 font-semibold border-b-2 border-blue-shade-200"
                : "border-transparent"
            }`}
            onClick={() => router.push(path + "?active=attestations")}
          >
            Attestations
          </button>
        </div>
        <div className="ml-auto pe-16">
          <button
            className="my-4 py-2 px-4 border w-52 border-blue-shade-100 text-blue-shade-100 rounded-xl flex items-center shadow-md hover:bg-blue-shade-100 hover:text-white transition duration-300 ease-in-out font-bold"
            onClick={handleMarkAllAsRead}
            disabled={markAllReadCalling}
          >
            <PiEnvelopeOpen className="h-5 w-5 mr-2" />
            {buttonText}
          </button>
        </div>
      </div>
      <div className="flex flex-col pt-7 pl-10 pr-16">{renderContent()}</div>
    </div>
    </>
  );
}

export default NotificationMain;
